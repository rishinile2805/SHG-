import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { query, execute, transaction, TransactionClient } from '../database/db';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth';

const router = Router();

interface OrderItemInput {
  productId: string;
  selectedWeight: string;
  quantity: number;
}

// POST /api/orders
// Recalculates prices, validates stock, executes database transaction
router.post('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      address,
      items,
      couponCode,
      paymentMethod,
      notes
    } = req.body;

    // 1. Input Validation
    if (!customerName || !customerPhone || !address || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Customer name, phone, address, and items are required.' });
      return;
    }

    if (!address.street || !address.city || !address.pincode) {
      res.status(400).json({ error: 'Street address, city, and pincode are required.' });
      return;
    }

    // 2. Process within transaction to prevent overselling
    const result = await transaction(async (trx: TransactionClient) => {
      let subtotal = 0;
      const verifiedItems: any[] = [];

      for (const item of items) {
        const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
        const prodRows = await trx.query('SELECT * FROM products WHERE id = ?', [item.productId]);

        if (prodRows.length === 0) {
          throw new Error(`Product "${item.productId}" no longer exists in catalog.`);
        }

        const product = prodRows[0];

        // Stock check
        if (product.stock < qty) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${qty}.`);
        }

        // Determine price by weight
        let unitPrice = Number(product.price);
        let weightOptions = [];
        try {
          weightOptions = typeof product.weight_options === 'string' ? JSON.parse(product.weight_options) : product.weight_options;
        } catch (e) {
          weightOptions = [];
        }

        const targetWeight = item.selectedWeight || product.weight;
        const matchingWeight = Array.isArray(weightOptions) ? weightOptions.find((w: any) => w.weight === targetWeight) : null;
        if (matchingWeight && matchingWeight.price) {
          unitPrice = Number(matchingWeight.price);
        }

        const itemTotal = unitPrice * qty;
        subtotal += itemTotal;

        verifiedItems.push({
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          weight: targetWeight,
          price: unitPrice,
          quantity: qty,
          stock: product.stock
        });
      }

      // 3. Discount calculation
      let discountAmount = 0;
      if (couponCode && typeof couponCode === 'string') {
        const offerRows = await trx.query('SELECT * FROM offers WHERE code = ? AND is_active = 1', [couponCode.trim().toUpperCase()]);
        if (offerRows.length > 0) {
          const offer = offerRows[0];
          const minVal = Number(offer.min_order_value || 0);
          if (subtotal >= minVal) {
            discountAmount = Math.round((subtotal * Number(offer.discount_percent)) / 100);
          }
        }
      }

      // 4. Delivery Charge calculation (Free above Rs 500, else Rs 40)
      const deliveryCharge = subtotal >= 500 ? 0 : 40;
      const total = Math.max(0, subtotal + deliveryCharge - discountAmount);

      // 5. Generate Order Number & Secure Tracking Hash
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const orderId = `JGU-${randomPart}`;
      const trackingHash = crypto.randomBytes(16).toString('hex');

      // 6. Deduct Stock for all products
      for (const vItem of verifiedItems) {
        await trx.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [vItem.quantity, vItem.productId]);
      }

      // 7. Insert into Orders Table
      const paymentStatus = paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid';
      const initialStatus = 'Pending';
      const estimatedDelivery = '3 to 5 business days';

      await trx.execute(
        `INSERT INTO orders (
          id, user_id, customer_name, customer_phone, customer_email, street, landmark,
          city, district, state, pincode, subtotal, delivery_charge, discount, total,
          payment_method, payment_status, status, estimated_delivery, notes, tracking_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          req.user?.id || null,
          customerName.trim(),
          customerPhone.trim(),
          (customerEmail || '').trim(),
          address.street.trim(),
          address.landmark ? address.landmark.trim() : null,
          address.city.trim(),
          address.district || 'Nashik',
          address.state || 'Maharashtra',
          address.pincode.trim(),
          subtotal,
          deliveryCharge,
          discountAmount,
          total,
          paymentMethod || 'Cash on Delivery',
          paymentStatus,
          initialStatus,
          estimatedDelivery,
          notes || null,
          trackingHash
        ]
      );

      // 8. Insert Order Items (Historical Snapshot)
      for (const vItem of verifiedItems) {
        await trx.execute(
          `INSERT INTO order_items (order_id, product_id, product_name, product_image, weight, price, quantity)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            vItem.productId,
            vItem.productName,
            vItem.productImage,
            vItem.weight,
            vItem.price,
            vItem.quantity
          ]
        );
      }

      // 9. Insert Initial Timelines
      const now = new Date();
      const dateString = `${now.getDate().toString().padStart(2, '0')} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const timelineSteps = [
        { status: 'Pending', timestamp: dateString, description: 'Order placed by customer and logged into kitchen system', completed: true },
        { status: 'Confirmed', timestamp: 'Pending', description: 'Order verified by Jijamata SHG office', completed: false },
        { status: 'Preparing', timestamp: 'Pending', description: 'Fresh preparation & weighing in Nashik kitchen', completed: false },
        { status: 'Packed', timestamp: 'Pending', description: 'Sealed in airtight packaging', completed: false },
        { status: 'Out for Delivery', timestamp: 'Pending', description: 'Dispatched with express courier service', completed: false },
        { status: 'Delivered', timestamp: 'Pending', description: 'Package handed over with gratitude', completed: false }
      ];

      for (const step of timelineSteps) {
        await trx.execute(
          `INSERT INTO order_timelines (order_id, status, timestamp, description, completed)
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, step.status, step.timestamp, step.description, step.completed ? 1 : 0]
        );
      }

      return {
        orderId,
        trackingHash,
        subtotal,
        deliveryCharge,
        discount: discountAmount,
        total,
        itemsCount: verifiedItems.length
      };
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully and stock reserved.',
      ...result
    });
  } catch (error: any) {
    console.error('[Create Order Error]:', error);
    res.status(400).json({ error: error.message || 'Failed to place order.' });
  }
});

// Helper to format order with items and timeline
async function formatFullOrder(orderRow: any) {
  const items = await query('SELECT * FROM order_items WHERE order_id = ?', [orderRow.id]);
  const timelines = await query('SELECT * FROM order_timelines WHERE order_id = ? ORDER BY id ASC', [orderRow.id]);

  return {
    id: orderRow.id,
    customerName: orderRow.customer_name,
    customerPhone: orderRow.customer_phone,
    customerEmail: orderRow.customer_email,
    address: {
      street: orderRow.street,
      landmark: orderRow.landmark || undefined,
      city: orderRow.city,
      district: orderRow.district,
      state: orderRow.state,
      pincode: orderRow.pincode
    },
    items: items.map((i: any) => ({
      productId: i.product_id,
      productName: i.product_name,
      productImage: i.product_image,
      weight: i.weight,
      price: Number(i.price),
      quantity: Number(i.quantity)
    })),
    subtotal: Number(orderRow.subtotal),
    deliveryCharge: Number(orderRow.delivery_charge),
    discount: Number(orderRow.discount),
    total: Number(orderRow.total),
    paymentMethod: orderRow.payment_method,
    paymentStatus: orderRow.payment_status,
    status: orderRow.status,
    orderDate: orderRow.created_at,
    createdAt: orderRow.created_at,
    estimatedDelivery: orderRow.estimated_delivery,
    notes: orderRow.notes || undefined,
    trackingHash: orderRow.tracking_hash,
    timeline: timelines.map((t: any) => ({
      status: t.status,
      timestamp: t.timestamp,
      description: t.description,
      completed: Boolean(t.completed)
    }))
  };
}

// GET /api/orders/:orderNumber (Public Order Tracking)
router.get('/:orderNumber', async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderNumber } = req.params;
    const cleanId = orderNumber.trim().toUpperCase();

    // Search by order ID or phone
    let orderRows = await query('SELECT * FROM orders WHERE id = ?', [cleanId]);
    if (orderRows.length === 0) {
      orderRows = await query('SELECT * FROM orders WHERE customer_phone = ? ORDER BY created_at DESC LIMIT 1', [orderNumber.trim()]);
    }

    if (orderRows.length === 0) {
      res.status(404).json({ error: `Order "${orderNumber}" not found. Please check order number or phone.` });
      return;
    }

    const fullOrder = await formatFullOrder(orderRows[0]);
    res.json(fullOrder);
  } catch (error: any) {
    console.error('[Track Order Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve tracking details.' });
  }
});

// GET /api/customer/orders (Authenticated Customer Orders)
router.get('/customer/my', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const email = req.user?.email;
    const phone = req.user?.phone;

    let orders: any[] = [];
    if (userId) {
      orders = await query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    }

    if (orders.length === 0 && (email || phone)) {
      orders = await query('SELECT * FROM orders WHERE customer_email = ? OR customer_phone = ? ORDER BY created_at DESC', [email || '', phone || '']);
    }

    const fullOrders = await Promise.all(orders.map(formatFullOrder));
    res.json(fullOrders);
  } catch (error: any) {
    console.error('[Customer Orders Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve your orders.' });
  }
});

// GET /api/admin/orders (Admin View All Orders)
router.get('/admin/all', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await query('SELECT * FROM orders ORDER BY created_at DESC');
    const fullOrders = await Promise.all(orders.map(formatFullOrder));
    res.json(fullOrders);
  } catch (error: any) {
    console.error('[Admin Orders Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve orders for admin.' });
  }
});

// PATCH /api/admin/orders/:id/status (Admin Status Update)
router.patch('/admin/:id/status', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, customDesc } = req.body;

    const validStatuses = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Processing',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ];

    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status: ${status}. Must be one of ${validStatuses.join(', ')}` });
      return;
    }

    const orderRows = await query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orderRows.length === 0) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    // Update order status
    await execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    // Update timelines
    const statusSequence = ['Pending', 'Confirmed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered'];
    const targetIdx = statusSequence.indexOf(status);
    const now = new Date();
    const timeStr = `${now.getDate().toString().padStart(2, '0')} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    for (let i = 0; i < statusSequence.length; i++) {
      const stepName = statusSequence[i];
      if (status === 'Cancelled') {
        await execute('UPDATE order_timelines SET completed = 0 WHERE order_id = ? AND status = ?', [id, stepName]);
      } else if (stepName === status) {
        await execute(
          'UPDATE order_timelines SET completed = 1, timestamp = ?, description = ? WHERE order_id = ? AND status = ?',
          [timeStr, customDesc || 'Status updated by SHG kitchen admin', id, stepName]
        );
      } else if (targetIdx !== -1 && i < targetIdx) {
        await execute('UPDATE order_timelines SET completed = 1 WHERE order_id = ? AND status = ?', [id, stepName]);
      }
    }

    const updated = await query('SELECT * FROM orders WHERE id = ?', [id]);
    const fullOrder = await formatFullOrder(updated[0]);

    res.json({
      success: true,
      message: `Order ${id} status updated to ${status}.`,
      order: fullOrder
    });
  } catch (error: any) {
    console.error('[Admin Update Order Status Error]:', error);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { query } from '../database/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/admin/customers (Protected)
router.get('/admin', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await query("SELECT * FROM users WHERE role = 'customer'");
    const orders = await query('SELECT * FROM orders');

    // Aggregate customer metrics from orders and users
    const customerMap = new Map<string, any>();

    // 1. Seed from registered customers
    for (const u of users) {
      customerMap.set(u.phone || u.email || u.id, {
        id: u.id,
        name: u.name,
        email: u.email || '—',
        phone: u.phone || '—',
        city: u.city || 'Nashik',
        district: u.district || 'Nashik',
        ordersCount: 0,
        totalSpent: 0,
        lastOrderDate: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : '2026-10-01',
        status: 'New'
      });
    }

    // 2. Aggregate from orders
    for (const ord of orders) {
      const key = ord.customer_phone || ord.customer_email || ord.id;
      const existing = customerMap.get(key);
      const ordDate = ord.created_at ? new Date(ord.created_at).toISOString().split('T')[0] : '2026-10-10';

      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += Number(ord.total);
        if (ordDate > existing.lastOrderDate) {
          existing.lastOrderDate = ordDate;
        }
        existing.status = existing.ordersCount > 1 ? 'Active' : 'New';
      } else {
        customerMap.set(key, {
          id: `cust-${ord.id}`,
          name: ord.customer_name,
          email: ord.customer_email || '—',
          phone: ord.customer_phone,
          city: ord.city,
          district: ord.district,
          ordersCount: 1,
          totalSpent: Number(ord.total),
          lastOrderDate: ordDate,
          status: 'New'
        });
      }
    }

    const customers = Array.from(customerMap.values());
    res.json(customers);
  } catch (error: any) {
    console.error('[Admin Customers Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve customers.' });
  }
});

export default router;

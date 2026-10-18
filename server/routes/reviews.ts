import { Router, Request, Response } from 'express';
import { query, execute } from '../database/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

function mapRowToReview(row: any) {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    customerName: row.customer_name,
    customerCity: row.customer_city || 'Nashik',
    rating: Number(row.rating),
    comment: row.comment,
    date: row.date,
    status: row.status as 'Approved' | 'Hidden'
  };
}

// GET /api/reviews
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.query;
    let rows: any[] = [];
    if (productId && typeof productId === 'string') {
      rows = await query('SELECT * FROM reviews WHERE product_id = ?', [productId]);
    } else {
      rows = await query('SELECT * FROM reviews');
    }
    res.json(rows.map(mapRowToReview));
  } catch (error: any) {
    console.error('[Get Reviews Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve reviews.' });
  }
});

// POST /api/reviews
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, productName, customerName, customerCity, rating, comment } = req.body;

    if (!productId || !customerName || !rating || !comment) {
      res.status(400).json({ error: 'Product, customer name, rating, and comment are required.' });
      return;
    }

    const id = `rev-${Date.now()}`;
    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;

    await execute(
      'INSERT INTO reviews (id, product_id, product_name, customer_name, customer_city, rating, comment, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        productId,
        productName || 'Homemade Product',
        customerName.trim(),
        customerCity ? customerCity.trim() : 'Nashik',
        Math.min(5, Math.max(1, Number(rating))),
        comment.trim(),
        dateStr,
        'Approved'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review: {
        id,
        productId,
        productName: productName || 'Homemade Product',
        customerName,
        customerCity: customerCity || 'Nashik',
        rating: Number(rating),
        comment,
        date: dateStr,
        status: 'Approved'
      }
    });
  } catch (error: any) {
    console.error('[Submit Review Error]:', error);
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

// PATCH /api/admin/reviews/:id/status (Protected)
router.patch('/admin/:id/status', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const rows = await query('SELECT status FROM reviews WHERE id = ?', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Review not found.' });
      return;
    }

    const newStatus = rows[0].status === 'Approved' ? 'Hidden' : 'Approved';
    await execute('UPDATE reviews SET status = ? WHERE id = ?', [newStatus, id]);

    res.json({ success: true, message: `Review marked as ${newStatus}.` });
  } catch (error: any) {
    console.error('[Toggle Review Status Error]:', error);
    res.status(500).json({ error: 'Failed to update review status.' });
  }
});

export default router;

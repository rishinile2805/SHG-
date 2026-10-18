import { Router, Request, Response } from 'express';
import { query, execute } from '../database/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

function mapRowToOffer(row: any) {
  return {
    id: row.id,
    code: row.code,
    title: row.title || '',
    description: row.description || '',
    discountPercent: Number(row.discount_percent),
    minOrderValue: Number(row.min_order_value || 0),
    minOrderAmount: Number(row.min_order_value || 0),
    expiryDate: row.expiry_date || '31 Dec 2026',
    validUntil: row.expiry_date || '31 Dec 2026',
    isActive: Boolean(row.is_active),
    active: Boolean(row.is_active)
  };
}

// GET /api/offers
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query('SELECT * FROM offers');
    res.json(rows.map(mapRowToOffer));
  } catch (error: any) {
    console.error('[Get Offers Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve offers.' });
  }
});

// POST /api/offers/validate
router.post('/validate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
      return;
    }

    const rows = await query('SELECT * FROM offers WHERE code = ? AND is_active = 1', [code.trim().toUpperCase()]);
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
      return;
    }

    const offer = mapRowToOffer(rows[0]);
    const numSubtotal = Number(subtotal || 0);

    if (numSubtotal < (offer.minOrderValue || 0)) {
      res.status(400).json({
        success: false,
        message: `Minimum order value for ${offer.code} is ₹${offer.minOrderValue}. Your subtotal is ₹${numSubtotal}.`
      });
      return;
    }

    const discountAmount = Math.round((numSubtotal * offer.discountPercent) / 100);

    res.json({
      success: true,
      message: `Coupon "${offer.code}" applied! ${offer.discountPercent}% OFF (Saving ₹${discountAmount})`,
      offer,
      discountAmount
    });
  } catch (error: any) {
    console.error('[Validate Coupon Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to validate coupon.' });
  }
});

// POST /api/admin/offers (Protected)
router.post('/admin', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, title, description, discountPercent, minOrderValue, expiryDate, isActive } = req.body;

    if (!code || !discountPercent) {
      res.status(400).json({ error: 'Coupon code and discount percentage are required.' });
      return;
    }

    const id = `offer-${Date.now()}`;
    await execute(
      'INSERT INTO offers (id, code, title, description, discount_percent, min_order_value, expiry_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        code.trim().toUpperCase(),
        title || '',
        description || '',
        Number(discountPercent),
        Number(minOrderValue || 0),
        expiryDate || '31 Dec 2026',
        isActive !== false ? 1 : 0
      ]
    );

    const rows = await query('SELECT * FROM offers WHERE id = ?', [id]);
    res.status(201).json(mapRowToOffer(rows[0]));
  } catch (error: any) {
    console.error('[Create Offer Error]:', error);
    res.status(500).json({ error: 'Failed to create coupon.' });
  }
});

// PATCH /api/admin/offers/:id/status (Protected)
router.patch('/admin/:id/status', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const rows = await query('SELECT * FROM offers WHERE id = ?', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Offer not found.' });
      return;
    }

    const newStatus = rows[0].is_active ? 0 : 1;
    await execute('UPDATE offers SET is_active = ? WHERE id = ?', [newStatus, id]);

    res.json({ success: true, message: 'Offer status updated.' });
  } catch (error: any) {
    console.error('[Toggle Offer Status Error]:', error);
    res.status(500).json({ error: 'Failed to update offer status.' });
  }
});

// DELETE /api/admin/offers/:id (Protected)
router.delete('/admin/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await execute('DELETE FROM offers WHERE id = ?', [id]);
    res.json({ success: true, message: 'Offer deleted successfully.' });
  } catch (error: any) {
    console.error('[Delete Offer Error]:', error);
    res.status(500).json({ error: 'Failed to delete offer.' });
  }
});

export default router;

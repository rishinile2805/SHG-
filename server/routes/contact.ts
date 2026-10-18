import { Router, Request, Response } from 'express';
import { query, execute } from '../database/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

function mapRowToMessage(row: any) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    date: row.date,
    status: row.status as 'New' | 'Read' | 'Resolved'
  };
}

// POST /api/contact (Public Inquiry Submission)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !message || (!email && !phone)) {
      res.status(400).json({ error: 'Name, contact detail (email or phone), and message are required.' });
      return;
    }

    const id = `msg-${Date.now()}`;
    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    await execute(
      'INSERT INTO contact_messages (id, name, email, phone, message, date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name.trim(), email ? email.trim() : '', phone ? phone.trim() : '', message.trim(), dateStr, 'New']
    );

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent to Jijamata Gruh Udyog office.',
      id
    });
  } catch (error: any) {
    console.error('[Contact Submission Error]:', error);
    res.status(500).json({ error: 'Failed to submit contact message.' });
  }
});

// GET /api/admin/messages (Protected)
router.get('/admin', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows.map(mapRowToMessage));
  } catch (error: any) {
    console.error('[Admin Get Messages Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve messages.' });
  }
});

// PATCH /api/admin/messages/:id/status (Protected)
router.patch('/admin/:id/status', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['New', 'Read', 'Resolved'].includes(status)) {
      res.status(400).json({ error: 'Invalid status.' });
      return;
    }

    await execute('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: `Message status updated to ${status}.` });
  } catch (error: any) {
    console.error('[Admin Update Message Status Error]:', error);
    res.status(500).json({ error: 'Failed to update message status.' });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { query, execute } from '../database/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

function mapRowToCategory(row: any, count: number) {
  return {
    id: row.id,
    name: row.name,
    nameMr: row.name_mr || row.name,
    nameHi: row.name_hi || row.name,
    description: row.description || '',
    image: row.image || '',
    productCount: count
  };
}

// GET /api/categories
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const cats = await query('SELECT * FROM categories');
    const products = await query('SELECT category_id FROM products');

    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.category_id] = (counts[p.category_id] || 0) + 1;
    }

    const result = cats.map(c => mapRowToCategory(c, counts[c.id] || 0));
    res.json(result);
  } catch (error: any) {
    console.error('[Get Categories Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
});

// POST /api/admin/categories (Protected)
router.post('/admin', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, name, nameMr, nameHi, description, image } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Category name is required.' });
      return;
    }

    const catId = id || name.trim().replace(/\s+/g, '-');
    await execute(
      'INSERT INTO categories (id, name, name_mr, name_hi, description, image, product_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [catId, name.trim(), (nameMr || name).trim(), (nameHi || name).trim(), description || '', image || '', 0]
    );

    res.status(201).json({ id: catId, name, nameMr: nameMr || name, nameHi: nameHi || name, description, image, productCount: 0 });
  } catch (error: any) {
    console.error('[Add Category Error]:', error);
    res.status(500).json({ error: 'Failed to create category.' });
  }
});

// PUT /api/admin/categories/:id (Protected)
router.put('/admin/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, nameMr, nameHi, description, image } = req.body;

    await execute(
      'UPDATE categories SET name = ?, name_mr = ?, name_hi = ?, description = ?, image = ? WHERE id = ?',
      [name, nameMr || name, nameHi || name, description || '', image || '', id]
    );

    res.json({ success: true, message: 'Category updated successfully.' });
  } catch (error: any) {
    console.error('[Update Category Error]:', error);
    res.status(500).json({ error: 'Failed to update category.' });
  }
});

// DELETE /api/admin/categories/:id (Protected)
router.delete('/admin/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await execute('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error: any) {
    console.error('[Delete Category Error]:', error);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
});

export default router;

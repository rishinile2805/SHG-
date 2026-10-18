import { Router, Request, Response } from 'express';
import { query, execute } from '../database/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

function mapRowToProduct(row: any) {
  let ingredients = [];
  try {
    ingredients = typeof row.ingredients === 'string' ? JSON.parse(row.ingredients) : (row.ingredients || []);
  } catch (e) {
    ingredients = [];
  }

  let weightOptions = [];
  try {
    weightOptions = typeof row.weight_options === 'string' ? JSON.parse(row.weight_options) : (row.weight_options || []);
  } catch (e) {
    weightOptions = [];
  }

  return {
    id: row.id,
    name: row.name,
    nameMr: row.name_mr || row.name,
    nameHi: row.name_hi || row.name,
    category: row.category_id,
    price: Number(row.price),
    discountPrice: row.discount_price ? Number(row.discount_price) : undefined,
    image: row.image,
    description: row.description,
    descriptionMr: row.description_mr,
    descriptionHi: row.description_hi,
    ingredients,
    weight: row.weight,
    weightOptions,
    stock: Number(row.stock),
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 0),
    featured: Boolean(row.featured),
    available: Boolean(row.available),
    shelfLife: row.shelf_life || '6 Months',
    spicinessLevel: row.spiciness_level || 'Medium',
    madeBy: row.made_by || 'Jijamata SHG, Nashik'
  };
}

// GET /api/products
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featured, search } = req.query;

    let rows: any[] = [];
    if (category && category !== 'All') {
      rows = await query('SELECT * FROM products WHERE category_id = ?', [category]);
    } else {
      rows = await query('SELECT * FROM products');
    }

    let products = rows.map(mapRowToProduct);

    if (featured === 'true' || featured === '1') {
      products = products.filter(p => p.featured);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nameMr?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    res.json(products);
  } catch (error: any) {
    console.error('[Get Products Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const rows = await query('SELECT * FROM products WHERE id = ?', [id]);

    if (rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(mapRowToProduct(rows[0]));
  } catch (error: any) {
    console.error('[Get Product by ID Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

// POST /api/admin/products (Protected)
router.post('/admin', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      nameMr,
      nameHi,
      category,
      price,
      discountPrice,
      image,
      description,
      descriptionMr,
      descriptionHi,
      ingredients,
      weight,
      weightOptions,
      stock,
      shelfLife,
      spicinessLevel,
      featured,
      available,
      madeBy
    } = req.body;

    if (!name || !price || !category) {
      res.status(400).json({ error: 'Product name, category, and price are required.' });
      return;
    }

    const numPrice = Number(price);
    const numStock = Number(stock || 0);

    if (isNaN(numPrice) || numPrice < 0) {
      res.status(400).json({ error: 'Invalid product price.' });
      return;
    }

    if (isNaN(numStock) || numStock < 0) {
      res.status(400).json({ error: 'Invalid product stock.' });
      return;
    }

    const id = `prod-${Date.now()}`;
    const ingredientsJson = JSON.stringify(Array.isArray(ingredients) ? ingredients : []);
    const weightOptionsJson = JSON.stringify(Array.isArray(weightOptions) ? weightOptions : [
      { weight: weight || '250g', price: numPrice, discountPrice: discountPrice ? Number(discountPrice) : undefined }
    ]);

    await execute(
      `INSERT INTO products (
        id, name, name_mr, name_hi, category_id, price, discount_price, image,
        description, description_mr, description_hi, ingredients, weight, weight_options,
        stock, rating, reviews_count, featured, available, shelf_life, spiciness_level, made_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name.trim(),
        (nameMr || name).trim(),
        (nameHi || name).trim(),
        category,
        numPrice,
        discountPrice ? Number(discountPrice) : null,
        image || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        description || '',
        descriptionMr || '',
        descriptionHi || '',
        ingredientsJson,
        weight || '250g',
        weightOptionsJson,
        numStock,
        5.0,
        0,
        featured ? 1 : 0,
        available !== false ? 1 : 0,
        shelfLife || '6 Months',
        spicinessLevel || 'Medium',
        madeBy || 'Jijamata SHG, Nashik'
      ]
    );

    const insertedRows = await query('SELECT * FROM products WHERE id = ?', [id]);
    res.status(201).json(mapRowToProduct(insertedRows[0]));
  } catch (error: any) {
    console.error('[Admin Add Product Error]:', error);
    res.status(500).json({ error: 'Failed to create product in database.' });
  }
});

// PUT /api/admin/products/:id (Protected)
router.put('/admin/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM products WHERE id = ?', [id]);

    if (existing.length === 0) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    const current = mapRowToProduct(existing[0]);
    const b = req.body;

    const updatedName = b.name !== undefined ? b.name : current.name;
    const updatedNameMr = b.nameMr !== undefined ? b.nameMr : current.nameMr;
    const updatedNameHi = b.nameHi !== undefined ? b.nameHi : current.nameHi;
    const updatedCat = b.category !== undefined ? b.category : current.category;
    const updatedPrice = b.price !== undefined ? Number(b.price) : current.price;
    const updatedDiscount = b.discountPrice !== undefined ? (b.discountPrice ? Number(b.discountPrice) : null) : (current.discountPrice || null);
    const updatedImage = b.image !== undefined ? b.image : current.image;
    const updatedDesc = b.description !== undefined ? b.description : current.description;
    const updatedDescMr = b.descriptionMr !== undefined ? b.descriptionMr : current.descriptionMr;
    const updatedDescHi = b.descriptionHi !== undefined ? b.descriptionHi : current.descriptionHi;
    const updatedIngredients = b.ingredients !== undefined ? JSON.stringify(b.ingredients) : JSON.stringify(current.ingredients);
    const updatedWeight = b.weight !== undefined ? b.weight : current.weight;
    const updatedWeightOptions = b.weightOptions !== undefined ? JSON.stringify(b.weightOptions) : JSON.stringify(current.weightOptions);
    const updatedStock = b.stock !== undefined ? Number(b.stock) : current.stock;
    const updatedFeatured = b.featured !== undefined ? (b.featured ? 1 : 0) : (current.featured ? 1 : 0);
    const updatedAvailable = b.available !== undefined ? (b.available ? 1 : 0) : (current.available ? 1 : 0);
    const updatedShelfLife = b.shelfLife !== undefined ? b.shelfLife : current.shelfLife;
    const updatedSpiciness = b.spicinessLevel !== undefined ? b.spicinessLevel : current.spicinessLevel;
    const updatedMadeBy = b.madeBy !== undefined ? b.madeBy : current.madeBy;

    await execute(
      `UPDATE products SET
        name=?, name_mr=?, name_hi=?, category_id=?, price=?, discount_price=?, image=?,
        description=?, description_mr=?, description_hi=?, ingredients=?, weight=?, weight_options=?,
        stock=?, featured=?, available=?, shelf_life=?, spiciness_level=?, made_by=?
       WHERE id=?`,
      [
        updatedName,
        updatedNameMr,
        updatedNameHi,
        updatedCat,
        updatedPrice,
        updatedDiscount,
        updatedImage,
        updatedDesc,
        updatedDescMr,
        updatedDescHi,
        updatedIngredients,
        updatedWeight,
        updatedWeightOptions,
        updatedStock,
        updatedFeatured,
        updatedAvailable,
        updatedShelfLife,
        updatedSpiciness,
        updatedMadeBy,
        id
      ]
    );

    const updatedRows = await query('SELECT * FROM products WHERE id = ?', [id]);
    res.json(mapRowToProduct(updatedRows[0]));
  } catch (error: any) {
    console.error('[Admin Update Product Error]:', error);
    res.status(500).json({ error: 'Failed to update product in database.' });
  }
});

// DELETE /api/admin/products/:id (Protected)
router.delete('/admin/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id FROM products WHERE id = ?', [id]);

    if (existing.length === 0) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    await execute('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: 'Product deleted from store catalog.' });
  } catch (error: any) {
    console.error('[Admin Delete Product Error]:', error);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

export default router;

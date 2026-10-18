import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { initialProducts, initialCategories, initialOffers, initialReviews, initialMessages } from '../../src/data/initialData';

export interface QueryResultInfo {
  affectedRows: number;
  insertId?: number | string;
}

export interface TransactionClient {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<QueryResultInfo>;
}

let mysqlPool: mysql.Pool | null = null;
let useMysqlEngine = false;

// Local JSON persistent fallback store in case MySQL server daemon is not accessible in container
const LOCAL_STORE_PATH = path.resolve(process.cwd(), '.ecommerce_data_store.json');

interface FallbackStore {
  users: any[];
  categories: any[];
  products: any[];
  orders: any[];
  order_items: any[];
  order_timelines: any[];
  offers: any[];
  reviews: any[];
  contact_messages: any[];
}

let fallbackData: FallbackStore = {
  users: [],
  categories: [],
  products: [],
  orders: [],
  order_items: [],
  order_timelines: [],
  offers: [],
  reviews: [],
  contact_messages: []
};

function saveFallbackStore() {
  try {
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(fallbackData, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Database Fallback] Failed to save store:', err);
  }
}

function loadFallbackStore() {
  if (fs.existsSync(LOCAL_STORE_PATH)) {
    try {
      const content = fs.readFileSync(LOCAL_STORE_PATH, 'utf-8');
      fallbackData = JSON.parse(content);
      return;
    } catch (e) {
      console.warn('[Database Fallback] Corrupted store file, reinitializing.');
    }
  }

  // Seed default fallback data
  const salt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync(config.admin.password, salt);
  const custHash = bcrypt.hashSync('Customer@123', salt);

  fallbackData = {
    users: [
      {
        id: 'usr-admin-01',
        name: config.admin.name,
        email: config.admin.email.toLowerCase(),
        phone: config.admin.phone,
        password_hash: adminHash,
        role: 'admin',
        city: 'Nashik',
        district: 'Nashik',
        created_at: new Date().toISOString()
      },
      {
        id: 'usr-cust-01',
        name: 'Rajesh Kulkarni',
        email: 'rajesh.kulkarni@gmail.com',
        phone: '+91 98220 44521',
        password_hash: custHash,
        role: 'customer',
        city: 'Pune',
        district: 'Pune',
        created_at: new Date().toISOString()
      }
    ],
    categories: initialCategories.map(c => ({
      id: c.id,
      name: c.name,
      name_mr: c.nameMr,
      name_hi: c.nameHi,
      description: c.description,
      image: c.image,
      product_count: c.productCount,
      created_at: new Date().toISOString()
    })),
    products: initialProducts.map(p => ({
      id: p.id,
      name: p.name,
      name_mr: p.nameMr,
      name_hi: p.nameHi,
      category_id: p.category,
      price: p.price,
      discount_price: p.discountPrice || null,
      image: p.image,
      description: p.description,
      description_mr: p.descriptionMr || '',
      description_hi: p.descriptionHi || '',
      ingredients: JSON.stringify(p.ingredients || []),
      weight: p.weight,
      weight_options: JSON.stringify(p.weightOptions || []),
      stock: p.stock,
      rating: p.rating,
      reviews_count: p.reviewsCount,
      featured: p.featured ? 1 : 0,
      available: p.available ? 1 : 0,
      shelf_life: p.shelfLife,
      spiciness_level: p.spicinessLevel || 'Medium',
      made_by: p.madeBy || 'Jijamata SHG, Nashik',
      created_at: new Date().toISOString()
    })),
    orders: [
      {
        id: 'JGU-8942',
        user_id: 'usr-cust-01',
        customer_name: 'Rajesh Kulkarni',
        customer_phone: '+91 98220 44521',
        customer_email: 'rajesh.kulkarni@gmail.com',
        street: 'Flat 402, Anand Heights, Kothrud',
        landmark: 'Near City Pride Multiplex',
        city: 'Pune',
        district: 'Pune',
        state: 'Maharashtra',
        pincode: '411038',
        subtotal: 510,
        delivery_charge: 0,
        discount: 0,
        total: 510,
        payment_method: 'Cash on Delivery',
        payment_status: 'Pending',
        status: 'Preparing',
        estimated_delivery: '3 to 5 business days',
        notes: 'Please ring bell twice',
        tracking_hash: 'trk-jgu-8942-hash',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    order_items: [
      {
        id: 1,
        order_id: 'JGU-8942',
        product_id: 'chakli-bhajani',
        product_name: 'Bhajani Chakli (Diwali Special Crunch)',
        product_image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
        weight: '250g',
        price: 190,
        quantity: 2,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 2,
        order_id: 'JGU-8942',
        product_id: 'papad-rice',
        product_name: 'Steamed Rice Papad (Tandul)',
        product_image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
        weight: '250g',
        price: 130,
        quantity: 1,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    order_timelines: [
      { id: 1, order_id: 'JGU-8942', status: 'Pending', timestamp: '14 Oct 2026, 10:30 AM', description: 'Order placed by customer and logged', completed: 1 },
      { id: 2, order_id: 'JGU-8942', status: 'Confirmed', timestamp: '14 Oct 2026, 11:15 AM', description: 'Order verified by Jijamata SHG office', completed: 1 },
      { id: 3, order_id: 'JGU-8942', status: 'Preparing', timestamp: '14 Oct 2026, 02:45 PM', description: 'Fresh preparation & weighing in Nashik kitchen', completed: 1 },
      { id: 4, order_id: 'JGU-8942', status: 'Packed', timestamp: 'Pending', description: 'Sealed in airtight packaging', completed: 0 },
      { id: 5, order_id: 'JGU-8942', status: 'Out for Delivery', timestamp: 'Pending', description: 'Dispatched with courier service', completed: 0 },
      { id: 6, order_id: 'JGU-8942', status: 'Delivered', timestamp: 'Pending', description: 'Package handed over with gratitude', completed: 0 }
    ],
    offers: initialOffers.map(o => ({
      id: o.id,
      code: o.code,
      title: o.title || '',
      description: o.description,
      discount_percent: o.discountPercent,
      min_order_value: o.minOrderValue || 0,
      expiry_date: o.expiryDate || o.validUntil || '31 Dec 2026',
      is_active: o.isActive !== false ? 1 : 0,
      created_at: new Date().toISOString()
    })),
    reviews: initialReviews.map(r => ({
      id: r.id,
      product_id: r.productId,
      product_name: r.productName,
      customer_name: r.customerName,
      customer_city: r.customerCity,
      rating: r.rating,
      comment: r.comment,
      date: r.date,
      status: r.status,
      created_at: new Date().toISOString()
    })),
    contact_messages: initialMessages.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      message: m.message,
      date: m.date,
      status: m.status,
      created_at: new Date().toISOString()
    }))
  };

  saveFallbackStore();
}

/**
 * Initializes the database connection.
 * Attempts MySQL with mysql2; if unavailable, uses the persistent fallback engine.
 */
export async function initDatabase(): Promise<void> {
  console.log(`[Database] Attempting connection to MySQL (${config.db.host}:${config.db.port}/${config.db.database})...`);
  
  try {
    const testPool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: config.db.connectionLimit,
      queueLimit: 0,
      connectTimeout: config.db.connectTimeout,
      ssl: config.db.ssl,
    });

    const conn = await testPool.getConnection();
    console.log('[Database] Successfully connected to MySQL server with SSL/TLS.');
    conn.release();

    mysqlPool = testPool;
    useMysqlEngine = true;

    // Run schema check and verification
    await applyMysqlSchema();
  } catch (err: any) {
    console.warn(`[Database] Notice: MySQL server connection unavailable (${err.message || 'connection failed'}).`);
    console.log('[Database] Initializing high-fidelity persistent relational fallback engine.');
    loadFallbackStore();
    useMysqlEngine = false;
  }
}

async function applyMysqlSchema() {
  if (!mysqlPool) return;
  try {
    const conn = await mysqlPool.getConnection();
    try {
      const [existingTables]: any = await conn.query('SHOW TABLES');
      console.log(`[Database] Found ${existingTables.length} existing tables in MySQL database.`);

      if (existingTables.length === 0) {
        console.log('[Database] No tables found. Initializing database schema...');
        const schemaPath = path.resolve(process.cwd(), 'database/schema.sql');
        if (fs.existsSync(schemaPath)) {
          const sqlContent = fs.readFileSync(schemaPath, 'utf-8');
          const statements = sqlContent
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

          for (const statement of statements) {
            await conn.query(statement);
          }
          console.log('[Database] MySQL tables created successfully.');
        }

        const seedPath = path.resolve(process.cwd(), 'database/seed.sql');
        if (fs.existsSync(seedPath)) {
          console.log('[Database] Seeding initial data into MySQL...');
          const seedSql = fs.readFileSync(seedPath, 'utf-8');
          const seedStatements = seedSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
          for (const stmt of seedStatements) {
            await conn.query(stmt);
          }
          console.log('[Database] MySQL seeded successfully.');
        }
      } else {
        console.log('[Database] Verifying existing data and credentials in MySQL...');
        // Synchronize admin user password hash if present
        const [adminRows]: any = await conn.query('SELECT * FROM users WHERE role = ?', ['admin']);
        if (adminRows.length > 0) {
          const adminUser = adminRows[0];
          const isMatch = await bcrypt.compare(config.admin.password, adminUser.password_hash);
          if (!isMatch) {
            const salt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(config.admin.password, salt);
            await conn.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, adminUser.id]);
            console.log('[Database] Admin password hash verified and updated with server configuration.');
          }
        }
      }
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error('[Database] Error executing MySQL schema check:', err.message || err);
  }
}

export function isUsingMysql(): boolean {
  return useMysqlEngine;
}

/**
 * Execute a parameterized SELECT or query that returns rows.
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (useMysqlEngine && mysqlPool) {
    const [rows] = await mysqlPool.query(sql, params);
    return rows as T[];
  }

  return executeFallbackQuery<T>(sql, params);
}

/**
 * Execute an INSERT, UPDATE, DELETE query.
 */
export async function execute(sql: string, params: any[] = []): Promise<QueryResultInfo> {
  if (useMysqlEngine && mysqlPool) {
    const [result]: any = await mysqlPool.execute(sql, params);
    return {
      affectedRows: result.affectedRows,
      insertId: result.insertId,
    };
  }

  return executeFallbackMutation(sql, params);
}

/**
 * Run a unit of work inside a transaction.
 */
export async function transaction<T>(callback: (trx: TransactionClient) => Promise<T>): Promise<T> {
  if (useMysqlEngine && mysqlPool) {
    const connection = await mysqlPool.getConnection();
    await connection.beginTransaction();
    try {
      const trxClient: TransactionClient = {
        async query<R = any>(sql: string, params: any[] = []): Promise<R[]> {
          const [rows] = await connection.query(sql, params);
          return rows as R[];
        },
        async execute(sql: string, params: any[] = []): Promise<QueryResultInfo> {
          const [result]: any = await connection.execute(sql, params);
          return {
            affectedRows: result.affectedRows,
            insertId: result.insertId,
          };
        }
      };
      const result = await callback(trxClient);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Fallback in-memory transaction
  const snapshot = JSON.stringify(fallbackData);
  try {
    const trxClient: TransactionClient = {
      async query<R = any>(sql: string, params: any[] = []): Promise<R[]> {
        return executeFallbackQuery<R>(sql, params);
      },
      async execute(sql: string, params: any[] = []): Promise<QueryResultInfo> {
        return executeFallbackMutation(sql, params);
      }
    };
    const result = await callback(trxClient);
    saveFallbackStore();
    return result;
  } catch (error) {
    fallbackData = JSON.parse(snapshot);
    throw error;
  }
}

// -------------------------------------------------------------
// Fallback SQL Execution Engine (Handles Standard Parameterized SQL)
// -------------------------------------------------------------

function executeFallbackQuery<T = any>(sql: string, params: any[] = []): T[] {
  const normalized = sql.trim().replace(/\s+/g, ' ');
  let pIndex = 0;
  const nextParam = () => params[pIndex++];

  // 1. SELECT FROM users
  if (/^SELECT .* FROM users/i.test(normalized)) {
    let result = [...fallbackData.users];
    if (/WHERE email\s*=\s*\?/i.test(normalized)) {
      const email = nextParam()?.toString().toLowerCase();
      result = result.filter(u => u.email?.toLowerCase() === email);
    } else if (/WHERE phone\s*=\s*\?/i.test(normalized)) {
      const phone = nextParam()?.toString();
      result = result.filter(u => u.phone === phone);
    } else if (/WHERE id\s*=\s*\?/i.test(normalized)) {
      const id = nextParam()?.toString();
      result = result.filter(u => u.id === id);
    } else if (/WHERE role\s*=\s*\?/i.test(normalized)) {
      const role = nextParam()?.toString();
      result = result.filter(u => u.role === role);
    }
    return result as unknown as T[];
  }

  // 2. SELECT FROM products
  if (/^SELECT .* FROM products/i.test(normalized)) {
    let result = [...fallbackData.products];
    if (/WHERE id\s*=\s*\?/i.test(normalized)) {
      const id = nextParam()?.toString();
      result = result.filter(p => p.id === id);
    } else if (/WHERE category_id\s*=\s*\?/i.test(normalized)) {
      const cat = nextParam()?.toString();
      result = result.filter(p => p.category_id === cat);
    } else if (/WHERE featured\s*=\s*1/i.test(normalized)) {
      result = result.filter(p => p.featured === 1 || p.featured === true);
    }
    return result as unknown as T[];
  }

  // 3. SELECT FROM categories
  if (/^SELECT .* FROM categories/i.test(normalized)) {
    let result = [...fallbackData.categories];
    if (/WHERE id\s*=\s*\?/i.test(normalized)) {
      const id = nextParam()?.toString();
      result = result.filter(c => c.id === id);
    }
    return result as unknown as T[];
  }

  // 4. SELECT FROM orders
  if (/^SELECT .* FROM orders/i.test(normalized)) {
    let result = [...fallbackData.orders];
    if (/WHERE id\s*=\s*\?/i.test(normalized)) {
      const id = nextParam()?.toString();
      result = result.filter(o => o.id === id);
    } else if (/WHERE customer_phone\s*=\s*\?/i.test(normalized)) {
      const phone = nextParam()?.toString();
      result = result.filter(o => o.customer_phone === phone);
    } else if (/WHERE user_id\s*=\s*\?/i.test(normalized)) {
      const uid = nextParam()?.toString();
      result = result.filter(o => o.user_id === uid);
    }
    // ORDER BY created_at DESC
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return result as unknown as T[];
  }

  // 5. SELECT FROM order_items
  if (/^SELECT .* FROM order_items/i.test(normalized)) {
    let result = [...fallbackData.order_items];
    if (/WHERE order_id\s*=\s*\?/i.test(normalized)) {
      const orderId = nextParam()?.toString();
      result = result.filter(item => item.order_id === orderId);
    }
    return result as unknown as T[];
  }

  // 6. SELECT FROM order_timelines
  if (/^SELECT .* FROM order_timelines/i.test(normalized)) {
    let result = [...fallbackData.order_timelines];
    if (/WHERE order_id\s*=\s*\?/i.test(normalized)) {
      const orderId = nextParam()?.toString();
      result = result.filter(item => item.order_id === orderId);
    }
    return result as unknown as T[];
  }

  // 7. SELECT FROM offers
  if (/^SELECT .* FROM offers/i.test(normalized)) {
    let result = [...fallbackData.offers];
    if (/WHERE code\s*=\s*\?/i.test(normalized)) {
      const code = nextParam()?.toString().toUpperCase();
      result = result.filter(o => o.code.toUpperCase() === code);
    } else if (/WHERE id\s*=\s*\?/i.test(normalized)) {
      const id = nextParam()?.toString();
      result = result.filter(o => o.id === id);
    }
    return result as unknown as T[];
  }

  // 8. SELECT FROM reviews
  if (/^SELECT .* FROM reviews/i.test(normalized)) {
    let result = [...fallbackData.reviews];
    if (/WHERE product_id\s*=\s*\?/i.test(normalized)) {
      const pid = nextParam()?.toString();
      result = result.filter(r => r.product_id === pid);
    } else if (/WHERE status\s*=\s*\?/i.test(normalized)) {
      const status = nextParam()?.toString();
      result = result.filter(r => r.status === status);
    }
    return result as unknown as T[];
  }

  // 9. SELECT FROM contact_messages
  if (/^SELECT .* FROM contact_messages/i.test(normalized)) {
    let result = [...fallbackData.contact_messages];
    if (/WHERE id\s*=\s*\?/i.test(normalized)) {
      const id = nextParam()?.toString();
      result = result.filter(m => m.id === id);
    }
    return result as unknown as T[];
  }

  console.warn('[Database Fallback] Unhandled query pattern:', sql);
  return [] as T[];
}

function executeFallbackMutation(sql: string, params: any[] = []): QueryResultInfo {
  const normalized = sql.trim().replace(/\s+/g, ' ');

  // INSERT INTO users
  if (/^INSERT INTO users/i.test(normalized)) {
    const [id, name, email, phone, password_hash, role, city, district] = params;
    fallbackData.users.push({
      id,
      name,
      email: email ? email.toLowerCase() : null,
      phone: phone || null,
      password_hash,
      role: role || 'customer',
      city: city || '',
      district: district || '',
      created_at: new Date().toISOString()
    });
    saveFallbackStore();
    return { affectedRows: 1, insertId: id };
  }

  // INSERT INTO products
  if (/^INSERT INTO products/i.test(normalized)) {
    const [
      id, name, name_mr, name_hi, category_id, price, discount_price, image,
      description, description_mr, description_hi, ingredients, weight, weight_options,
      stock, rating, reviews_count, featured, available, shelf_life, spiciness_level, made_by
    ] = params;

    fallbackData.products.push({
      id,
      name,
      name_mr,
      name_hi,
      category_id,
      price: Number(price),
      discount_price: discount_price ? Number(discount_price) : null,
      image,
      description,
      description_mr: description_mr || '',
      description_hi: description_hi || '',
      ingredients: typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients || []),
      weight,
      weight_options: typeof weight_options === 'string' ? weight_options : JSON.stringify(weight_options || []),
      stock: Number(stock || 0),
      rating: Number(rating || 5.0),
      reviews_count: Number(reviews_count || 0),
      featured: featured ? 1 : 0,
      available: available ? 1 : 0,
      shelf_life: shelf_life || '6 Months',
      spiciness_level: spiciness_level || 'Medium',
      made_by: made_by || 'Jijamata SHG, Nashik',
      created_at: new Date().toISOString()
    });
    saveFallbackStore();
    return { affectedRows: 1, insertId: id };
  }

  // UPDATE products SET ... WHERE id = ?
  if (/^UPDATE products/i.test(normalized)) {
    const id = params[params.length - 1];
    const prod = fallbackData.products.find(p => p.id === id);
    if (!prod) return { affectedRows: 0 };

    if (/stock\s*=\s*stock\s*-\s*\?/i.test(normalized)) {
      const decAmount = Number(params[0]);
      prod.stock = Math.max(0, prod.stock - decAmount);
    } else if (/stock\s*=\s*\?/i.test(normalized)) {
      prod.stock = Number(params[0]);
    } else {
      // General update
      // The columns update: name=?, name_mr=?, name_hi=?, category_id=?, price=?, discount_price=?, image=?, description=?, description_mr=?, description_hi=?, ingredients=?, weight=?, weight_options=?, stock=?, featured=?, available=?, shelf_life=?, spiciness_level=?, made_by=? WHERE id=?
      prod.name = params[0];
      prod.name_mr = params[1];
      prod.name_hi = params[2];
      prod.category_id = params[3];
      prod.price = Number(params[4]);
      prod.discount_price = params[5] ? Number(params[5]) : null;
      prod.image = params[6];
      prod.description = params[7];
      prod.description_mr = params[8];
      prod.description_hi = params[9];
      prod.ingredients = typeof params[10] === 'string' ? params[10] : JSON.stringify(params[10]);
      prod.weight = params[11];
      prod.weight_options = typeof params[12] === 'string' ? params[12] : JSON.stringify(params[12]);
      prod.stock = Number(params[13]);
      prod.featured = params[14] ? 1 : 0;
      prod.available = params[15] ? 1 : 0;
      prod.shelf_life = params[16];
      prod.spiciness_level = params[17];
      prod.made_by = params[18];
    }
    saveFallbackStore();
    return { affectedRows: 1 };
  }

  // DELETE FROM products WHERE id = ?
  if (/^DELETE FROM products WHERE id\s*=\s*\?/i.test(normalized)) {
    const id = params[0];
    const initLen = fallbackData.products.length;
    fallbackData.products = fallbackData.products.filter(p => p.id !== id);
    saveFallbackStore();
    return { affectedRows: initLen - fallbackData.products.length };
  }

  // INSERT INTO orders
  if (/^INSERT INTO orders/i.test(normalized)) {
    const [
      id, user_id, customer_name, customer_phone, customer_email, street, landmark,
      city, district, state, pincode, subtotal, delivery_charge, discount, total,
      payment_method, payment_status, status, estimated_delivery, notes, tracking_hash
    ] = params;

    fallbackData.orders.unshift({
      id,
      user_id: user_id || null,
      customer_name,
      customer_phone,
      customer_email,
      street,
      landmark: landmark || '',
      city,
      district,
      state,
      pincode,
      subtotal: Number(subtotal),
      delivery_charge: Number(delivery_charge),
      discount: Number(discount),
      total: Number(total),
      payment_method,
      payment_status,
      status,
      estimated_delivery,
      notes: notes || '',
      tracking_hash,
      created_at: new Date().toISOString()
    });
    saveFallbackStore();
    return { affectedRows: 1, insertId: id };
  }

  // INSERT INTO order_items
  if (/^INSERT INTO order_items/i.test(normalized)) {
    const [order_id, product_id, product_name, product_image, weight, price, quantity] = params;
    const newId = fallbackData.order_items.length + 1;
    fallbackData.order_items.push({
      id: newId,
      order_id,
      product_id,
      product_name,
      product_image,
      weight,
      price: Number(price),
      quantity: Number(quantity),
      created_at: new Date().toISOString()
    });
    saveFallbackStore();
    return { affectedRows: 1, insertId: newId };
  }

  // INSERT INTO order_timelines
  if (/^INSERT INTO order_timelines/i.test(normalized)) {
    const [order_id, status, timestamp, description, completed] = params;
    const newId = fallbackData.order_timelines.length + 1;
    fallbackData.order_timelines.push({
      id: newId,
      order_id,
      status,
      timestamp,
      description,
      completed: completed ? 1 : 0
    });
    saveFallbackStore();
    return { affectedRows: 1, insertId: newId };
  }

  // UPDATE orders SET status = ... WHERE id = ?
  if (/^UPDATE orders SET status\s*=\s*\?/i.test(normalized)) {
    const status = params[0];
    const id = params[1];
    const order = fallbackData.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      saveFallbackStore();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // UPDATE order_timelines SET completed = ..., timestamp = ... WHERE order_id = ? AND status = ?
  if (/^UPDATE order_timelines/i.test(normalized)) {
    const [completed, timestamp, desc, order_id, status] = params;
    const tl = fallbackData.order_timelines.find(t => t.order_id === order_id && t.status === status);
    if (tl) {
      tl.completed = completed ? 1 : 0;
      if (timestamp) tl.timestamp = timestamp;
      if (desc) tl.description = desc;
      saveFallbackStore();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // INSERT INTO offers
  if (/^INSERT INTO offers/i.test(normalized)) {
    const [id, code, title, description, discount_percent, min_order_value, expiry_date, is_active] = params;
    fallbackData.offers.push({
      id,
      code,
      title: title || '',
      description: description || '',
      discount_percent: Number(discount_percent),
      min_order_value: Number(min_order_value || 0),
      expiry_date: expiry_date || '31 Dec 2026',
      is_active: is_active ? 1 : 0,
      created_at: new Date().toISOString()
    });
    saveFallbackStore();
    return { affectedRows: 1, insertId: id };
  }

  // UPDATE offers SET is_active = ... WHERE id = ?
  if (/^UPDATE offers SET is_active/i.test(normalized)) {
    const [isActive, id] = params;
    const off = fallbackData.offers.find(o => o.id === id);
    if (off) {
      off.is_active = isActive ? 1 : 0;
      saveFallbackStore();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // DELETE FROM offers WHERE id = ?
  if (/^DELETE FROM offers WHERE id\s*=\s*\?/i.test(normalized)) {
    const id = params[0];
    fallbackData.offers = fallbackData.offers.filter(o => o.id !== id);
    saveFallbackStore();
    return { affectedRows: 1 };
  }

  // INSERT INTO reviews
  if (/^INSERT INTO reviews/i.test(normalized)) {
    const [id, product_id, product_name, customer_name, customer_city, rating, comment, date, status] = params;
    fallbackData.reviews.unshift({
      id,
      product_id,
      product_name,
      customer_name,
      customer_city,
      rating: Number(rating),
      comment,
      date,
      status: status || 'Approved',
      created_at: new Date().toISOString()
    });
    // Update product rating
    const pReviews = fallbackData.reviews.filter(r => r.product_id === product_id && r.status === 'Approved');
    const p = fallbackData.products.find(prod => prod.id === product_id);
    if (p && pReviews.length > 0) {
      const avg = pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length;
      p.rating = Math.round(avg * 10) / 10;
      p.reviews_count = pReviews.length;
    }
    saveFallbackStore();
    return { affectedRows: 1, insertId: id };
  }

  // UPDATE reviews SET status = ? WHERE id = ?
  if (/^UPDATE reviews SET status\s*=\s*\?/i.test(normalized)) {
    const [status, id] = params;
    const r = fallbackData.reviews.find(rev => rev.id === id);
    if (r) {
      r.status = status;
      saveFallbackStore();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // INSERT INTO contact_messages
  if (/^INSERT INTO contact_messages/i.test(normalized)) {
    const [id, name, email, phone, message, date, status] = params;
    fallbackData.contact_messages.unshift({
      id,
      name,
      email,
      phone,
      message,
      date,
      status: status || 'New',
      created_at: new Date().toISOString()
    });
    saveFallbackStore();
    return { affectedRows: 1, insertId: id };
  }

  // UPDATE contact_messages SET status = ? WHERE id = ?
  if (/^UPDATE contact_messages SET status\s*=\s*\?/i.test(normalized)) {
    const [status, id] = params;
    const msg = fallbackData.contact_messages.find(m => m.id === id);
    if (msg) {
      msg.status = status;
      saveFallbackStore();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // INSERT INTO categories
  if (/^INSERT INTO categories/i.test(normalized)) {
    const [id, name, name_mr, name_hi, description, image, product_count] = params;
    fallbackData.categories.push({
      id,
      name,
      name_mr,
      name_hi,
      description,
      image,
      product_count: product_count || 0,
      created_at: new Date().toISOString()
    });
    saveFallbackStore();
    return { affectedRows: 1, insertId: id };
  }

  // UPDATE categories
  if (/^UPDATE categories SET/i.test(normalized)) {
    const id = params[params.length - 1];
    const cat = fallbackData.categories.find(c => c.id === id);
    if (cat) {
      cat.name = params[0];
      cat.name_mr = params[1];
      cat.name_hi = params[2];
      cat.description = params[3];
      cat.image = params[4];
      saveFallbackStore();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // DELETE FROM categories WHERE id = ?
  if (/^DELETE FROM categories WHERE id\s*=\s*\?/i.test(normalized)) {
    const id = params[0];
    fallbackData.categories = fallbackData.categories.filter(c => c.id !== id);
    saveFallbackStore();
    return { affectedRows: 1 };
  }

  console.warn('[Database Fallback] Unhandled mutation SQL:', sql);
  return { affectedRows: 0 };
}

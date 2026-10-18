import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { isUsingMysql } from './database/db';

// Route handlers
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import orderRoutes from './routes/orders';
import offerRoutes from './routes/offers';
import reviewRoutes from './routes/reviews';
import contactRoutes from './routes/contact';
import customerRoutes from './routes/customers';

export function createApp() {
  const app = express();

  // Security headers (configured to allow Vite dev scripts & assets in iframe)
  app.use(
    helmet({
      contentSecurityPolicy: false, // Vite inline scripts & dev tools
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // Body and cookie parsing
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' })); // Support image uploads
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'Jijamata Gruh Udyog E-Commerce API',
      database: isUsingMysql() ? 'MySQL (mysql2)' : 'Persistent Fallback Store (Local Dev)',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Mount API Routers
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/offers', offerRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/customers', customerRoutes);

  // Safe Centralized Error Handler (no stack traces leaked)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[API Server Error]:', err.message || err);
    res.status(err.status || 500).json({
      error: err.message || 'An unexpected server error occurred. Please try again.',
      success: false,
    });
  });

  return app;
}

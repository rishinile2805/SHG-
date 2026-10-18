import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthUserPayload {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

/**
 * Extracts and verifies JWT from HTTP-only cookie or Authorization header.
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
    return;
  }
}

/**
 * Ensures authenticated user has admin role.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
    return;
  }

  next();
}

/**
 * Optional authentication that populates req.user if a valid token is provided.
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as AuthUserPayload;
      req.user = decoded;
    } catch (err) {
      // Ignore invalid optional tokens
    }
  }
  next();
}

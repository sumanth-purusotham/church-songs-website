import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const signToken = (payload: { userId: string; name: string }) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });

export const verifyToken = (token: string) => jwt.verify(token, env.jwtSecret) as { userId: string; name: string };

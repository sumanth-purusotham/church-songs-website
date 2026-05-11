import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body as { name?: unknown; email?: unknown; password?: unknown };

  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  if (normalizedName.length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters long' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ message: 'Email is already in use' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: normalizedName, email: normalizedEmail, passwordHash });
  const token = signToken({ userId: user._id.toString(), name: user.name });

  return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: unknown; password?: unknown };

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken({ userId: user._id.toString(), name: user.name });
  return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};

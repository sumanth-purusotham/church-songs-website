import fs from 'fs/promises';
import path from 'path';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Song } from '../models/Song';

const sanitizeSearch = (search: string) => search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const uploadSong = async (req: Request, res: Response) => {
  const file = req.file;
  const { name, description } = req.body as { name?: string; description?: string };

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!file || !name || !description) {
    return res.status(400).json({ message: 'Name, description and PPT file are required' });
  }

  const song = await Song.create({
    name,
    description,
    creator: req.user.userId,
    creatorName: req.user.name,
    fileName: file.filename,
    originalFileName: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
    filePath: file.path
  });

  return res.status(201).json(song);
};

export const getSongs = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
  const search = (req.query.search as string | undefined)?.trim();

  const filter = search
    ? {
        $or: [
          { name: { $regex: sanitizeSearch(search), $options: 'i' } },
          { description: { $regex: sanitizeSearch(search), $options: 'i' } },
          { creatorName: { $regex: sanitizeSearch(search), $options: 'i' } }
        ]
      }
    : {};

  const [items, total] = await Promise.all([
    Song.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Song.countDocuments(filter)
  ]);

  return res.json({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
};

export const getSongById = async (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid song id' });
  }

  const song = await Song.findById(id);
  if (!song) {
    return res.status(404).json({ message: 'Song not found' });
  }

  return res.json(song);
};

export const updateSong = async (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  const { name, description } = req.body as { name?: string; description?: string };

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid song id' });
  }

  const song = await Song.findById(id);
  if (!song) {
    return res.status(404).json({ message: 'Song not found' });
  }

  if (song.creator.toString() !== req.user.userId) {
    return res.status(403).json({ message: 'Only the creator can update this song' });
  }

  if (name) song.name = name;
  if (description) song.description = description;

  await song.save();
  return res.json(song);
};

export const deleteSong = async (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid song id' });
  }

  const song = await Song.findById(id);
  if (!song) {
    return res.status(404).json({ message: 'Song not found' });
  }

  if (song.creator.toString() !== req.user.userId) {
    return res.status(403).json({ message: 'Only the creator can delete this song' });
  }

  const filePath = path.resolve(song.filePath);
  await Song.deleteOne({ _id: song._id });
  await fs.unlink(filePath).catch(() => undefined);

  return res.status(204).send();
};

import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const songSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    creatorName: { type: String, required: true, trim: true },
    fileName: { type: String, required: true },
    originalFileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true, min: 1 },
    filePath: { type: String, required: true }
  },
  { timestamps: true }
);

songSchema.index({ name: 'text', description: 'text', creatorName: 'text' });

export type SongDocument = InferSchemaType<typeof songSchema> & { _id: mongoose.Types.ObjectId };

export const Song = mongoose.model('Song', songSchema);

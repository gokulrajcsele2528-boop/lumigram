import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReel extends Document {
  author: mongoose.Types.ObjectId;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  audioTitle: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  topic: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReelSchema = new Schema<IReel>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    audioTitle: { type: String, default: "Original Audio" },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    topic: { type: String, default: "General", index: true },
    duration: { type: Number, default: 15 },
  },
  { timestamps: true }
);

ReelSchema.index({ viewsCount: -1, createdAt: -1 });
ReelSchema.index({ topic: 1, createdAt: -1 });

export const Reel: Model<IReel> =
  mongoose.models.Reel || mongoose.model<IReel>("Reel", ReelSchema);
export default Reel;

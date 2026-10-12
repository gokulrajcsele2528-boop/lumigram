import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMediaItem {
  url: string;
  publicId?: string;
  type: "image" | "video";
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
  aspectRatio?: string;
}

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  media: IMediaItem[];
  caption: string;
  hashtags: string[];
  mentions: string[];
  location?: string;
  topic?: string;
  likesCount: number;
  commentsCount: number;
  commentsDisabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMediaItem>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    type: { type: String, enum: ["image", "video"], default: "image" },
    width: { type: Number },
    height: { type: Number },
    duration: { type: Number },
    thumbnailUrl: { type: String },
    aspectRatio: { type: String, default: "1:1" },
  },
  { _id: false }
);

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    media: { type: [MediaSchema], required: true },
    caption: { type: String, default: "" },
    hashtags: { type: [String], default: [], index: true },
    mentions: { type: [String], default: [] },
    location: { type: String, default: "" },
    topic: { type: String, default: "General", index: true },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    commentsDisabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ topic: 1, createdAt: -1 });
PostSchema.index({ likesCount: -1, createdAt: -1 });

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;

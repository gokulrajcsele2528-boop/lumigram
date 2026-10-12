import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStoryView {
  user: mongoose.Types.ObjectId;
  viewedAt: Date;
}

export interface IStory extends Document {
  author: mongoose.Types.ObjectId;
  media: {
    url: string;
    type: "image" | "video";
    duration?: number;
  };
  caption?: string;
  views: IStoryView[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema = new Schema<IStory>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    media: {
      url: { type: String, required: true },
      type: { type: String, enum: ["image", "video"], default: "image" },
      duration: { type: Number, default: 5 },
    },
    caption: { type: String, default: "" },
    views: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB TTL index
    },
  },
  { timestamps: true }
);

export const Story: Model<IStory> =
  mongoose.models.Story || mongoose.model<IStory>("Story", StorySchema);
export default Story;

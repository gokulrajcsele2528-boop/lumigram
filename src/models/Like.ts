import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  targetType: "post" | "comment" | "reel";
  targetId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetType: { type: String, enum: ["post", "comment", "reel"], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

LikeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

export const Like: Model<ILike> =
  mongoose.models.Like || mongoose.model<ILike>("Like", LikeSchema);
export default Like;

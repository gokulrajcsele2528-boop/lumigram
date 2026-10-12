import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash?: string;
  phone?: string;
  birthday?: Date;
  fullName: string;
  avatar: string;
  bio?: string;
  website?: string;
  isPrivate: boolean;
  isVerified?: boolean;
  emailVerified: boolean;
  googleId?: string;
  loginAttempts: number;
  lockUntil?: Date | null;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  lastLoginAt?: Date;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  interestTopics: string[];
  mutedTopics: string[];
  feedPreference: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  // Helper virtual / method
  isLocked(): boolean;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    phone: {
      type: String,
      sparse: true,
      index: true,
      trim: true,
      default: undefined,
    },
    birthday: {
      type: Date,
    },
    fullName: {
      type: String,
      default: "",
      trim: true,
    },
    avatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 150,
    },
    website: {
      type: String,
      default: "",
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
      default: undefined,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    lastLoginAt: {
      type: Date,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    interestTopics: {
      type: [String],
      default: [],
    },
    mutedTopics: {
      type: [String],
      default: [],
    },
    feedPreference: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Method to determine if account is locked
UserSchema.methods.isLocked = function (this: IUser): boolean {
  return !!(this.lockUntil && this.lockUntil.getTime() > Date.now());
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

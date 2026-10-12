import { z } from "zod";

export const exploreQuerySchema = z.object({
  type: z.enum(["all", "posts", "reels", "stories"]).default("all"),
  filter: z.enum(["trending", "latest", "photos", "videos", "following"]).default("trending"),
  topic: z.string().optional().default(""),
  q: z.string().optional().default(""),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(18),
});

export const createPostSchema = z.object({
  caption: z.string().max(2200).optional().default(""),
  media: z
    .array(
      z.object({
        url: z.string().url(),
        type: z.enum(["image", "video"]),
        thumbnailUrl: z.string().optional(),
        aspectRatio: z.string().optional().default("1:1"),
      })
    )
    .min(1, "At least one media item is required")
    .max(10, "Maximum 10 media items allowed"),
  location: z.string().optional(),
  hashtags: z.array(z.string()).optional().default([]),
  topic: z.string().optional().default("General"),
});

export const createCommentSchema = z.object({
  text: z.string().min(1).max(1000),
  parentCommentId: z.string().optional(),
});

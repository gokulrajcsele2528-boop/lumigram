import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
import { connectToDatabase } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { Reel } from "@/models/Reel";
import { Story } from "@/models/Story";
import { exploreQuerySchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import {
  SEED_POSTS,
  SEED_REELS,
  SEED_STORIES,
  ExploreItem,
  PostItem,
  ReelItem,
  StoryItem,
} from "@/lib/mockData";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());

    // Validate query parameters using Zod
    const parsed = exploreQuerySchema.safeParse(searchParams);
    if (!parsed.success) {
      return errorResponse("Invalid query parameters", 400, parsed.error.format());
    }

    const { type, filter, topic, q, cursor, limit } = parsed.data;

    // Try MongoDB Atlas connection
    const mongooseConn = await connectToDatabase();

    if (mongooseConn) {
      // ----------------------------------------------------
      // MONGODB AGGREGATION PIPELINES
      // ----------------------------------------------------
      const skipCount = cursor ? parseInt(cursor, 10) || 0 : 0;

      if (type === "posts") {
        const matchStage: any = {};
        if (topic && topic !== "All") {
          matchStage.topic = new RegExp(topic, "i");
        }
        if (q) {
          matchStage.$or = [
            { caption: { $regex: q, $options: "i" } },
            { hashtags: { $in: [new RegExp(q, "i")] } },
            { location: { $regex: q, $options: "i" } },
          ];
        }

        const sortStage: any =
          filter === "latest"
            ? { createdAt: -1 }
            : { likesCount: -1, commentsCount: -1 };

        const posts = await Post.aggregate([
          { $match: matchStage },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "author",
            },
          },
          { $unwind: "$author" },
          { $match: { "author.isPrivate": { $ne: true } } },
          { $sort: sortStage },
          { $skip: skipCount },
          { $limit: limit + 1 },
          {
            $project: {
              id: "$_id",
              type: { $literal: "post" },
              author: {
                id: "$author._id",
                username: "$author.username",
                fullName: "$author.fullName",
                avatar: "$author.avatar",
                isVerified: "$author.isVerified",
              },
              media: 1,
              caption: 1,
              hashtags: 1,
              location: 1,
              topic: 1,
              likesCount: 1,
              commentsCount: 1,
              createdAt: 1,
            },
          },
        ]);

        if (posts.length > 0) {
          const hasMore = posts.length > limit;
          const items = hasMore ? posts.slice(0, limit) : posts;
          const nextCursor = hasMore ? (skipCount + limit).toString() : null;

          return successResponse({
            items,
            nextCursor,
            total: items.length,
            type,
          });
        }
      }

      if (type === "reels") {
        const matchStage: any = {};
        if (topic && topic !== "All") {
          matchStage.topic = new RegExp(topic, "i");
        }
        if (q) {
          matchStage.$or = [
            { caption: { $regex: q, $options: "i" } },
            { audioTitle: { $regex: q, $options: "i" } },
          ];
        }

        const sortStage: any =
          filter === "latest"
            ? { createdAt: -1 }
            : { viewsCount: -1, likesCount: -1 };

        const reels = await Reel.aggregate([
          { $match: matchStage },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "author",
            },
          },
          { $unwind: "$author" },
          { $match: { "author.isPrivate": { $ne: true } } },
          { $sort: sortStage },
          { $skip: skipCount },
          { $limit: limit + 1 },
          {
            $project: {
              id: "$_id",
              type: { $literal: "reel" },
              author: {
                id: "$author._id",
                username: "$author.username",
                fullName: "$author.fullName",
                avatar: "$author.avatar",
                isVerified: "$author.isVerified",
              },
              videoUrl: 1,
              thumbnailUrl: 1,
              caption: 1,
              audioTitle: 1,
              likesCount: 1,
              commentsCount: 1,
              viewsCount: 1,
              topic: 1,
              duration: 1,
              createdAt: 1,
            },
          },
        ]);

        if (reels.length > 0) {
          const hasMore = reels.length > limit;
          const items = hasMore ? reels.slice(0, limit) : reels;
          const nextCursor = hasMore ? (skipCount + limit).toString() : null;

          return successResponse({
            items,
            nextCursor,
            total: items.length,
            type,
          });
        }
      }

      if (type === "stories") {
        const stories = await Story.aggregate([
          { $match: { expiresAt: { $gt: new Date() } } },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "author",
            },
          },
          { $unwind: "$author" },
          { $match: { "author.isPrivate": { $ne: true } } },
          { $sort: { createdAt: -1 } },
          {
            $project: {
              id: "$_id",
              type: { $literal: "story" },
              author: {
                id: "$author._id",
                username: "$author.username",
                fullName: "$author.fullName",
                avatar: "$author.avatar",
                isVerified: "$author.isVerified",
              },
              media: 1,
              caption: 1,
              expiresAt: 1,
              seen: { $literal: false },
              createdAt: 1,
            },
          },
        ]);

        if (stories.length > 0) {
          return successResponse({
            items: stories,
            nextCursor: null,
            total: stories.length,
            type,
          });
        }
      }
    }

    // ----------------------------------------------------
    // IN-MEMORY HIGH-SPEED PIPELINE (SEED DATASET)
    // ----------------------------------------------------
    if (type === "posts") {
      let items = [...SEED_POSTS];

      if (topic && topic !== "All") {
        items = items.filter((p) => p.topic.toLowerCase() === topic.toLowerCase());
      }

      if (q) {
        const queryLower = q.toLowerCase();
        items = items.filter(
          (p) =>
            p.caption.toLowerCase().includes(queryLower) ||
            p.author.username.toLowerCase().includes(queryLower) ||
            p.hashtags.some((h) => h.toLowerCase().includes(queryLower)) ||
            (p.location && p.location.toLowerCase().includes(queryLower))
        );
      }

      if (filter === "latest") {
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else {
        items.sort((a, b) => b.likesCount * 2 + b.commentsCount * 3 - (a.likesCount * 2 + a.commentsCount * 3));
      }

      return successResponse({
        items,
        nextCursor: null,
        total: items.length,
        type: "posts",
      });
    }

    if (type === "reels") {
      let items = [...SEED_REELS];

      if (topic && topic !== "All") {
        items = items.filter((r) => r.topic.toLowerCase() === topic.toLowerCase());
      }

      if (q) {
        const queryLower = q.toLowerCase();
        items = items.filter(
          (r) =>
            r.caption.toLowerCase().includes(queryLower) ||
            r.author.username.toLowerCase().includes(queryLower) ||
            r.audioTitle.toLowerCase().includes(queryLower)
        );
      }

      if (filter === "latest") {
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else {
        items.sort((a, b) => b.viewsCount - a.viewsCount);
      }

      return successResponse({
        items,
        nextCursor: null,
        total: items.length,
        type: "reels",
      });
    }

    if (type === "stories") {
      let items: StoryItem[] = [...SEED_STORIES];

      if (q) {
        const queryLower = q.toLowerCase();
        items = items.filter(
          (s) =>
            s.author.username.toLowerCase().includes(queryLower) ||
            s.author.fullName.toLowerCase().includes(queryLower) ||
            (s.caption && s.caption.toLowerCase().includes(queryLower))
        );
      }

      return successResponse({
        items,
        nextCursor: null,
        total: items.length,
        type: "stories",
      });
    }

    // Default: "all" tab -> Blend posts and reels
    let postItems: PostItem[] = [...SEED_POSTS];
    let reelItems: ReelItem[] = [...SEED_REELS];

    if (topic && topic !== "All") {
      postItems = postItems.filter((p) => p.topic.toLowerCase() === topic.toLowerCase());
      reelItems = reelItems.filter((r) => r.topic.toLowerCase() === topic.toLowerCase());
    }

    if (q) {
      const queryLower = q.toLowerCase();
      postItems = postItems.filter(
        (p) =>
          p.caption.toLowerCase().includes(queryLower) ||
          p.author.username.toLowerCase().includes(queryLower) ||
          p.hashtags.some((h) => h.toLowerCase().includes(queryLower))
      );
      reelItems = reelItems.filter(
        (r) =>
          r.caption.toLowerCase().includes(queryLower) ||
          r.author.username.toLowerCase().includes(queryLower)
      );
    }

    if (filter === "photos") {
      return successResponse({
        items: postItems,
        nextCursor: null,
        total: postItems.length,
        type: "all",
      });
    }

    if (filter === "videos") {
      return successResponse({
        items: reelItems,
        nextCursor: null,
        total: reelItems.length,
        type: "all",
      });
    }

    // Interleave posts and reels naturally like Instagram Explore mosaic
    const blended: ExploreItem[] = [];
    let pIdx = 0;
    let rIdx = 0;

    while (pIdx < postItems.length || rIdx < reelItems.length) {
      if (pIdx < postItems.length) blended.push(postItems[pIdx++]);
      if (pIdx < postItems.length) blended.push(postItems[pIdx++]);
      if (rIdx < reelItems.length) blended.push(reelItems[rIdx++]);
    }

    return successResponse({
      items: blended,
      nextCursor: null,
      total: blended.length,
      type: "all",
    });
  } catch (error: any) {
    return errorResponse("Failed to fetch explore feed", 500, error);
  }
}

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Post } from "@/models/Post";
import { Reel } from "@/models/Reel";
import { Story } from "@/models/Story";
import { SEED_USERS, SEED_POSTS, SEED_REELS, SEED_STORIES } from "@/lib/mockData";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function POST() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return errorResponse("Database connection unavailable for seeding.", 503);
    }

    // Clear existing explore demo collections
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Reel.deleteMany({}),
      Story.deleteMany({}),
    ]);

    // Insert Users
    const userDocs = await User.insertMany(
      SEED_USERS.map((u) => ({
        username: u.username,
        email: `${u.username}@example.com`,
        fullName: u.fullName,
        avatar: u.avatar,
        isVerified: u.isVerified || false,
        isPrivate: false,
        followersCount: Math.floor(Math.random() * 50000) + 1200,
        followingCount: Math.floor(Math.random() * 800) + 150,
        postsCount: 12,
        interestTopics: ["Travel", "Food", "Tech", "Art"],
      }))
    );

    const userMap = new Map();
    userDocs.forEach((u) => userMap.set(u.username, u._id));

    // Insert Posts
    const postDocs = await Post.insertMany(
      SEED_POSTS.map((p) => ({
        author: userMap.get(p.author.username) || userDocs[0]._id,
        media: p.media,
        caption: p.caption,
        hashtags: p.hashtags,
        location: p.location,
        topic: p.topic,
        likesCount: p.likesCount,
        commentsCount: p.commentsCount,
        createdAt: new Date(p.createdAt),
      }))
    );

    // Insert Reels
    const reelDocs = await Reel.insertMany(
      SEED_REELS.map((r) => ({
        author: userMap.get(r.author.username) || userDocs[0]._id,
        videoUrl: r.videoUrl,
        thumbnailUrl: r.thumbnailUrl,
        caption: r.caption,
        audioTitle: r.audioTitle,
        likesCount: r.likesCount,
        commentsCount: r.commentsCount,
        viewsCount: r.viewsCount,
        topic: r.topic,
        duration: r.duration,
        createdAt: new Date(r.createdAt),
      }))
    );

    // Insert Stories (24h TTL)
    const storyDocs = await Story.insertMany(
      SEED_STORIES.map((s) => ({
        author: userMap.get(s.author.username) || userDocs[0]._id,
        media: s.media,
        caption: s.caption,
        views: [],
        expiresAt: new Date(s.expiresAt),
        createdAt: new Date(s.createdAt),
      }))
    );

    return successResponse({
      seeded: {
        users: userDocs.length,
        posts: postDocs.length,
        reels: reelDocs.length,
        stories: storyDocs.length,
      },
      message: "Database seeded successfully with realistic creators and content!",
    });
  } catch (error: any) {
    return errorResponse("Failed to seed database", 500, error);
  }
}

export interface Author {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  isVerified?: boolean;
}

export interface PostItem {
  id: string;
  type: "post";
  author: Author;
  media: Array<{
    url: string;
    type: "image" | "video";
    thumbnailUrl?: string;
    aspectRatio?: string;
  }>;
  caption: string;
  hashtags: string[];
  location?: string;
  topic: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface ReelItem {
  id: string;
  type: "reel";
  author: Author;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  audioTitle: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  topic: string;
  duration: number;
  createdAt: string;
}

export interface StoryItem {
  id: string;
  type: "story";
  author: Author;
  media: {
    url: string;
    type: "image" | "video";
    duration?: number;
  };
  caption?: string;
  expiresAt: string;
  seen: boolean;
  createdAt: string;
}

export type ExploreItem = (PostItem | ReelItem) & { score?: number };

export const SEED_USERS: Author[] = [
  {
    id: "u1",
    username: "alex.traveler",
    fullName: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    id: "u2",
    username: "chef_marina",
    fullName: "Marina Vance",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    id: "u3",
    username: "tech_insider",
    fullName: "Karthik Raja",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    id: "u4",
    username: "art_by_priya",
    fullName: "Priya Sundaram",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    isVerified: false,
  },
  {
    id: "u5",
    username: "urban_fashion",
    fullName: "Liam Zhao",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    id: "u6",
    username: "sonic_beats",
    fullName: "Ananya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    isVerified: false,
  },
  {
    id: "u7",
    username: "fitness_elite",
    fullName: "Marcus Cole",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    isVerified: false,
  },
  {
    id: "u8",
    username: "meme_vault",
    fullName: "The Meme Vault",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    isVerified: false,
  },
];

export const SEED_POSTS: PostItem[] = [
  {
    id: "p1",
    type: "post",
    author: SEED_USERS[0],
    media: [
      {
        url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80",
        type: "image",
      },
      {
        url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80",
        type: "image",
      },
    ],
    caption: "Golden hour road trip through the southern mountains 🌄 Nowhere else I'd rather be.",
    hashtags: ["travel", "wanderlust", "mountains", "explore"],
    location: "Swiss Alps, Switzerland",
    topic: "Travel",
    likesCount: 14200,
    commentsCount: 384,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "p2",
    type: "post",
    author: SEED_USERS[1],
    media: [
      {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        type: "image",
      },
    ],
    caption: "Freshly made handmade gnocchi with sage browned butter and shaved pecorino 🍝 Buon appetito!",
    hashtags: ["food", "italianfood", "chefspecial", "foodie"],
    location: "Florence, Italy",
    topic: "Food",
    likesCount: 9540,
    commentsCount: 246,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "p3",
    type: "post",
    author: SEED_USERS[2],
    media: [
      {
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        type: "image",
      },
    ],
    caption: "Silicon wafer macro view. The complexity of modern 2nm architectures is mind-boggling 💻🔬",
    hashtags: ["tech", "engineering", "chips", "hardware"],
    location: "Silicon Valley, CA",
    topic: "Tech",
    likesCount: 22800,
    commentsCount: 712,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "p4",
    type: "post",
    author: SEED_USERS[3],
    media: [
      {
        url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
        type: "image",
      },
    ],
    caption: "Midnight oil on canvas: 'Echoes of the Bay' 🎨 Finished after 42 hours of layering.",
    hashtags: ["art", "oilpainting", "contemporaryart", "gallery"],
    location: "Chennai Art District",
    topic: "Art",
    likesCount: 8120,
    commentsCount: 195,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "p5",
    type: "post",
    author: SEED_USERS[4],
    media: [
      {
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
        type: "image",
      },
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
        type: "image",
      },
    ],
    caption: "Monochrome autumn collection drop 🍂 Minimalist tailoring meets street luxury.",
    hashtags: ["fashion", "streetwear", "ootd", "style"],
    location: "Tokyo, Japan",
    topic: "Fashion",
    likesCount: 19400,
    commentsCount: 420,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    id: "p6",
    type: "post",
    author: SEED_USERS[6],
    media: [
      {
        url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
        type: "image",
      },
    ],
    caption: "Pushing limits every sunrise. Consistency beats talent every single day 🏋️‍♂️💪",
    hashtags: ["sports", "fitness", "workout", "athlete"],
    location: "Gold's Gym, Venice Beach",
    topic: "Sports",
    likesCount: 6300,
    commentsCount: 152,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "p7",
    type: "post",
    author: SEED_USERS[7],
    media: [
      {
        url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
        type: "image",
      },
    ],
    caption: "Me checking my code after fixing one bug and finding 17 new ones 😭💀",
    hashtags: ["memes", "devhumor", "relatable", "funny"],
    location: "Debugging Hell",
    topic: "Memes",
    likesCount: 34100,
    commentsCount: 1102,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: "p8",
    type: "post",
    author: SEED_USERS[5],
    media: [
      {
        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
        type: "image",
      },
    ],
    caption: "Acoustic recording session tonight. Magic happens when the melodies flow undisturbed 🎸🎶",
    hashtags: ["music", "studio", "acoustic", "singer"],
    location: "Sound City Studios",
    topic: "Music",
    likesCount: 11200,
    commentsCount: 318,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 35).toISOString(),
  },
  {
    id: "p9",
    type: "post",
    author: SEED_USERS[0],
    media: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        type: "image",
      },
    ],
    caption: "Turquoise water crystal clear as glass. Never leaving the tropics 🏝️🌊",
    hashtags: ["travel", "beach", "tropical", "summer"],
    location: "Maldives",
    topic: "Travel",
    likesCount: 27900,
    commentsCount: 850,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
  },
];

export const SEED_REELS: ReelItem[] = [
  {
    id: "r1",
    type: "reel",
    author: SEED_USERS[0],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    caption: "The most incredible canyon sunset I've ever witnessed 🏜️✨ Turn your sound on!",
    audioTitle: "Alex Rivera • Cinematic Sunset (Original)",
    likesCount: 88400,
    commentsCount: 1420,
    viewsCount: 642000,
    topic: "Travel",
    duration: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "r2",
    type: "reel",
    author: SEED_USERS[1],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
    caption: "Secret to 72-hour sourdough crust crunch test 🍕🔊 Listen to that crunch!",
    audioTitle: "Chef Marina • Crispy ASMR",
    likesCount: 45200,
    commentsCount: 830,
    viewsCount: 391000,
    topic: "Food",
    duration: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "r3",
    type: "reel",
    author: SEED_USERS[2],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    caption: "AI robotics live demonstration in Tokyo. Notice the hand articulation speed! 🤖⚡",
    audioTitle: "Tech Insider • Future Pulse",
    likesCount: 120500,
    commentsCount: 2310,
    viewsCount: 1250000,
    topic: "Tech",
    duration: 18,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    id: "r4",
    type: "reel",
    author: SEED_USERS[4],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    caption: "Transitioning 5 vintage outfits in 5 seconds ✨ Which one was your favorite? 1, 2, 3, 4, or 5?",
    audioTitle: "Liam Zhao • Beat Drop Mix",
    likesCount: 67300,
    commentsCount: 1140,
    viewsCount: 520000,
    topic: "Fashion",
    duration: 14,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "r5",
    type: "reel",
    author: SEED_USERS[5],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    caption: "Live drops on stage when the bass hits! 🎧🔥 Electric energy tonight!",
    audioTitle: "Ananya Sharma • Bassline Overdrive",
    likesCount: 93400,
    commentsCount: 1820,
    viewsCount: 880000,
    topic: "Music",
    duration: 16,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "r6",
    type: "reel",
    author: SEED_USERS[6],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    caption: "Insane 360 cliff dive flip! Don't try this at home 🏊‍♂️⚡",
    audioTitle: "Marcus Cole • Adrenaline Rush",
    likesCount: 154000,
    commentsCount: 3100,
    viewsCount: 1980000,
    topic: "Sports",
    duration: 20,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
];

export const SEED_STORIES: StoryItem[] = [
  {
    id: "s1",
    type: "story",
    author: SEED_USERS[0],
    media: {
      url: "https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?w=800&auto=format&fit=crop&q=80",
      type: "image",
      duration: 5,
    },
    caption: "Boarding the early flight to Reykjavik ✈️❄️",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    seen: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "s2",
    type: "story",
    author: SEED_USERS[1],
    media: {
      url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&auto=format&fit=crop&q=80",
      type: "image",
      duration: 5,
    },
    caption: "Morning prep in the test kitchen 🥐☕",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 14).toISOString(),
    seen: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
  {
    id: "s3",
    type: "story",
    author: SEED_USERS[2],
    media: {
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
      type: "image",
      duration: 5,
    },
    caption: "Hardware teardown session live in 30 mins! 🔌💻",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
    seen: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "s4",
    type: "story",
    author: SEED_USERS[3],
    media: {
      url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80",
      type: "image",
      duration: 5,
    },
    caption: "Color swatches for tomorrow's exhibition 🎨",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    seen: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "s5",
    type: "story",
    author: SEED_USERS[4],
    media: {
      url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
      type: "image",
      duration: 5,
    },
    caption: "Backstage fittings at fashion week 👗✨",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    seen: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
  },
  {
    id: "s6",
    type: "story",
    author: SEED_USERS[5],
    media: {
      url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
      type: "image",
      duration: 5,
    },
    caption: "Soundcheck vibes 🎤",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
    seen: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
];

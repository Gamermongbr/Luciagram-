export interface Profile {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  profilePic: string;
  followers: number;
  following: number;
  isVerified: boolean;
  postsCount: number;
  followingIds?: string[]; // IDs of profiles this user follows
}

export interface PostComment {
  id: string;
  profileId?: string;
  username?: string;
  profilePic?: string;
  text: string;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  profileId: string;
  type: 'image' | 'video';
  imageUrl: string;
  videoUrl?: string;
  caption: string;
  likes: number;
  createdAt: string;
  isLiked?: boolean; // Track if current user liked it
  comments?: PostComment[];
}

export interface Message {
  id: string;
  senderId: string; // 'me' or profileId
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  profileId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  messages: Message[];
}

export interface AppState {
  profiles: Profile[];
  posts: Post[];
  currentUserProfileId: string | null;
}

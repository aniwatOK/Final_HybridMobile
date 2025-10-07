import { create } from "zustand";

/** ---------- Types ---------- */
export type User = {
  id: string;
  name: string;
  token?: string; // Bearer (JWT)
};

export type Comment = {
  id: string;
  postId: string;
  author: string;
  text: string;
  createdAt: number;
};

export type Post = {
  id: string;
  author: string;
  text: string;
  likes: number;
  likedByMe: boolean;
  createdAt: number;
  comments: Comment[];
};

/** ---------- Auth Store (Signin + API Key) ---------- */
type AuthState = {
  user: User | null;
  isLoggedIn: boolean;

  email?: string;
  apiKey?: string;
  bearer?: string;

  // actions
  loginWithBearer: (p: { name?: string; email: string; apiKey: string; bearer: string }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  email: undefined,
  apiKey: undefined,
  bearer: undefined,

  loginWithBearer: ({ name, email, apiKey, bearer }) =>
    set({
      user: { id: "u1", name: name || email, token: bearer },
      isLoggedIn: true,
      email,
      apiKey,
      bearer,
    }),

  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
      email: undefined,
      apiKey: undefined,
      bearer: undefined,
    }),
}));

/** ---------- Feed Store (โพสต์/ไลก์/คอมเมนต์) ---------- */
type FeedState = {
  posts: Post[];
  addPost: (text: string, author: string) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, author: string, text: string) => void;
};

export const useFeedStore = create<FeedState>((set) => ({
  posts: [
    {
      id: "p1",
      author: "System",
      text: "ยินดีต้อนรับสู่ KKU CIS Social 🎉",
      likes: 0,
      likedByMe: false,
      createdAt: Date.now(),
      comments: [],
    },
  ],
  addPost: (text, author) =>
    set((state) => ({
      posts: [
        {
          id: `p_${Date.now()}`,
          author,
          text,
          likes: 0,
          likedByMe: false,
          createdAt: Date.now(),
          comments: [],
        },
        ...state.posts,
      ],
    })),
  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likes: p.likedByMe ? p.likes - 1 : p.likes + 1,
            }
          : p
      ),
    })),
  addComment: (postId, author, text) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `c_${Date.now()}`,
                  postId,
                  author,
                  text,
                  createdAt: Date.now(),
                },
              ],
            }
          : p
      ),
    })),
}));

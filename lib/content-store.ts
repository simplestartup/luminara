import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export type Content = {
  id: string;
  title: string;
  type: string;
  platform: string;
  genre: string[];
  releaseDate: string;
  watched: boolean;
  rating: number | null;
  image: string;
  host?: string;
  episodeCount?: number;
  duration?: string;
};

export type Playlist = {
  id: string;
  name: string;
  description: string;
  contentIds: string[];
  createdAt: string;
  updatedAt: string;
  type: "regular" | "smart";
  rules?: SmartPlaylistRule[];
  visibility: "private" | "public" | "shared";
};

export type SmartPlaylistRule = {
  field: string;
  operator: string;
  value: string;
};

type ContentStore = {
  items: Content[];
  playlists: Playlist[];
  addContent: (
    content: Omit<Content, "id" | "watched" | "rating" | "image">
  ) => void;
  updateContent: (id: string, updates: Partial<Content>) => void;
  removeContent: (id: string) => void;
  createPlaylist: (name: string, description: string) => void;
  createSmartPlaylist: (
    name: string,
    description: string,
    rules: SmartPlaylistRule[]
  ) => void;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, contentId: string) => void;
  removeFromPlaylist: (playlistId: string, contentId: string) => void;
  getContentImage: (title: string, type: string) => string;
  getSmartPlaylistContent: (playlist: Playlist) => Content[];
};

// Content posters mapping with normalized titles as keys
const contentPosters: Record<string, string> = {
  // ... (keep existing content posters)
};

const fallbackImages = {
  movie:
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1920&h=1080&fit=crop",
  series:
    "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1920&h=1080&fit=crop",
  documentary:
    "https://images.unsplash.com/photo-1552800631-5fba77be42c8?q=80&w=1920&h=1080&fit=crop",
  podcast:
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1920&h=1080&fit=crop",
};

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[:\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s*\([^)]*\)/g, "");
}

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      items: [],
      playlists: [],

      addContent: (content) => {
        const normalizedTitle = normalizeTitle(content.title);
        const image = get().getContentImage(normalizedTitle, content.type);

        set((state) => ({
          items: [
            ...state.items,
            {
              ...content,
              id: uuidv4(),
              watched: false,
              rating: null,
              image,
            },
          ],
        }));
      },

      updateContent: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      removeContent: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          playlists: state.playlists.map((playlist) => ({
            ...playlist,
            contentIds: playlist.contentIds.filter(
              (contentId) => contentId !== id
            ),
          })),
        }));
      },

      createPlaylist: (name, description) => {
        set((state) => ({
          playlists: [
            ...state.playlists,
            {
              id: uuidv4(),
              name,
              description,
              contentIds: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              type: "regular",
              visibility: "private",
            },
          ],
        }));
      },

      createSmartPlaylist: (name, description, rules) => {
        set((state) => ({
          playlists: [
            ...state.playlists,
            {
              id: uuidv4(),
              name,
              description,
              contentIds: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              type: "smart",
              rules,
              visibility: "private",
            },
          ],
        }));
      },

      updatePlaylist: (id, updates) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === id
              ? { ...playlist, ...updates, updatedAt: new Date().toISOString() }
              : playlist
          ),
        }));
      },

      deletePlaylist: (id) => {
        set((state) => ({
          playlists: state.playlists.filter((playlist) => playlist.id !== id),
        }));
      },

      addToPlaylist: (playlistId, contentId) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId &&
            !playlist.contentIds.includes(contentId)
              ? {
                  ...playlist,
                  contentIds: [...playlist.contentIds, contentId],
                  updatedAt: new Date().toISOString(),
                }
              : playlist
          ),
        }));
      },

      removeFromPlaylist: (playlistId, contentId) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  contentIds: playlist.contentIds.filter(
                    (id) => id !== contentId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : playlist
          ),
        }));
      },

      getContentImage: (title: string, type: string) => {
        const normalizedTitle = normalizeTitle(title);

        // Try exact match
        if (contentPosters[normalizedTitle]) {
          return contentPosters[normalizedTitle];
        }

        // Try partial matches
        const partialMatch = Object.entries(contentPosters).find(
          ([key]) =>
            normalizedTitle.includes(key) || key.includes(normalizedTitle)
        );

        if (partialMatch) {
          return partialMatch[1];
        }

        // Fallback to type-based image
        return (
          fallbackImages[type as keyof typeof fallbackImages] ||
          fallbackImages.movie
        );
      },

      getSmartPlaylistContent: (playlist: Playlist) => {
        if (playlist.type !== "smart" || !playlist.rules) return [];

        const { items } = get();
        return items.filter((item) => {
          return playlist.rules?.every((rule) => {
            const itemValue = item[rule.field as keyof Content];
            switch (rule.operator) {
              case "equals":
                return itemValue === rule.value;
              case "contains":
                return String(itemValue)
                  .toLowerCase()
                  .includes(rule.value.toLowerCase());
              case "greater":
                return Number(itemValue) > Number(rule.value);
              case "less":
                return Number(itemValue) < Number(rule.value);
              default:
                return false;
            }
          });
        });
      },
    }),
    {
      name: "content-store",
    }
  )
);

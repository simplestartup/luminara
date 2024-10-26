"use client";

import { useState } from "react";
import ContentCard from "./content-card";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useContentStore } from "@/lib/content-store";

interface ContentGridProps {
  type?: string;
  filter?: "favorites" | "watchLater" | "history" | "rated";
}

export default function ContentGrid({ type, filter }: ContentGridProps) {
  const [search, setSearch] = useState("");
  const { items } = useContentStore();

  const filteredItems = items
    .filter((item) => !type || item.type === type)
    .filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.genre.some((g) => g.toLowerCase().includes(search.toLowerCase()))
    )
    .filter((item) => {
      if (!filter) return true;
      switch (filter) {
        case "favorites":
          return item.rating === 5;
        case "watchLater":
          return !item.watched;
        case "history":
          return item.watched;
        case "rated":
          return item.rating !== null;
        default:
          return true;
      }
    });

  return (
    <div className="space-y-6">
      <div className="relative max-w-md w-full mx-auto md:mx-0">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title or genre..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {filteredItems.map((item) => {
          // Ensure item.platform is one of the allowed types
          const validPlatforms: Array<
            | "netflix"
            | "prime"
            | "apple"
            | "hbo"
            | "disney"
            | "theaters"
            | "youtube"
            | "spotify"
            | "applepodcasts"
          > = [
            "netflix",
            "prime",
            "apple",
            "hbo",
            "disney",
            "theaters",
            "youtube",
            "spotify",
            "applepodcasts",
          ];

          if (!validPlatforms.includes(item.platform as any)) {
            return null; // Skip invalid items
          }

          return (
            <ContentCard
              key={item.id}
              content={
                item as {
                  id: string;
                  title: string;
                  type: string;
                  platform:
                    | "netflix"
                    | "prime"
                    | "apple"
                    | "hbo"
                    | "disney"
                    | "theaters"
                    | "youtube"
                    | "spotify"
                    | "applepodcasts";
                  genre: string[];
                  releaseDate: string;
                  duration?: string;
                  watched: boolean;
                  rating: number;
                  image: string;
                }
              }
            />
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {search ? "No results found" : "No content added yet"}
          </p>
        </div>
      )}
    </div>
  );
}

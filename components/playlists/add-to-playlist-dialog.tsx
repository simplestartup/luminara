"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Film } from "lucide-react";
import { useState } from "react";
import { useContentStore, type Content, type Playlist } from "@/lib/content-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AddToPlaylistDialogProps {
  playlist: Playlist;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddToPlaylistDialog({
  playlist,
  open,
  onOpenChange
}: AddToPlaylistDialogProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { items, addToPlaylist } = useContentStore();

  // Filter out items already in the playlist
  const availableContent = items.filter(item => !playlist.contentIds.includes(item.id));

  const filteredContent = availableContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.genre.some(g => g.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddToPlaylist = (content: Content) => {
    addToPlaylist(playlist.id, content.id);
    toast.success(`Added "${content.title}" to playlist`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Content to {playlist.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or genre..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="movie">Movies</SelectItem>
              <SelectItem value="series">TV Series</SelectItem>
              <SelectItem value="documentary">Documentaries</SelectItem>
              <SelectItem value="podcast">Podcasts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {availableContent.length === 0 ? (
          <div className="text-center py-12">
            <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No content available</h3>
            <p className="text-muted-foreground">
              Add some content to your library first
            </p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="relative group cursor-pointer"
                onClick={() => handleAddToPlaylist(item)}
              >
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary">Add to Playlist</Button>
                </div>
                <div className="mt-2">
                  <h4 className="font-medium line-clamp-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredContent.length === 0 && availableContent.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No results found for "{search}"
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
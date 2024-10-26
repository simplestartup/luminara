"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Star, Clock, Check, Pencil, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useContentStore } from "@/lib/content-store";
import { toast } from "sonner";

const platformColors = {
  netflix: "bg-red-500",
  prime: "bg-blue-500",
  apple: "bg-gray-500",
  hbo: "bg-purple-500",
  disney: "bg-blue-600",
  theaters: "bg-amber-500",
  youtube: "bg-red-600",
  spotify: "bg-green-500",
  applepodcasts: "bg-purple-600"
};

interface ContentCardProps {
  content: {
    id: string;
    title: string;
    type: string;
    platform: keyof typeof platformColors;
    genre: string[];
    releaseDate: string;
    watched: boolean;
    rating: number | null;
    image: string;
    host?: string;
    episodeCount?: number;
    duration?: string;
  };
}

export default function ContentCard({ content }: ContentCardProps) {
  const { updateContent, removeContent } = useContentStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  const handleWatchedToggle = () => {
    updateContent(content.id, { watched: !content.watched });
  };

  const handleRating = (value: number) => {
    updateContent(content.id, { 
      rating: content.rating === value ? null : value 
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const confirmDelete = () => {
    removeContent(content.id);
    setIsDeleting(false);
    toast.success("Content removed successfully");
  };

  const handleSave = () => {
    updateContent(content.id, editedContent);
    setIsEditing(false);
    toast.success("Changes saved successfully");
  };

  return (
    <>
      <Card className="overflow-hidden group h-full flex flex-col">
        <div className="relative pt-[150%]">
          <img
            src={content.image}
            alt={content.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleWatchedToggle}>
              {content.watched ? <Check className="mr-2 h-4 w-4" /> : <Clock className="mr-2 h-4 w-4" />}
              {content.watched ? "Watched" : "Watch Later"}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowAddToPlaylist(true)}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        </div>

        <CardContent className="flex-1 p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-lg line-clamp-1">{content.title}</h3>
            <Badge variant="secondary" className={cn("text-white ml-2 shrink-0", platformColors[content.platform])}>
              {content.platform}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {content.genre.map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            {format(new Date(content.releaseDate), "MMM d, yyyy")}
          </p>

          {content.host && (
            <p className="text-sm text-muted-foreground mt-1">
              Host: {content.host}
            </p>
          )}

          {content.episodeCount && (
            <p className="text-sm text-muted-foreground mt-1">
              Episodes: {content.episodeCount}
            </p>
          )}

          {content.duration && (
            <p className="text-sm text-muted-foreground mt-1">
              Duration: {content.duration}
            </p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    content.rating && star <= content.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit {content.title}</DialogTitle>
            <DialogDescription>
              Make changes to your content. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={editedContent.title}
                onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Platform</Label>
              <Select
                value={editedContent.platform}
                onValueChange={(value: any) => setEditedContent({ ...editedContent, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="netflix">Netflix</SelectItem>
                  <SelectItem value="prime">Prime Video</SelectItem>
                  <SelectItem value="apple">Apple TV+</SelectItem>
                  <SelectItem value="hbo">HBO Max</SelectItem>
                  <SelectItem value="disney">Disney+</SelectItem>
                  <SelectItem value="theaters">In Theaters</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="spotify">Spotify</SelectItem>
                  <SelectItem value="applepodcasts">Apple Podcasts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Content</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove "{content.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
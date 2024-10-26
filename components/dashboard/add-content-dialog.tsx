"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Film, 
  Tv, 
  Video, 
  Mic, 
  MonitorPlay,
  PlayCircle,
  Tv2,
  Youtube,
  Clapperboard,
  Music,
  Theater,
  CalendarIcon,
  Plus
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useContentStore } from "@/lib/content-store";

const contentTypes = [
  {
    id: "movie",
    label: "Movie",
    icon: Film,
    description: "Feature films and movies"
  },
  {
    id: "series",
    label: "Series",
    icon: Tv,
    description: "TV shows and web series"
  },
  {
    id: "documentary",
    label: "Documentary",
    icon: Video,
    description: "Documentaries and educational content"
  },
  {
    id: "podcast",
    label: "Podcast",
    icon: Mic,
    description: "Audio shows and podcasts"
  }
];

const platforms = [
  {
    id: "netflix",
    name: "Netflix",
    icon: MonitorPlay,
    types: ["movie", "series", "documentary"]
  },
  {
    id: "prime",
    name: "Prime Video",
    icon: PlayCircle,
    types: ["movie", "series", "documentary"]
  },
  {
    id: "apple",
    name: "Apple TV+",
    icon: Tv2,
    types: ["movie", "series", "documentary", "podcast"]
  },
  {
    id: "hbo",
    name: "HBO Max",
    icon: Youtube,
    types: ["movie", "series", "documentary"]
  },
  {
    id: "disney",
    name: "Disney+",
    icon: Clapperboard,
    types: ["movie", "series", "documentary"]
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    types: ["documentary", "podcast"]
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: Music,
    types: ["podcast"]
  },
  {
    id: "theaters",
    name: "In Theaters",
    icon: Theater,
    types: ["movie"]
  }
];

const genres = {
  movie: [
    "Action", "Adventure", "Animation", "Comedy", "Crime",
    "Drama", "Family", "Fantasy", "Horror", "Mystery",
    "Romance", "Science Fiction", "Thriller", "War", "Western"
  ],
  series: [
    "Action", "Adventure", "Animation", "Comedy", "Crime",
    "Drama", "Family", "Fantasy", "Horror", "Mystery",
    "Romance", "Science Fiction", "Thriller"
  ],
  documentary: [
    "Nature", "Science", "History", "Technology", "Society",
    "Culture", "Sports", "Music", "Art", "Biography"
  ],
  podcast: [
    "Technology", "Business", "News", "Comedy", "True Crime",
    "Society & Culture", "Health & Wellness", "Education",
    "Arts", "Science", "Sports", "Music", "Gaming",
    "History", "Personal Development"
  ]
};

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddContentDialog({ open, onOpenChange }: AddContentDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    type: "movie",
    platform: "",
    releaseDate: undefined as Date | undefined,
    genres: [] as string[],
    host: "",
    episodeCount: "",
    duration: ""
  });

  const { addContent } = useContentStore();

  const handleSubmit = () => {
    if (!formData.title || !formData.platform || !formData.releaseDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    addContent({
      title: formData.title,
      type: formData.type,
      platform: formData.platform,
      genre: formData.genres,
      releaseDate: formData.releaseDate.toISOString(),
      ...(formData.type === 'podcast' && {
        host: formData.host,
        episodeCount: parseInt(formData.episodeCount),
        duration: formData.duration
      })
    });
    
    toast.success("Content added successfully!");
    setFormData({
      title: "",
      type: "movie",
      platform: "",
      releaseDate: undefined,
      genres: [],
      host: "",
      episodeCount: "",
      duration: ""
    });
    setStep(1);
    onOpenChange(false);
  };

  const nextStep = () => {
    if (step === 1 && !formData.type) {
      toast.error("Please select a content type");
      return;
    }
    if (step === 2 && !formData.title) {
      toast.error("Please enter a title");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
          <DialogDescription>
            Add a new {formData.type} to your collection
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    className={cn(
                      "flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors",
                      formData.type === type.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    )}
                    onClick={() => setFormData({ ...formData, type: type.id })}
                  >
                    <Icon className="h-6 w-6" />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{type.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={`Enter ${formData.type} title`}
              />
            </div>

            {formData.type === 'podcast' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="host">Host</Label>
                  <Input
                    id="host"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    placeholder="Podcast host name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="episodeCount">Number of Episodes</Label>
                  <Input
                    id="episodeCount"
                    type="number"
                    value={formData.episodeCount}
                    onChange={(e) => setFormData({ ...formData, episodeCount: e.target.value })}
                    placeholder="Total episodes"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Average Episode Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 45 minutes"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData({ ...formData, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms
                    .filter((p) => p.types.includes(formData.type))
                    .map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        <div className="flex items-center">
                          <platform.icon className="mr-2 h-4 w-4" />
                          {platform.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Release Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.releaseDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.releaseDate ? format(formData.releaseDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.releaseDate}
                    onSelect={(date) => setFormData({ ...formData, releaseDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>Genre</Label>
              <Select
                value={formData.genres[0]}
                onValueChange={(value) => setFormData({ ...formData, genres: [value] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres[formData.type as keyof typeof genres].map((genre) => (
                    <SelectItem key={genre} value={genre.toLowerCase()}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Add Content</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContentStore } from "@/lib/content-store";
import { Sparkles } from "lucide-react";
import Image from "next/image";

interface Recommendation {
  title: string;
  reason: string;
  confidence: number;
  image: string;
}

export function AIRecommendations() {
  const { items } = useContentStore();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call to an AI service
    // For demo purposes, we'll generate recommendations based on user's content
    if (items.length === 0) return;

    const genres = items.flatMap(item => item.genre);
    const uniqueGenres = Array.from(new Set(genres));
    const favoriteGenres = uniqueGenres
      .map(genre => ({
        genre,
        count: genres.filter(g => g === genre).length
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(g => g.genre);

    const demoRecommendations: Recommendation[] = [
      {
        title: "Dune: Part Two",
        reason: `Based on your interest in ${favoriteGenres[0]} movies`,
        confidence: 95,
        image: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg"
      },
      {
        title: "Poor Things",
        reason: "Similar to other highly-rated movies in your collection",
        confidence: 88,
        image: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg"
      },
      {
        title: "True Detective: Night Country",
        reason: "Matches your watching patterns and preferences",
        confidence: 92,
        image: "https://image.tmdb.org/t/p/w500/pB6rZt885qxdw00eXHj5bXhOSw6.jpg"
      }
    ];

    setRecommendations(demoRecommendations);
  }, [items]);

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add some content first</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Start adding movies and shows to your library to get personalized recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((rec) => (
        <Card key={rec.title} className="overflow-hidden">
          <div className="relative aspect-video">
            <Image
              src={rec.image}
              alt={rec.title}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="line-clamp-1">{rec.title}</CardTitle>
              <div className="flex items-center gap-1 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">{rec.confidence}%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{rec.reason}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
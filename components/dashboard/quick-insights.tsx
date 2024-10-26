"use client";

import { useContentStore } from "@/lib/content-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Clock } from "lucide-react";

export default function QuickInsights() {
  const { items } = useContentStore();
  
  const watchedItems = items.filter(item => item.watched);
  const watchProgress = (watchedItems.length / items.length) * 100;
  
  const ratedItems = items.filter(item => item.rating !== null);
  const avgRating = ratedItems.length
    ? ratedItems.reduce((acc, item) => acc + (item.rating || 0), 0) / ratedItems.length
    : 0;

  const genres = items.flatMap(item => item.genre);
  const genreCounts = genres.reduce((acc, genre) => {
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topGenre = Object.entries(genreCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Quick Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Watch Progress
            </span>
            <span>{Math.round(watchProgress)}%</span>
          </div>
          <Progress value={watchProgress} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Average Rating</span>
            <span>{avgRating.toFixed(1)} / 5.0</span>
          </div>
          <Progress value={avgRating * 20} className="bg-muted" />
        </div>

        {topGenre && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Top Genre
            </span>
            <span className="font-medium capitalize">{topGenre}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
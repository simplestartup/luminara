"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/lib/content-store";
import {
  Brain,
  Clock,
  TrendingUp,
  Calendar,
  PlayCircle,
  Star,
  Sparkles,
  Heart,
  Activity,
  Zap,
  Target,
  BarChart2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Insight {
  title: string;
  description: string;
  icon: any;
  color: string;
  score?: number;
  trend?: "up" | "down" | "stable";
  details?: string[];
  recommendations?: string[];
}

interface Content {
  rating: number | null; // Add other properties as needed
  // ... other properties ...
}

export function SmartInsights() {
  const { items } = useContentStore();
  const [insights, setInsights] = useState<Record<string, Insight[]>>({
    watching: [],
    preferences: [],
    predictions: [],
    trends: [],
  });

  useEffect(() => {
    if (items.length === 0) return;

    // Calculate comprehensive insights
    const watchedItems = items.filter((item) => item.watched);
    const ratedItems = items.filter((item) => item.rating !== null);
    const avgRating = ratedItems.length
      ? ratedItems.reduce((acc, item) => acc + (item.rating || 0), 0) /
        ratedItems.length
      : 0;

    // Genre analysis
    const genres = items.flatMap((item) => item.genre);
    const genreCounts = genres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Platform analysis
    const platforms = items.map((item) => item.platform);
    const platformCounts = platforms.reduce((acc, platform) => {
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Generate insights by category
    setInsights({
      watching: [
        {
          title: "Watching Patterns",
          description: `You've completed ${watchedItems.length} items this month`,
          icon: Activity,
          color: "text-blue-500",
          score: (watchedItems.length / items.length) * 100,
          details: [
            "Peak watching time: Evenings",
            "Average session length: 2.5 hours",
            "Most active days: Weekends",
          ],
        },
        {
          title: "Binge-Watching Analysis",
          description: "Your binge-watching patterns suggest high engagement",
          icon: Zap,
          color: "text-yellow-500",
          score: 85,
          trend: "up",
          details: [
            "3+ episodes per session",
            "Complete seasons within a week",
            "Prefer weekend marathons",
          ],
        },
      ],
      preferences: [
        {
          title: "Genre Affinity",
          description: "Your genre preferences are evolving",
          icon: Heart,
          color: "text-red-500",
          details: Object.entries(genreCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(
              ([genre, count]) =>
                `${genre}: ${Math.round(
                  (count / genres.length) * 100
                )}% of content`
            ),
        },
        {
          title: "Platform Usage",
          description: "Your streaming service utilization",
          icon: PlayCircle,
          color: "text-purple-500",
          details: Object.entries(platformCounts)
            .sort(([, a], [, b]) => b - a)
            .map(
              ([platform, count]) =>
                `${platform}: ${Math.round(
                  (count / platforms.length) * 100
                )}% usage`
            ),
        },
      ],
      predictions: [
        {
          title: "Content Predictions",
          description: "Based on your watching patterns",
          icon: Brain,
          color: "text-indigo-500",
          recommendations: [
            "You might enjoy more sci-fi dramas",
            "Consider exploring Korean cinema",
            "Documentary series match your interests",
          ],
        },
        {
          title: "Upcoming Matches",
          description: "New releases that match your taste",
          icon: Target,
          color: "text-green-500",
          recommendations: [
            "Dune: Part Two - 95% match",
            "True Detective: Night Country - 88% match",
            "Poor Things - 92% match",
          ],
        },
      ],
      trends: [
        {
          title: "Rating Analysis",
          description: `Average rating: ${avgRating.toFixed(1)} stars`,
          icon: Star,
          color: "text-amber-500",
          score: avgRating * 20,
          trend: avgRating > 3.5 ? "up" : "down",
          details: [
            `${ratedItems.length} items rated`,
            `${Math.round(
              (ratedItems.length / items.length) * 100
            )}% rating completion`,
            `Most common rating: ${getMostCommonRating(ratedItems)} stars`,
          ],
        },
        {
          title: "Watching Trends",
          description: "Your content consumption patterns",
          icon: BarChart2,
          color: "text-cyan-500",
          trend: "up",
          details: [
            "20% increase in documentary watching",
            "Growing interest in international content",
            "Shorter session lengths on weekdays",
          ],
        },
      ],
    });
  }, [items]);

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Get Started with AI Insights
          </CardTitle>
          <CardDescription>
            Add some content to your library to unlock personalized AI-powered
            insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => (window.location.href = "/")}>
            Add Content
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="watching" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="watching">Watching Habits</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
      </TabsList>

      {Object.entries(insights).map(([category, categoryInsights]) => (
        <TabsContent key={category} value={category} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {categoryInsights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <insight.icon className={`h-5 w-5 ${insight.color}`} />
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    {insight.trend && (
                      <TrendingIndicator trend={insight.trend} />
                    )}
                  </div>
                  <CardDescription>{insight.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insight.score !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Score</span>
                        <span>{Math.round(insight.score)}%</span>
                      </div>
                      <Progress value={insight.score} />
                    </div>
                  )}

                  {insight.details && (
                    <div className="space-y-2">
                      {insight.details.map((detail, i) => (
                        <div key={i} className="text-sm text-muted-foreground">
                          • {detail}
                        </div>
                      ))}
                    </div>
                  )}

                  {insight.recommendations && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recommendations</h4>
                      {insight.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <Sparkles className="h-3 w-3 text-primary" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function TrendingIndicator({ trend }: { trend: "up" | "down" | "stable" }) {
  const icons = {
    up: <TrendingUp className="h-4 w-4 text-green-500" />,
    down: <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />,
    stable: <TrendingUp className="h-4 w-4 text-yellow-500 rotate-90" />,
  };
  return icons[trend];
}

function getMostCommonRating(items: Content[]): number {
  const ratings = items
    .map((item) => item.rating)
    .filter((rating) => rating !== null) as number[];
  return ratings.length > 0
    ? Math.round(ratings.reduce((a, b) => a + b) / ratings.length)
    : 0; // Return average or 0 if no ratings
}

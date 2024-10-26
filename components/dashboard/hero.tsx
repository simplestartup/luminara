"use client";

import { useContentStore } from "@/lib/content-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Sparkles, MonitorPlay } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardHero() {
  const router = useRouter();
  const { items } = useContentStore();
  const hasContent = items.length > 0;

  return (
    <Card className="bg-gradient-to-r from-primary to-violet-500 border-0 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <CardContent className="p-8 relative">
        <div className="max-w-2xl">
          {!hasContent ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <MonitorPlay className="h-12 w-12" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white animate-pulse" />
                </div>
                <h1 className="text-4xl font-bold">Welcome to Lumina</h1>
              </div>
              <p className="text-lg mb-6 text-blue-100">
                Your intelligent streaming companion. Track what you watch,
                discover new content, and get AI-powered recommendations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-blue-50"
                  onClick={() => router.push("/library")}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Content
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  onClick={() => router.push("/recommendations")}
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6" />
                <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
              </div>
              <p className="text-lg mb-6 text-blue-100">
                We've analyzed your watching patterns and have personalized
                recommendations ready for you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-blue-50"
                  onClick={() => router.push("/recommendations")}
                >
                  View Recommendations
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-primary hover:bg-white/20 dark:bg-white dark:text-blue-500 dark:border-gray-700"
                  onClick={() => router.push("/insights")}
                  style={{ backgroundColor: "white" }}
                >
                  See Insights
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

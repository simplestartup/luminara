import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardHeader = dynamic(() => import("@/components/dashboard/header"), {
  ssr: false,
});

const DashboardHero = dynamic(() => import("@/components/dashboard/hero"), {
  ssr: false,
});

const WatchProgress = dynamic(
  () => import("@/components/dashboard/watch-progress"),
  {
    ssr: false,
  }
);

const QuickInsights = dynamic(
  () => import("@/components/dashboard/quick-insights"),
  {
    ssr: false,
  }
);

const TopRecommendations = dynamic(
  () => import("@/components/dashboard/top-recommendations"),
  {
    ssr: false,
  }
);

const RecentActivity = dynamic(
  () => import("@/components/dashboard/recent-activity"),
  {
    ssr: false,
  }
);

const WatchlistPreview = dynamic(
  () => import("@/components/dashboard/watchlist-preview"),
  {
    ssr: false,
  }
);

const TrendingContent = dynamic(
  () => import("@/components/dashboard/trending-content"),
  {
    ssr: false,
  }
);

const ContentGrid = dynamic(
  () => import("@/components/dashboard/content-grid"),
  {
    ssr: false,
  }
);

export const metadata: Metadata = {
  title: "Lumina - Your Intelligent Streaming Companion",
  description:
    "Track, discover, and enhance your streaming experience with AI-powered insights",
};

export default function HomePage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader />
      <DashboardHero />

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1 p-1">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="series">TV Series</TabsTrigger>
          <TabsTrigger value="docs">Documentaries</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <ContentGrid />
        </TabsContent>
        <TabsContent value="movies" className="mt-0">
          <ContentGrid type="movie" />
        </TabsContent>
        <TabsContent value="series" className="mt-0">
          <ContentGrid type="series" />
        </TabsContent>
        <TabsContent value="docs" className="mt-0">
          <ContentGrid type="documentary" />
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WatchProgress />
        <QuickInsights />
        <WatchlistPreview />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <TopRecommendations />
        <RecentActivity />
      </div>

      <TrendingContent />
    </div>
  );
}

"use client";

import { useContentStore } from "@/lib/content-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TopRecommendations() {
  const router = useRouter();
  const { items } = useContentStore();

  const recommendations = [
    {
      title: "Dune: Part Two",
      image: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
      match: 95
    },
    {
      title: "Poor Things",
      image: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
      match: 88
    },
    {
      title: "True Detective: Night Country",
      image: "https://image.tmdb.org/t/p/w500/pB6rZt885qxdw00eXHj5bXhOSw6.jpg",
      match: 92
    }
  ];

  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Recommendations
        </CardTitle>
        <Button variant="ghost" onClick={() => router.push("/recommendations")}>
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec) => (
            <div key={rec.title} className="relative group cursor-pointer">
              <div className="relative rounded-lg overflow-hidden">
                {/* Set a fixed aspect ratio container */}
                <div className="pb-[150%]" /> {/* 2:3 aspect ratio */}
                <Image
                  src={rec.image}
                  alt={rec.title}
                  fill
                  className="absolute inset-0 object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium line-clamp-1">
                    {rec.title}
                  </h3>
                  <div className="flex items-center gap-1 text-white/90 mt-1">
                    <Sparkles className="h-3 w-3" />
                    <span className="text-sm">{rec.match}% Match</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
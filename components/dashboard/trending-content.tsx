"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import Image from "next/image";

const trendingContent = [
  {
    title: "Dune: Part Two",
    type: "movie",
    image: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    platform: "theaters",
    trending: 98
  },
  {
    title: "True Detective: Night Country",
    type: "series",
    image: "https://image.tmdb.org/t/p/w500/pB6rZt885qxdw00eXHj5bXhOSw6.jpg",
    platform: "hbo",
    trending: 95
  },
  {
    title: "Poor Things",
    type: "movie",
    image: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
    platform: "theaters",
    trending: 92
  }
];

export default function TrendingContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Now
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trendingContent.map((content) => (
            <div key={content.title} className="group relative">
              <div className="relative rounded-lg overflow-hidden">
                {/* Set a fixed aspect ratio container */}
                <div className="pb-[150%]" /> {/* 2:3 aspect ratio */}
                <Image
                  src={content.image}
                  alt={content.title}
                  fill
                  className="absolute inset-0 object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium line-clamp-1">
                    {content.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/90 mt-1">
                    <span className="text-sm capitalize">{content.type}</span>
                    <span className="text-xs">•</span>
                    <span className="text-sm capitalize">{content.platform}</span>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-primary" />
                    <span className="text-xs text-white">{content.trending}%</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Add to Watchlist
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
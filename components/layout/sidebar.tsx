"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeft,
  MonitorPlay,
  Home,
  Library,
  History,
  Clock,
  Heart,
  Film,
  Tv,
  Video,
  Brain,
  Sparkles,
  Settings,
  CreditCard,
  User,
  Star,
  List,
  Menu,
  Mic,
} from "lucide-react";

interface NavSectionProps {
  title: string;
  routes: {
    label: string;
    href: string;
    icon: any;
    color?: string;
  }[];
  isCollapsed: boolean;
}

export const mainRoutes = [
  { label: "Dashboard", href: "/", icon: Home, color: "text-blue-500" },
  {
    label: "Library",
    href: "/library",
    icon: Library,
    color: "text-indigo-500",
  },
];

export const libraryRoutes = [
  { label: "Movies", href: "/movies", icon: Film, color: "text-violet-500" },
  { label: "TV Series", href: "/series", icon: Tv, color: "text-purple-500" },
  {
    label: "Documentaries",
    href: "/documentaries",
    icon: Video,
    color: "text-fuchsia-500",
  },
  { label: "Podcasts", href: "/podcasts", icon: Mic, color: "text-pink-500" },
];

export const contentRoutes = [
  {
    label: "Watch History",
    href: "/history",
    icon: History,
    color: "text-pink-500",
  },
  {
    label: "Watch Later",
    href: "/watch-later",
    icon: Clock,
    color: "text-rose-500",
  },
  {
    label: "Favorites",
    href: "/favorites",
    icon: Heart,
    color: "text-red-500",
  },
  { label: "Reviews", href: "/reviews", icon: Star, color: "text-orange-500" },
  {
    label: "Playlists",
    href: "/playlists",
    icon: List,
    color: "text-amber-500",
  },
];

export const insightRoutes = [
  {
    label: "AI Insights",
    href: "/insights",
    icon: Brain,
    color: "text-emerald-500",
  },
  {
    label: "Recommendations",
    href: "/recommendations",
    icon: Sparkles,
    color: "text-teal-500",
  },
];

export const subscriptionRoutes = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    color: "text-gray-400",
  },
  {
    label: "Billing",
    href: "/billing",
    icon: CreditCard,
    color: "text-emerald-400",
  },
  { label: "Profile", href: "/profile", icon: User, color: "text-blue-400" },
];

function NavSection({ title, routes, isCollapsed }: NavSectionProps) {
  const pathname = usePathname();

  if (routes.length === 0) return null;

  return (
    <div className="mb-4">
      {!isCollapsed && (
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
          {title}
        </h2>
      )}
      <div className="space-y-1">
        {routes.map((route) => (
          <Tooltip key={route.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={route.href}
                className={cn(
                  "text-sm group flex w-full items-center font-medium cursor-pointer",
                  "hover:bg-accent hover:text-accent-foreground rounded-lg transition",
                  "px-3 h-10",
                  route.href === pathname
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                  isCollapsed && "justify-center"
                )}
              >
                <div
                  className={cn(
                    "flex items-center flex-1",
                    isCollapsed && "justify-center"
                  )}
                >
                  <route.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      route.color,
                      !isCollapsed && "mr-3"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="truncate">{route.label}</span>
                  )}
                </div>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent
                side="right"
                className="text-popover-foreground bg-popover"
              >
                {route.label}
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="p-0 w-[280px]">
            <div className="h-full bg-card text-card-foreground">
              <div className="px-4 py-6">
                <Link href="/" className="flex items-center px-2">
                  <div className="relative mr-3">
                    <MonitorPlay className="h-8 w-8 text-primary" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-violet-500 text-transparent bg-clip-text">
                    Lumina
                  </h1>
                </Link>
              </div>

              <div className="px-3 py-2">
                <NavSection
                  title="Main"
                  routes={mainRoutes}
                  isCollapsed={false}
                />
                <NavSection
                  title="Library"
                  routes={libraryRoutes}
                  isCollapsed={false}
                />
                <NavSection
                  title="Content"
                  routes={contentRoutes}
                  isCollapsed={false}
                />
                <NavSection
                  title="Insights"
                  routes={insightRoutes}
                  isCollapsed={false}
                />
                <div className="mt-auto pt-4 border-t border-border">
                  <NavSection
                    title=""
                    routes={subscriptionRoutes}
                    isCollapsed={false}
                  />
                  <div className="px-3 mt-4">
                    <Button
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-primary-foreground"
                      onClick={() => (window.location.href = "/billing")}
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "hidden md:block sticky top-0 h-screen border-r z-40",
          isCollapsed ? "w-[80px]" : "w-[280px]"
        )}
      >
        <div
          className={cn(
            "relative h-full bg-card text-card-foreground transition-all duration-300 flex flex-col",
            isCollapsed ? "w-[80px]" : "w-[280px]"
          )}
        >
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            variant="ghost"
            className={cn(
              "absolute -right-4 top-7 h-7 w-7 rounded-full border bg-background p-0 hover:bg-accent hidden md:flex",
              isCollapsed && "rotate-180"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="px-4 py-6">
            <Link
              href="/"
              className={cn(
                "flex items-center",
                isCollapsed ? "justify-center" : "px-2",
                "h-8"
              )}
            >
              {isCollapsed ? (
                <div className="relative">
                  <MonitorPlay className="h-8 w-8 text-primary" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse" />
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <MonitorPlay className="h-8 w-8 text-primary" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-violet-500 text-transparent bg-clip-text">
                    Lumina
                  </h1>
                </div>
              )}
            </Link>
          </div>

          <div className="flex-1 overflow-hidden hover:overflow-y-auto px-3">
            <NavSection
              title="Main"
              routes={mainRoutes}
              isCollapsed={isCollapsed}
            />
            <NavSection
              title="Library"
              routes={libraryRoutes}
              isCollapsed={isCollapsed}
            />
            <NavSection
              title="Content"
              routes={contentRoutes}
              isCollapsed={isCollapsed}
            />
            <NavSection
              title="Insights"
              routes={insightRoutes}
              isCollapsed={isCollapsed}
            />
          </div>

          <div className="mt-auto pt-4 border-t border-border px-3 pb-4">
            <NavSection
              title=""
              routes={subscriptionRoutes}
              isCollapsed={isCollapsed}
            />
            {!isCollapsed && (
              <div className="px-3 mt-4">
                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-primary-foreground"
                  onClick={() => (window.location.href = "/billing")}
                >
                  Upgrade to Pro
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

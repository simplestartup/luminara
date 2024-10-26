"use client";

import { useContentStore } from "@/lib/content-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#e5e7eb"];

export default function WatchProgress() {
  const { items } = useContentStore();
  
  const watchedItems = items.filter(item => item.watched);
  const unwatchedItems = items.filter(item => !item.watched);
  
  const data = [
    { name: "Watched", value: watchedItems.length },
    { name: "Unwatched", value: unwatchedItems.length }
  ];

  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watch Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Watched</span>
            <span className="text-sm text-muted-foreground">
              {watchedItems.length} items
            </span>
          </div>
          <Progress 
            value={(watchedItems.length / items.length) * 100} 
            className="h-2"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Unwatched</span>
            <span className="text-sm text-muted-foreground">
              {unwatchedItems.length} items
            </span>
          </div>
          <Progress 
            value={(unwatchedItems.length / items.length) * 100}
            className="h-2 [&>div]:bg-muted"
          />
        </div>
      </CardContent>
    </Card>
  );
}
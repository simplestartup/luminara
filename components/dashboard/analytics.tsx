// Update analytics to include podcast metrics
// Update the import path for useContentStore
import { useState, useEffect } from "react";
import { useContentStore } from "@/lib/content-store"; // Adjust the path as necessary

export default function Analytics() {
  const { items } = useContentStore();
  const [watchData, setWatchData] = useState([
    { name: "Watched/Listened", value: 0 },
    { name: "Pending", value: 0 },
  ]);

  useEffect(() => {
    if (!items.length) return;

    // Calculate completion progress
    const completed = items.filter((item) => item.watched).length;
    const total = items.length;
    setWatchData([
      { name: "Completed", value: completed },
      { name: "Pending", value: total - completed },
    ]);

    // ... rest of the analytics logic ...
  }, [items]);

  // ... rest of the component ...
}

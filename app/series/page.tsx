import { Metadata } from "next";
import dynamic from 'next/dynamic';

const ContentGrid = dynamic(() => import("@/components/dashboard/content-grid"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "TV Series - Lumina",
  description: "Browse your TV series collection",
};

export default function SeriesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">TV Series</h1>
        <p className="text-gray-500">Your TV series collection</p>
      </div>
      <ContentGrid type="series" />
    </div>
  );
}
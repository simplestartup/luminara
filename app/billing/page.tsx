import { Metadata } from "next";
import BillingContent from "@/components/billing/billing-content";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const metadata: Metadata = {
  title: "Billing - StreamTracker",
  description: "Manage your subscription and billing",
};

export default function BillingPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payments
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <BillingContent />
      </Suspense>
    </div>
  );
}

import { Metadata } from "next";
import { Suspense } from "react";
import BillingContent from "@/components/billing/billing-content";

export const metadata: Metadata = {
  title: "Billing - StreamTracker",
  description: "Manage your subscription and billing",
};

export default function BillingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BillingContent />
    </Suspense>
  );
}

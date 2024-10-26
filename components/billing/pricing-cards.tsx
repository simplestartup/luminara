"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    features: [
      "Track up to 50 movies/shows",
      "Basic analytics",
      "Watch history",
      "Watchlist management",
      "Mobile app access",
    ],
    buttonText: "Current Plan",
    disabled: true,
  },
  {
    name: "Pro",
    description: "For serious movie & TV enthusiasts",
    price: "$9.99",
    interval: "month",
    features: [
      "Unlimited tracking",
      "Advanced analytics",
      "Priority support",
      "Custom lists",
      "Early access features",
      "No advertisements",
      "Offline access",
      "Export data",
    ],
    buttonText: "Upgrade to Pro",
    disabled: false,
    popular: true,
  },
  {
    name: "Team",
    description: "Share with friends and family",
    price: "$19.99",
    interval: "month",
    features: [
      "Everything in Pro",
      "Up to 5 users",
      "Team watchlists",
      "Shared collections",
      "Watch party features",
      "Team analytics",
      "Admin controls",
    ],
    buttonText: "Contact Sales",
    disabled: false,
  },
];

async function handleUpgrade(plan: string) {
  try {
    // Here we would normally create a Stripe Checkout session
    // and redirect to it
    toast.loading("Redirecting to checkout...");
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    window.location.href = "/api/checkout"; // This would be your actual Stripe Checkout URL
  } catch (error) {
    toast.error("Something went wrong. Please try again.");
  }
}

export function PricingCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={
            plan.popular
              ? "border-primary shadow-lg relative"
              : undefined
          }
        >
          {plan.popular && (
            <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              Most Popular
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.interval && (
                <span className="text-muted-foreground">/{plan.interval}</span>
              )}
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
              disabled={plan.disabled}
              onClick={() => handleUpgrade(plan.name)}
            >
              {plan.buttonText}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function SubscribePage() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Define interfaces for plan types
  interface BasePlan {
    name: string;
    description: string;
    price: string;
    period: string;
    features: string[];
    buttonText: string;
    popular: boolean;
    popularLabel?: string;
  }

  interface YearlyPlan extends BasePlan {
    savings: string;
  }

  type MonthlyPlans = BasePlan[];
  type YearlyPlans = YearlyPlan[];

  const plans: {
    monthly: MonthlyPlans;
    yearly: YearlyPlans;
  } = {
    monthly: [
      {
        name: "Basic",
        description: "Access to all premium content",
        price: "$9.99",
        period: "/month",
        features: [
          "Full access to all premium content",
          "HD quality streaming",
          "Access on 1 device at a time"
        ],
        buttonText: "Subscribe Now",
        popular: false
      },
      {
        name: "Premium",
        description: "Everything in Basic plus extra features",
        price: "$14.99",
        period: "/month",
        features: [
          "Everything in Basic plan",
          "4K quality streaming where available",
          "Access on up to 3 devices simultaneously",
          "Early access to new content",
          "No ads or watermarks"
        ],
        buttonText: "Subscribe Now",
        popular: true,
        popularLabel: "Popular"
      }
    ],
    yearly: [
      {
        name: "Basic",
        description: "Access to all premium content",
        price: "$95.88",
        period: "/year",
        savings: "Save $23.88 compared to monthly",
        features: [
          "Full access to all premium content",
          "HD quality streaming",
          "Access on 1 device at a time"
        ],
        buttonText: "Subscribe Now",
        popular: false
      },
      {
        name: "Premium",
        description: "Everything in Basic plus extra features",
        price: "$143.88",
        period: "/year",
        savings: "Save $36 compared to monthly",
        features: [
          "Everything in Basic plan",
          "4K quality streaming where available",
          "Access on up to 3 devices simultaneously",
          "Early access to new content",
          "No ads or watermarks"
        ],
        buttonText: "Subscribe Now",
        popular: true,
        popularLabel: "Best Value"
      }
    ]
  };

  const handleSubscribe = (planName: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login or register to subscribe.",
        variant: "destructive",
      });
      navigate("/auth?redirect=subscribe");
      return;
    }

    // Will implement Stripe checkout later
    toast({
      title: "Coming soon!",
      description: `${planName} subscription will be available soon.`,
    });
  };

  return (
    <div className="container max-w-5xl py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Upgrade to Premium</h1>
        <p className="text-muted-foreground text-lg">
          Unlock our entire library of premium content with a subscription.
        </p>
      </div>

      <Tabs
        defaultValue="monthly"
        className="w-[400px] mx-auto mb-8"
        onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid md:grid-cols-2 gap-6">
        {plans[billingCycle].map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative overflow-hidden",
              plan.popular ? "bg-red-50/30 border-red-100" : "bg-white"
            )}
          >
            {plan.popular && (
              <div className="absolute top-4 right-4">
                <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {plan.popularLabel}
                </span>
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="text-muted-foreground">{plan.description}</p>
              <div className="mt-4 mb-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              {plan.savings && (
                <p className="text-green-600 text-sm mb-4">{plan.savings}</p>
              )}
              <ul className="space-y-2 my-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="mr-2 text-green-500 h-5 w-5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={() => handleSubscribe(plan.name)}
              >
                {plan.buttonText}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
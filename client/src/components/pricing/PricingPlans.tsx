import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingPlan {
  title: string;
  price: string;
  period: string;
  description: string;
  isFeatured?: boolean;
  features: {
    included: boolean;
    text: string;
  }[];
  buttonText: string;
  buttonLink: string;
}

export default function PricingPlans() {
  const plans: PricingPlan[] = [
    {
      title: "Monthly",
      price: "$9.99",
      period: "/month",
      description: "Billed monthly, cancel anytime",
      features: [
        { included: true, text: "Unlimited premium content access" },
        { included: true, text: "HD video quality" },
        { included: true, text: "New premium content weekly" },
        { included: false, text: "Priority support" },
      ],
      buttonText: "Subscribe Monthly",
      buttonLink: "/checkout?plan=monthly",
    },
    {
      title: "Annual",
      price: "$79.99",
      period: "/year",
      description: "Save 33% compared to monthly",
      isFeatured: true,
      features: [
        { included: true, text: "Unlimited premium content access" },
        { included: true, text: "4K video quality" },
        { included: true, text: "New premium content weekly" },
        { included: true, text: "Priority support" },
      ],
      buttonText: "Subscribe Annually",
      buttonLink: "/checkout?plan=annual",
    },
    {
      title: "Lifetime",
      price: "$249.99",
      period: "/lifetime",
      description: "One-time payment, lifetime access",
      features: [
        { included: true, text: "Unlimited premium content access" },
        { included: true, text: "4K video quality" },
        { included: true, text: "All future premium content" },
        { included: true, text: "Priority support" },
      ],
      buttonText: "Get Lifetime Access",
      buttonLink: "/checkout?plan=lifetime",
    },
  ];

  return (
    <section id="pricing" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Premium Plans</h2>
          <p className="text-lg text-gray-600">
            Choose the perfect plan for your needs and get unlimited access to our premium content library.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={cn(
                "bg-white rounded-xl shadow-md overflow-hidden transition-all",
                plan.isFeatured && "shadow-xl border-2 border-blue-500 relative transform md:-translate-y-4",
                !plan.isFeatured && "hover:shadow-lg"
              )}
            >
              {plan.isFeatured && (
                <div className="absolute top-0 inset-x-0 bg-blue-500 text-white text-xs text-center py-1 font-medium uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className={cn("p-6 border-b", plan.isFeatured && "mt-6")}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.title}</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                <p className={cn(
                  "text-sm mt-2", 
                  plan.isFeatured ? "text-green-600 font-medium" : "text-gray-600"
                )}>
                  {plan.description}
                </p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      {feature.included ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 mt-1 mr-2 flex-shrink-0">
                          <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400 mt-1 mr-2 flex-shrink-0">
                          <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center font-medium py-3"
                  onClick={() => window.location.href = plan.buttonLink}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">All plans include secure payment processing via Stripe/CCBill/Verotel</p>
          <div className="flex justify-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400">
              <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
              <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400">
              <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
              <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400">
              <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
              <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400">
              <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
              <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

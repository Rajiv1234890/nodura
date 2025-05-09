import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const faqItems: FAQItem[] = [
    {
      question: "What is included in the premium subscription?",
      answer: "Premium subscription gives you unlimited access to all our premium content, including high-resolution videos and photos. You'll also get access to new premium content as it's released, HD/4K quality options, and ad-free browsing experience."
    },
    {
      question: "How often is new content added?",
      answer: "We add new free and premium content weekly. Premium members get access to all new content immediately upon release, while free users can access selected free content."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, monthly and annual subscriptions can be canceled at any time from your account settings. When you cancel, you'll maintain access until the end of your current billing period. Lifetime plans are non-refundable as they provide permanent access."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and various other payment methods through our secure payment processors including Stripe, CCBill, and Verotel."
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "We offer a 7-day money-back guarantee for monthly and annual subscriptions if you're not satisfied with our premium content. Simply contact our support team within 7 days of your purchase for a full refund."
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our platform and premium content.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto" id="faq-accordion">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 py-2">
                <AccordionTrigger className="text-left font-medium text-gray-800 hover:text-blue-500">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

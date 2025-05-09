import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <div className="bg-black text-white">
      {/* Top Promotion Banner */}
      <div className="bg-pink-600 text-white text-center py-3">
        <div className="container mx-auto px-4">
          <p>Upgrade to Premium for ad-free viewing and exclusive content. <Link href="/subscription" className="underline font-medium">Try it free for 7 days</Link></p>
        </div>
      </div>
      
      {/* Hero Content */}
      <section className="relative overflow-hidden bg-gray-900">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Discover Amazing Videos
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Watch thousands of free videos or upgrade to Premium for exclusive content
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/browse?type=free">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-10 py-6 h-auto" size="lg">
                  Browse Free Videos
                </Button>
              </Link>
              <Link href="/subscription">
                <Button variant="outline" className="border-white hover:bg-white/10 text-white font-medium px-10 py-6 h-auto" size="lg">
                  Try Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="bg-white text-black py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Free Videos</h2>
            <Link href="/browse?type=free" className="text-pink-600 hover:underline">View All →</Link>
          </div>
          {/* Grid would go here, but we'll rely on the existing content components */}
        </div>
      </section>
    </div>
  );
}

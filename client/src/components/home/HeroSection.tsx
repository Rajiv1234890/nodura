import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section 
      className="relative overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=800')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="hero-gradient w-full h-full absolute inset-0"></div>
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Premium Content Awaits
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Discover thousands of high-quality videos and photos curated by professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/pricing">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-6 h-auto" size="lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
                Get Premium Access
              </Button>
            </Link>
            <Link href="#browse">
              <Button variant="secondary" className="bg-white hover:bg-gray-100 text-gray-800 font-medium px-6 py-6 h-auto" size="lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                Browse Free Content
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

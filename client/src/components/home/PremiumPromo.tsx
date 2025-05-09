import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PremiumPromo() {
  return (
    <section className="py-12 bg-gradient-to-r from-blue-600 to-violet-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Unlock Premium Content</h2>
            <p className="text-lg text-blue-100 mb-6">
              Get unlimited access to all premium videos and photos. Learn from industry professionals and take your skills to the next level.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-300 mr-2">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <span>Unlimited access to all premium content</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-300 mr-2">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <span>High-resolution downloads</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-300 mr-2">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <span>New premium content every week</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-300 mr-2">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <span>Ad-free experience</span>
              </li>
            </ul>
            <Link href="/pricing">
              <Button className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3">
                View Pricing Plans
              </Button>
            </Link>
          </div>
          <div className="md:w-5/12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="grid grid-cols-2 gap-3">
                <img 
                  src="https://pixabay.com/get/gc72c00bad95b911f6328cb15943bf4d3b3bc4a305677f5d46b6cf8dc3a89edab0050c4933417b52469fe0d9d9cf5097ffbd9f6f79d3c17adc7428cb1f18bddcc_1280.jpg" 
                  alt="Cinematic portrait photography" 
                  className="w-full h-48 object-cover rounded-lg" 
                />
                
                <img 
                  src="https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=400" 
                  alt="Professional cinematography equipment" 
                  className="w-full h-48 object-cover rounded-lg" 
                />
                
                <img 
                  src="https://pixabay.com/get/ga8a7c52468bf08bdeead01cc039e7f488f3b268e7f0c81df68f9d6e81ba44716939045a2025b7c39da258c70fba8037b5673616d305e1c5556727dd687ab7eee_1280.jpg" 
                  alt="Aerial drone photography" 
                  className="w-full h-48 object-cover rounded-lg" 
                />
                
                <img 
                  src="https://images.unsplash.com/photo-1621784564114-6eea05b89863?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=400" 
                  alt="Creative lighting setup for photography" 
                  className="w-full h-48 object-cover rounded-lg" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

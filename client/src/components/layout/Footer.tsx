import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-white mb-4">
              NUDORA
            </div>
            <p className="text-gray-400 mb-4">Premium photo and video content with new uploads daily.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-pink-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-pink-500 transition-colors">Gallery</Link>
              </li>
              <li>
                <Link href="/subscription" className="text-gray-400 hover:text-pink-500 transition-colors">Subscription</Link>
              </li>
              <li>
                <Link href="/browse?type=video" className="text-gray-400 hover:text-pink-500 transition-colors">Videos</Link>
              </li>
              <li>
                <Link href="/browse?type=photo" className="text-gray-400 hover:text-pink-500 transition-colors">Photos</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse?category=nature" className="text-gray-400 hover:text-pink-500 transition-colors">Nature</Link>
              </li>
              <li>
                <Link href="/browse?category=urban" className="text-gray-400 hover:text-pink-500 transition-colors">Urban</Link>
              </li>
              <li>
                <Link href="/browse?category=people" className="text-gray-400 hover:text-pink-500 transition-colors">People</Link>
              </li>
              <li>
                <Link href="/browse?category=technology" className="text-gray-400 hover:text-pink-500 transition-colors">Technology</Link>
              </li>
              <li>
                <Link href="/browse?category=food" className="text-gray-400 hover:text-pink-500 transition-colors">Food</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Cookie Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">DMCA</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">2257 Statement</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© {currentYear} NUDORA. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <div className="text-gray-500 text-sm">
              Upgrade to Premium for ad-free viewing and exclusive content. <Link href="/subscription" className="text-pink-500 hover:underline">Try it free for 7 days</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link, useLocation } from "wouter";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { href: string; label: string }[];
}

export function MobileNav({ isOpen, onClose, navLinks }: MobileNavProps) {
  const [location] = useLocation();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-3">
          {navLinks.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link 
                href={link.href}
                className={`block text-lg py-2 pl-2 ${
                  location === link.href
                    ? "text-blue-500 font-medium"
                    : "text-gray-700 hover:text-blue-500"
                } transition-colors`}
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
          
          <SheetClose asChild>
            <Link href="/auth" className="block text-lg py-2 pl-2 text-gray-700 hover:text-blue-500 transition-colors">
              Account
            </Link>
          </SheetClose>
          
          <div className="pt-4 border-t border-gray-200">
            <SheetClose asChild>
              <Link href="/pricing">
                <Button className="bg-blue-500 hover:bg-blue-600 w-full mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                  </svg>
                  Get Premium Access
                </Button>
              </Link>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

import Header from "@/components/LandingPage/Header";
import HeroSection from "@/components/LandingPage/HeroSection";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />
      <main className="flex-grow">
        <HeroSection />
      </main>
      <footer className="w-full bg-primary text-primary-foreground mt-auto px-4 xl:px-40 md:px-10">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm mb-4 sm:mb-0">
            © {new Date().getFullYear()} SETU. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link
              className="text-sm hover:underline underline-offset-4 transition-colors"
              href="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-sm hover:underline underline-offset-4 transition-colors"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-sm hover:underline underline-offset-4 transition-colors"
              href="#"
            >
              Contact Support
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

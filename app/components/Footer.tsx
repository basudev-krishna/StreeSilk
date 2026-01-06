import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background border-t border-border py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="StreeSilk Logo"
                            width={24}
                            height={24}
                            className="h-6 w-auto"
                        />
                        <span className="font-bold text-foreground">
                            StreeSilk
                        </span>
                    </div>

                    {/* Quick Links */}
                    <div className="flex gap-6">
                        <Link
                            href="/shop"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Shop
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Contact
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Privacy
                        </Link>
                    </div>

                    {/* Copyright */}
                    <div className="text-sm text-muted-foreground">
                        <p>© {currentYear} StreeSilk</p>
                    </div>
                </div>
            </div>

            {/* Credits */}
            <div className="mt-8 pt-6 border-t border-border/40 text-center">
                <Link
                    href="https://wa.me/918822990854?text=Hi%2C%20I%20loved%20the%20StreeSilk%20website%21%20I%27m%20interested%20in%20knowing%20more%20about%20your%20web%20design%20services."
                    target="_blank"
                    className="text-xs text-muted-foreground hover:text-amber-500 transition-colors inline-flex items-center gap-1.5 font-medium tracking-wide"
                >
                    Made by UrbanFlick Studios with <span>❤️</span>
                </Link>
            </div>
        </footer>
    );
} 
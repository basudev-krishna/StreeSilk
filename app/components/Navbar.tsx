"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, ShoppingBag, LogIn, ShieldCheck, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useAuth as useClerkAuth, useClerk, UserButton, useUser } from "@clerk/nextjs";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Contact", href: "/contact" },
];

// 🎨 Keeping the logo URL as is
const LOGO_URL = "/logo.png";

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
    ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map(email => email.trim())
    : [];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [imageError, setImageError] = useState(false); // To handle logo loading errors
    const { getCartCount } = useCart();
    const { requireAuth } = useAuth();
    const { isSignedIn, userId } = useClerkAuth();
    const { user } = useUser();
    const router = useRouter();
    const cartItemsCount = getCartCount();
    const clerk = useClerk();

    const isAdmin = isSignedIn && user?.primaryEmailAddress?.emailAddress && ADMIN_EMAILS.includes(user.primaryEmailAddress.emailAddress);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const scrollingDown = prevScrollPos < currentScrollPos;
            const scrollDelta = Math.abs(prevScrollPos - currentScrollPos);

            if (scrollDelta > 10) {
                if (currentScrollPos <= 20) {
                    setVisible(true);
                } else {
                    setVisible(!scrollingDown);
                }
                setPrevScrollPos(currentScrollPos);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // 🌟 Refined Minimalist Navbar Classes
    const navbarClasses = `fixed z-50 w-full top-0 
        bg-background/90 backdrop-blur-lg 
        border-b border-border/70 shadow-md 
        transition-transform duration-300 ease-in-out ${visible ? "translate-y-0" : "-translate-y-full"
        }`;

    const handleCartClick = async (e: React.MouseEvent) => {
        if (!isSignedIn) {
            e.preventDefault();
            await requireAuth("You need to sign in to view your cart.");
        } else {
            router.push("/cart");
        }
    };

    const handleSignInClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const signInUrl = clerk.buildSignInUrl({
                redirectUrl: window.location.href
            });

            window.location.href = signInUrl;
        } catch (error) {
            console.error("Error redirecting to sign in:", error);
        }
    };

    const handleSignUpClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const signUpUrl = clerk.buildSignUpUrl({
                redirectUrl: window.location.href
            });

            window.location.href = signUpUrl;
        } catch (error) {
            console.error("Error redirecting to sign up:", error);
        }
    };

    return (
        <nav className={navbarClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Left Section: Logo and Brand - Always prominent */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            {!imageError ? (
                                <Image
                                    src={LOGO_URL}
                                    alt="StreeSilk Logo"
                                    width={32} // Slightly larger for better visibility
                                    height={32}
                                    className="mr-1 group-hover:scale-105 transition-transform"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full text-primary mr-1">
                                    <ShoppingBag size={18} />
                                </div>
                            )}
                            {/* Elevated Brand Title */}
                            <span className="text-2xl font-extrabold tracking-widest uppercase text-foreground hover:text-primary transition-colors">
                                স্ত্রী চিল্ক
                            </span>
                        </Link>
                    </div>

                    {/* Center Section: Desktop Nav Links - Clean and clearly spaced */}
                    <div className="hidden md:block flex-grow"> {/* Flex-grow to push content away from logo */}
                        <div className="flex items-center justify-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors relative group"
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                </Link>
                            ))}

                            {/* Admin link */}
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="text-sm font-medium uppercase tracking-wider text-primary flex items-center gap-1 hover:text-primary/80 transition-colors"
                                >
                                    <ShieldCheck size={14} />
                                    Admin
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right Section: Actions and Toggles */}
                    <div className="flex items-center gap-3">

                        {/* ThemeToggle */}
                        <div className="hidden lg:block">
                            <ThemeToggle />
                        </div>

                        {/* Cart Button - Clean icon, subtle hover */}
                        <button
                            onClick={handleCartClick}
                            className="relative p-2 transition-colors hover:bg-muted rounded-full"
                            aria-label="View shopping cart"
                        >
                            <ShoppingCart size={20} className="text-foreground hover:text-primary transition-colors" />
                            {cartItemsCount > 0 && isSignedIn && (
                                <span className="absolute -right-0 -top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground leading-none" style={{ fontSize: '10px' }}>
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>

                        {/* Sign in/up buttons for non-signed in users on desktop */}
                        {!isSignedIn && (
                            <div className="hidden md:flex md:items-center gap-2">
                                <button
                                    onClick={handleSignInClick}
                                    className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors border border-border hover:bg-secondary"
                                >
                                    <LogIn size={16} />
                                    Sign In
                                </button>
                                <button
                                    onClick={handleSignUpClick}
                                    className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 shadow-md"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}

                        {/* User Button for signed in users */}
                        {isSignedIn && (
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "h-8 w-8",
                                        userButtonTrigger: "focus:shadow-none focus-visible:ring-2 focus-visible:ring-primary rounded-full",
                                    }
                                }}
                            />
                        )}

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="md:hidden p-2 rounded-full text-foreground hover:bg-muted transition-colors"
                            onClick={toggleMenu}
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Full-width, clean slide out from top */}
            <div
                className={`md:hidden absolute top-16 left-0 w-full bg-background border-b border-border shadow-2xl transition-transform duration-300 ease-out z-40 ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 invisible"}`}
                id="mobile-menu"
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-center"
                            onClick={toggleMenu}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Admin link in mobile menu */}
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="flex items-center justify-center gap-2 px-3 py-3 rounded-md text-base font-medium text-primary hover:bg-primary/10 transition-colors"
                            onClick={toggleMenu}
                        >
                            <ShieldCheck size={18} />
                            Admin Dashboard
                        </Link>
                    )}
                </div>

                <div className="border-t border-border pt-4 pb-4 px-4 space-y-2">
                    {/* ThemeToggle */}
                    <div className="flex justify-center pb-4">
                        <ThemeToggle />
                    </div>

                    {/* Sign-in/Sign-up buttons in mobile menu */}
                    {!isSignedIn && (
                        <>
                            <button
                                onClick={(e) => {
                                    toggleMenu();
                                    handleSignInClick(e);
                                }}
                                className="flex items-center justify-center gap-2 px-3 py-3 rounded-full border border-border hover:bg-secondary transition-colors w-full"
                            >
                                <LogIn size={18} />
                                Sign In
                            </button>
                            <button
                                onClick={(e) => {
                                    toggleMenu();
                                    handleSignUpClick(e);
                                }}
                                className="flex items-center justify-center px-3 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full shadow-md"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
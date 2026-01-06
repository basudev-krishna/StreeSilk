"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { submitContactMessage } from "../actions/contact";

// --- Constants ---
const GUWAHATI_ADDRESS = "Ambari, Guwahati, Assam, India - 781025"; // Specific Demo Address
const CONTACT_INFO = {
    email1: "streesilk41@gmail.com",
    email2: "streesilk41@gmail.com",
    phone: "+91 8638248982",
    address: GUWAHATI_ADDRESS,
};

const SOCIAL_LINKS = {
    instagram: "https://www.instagram.com/stree.silk?igsh=MW0weGR4OXczdWl1aQ==",
    facebook: "https://www.facebook.com/share/1FBKFeWxxz/",
    whatsapp: "https://wa.me/918638248982"
};

// --- Main Component ---
export default function ContactPage() {
    const { requireAuth } = useAuth();
    const { userId } = useClerkAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const submitContactMessageAction = async (data: any) => {
        return await submitContactMessage(data);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        // Optional: Keep authentication check if desired, or remove if contact form should be public
        // For now, keeping the auth requirement as per original code
        const isAuthorized = await requireAuth("You need to sign in to send us a message.");

        if (isAuthorized) {
            setIsSubmitting(true);

            try {
                await submitContactMessage({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    clerkId: userId || undefined
                });

                setSubmitSuccess(true);
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: ""
                });

                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 5000);
            } catch (error) {
                console.error("Error submitting form:", error);
                setSubmitError("There was an error submitting your message. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // --- Components for Bento Layout ---



    // 2. Contact Details Bento Item (FIXED: Address restored here)
    const DetailsBentoItem = () => (
        <div className="bg-card rounded-xl p-6 border border-border/70 shadow-lg h-full space-y-6 md:col-span-1">
            <h3 className="text-xl font-semibold mb-4 border-b border-border pb-2">Direct Contact</h3>

            {/* Email */}
            <div className="flex items-start space-x-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0 mt-1">
                    <Mail size={20} />
                </div>
                <div>
                    <h4 className="font-medium text-foreground">Customer Support</h4>
                    <p className="text-muted-foreground text-sm">{CONTACT_INFO.email1}</p>
                    <p className="text-muted-foreground text-sm">General inquiries</p>
                </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0 mt-1">
                    <Phone size={20} />
                </div>
                <div>
                    <h4 className="font-medium text-foreground">Sales & Inquiries</h4>
                    <p className="text-muted-foreground text-sm">{CONTACT_INFO.phone}</p>
                    <p className="text-muted-foreground text-sm">Mon-Fri: 10am - 8pm IST</p>
                </div>
            </div>

            {/* Address - RESTORED */}
            <div className="flex items-start space-x-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0 mt-1">
                    <MapPin size={20} />
                </div>
                <div>
                    <h4 className="font-medium text-foreground">Corporate Address</h4>
                    <p className="text-muted-foreground text-sm">{CONTACT_INFO.address}</p>
                </div>
            </div>

            {/* Social Media Buttons */}
            <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-foreground mb-3">Connect With Us</h4>
                <div className="flex gap-4">
                    {/* Instagram */}
                    <Link href={SOCIAL_LINKS.instagram} target="_blank" aria-label="Instagram" className="p-3 rounded-full bg-pink-600/10 text-pink-600 hover:bg-pink-600/20 transition-colors">
                        <Instagram size={20} />
                    </Link>

                    {/* Facebook */}
                    <Link href={SOCIAL_LINKS.facebook} target="_blank" aria-label="Facebook" className="p-3 rounded-full bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 transition-colors">
                        <Facebook size={20} />
                    </Link>

                    {/* WhatsApp */}
                    <Link href={SOCIAL_LINKS.whatsapp} target="_blank" aria-label="WhatsApp" className="p-3 rounded-full bg-green-600/10 text-green-600 hover:bg-green-600/20 transition-colors">
                        <MessageCircle size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );

    // 3. Contact Form Bento Item
    const FormBentoItem = () => (
        <div className="md:col-span-2 bg-card rounded-xl p-6 sm:p-8 border border-border/70 shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Send Us a Message</h2>

            {submitSuccess && (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-4 mb-6">
                    <p className="text-green-800 dark:text-green-300 font-medium">Thank you for your message! We&apos;ll get back to you soon.</p>
                </div>
            )}

            {submitError && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
                    <p className="text-red-800 dark:text-red-300 font-medium">{submitError}</p>
                </div>
            )}

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                        <input
                            type="text" id="name" value={formData.name} onChange={handleChange} required
                            className="w-full px-4 py-2 sm:py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                        <input
                            type="email" id="email" value={formData.email} onChange={handleChange} required
                            className="w-full px-4 py-2 sm:py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                    <input
                        type="text" id="subject" value={formData.subject} onChange={handleChange}
                        className="w-full px-4 py-2 sm:py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <textarea
                        id="message" rows={5} value={formData.message} onChange={handleChange} required
                        className="w-full px-4 py-2 sm:py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-base"
                    ></textarea>
                </div>

                <button
                    type="submit" disabled={isSubmitting}
                    className={`flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-base shadow-md ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Send Message
                        </>
                    )}
                </button>
            </form>
        </div>
    );

    // --- Main Render ---

    return (
        <>
            {/* Hero section */}
            <div className="relative h-60 sm:h-72 md:h-80 bg-muted overflow-hidden">
                <Image
                    src="/banner.jpeg"
                    alt="Contact us"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center brightness-[0.7] dark:brightness-[0.4]"
                />
                <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight drop-shadow-lg">
                            Get In Touch
                        </h1>
                        <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-xl mx-auto drop-shadow-md">
                            We&apos;re here to help! Reach out to us for support, sales, or partnership inquiries.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bento Grid Layout Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">

                    {/* Row 1: Form (2/3) and Details (1/3) */}
                    <FormBentoItem />
                    <DetailsBentoItem />


                </div>
            </div>
        </>
    );
}
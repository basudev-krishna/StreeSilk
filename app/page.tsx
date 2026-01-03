"use client";

import Link from "next/link";
import Image from "next/image";
import FeaturedProducts from "./components/FeaturedProducts";
import { ShoppingBag, Star, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// --- Animation Variants (kept the same) ---
const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const marqueeVariants = {
    animate: {
        x: ['0%', '-100%'],
        transition: {
            x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 25,
                ease: 'linear',
            },
        },
    },
};
// --- End Animation Variants ---

export default function Home() {
    return (
        <>
            {/* 🌟 Hero Section (ALIGNED LEFT) */}
            <section className="relative overflow-hidden min-h-[60vh] md:min-h-[95vh] flex items-center justify-center bg-black pt-20 md:pt-0">
                <div className="absolute inset-0 z-2">
                    <Image
                        src="/hero1.png"
                        alt="T-shirt collection background"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center brightness-[0.7]"
                    />
                </div>

                {/* Gradient Overlay for Text Clarity */}
                <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 to-transparent"></div>

                {/* Text and Buttons Container - Changed text-center to text-left and adjusted margins */}
                <div className="relative z-10 w-full text-left px-8 sm:px-12 max-w-5xl md:pl-20 lg:pl-40">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tighter leading-none uppercase drop-shadow-xl"
                    >
                        স্ত্রী চিল্ক - Stree Silk
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        // Removed mx-auto for left alignment
                        className="text-base sm:text-xl text-white/90 mb-10 sm:mb-16 font-extralight max-w-2xl drop-shadow-md"
                    >
                        High Quality Assamese Silk. Only on Streesilk
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        // Changed justify-center to justify-start
                        className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-start"
                    >
                        <Link
                            href="/shop"
                            className="px-10 sm:px-12 py-3 sm:py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors shadow-2xl flex items-center justify-center gap-2 uppercase tracking-widest"
                        >
                            <ShoppingBag size={20} />
                            Shop The Collection
                        </Link>
                        <Link
                            href="/contact"
                            className="px-10 sm:px-12 py-3 sm:py-4 rounded-lg border border-white/50 text-white font-semibold text-lg hover:bg-white/10 transition-colors flex items-center justify-center uppercase tracking-widest"
                        >
                            Contact Support
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* 📣 Marquee Section (No change) */}
            <div className="overflow-hidden py-4 bg-muted/90 border-y border-border/50 bg-dark-700">
                <motion.div
                    className="flex flex-row whitespace-nowrap"
                    variants={marqueeVariants}
                    animate="animate"
                >
                    <div className="text-xl sm:text-2xl font-mono text-foreground/70 uppercase tracking-widest px-8">
                        Streesilk.Fine.Silk •
                    </div>
                    <div className="text-xl sm:text-2xl font-mono text-foreground/70 uppercase tracking-widest px-8">
                        Streesilk.Fine.Silk •
                    </div>
                    <div className="text-xl sm:text-2xl font-mono text-foreground/70 uppercase tracking-widest px-8">
                        Streesilk.Fine.Silk •
                    </div>
                    <div className="text-xl sm:text-2xl font-mono text-foreground/70 uppercase tracking-widest px-8">
                        Streesilk.Fine.Silk •
                    </div>
                    {/* Repeat to ensure smooth looping */}
                    <div className="text-xl sm:text-2xl font-mono text-foreground/70 uppercase tracking-widest px-8">
                        Streesilk.fine.silk •
                    </div>
                    <div className="text-xl sm:text-2xl font-mono text-foreground/70 uppercase tracking-widest px-8">
                        Streesilk.fine.silk •
                    </div>
                    <div className="text-xl sm:text-2xl font-mono text-foreground/70 uppercase tracking-widest px-8">
                        Streesilk.fine.silk •
                    </div>
                    <div className="text-xl sm:text-2xl font-mono text-foreground/70 uppercase tracking-widest px-8">
                        Streesilk.fine.silk •
                    </div>
                    <div className="text-xl sm:text-2xl font-mono text-foreground/70 uppercase tracking-widest px-8">
                        Streesilk.fine.silk •
                    </div>
                </motion.div >
            </div >

            <hr className="border-t border-border/50" />

            {/* 💎 Features Section: Luxury Minimalist Redesign */}
            <section className="relative py-32 bg-[#fafaf9] dark:bg-[#0c0a09] overflow-hidden">
                {/* 🌟 Ambient Lighting aka "The Silk Sheen" */}
                {/* A very subtle, large golden glow from the top center to simulate light hitting silk */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 dark:bg-amber-400/5 blur-[120px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} // Smooth "luxury" ease
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <span className="text-xs md:text-sm font-medium tracking-[0.3em] text-stone-500 dark:text-stone-400 uppercase mb-6 block">
                            The Difference
                        </span>
                        <h2 className="text-5xl md:text-7xl font-serif font-thin text-stone-900 dark:text-white tracking-tight mb-8">
                            Weaving <span className="italic text-amber-700 dark:text-amber-500/90 font-light">Elegance</span> into <br className="hidden md:block" /> Every Thread.
                        </h2>
                        <p className="text-lg text-stone-600 dark:text-stone-400 max-w-xl mx-auto font-light leading-8">
                            StreeSilk isn't just a label; it's a revival of Assamese heritage, crafted for the modern connoisseur.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1: Heritage */}
                        <motion.div
                            className="group p-10 rounded-3xl bg-white dark:bg-white/5 border border-stone-100 dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-stone-200/50 dark:hover:shadow-none transition-all duration-700 relative overflow-hidden"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative z-10">
                                <div className="mb-8 p-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-stone-50 dark:bg-white/10 text-amber-700 dark:text-amber-400 group-hover:scale-110 transition-transform duration-500">
                                    <Star size={32} strokeWidth={1} />
                                </div>
                                <h3 className="text-3xl font-serif font-light text-stone-900 dark:text-white mb-4">Authentic Heritage</h3>
                                <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-light">
                                    Sourced directly from Sualkuchi's master weavers. We champion 100% pure Muga, Pat, and Eri silk, preserving a legacy that dates back centuries.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 2: Artistry */}
                        <motion.div
                            className="group p-10 rounded-3xl bg-white dark:bg-white/5 border border-stone-100 dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-stone-200/50 dark:hover:shadow-none transition-all duration-700 relative overflow-hidden"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent dark:from-red-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative z-10">
                                <div className="mb-8 p-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-stone-50 dark:bg-white/10 text-amber-700 dark:text-amber-400 group-hover:scale-110 transition-transform duration-500">
                                    <TrendingUp size={32} strokeWidth={1} />
                                </div>
                                <h3 className="text-3xl font-serif font-light text-stone-900 dark:text-white mb-4">Woven Artistry</h3>
                                <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-light">
                                    Where the ancient *Jaapi* and *Xorai* motifs find new life in contemporary cuts. Wearable art designed for the modern woman who values tradition.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 3: Touch */}
                        <motion.div
                            className="group p-10 rounded-3xl bg-white dark:bg-white/5 border border-stone-100 dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-stone-200/50 dark:hover:shadow-none transition-all duration-700 relative overflow-hidden"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-stone-50/80 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative z-10">
                                <div className="mb-8 p-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-stone-50 dark:bg-white/10 text-amber-700 dark:text-amber-400 group-hover:scale-110 transition-transform duration-500">
                                    <CheckCircle2 size={32} strokeWidth={1} />
                                </div>
                                <h3 className="text-3xl font-serif font-light text-stone-900 dark:text-white mb-4">The Silk Touch</h3>
                                <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-light">
                                    Experience the breathable luxury of natural fibers. Our silk feels as gentle as a second skin, offering unmatched comfort in every drape.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 📖 About Section: Editorial Layout */}
            <section className="py-32 bg-[#fafaf9] dark:bg-[#0c0a09]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                        {/* Image/Visual Component */}
                        <motion.div
                            className="relative h-[600px] w-full overflow-hidden rounded-[2rem]"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            viewport={{ once: true }}
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1616756351484-798f37bdffa0?q=80&w=1074&auto=format&fit=crop&"
                                alt="Ethical sourcing and quality materials"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                            />
                            {/* Subtle frame */}
                            <div className="absolute inset-0 border border-black/5 dark:border-white/10 rounded-[2rem] pointer-events-none"></div>
                        </motion.div>

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex flex-col justify-center"
                        >
                            <div className="mb-6 flex items-center gap-4">
                                <div className="h-px w-12 bg-amber-600/50"></div>
                                <span className="text-xs font-medium text-amber-600/80 dark:text-amber-500/80 uppercase tracking-[0.3em]">Our Heritage</span>
                            </div>

                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-thin text-stone-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
                                Crafted with Conscience, <br /> <span className="italic font-light text-stone-500 dark:text-stone-400">Designed for Legacy.</span>
                            </h2>
                            <p className="text-lg text-stone-600 dark:text-stone-400 mb-10 leading-relaxed font-light">
                                At StreeSilk, we believe true luxury is found in ethical sourcing and uncompromising quality. Every garment begins with the finest raw materials, ensuring sustainability and exceptional comfort. Our pieces are designed to last, not just for a season, embodying a commitment to timeless elegance.
                            </p>
                            <Link
                                href="/about"
                                className="group inline-flex items-center gap-4 text-stone-900 dark:text-white font-medium hover:text-amber-700 dark:hover:text-amber-400 transition-colors uppercase tracking-widest text-sm"
                            >
                                Read Our Full Story
                                <span className="border rounded-full p-2 border-stone-200 dark:border-stone-800 group-hover:border-amber-700 dark:group-hover:border-amber-400 transition-colors">
                                    <ArrowRight size={16} />
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 🛍️ Featured Products Section */}
            <FeaturedProducts />

            {/* 🚀 Promotional Banner: Editorial Campaign Style */}
            <section className="relative py-40 overflow-hidden">
                {/* Background Image Parallax */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=1600&auto=format&fit=crop&q=80"
                        alt="New Collection"
                        fill
                        className="object-cover object-center brightness-[0.3] scale-105"
                    />
                    <div className="absolute inset-0 bg-stone-900/40 mix-blend-multiply"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-xs font-semibold text-white/70 uppercase tracking-[0.4em] mb-6 block">Exclusive Access</span>
                        <h2 className="text-5xl sm:text-6xl md:text-8xl font-serif font-thin text-white mb-10 tracking-tighter">
                            New Season <span className="italic block sm:inline">Arrivals</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-white/80 mb-12 max-w-lg mx-auto font-light leading-relaxed">
                            Be the first to explore. Sign up for our newsletter today and receive <span className="text-amber-200">20% off</span> your first order.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block px-12 py-4 bg-white text-stone-950 font-medium tracking-widest uppercase hover:bg-stone-200 transition-colors duration-300"
                        >
                            Explore Collection
                        </Link>
                    </motion.div>
                </div>
            </section>


            {/* ⭐ Testimonials: Clean Minimalist */}
            <section className="py-32 bg-[#fafaf9] dark:bg-[#0c0a09]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 dark:text-white mb-4 tracking-tight">
                            Voices of Elegance
                        </h2>
                        <div className="h-px w-20 bg-stone-200 dark:bg-stone-800 mx-auto"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Testimonial Card 1 */}
                        <motion.div
                            className="bg-white dark:bg-white/5 p-10 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:bg-white/10 transition-all duration-500"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center mb-8 text-amber-500 dark:text-amber-400 space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                                ))}
                            </div>
                            <blockquote className="text-lg text-stone-600 dark:text-stone-300 mb-8 font-light italic leading-relaxed">
                                &quot;The most comfortable silk I&apos;ve ever worn. The quality is outstanding and it fits perfectly. Truly a piece of art.&quot;
                            </blockquote>
                            <p className="font-medium text-stone-900 dark:text-white text-sm tracking-wider uppercase">— Emily J.</p>
                        </motion.div>

                        {/* Testimonial Card 2 */}
                        <motion.div
                            className="bg-white dark:bg-white/5 p-10 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:bg-white/10 transition-all duration-500"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center mb-8 text-amber-500 dark:text-amber-400 space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                                ))}
                            </div>
                            <blockquote className="text-lg text-stone-600 dark:text-stone-300 mb-8 font-light italic leading-relaxed">
                                &quot;I love the modern designs. The fabric is incredibly soft. It has become my go-to for both casual and smart wear.&quot;
                            </blockquote>
                            <p className="font-medium text-stone-900 dark:text-white text-sm tracking-wider uppercase">— Marcus T.</p>
                        </motion.div>

                        {/* Testimonial Card 3 */}
                        <motion.div
                            className="bg-white dark:bg-white/5 p-10 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:bg-white/10 transition-all duration-500"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center mb-8 text-amber-500 dark:text-amber-400 space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                                ))}
                            </div>
                            <blockquote className="text-lg text-stone-600 dark:text-stone-300 mb-8 font-light italic leading-relaxed">
                                &quot;Exceptional quality that holds up. The color stays vibrant. Fast delivery too! Highly recommend StreeSilk.&quot;
                            </blockquote>
                            <p className="font-medium text-stone-900 dark:text-white text-sm tracking-wider uppercase">— Sarah K.</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}

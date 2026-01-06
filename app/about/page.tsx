"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 font-sans text-stone-800 dark:text-stone-200">

            {/* --- Hero Section --- */}
            <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/banner.jpeg"
                        alt="Indian Silk Weaving"
                        fill
                        className="object-cover opacity-90 dark:opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-stone-50/90 dark:to-zinc-950/90"></div>
                </div>

                <div className="relative z-10 text-center space-y-4 px-4">
                    <motion.span
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        variants={fadeIn}
                        className="font-mistral text-5xl md:text-7xl text-amber-400 block mb-2 transform -rotate-2 drop-shadow-lg"
                    >
                        Threads of Royalty
                    </motion.span>
                    <motion.h1
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        variants={fadeIn}
                        className="text-4xl md:text-6xl font-serif font-bold tracking-widest text-white uppercase drop-shadow-md"
                    >
                        The Legacy of Stree Silk
                    </motion.h1>
                    <motion.p
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        variants={fadeIn}
                        className="text-white/90 text-sm md:text-base tracking-[0.2em] uppercase max-w-lg mx-auto border-t border-b border-white/20 py-4 mt-6"
                    >
                        Woven with Passion | Draped in Elegance
                    </motion.p>
                </div>
            </section>

            {/* --- Our Story (Heritage) --- */}
            <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2">
                            <span className="text-amber-600 dark:text-amber-500 font-bold tracking-widest uppercase text-xs">Our Heritage</span>
                            <h2 className="text-4xl md:text-5xl font-serif leading-tight text-stone-900 dark:text-stone-100">
                                From the Heart of <span className="italic text-amber-700 dark:text-amber-500">Assam</span>
                            </h2>
                        </div>
                        <p className="text-lg leading-relaxed text-stone-600 dark:text-stone-400 font-light">
                            Stree Silk was born from a desire to preserve the vanishing art of hand-loomed textiles. Rooted in the ancient town of <strong>Sualkuchi</strong>, often called the &quot;Manchester of the East,&quot; our journey began with the golden thread of <span className="text-amber-600 dark:text-amber-500 font-serif italic">Muga Silk</span>.
                        </p>
                        <p className="text-lg leading-relaxed text-stone-600 dark:text-stone-400 font-light">
                            We believe that a saree is not just a garment; it is a story woven in six yards of history. Every thread tells a tale of the artisan&apos;s patience, the rhythmic clatter of the loom, and the timeless beauty of Indian royalty.
                        </p>
                        <div className="h-1 w-20 bg-amber-500"></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[500px] w-full"
                    >
                        <div className="absolute top-0 right-0 w-4/5 h-4/5 z-10 transition-transform duration-500 hover:-translate-y-2">
                            <Image
                                src="/post4jan.jpg"
                                alt="Golden Silk"
                                fill
                                className="object-cover rounded-sm shadow-2xl border-4 border-white dark:border-stone-800"
                            />
                        </div>
                        <div className="absolute bottom-0 left-0 w-3/5 h-3/5 z-20 transition-transform duration-500 hover:translate-y-2">
                            <Image
                                src="/post.jpg"
                                alt="Indian Textures"
                                fill
                                className="object-cover rounded-sm shadow-2xl border-4 border-white dark:border-stone-800"
                            />
                        </div>
                        {/* Decorative Gold Frame */}
                        <div className="absolute top-10 left-10 w-full h-full border border-amber-500/30 -z-10 rounded-sm"></div>
                    </motion.div>
                </div>
            </section>

            {/* --- Craftsmanship Values --- */}
            <section className="bg-stone-100 dark:bg-zinc-900 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <span className="font-mistral text-4xl text-amber-500">The Essence</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-stone-900 dark:text-stone-100 uppercase tracking-widest">
                            Purity in Every Thread
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                title: "Authenticity",
                                desc: "We source directly from heritage weavers, ensuring every piece is 100% authentic handloom.",
                                icon: "✦"
                            },
                            {
                                title: "Tradition",
                                desc: "Preserving age-old motifs and weaving techniques that have been passed down for generations.",
                                icon: "✺"
                            },
                            {
                                title: "Empowerment",
                                desc: "Fair trade practices that ensure our artisans are respected and compensated for their mastery.",
                                icon: "♥"
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.2 }}
                                className="text-center space-y-6 group p-8 border border-transparent hover:border-amber-500/30 transition-all duration-500 bg-white dark:bg-stone-950/50 rounded-sm shadow-sm hover:shadow-xl"
                            >
                                <span className="text-4xl text-amber-500 block mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                                <h3 className="text-xl font-serif font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 group-hover:text-amber-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-light text-sm">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Call to Action --- */}
            <section className="py-24 px-6 text-center bg-stone-900 dark:bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>
                <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-5xl font-serif italic text-amber-500">
                        Experience the Royalty
                    </h2>
                    <p className="text-stone-300 font-light text-lg leading-relaxed">
                        Adorn yourself in the timeless elegance of Stree Silk. Discover a collection that is as unique as you are.
                    </p>
                    <a href="/shop" className="inline-block border border-amber-500 text-amber-500 px-10 py-4 uppercase tracking-[0.2em] text-sm hover:bg-amber-500 hover:text-stone-900 transition-all duration-300">
                        Explore Collection
                    </a>
                </div>
            </section>
        </div>
    );
}

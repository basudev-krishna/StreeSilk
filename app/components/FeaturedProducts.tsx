"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";

export default function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch products using Server Action
        const fetchProducts = async () => {
            try {
                // Dynamically import to avoid server-side issues if any
                const { getProducts } = await import("../actions/products");
                const data = await getProducts({ limit: 4, skipInactive: true });
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch featured products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section className="py-32 bg-[#fafaf9] dark:bg-[#0c0a09]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <span className="text-xs font-medium text-amber-600/80 dark:text-amber-500/80 uppercase tracking-[0.3em] mb-4 block">
                        Selections
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-serif font-thin text-stone-900 dark:text-white mb-6 tracking-tight">
                        Featured Collection
                    </h2>
                    <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto font-light">
                        Discover our handpicked selection of premium silks designed for elegance and comfort.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {!loading ? (
                        products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        originalPrice: product.originalPrice,
                                        image: product.image,
                                        category: product.category,
                                        stockQuantity: product.stock
                                    }}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-stone-500 py-10">
                                No featured products available.
                            </div>
                        )
                    ) : (
                        Array(4).fill(0).map((_, index) => (
                            <div
                                key={index}
                                className="bg-stone-200 dark:bg-stone-800 h-72 sm:h-96 rounded-lg animate-pulse"
                            />
                        ))
                    )}
                </div>

                <div className="mt-20 text-center">
                    <Link
                        href="/shop"
                        className="inline-flex items-center px-10 py-4 border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-white text-stone-900 dark:text-white rounded-none transition-all duration-300 uppercase tracking-widest text-xs font-medium"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
}

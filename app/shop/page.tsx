"use client";

import { useState, useEffect, useCallback } from "react";
import { Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../actions/products";

const categories = [
    "All",
    "Silk",
    "Muga",
    "Paat",
    "New Arrivals",
];

const PRODUCTS_PER_PAGE = 16;

// Simple custom debounce since we might not have lodash
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOption, setSortOption] = useState("newest");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Server-side filtering via getProducts is better, but since getProducts returns ALL (filtered by category),
    // we can either refetch on search OR filter client side.
    // The previous plan was to update getProducts to accept query.
    // So we will trigger a fetch when search query changes.

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const debouncedSearch = useDebounce(searchQuery, 500);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // We pass query to backend. 
                // Note: category filtering is also largely happening in getting all products currently, 
                // assuming backend handles it or we handle it here. 
                // The current getProducts signature handles category too.
                const options: any = { skipInactive: true };

                if (debouncedSearch) {
                    options.query = debouncedSearch;
                }

                if (selectedCategory !== "All" && selectedCategory !== "Sale" && selectedCategory !== "New Arrivals") {
                    options.category = selectedCategory;
                }

                const data = await getProducts(options);

                // Client-side handling for Sale/New which might not be in backend filter yet for simplicity,
                // or ensure consistency. 
                // The backend getProducts supports category string match. 
                // "Sale" and "New" are boolean flags, so we might need to filter client side if backend doesn't support special "Sale" cat string.
                // Looking at backend code: it compares p.category === options.category.
                // So for "Sale" and "New Arrivals", we should filter client side or update backend more.
                // Let's filter client side for these special logic to avoid overcomplicating backend right now.

                let filtered = data;
                if (selectedCategory === "Sale") {
                    filtered = filtered.filter((p: any) => p.isSale === true);
                } else if (selectedCategory === "New Arrivals") {
                    filtered = filtered.filter((p: any) => p.isNew === true);
                }

                setProducts(filtered);
                setCurrentPage(1); // Reset to page 1 on new fetch
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [debouncedSearch, selectedCategory]);

    // Sorting
    const sortedProducts = [...products].sort((a, b) => {
        switch (sortOption) {
            case "newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "price-low":
                return a.price - b.price;
            case "price-high":
                return b.price - a.price;
            default:
                return 0;
        }
    });

    // Pagination Logic
    const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const currentProducts = sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setSearchQuery(""); // Optional: clear search on category switch? Maybe better to keep them separate.
        // Actually, let's keep search if user wants to search WITHIN category.
    };

    const handleSortChange = (value: string) => {
        setSortOption(value);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 mt-10 dark:bg-zinc-950">
            {/* Royal Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/banner.jpeg"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-stone-50 dark:to-zinc-950"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4x mx-auto space-y-6">
                    <span className="font-mistral text-4xl md:text-5xl text-amber-400 block mb-2 transform -rotate-2">
                        ...........
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-[0.2em] border-y border-amber-500/30 py-6 backdrop-blur-sm">
                        Stree Silk
                    </h1>
                    <p className="text-stone-300 max-w-lg mx-auto font-light tracking-wide text-sm md:text-base">
                        DISCOVER THE TIMELESS ELEGANCE OF AUTHENTIC ASSAMESE HERITAGE
                    </p>

                    {/* Royal Floating Search Bar */}
                    <div className="pt-8 max-w-xl mx-auto">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 via-amber-200/40 to-amber-500/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                            <div className="relative flex items-center bg-black/40 backdrop-blur-md rounded-full border border-amber-500/30 shadow-2xl">
                                <Search className="ml-6 text-amber-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for Muga, Paat, or Eri..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-4 bg-transparent border-none text-white placeholder:text-stone-400 focus:outline-none focus:ring-0 tracking-wide font-light"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Elegant Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 border-b border-stone-200 dark:border-zinc-800 pb-6">
                    {/* Category Tabs */}
                    <div className="w-full md:w-auto overflow-x-auto">
                        <div className="flex space-x-8 min-w-max px-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategorySelect(category)}
                                    className={`group relative pb-2 text-sm uppercase tracking-widest transition-colors ${selectedCategory === category
                                        ? "text-amber-600 dark:text-amber-500 font-semibold"
                                        : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
                                        }`}
                                >
                                    {category}
                                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 transform origin-left transition-transform duration-300 ${selectedCategory === category ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                        }`}></span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 bg-transparent pl-4 pr-4 py-2 text-sm uppercase tracking-wider text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-zinc-800 rounded-sm hover:border-amber-500 transition-colors focus:outline-none"
                        >
                            <span className="min-w-[100px] text-left">
                                {sortOption === "newest" && "Newest First"}
                                {sortOption === "price-low" && "Price: Low to High"}
                                {sortOption === "price-high" && "Price: High to Low"}
                            </span>
                            <Filter size={14} className="text-amber-500" />
                        </button>

                        {/* Custom Dropdown Menu */}
                        {isSortOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-stone-100 dark:border-zinc-800 shadow-xl rounded-sm z-50 py-1">
                                <button
                                    onClick={() => { handleSortChange("newest"); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm uppercase tracking-wider hover:bg-stone-50 dark:hover:bg-white/5 transition-colors ${sortOption === "newest" ? "text-amber-600 dark:text-amber-500 font-medium" : "text-stone-600 dark:text-stone-400"
                                        }`}
                                >
                                    Newest First
                                </button>
                                <button
                                    onClick={() => { handleSortChange("price-low"); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm uppercase tracking-wider hover:bg-stone-50 dark:hover:bg-white/5 transition-colors ${sortOption === "price-low" ? "text-amber-600 dark:text-amber-500 font-medium" : "text-stone-600 dark:text-stone-400"
                                        }`}
                                >
                                    Price: Low to High
                                </button>
                                <button
                                    onClick={() => { handleSortChange("price-high"); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm uppercase tracking-wider hover:bg-stone-50 dark:hover:bg-white/5 transition-colors ${sortOption === "price-high" ? "text-amber-600 dark:text-amber-500 font-medium" : "text-stone-600 dark:text-stone-400"
                                        }`}
                                >
                                    Price: High to Low
                                </button>
                            </div>
                        )}

                        {/* Backdrop to close on click outside */}
                        {isSortOpen && (
                            <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)}></div>
                        )}
                    </div>
                </div>

                {/* Loading State or Product Grid */}
                {loading ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                        <div className="h-12 w-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
                        <span className="font-mistral text-2xl text-amber-500">Loading elegance...</span>
                    </div>
                ) : (
                    <>
                        {/* Elegant Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 min-h-[400px]">
                            {currentProducts.length > 0 ? (
                                currentProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="group transition-all duration-500 hover:-translate-y-2"
                                    >
                                        <div className="bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-shadow duration-500 h-full flex flex-col">
                                            {/* We wrap ProductCard to override some styles or just let it be. 
                                                Since ProductCard has its own borders/shadows, we might want to strip them 
                                                if we could, but here we just add a wrapper for the lift effect. 
                                                Actually, ProductCard has a border. Let's try to hide it via overflow or css if needed. 
                                                For now, the wrapper effect adds to the card's own effect. */}
                                            <ProductCard
                                                product={{
                                                    id: product.id,
                                                    name: product.name,
                                                    price: product.price,
                                                    originalPrice: product.originalPrice,
                                                    image: product.image,
                                                    category: product.category,
                                                    stockQuantity: product.stock,
                                                }}
                                                variant="ghost"
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                                    <div className="h-px w-24 bg-amber-500/30 mb-6"></div>
                                    <p className="text-2xl font-light text-stone-400 mb-2">Each piece is unique.</p>
                                    <p className="text-sm text-stone-500 uppercase tracking-widest mb-6">No matches found for your criteria</p>
                                    <button
                                        onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                                        className="px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black uppercase tracking-widest text-xs hover:bg-amber-600 transition-colors"
                                    >
                                        View Full Collection
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Royal Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-24 flex flex-col items-center gap-6">
                                <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-3 rounded-full border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-stone-400 disabled:opacity-30 hover:border-amber-500 hover:text-amber-500 transition-all"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    <div className="flex items-center gap-2 px-4">
                                        <span className="text-sm uppercase tracking-widest text-stone-400">Page</span>
                                        <span className="font-mistral text-3xl text-amber-500">{currentPage}</span>
                                        <span className="text-sm uppercase tracking-widest text-stone-400">of {totalPages}</span>
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-3 rounded-full border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-stone-400 disabled:opacity-30 hover:border-amber-500 hover:text-amber-500 transition-all"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
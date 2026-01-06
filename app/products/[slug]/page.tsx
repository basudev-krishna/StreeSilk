"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";
import { Minus, Plus, ChevronRight, Home, Share2, Heart } from "lucide-react";
import { formatPrice } from "../../lib/formatters";
import AddToCartButton from "../../components/AddToCartButton";
import { motion, AnimatePresence } from "framer-motion";
import { getProduct, getProducts } from "../../actions/products";


export default function ProductDetailPage() {
    const { slug } = useParams();
    const productId = slug as string;

    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isDesktop, setIsDesktop] = useState(false);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const [activeImage, setActiveImage] = useState<string | null>(null);

    // ... existing refs and state ...

    useEffect(() => {
        const fetchData = async () => {
            if (!productId) return;
            try {
                const fetchedProduct = await getProduct(productId);
                setProduct(fetchedProduct);

                if (fetchedProduct) {
                    // Set initial active image
                    const initialImage = fetchedProduct.images?.[0] || fetchedProduct.image;
                    setActiveImage(initialImage);

                    const allProducts = await getProducts({ skipInactive: true });
                    setRelatedProducts(allProducts);

                    if (fetchedProduct.sizes?.length) {
                        setSelectedSize(fetchedProduct.sizes[0]);
                    }
                    if (fetchedProduct.colors?.length) {
                        setSelectedColor(fetchedProduct.colors[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    const filteredRelatedProducts = relatedProducts?.filter(p =>
        p.category === product?.category &&
        p.id !== productId
    ) || [];

    const limitedRelatedProducts = filteredRelatedProducts.slice(0, 4);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsDesktop(window.matchMedia('(min-width: 768px)').matches);

            const mediaQuery = window.matchMedia('(min-width: 768px)');
            const handleResize = (e: MediaQueryListEvent) => {
                setIsDesktop(e.matches);
            };

            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleResize);
                return () => mediaQuery.removeEventListener('change', handleResize);
            }
        }
    }, []);

    // --- Share & Like Logic ---
    const [isLiked, setIsLiked] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && product) {
            const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
            setIsLiked(wishlist.includes(product.id));
        }
    }, [product]);

    const showFeedback = (msg: string) => {
        setFeedbackMessage(msg);
        setTimeout(() => setFeedbackMessage(null), 3000);
    };

    const toggleLike = () => {
        if (!product) return;
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        let newWishlist;

        if (isLiked) {
            newWishlist = wishlist.filter((id: string) => id !== product.id);
            showFeedback("Removed from wishlist");
        } else {
            newWishlist = [...wishlist, product.id];
            showFeedback("Added to wishlist");
        }

        localStorage.setItem("wishlist", JSON.stringify(newWishlist));
        setIsLiked(!isLiked);
    };

    const handleShare = async () => {
        if (!product) return;
        const shareData = {
            title: `Stree Silk - ${product.name}`,
            text: `Check out this amazing ${product.name} on Stree Silk!`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log("Error sharing:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                showFeedback("Link copied to clipboard!");
            } catch (err) {
                showFeedback("Failed to copy link.");
            }
        }
    };
    // --------------------------

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                    <p className="text-sm font-light tracking-widest uppercase animate-pulse">Loading Luxury...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-6">
                <p className="text-xl font-light">Product not found.</p>
                <Link href="/shop" className="underline underline-offset-4 hover:text-primary transition-colors">
                    Return to Shop
                </Link>
            </div>
        );
    }

    const isOnSale = product.originalPrice && product.originalPrice > product.price;

    const incrementQuantity = () => {
        setQuantity(prev => Math.min(prev + 1, 10));
    };

    const decrementQuantity = () => {
        setQuantity(prev => Math.max(prev - 1, 1));
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current || !isDesktop) return;

        const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPosition({ x, y });
    };

    // Derived images array for consistent usage
    const productImages = product?.images?.length ? product.images : (product?.image ? [product.image] : []);
    const currentDisplayImage = activeImage || product?.image;

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-6 mb-8 text-xs font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                <Link href="/" className="hover:text-primary transition-colors"><Home size={14} /></Link>
                <ChevronRight size={14} />
                <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                <ChevronRight size={14} />
                <span className="text-foreground line-clamp-1">{product.name}</span>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

                    {/* 📸 Image Gallery Section */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                        <div
                            ref={imageContainerRef}
                            className={`relative aspect-[3/4] lg:aspect-square xl:aspect-[4/3] w-full overflow-hidden rounded-sm bg-secondary/30 border border-border/50 group ${isDesktop ? 'cursor-zoom-in' : ''}`}
                            onMouseEnter={() => isDesktop && setIsZoomed(true)}
                            onMouseLeave={() => isDesktop && setIsZoomed(false)}
                            onMouseMove={handleMouseMove}
                        >
                            {/* Blurred Background for Fill */}
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-110"
                                style={{ backgroundImage: `url(${currentDisplayImage})` }}
                            ></div>

                            {/* Main Image - Contain to show fully */}
                            <Image
                                src={currentDisplayImage}
                                alt={product.name}
                                fill
                                className={`relative z-10 object-contain p-4 sm:p-8 transition-transform duration-300 ease-out ${isZoomed && isDesktop ? 'scale-150' : 'scale-100'}`}
                                style={isZoomed && isDesktop ? {
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                } : undefined}
                                priority
                            />

                            {/* Badges */}
                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                {isOnSale && (
                                    <span className="bg-destructive text-destructive-foreground text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 shadow-sm">
                                        Sale
                                    </span>
                                )}
                                {product.stock <= 5 && product.stock > 0 && (
                                    <span className="bg-amber-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 shadow-sm">
                                        Low Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {productImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {productImages.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 border-2 rounded-sm overflow-hidden transition-all
                                            ${activeImage === img ? 'border-primary ring-1 ring-primary' : 'border-transparent hover:border-border'}
                                        `}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} view ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 📝 Product Details Section (Sticky) */}
                    <div className="lg:col-span-5 xl:col-span-4 relative">
                        <div className="sticky top-28 space-y-8">

                            {/* Header */}
                            <div className="space-y-4 border-b border-border pb-6">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-tight text-foreground leading-[1.1]">
                                    {product.name}
                                </h1>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground">
                                        {product.category}
                                    </p>
                                    <div className="relative flex items-center gap-3">
                                        <button
                                            onClick={handleShare}
                                            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary"
                                            title="Share Product"
                                        >
                                            <Share2 size={18} />
                                        </button>
                                        <button
                                            onClick={toggleLike}
                                            className={`transition-colors p-2 rounded-full hover:bg-secondary ${isLiked ? "text-red-500 fill-red-500 hover:text-red-600" : "text-muted-foreground hover:text-destructive"
                                                }`}
                                            title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                                        >
                                            <Heart size={18} className={isLiked ? "fill-current" : ""} />
                                        </button>

                                        {feedbackMessage && (
                                            <span className="absolute top-full right-0 mt-2 text-xs text-amber-600 font-medium whitespace-nowrap animate-in fade-in slide-in-from-top-1 bg-background/80 backdrop-blur px-2 py-1 rounded border border-amber-200 shadow-sm z-50">
                                                {feedbackMessage}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-light text-foreground">
                                    {formatPrice(product.price)}
                                </span>
                                {isOnSale && (
                                    <span className="text-lg text-muted-foreground line-through decoration-destructive/50">
                                        {formatPrice(product.originalPrice as number)}
                                    </span>
                                )}
                            </div>

                            {/* Selectors */}
                            <div className="space-y-6">
                                {/* Sizes */}
                                {product.sizes && product.sizes.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold uppercase tracking-widest">Size</span>
                                            <button className="text-xs underline text-muted-foreground hover:text-primary">Size Guide</button>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {product.sizes.map((size: string) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`h-10 min-w-[3rem] px-3 flex items-center justify-center border text-sm transition-all duration-200
                                                        ${selectedSize === size
                                                            ? "border-primary bg-primary text-primary-foreground"
                                                            : "border-border hover:border-foreground/50"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Colors */}
                                {product.colors && product.colors.length > 0 && (
                                    <div className="space-y-3">
                                        <span className="text-xs font-bold uppercase tracking-widest block">Color</span>
                                        <div className="flex flex-wrap gap-3">
                                            {product.colors.map((color: string) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`px-4 py-2 border text-sm transition-all duration-200
                                                        ${selectedColor === color
                                                            ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                                                            : "border-border hover:border-foreground/50"
                                                        }`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-4 pt-4">
                                <div className="flex gap-4">
                                    {/* Qty */}
                                    <div className="flex items-center border border-border h-12 w-32">
                                        <button
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            className="w-10 h-full flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="flex-1 text-center font-medium">{quantity}</span>
                                        <button
                                            onClick={incrementQuantity}
                                            disabled={quantity >= 10}
                                            className="w-10 h-full flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    {/* Add Button */}
                                    <div className="flex-1">
                                        {product.id && (
                                            <AddToCartButton
                                                product={{
                                                    id: product.id,
                                                    name: product.name,
                                                    price: product.price,
                                                    originalPrice: product.originalPrice,
                                                    image: product.image,
                                                    category: product.category,
                                                    stockQuantity: product.stock,
                                                }}
                                                size="lg"
                                                customQuantity={quantity}
                                                customSize={selectedSize}
                                                customColor={selectedColor}
                                                className="w-full h-12 uppercase tracking-widest text-xs font-bold rounded-none"
                                            />
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-center text-muted-foreground pt-2">
                                    Free shipping on orders over Rs. 3000 • 30-day returns
                                </p>
                            </div>

                            {/* Description Accordion (Simplified as text for now) */}
                            <div className="border-t border-border pt-6 mt-8">
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Description</h3>
                                <div className="text-sm text-muted-foreground leading-loose font-light prose dark:prose-invert max-w-none">
                                    {product.description || "No description available."}
                                    <div className="mt-4">
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li>100% Authentic Assamese Silk</li>
                                            <li>Handwoven by traditional artisans</li>
                                            <li>Eco-friendly dyes</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {limitedRelatedProducts.length > 0 && (
                    <div className="mt-32 mb-16 border-t border-border pt-16">
                        <div className="flex justify-between items-end mb-10">
                            <h2 className="text-2xl md:text-3xl font-serif font-light text-foreground">Curated For You</h2>
                            <Link href="/shop" className="text-sm border-b border-primary pb-1 hover:text-primary transition-colors">
                                View Collection
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                            {limitedRelatedProducts.map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        originalPrice: product.originalPrice,
                                        image: product.image,
                                        category: product.category,
                                        stockQuantity: product.stock,
                                        slug: product.slug || product.id
                                    }}
                                    hideAddToCart={true}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 

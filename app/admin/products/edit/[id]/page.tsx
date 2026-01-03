"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { redirect, useParams } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProduct, updateProduct } from "../../../../actions/products";
import { uploadImage } from "../../../../actions/upload";

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
    ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map(email => email.trim())
    : [];

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;

    const { user } = useUser();
    const { isLoaded, isSignedIn } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [product, setProduct] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        originalPrice: 0,
        image: "",
        category: "",
        sizes: "",
        colors: "",
        isNew: false,
        isSale: false,
        isActive: true,
        stock: 0,
    });

    useEffect(() => {
        const init = async () => {
            if (isLoaded) {
                if (!isSignedIn) {
                    redirect("/");
                    return;
                }

                const email = user?.primaryEmailAddress?.emailAddress;
                const isAdmin = email && ADMIN_EMAILS.includes(email);

                if (!isAdmin) {
                    redirect("/");
                    return;
                }

                try {
                    const fetchedProduct = await getProduct(id);
                    if (fetchedProduct) {
                        setProduct(fetchedProduct);
                    } else {
                        // Product not found logic
                    }
                } catch (error) {
                    console.error("Error fetching product:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        init();
    }, [isLoaded, isSignedIn, user, id]);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description || "",
                price: product.price / 100,
                originalPrice: (product.originalPrice || 0) / 100,
                image: product.image,
                category: product.category,
                sizes: product.sizes ? product.sizes.join(", ") : "",
                colors: product.colors ? product.colors.join(", ") : "",
                isNew: product.isNew || false,
                isSale: product.isSale || false,
                isActive: product.isActive !== false,
                stock: product.stock || 0,
            });
        }
    }, [product]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Product not found.</p>
                <Link href="/admin">
                    <Button variant="outline" className="mt-4">Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === "price" || name === "originalPrice" || name === "stock") {
            const numValue = parseFloat(value) || 0;
            setFormData(prev => ({ ...prev, [name]: numValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) return;

        setSubmitting(true);

        try {
            const sizesArray = formData.sizes
                ? formData.sizes.split(",").map(s => s.trim()).filter(Boolean)
                : undefined;

            const colorsArray = formData.colors
                ? formData.colors.split(",").map(c => c.trim()).filter(Boolean)
                : undefined;

            const stockValue = typeof formData.stock === 'number' ? formData.stock : parseInt(String(formData.stock), 10) || 0;

            await updateProduct(id, {
                name: formData.name,
                description: formData.description || undefined,
                price: Math.round(formData.price * 100),
                originalPrice: formData.originalPrice > 0 ? Math.round(formData.originalPrice * 100) : undefined,
                image: formData.image,
                category: formData.category,
                sizes: sizesArray,
                colors: colorsArray,
                isNew: formData.isNew,
                isSale: formData.isSale,
                isActive: formData.isActive,
                stock: stockValue > 0 ? stockValue : undefined,
                clerkId: user.id,
            });

            window.location.href = "/admin";
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft size={16} />
                    <span>Back to Dashboard</span>
                </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Edit Product</h1>

            <div className="bg-card p-4 sm:p-6 rounded-lg shadow max-w-3xl">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        {/* Product name */}
                        <div className="col-span-2">
                            <label className="block mb-2 font-medium">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block mb-2 font-medium">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="">Select a category</option>
                                <option value="Silk">Silk&apos;s Saree</option>
                                <option value="Muga">Muga&apos;s Saree</option>
                                <option value="Paat">Paat&apos;s Saree</option>
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block mb-2 font-medium">Product Image</label>

                            <div className="flex flex-col gap-4">
                                {formData.image && (
                                    <div className="relative w-full h-48 sm:h-64 bg-secondary rounded-md overflow-hidden">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-full h-full object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/90"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            setUploading(true);
                                            const data = new FormData();
                                            data.append("file", file);

                                            const result = await uploadImage(data);

                                            if (result.success && result.url) {
                                                setFormData(prev => ({ ...prev, image: result.url }));
                                            } else {
                                                alert("Failed to upload image");
                                            }
                                            setUploading(false);
                                        }}
                                        className="w-full p-2 border border-border rounded-md bg-background file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                    />
                                    {uploading && <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>}
                                </div>
                                <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WEBP</p>
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block mb-2 font-medium">Price (RS)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Original Price */}
                        <div>
                            <label className="block mb-2 font-medium">Original Price (RS, if on sale)</label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Sizes */}
                        <div>
                            <label className="block mb-2 font-medium">Sizes (comma-separated)</label>
                            <input
                                type="text"
                                name="sizes"
                                value={formData.sizes}
                                onChange={handleChange}
                                placeholder="S, M, L, XL"
                                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="block mb-2 font-medium">Colors (comma-separated)</label>
                            <input
                                type="text"
                                name="colors"
                                value={formData.colors}
                                onChange={handleChange}
                                placeholder="Red, Blue, Black"
                                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block mb-2 font-medium">Stock Quantity</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                step="1"
                                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <label className="block mb-2 font-medium">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Flags */}
                        <div className="col-span-2 flex flex-wrap gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isNew"
                                    checked={formData.isNew}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50"
                                />
                                <span>Mark as New Arrival</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isSale"
                                    checked={formData.isSale}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50"
                                />
                                <span>Mark as On Sale</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50"
                                />
                                <span>Active (visible on site)</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href="/admin">
                            <Button variant="outline" type="button" disabled={submitting}>
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Updating Product..." : "Update Product"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProduct } from "../../../actions/products";
import { uploadImage } from "../../../actions/upload";

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
    ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map(email => email.trim())
    : [];

export default function NewProductPage() {
    const { user } = useUser();
    const { isLoaded, isSignedIn } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isLoaded) {
            if (!isSignedIn) {
                redirect("/");
            } else {
                const email = user?.primaryEmailAddress?.emailAddress;
                const isAdmin = email && ADMIN_EMAILS.includes(email);
                if (!isAdmin) {
                    redirect("/");
                } else {
                    setLoading(false);
                }
            }
        }
    }, [isLoaded, isSignedIn, user]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        originalPrice: 0,
        images: [] as string[],
        category: "",
        sizes: "",
        colors: "",
        isNew: false,
        isSale: false,
        isActive: true,
        stock: 0,
    });

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
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
            const finalValue = name === "stock" ? numValue : numValue * 100;
            setFormData(prev => ({ ...prev, [name]: finalValue }));
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

            await createProduct({
                name: formData.name,
                description: formData.description || undefined,
                price: formData.price,
                originalPrice: formData.originalPrice > 0 ? formData.originalPrice : undefined,
                images: formData.images,
                category: formData.category,
                sizes: sizesArray,
                colors: colorsArray,
                isNew: formData.isNew,
                isSale: formData.isSale,
                isActive: formData.isActive,
                stock: formData.stock > 0 ? formData.stock : undefined,
                clerkId: user.id,
            });

            window.location.href = "/admin";
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product. Please try again.");
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

            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Add New Product</h1>

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
                            <label className="block mb-2 font-medium">Product Images (Max 3)</label>

                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="relative w-full h-32 bg-secondary rounded-md overflow-hidden group">
                                            <img
                                                src={img}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    images: prev.images.filter((_, i) => i !== index)
                                                }))}
                                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                                            </button>
                                        </div>
                                    ))}

                                    {formData.images.length < 3 && (
                                        <div className="border-2 border-dashed border-border rounded-md flex items-center justify-center p-4 hover:bg-secondary/50 transition-colors h-32 relative">
                                            {uploading ? (
                                                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                                            ) : (
                                                <>
                                                    <span className="text-3xl text-muted-foreground font-light">+</span>
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
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    images: [...prev.images, result.url]
                                                                }));
                                                            } else {
                                                                alert("Failed to upload image");
                                                            }
                                                            setUploading(false);
                                                            // Reset input
                                                            e.target.value = "";
                                                        }}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WEBP. First image will be the main cover.</p>
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block mb-2 font-medium">Price (RS)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price / 100}
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
                                value={formData.originalPrice / 100}
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
                            {submitting ? "Adding Product..." : "Add Product"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
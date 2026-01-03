"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import {
    getCartItems,
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart as clearCartAction
} from "../actions/cart";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    quantity: number;
    size?: string;
    color?: string;
    productId?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
    const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
    const { user } = useUser();
    const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);
    const [dbCartItems, setDbCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSyncedCart, setHasSyncedCart] = useState(false);

    // Load local cart
    useEffect(() => {
        if (isAuthLoaded) {
            if (!isSignedIn) {
                const savedCart = localStorage.getItem("cart");
                if (savedCart) {
                    try {
                        setLocalCartItems(JSON.parse(savedCart));
                    } catch (error) {
                        console.error("Failed to parse cart from localStorage:", error);
                    }
                }
                setIsLoading(false);
            }
        }
    }, [isAuthLoaded, isSignedIn]);

    // Save local cart
    useEffect(() => {
        if (!isSignedIn) {
            localStorage.setItem("cart", JSON.stringify(localCartItems));
        }
    }, [localCartItems, isSignedIn]);

    // Fetch DB cart
    useEffect(() => {
        const fetchDbCart = async () => {
            if (isSignedIn && user?.id) {
                try {
                    setIsLoading(true);
                    const items = await getCartItems(user.id);
                    // Map DB items to CartItems
                    const mapped = items.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        originalPrice: item.originalPrice,
                        image: item.image,
                        category: item.category,
                        quantity: item.quantity,
                        size: item.size,
                        color: item.color,
                        productId: item.productId
                    }));
                    setDbCartItems(mapped);
                } catch (e) {
                    console.error("Error fetching cart from DB:", e);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (isAuthLoaded && isSignedIn) {
            fetchDbCart();
        }
    }, [isSignedIn, user, isAuthLoaded]);

    // Sync local to DB on login
    useEffect(() => {
        const syncLocalCartToDatabase = async () => {
            if (isSignedIn && user?.id && !hasSyncedCart && localCartItems.length > 0) {
                try {
                    setIsLoading(true);
                    for (const item of localCartItems) {
                        await addToCart({
                            clerkId: user.id,
                            productId: item.productId || item.id, // Ensure productId is set correctly
                            name: item.name,
                            price: item.price,
                            originalPrice: item.originalPrice,
                            image: item.image,
                            category: item.category,
                            quantity: item.quantity,
                            size: item.size,
                            color: item.color,
                        });
                    }
                    localStorage.removeItem("cart");
                    setLocalCartItems([]);
                    setHasSyncedCart(true);

                    // Refresh DB cart
                    const items = await getCartItems(user.id);
                    setDbCartItems(items as any);
                } catch (error) {
                    console.error("Error syncing local cart to database:", error);
                } finally {
                    setIsLoading(false);
                }
            } else if (isSignedIn && user?.id && !hasSyncedCart) {
                setHasSyncedCart(true);
            }
        };

        if (isAuthLoaded && isSignedIn) {
            syncLocalCartToDatabase();
        }
    }, [isSignedIn, user, hasSyncedCart, localCartItems, isAuthLoaded]);

    const cartItems = isSignedIn ? dbCartItems : localCartItems;

    const addToCartHandler = async (item: Omit<CartItem, "quantity">, quantity = 1) => {
        if (isSignedIn && user?.id) {
            try {
                // Optimistic update
                const newItem: CartItem = { ...item, quantity, id: "temp-" + Date.now() }; // Temp ID
                setDbCartItems(prev => [...prev, newItem]);

                await addToCart({
                    clerkId: user.id,
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    originalPrice: item.originalPrice,
                    image: item.image,
                    category: item.category,
                    quantity,
                    size: item.size,
                    color: item.color,
                });

                // Refetch to get real IDs
                const serverItems = await getCartItems(user.id);
                const mapped = serverItems.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    originalPrice: item.originalPrice,
                    image: item.image,
                    category: item.category,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    productId: item.productId
                }));
                setDbCartItems(mapped);

            } catch (error) {
                console.error("Failed to add item to cart:", error);
                // Revert optimistic update logic would go here
            }
        } else {
            setLocalCartItems((prevItems) => {
                const existingItemIndex = prevItems.findIndex((cartItem) => cartItem.id === item.id);

                if (existingItemIndex > -1) {
                    const updatedItems = [...prevItems];
                    updatedItems[existingItemIndex].quantity += quantity;
                    return updatedItems;
                } else {
                    return [...prevItems, { ...item, quantity }];
                }
            });
        }
    };

    const removeFromCartHandler = async (id: string) => {
        if (isSignedIn && user?.id) {
            try {
                setDbCartItems(prev => prev.filter(item => item.id !== id));
                await removeCartItem(id, user.id);
            } catch (error) {
                console.error("Failed to remove item from cart:", error);
            }
        } else {
            setLocalCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        }
    };

    const updateQuantityHandler = async (id: string, quantity: number) => {
        if (quantity < 1) return;

        if (isSignedIn && user?.id) {
            try {
                setDbCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
                await updateCartItemQuantity(id, quantity, user.id);
            } catch (error) {
                console.error("Failed to update cart item quantity:", error);
            }
        } else {
            setLocalCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                )
            );
        }
    };

    const clearCartHandler = async () => {
        if (isSignedIn && user?.id) {
            try {
                setDbCartItems([]);
                await clearCartAction(user.id);
            } catch (error) {
                console.error("Failed to clear cart:", error);
            }
        } else {
            setLocalCartItems([]);
            localStorage.removeItem("cart");
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart: addToCartHandler,
                removeFromCart: removeFromCartHandler,
                updateQuantity: updateQuantityHandler,
                clearCart: clearCartHandler,
                getCartTotal,
                getCartCount,
                isLoading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
} 
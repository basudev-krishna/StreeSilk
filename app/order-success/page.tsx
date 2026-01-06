"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { getOrder } from "@/app/actions/order";

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            const fetchOrder = async () => {
                try {
                    const data = await getOrder(orderId);
                    setOrder(data);
                } catch (error) {
                    console.error("Failed to fetch order:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                <Link href="/" className="text-primary hover:underline">
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-8 sm:p-12 text-center border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-serif font-medium mb-4">Order Successful!</h1>
                    <p className="text-muted-foreground text-lg mb-2">
                        Thank you for your purchase.
                    </p>
                    <p className="text-sm font-mono text-muted-foreground">
                        Order ID: {order.id}
                    </p>
                </div>

                <div className="p-8 sm:p-12">
                    <div className="mb-8 p-4 bg-muted/50 rounded-lg border border-border">
                        <div className="flex justify-between items-center text-sm sm:text-base">
                            <span className="font-medium text-muted-foreground">Payment Mode</span>
                            <span className="font-semibold">{order.paymentMode}</span>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5" /> Order Details
                    </h2>

                    <div className="space-y-6">
                        {order.items.map((item: any) => (
                            <div key={item.productId || item.id} className="flex gap-4 items-center">
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={64}
                                        height={64}
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Qty: {item.quantity} × {formatPrice(item.price)}
                                    </div>
                                    {item.size && <span className="text-xs text-muted-foreground mr-2">Size: {item.size}</span>}
                                    {item.color && <span className="text-xs text-muted-foreground">Color: {item.color}</span>}
                                </div>
                                <div className="font-medium">
                                    {formatPrice(item.price * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-border space-y-3">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium transition-transform hover:scale-105"
                        >
                            Continue Shopping <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

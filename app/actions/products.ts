"use server";

import { db, TableNames } from "@/lib/dynamodb";
import { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Helper to check admin status
// In a real app, you might query the Users table. 
// For now, we reuse the hardcoded list logic from the original convex/users.ts for safety until Users table is populated.
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
    ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map(email => email.trim())
    : [];

async function isUserAdmin() {
    const user = await currentUser();
    if (!user) return false;

    // Check against email list
    const email = user.emailAddresses[0]?.emailAddress;
    if (email && ADMIN_EMAILS.includes(email)) return true;

    // Check against database (if migrated)
    try {
        const { Item } = await db.send(new GetCommand({
            TableName: TableNames.USERS,
            Key: { clerkId: user.id }
        }));
        return Item?.isAdmin === true;
    } catch (e) {
        console.error("Error checking admin status:", e);
        return false;
    }
}

export async function getProducts(options?: { limit?: number; category?: string; skipInactive?: boolean; query?: string }) {
    try {
        const command = new ScanCommand({
            TableName: TableNames.PRODUCTS,
        });

        const response = await db.send(command);
        let products = response.Items || [];

        // Filter by category
        if (options?.category) {
            products = products.filter((p) => p.category === options.category);
        }

        // Filter inactive
        if (options?.skipInactive) {
            products = products.filter((p) => p.isActive === true);
        }

        // Filter by search query
        if (options?.query) {
            const lowerQuery = options.query.toLowerCase();
            products = products.filter((p) =>
                p.name.toLowerCase().includes(lowerQuery) ||
                (p.description && p.description.toLowerCase().includes(lowerQuery))
            );
        }

        // Sort by createdAt desc (Newest first)
        products.sort((a, b) => b.createdAt - a.createdAt);

        // Limit
        if (options?.limit) {
            products = products.slice(0, options.limit);
        }

        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function getProduct(id: string) {
    try {
        const command = new GetCommand({
            TableName: TableNames.PRODUCTS,
            Key: { id },
        });
        const response = await db.send(command);
        return response.Item || null;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export async function createProduct(data: any) {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const id = uuidv4();
    const now = Date.now();

    const product = {
        id,
        ...data,
        image: data.images?.[0] || data.image, // Main image for backward compatibility
        images: data.images || (data.image ? [data.image] : []), // Array of images
        createdAt: now,
        updatedAt: now,
    };

    try {
        await db.send(new PutCommand({
            TableName: TableNames.PRODUCTS,
            Item: product,
        }));
        revalidatePath("/");
        revalidatePath("/shop");
        revalidatePath("/admin");
        return id;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}

export async function updateProduct(id: string, data: any) {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const now = Date.now();

    // Construct UpdateExpression
    // This is a simplified version. For a robust implementation, generate dynamically.
    // For now, allow replacing the item or manually setting fields.
    // DynamoDB UpdateItem is complex to generate dynamically.
    // Simpler approach for migration: Get -> Merge -> Put

    try {
        const current = await getProduct(id);
        if (!current) throw new Error("Product not found");

        const updated = {
            ...current,
            ...data,
            image: data.images?.[0] || data.image || current.image, // Ensure main image exists
            images: data.images || (data.image ? [data.image] : current.images || [current.image]), // Ensure array exists
            updatedAt: now,
            id // ensure ID doesn't change
        };

        await db.send(new PutCommand({
            TableName: TableNames.PRODUCTS,
            Item: updated,
        }));

        revalidatePath("/");
        revalidatePath("/shop");
        revalidatePath("/admin");
        return id;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

export async function deleteProduct(id: string) {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    try {
        await db.send(new DeleteCommand({
            TableName: TableNames.PRODUCTS,
            Key: { id },
        }));

        revalidatePath("/");
        revalidatePath("/shop");
        revalidatePath("/admin");
        return true;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}

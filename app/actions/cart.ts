"use server";

import { db, TableNames } from "@/lib/dynamodb";
import { QueryCommand, PutCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath } from "next/cache";

export async function getCartItems(clerkId: string) {
    try {
        const command = new QueryCommand({
            TableName: TableNames.CART,
            KeyConditionExpression: "clerkId = :uid",
            ExpressionAttributeValues: {
                ":uid": clerkId
            }
        });

        const response = await db.send(command);
        return response.Items || [];
    } catch (error) {
        console.error("Error getting cart:", error);
        return [];
    }
}

export async function addToCart(data: any) {
    const { clerkId, productId, quantity, ...productData } = data;

    try {
        // Check if item exists using Query for efficient lookup
        const queryCmd = new QueryCommand({
            TableName: TableNames.CART,
            KeyConditionExpression: "clerkId = :uid AND productId = :pid",
            ExpressionAttributeValues: {
                ":uid": clerkId,
                ":pid": productId
            }
        });

        const existing = await db.send(queryCmd);
        const existingItem = existing.Items?.[0];

        const now = Date.now();

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            // Update existing item
            await db.send(new UpdateCommand({
                TableName: TableNames.CART,
                Key: {
                    clerkId: clerkId,
                    productId: productId
                },
                UpdateExpression: "set quantity = :q, updatedAt = :u",
                ExpressionAttributeValues: {
                    ":q": newQuantity,
                    ":u": now
                }
            }));
        } else {
            // Add new item
            // We set 'id' to productId so the frontend uses productId as the stable ID
            await db.send(new PutCommand({
                TableName: TableNames.CART,
                Item: {
                    clerkId,
                    productId,
                    id: productId, // Important: matching id to productId for frontend consistency
                    quantity,
                    ...productData,
                    createdAt: now,
                    updatedAt: now
                }
            }));
        }

        revalidatePath("/cart");
        return true;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number, clerkId: string) {
    if (quantity <= 0) {
        return removeCartItem(cartItemId, clerkId);
    }

    try {
        // cartItemId is actually the productId because we saved it that way in addToCart
        const productId = cartItemId;

        await db.send(new UpdateCommand({
            TableName: TableNames.CART,
            Key: {
                clerkId: clerkId,
                productId: productId
            },
            UpdateExpression: "set quantity = :q, updatedAt = :u",
            ExpressionAttributeValues: {
                ":q": quantity,
                ":u": Date.now()
            },
            ConditionExpression: "attribute_exists(clerkId)" // Ensure item exists
        }));

        revalidatePath("/cart");
        return true;
    } catch (error) {
        console.error("Error updating cart:", error);
        throw error;
    }
}

export async function removeCartItem(cartItemId: string, clerkId: string) {
    try {
        const productId = cartItemId;

        await db.send(new DeleteCommand({
            TableName: TableNames.CART,
            Key: {
                clerkId: clerkId,
                productId: productId
            }
        }));
        revalidatePath("/cart");
        return true;
    } catch (error) {
        console.error("Error removing cart item:", error);
        throw error;
    }
}

export async function clearCart(clerkId: string) {
    try {
        const items = await getCartItems(clerkId);

        // Delete all items
        // In production, use BatchWriteCommand for efficiency
        const deletePromises = items.map(item =>
            db.send(new DeleteCommand({
                TableName: TableNames.CART,
                Key: {
                    clerkId: clerkId,
                    productId: item.productId // Use correct keys
                }
            }))
        );

        await Promise.all(deletePromises);

        revalidatePath("/cart");
        return true;
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
}

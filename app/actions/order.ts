"use server";

import { db, TableNames } from "@/lib/dynamodb";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { sendOrderEmail } from "./email";

export async function submitOrder(cartItems: any[], total: number) {
    const user = await currentUser();

    if (!user) {
        throw new Error("User must be logged in to place an order.");
    }

    const id = uuidv4();
    const now = Date.now();

    const order = {
        id,
        userId: user.id,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses[0]?.emailAddress
        },
        items: cartItems,
        total,
        status: "pending",
        paymentMode: "Cash on Delivery",
        createdAt: now,
    };

    try {
        // 1. Save to DynamoDB
        await db.send(new PutCommand({
            TableName: TableNames.ORDERS,
            Item: order,
        }));

        // 2. Send Email (Fire and forget, or await if critical)
        await sendOrderEmail(order);

        return id;
    } catch (error) {
        console.error("Error submitting order:", error);
        throw error;
    }
}

export async function getOrder(orderId: string) {
    try {
        const result = await db.send(new GetCommand({
            TableName: TableNames.ORDERS,
            Key: { id: orderId },
        }));

        return result.Item;
    } catch (error) {
        console.error("Error fetching order:", error);
        return null; // Or throw
    }
}

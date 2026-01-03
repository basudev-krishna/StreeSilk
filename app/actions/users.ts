"use server";

import { db, TableNames } from "@/lib/dynamodb";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
    ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map(email => email.trim())
    : [];

export async function syncUser(user: { clerkId: string; email: string; name?: string; imageUrl?: string }) {
    try {
        const isAdmin = ADMIN_EMAILS.includes(user.email);
        const now = Date.now();

        // Check if user exists
        const { Item: existingUser } = await db.send(new GetCommand({
            TableName: TableNames.USERS,
            Key: { clerkId: user.clerkId }
        }));

        if (existingUser) {
            // Update
            await db.send(new PutCommand({
                TableName: TableNames.USERS,
                Item: {
                    ...existingUser,
                    email: user.email,
                    name: user.name,
                    imageUrl: user.imageUrl,
                    isAdmin: existingUser.isAdmin || isAdmin, // Keep existing admin status or grant if in list
                    updatedAt: now,
                }
            }));
        } else {
            // Create
            await db.send(new PutCommand({
                TableName: TableNames.USERS,
                Item: {
                    clerkId: user.clerkId,
                    email: user.email,
                    name: user.name || "",
                    imageUrl: user.imageUrl || "",
                    isAdmin: isAdmin,
                    preferences: {
                        theme: "system",
                        receiveEmails: true,
                    },
                    createdAt: now,
                    updatedAt: now,
                }
            }));
        }
        return true;
    } catch (error) {
        console.error("Error syncing user:", error);
        return false;
    }
}

export async function getUser(clerkId: string) {
    try {
        const { Item } = await db.send(new GetCommand({
            TableName: TableNames.USERS,
            Key: { clerkId }
        }));
        return Item || null;
    } catch (error) {
        console.error("Error getting user:", error);
        return null;
    }
}

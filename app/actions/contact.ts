"use server";

import { db, TableNames } from "@/lib/dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { sendContactEmail } from "./email";

export async function submitContactMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    clerkId?: string;
}) {
    const id = uuidv4();
    const now = Date.now();

    const message = {
        id,
        ...data,
        createdAt: now,
        status: "new" // potentially used for admin dashboard
    };

    try {
        await db.send(new PutCommand({
            TableName: TableNames.CONTACTS, // Corrected table name
            Item: message,
        }));

        // Send email notification
        await sendContactEmail({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message
        });

        return id;
    } catch (error) {
        console.error("Error submitting contact message:", error);
        throw error;
    }
}

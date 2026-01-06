"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function sendOrderEmail(orderData: any) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn("Skipping email sending: GMAIL_USER or GMAIL_APP_PASSWORD not set.");
        return;
    }

    const { id, items, total, paymentMode, user } = orderData;

    // Correctly accessing user data
    // Assuming 'user' object has 'firstName', 'lastName' or similar, OR we use data passed from the client
    // For now, let's look at what we likely have. 
    // If 'user' comes from Clerk's `currentUser()`, it has `firstName`, `primaryEmailAddress`.
    // Let's assume we pass a simplified customer object or formatted strings to be safe.

    // Constructing the email HTML
    const itemsHtml = items.map((item: any) => `
        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <p><strong>${item.name}</strong></p>
            <p>Qty: ${item.quantity} x ₹${item.price}</p>
        </div>
    `).join("");

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: "streesilk41@gmail.com", // Send to admin as requested
        subject: `New Order Received - Order #${id}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">New Order Received</h1>
                <p><strong>Order ID:</strong> ${id}</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <h3>Customer Details</h3>
                    <p><strong>User ID:</strong> ${user?.id || "Guest"}</p>
                    <p><strong>Name:</strong> ${user?.firstName || ""} ${user?.lastName || ""}</p>
                     <p><strong>Email:</strong> ${user?.email || "N/A"}</p>
                </div>

                <h3>Order Items</h3>
                ${itemsHtml}

                <div style="margin-top: 20px; font-size: 1.2em;">
                    <p><strong>Total Amount:</strong> ₹${total}</p>
                    <p><strong>Payment Mode:</strong> ${paymentMode}</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Order email sent for Order #${id}`);
    } catch (error) {
        console.error("Error sending order email:", error);
        // We don't throw here to avoid failing the order if email fails
    }
}

export async function sendContactEmail(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn("Skipping email sending: GMAIL_USER or GMAIL_APP_PASSWORD not set.");
        return;
    }

    const { name, email, subject, message } = contactData;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: "streesilk41@gmail.com",
        replyTo: email, // Allow replying directly to the sender
        subject: `Contact Form: ${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Contact Message</h2>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                </div>
                
                <h3>Message:</h3>
                <div style="border-left: 4px solid #ddd; padding-left: 15px; margin-top: 10px;">
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Contact email sent from ${email}`);
    } catch (error) {
        console.error("Error sending contact email:", error);
        // Don't throw, just log
    }
}

"use server";

import { uploadFileToS3 } from "@/lib/s3";
import { v4 as uuidv4 } from "uuid";

export async function uploadImage(formData: FormData) {
    try {
        const file = formData.get("file") as File;

        if (!file) {
            throw new Error("No file uploaded");
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileExtension = file.name.split(".").pop();
        const fileName = `products/${uuidv4()}.${fileExtension}`;
        const contentType = file.type;

        const imageUrl = await uploadFileToS3(buffer, fileName, contentType);

        return { success: true, url: imageUrl };
    } catch (error) {
        console.error("Error uploading image:", error);
        return { success: false, error: "Failed to upload image" };
    }
}

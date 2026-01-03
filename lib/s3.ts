import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION || process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function uploadFileToS3(fileBuffer: Buffer, fileName: string, contentType: string) {
    const bucketName = process.env.AWS_BUCKET_NAME;

    if (!bucketName) {
        throw new Error("AWS_BUCKET_NAME is not defined in environment variables");
    }

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Return the URL of the uploaded file
    // Assuming standard S3 URL format. If using CloudFront, this would change.
    return `https://${bucketName}.s3.${process.env.AWS_S3_REGION || process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${fileName}`;
}

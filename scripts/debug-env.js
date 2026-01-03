import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

console.log("Checking environment variables...");
console.log("AWS_REGION:", process.env.AWS_REGION);
console.log("AWS_S3_REGION:", process.env.AWS_S3_REGION);
console.log("AWS_ACCESS_KEY_ID Present:", !!process.env.AWS_ACCESS_KEY_ID);
if (process.env.AWS_ACCESS_KEY_ID) {
    console.log("AWS_ACCESS_KEY_ID Length:", process.env.AWS_ACCESS_KEY_ID.length);
    console.log("AWS_ACCESS_KEY_ID Starts with:", process.env.AWS_ACCESS_KEY_ID.substring(0, 4));
}
console.log("AWS_SECRET_ACCESS_KEY Present:", !!process.env.AWS_SECRET_ACCESS_KEY);
if (process.env.AWS_SECRET_ACCESS_KEY) {
    console.log("AWS_SECRET_ACCESS_KEY Length:", process.env.AWS_SECRET_ACCESS_KEY.length);
}

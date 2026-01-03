import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export const db = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
        removeUndefinedValues: true,
    },
});

export const TableNames = {
    USERS: process.env.DYNAMODB_TABLE_USERS || "Users",
    PRODUCTS: process.env.DYNAMODB_TABLE_PRODUCTS || "Products",
    CART: process.env.DYNAMODB_TABLE_CART || "CartItems",
    CONTACTS: process.env.DYNAMODB_TABLE_CONTACTS || "ContactMessages",
};

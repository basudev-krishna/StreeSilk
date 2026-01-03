
import { DynamoDBClient, CreateTableCommand, ResourceInUseException } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

const TableNames = {
    USERS: process.env.DYNAMODB_TABLE_USERS || "Users",
    PRODUCTS: process.env.DYNAMODB_TABLE_PRODUCTS || "Products",
    CART: process.env.DYNAMODB_TABLE_CART || "CartItems",
    CONTACTS: process.env.DYNAMODB_TABLE_CONTACTS || "ContactMessages",
};

const tables = [
    {
        TableName: TableNames.USERS,
        KeySchema: [{ AttributeName: "clerkId", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "clerkId", AttributeType: "S" }],
        BillingMode: "PAY_PER_REQUEST",
    },
    {
        TableName: TableNames.PRODUCTS,
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        BillingMode: "PAY_PER_REQUEST",
    },
    {
        TableName: TableNames.CART,
        KeySchema: [
            { AttributeName: "clerkId", KeyType: "HASH" },
            { AttributeName: "productId", KeyType: "RANGE" },
        ],
        AttributeDefinitions: [
            { AttributeName: "clerkId", AttributeType: "S" },
            { AttributeName: "productId", AttributeType: "S" },
        ],
        BillingMode: "PAY_PER_REQUEST",
    },
    {
        TableName: TableNames.CONTACTS,
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        BillingMode: "PAY_PER_REQUEST",
    },
];

async function createTables() {
    console.log("Creating tables...");

    for (const table of tables) {
        try {
            console.log(`Creating table: ${table.TableName}`);
            await client.send(new CreateTableCommand(table));
            console.log(`Table ${table.TableName} created successfully.`);
        } catch (error) {
            if (error instanceof ResourceInUseException) {
                console.log(`Table ${table.TableName} already exists.`);
            } else {
                console.error(`Error creating table ${table.TableName}:`, error);
            }
        }
    }
}

createTables();

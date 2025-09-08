"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// services/user-service/src/database/dynamoClient.ts
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1", // 👈 región por defecto
});
exports.default = client;

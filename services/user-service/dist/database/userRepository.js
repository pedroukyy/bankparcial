"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUser = saveUser;
exports.getUserByEmail = getUserByEmail;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1", // 👈 región obligatoria
});
const ddb = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
async function saveUser(user) {
    await ddb.send(new lib_dynamodb_1.PutCommand({
        TableName: process.env.USER_TABLE,
        Item: user,
    }));
}
async function getUserByEmail(email) {
    // ⚠️ Ojo: GetCommand solo funciona si "email" es la clave primaria.
    const resp = await ddb.send(new lib_dynamodb_1.GetCommand({
        TableName: process.env.USER_TABLE,
        Key: { email },
    }));
    return resp.Item;
}

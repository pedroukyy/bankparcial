"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateCreditCard = exports.saveCard = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamoClient_1 = require("../aws/dynamoClient");
const uuid_1 = require("uuid");
const saveCard = async (card) => {
    const cardId = (0, uuid_1.v4)();
    const createdAt = new Date().toISOString();
    const item = { ...card, cardId, createdAt };
    await dynamoClient_1.ddb.send(new lib_dynamodb_1.PutCommand({
        TableName: "card-table",
        Item: item
    }));
};
exports.saveCard = saveCard;
const activateCreditCard = async (userId) => {
    await dynamoClient_1.ddb.send(new lib_dynamodb_1.UpdateCommand({
        TableName: "card-table",
        Key: {
            userId,
            type: "CREDIT"
        },
        UpdateExpression: "SET #status = :s",
        ExpressionAttributeNames: {
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":s": "ACTIVATED"
        }
    }));
};
exports.activateCreditCard = activateCreditCard;

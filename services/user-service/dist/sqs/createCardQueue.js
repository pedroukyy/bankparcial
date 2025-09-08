"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCreateCardEvent = sendCreateCardEvent;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const client = new client_sqs_1.SQSClient({});
async function sendCreateCardEvent(userId) {
    const queueUrl = process.env.CREATE_CARD_QUEUE;
    if (!queueUrl)
        throw new Error("CREATE_CARD_QUEUE no definido");
    await client.send(new client_sqs_1.SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify({ userId, request: "DEBIT" })
    }));
    await client.send(new client_sqs_1.SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify({ userId, request: "CREDIT" })
    }));
}

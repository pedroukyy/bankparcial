"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const cardService_1 = require("../services/cardService");
const handler = async (event) => {
    const { userId, transactionCount } = JSON.parse(event.body || "{}");
    if (transactionCount >= 10) {
        await (0, cardService_1.activateCreditCard)(userId);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Card activated" })
        };
    }
    return {
        statusCode: 400,
        body: JSON.stringify({ message: "Not enough transactions" })
    };
};
exports.handler = handler;

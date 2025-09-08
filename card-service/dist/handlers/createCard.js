"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const cardService_1 = require("../services/cardService");
const handler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const result = await (0, cardService_1.saveCard)(body);
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    }
    catch (err) {
        const error = err;
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
exports.handler = handler;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const cardService_1 = require("../services/cardService");
const generateCreditScore_1 = require("../utils/generateCreditScore");
const handler = async (event) => {
    for (const record of event.Records) {
        const { userId } = JSON.parse(record.body);
        const debitCard = {
            userId,
            type: "DEBIT",
            status: "ACTIVATED",
            balance: 0,
        };
        const creditCard = {
            userId,
            type: "CREDIT",
            status: "PENDING",
            balance: (0, generateCreditScore_1.generateCreditScore)(userId) * 100,
        };
        await Promise.all([
            (0, cardService_1.saveCard)(debitCard),
            (0, cardService_1.saveCard)(creditCard)
        ]);
    }
};
exports.handler = handler;

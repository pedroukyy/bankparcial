"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCreditScore = void 0;
const generateCreditScore = (userId) => {
    return Math.floor(Math.random() * 10) + 1; // Score entre 1 y 10
};
exports.generateCreditScore = generateCreditScore;

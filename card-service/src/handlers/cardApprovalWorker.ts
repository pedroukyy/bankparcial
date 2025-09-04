import { SQSEvent } from "aws-lambda";
import { saveCard } from "../services/cardService";
import { generateCreditScore } from "../utils/generateCreditScore";
import { Card } from "../contracts/Card";

export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const { userId } = JSON.parse(record.body);

    const debitCard: Omit<Card, "cardId" | "createdAt"> = {
  userId,
  type: "DEBIT",
  status: "ACTIVATED",
  balance: 0,
};

    const creditCard: Omit<Card, "cardId" | "createdAt"> = {
  userId,
  type: "CREDIT",
  status: "PENDING",
  balance: generateCreditScore(userId) * 100,
};

    await Promise.all([
      saveCard(debitCard),
      saveCard(creditCard)
    ]);
  }
};

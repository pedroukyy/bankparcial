import { APIGatewayProxyHandler } from "aws-lambda";
import { activateCreditCard } from "../services/cardService";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userId, transactionCount } = JSON.parse(event.body || "{}");

  if (transactionCount >= 10) {
    await activateCreditCard(userId);
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

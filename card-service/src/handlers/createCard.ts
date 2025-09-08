import { APIGatewayProxyHandler } from "aws-lambda";
import { saveCard } from "../services/cardService";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const result = await saveCard(body);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err: unknown) {
  const error = err as Error;
  return {
    statusCode: 500,
    body: JSON.stringify({ error: error.message }),
  };
}

};

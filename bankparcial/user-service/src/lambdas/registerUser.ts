import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { saveUser } from "../services/userService";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || "{}");

    const { name, lastName, email, password, document } = body;

    if (!name || !lastName || !email || !password || !document) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    const uuid = await saveUser({ name, lastName, email, password, document });

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User registered", uuid }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal error", error }),
    };
  }
};


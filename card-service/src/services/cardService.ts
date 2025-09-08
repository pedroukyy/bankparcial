import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../aws/dynamoClient";
import { v4 as uuidv4 } from "uuid";
import { Card } from "../contracts/Card";

export const saveCard = async (card: Omit<Card, "cardId" | "createdAt">) => {
  const cardId = uuidv4();
  const createdAt = new Date().toISOString();

  const item: Card = { ...card, cardId, createdAt };
  await ddb.send(new PutCommand({
    TableName: "card-table",
    Item: item
  }));
};

export const activateCreditCard = async (userId: string) => {
  await ddb.send(new UpdateCommand({
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

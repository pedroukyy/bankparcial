import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  const { merchant, cardId, amount } = JSON.parse(event.body);

  const card = await docClient.send(new GetCommand({
    TableName: "card-table",
    Key: { uuid: cardId }
  }));

  if (!card.Item) {
    return { statusCode: 404, body: JSON.stringify({ error: "Card not found" }) };
  }

  const cardData = card.Item;

  if (cardData.type === "DEBIT") {
    if (cardData.balance < amount) {
      return { statusCode: 400, body: JSON.stringify({ error: "Insufficient balance" }) };
    }
    await docClient.send(new UpdateCommand({
      TableName: "card-table",
      Key: { uuid: cardId },
      UpdateExpression: "set balance = balance - :amount",
      ExpressionAttributeValues: { ":amount": amount }
    }));
  } else if (cardData.type === "CREDIT") {
    if ((cardData.used || 0) + amount > cardData.balance) {
      return { statusCode: 400, body: JSON.stringify({ error: "Credit limit exceeded" }) };
    }
    await docClient.send(new UpdateCommand({
      TableName: "card-table",
      Key: { uuid: cardId },
      UpdateExpression: "set used = if_not_exists(used, :zero) + :amount",
      ExpressionAttributeValues: { ":amount": amount, ":zero": 0 }
    }));
  }

  const transaction = {
    uuid: uuidv4(),
    cardId,
    merchant,
    amount,
    type: "PURCHASE",
    createdAt: new Date().toISOString()
  };

  await docClient.send(new PutCommand({
    TableName: "transactions-table",
    Item: transaction
  }));

  return { statusCode: 200, body: JSON.stringify(transaction) };
};

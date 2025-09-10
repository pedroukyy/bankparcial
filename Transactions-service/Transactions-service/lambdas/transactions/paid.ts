import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  const cardId = event.pathParameters.card_id;
  const { amount } = JSON.parse(event.body);

  const card = await docClient.send(new GetCommand({
    TableName: "card-table",
    Key: { uuid: cardId }
  }));

  if (!card.Item || card.Item.type !== "CREDIT") {
    return { statusCode: 400, body: JSON.stringify({ error: "Only credit cards can be paid" }) };
  }

  await docClient.send(new UpdateCommand({
    TableName: "card-table",
    Key: { uuid: cardId },
    UpdateExpression: "set used = if_not_exists(used, :zero) - :amount",
    ExpressionAttributeValues: { ":amount": amount, ":zero": 0 }
  }));

  const transaction = {
    uuid: uuidv4(),
    cardId,
    merchant: "PSE",
    amount,
    type: "PAYMENT_BALANCE",
    createdAt: new Date().toISOString()
  };

  await docClient.send(new PutCommand({
    TableName: "transactions-table",
    Item: transaction
  }));

  return { statusCode: 200, body: JSON.stringify(transaction) };
};

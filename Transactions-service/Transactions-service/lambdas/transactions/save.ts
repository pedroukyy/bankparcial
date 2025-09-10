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

  if (!card.Item || card.Item.type !== "DEBIT") {
    return { statusCode: 400, body: JSON.stringify({ error: "Only debit cards can be recharged" }) };
  }

  await docClient.send(new UpdateCommand({
    TableName: "card-table",
    Key: { uuid: cardId },
    UpdateExpression: "set balance = balance + :amount",
    ExpressionAttributeValues: { ":amount": amount }
  }));

  const transaction = {
    uuid: uuidv4(),
    cardId,
    merchant: "SAVING",
    amount,
    type: "SAVING",
    createdAt: new Date().toISOString()
  };

  await docClient.send(new PutCommand({
    TableName: "transactions-table",
    Item: transaction
  }));

  return { statusCode: 200, body: JSON.stringify(transaction) };
};

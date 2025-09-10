import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);
const s3Client = new S3Client({});

export const handler = async (event: any) => {
  const cardId = event.pathParameters.card_id;
  const { start, end } = JSON.parse(event.body);

  const result = await docClient.send(new QueryCommand({
    TableName: "transactions-table",
    KeyConditionExpression: "cardId = :cardId AND createdAt BETWEEN :start AND :end",
    ExpressionAttributeValues: {
      ":cardId": cardId,
      ":start": start,
      ":end": end
    }
  }));

  const transactions = result.Items || [];

  let csv = "uuid,merchant,amount,type,createdAt\n";
  transactions.forEach(tx => {
    csv += `${tx.uuid},${tx.merchant},${tx.amount},${tx.type},${tx.createdAt}\n`;
  });

  const fileKey = `reports/${cardId}-${uuidv4()}.csv`;
  await s3Client.send(new PutObjectCommand({
    Bucket: "transactions-service-report-bucket",
    Key: fileKey,
    Body: csv,
    ContentType: "text/csv"
  }));

  const url = await getSignedUrl(s3Client, new PutObjectCommand({
    Bucket: "transactions-service-report-bucket",
    Key: fileKey
  }), { expiresIn: 3600 });

  return { statusCode: 200, body: JSON.stringify({ url }) };
};

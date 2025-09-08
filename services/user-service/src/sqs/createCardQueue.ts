import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const client = new SQSClient({});

export async function sendCreateCardEvent(userId: string) {
  const queueUrl = process.env.CREATE_CARD_QUEUE!;
  if (!queueUrl) throw new Error("CREATE_CARD_QUEUE no definido");

  await client.send(new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({ userId, request: "DEBIT" })
  }));

  await client.send(new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({ userId, request: "CREDIT" })
  }));
}

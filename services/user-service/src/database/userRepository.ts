import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1", 
});

const ddb = DynamoDBDocumentClient.from(client);

export interface User {
  uuid: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  document: string;
  address?: string;
  phone?: string;
  image?: string;
}

export async function saveUser(user: User) {
  await ddb.send(new PutCommand({
    TableName: process.env.USER_TABLE!,
    Item: user,
  }));
}

export async function getUserByEmail(email: string) {
 
  const resp = await ddb.send(new GetCommand({
    TableName: process.env.USER_TABLE!,
    Key: { email },
  }));

  return resp.Item as User | undefined;
}

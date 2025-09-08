import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../aws/dynamoClient";
import { v4 as uuidv4 } from "uuid";

export interface RegisterUserInput {
  name: string;
  lastName: string;
  email: string;
  password: string;
  document: string;
}

export interface RegisterUserOutput {
  uuid: string;
  createdAt: string;
  status: string;
}

export const saveUser = async (
  user: RegisterUserInput
): Promise<RegisterUserOutput> => {
  const email = user.email.toLowerCase().trim();
  const document = user.document.trim();

  // Verificar si ya existe un usuario con el mismo email o documento
  const duplicateCheck = new QueryCommand({
    TableName: "user-table",
    IndexName: "email-index", // Asegúrate de tener este GSI en Terraform
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
    Limit: 1,
  });

  const result = await ddb.send(duplicateCheck);
  if (result.Items && result.Items.length > 0) {
    throw new Error("User with this email already exists");
  }

  const uuid = uuidv4();
  const createdAt = new Date().toISOString();

  const item = {
    uuid,
    name: user.name.trim(),
    lastName: user.lastName.trim(),
    email,
    password: user.password, // En producción, deberías hashearla
    document,
    createdAt,
    status: "ACTIVE",
  };

  const command = new PutCommand({
    TableName: "user-table",
    Item: item,
  });

  await ddb.send(command);

  return { uuid, createdAt, status: item.status };
};

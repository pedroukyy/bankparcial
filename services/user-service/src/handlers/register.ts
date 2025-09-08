import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../hash/password";
import { saveUser } from "../database/userRepository";
import { sendCreateCardEvent } from "../sqs/createCardQueue";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body ?? "{}");
    const hashedPassword = await hashPassword(body.password);

    const user = {
      uuid: uuidv4(),
      name: body.name,
      lastName: body.lastName,
      email: body.email,
      password: hashedPassword,
      document: body.document
    };

    await saveUser(user);
    await sendCreateCardEvent(user.uuid);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Usuario registrado", uuid: user.uuid })
    };
  } catch (err: any) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

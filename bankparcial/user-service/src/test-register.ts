import { handler } from "./lambdas/registerUser";

const mockEvent = {
  body: JSON.stringify({
    name: "Jane",
    lastName: "Doe",
    email: "jane@doe.com",
    password: "1234567890",
    document: "1234567890",
  }),
} as any;

handler(mockEvent).then((response) => {
  console.log("Lambda response:", response);
});

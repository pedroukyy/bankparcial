import "dotenv/config";
import { handler as registerHandler } from "./handlers/register";

// Simular un evento HTTP de API Gateway
const mockEvent = {
  body: JSON.stringify({
    name: "Luis",
    lastName: "Zabaleta",
    email: "luis@example.com",
    password: "123456",
    document: "123456789"
  })
};

(async () => {
  try {
    const response = await registerHandler(mockEvent);
    console.log(" Respuesta Lambda:", response);
  } catch (err) {
    console.error(" Error ejecutando handler:", err);
  }
})();

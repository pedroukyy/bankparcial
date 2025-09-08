export interface CreateCardInput {
  userId: string;
  cardType: "VISA" | "MASTERCARD";
  currency: "USD" | "COP";
}

export interface Card {
  cardId: string;
  userId: string;
  type: "DEBIT" | "CREDIT";
  status: "PENDING" | "ACTIVATED";
  balance: number;
  createdAt: string;
}

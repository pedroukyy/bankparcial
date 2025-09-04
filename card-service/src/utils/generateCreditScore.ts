export const generateCreditScore = (userId: string): number => {
  return Math.floor(Math.random() * 10) + 1; // Score entre 1 y 10
};

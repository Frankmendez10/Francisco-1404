import type { PaymentFormData, SnailPayResponse,} from "../types/payment";

const API_URL = "http://localhost:3000/api/snailpay";

export async function createSnailPayTransaction(
  payment: PaymentFormData,
  userId: string,
  payerEmail: string,
): Promise<SnailPayResponse> {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payment,
      userId,
      payerEmail,
    }),
  });

  if (!response.ok) {
    throw new Error("No fue posible comunicarse con SnailPay.");
  }

  return response.json() as Promise<SnailPayResponse>;
}
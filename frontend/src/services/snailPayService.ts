import type { PaymentFormData, SnailPayResponse, } from "../types/payment";

const API_URL = "http://localhost:3000/api/snailpay";
const REQUEST_TIMEOUT_MS = 10_000;

export async function createSnailPayTransaction( payment: PaymentFormData, userId: string, payerEmail: string,): Promise<SnailPayResponse> {
  const controller = new AbortController();

  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
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
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("No fue posible comunicarse con SnailPay.");
    }

    return (await response.json()) as SnailPayResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "La solicitud a SnailPay excedió el tiempo de espera. Intenta nuevamente.",
      );
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
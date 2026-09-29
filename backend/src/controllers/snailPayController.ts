import type { Request, Response } from "express";
import { processSnailPayTransaction } from "../services/snailPayService.js";
import type { SnailPayRequest } from "../types/snailpay.js";

const TIMEOUT_CARD_NUMBER = "8888888888888888";
const TIMEOUT_DELAY_MS = 11_000;

function isValidSnailPayRequest(body: unknown): body is SnailPayRequest {
  if (!body || typeof body !== "object") {
    return false;
  }

  const request = body as Record<string, unknown>;

  return (
    typeof request.cardNumber === "string" &&
    typeof request.expiry === "string" &&
    typeof request.cvv === "string" &&
    typeof request.fullName === "string" &&
    typeof request.amount === "number" &&
    Number.isFinite(request.amount) &&
    typeof request.userId === "string" &&
    typeof request.payerEmail === "string"
  );
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function createSnailPayTransaction(
  req: Request,
  res: Response,
): Promise<void> {
  if (!isValidSnailPayRequest(req.body)) {
    res.status(400).json({
      status: "rejected",
      status_detail:
        "La solicitud de pago contiene datos inválidos.",
    });

    return;
  }

  if (req.body.cardNumber === TIMEOUT_CARD_NUMBER) {
    await wait(TIMEOUT_DELAY_MS);
    return;
  }

  const response = processSnailPayTransaction(req.body);

  res.status(200).json(response);
}
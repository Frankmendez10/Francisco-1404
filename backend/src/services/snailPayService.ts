import crypto from "node:crypto";
import type { SnailPayRequest, SnailPayResponse,} from "../types/snailpay.js";

const APPROVED_CARD_NUMBER = "1234123412341234";
const APPROVED_EXPIRY = "12/26";
const APPROVED_CVV = "543";
const FORCE_SYSTEM_ERROR = process.env.SNAILPAY_FORCE_ERROR === "true";

function createBaseResponse( request: SnailPayRequest,): SnailPayResponse {
  return {
    id: `txn_${crypto.randomUUID()}`,
    status: "rejected",
    status_detail: "",
    transaction_amount: request.amount,
    date_created: new Date().toISOString(),
    authorization_code: null,
    reference: `REF-${Date.now()}`,
    payer_id: request.userId,
    payer_email: request.payerEmail,
    card_number: request.cardNumber,
    cvv: request.cvv,
  };
}

export function processSnailPayTransaction( request: SnailPayRequest,): SnailPayResponse {
  const response = createBaseResponse(request);

  if (FORCE_SYSTEM_ERROR) {
    response.status = "error";
    response.status_detail =
      "Error interno del sistema de pagos. Intenta nuevamente.";
    return response;
  }
  
  if (request.cardNumber === "9999999999999999") {
    response.status = "error";
    response.status_detail =
      "Error interno del sistema de pagos. Intenta nuevamente.";
    return response;
  }

  if (!request.fullName.trim()) {
    response.status_detail =
      "El nombre del titular es obligatorio.";
    return response;
  }

  if (request.amount <= 0) {
    response.status_detail =
      "El monto de la transacción debe ser mayor a cero.";
    return response;
  }

  if (request.cardNumber !== APPROVED_CARD_NUMBER) {
    response.status_detail =
      "La tarjeta fue rechazada. Número de tarjeta no válido.";
    return response;
  }

  if (request.expiry !== APPROVED_EXPIRY) {
    response.status_detail =
      "La tarjeta fue rechazada. Fecha de vencimiento no válida.";
    return response;
  }

  if (request.cvv !== APPROVED_CVV) {
    response.status_detail =
      "La tarjeta fue rechazada. CVV no válido.";
    return response;
  }

  response.status = "approved";
  response.status_detail = "Pago aprobado correctamente.";
  response.authorization_code = `AUTH-${Math.floor(
    100000 + Math.random() * 900000,
  )}`;

  return response;
}
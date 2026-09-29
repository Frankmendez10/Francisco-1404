import { describe, expect, it } from "vitest";
import { processSnailPayTransaction } from "../src/services/snailPayService.js";
import type { SnailPayRequest } from "../src/types/snailpay.js";

const validRequest: SnailPayRequest = {
  cardNumber: "1234123412341234",
  expiry: "12/26",
  cvv: "543",
  fullName: "Francisco Mendez",
  amount: 500,
  userId: "user-test-001",
  payerEmail: "francisco@test.com",
};

describe("processSnailPayTransaction", () => {
  it("approves a valid payment", () => {
    const response = processSnailPayTransaction(validRequest);

    expect(response.status).toBe("approved");
    expect(response.status_detail).toBe("Pago aprobado correctamente.");
    expect(response.transaction_amount).toBe(500);
    expect(response.authorization_code).toMatch(/^AUTH-\d{6}$/);
    expect(response.payer_id).toBe(validRequest.userId);
    expect(response.payer_email).toBe(validRequest.payerEmail);
    expect(response.card_number).toBe(validRequest.cardNumber);
    expect(response.cvv).toBe(validRequest.cvv);
    expect(response.id).toMatch(/^txn_/);
    expect(response.reference).toMatch(/^REF-/);
    expect(response.date_created).toBeTruthy();
  });

  it("rejects an invalid card number", () => {
    const response = processSnailPayTransaction({
      ...validRequest,
      cardNumber: "1111222233334444",
    });

    expect(response.status).toBe("rejected");
    expect(response.status_detail).toContain(
      "Número de tarjeta no válido",
    );
    expect(response.authorization_code).toBeNull();
  });

  it("rejects an invalid expiry date", () => {
    const response = processSnailPayTransaction({
      ...validRequest,
      expiry: "01/27",
    });

    expect(response.status).toBe("rejected");
    expect(response.status_detail).toContain(
      "Fecha de vencimiento no válida",
    );
    expect(response.authorization_code).toBeNull();
  });

  it("rejects an invalid CVV", () => {
    const response = processSnailPayTransaction({
      ...validRequest,
      cvv: "999",
    });

    expect(response.status).toBe("rejected");
    expect(response.status_detail).toContain("CVV no válido");
    expect(response.authorization_code).toBeNull();
  });

  it("rejects an empty cardholder name", () => {
    const response = processSnailPayTransaction({
      ...validRequest,
      fullName: "   ",
    });

    expect(response.status).toBe("rejected");
    expect(response.status_detail).toBe(
      "El nombre del titular es obligatorio.",
    );
    expect(response.authorization_code).toBeNull();
  });

  it("rejects a non-positive transaction amount", () => {
    const response = processSnailPayTransaction({
      ...validRequest,
      amount: 0,
    });

    expect(response.status).toBe("rejected");
    expect(response.status_detail).toBe(
      "El monto de la transacción debe ser mayor a cero.",
    );
    expect(response.authorization_code).toBeNull();
  });

  it("simulates an internal system error", () => {
    const response = processSnailPayTransaction({
      ...validRequest,
      cardNumber: "9999999999999999",
    });

    expect(response.status).toBe("error");
    expect(response.status_detail).toContain(
      "Error interno del sistema de pagos",
    );
    expect(response.authorization_code).toBeNull();
  });

  it("includes all required response fields for an approved payment", () => {
    const response = processSnailPayTransaction(validRequest);

    expect(response).toMatchObject({
      id: expect.any(String),
      status: "approved",
      status_detail: expect.any(String),
      transaction_amount: validRequest.amount,
      date_created: expect.any(String),
      authorization_code: expect.any(String),
      reference: expect.any(String),
      payer_id: validRequest.userId,
      payer_email: validRequest.payerEmail,
      card_number: validRequest.cardNumber,
      cvv: validRequest.cvv,
    });
  });

  it("includes all required response fields for a rejected payment", () => {
    const rejectedRequest: SnailPayRequest = {
      ...validRequest,
      cardNumber: "1111222233334444",
    };

    const response = processSnailPayTransaction(rejectedRequest);

    expect(response).toMatchObject({
      id: expect.any(String),
      status: "rejected",
      status_detail: expect.any(String),
      transaction_amount: rejectedRequest.amount,
      date_created: expect.any(String),
      authorization_code: null,
      reference: expect.any(String),
      payer_id: rejectedRequest.userId,
      payer_email: rejectedRequest.payerEmail,
      card_number: rejectedRequest.cardNumber,
      cvv: rejectedRequest.cvv,
    });
  });
});
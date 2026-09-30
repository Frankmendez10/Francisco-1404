import { afterEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { createSnailPayTransaction } from "../src/controllers/snailPayController.js";

function createResponseMock() {
  const response = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(body: unknown) {
      response.body = body;
      return response;
    },
  };

  return response;
}

describe("SnailPay controller", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns a complete 400 response for invalid requests", async () => {
    const response = createResponseMock();

    const request = {
      body: {
        cardNumber: "1234",
      },
    } as Request;

    await createSnailPayTransaction(
      request,
      response as unknown as Response,
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      status: "rejected",
      status_detail: expect.any(String),
      transaction_amount: 0,
      date_created: expect.any(String),
      authorization_code: null,
      reference: expect.any(String),
      payer_id: "",
      payer_email: "",
      card_number: "1234",
      cvv: "",
    });
    expect(response.body).toHaveProperty("id");
  });

  it("returns HTTP 504 when the timeout scenario is triggered", async () => {
    vi.useFakeTimers();

    const response = createResponseMock();

    const request = {
      body: {
        cardNumber: "8888888888888888",
        expiry: "12/26",
        cvv: "543",
        fullName: "Francisco Méndez",
        amount: 100,
        userId: "test-user",
        payerEmail: "test@example.com",
      },
    } as Request;

    const promise = createSnailPayTransaction(
      request,
      response as unknown as Response,
    );

    await vi.advanceTimersByTimeAsync(11_000);
    await promise;

    expect(response.statusCode).toBe(504);
    expect(response.body).toMatchObject({
      status: "error",
      status_detail:
        "La solicitud a SnailPay excedió el tiempo de espera.",
      transaction_amount: 100,
      authorization_code: null,
      payer_id: "test-user",
      payer_email: "test@example.com",
      card_number: "8888888888888888",
      cvv: "543",
    });
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("reference");
    expect(response.body).toHaveProperty("date_created");
  });
});
import type { Request, Response } from "express";
import { processSnailPayTransaction } from "../services/snailPayService.js";
import type { SnailPayRequest } from "../types/snailpay.js";

export function createSnailPayTransaction( req: Request, res: Response,): void {
  const request = req.body as SnailPayRequest;

  const response = processSnailPayTransaction(request);

  res.status(200).json(response);
}
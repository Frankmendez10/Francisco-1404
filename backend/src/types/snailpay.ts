export type SnailPayStatus = "approved" | "rejected" | "error";

export interface SnailPayRequest {
  cardNumber: string;
  expiry: string;
  cvv: string;
  fullName: string;
  amount: number;
  userId: string;
  payerEmail: string;
}

export interface SnailPayResponse {
  id: string;
  status: SnailPayStatus;
  status_detail: string;
  transaction_amount: number;
  date_created: string;
  authorization_code: string | null;
  reference: string;
  payer_id: string;
  payer_email: string;
  card_number: string;
  cvv: string;
}
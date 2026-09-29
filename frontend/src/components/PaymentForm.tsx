import { useState } from "react";
import type { PaymentFormData } from "../types/payment";
import { createSnailPayTransaction } from "../services/snailPayService";

interface PaymentFormProps {
  userId: string;
  payerEmail: string;
  onPaymentSuccess: (
    amount: number,
    payment: {
      cardNumber: string;
      cvv: string;
    },
  ) => void;
}

function PaymentForm({ userId, payerEmail, onPaymentSuccess,}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    fullName: "",
    amount: 0,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: { currentTarget: HTMLInputElement; }) {
    const { name, value } = event.currentTarget;

    setFormData((current) => ({
      ...current,
      [name]: name === "amount" ? Number(value) : value,
    }));

    setMessage("");
    setError("");
  }

  async function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!formData.cardNumber.trim()) {
      setError("El número de tarjeta es obligatorio.");
      return;
    }

    if (!formData.expiry.trim()) {
      setError("La fecha de vencimiento es obligatoria.");
      return;
    }

    if (!formData.cvv.trim()) {
      setError("El CVV es obligatorio.");
      return;
    }

    if (!formData.fullName.trim()) {
      setError("El nombre del titular es obligatorio.");
      return;
    }

    if (formData.amount <= 0) {
      setError("El monto debe ser mayor a cero.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createSnailPayTransaction(
        formData,
        userId,
        payerEmail,
      );

      if (response.status === "approved") {
        setMessage(
          `${response.status_detail} Referencia: ${response.reference}`,
        );

        onPaymentSuccess(response.transaction_amount, {
            cardNumber: response.card_number,
            cvv: response.cvv,
            });

        setFormData({
          cardNumber: "",
          expiry: "",
          cvv: "",
          fullName: "",
          amount: 0,
        });
      } else {
        setError(response.status_detail);
      }
    } catch (paymentError) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "No fue posible procesar el pago.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Cargar saldo</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="cardNumber">Número de tarjeta</label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            value={formData.cardNumber}
            onChange={handleChange}
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234123412341234"
          />
        </div>

        <div>
          <label htmlFor="expiry">Vencimiento</label>
          <input
            id="expiry"
            name="expiry"
            type="text"
            value={formData.expiry}
            onChange={handleChange}
            placeholder="12/26"
            maxLength={5}
          />
        </div>

        <div>
          <label htmlFor="cvv">CVV</label>
          <input
            id="cvv"
            name="cvv"
            type="text"
            value={formData.cvv}
            onChange={handleChange}
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="543"
            maxLength={3}
          />
        </div>

        <div>
          <label htmlFor="payment-fullName">
            Nombre del titular
          </label>
          <input
            id="payment-fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            autoComplete="cc-name"
          />
        </div>

        <div>
          <label htmlFor="amount">Monto</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="1"
            step="0.01"
            value={formData.amount || ""}
            onChange={handleChange}
          />
        </div>

        {error && <p role="alert">{error}</p>}

        {message && <p role="status">{message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Procesando..." : "Cargar saldo"}
        </button>
      </form>
    </section>
  );
}

export default PaymentForm;
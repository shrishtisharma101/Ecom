import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import { useShop } from "../../context/useShop";
import { formatINR } from "../../utils/currency";

const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

const DemoPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useShop();
  const [paymentState, setPaymentState] = useState("ready");
  const [errorMessage, setErrorMessage] = useState("");
  const timers = useRef([]);
  const orderId = searchParams.get("orderId") || "";
  const paymentToken = searchParams.get("token") || "";
  const orderNumber = searchParams.get("orderNumber") || "Store order";
  const requestedMethod = searchParams.get("method");
  const paymentMethod = ["UPI", "Netbanking", "Card"].includes(requestedMethod)
    ? requestedMethod
    : "UPI";
  const amount = Number(searchParams.get("amount") || 0);

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const simulatePayment = () => {
    if (!orderId || !paymentToken || paymentState !== "ready") return;
    setPaymentState("paying");
    setErrorMessage("");

    const confirmationTimer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `${API_URL}/${encodeURIComponent(orderId)}/simulate-payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentToken }),
          }
        );
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Demo payment could not be confirmed.");
        }

        clearCart();
        setPaymentState("confirmed");
        timers.current.push(window.setTimeout(() => navigate("/", { replace: true }), 900));
      } catch (error) {
        console.error("Demo payment confirmation failed:", error);
        setErrorMessage(error.message || "Demo payment could not be confirmed.");
        setPaymentState("error");
      }
    }, 2000);

    timers.current.push(confirmationTimer);
  };

  if (!orderId || !paymentToken || !Number.isFinite(amount) || amount < 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f6ede0] px-4 py-10">
        <section className="w-full max-w-md border border-[#e3d3c2] bg-white p-6 text-center shadow-xl">
          <h1 className="text-xl font-semibold text-[#4d3d2f]">Invalid payment link</h1>
          <p className="mt-3 text-sm text-[#8c7661]">Return to checkout and create a new demo payment link.</p>
          <Link to="/checkout" className="mt-5 inline-flex min-h-11 items-center bg-[#c8a279] px-5 font-semibold text-white hover:bg-[#b07a4b]">Return to checkout</Link>
        </section>
      </main>
    );
  }

  if (paymentState === "confirmed") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-emerald-700 p-4 text-center text-white sm:p-8">
        <section className="w-full max-w-xl py-10">
          <FaCheckCircle className="mx-auto text-6xl text-white sm:text-7xl" />
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-emerald-100">Demo order confirmed</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">Your order is confirmed.</h1>
          <p className="mt-4 text-base text-emerald-50">{orderNumber} · {formatINR(amount)}</p>
          <p className="mt-5 border border-white/30 bg-white/10 p-4 text-sm leading-6 text-white">
            This was a simulated payment. No real money was transferred. Returning to the store…
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6ede0] px-4 py-10 sm:px-6">
      <section className="w-full max-w-md border border-[#e3d3c2] bg-white p-5 shadow-xl sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center bg-[#f6ede0] text-[#9a7049]"><FaLock /></span>
          <div>
            <p className="text-xs font-semibold uppercase text-[#8c7661]">Demo {paymentMethod} checkout</p>
            <h1 className="text-xl font-semibold text-[#4d3d2f]">Complete demo payment</h1>
          </div>
        </div>
        <dl className="mt-6 space-y-3 border-y border-[#eee4da] py-4 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-[#8c7661]">Order</dt><dd className="font-medium text-[#4d3d2f]">{orderNumber}</dd></div>
          {paymentMethod === "UPI" && <div className="flex justify-between gap-4"><dt className="text-[#8c7661]">Demo UPI ID</dt><dd className="font-medium text-[#4d3d2f]">demo@upi</dd></div>}
          <div className="flex justify-between gap-4"><dt className="text-[#8c7661]">Amount</dt><dd className="font-semibold text-[#4d3d2f]">{formatINR(amount)}</dd></div>
        </dl>
        <p className="mt-5 border-l-4 border-amber-500 bg-amber-50 p-3 text-sm leading-5 text-amber-900">
          Demo only. No payment request is sent and no money is transferred.
        </p>
        {errorMessage && <p role="alert" className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>}
        {paymentState === "paying" ? (
          <div role="status" className="mt-5 flex items-center gap-3 border border-emerald-300 bg-emerald-50 p-4 text-emerald-800">
            <FaCheckCircle className="shrink-0 text-2xl" />
            <div>
              <p className="font-semibold">Demo payment successful</p>
              <p className="text-sm">Confirming your order…</p>
            </div>
          </div>
        ) : (
          <button type="button" onClick={simulatePayment} className="mt-6 min-h-12 w-full bg-emerald-600 px-5 font-semibold text-white transition hover:bg-emerald-700">
            {paymentState === "error" ? "Retry demo payment" : "Pay to continue"}
          </button>
        )}
        <Link to="/checkout" className="mt-5 block text-center text-sm font-medium text-[#9a7049] hover:underline">Return to checkout</Link>
      </section>
    </main>
  );
};

export default DemoPaymentPage;

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaCreditCard, FaUniversity, FaQrcode } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../../context/AuthContext";
import { useShop } from "../../context/useShop";
import { formatINR } from "../../utils/currency";

const API_URL = `${import.meta.env.VITE_API_URL}`;
const paymentMethods = [
  { id: "UPI", label: "UPI", icon: FaQrcode },
  { id: "Netbanking", label: "Netbanking", icon: FaUniversity },
  { id: "Card", label: "Credit or debit card", icon: FaCreditCard },
];

const getPrice = (price) => Number(String(price || "0").replace(/[^\d.]/g, ""));

const Checkout = () => {
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [confirmationStage, setConfirmationStage] = useState("idle");
  const timers = useRef([]);
  const { user } = useAuth();
  const { cartItems, clearCart } = useShop();
  const navigate = useNavigate();
  const total = cartItems.reduce(
    (sum, item) => sum + getPrice(item.price) * (item.quantity || 1),
    0
  );
  const placeOrder = async () => {
    if (paymentOrder) {
      setIsQrOpen(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          customer: {
            userId: user?.id || user?._id || null,
            name: user?.fullName || "",
            email: user?.email || "",
            phone: user?.phone || "",
          },
          paymentMethod: selectedMethod,
          items: cartItems.map((item) => ({
            productId: item.id,
            name: item.title,
            image: item.image,
            price: getPrice(item.price),
            quantity: item.quantity || 1,
          })),
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.order) {
        throw new Error(result.message || "Order could not be placed. Please try again.");
      }

      if (!result.demoPaymentToken) {
        throw new Error("The demo payment link could not be created. Please try again.");
      }
      setPaymentOrder({ ...result.order, demoPaymentToken: result.demoPaymentToken });
      setIsQrOpen(true);
    } catch (error) {
      console.error("Place order failed:", error);
      setErrorMessage(error.message || "Unable to place your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const paymentUrl = paymentOrder
    ? `${window.location.origin}/payment/continue?${new URLSearchParams({
        orderId: paymentOrder._id,
        token: paymentOrder.demoPaymentToken,
        orderNumber: paymentOrder.orderNumber,
        amount: paymentOrder.totalAmount,
        method: paymentOrder.paymentMethod,
      }).toString()}`
    : "";

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const confirmDemoPayment = async () => {
    if (!paymentOrder || confirmationStage !== "idle") return;
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/orders/${encodeURIComponent(paymentOrder._id)}/simulate-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentToken: paymentOrder.demoPaymentToken }),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Demo payment could not be confirmed.");
      }

      clearCart();
      setIsQrOpen(false);
      setConfirmationStage("payment-success");
      timers.current.push(window.setTimeout(() => {
        setConfirmationStage("order-confirmed");
        timers.current.push(window.setTimeout(() => navigate("/", { replace: true }), 1800));
      }, 1100));
    } catch (error) {
      console.error("Confirm demo payment failed:", error);
      setErrorMessage(error.message || "Demo payment could not be confirmed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto min-h-[65vh] w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-[#e3d3c2] pb-5">
        <h1 className="text-2xl font-semibold text-[#4d3d2f] sm:text-3xl">Checkout</h1>
        <p className="mt-1 text-sm text-[#8c7661]">Review your order and choose a payment method.</p>
      </header>

      {cartItems.length === 0 ? (
        <section className="flex min-h-64 flex-col items-center justify-center text-center">
          <p className="text-lg font-medium text-[#4d3d2f]">Your cart is empty</p>
          <Link to="/shop" className="mt-5 inline-flex min-h-11 items-center bg-[#c8a279] px-5 font-semibold text-white hover:bg-[#b07a4b]">Browse products</Link>
        </section>
      ) : (
        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section>
            <div className="border border-[#e3d3c2] bg-white p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-[#4d3d2f]">Customer details</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[#8c7661]">Name</dt>
                  <dd className="font-medium text-[#4d3d2f]">{user?.fullName || "Not available"}</dd>
                </div>
                <div>
                  <dt className="text-[#8c7661]">Email</dt>
                  <dd className="break-all font-medium text-[#4d3d2f]">{user?.email || "Not available"}</dd>
                </div>
                <div>
                  <dt className="text-[#8c7661]">Phone</dt>
                  <dd className="font-medium text-[#4d3d2f]">{user?.phone || "Not provided"}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-5 border border-[#e3d3c2] bg-white p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-[#4d3d2f]">Payment method</h2>
              <p className="mt-1 text-sm text-[#8c7661]">Select your preferred payment method for this order.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {paymentMethods.map(({ id, label, icon: Icon }) => (
                  <label
                    key={id}
                    className={`flex min-h-16 cursor-pointer items-center gap-3 border p-4 transition ${selectedMethod === id ? "border-[#a8794e] bg-[#fbf6ef] ring-1 ring-[#a8794e]" : "border-[#e3d3c2] bg-white hover:border-[#c8a279]"}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={id}
                      checked={selectedMethod === id}
                      onChange={() => setSelectedMethod(id)}
                      className="accent-[#a8794e]"
                    />
                    <Icon className="text-[#a8794e]" />
                    <span className="text-sm font-semibold text-[#4d3d2f]">{label}</span>
                  </label>
                ))}
              </div>
              <p role="status" className="mt-5 border-l-4 border-amber-500 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                Demo payment only: this QR code simulates payment success. No real money is transferred.
              </p>
              {errorMessage && (
                <p role="alert" className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {errorMessage}
                </p>
              )}
              <button
                type="button"
                onClick={placeOrder}
                disabled={isSubmitting || !user?.fullName || !user?.email}
                className="mt-5 min-h-12 w-full bg-[#c8a279] px-4 font-semibold text-white transition hover:bg-[#b07a4b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Preparing demo payment…" : paymentOrder ? "Show payment QR" : "Place order"}
              </button>
            </div>
          </section>

          <aside className="h-fit border border-[#e3d3c2] bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-[#4d3d2f]">Order summary</h2>
            <div className="mt-4 max-h-64 divide-y divide-[#eee4da] overflow-y-auto">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.title}`} className="flex gap-3 py-3">
                  <img src={item.image} alt="" className="h-12 w-12 shrink-0 object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-medium text-[#4d3d2f]">{item.title}</p>
                    <p className="mt-1 text-xs text-[#8c7661]">Qty {item.quantity || 1}</p>
                  </div>
                  <span className="shrink-0 text-sm text-[#4d3d2f]">{formatINR(getPrice(item.price) * (item.quantity || 1))}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-[#eee4da] pt-4 font-semibold text-[#4d3d2f]">
              <span>Total due</span><span>{formatINR(total)}</span>
            </div>
            <p className="mt-2 text-right text-xs text-[#8c7661]">Amount paid now: {formatINR(0)}</p>
            <Link to="/cart" className="mt-4 block text-center text-sm font-medium text-[#9a7049] hover:underline">Back to cart</Link>
          </aside>
        </div>
      )}

      {paymentOrder && isQrOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-qr-title"
            className="w-full max-w-md border border-[#e3d3c2] bg-white p-5 text-center shadow-2xl sm:p-7"
          >
            <h2 id="demo-qr-title" className="text-xl font-semibold text-[#4d3d2f]">Scan to pay (demo)</h2>
            <p className="mt-2 text-sm text-[#8c7661]">
              Order {paymentOrder.orderNumber} · {formatINR(paymentOrder.totalAmount)}
            </p>
            <div className="mx-auto mt-5 flex w-fit border-2 border-[#c8a279] bg-white p-3">
              <QRCodeSVG
                value={paymentUrl}
                size={220}
                level="M"
                includeMargin
                title="Demo payment QR code"
              />
            </div>
            <button
              type="button"
              onClick={confirmDemoPayment}
              disabled={isSubmitting}
              className="mt-5 min-h-12 w-full bg-emerald-600 px-5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? "Confirming demo payment…" : "Confirm demo payment"}
            </button>
            <p className="mt-4 text-xs leading-5 text-amber-800">
              This QR opens a simulated payment page. No real UPI transaction or charge will occur.
            </p>
            <a
              href={paymentUrl}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center bg-[#c8a279] px-5 font-semibold text-white hover:bg-[#b07a4b]"
            >
              Open demo payment page
            </a>
            <button
              type="button"
              onClick={() => setIsQrOpen(false)}
              className="mt-3 min-h-10 w-full text-sm font-medium text-[#8c7661] hover:text-[#4d3d2f]"
            >
              Close
            </button>
          </section>
        </div>
      )}

      {confirmationStage !== "idle" && (
        <div className={`fixed inset-0 z-[10010] flex items-center justify-center p-4 text-center ${confirmationStage === "order-confirmed" ? "bg-emerald-700 text-white" : "bg-black/60 text-[#4d3d2f] backdrop-blur-sm"}`}>
          <section className={confirmationStage === "order-confirmed" ? "w-full max-w-lg" : "w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"}>
            <FaCheckCircle className={`mx-auto text-6xl sm:text-7xl ${confirmationStage === "order-confirmed" ? "text-white" : "text-emerald-600"}`} />
            {confirmationStage === "payment-success" ? (
              <>
                <h2 className="mt-5 text-3xl font-bold text-emerald-800">Payment successful!</h2>
                <p className="mt-3 text-[#6b5a49]">Demo payment confirmed. Confirming your order…</p>
              </>
            ) : (
              <>
                <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-emerald-100">Order confirmed</p>
                <h2 className="mt-3 text-3xl font-bold text-white">Thank you for your order!</h2>
                <p className="mt-3 text-emerald-50">{paymentOrder?.orderNumber} · {formatINR(paymentOrder?.totalAmount)}</p>
                <p className="mt-5 border border-white/30 bg-white/10 p-4 text-sm leading-6 text-white">
                  This was a simulated payment. No real money was transferred. Returning to the home page…
                </p>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
};

export default Checkout;

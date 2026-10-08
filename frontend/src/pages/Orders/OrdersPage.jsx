import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatINR } from "../../utils/currency";

const API_URL = "http://localhost:8000/api/orders";
const formatDate = (date) => new Date(date).toLocaleString();

const OrdersPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const userId = user?.id || user?._id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userId) return undefined;

    const controller = new AbortController();
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}?userId=${encodeURIComponent(userId)}`, {
          signal: controller.signal,
        });
        const result = await response.json();
        const orderList = Array.isArray(result) ? result : result.orders;
        if (!response.ok || !Array.isArray(orderList)) {
          throw new Error(result.message || "Could not load your orders.");
        }
        setOrders(orderList);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch customer orders failed:", error);
          setErrorMessage(error.message || "Could not load your orders.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchOrders();
    return () => controller.abort();
  }, [userId]);

  const visibleError = errorMessage || (
    !userId ? "Your account details could not be loaded. Please sign in again." : ""
  );

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-[#e3d3c2] pb-5">
        <h1 className="text-2xl font-semibold text-[#4d3d2f] sm:text-3xl">My Orders</h1>
        <p className="mt-1 text-sm text-[#8c7661]">Order status and payment details.</p>
      </header>

      {location.state?.orderPlaced && (
        <p role="status" className="mt-5 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Order {location.state.orderPlaced} received. Payment is pending; no payment has been taken.
        </p>
      )}
      {visibleError && <p role="alert" className="mt-5 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{visibleError}</p>}
      {loading ? (
        <p className="py-10 text-sm text-[#8c7661]">Loading your orders…</p>
      ) : !visibleError && orders.length === 0 ? (
        <section className="flex min-h-64 flex-col items-center justify-center text-center">
          <p className="text-lg font-medium text-[#4d3d2f]">No orders yet</p>
          <Link to="/shop" className="mt-5 inline-flex min-h-11 items-center bg-[#c8a279] px-5 font-semibold text-white hover:bg-[#b07a4b]">Browse products</Link>
        </section>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <article key={order._id} className="border border-[#e3d3c2] bg-white p-4 sm:p-5">
              <div className="flex flex-wrap justify-between gap-3 border-b border-[#eee4da] pb-3">
                <div>
                  <h2 className="font-semibold text-[#4d3d2f]">{order.orderNumber}</h2>
                  <p className="mt-1 text-xs text-[#8c7661]">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold text-[#4d3d2f]">{formatINR(order.totalAmount)}</p>
                  <p className="text-xs text-[#8c7661]">
                    {order.status} · Payment {order.isDemoPayment ? "Demo paid (simulated)" : order.paymentStatus || "Pending"}
                  </p>
                </div>
              </div>
              <div className="divide-y divide-[#f2e9e0]">
                {order.items.map((item, index) => (
                  <div key={`${order._id}-${item.productId}-${index}`} className="flex justify-between gap-4 py-3 text-sm">
                    <span className="text-[#4d3d2f]">{item.name} <span className="text-[#8c7661]">× {item.quantity}</span></span>
                    <span className="shrink-0 text-[#4d3d2f]">{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-[#8c7661]">
                {order.paymentMethod || "UPI"} · {order.isDemoPayment ? "Demo amount" : "Paid"} {formatINR(order.amountPaid)}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default OrdersPage;

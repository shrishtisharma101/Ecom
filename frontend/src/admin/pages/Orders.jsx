import { useEffect, useState } from "react";
import { formatINR } from "../../utils/currency";
import { getAdminDateRange, useAdminDateFilter } from "../context/AdminDateFilterContext";
import TablePagination from "../components/TablePagination";
import { useTablePagination } from "../hooks/useTablePagination";
// import AdminPageHeader from "../components/AdminPageHeader";

const API_URL = "http://localhost:8000/api/orders";
const formatDate = (date) => new Date(date).toLocaleString();

const Orders = () => {
  const dateFilter = useAdminDateFilter();
  const { refreshVersion } = dateFilter;
  const { start: rangeStart, end: rangeEnd } = getAdminDateRange(dateFilter);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchOrders = async () => {
      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        const result = await response.json();
        const orderList = Array.isArray(result) ? result : result.orders;
        if (!response.ok || !Array.isArray(orderList)) {
          throw new Error(result.message || "Could not load orders.");
        }
        setOrders(orderList);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch admin orders failed:", error);
          setErrorMessage(error.message || "Could not load orders.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchOrders();
    return () => controller.abort();
  }, [refreshVersion]);

  const visibleOrders = orders.filter((order) => {
    if (!order.createdAt) return false;
    const createdAt = new Date(order.createdAt);
    return createdAt >= rangeStart && createdAt < rangeEnd;
  });
  const orderPagination = useTablePagination(
    visibleOrders,
    `${dateFilter.month}:${dateFilter.day}`
  );
  const reportPeriod = dateFilter.day
    ? new Date(`${dateFilter.day}T00:00:00`).toLocaleDateString("en-IN", { dateStyle: "medium" })
    : rangeStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <section className="p-3">
      {/* <AdminPageHeader
        title="Orders"
        description={`Customer, item, order time, and payment details for ${reportPeriod}.`}
        aside={<p className="text-xs font-semibold text-[#4d3d2f]">{visibleOrders.length} orders in range</p>}
      /> */}

      {errorMessage && <p role="alert" className="mb-4 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>}
      <div className="overflow-hidden rounded-2xl border border-[#e3d3c2] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="bg-[#f6ede0] text-xs uppercase tracking-wide text-[#6b5a49]">
            <tr>
              <th className="px-4 py-3">Order / Time</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Order status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3 text-right">Total / Paid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee4da]">
            {loading ? (
              <tr><td colSpan="6" className="px-4 py-10 text-center text-[#8c7661]">Loading orders…</td></tr>
            ) : !errorMessage && visibleOrders.length === 0 ? (
              <tr><td colSpan="6" className="px-4 py-10 text-center text-[#8c7661]">No orders were placed during {reportPeriod}.</td></tr>
            ) : (
              orderPagination.pageItems.map((order) => (
                <tr key={order._id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-[#4d3d2f]">{order.orderNumber || `#${order._id?.slice(-6)}`}</p>
                    <p className="mt-1 whitespace-nowrap text-xs text-[#8c7661]">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="max-w-56 px-4 py-4">
                    <p className="font-semibold text-[#4d3d2f]">{order.customer?.name || "Unknown customer"}</p>
                    <p className="mt-1 break-all text-xs text-[#8c7661]">{order.customer?.email || "No email"}</p>
                    <p className="mt-1 text-xs text-[#8c7661]">{order.customer?.phone || "No phone"}</p>
                  </td>
                  <td className="max-w-72 px-4 py-4">
                    <ul className="space-y-2">
                      {(order.items || []).map((item, index) => (
                        <li key={`${order._id}-${item.productId}-${index}`} className="flex items-start gap-2">
                          {item.image && <img src={item.image} alt="" className="h-9 w-9 shrink-0 object-contain" />}
                          <span>
                            <span className="block font-medium text-[#4d3d2f]">{item.name}</span>
                            <span className="text-xs text-[#8c7661]">
                              {item.quantity} × {formatINR(item.price)} = {formatINR(item.quantity * item.price)}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${order.status === "Cancelled" ? "bg-red-50 text-red-700" : order.status === "Delivered" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-800"}`}>
                      {order.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-[#4d3d2f]">{order.paymentMethod || "Not recorded"}</p>
                    <p className={`mt-1 text-xs ${order.paymentStatus === "Paid" ? "text-green-700" : "text-amber-800"}`}>
                      {order.isDemoPayment ? "Demo Paid (simulated)" : order.paymentStatus || "Pending"}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <p className="font-semibold text-[#4d3d2f]">{formatINR(order.totalAmount)}</p>
                    <p className="mt-1 text-xs text-[#8c7661]">
                      {order.isDemoPayment ? "Demo paid" : "Paid"} {formatINR(order.amountPaid)}
                    </p>
                    <p className="mt-1 text-xs text-[#8c7661]">Due {formatINR(Math.max(0, Number(order.totalAmount || 0) - Number(order.amountPaid || 0)))}</p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
        <TablePagination {...orderPagination} />
      </div>
      {/* <p className="mt-3 text-xs leading-5 text-[#8c7661]">
        Checkout currently records orders as payment pending. Paid amounts remain zero until a real payment provider is connected.
      </p> */}
    </section>
  );
};

export default Orders;

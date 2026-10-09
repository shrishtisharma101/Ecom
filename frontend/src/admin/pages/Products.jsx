import { useEffect, useMemo, useState } from "react";
import { formatINR } from "../../utils/currency";
import { getAdminDateRange, useAdminDateFilter } from "../context/AdminDateFilterContext";
import TablePagination from "../components/TablePagination";
import { useTablePagination } from "../hooks/useTablePagination";
// import AdminPageHeader from "../components/AdminPageHeader";

const API_URL = `${import.meta.env.VITE_API_URL}`;
const getLocalDateKey = (date) => {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
};
const formatDay = (dateKey) => new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-IN");

const Products = () => {
  const dateFilter = useAdminDateFilter();
  const { refreshVersion } = dateFilter;
  const { start: rangeStart, end: rangeEnd } = getAdminDateRange(dateFilter);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchProductSales = async () => {
      try {
        const response = await fetch(`${API_URL}/orders`, { signal: controller.signal });
        const result = await response.json();
        const orderList = Array.isArray(result) ? result : result.orders;
        if (!response.ok || !Array.isArray(orderList)) {
          throw new Error(result.message || "Could not load product sales.");
        }

        setOrders(orderList);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch dated product sales failed:", error);
          setErrorMessage(error.message || "Could not load product sales.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProductSales();
    return () => controller.abort();
  }, [refreshVersion]);

  const sales = useMemo(() => {
    const productSales = new Map();
    orders
      .filter((order) => {
        if (order.status === "Cancelled" || !order.createdAt) return false;
        const createdAt = new Date(order.createdAt);
        return createdAt >= rangeStart && createdAt < rangeEnd;
      })
      .forEach((order) => {
        (order.items || []).forEach((item) => {
          const day = getLocalDateKey(order.createdAt);
          const productKey = item.productId || item.name;
          const key = `${day}:${productKey}`;
          const sale = productSales.get(key) || {
            day,
            productId: item.productId,
            name: item.name || "Unnamed product",
            image: item.image || "",
            units: 0,
            orderCount: 0,
            orderIds: new Set(),
            orderValue: 0,
            latestOrderAt: order.createdAt,
          };
          sale.units += Number(item.quantity || 0);
          if (!sale.orderIds.has(order._id)) {
            sale.orderIds.add(order._id);
            sale.orderCount += 1;
          }
          sale.orderValue += Number(item.price || 0) * Number(item.quantity || 0);
          sale.latestOrderAt = new Date(order.createdAt) > new Date(sale.latestOrderAt)
            ? order.createdAt
            : sale.latestOrderAt;
          productSales.set(key, sale);
        });
      });

    return [...productSales.values()].sort(
      (left, right) => right.day.localeCompare(left.day) || right.units - left.units
    );
  }, [orders, rangeEnd, rangeStart]);
  const reportPeriod = dateFilter.day
    ? formatDay(dateFilter.day)
    : rangeStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const salesPagination = useTablePagination(
    sales,
    `${dateFilter.month}:${dateFilter.day}`
  );

  return (
    <section className="p-3">
      {/* <AdminPageHeader
        title="Product Details"
        description={`Product details, units, and order value for ${reportPeriod}.`}
      /> */}
      {errorMessage && <p role="alert" className="mb-4 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>}
      <div className="overflow-hidden rounded-2xl border border-[#e3d3c2] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="bg-[#f6ede0] text-xs uppercase tracking-wide text-[#6b5a49]">
            <tr>
              <th className="px-3 py-2.5">Product</th>
              <th className="px-3 py-2.5">Date</th>
              <th className="px-3 py-2.5 text-right">Units ordered</th>
              <th className="px-3 py-2.5 text-right">Orders</th>
              <th className="px-3 py-2.5 text-right">Order value</th>
              <th className="px-3 py-2.5">Latest order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee4da]">
            {loading ? (
              <tr><td colSpan="6" className="px-3 py-8 text-center text-[#8c7661]">Loading product sales…</td></tr>
            ) : !errorMessage && sales.length === 0 ? (
              <tr><td colSpan="6" className="px-3 py-8 text-center text-[#8c7661]">No product orders recorded for {reportPeriod}.</td></tr>
            ) : (
              salesPagination.pageItems.map((sale) => (
                <tr key={`${sale.day}-${sale.productId || sale.name}`}>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {sale.image ? <img src={sale.image} alt="" className="h-9 w-9 shrink-0 object-contain" /> : <span className="h-9 w-9 shrink-0 bg-[#f6ede0]" />}
                      <div>
                        <p className="font-semibold text-[#4d3d2f]">{sale.name}</p>
                        {sale.productId && <p className="mt-0.5 text-[10px] text-[#8c7661]">Product ID: {sale.productId}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-[#4d3d2f]">{formatDay(sale.day)}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-[#4d3d2f]">{sale.units}</td>
                  <td className="px-3 py-2.5 text-right text-[#4d3d2f]">{sale.orderCount}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-[#4d3d2f]">{formatINR(sale.orderValue)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-[10px] text-[#8c7661]">{new Date(sale.latestOrderAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
        <TablePagination {...salesPagination} />
      </div>
      {/* <p className="mt-3 text-xs leading-5 text-[#8c7661]">
        This report includes non-cancelled orders, including pending and simulated demo orders. Simulated order value is not real money collected.
      </p> */}
    </section>
  );
};

export default Products;

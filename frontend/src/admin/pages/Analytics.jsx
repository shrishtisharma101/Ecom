import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaCalendarAlt,
  FaRupeeSign,
  FaShoppingBag,
  FaUsers,
} from "react-icons/fa";
import { formatINR } from "../../utils/currency";
import { getAdminDateRange, useAdminDateFilter } from "../context/AdminDateFilterContext";
// import AdminPageHeader from "../components/AdminPageHeader";

const API_URL = "http://localhost:8000/api";
const formatDayKey = (date) => {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
};
const formatShortDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const isPaidOrder = (order) =>
  order.paymentStatus === "Paid" && !order.isDemoPayment && order.status !== "Cancelled";
const isDemoPaidOrder = (order) =>
  order.paymentStatus === "Demo Paid" && order.status !== "Cancelled";
const isCancelledOrder = (order) => order.status === "Cancelled";
const panelClass = "rounded-2xl border border-[#e8ddcf] bg-white p-4 shadow-sm sm:p-5";

const TrendChart = ({ data, mode }) => {
  const maximum = Math.max(...data.map((entry) => entry.value), 1);

  return (
    <div className="mt-6">
      {data.length === 0 ? (
        <p className="py-12 text-center text-sm text-[#8c7661]">No orders found for this period.</p>
      ) : (
        <>
          <div className="flex h-52 items-end gap-1.5 border-b border-l border-[#eee4da] px-2 pb-0 pt-3 sm:gap-2.5">
            {data.map((entry) => {
              const barHeight = entry.value ? Math.max((entry.value / maximum) * 86, 5) : 2;
              const label = formatShortDate(entry.key);
              return (
                <div key={entry.key} className="group relative flex h-full min-w-0 flex-1 items-end justify-center">
                  <div
                    title={`${label}: ${mode === "revenue" ? formatINR(entry.value) : `${entry.value} orders`}`}
                    aria-label={`${label}: ${mode === "revenue" ? formatINR(entry.value) : `${entry.value} orders`}`}
                    role="img"
                    className={`w-full max-w-8 rounded-t-md transition-all duration-300 group-hover:brightness-110 ${
                      mode === "revenue" ? "bg-[#8caa91]" : "bg-[#bd9d82]"
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                  <span className="absolute -bottom-6 max-w-full truncate text-[9px] text-[#8c7661] sm:text-[10px]">
                    {label}
                  </span>
                  {entry.value > 0 && data.length <= 12 && (
                    <span className="absolute -top-5 whitespace-nowrap text-[9px] font-medium text-[#6b5a49]">
                      {mode === "revenue" ? formatINR(entry.value) : entry.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {/* <p className="mt-9 text-[11px] text-[#9a8878]">
            {mode === "revenue"
              ? "Real payments only. Simulated demo payments are shown separately."
              : "Orders exclude cancelled orders."}
          </p> */}
        </>
      )}
    </div>
  );
};

const Analytics = () => {
  const dateFilter = useAdminDateFilter();
  const { refreshVersion } = dateFilter;
  const { start: rangeStart, end: rangeEnd } = getAdminDateRange(dateFilter);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadAnalytics = async () => {
      try {
        const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
          fetch(`${API_URL}/users`, { signal: controller.signal }),
          fetch(`${API_URL}/products`, { signal: controller.signal }),
          fetch(`${API_URL}/orders`, { signal: controller.signal }),
        ]);
        const [usersResult, productsResult, ordersResult] = await Promise.all([
          usersResponse.json(),
          productsResponse.json(),
          ordersResponse.json(),
        ]);
        if (!usersResponse.ok || !productsResponse.ok || !ordersResponse.ok) {
          throw new Error("Analytics data could not be loaded from the server.");
        }

        const userList = Array.isArray(usersResult) ? usersResult : usersResult.users;
        const productList = Array.isArray(productsResult) ? productsResult : productsResult.products;
        const orderList = Array.isArray(ordersResult) ? ordersResult : ordersResult.orders;
        if (!Array.isArray(userList) || !Array.isArray(productList) || !Array.isArray(orderList)) {
          throw new Error("The server returned invalid analytics data.");
        }
        if (!controller.signal.aborted) {
          setUsers(userList);
          setProducts(productList);
          setOrders(orderList);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Load analytics failed:", error);
          setErrorMessage(error.message || "Analytics data could not be loaded.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadAnalytics();
    return () => controller.abort();
  }, [refreshVersion]);

  const analytics = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const end = rangeEnd < tomorrow ? rangeEnd : tomorrow;
    const periodOrders = orders.filter((order) => {
      if (!order.createdAt) return false;
      const createdAt = new Date(order.createdAt);
      return createdAt >= rangeStart && createdAt < end;
    });
    const activeOrders = periodOrders.filter((order) => !isCancelledOrder(order));
    const paidOrders = activeOrders.filter(isPaidOrder);
    const demoOrders = activeOrders.filter(isDemoPaidOrder);
    const realRevenue = paidOrders.reduce((total, order) => total + Number(order.amountPaid || 0), 0);
    const demoValue = demoOrders.reduce((total, order) => total + Number(order.amountPaid || 0), 0);
    const pendingOrders = activeOrders.filter((order) => order.paymentStatus === "Pending");
    const units = activeOrders.reduce(
      (total, order) => total + (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      0
    );
    const buyers = new Set(
      activeOrders.map((order) => order.customer?.userId || order.customer?.email).filter(Boolean)
    );

    const trend = new Map();
    for (let date = new Date(rangeStart); date < end; date.setDate(date.getDate() + 1)) {
      const key = formatDayKey(date);
      trend.set(key, { key, orders: 0, revenue: 0 });
    }
    const addToTrend = (order, field, value) => {
      const bucket = trend.get(formatDayKey(order.createdAt));
      if (bucket) bucket[field] += value;
    };
    activeOrders.forEach((order) => addToTrend(order, "orders", 1));
    paidOrders.forEach((order) => addToTrend(order, "revenue", Number(order.amountPaid || 0)));

    const bestSellers = new Map();
    activeOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.productId || item.name || "unknown";
        const entry = bestSellers.get(key) || {
          key,
          name: item.name || "Unnamed product",
          quantity: 0,
          orderValue: 0,
        };
        entry.quantity += Number(item.quantity || 0);
        entry.orderValue += Number(item.price || 0) * Number(item.quantity || 0);
        bestSellers.set(key, entry);
      });
    });

    const statuses = [
      { name: "Processing", count: activeOrders.filter((order) => order.status === "Processing").length, color: "bg-blue-500" },
      { name: "Shipped", count: activeOrders.filter((order) => order.status === "Shipped").length, color: "bg-violet-500" },
      { name: "Delivered", count: activeOrders.filter((order) => order.status === "Delivered").length, color: "bg-emerald-500" },
      { name: "Pending payment", count: pendingOrders.length, color: "bg-amber-500" },
      { name: "Cancelled", count: periodOrders.filter(isCancelledOrder).length, color: "bg-rose-500" },
    ];
    const paymentMethods = ["UPI", "Card", "Netbanking"].map((name) => ({
      name,
      count: activeOrders.filter((order) => order.paymentMethod === name).length,
    }));
    const newCustomers = users.filter((user) => {
      if (!user.createdAt) return false;
      const createdAt = new Date(user.createdAt);
      return createdAt >= rangeStart && createdAt < end;
    }).length;

    return {
      periodOrders,
      activeOrders,
      paidOrders,
      demoOrders,
      realRevenue,
      demoValue,
      pendingValue: pendingOrders.reduce((total, order) => total + Number(order.totalAmount || 0), 0),
      units,
      buyers: buyers.size,
      averageOrder: activeOrders.length
        ? activeOrders.reduce((total, order) => total + Number(order.totalAmount || 0), 0) / activeOrders.length
        : 0,
      trend: [...trend.values()],
      bestSellers: [...bestSellers.values()].sort((left, right) => right.quantity - left.quantity).slice(0, 5),
      statuses,
      paymentMethods,
      lowStock: products.filter((product) => Number(product.stock || 0) < 5).length,
      newCustomers,
    };
  }, [orders, products, rangeEnd, rangeStart, users]);

  const cards = [
    { label: "Orders", value: analytics.activeOrders.length.toLocaleString("en-IN"), note: `${analytics.periodOrders.length} incl. cancelled`, icon: <FaShoppingBag />, color: "bg-[#f5ece3] text-[#a8794e]" },
    { label: "Real revenue", value: formatINR(analytics.realRevenue), note: `${analytics.paidOrders.length} paid order${analytics.paidOrders.length === 1 ? "" : "s"}`, icon: <FaRupeeSign />, color: "bg-emerald-50 text-emerald-700" },
    { label: "Products ordered", value: analytics.units.toLocaleString("en-IN"), note: `${analytics.bestSellers.length} unique top items`, icon: <FaBox />, color: "bg-blue-50 text-blue-700" },
    { label: "Customers", value: analytics.buyers.toLocaleString("en-IN"), note: `${analytics.newCustomers} new in period`, icon: <FaUsers />, color: "bg-violet-50 text-violet-700" },
  ];
  const selectedPeriod = dateFilter.day
    ? new Date(`${dateFilter.day}T00:00:00`).toLocaleDateString("en-IN", { dateStyle: "medium" })
    : rangeStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <section className="min-h-full bg-[#faf7f2] p-3">
      {/* <AdminPageHeader
        title="Analytics overview"
        description="Live insights calculated from customer, product, and order records."
        aside={<span className="text-xs font-semibold text-[#6b5a49]">Calendar: {selectedPeriod}</span>}
      /> */}

      {errorMessage && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-[#e8ddcf] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#8c7661]">{card.label}</p>
                <p className="mt-2 text-xl font-bold text-[#4d3d2f] sm:text-2xl">{loading ? "…" : card.value}</p>
                <p className="mt-1 text-[11px] text-[#9a8878]">{loading ? "Loading live data" : card.note}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>{card.icon}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className={panelClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#4d3d2f]">Order trend</h2>
              <p className="mt-1 text-xs text-[#8c7661]">
                Order volume · {selectedPeriod}
              </p>
            </div>
            <span className="rounded-lg bg-[#f5ece3] p-2 text-[#a8794e]"><FaCalendarAlt /></span>
          </div>
          {loading ? <p className="py-24 text-center text-sm text-[#8c7661]">Loading order trend…</p> : (
            <TrendChart data={analytics.trend.map(({ key, orders: value }) => ({ key, value }))} mode="orders" />
          )}
        </section>
        <section className={panelClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#4d3d2f]">Revenue trend</h2>
              <p className="mt-1 text-xs text-[#8c7661]">
                Real payments received · {selectedPeriod}
              </p>
            </div>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><FaRupeeSign /></span>
          </div>
          {loading ? <p className="py-24 text-center text-sm text-[#8c7661]">Loading revenue trend…</p> : (
            <TrendChart data={analytics.trend.map(({ key, revenue: value }) => ({ key, value }))} mode="revenue" />
          )}
        </section>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className={`${panelClass} xl:col-span-2`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#4d3d2f]">Top products</h2>
              <p className="mt-1 text-xs text-[#8c7661]">Ranked by units in {selectedPeriod}</p>
            </div>
            <Link to="/admin/products" className="text-xs font-semibold text-[#a8794e] hover:underline">Product report</Link>
          </div>
          {loading ? <p className="py-10 text-sm text-[#8c7661]">Loading product performance…</p> : analytics.bestSellers.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#8c7661]">No product orders in this period.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {analytics.bestSellers.map((item, index) => {
                const maxUnits = analytics.bestSellers[0].quantity || 1;
                return (
                  <div key={item.key}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                      <span className="min-w-0 truncate font-medium text-[#4d3d2f]">{index + 1}. {item.name}</span>
                      <span className="shrink-0 text-[#8c7661]">{item.quantity} sold · {formatINR(item.orderValue)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#f3eee8]">
                      <div className="h-full rounded-full bg-[#bd9d82]" style={{ width: `${Math.max((item.quantity / maxUnits) * 100, 3)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className={panelClass}>
          <h2 className="font-bold text-[#4d3d2f]">Order status</h2>
          <p className="mt-1 text-xs text-[#8c7661]">Current period · active records</p>
          <div className="mt-5 space-y-3">
            {analytics.statuses.map((status) => {
              const total = Math.max(analytics.periodOrders.length, 1);
              return (
                <div key={status.name}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-[#6b5a49]">{status.name}</span>
                    <span className="font-semibold text-[#4d3d2f]">{status.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#f3eee8]">
                    <div className={`h-full rounded-full ${status.color}`} style={{ width: `${Math.min((status.count / total) * 100, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/admin/orders" className="mt-5 inline-block text-xs font-semibold text-[#a8794e] hover:underline">View all orders</Link>
        </section>
      </div>

      <section className={`${panelClass} mt-5`}>
        <h2 className="font-bold text-[#4d3d2f]">Payment method usage</h2>
        <p className="mt-1 text-xs text-[#8c7661]">Payment options selected across non-cancelled orders in this period.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {analytics.paymentMethods.map((method) => {
            const count = analytics.activeOrders.length;
            return (
              <div key={method.name} className="rounded-xl bg-[#faf7f2] p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#4d3d2f]">{method.name}</span>
                  <span className="text-sm font-bold text-[#8c6847]">{method.count}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eee4da]">
                  <div
                    className="h-full rounded-full bg-[#bd9d82]"
                    style={{ width: `${count ? (method.count / count) * 100 : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className={panelClass}>
          <p className="text-xs text-[#8c7661]">Demo payment value</p>
          <p className="mt-2 text-xl font-bold text-[#a8794e]">{loading ? "…" : formatINR(analytics.demoValue)}</p>
          <p className="mt-1 text-[11px] text-[#9a8878]">{analytics.demoOrders.length} simulated payment orders · not real revenue</p>
        </article>
        <article className={panelClass}>
          <p className="text-xs text-[#8c7661]">Average order value</p>
          <p className="mt-2 text-xl font-bold text-[#4d3d2f]">{loading ? "…" : formatINR(analytics.averageOrder)}</p>
          <p className="mt-1 text-[11px] text-[#9a8878]">Based on non-cancelled orders</p>
        </article>
        <article className={panelClass}>
          <p className="text-xs text-[#8c7661]">Pending payment</p>
          <p className="mt-2 text-xl font-bold text-amber-700">{loading ? "…" : formatINR(analytics.pendingValue)}</p>
          <p className="mt-1 text-[11px] text-[#9a8878]">{analytics.activeOrders.filter((order) => order.paymentStatus === "Pending").length} orders awaiting payment</p>
        </article>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#e8ddcf] bg-white/70 px-4 py-3 text-[11px] text-[#8c7661]">
        <span>Inventory: {products.length} products · {analytics.lowStock} with fewer than 5 in stock</span>
        <span>{users.length} registered customers · {analytics.newCustomers} joined during this period</span>
      </div>
      {/* <p className="mt-3 text-[10px] leading-5 text-[#9a8878]">
        Revenue counts only real, non-demo payments. Demo payments are reported separately. Product totals and trends use recorded order items, not simulated estimates.
      </p> */}
    </section>
  );
};

export default Analytics;
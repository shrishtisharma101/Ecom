import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBox, FaShoppingCart, FaRupeeSign, FaEnvelope, FaUserPlus } from "react-icons/fa";
import { formatINR } from "../../utils/currency";
import { getAdminDateRange, useAdminDateFilter } from "../context/AdminDateFilterContext";
import TablePagination from "../components/TablePagination";
import { useTablePagination } from "../hooks/useTablePagination";
// import AdminPageHeader from "../components/AdminPageHeader";

const API_URL = `${import.meta.env.VITE_API_URL}`;
const formatDate = (date) => new Date(date).toLocaleString();
const localDateKey = (date) => {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
};
const formatDay = (dateKey) => new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-IN");

const DailyBarChart = ({ title, description, data, color }) => {
  const maximum = Math.max(...data.map((day) => day.value), 1);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e8ddcf] bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#4d3d2f] sm:text-lg">{title}</h2>
          <p className="mt-1 text-xs text-[#8c7661]">{description}</p>
        </div>
        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${color}`} aria-hidden="true" />
      </div>
      <div className="relative mt-5 h-40 border-b border-l border-[#eee4da] px-2 pb-0 pt-2">
        <div className="absolute inset-0 flex flex-col justify-between pb-1" aria-hidden="true">
          <span className="border-t border-dashed border-[#eee4da]" />
          <span className="border-t border-dashed border-[#eee4da]" />
          <span className="border-t border-dashed border-[#eee4da]" />
          <span className="border-t border-dashed border-[#eee4da]" />
        </div>
        <div className="relative z-10 flex h-full items-end justify-between gap-1 sm:gap-2">
          {data.map((day) => {
            const height = Math.max((day.value / maximum) * 72, day.value ? 8 : 3);
            return (
              <div key={day.key} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end">
                <span className="mb-1 text-[9px] font-semibold text-[#6b5a49] sm:text-[10px]">
                  {day.value.toLocaleString("en-IN")}
                </span>
                <div
                  title={`${day.label}: ${day.value.toLocaleString("en-IN")}`}
                  className={`w-full max-w-5 rounded-t-md ${color} opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:brightness-110 sm:max-w-7`}
                  style={{ height: `${height}%` }}
                  role="img"
                  aria-label={`${day.label}: ${day.value}`}
                />
                <span className="mt-1.5 text-[9px] text-[#8c7661] sm:text-[10px]">{day.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-[10px] text-[#9a8878]">Selected calendar range · live order database</p>
    </section>
  );
};

const Dashboard = () => {
  const dateFilter = useAdminDateFilter();
  const { refreshVersion } = dateFilter;
  const { start: rangeStart, end: rangeEnd } = getAdminDateRange(dateFilter);
  const [loading, setLoading] = useState(true);
  const [ setErrorMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [setCatalogStats] = useState({
    products: 0,
  });

  useEffect(() => {
    const controller = new AbortController();
    const loadDashboard = async () => {
      try {
        const [usersResponse, productsResponse, ordersResponse, contactsResponse] = await Promise.all([
          fetch(`${API_URL}/users`, { signal: controller.signal }),
          fetch(`${API_URL}/products`, { signal: controller.signal }),
          fetch(`${API_URL}/orders`, { signal: controller.signal }),
          fetch(`${API_URL}/contact`, { signal: controller.signal }),
        ]);
        const [usersData, productsData, ordersData, contactsData] = await Promise.all([
          usersResponse.json(),
          productsResponse.json(),
          ordersResponse.json(),
          contactsResponse.json(),
        ]);

        if (!usersResponse.ok || !productsResponse.ok || !ordersResponse.ok || !contactsResponse.ok) {
          throw new Error("Dashboard data could not be loaded from the server.");
        }
        const users = Array.isArray(usersData) ? usersData : usersData.users;
        const products = Array.isArray(productsData) ? productsData : productsData.products;
        const allOrders = Array.isArray(ordersData) ? ordersData : ordersData.orders;
        const allContacts = Array.isArray(contactsData) ? contactsData : contactsData.contacts;

        if (
          !Array.isArray(users) ||
          !Array.isArray(products) ||
          !Array.isArray(allOrders) ||
          !Array.isArray(allContacts)
        ) {
          throw new Error("The server returned an invalid dashboard response.");
        }

        setOrders(allOrders);
        setUsers(users);
        setContacts(allContacts);
        setCatalogStats({
          products: products.length,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Load admin dashboard failed:", error);
          setErrorMessage(error.message || "Dashboard data could not be loaded.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadDashboard();
    return () => controller.abort();
  }, [refreshVersion]);

  const calendarOrders = orders.filter((order) => {
    if (!order.createdAt) return false;
    const createdAt = new Date(order.createdAt);
    return createdAt >= rangeStart && createdAt < rangeEnd;
  });
  const activeCalendarOrders = calendarOrders.filter((order) => order.status !== "Cancelled");
  const filteredSales = activeCalendarOrders.reduce((sales, order) => {
    const day = localDateKey(order.createdAt);
    (order.items || []).forEach((item) => {
      const productName = item.name || "Unnamed product";
      const key = `${day}:${item.productId || productName}`;
      const existing = sales.get(key) || {
        day,
        productId: item.productId,
        productName,
        quantity: 0,
        orderCount: 0,
        orderIds: new Set(),
        orderValue: 0,
      };
      existing.quantity += Number(item.quantity || 0);
      if (!existing.orderIds.has(order._id)) {
        existing.orderIds.add(order._id);
        existing.orderCount += 1;
      }
      existing.orderValue += Number(item.price || 0) * Number(item.quantity || 0);
      sales.set(key, existing);
    });
    return sales;
  }, new Map());
  const dailyProductSales = [...filteredSales.values()].sort(
    (left, right) => right.day.localeCompare(left.day) || right.quantity - left.quantity
  );
  const productSalesPagination = useTablePagination(
    dailyProductSales,
    `${dateFilter.month}:${dateFilter.day}`
  );
  const chartStart = dateFilter.day ? rangeStart : new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
  const selectedMonthEnd = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + 1, 1);
  const tomorrow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
  const chartEnd = dateFilter.day
    ? rangeEnd
    : selectedMonthEnd < tomorrow
      ? selectedMonthEnd
      : tomorrow;
  const dailyTotals = new Map();
  for (let date = new Date(chartStart); date < chartEnd; date.setDate(date.getDate() + 1)) {
    const key = localDateKey(date);
    dailyTotals.set(key, { key, label: String(date.getDate()), orders: 0, units: 0 });
  }
  activeCalendarOrders.forEach((order) => {
    const day = dailyTotals.get(localDateKey(order.createdAt));
    if (!day) return;
    day.orders += 1;

    day.units += (order.items || []).reduce((total, item) => total + Number(item.quantity || 0), 0);
  });
  const chartLabel = dateFilter.day
    ? formatDay(dateFilter.day)
    : rangeStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const selectedDemoValue = activeCalendarOrders
    .filter((order) => order.paymentStatus === "Demo Paid")
    .reduce((total, order) => total + Number(order.amountPaid || 0), 0);
  const selectedUnits = activeCalendarOrders.reduce(
    (total, order) => total + (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    0
  );
  const recentOrders = [...calendarOrders]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 5);
  const statsCards = [
    // { title: "Real payments received", value: formatINR(selectedRevenue), icon: <FaRupeeSign />, color: "bg-green-100 text-green-700" },
    { title: "Total payments", value: formatINR(selectedDemoValue), icon: <FaRupeeSign />, color: "bg-amber-100 text-amber-800", valueColor: "text-amber-800" },
    { title: "Orders", value: calendarOrders.length.toLocaleString("en-IN"), icon: <FaShoppingCart />, color: "bg-blue-100 text-blue-700", valueColor: "text-blue-700" },
    { title: "Products", value: selectedUnits.toLocaleString("en-IN"), icon: <FaBox />, color: "bg-orange-100 text-orange-700", valueColor: "text-orange-700" },
    
    // { title: "Catalog products", value: catalogStats.products.toLocaleString("en-IN"), icon: <FaBox />, color: "bg-orange-50 text-orange-700", valueColor: "text-orange-700" },
   
    // { title: "Customers", value: selectedBuyers.toLocaleString("en-IN"), icon: <FaUsers />, color: "bg-purple-100 text-purple-700" },
    
    { title: "Total registered users", value: users.length.toLocaleString("en-IN"), icon: <FaUserPlus />, color: "bg-indigo-100 text-indigo-700", valueColor: "text-indigo-700" },
    { title: "Total contact messages", value: contacts.length.toLocaleString("en-IN"), icon: <FaEnvelope />, color: "bg-pink-100 text-pink-700", valueColor: "text-pink-700" },
  ];

  return (
    <div className="min-h-full p-3">
      {/* <AdminPageHeader
        title="Dashboard"
        description={`Store overview for ${chartLabel}.`}
        onRefresh={() => {
          setLoading(true);
          setErrorMessage("");
          setRefreshKey((key) => key + 1);
        }}
        loading={loading}
      /> */}
      
      {/* {errorMessage && <p role="alert" className="mb-4 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>}
      */}
      {/* <p className="mb-4 text-xs font-medium text-[#8c7661]">
        Showing data for {chartLabel}{dateFilter.day ? "" : " (select a specific day in the calendar above to narrow further)"} · {catalogStats.products} products in catalog · {users.length} total registered users · {contacts.length} total contact messages
      </p> */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4">
        {statsCards.map((stat) => (
          <article key={stat.title} className="rounded-2xl border border-[#e3d3c2] bg-white p-4 shadow-sm lg:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-xs text-[#8c7661] sm:text-sm">{stat.title}</p>
                <p className={`mt-1 w-full break-words text-left text-base font-bold leading-tight sm:text-lg lg:text-xl ${stat.valueColor}`}>
                  {loading ? "…" : stat.value}
                </p>
              </div>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${stat.color}`}>{stat.icon}</span>
            </div>
            <p className="mt-3 text-[10px] text-[#8c7661] sm:text-xs">
              {loading ? "Loading database…" : "Live database data"}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
        <DailyBarChart
          title="Order analytics"
          description={`Daily order count · ${chartLabel}`}
          data={[...dailyTotals.values()].map(({ key, label, orders: value }) => ({ key, label, value }))}
          color="bg-[#bd9d82]"
        />
        <DailyBarChart
          title="Products sold"
          description={`Daily product units · ${chartLabel}`}
          data={[...dailyTotals.values()].map(({ key, label, units: value }) => ({ key, label, value }))}
          color="bg-[#6f9f87]"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
        <section className="rounded-2xl border border-[#e3d3c2] bg-white p-4 shadow-sm lg:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#4d3d2f] lg:text-lg">Recent orders</h2>
              <p className="mt-1 text-xs text-[#8c7661]">Orders in the selected calendar range</p>
            </div>
            <Link to="/admin/orders" className="shrink-0 text-xs font-semibold text-[#a8794e] hover:underline lg:text-sm">View all</Link>
          </div>
          {loading ? (
            <p className="text-sm text-[#8c7661]">Loading orders…</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-[#8c7661]">No orders have been placed yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <article key={order._id} className="flex items-center justify-between gap-3 border-b border-[#f0e4d7] pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#4d3d2f] sm:text-sm">{order.orderNumber}</p>
                    <p className="mt-1 truncate text-[10px] text-[#8c7661] sm:text-xs">{order.customer?.name || "Unknown customer"} · {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-semibold text-[#4d3d2f] sm:text-sm">{formatINR(order.totalAmount)}</p>
                    <p className={`mt-1 text-[10px] sm:text-xs ${order.paymentStatus === "Paid" ? "text-green-700" : "text-amber-800"}`}>
                      {order.isDemoPayment ? "Demo payment" : order.paymentStatus || "Pending"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#e3d3c2] bg-white p-4 shadow-sm lg:p-5">
          <div className="mb-4">
            <h2 className="text-base font-bold text-[#4d3d2f] lg:text-lg">Product orders by date</h2>
            <p className="mt-1 text-xs text-[#8c7661]">
              Product quantities and order values in the selected calendar range, grouped by local order date.
            </p>
          </div>
          {loading ? (
            <p className="text-sm text-[#8c7661]">Loading dated sales…</p>
          ) : dailyProductSales.length === 0 ? (
            <p className="text-sm text-[#8c7661]">No product orders have been recorded.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-[#f0e7df]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[360px] text-left text-sm">
                <thead className="border-b border-[#eee4da] text-xs text-[#8c7661]">
                  <tr><th className="py-2 pr-3">Date / product</th><th className="py-2 pr-3 text-right">Units · orders</th><th className="py-2 text-right">Order value</th></tr>
                </thead>
                <tbody className="divide-y divide-[#f2e9e0]">
                  {productSalesPagination.pageItems.map((sale) => (
                    <tr key={`${sale.day}-${sale.productId || sale.productName}`}>
                      <td className="py-3 pr-3"><span className="block text-[10px] text-[#8c7661]">{formatDay(sale.day)}</span><span className="font-medium text-[#4d3d2f]">{sale.productName}</span></td>
                      <td className="py-3 pr-3 text-right text-[#4d3d2f]">{sale.quantity} · {sale.orderCount}</td>
                      <td className="py-3 text-right font-medium text-[#4d3d2f]">{formatINR(sale.orderValue)}</td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
              <TablePagination {...productSalesPagination} />
            </div>
          )}
        </section>
      </div>
      {/* <p className="mt-4 text-xs leading-5 text-[#8c7661]">
        Online payment processing is not configured. Simulated demo payments update orders for testing only; real payments received remain {formatINR(0)} until a payment provider is connected.
      </p> */}
    </div>
  );
};

export default Dashboard;

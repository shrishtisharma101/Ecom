import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaBox, FaCheck, FaEnvelope, FaUserPlus } from "react-icons/fa";
import { formatINR } from "../../utils/currency";
import TablePagination from "../components/TablePagination";
import { useTablePagination } from "../hooks/useTablePagination";
import { useAdminDateFilter } from "../context/AdminDateFilterContext";

const API_URL = `${import.meta.env.VITE_API_URL}/orders/admin-notifications`;
const formatDate = (date) => new Date(date).toLocaleString("en-IN");

const Notifications = () => {
  const { refreshVersion } = useAdminDateFilter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const notificationPagination = useTablePagination(
    notifications,
    notifications.map((notification) => notification._id).join(":")
  );

  useEffect(() => {
    const controller = new AbortController();
    const loadNotifications = async () => {
      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        const result = await response.json();
        if (!response.ok || !Array.isArray(result.notifications)) {
          throw new Error(result.message || "Could not load notifications.");
        }

        let notificationList = result.notifications;
        setNotifications(notificationList);
        const unreadIds = notificationList
          .filter((notification) => !notification.adminNotificationSeen)
          .map((notification) => notification._id);
        if (unreadIds.length > 0) {
          const seenResponse = await fetch(`${API_URL}/seen`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationIds: unreadIds }),
            signal: controller.signal,
          });
          const seenResult = await seenResponse.json();
          if (
            !seenResponse.ok ||
            !seenResult.success ||
            !Number.isInteger(seenResult.unreadCount)
          ) {
            throw new Error(seenResult.message || "Could not mark notifications as seen.");
          }
          notificationList = notificationList.map((notification) => ({
            ...notification,
            adminNotificationSeen: notification.adminNotificationSeen ||
              unreadIds.includes(notification._id),
          }));
          window.dispatchEvent(new CustomEvent("admin-notifications-seen", {
            detail: { unreadCount: seenResult.unreadCount },
          }));
        } else {
          window.dispatchEvent(new CustomEvent("admin-notifications-seen", {
            detail: { unreadCount: result.unreadCount },
          }));
        }
        setNotifications(notificationList);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Load admin notifications failed:", error);
          setErrorMessage(error.message || "Could not load notifications.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadNotifications();
    return () => controller.abort();
  }, [refreshVersion]);

  return (
    <section className="p-3">
      {errorMessage && <p role="alert" className="mb-4 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>}
      {loading ? (
        <p className="py-8 text-sm text-[#8c7661]">Loading notifications…</p>
      ) : !errorMessage && notifications.length === 0 ? (
        <div className="rounded-2xl border border-[#e3d3c2] bg-white p-6 text-center shadow-sm">
          <FaBell className="mx-auto text-xl text-[#c8a279]" />
          <p className="mt-3 font-medium text-[#4d3d2f]">No notifications yet</p>
        </div>
      ) : (
        <div>
          <div className="space-y-2">
            {notificationPagination.pageItems.map((notification) => (
              <article
                key={notification._id}
                className={`rounded-xl border p-3 shadow-sm sm:p-4 ${notification.adminNotificationSeen ? "border-[#e3d3c2] bg-white" : "border-[#c8a279] bg-[#fffaf3]"}`}
              >
              <div className="flex items-start gap-2.5">
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${notification.adminNotificationSeen ? "bg-[#f6ede0] text-[#8c7661]" : "bg-[#c8a279] text-white"}`}>
                  {notification.type === "registration"
                    ? <FaUserPlus />
                    : notification.type === "contact"
                      ? <FaEnvelope />
                      : <FaBox />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold text-[#4d3d2f]">
                      {notification.type === "registration"
                        ? "New user registered"
                        : notification.type === "contact"
                          ? "New contact message"
                          : `New order ${notification.orderNumber || `#${notification._id.slice(-6)}`}`}
                    </h2>
                    <span className={`inline-flex items-center gap-1 text-xs ${notification.adminNotificationSeen ? "text-[#8c7661]" : "font-semibold text-[#a8794e]"}`}>
                      {notification.adminNotificationSeen ? <><FaCheck /> Seen</> : "New"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#6b5a49]">
                    {notification.type === "order"
                      ? `${notification.customer?.name || "Customer"} · ${notification.customer?.email || "No email"}`
                      : `${notification.name || "Website visitor"} · ${notification.email || "No email"}`}
                  </p>
                  <p className="mt-1 text-xs text-[#8c7661]">{formatDate(notification.createdAt)}</p>
                  {notification.type === "order" ? (
                    <>
                      <p className="mt-1 text-xs text-[#6b5a49]">
                        Order: {notification.status || "Pending"} · Payment: {notification.paymentStatus || "Pending"}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#eee4da] pt-2">
                        <p className="text-xs text-[#4d3d2f]">
                          {(notification.items || []).map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                        </p>
                        <p className="shrink-0 text-xs font-semibold text-[#4d3d2f]">{formatINR(notification.totalAmount)}</p>
                      </div>
                    </>
                  ) : notification.type === "contact" ? (
                    <div className="mt-2 rounded-lg border border-[#eee4da] bg-[#fbf8f4] p-2.5">
                      <p className="text-xs font-semibold text-[#4d3d2f]">{notification.subject || "Website contact"}</p>
                      {notification.phone && <p className="mt-1 text-xs text-[#8c7661]">Phone: {notification.phone}</p>}
                      <p className="mt-1.5 whitespace-pre-wrap break-words text-xs text-[#6b5a49]">{notification.message}</p>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-[#6b5a49]">Phone: {notification.phone || "Not provided"}</p>
                  )}
                  <Link
                    to={notification.type === "registration"
                      ? "/admin/users"
                      : notification.type === "contact"
                        ? "/admin/contacts"
                        : "/admin/orders"}
                    className="mt-2 inline-block text-[11px] font-semibold text-[#a8794e] hover:underline"
                  >
                    {notification.type === "registration"
                      ? "View user details"
                      : notification.type === "contact"
                        ? "View contact page"
                        : "View order details"}
                  </Link>
                </div>
              </div>
              </article>
            ))}
          </div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-[#e3d3c2] shadow-sm">
            <TablePagination {...notificationPagination} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Notifications;

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle,
  FaChevronDown,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { clearAdminSession } from "../utils/adminAuth";

const NOTIFICATIONS_URL = "http://localhost:8000/api/orders/admin-notifications";

const Navbar = ({ setIsOpen }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [admin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("admin") || "null");
    } catch {
      return null;
    }
  });
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pageTitle = {
    "/admin": "Dashboard",
    "/admin/products": "Product Details",
    "/admin/orders": "Orders",
    "/admin/notifications": "Notifications",
    "/admin/users": "Users",
    "/admin/analytics": "Analytics",
    "/admin/contacts": "Contacts",
    "/admin/login-ids": "Login IDs",
    "/admin/profile": "My Profile",
    "/admin/settings": "Settings",
  }[pathname] || "Admin";

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const handleNotificationsSeen = (event) => {
      setUnreadNotifications(event.detail?.unreadCount ?? 0);
    };

    const loadUnreadCount = async () => {
      try {
        const response = await fetch(NOTIFICATIONS_URL, { signal: controller.signal });
        const result = await response.json();
        if (!response.ok || !Number.isInteger(result.unreadCount)) {
          throw new Error(result.message || "Could not load admin notifications.");
        }
        if (active) setUnreadNotifications(result.unreadCount);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch admin notification count failed:", error);
        }
      }
    };

    loadUnreadCount();
    const interval = window.setInterval(loadUnreadCount, 10000);
    window.addEventListener("admin-notifications-seen", handleNotificationsSeen);
    return () => {
      active = false;
      controller.abort();
      window.clearInterval(interval);
      window.removeEventListener("admin-notifications-seen", handleNotificationsSeen);
    };
  }, []);

  useEffect(() => {
    const closeMenuOnOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenuOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeMenuOnOutsideClick);
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    setIsProfileMenuOpen(false);
    navigate("/admin/login", { replace: true });
  };

  return (
    <header
      className="
        h-16
        min-h-16
        w-full
        bg-white
        border-b
        border-[#e3d3c2]
        flex
        items-center
        justify-between
        gap-3
        px-3
        sm:px-5
        lg:px-6
        sticky
        top-0
        z-30
      "
    >

      {/* ================= LEFT ================= */}

      <div className="flex items-center gap-2 sm:gap-3 min-w-0">

        {/* Mobile Menu */}

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="
            lg:hidden
            flex
            items-center
            justify-center
            w-9
            h-9
            rounded-lg
            text-[#4d3d2f]
            hover:bg-[#f6ede0]
            hover:text-[#c8a279]
            transition
            flex-shrink-0
          "
          aria-label="Open sidebar"
        >
          <FaBars size={20} />
        </button>

        {/* Title */}

        <div className="min-w-0">

          <h2
            className="
              text-base
              sm:text-lg
              font-bold
              text-[#4d3d2f]
              truncate
            "
          >
            {pageTitle}
          </h2>

          <p className="hidden sm:block text-xs text-[#8c7661]">
            Welcome back, Admin
          </p>

        </div>

      </div>


      {/* ================= RIGHT ================= */}

      <div
        className="
          flex
          items-center
          gap-2
          sm:gap-3
          flex-shrink-0
        "
      >

        {/* ================= SEARCH ================= */}

        <div
          className="
            hidden
            md:flex
            items-center
            bg-[#f6ede0]
            rounded-full
            px-3
            lg:px-4
            py-2
          "
        >
          <FaSearch className="text-[#8c7661] text-sm" />

          <input
            type="text"
            placeholder="Search..."
            className="
              bg-transparent
              outline-none
              ml-2
              lg:ml-3
              w-28
              lg:w-44
              text-sm
              text-[#4d3d2f]
              placeholder:text-[#8c7661]
            "
          />
        </div>


        {/* ================= NOTIFICATION ================= */}

        <Link
          to="/admin/notifications"
          className="
            relative
            w-9
            h-9
            sm:w-10
            sm:h-10
            rounded-full
            flex
            items-center
            justify-center
            bg-[#f6ede0]
            text-[#8c7661]
            hover:bg-[#c8a279]
            hover:text-white
            transition-all
            flex-shrink-0
          "
          aria-label={`Notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ""}`}
          title={unreadNotifications ? `${unreadNotifications} unread notifications` : "Notifications"}
        >
          <FaBell className="text-sm sm:text-base" />
          {unreadNotifications > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadNotifications > 99 ? "99+" : unreadNotifications}
            </span>
          )}
        </Link>


        {/* ================= ADMIN ================= */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* Admin Text */}

          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-[#4d3d2f]">
              {admin?.name || "Admin"}
            </p>

            <p className="text-xs text-[#8c7661]">
              Administrator
            </p>
          </div>

          {/* Admin Icon */}

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((open) => !open)}
              aria-label="Open admin profile menu"
              aria-expanded={isProfileMenuOpen}
              className="flex items-center gap-1 rounded-full text-[#8c7661] hover:text-[#4d3d2f] focus:outline-none focus:ring-2 focus:ring-[#c8a279]"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#c8a279] text-lg text-white sm:h-10 sm:w-10 sm:text-xl">
                <FaUserCircle />
              </span>
              <FaChevronDown className="hidden text-xs sm:block" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#e3d3c2] bg-white py-2 shadow-xl">
                <div className="border-b border-[#eee4da] px-4 py-2">
                  <p className="truncate text-sm font-semibold text-[#4d3d2f]">{admin?.name || "Admin"}</p>
                  <p className="truncate text-xs text-[#8c7661]">{admin?.email || "Administrator"}</p>
                </div>
                <Link
                  to="/admin/profile"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4d3d2f] hover:bg-[#f6ede0]"
                >
                  <FaUser className="text-[#8c7661]" /> My Profile
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4d3d2f] hover:bg-[#f6ede0]"
                >
                  <FaCog className="text-[#8c7661]" /> Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 border-t border-[#eee4da] px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;

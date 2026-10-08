import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaChartBar,
  FaBell,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

import { Link, NavLink, useNavigate } from "react-router-dom";

import { FaAddressBook } from "react-icons/fa";
// import { FaUserLock } from "react-icons/fa";
import { clearAdminSession } from "../utils/adminAuth";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/admin",
    },
    {
      name: "Products",
      icon: <FaBox />,
      path: "/admin/products",
    },
    {
      name: "Orders",
      icon: <FaShoppingCart />,
      path: "/admin/orders",
    },
    {
      name: "Notifications",
      icon: <FaBell />,
      path: "/admin/notifications",
    },
    {
      name: "Users",
      icon: <FaUsers />,
      path: "/admin/users",
    },
    {
      name: "Analytics",
      icon: <FaChartBar />,
      path: "/admin/analytics",
    },

    {
  name: "Contacts",
  icon: <FaAddressBook />,
  path: "/admin/contacts",
},

// {
//   name: "Login Id's",
//   icon: <FaUserLock />,
//   path: "/admin/login-ids",
// },



  ];

  const handleLogout = () => {
    clearAdminSession();
    setIsOpen(false);
    navigate("/admin/login", { replace: true });
  };

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            z-40
            lg:hidden
          "
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-56
          max-w-[85vw]
          bg-[#bd9d82]
          text-white
          shadow-2xl
          transition-transform
          duration-300
          ease-in-out
          lg:translate-x-0

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ================= LOGO ================= */}

        <div
          className="
            h-16
            sm:h-20
            flex
            items-center
            justify-between
            px-4
            sm:px-5
            border-b
            border-white/10
          "
        >
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            aria-label="E Admin — go to website home"
            title="Go to website"
            className="flex items-center gap-2.5 rounded-lg transition hover:opacity-90"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c8a279] text-xl font-bold text-white shadow-sm">
              E
            </span>
            <span className="text-xl font-bold tracking-wide text-[#f2e5d3] sm:text-2xl">
              Admin
            </span>
          </Link>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="
              lg:hidden
              p-2
              text-white/70
              hover:text-white
              transition
            "
            aria-label="Close sidebar"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* ================= NAVIGATION ================= */}

        <nav
          className="
            p-3
            sm:p-4
            space-y-1.5
            sm:space-y-2
          "
        >
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.name === "Dashboard"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                w-full
                flex
                items-center
                gap-3
                px-3
                sm:px-3.5
                py-2.5
                rounded-xl
                text-sm
                font-medium
                transition-all
                duration-200

                ${
                  isActive
                    ? `
                      bg-[#c8a279]
                      text-white
                      shadow-lg
                    `
                    : `
                      text-white/70
                      hover:bg-[#c8a279]
                      hover:text-white
                      hover:shadow-md
                    `
                }
              `}
            >
              <span className="text-base sm:text-lg">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* ================= LOGOUT ================= */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            p-3
            sm:p-4
            border-t
            border-white/10
          "
        >
          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              sm:px-3.5
              py-2.5
              rounded-xl
              text-sm
              text-white/70
              hover:bg-red-500/20
              hover:text-red-300
              transition-all
            "
          >
            <FaSignOutAlt />

            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;

import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// ================= USER PAGES =================

import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/LoginModal/LoginModal";
import Register from "../pages/RegisterModal/RegisterModal";
import Cart from "../pages/Cart/Cart";
import Bestseller from "../pages/Bestseller/Bestseller";
import Checkout from "../pages/Checkout/Checkout";
import DemoPaymentPage from "../pages/Checkout/DemoPaymentPage";
import Pages from "../pages/Pages/Pages";
import ProductsPage from "../pages/ProductsPage/ProductsPages";
import AccountPage from "../pages/Account/AccountPage";
import WishlistPage from "../pages/Wishlist/WishlistPage";
import OrdersPage from "../pages/Orders/OrdersPage";
import ComparePage from "../pages/Compare/ComparePage";

// ================= ADMIN =================

import AdminApp from "../admin/AdminApp";

import Dashboard from "../admin/pages/Dashboard";
import Products from "../admin/pages/Products";
import Orders from "../admin/pages/Orders";
import Users from "../admin/pages/Users";
import Analytics from "../admin/pages/Analytics";
import Contacts from "../admin/pages/Contacts";
import LoginIds from "../admin/pages/LoginIds";
import AdminAccount from "../admin/pages/AdminAccount";
import Notifications from "../admin/pages/Notifications";

// ================= ADMIN LOGIN =================

import AdminLogin from "../admin/pages/AdminLogin";

// ================= PROTECTED ROUTE =================

import ProtectedRoute from "../admin/pages/ProtectedRoute";
import UserProtectedRoute from "./UserProtectedRoute";
import { useShop } from "../context/useShop";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToWishlist, addToCart } = useShop();
  const destination = location.state?.from?.pathname || "/";
  const pendingWishlistItem = location.state?.pendingWishlistItem;
  const pendingCartItem = location.state?.pendingCartItem;

  return (
    <Login
      isOpen
      initialEmail={location.state?.registeredEmail || ""}
      registrationSuccess={location.state?.registrationSuccess || ""}
      onClose={() => navigate("/", { replace: true })}
      onSwitchToRegister={() => navigate("/register", { state: location.state })}
      onLoginSuccess={() => {
        if (pendingWishlistItem) addToWishlist(pendingWishlistItem);
        if (pendingCartItem) addToCart(pendingCartItem);
        navigate(destination, { replace: true });
      }}
    />
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Register
      isOpen
      onClose={() => navigate("/", { replace: true })}
      onSwitchToLogin={() => navigate("/login", { replace: true, state: location.state })}
      onRegistrationSuccess={(registration) => {
        navigate("/login", {
          replace: true,
          state: {
            ...location.state,
            registeredEmail: registration.user.email,
            registrationSuccess: "Account created successfully. Sign in with your email and password.",
          },
        });
      }}
    />
  );
};


const AppRoutes = () => {
  return (
    <Routes>

      {/* ==================================================
          USER ROUTES
      ================================================== */}

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />
      <Route path="/payment/continue" element={<DemoPaymentPage />} />

      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/bestseller" element={<Bestseller />} />
      <Route path="/pages" element={<Pages />} />
      <Route path="/compare" element={<ComparePage />} />

      <Route element={<UserProtectedRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<AccountPage section="profile" />} />
        <Route path="/settings" element={<AccountPage section="settings" />} />
      </Route>


      {/* ==================================================
          ADMIN LOGIN
          URL: /admin/login
      ================================================== */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />


      {/* ==================================================
          PROTECTED ADMIN ROUTES
      ================================================== */}

      <Route element={<ProtectedRoute />}>

        <Route
          path="/admin"
          element={<AdminApp />}
        >

          {/* /admin */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* /admin/products */}
          <Route
            path="products"
            element={<Products />}
          />

          {/* /admin/orders */}
          <Route
            path="orders"
            element={<Orders />}
          />

          <Route
            path="notifications"
            element={<Notifications />}
          />

          {/* /admin/users */}
          <Route
            path="users"
            element={<Users />}
          />

          {/* /admin/analytics */}
          <Route
            path="analytics"
            element={<Analytics />}
          />

          {/* /admin/contacts */}
          <Route
            path="contacts"
            element={<Contacts />}
          />

          <Route
            path="profile"
            element={<AdminAccount />}
          />

          <Route
            path="settings"
            element={<AdminAccount />}
          />

          {/* /admin/login-ids */}
          <Route
            path="login-ids"
            element={<LoginIds />}
          />

        </Route>

      </Route>


      {/* ==================================================
          404
      ================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
};

export default AppRoutes;

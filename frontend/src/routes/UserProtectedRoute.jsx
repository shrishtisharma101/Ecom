import { Outlet, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  if (isLoggedIn) return <Outlet />;

  const continueTo = (path) => {
    navigate(path, {
      state: {
        from: { pathname: location.pathname },
        pendingWishlistItem: location.state?.pendingWishlistItem,
        pendingCartItem: location.state?.pendingCartItem,
      },
    });
  };

  const cancel = () => {
    if (navigationType === "PUSH") {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-required-title"
        className="w-full max-w-sm border border-[#e3d3c2] bg-white p-6 shadow-2xl sm:p-8"
      >
        <h1 id="login-required-title" className="text-xl font-semibold text-[#4d3d2f]">
          Sign in required
        </h1>
        <p className="mt-2 text-sm text-[#8c7661]">
          Sign in or create an account to continue.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={cancel}
            className="min-h-11 border border-[#d8c7b5] px-4 text-sm font-medium text-[#4d3d2f] hover:bg-[#f6ede0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => continueTo("/register")}
            className="min-h-11 border border-[#c8a279] px-4 text-sm font-medium text-[#8c6540] hover:bg-[#f6ede0]"
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => continueTo("/login")}
            className="min-h-11 bg-[#c8a279] px-4 text-sm font-semibold text-white hover:bg-[#b07a4b]"
          >
            Sign in
          </button>
        </div>
      </section>
    </div>
  );
};

export default UserProtectedRoute;
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { clearAdminSession } from "../utils/adminAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("adminToken"));

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // TEMPORARY ADMIN LOGIN
    if (
      formData.email === "admin@gmail.com" &&
      formData.password === "admin123"
    ) {
      clearAdminSession();
      localStorage.setItem("adminToken", "logged-in");

      localStorage.setItem(
        "admin",
        JSON.stringify({
          name: "Admin",
          email: formData.email,
        })
      );

      // Go to Admin Dashboard
      navigate("/admin", { replace: true });

      return;
    }

    setError("Invalid email or password.");
  };

  if (isLoggedIn) return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-[#f8f3ed] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* LOGO */}

        <div className="text-center mb-8">

          <div
            className="
              inline-flex
              items-center
              justify-center
              w-16
              h-16
              rounded-2xl
              bg-[#8b6f5a]
              text-white
              text-2xl
              font-semibold
              shadow-lg
            "
          >
            A
          </div>

          <h1 className="mt-5 text-3xl font-semibold text-[#3f342c]">
            Admin Panel
          </h1>

          <p className="mt-2 text-sm text-[#8c7b6d]">
            Sign in to manage your store
          </p>

        </div>


        {/* LOGIN CARD */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow-[0_15px_50px_rgba(70,50,35,0.10)]
            border
            border-[#eadfd5]
            p-8
          "
        >

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="mb-5">

              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-medium
                  text-[#51443a]
                "
              >
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@gmail.com"
                className="
                  w-full
                  h-12
                  px-4
                  rounded-xl
                  border
                  border-[#ded1c5]
                  bg-[#fdfaf7]
                  text-[#3f342c]
                  placeholder:text-[#b4a59a]
                  outline-none
                  transition
                  focus:border-[#8b6f5a]
                  focus:ring-2
                  focus:ring-[#8b6f5a]/20
                "
              />

            </div>


            {/* PASSWORD */}

            <div className="mb-5">

              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-medium
                  text-[#51443a]
                "
              >
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="
                    w-full
                    h-12
                    px-4
                    pr-20
                    rounded-xl
                    border
                    border-[#ded1c5]
                    bg-[#fdfaf7]
                    text-[#3f342c]
                    placeholder:text-[#b4a59a]
                    outline-none
                    transition
                    focus:border-[#8b6f5a]
                    focus:ring-2
                    focus:ring-[#8b6f5a]/20
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-xs
                    font-medium
                    text-[#8b6f5a]
                    hover:text-[#624d3e]
                  "
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>

              </div>

            </div>


            {/* ERROR */}

            {error && (
              <div
                className="
                  mb-5
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-600
                "
              >
                {error}
              </div>
            )}


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="
                w-full
                h-12
                rounded-xl
                bg-[#8b6f5a]
                text-white
                font-medium
                transition
                hover:bg-[#735a49]
                active:scale-[0.98]
              "
            >
              Sign In
            </button>

          </form>

        </div>


        {/* FOOTER */}

        <p className="text-center text-xs text-[#9c8c80] mt-6">
          © {new Date().getFullYear()} Admin Panel. All rights reserved.
        </p>

      </div>

    </div>
  );
};

export default AdminLogin;

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaTimes,
  FaArrowLeft,
  FaCheckCircle,
  FaSpinner,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const ForgotPasswordModal = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const modalRef = useRef(null);
  const scrollbarWidth = useRef(0);

  // ==================================================
  // CALCULATE SCROLLBAR WIDTH
  // ==================================================

  useEffect(() => {
    scrollbarWidth.current =
      window.innerWidth -
      document.documentElement.clientWidth;
  }, []);

  // ==================================================
  // OPEN / CLOSE MODAL
  // ==================================================

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight =
        `${scrollbarWidth.current}px`;

      setStep("email");
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setIsLoading(false);
    } else {
      setIsVisible(false);

      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  // ==================================================
  // ESC KEY
  // ==================================================

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  // ==================================================
  // CLOSE WHEN CLICKING OUTSIDE
  // ==================================================

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isOpen) return;

      if (
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        handleClose();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isOpen]);

  // ==================================================
  // CLOSE MODAL
  // ==================================================

  const handleClose = () => {
    setIsVisible(false);

    setTimeout(() => {
      onClose();
    }, 300);
  };

  // ==================================================
  // SEND OTP
  // ==================================================

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/forgot-password",
        {
          email: email.trim(),
        }
      );

      console.log(
        "Forgot Password Response:",
        response.data
      );

      if (response.data.success) {
        setStep("otp");
      } else {
        setError(
          response.data.message ||
            "Failed to send OTP"
        );
      }
    } catch (error) {
      console.error(
        "Forgot Password Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==================================================
  // VERIFY OTP
  // ==================================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/verify-otp",
        {
          email: email.trim(),
          otp: otp.trim(),
        }
      );

      console.log(
        "Verify OTP Response:",
        response.data
      );

      if (response.data.success) {
        setStep("password");
      } else {
        setError(
          response.data.message ||
            "Invalid OTP"
        );
      }
    } catch (error) {
      console.error(
        "Verify OTP Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==================================================
  // RESET PASSWORD
  // ==================================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please fill all password fields");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/reset-password",
        {
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
          confirmPassword,
        }
      );

      console.log(
        "Reset Password Response:",
        response.data
      );

      if (response.data.success) {
        setStep("success");
      } else {
        setError(
          response.data.message ||
            "Failed to reset password"
        );
      }
    } catch (error) {
      console.error(
        "Reset Password Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==================================================
  // GO BACK
  // ==================================================

  const handleBack = () => {
    setError("");

    if (step === "otp") {
      setStep("email");
      setOtp("");
    } else if (step === "password") {
      setStep("otp");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // ==================================================
  // SWITCH TO LOGIN
  // ==================================================

  const handleBackToLogin = () => {
    setIsVisible(false);

    setTimeout(() => {
      onClose();

      if (onSwitchToLogin) {
        onSwitchToLogin();
      }
    }, 300);
  };

  // ==================================================
  // IF MODAL NOT OPEN
  // ==================================================

  if (!isOpen) return null;

  // ==================================================
  // UI
  // ==================================================

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      onMouseDown={(e) => {
        // Only close when actual backdrop is clicked
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* BACKDROP */}

      <div
        className={`
          fixed inset-0
          bg-black/50
          backdrop-blur-sm
          transition-opacity
          duration-300
          ease-out
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* MODAL */}

      <div
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()}
        className={`
          relative
          bg-[#f6ede0]
          rounded-3xl
          shadow-2xl
          w-full
          max-w-md
          mx-4
          p-6
          sm:p-8
          md:p-10
          border
          border-[#e3d3c2]
          transition-all
          duration-300
          ease-out
          z-10
          ${
            isVisible
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 -translate-y-4 opacity-0"
          }
        `}
      >

        {/* CLOSE BUTTON */}

        <button
          type="button"
          onClick={handleClose}
          className="
            absolute
            top-3
            right-3
            sm:top-4
            sm:right-4
            text-[#8c7661]
            hover:text-[#c8a279]
            transition-all
            duration-300
            hover:rotate-90
            hover:scale-110
            z-20
          "
          aria-label="Close modal"
        >
          <FaTimes size={22} />
        </button>

        {/* BACK BUTTON */}

        {(step === "otp" || step === "password") && (
          <button
            type="button"
            onClick={handleBack}
            className="
              absolute
              top-3
              left-3
              sm:top-4
              sm:left-4
              text-[#8c7661]
              hover:text-[#c8a279]
              transition-all
              duration-300
              hover:scale-110
              z-20
            "
            aria-label="Go back"
          >
            <FaArrowLeft size={20} />
          </button>
        )}

        {/* HEADER */}

        <div className="text-center mb-6 sm:mb-8 ">

          <div
            className="
              inline-block
              bg-[#c8a279]
              text-white
              font-bold
              text-2xl
              px-4
              py-2
              rounded-xl
              mb-3
              shadow-lg
            "
          >
            {step === "password" ? (
              <FaLock className="inline-block" />
            ) : step === "success" ? (
              <FaCheckCircle className="inline-block" />
            ) : (
              <FaEnvelope className="inline-block" />
            )}
          </div>

          <h2 className="
            text-2xl
            sm:text-3xl
            font-bold
            text-[#4d3d2f]
          ">
            {step === "email" && "Forgot Password"}
            {step === "otp" && "Verify OTP"}
            {step === "password" && "Create New Password"}
            {step === "success" && "Password Reset"}
          </h2>

          <div className="
            w-16
            h-1
            bg-[#c8a279]
            rounded-full
            mx-auto
            mt-2
            sm:mt-3
          " />

          <p className="
            text-[#8c7661]
            mt-2
            sm:mt-3
            text-sm
          ">
            {step === "email" &&
              "Enter your email to reset your password"}

            {step === "otp" &&
              `Enter the 6-digit OTP sent to ${email}`}

            {step === "password" &&
              "Enter your new password"}

            {step === "success" &&
              "Your password has been reset successfully"}
          </p>
        </div>

        {/* ==================================================
            EMAIL STEP
        ================================================== */}

        {step === "email" && (
          <form
            onSubmit={handleSendOtp}
            className="space-y-4 sm:space-y-5"
          >
            {error && (
              <div className="
                rounded-xl
                border border-red-200
                bg-red-50
                px-3 py-2
                text-sm
                text-red-700
                font-medium
              ">
                {error}
              </div>
            )}

            {/* EMAIL */}

            <div className="group">

              <label className="
                block
                text-sm
                font-semibold
                text-[#4d3d2f]
                mb-1.5
                sm:mb-2
                text-left
              ">
                Email Address
              </label>

              <div className="relative">

                <div className="
                  absolute
                  inset-y-0
                  left-0
                  pl-4
                  flex
                  items-center
                  pointer-events-none
                ">
                  <FaEnvelope className="
                    text-[#8c7661]
                  " />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className={`
                    w-full
                    pl-11
                    sm:pl-12
                    pr-4
                    py-3
                    sm:py-3.5
                    rounded-full
                    border-2
                    ${
                      error
                        ? "border-red-500"
                        : "border-[#e3d3c2]"
                    }
                    bg-white/80
                    focus:bg-white
                    focus:border-[#c8a279]
                    outline-none
                    transition-all
                    duration-300
                    hover:border-[#c8a279]
                    text-sm
                  `}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  autoFocus
                  required
                />

              </div>

              {error && (
                <p className="
                  text-red-500
                  text-xs
                  mt-1.5
                  ml-4
                ">
                  {error}
                </p>
              )}

            </div>

            {/* INFO */}

            <div className="
              bg-[#faf0e8]
              rounded-xl
              p-3
              sm:p-4
            ">
              <p className="
                text-xs
                sm:text-sm
                text-[#8c7661]
                text-left
              ">
                <span className="
                  font-semibold
                  text-[#c8a279]
                ">
                  Note:
                </span>{" "}
                We'll send a 6-digit OTP to your
                registered email address.
              </p>
            </div>

            {/* SEND OTP */}

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full
                bg-[#c8a279]
                text-white
                py-3
                sm:py-3.5
                rounded-full
                font-semibold
                text-sm
                sm:text-base
                transition-all
                duration-300
                hover:bg-[#b07a4b]
                hover:scale-[1.02]
                hover:shadow-xl
                active:scale-95
                flex
                items-center
                justify-center
                gap-2
                sm:gap-3
                ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }
              `}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>Send OTP</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ==================================================
            OTP STEP
        ================================================== */}

        {step === "otp" && (
          <form
            onSubmit={handleVerifyOtp}
            className="space-y-5"
          >

            <div>
              <label className="
                block
                text-sm
                font-semibold
                text-[#4d3d2f]
                mb-2
                text-left
              ">
                Enter OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const value =
                    e.target.value
                      .replace(/\D/g, "");

                  setOtp(value);
                  setError("");
                }}
                className={`
                  w-full
                  py-3.5
                  px-4
                  rounded-full
                  border-2
                  text-center
                  text-xl
                  font-bold
                  tracking-[0.5em]
                  bg-white/80
                  focus:bg-white
                  focus:border-[#c8a279]
                  outline-none
                  ${
                    error
                      ? "border-red-500"
                      : "border-[#e3d3c2]"
                  }
                `}
                placeholder="000000"
                autoFocus
                required
              />

              {error && (
                <p className="
                  text-red-500
                  text-xs
                  mt-2
                  text-center
                ">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                bg-[#c8a279]
                text-white
                py-3.5
                rounded-full
                font-semibold
                hover:bg-[#b07a4b]
                transition-all
                flex
                items-center
                justify-center
                gap-2
              "
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify OTP →
                </>
              )}
            </button>

            <button
              type="button"
              onClick={async () => {
                setError("");

                if (!email.trim()) return;

                setIsLoading(true);

                try {
                  await axios.post(
                    "http://localhost:8000/api/users/forgot-password",
                    {
                      email: email.trim(),
                    }
                  );

                  setOtp("");
                  setError("");
                } catch (error) {
                  setError(
                    error.response?.data?.message ||
                      "Failed to resend OTP"
                  );
                } finally {
                  setIsLoading(false);
                }
              }}
              className="
                block
                mx-auto
                text-sm
                text-[#c8a279]
                font-semibold
                hover:underline
              "
            >
              Resend OTP
            </button>

          </form>
        )}

        {/* ==================================================
            PASSWORD STEP
        ================================================== */}

        {step === "password" && (
          <form
            onSubmit={handleResetPassword}
            className="space-y-5"
          >

            {/* NEW PASSWORD */}

            <div>

              <label className="
                block
                text-sm
                font-semibold
                text-[#4d3d2f]
                mb-2
                text-left
              ">
                New Password
              </label>

              <div className="relative">

                <FaLock className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#8c7661]
                " />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  className="
                    w-full
                    pl-11
                    pr-12
                    py-3.5
                    rounded-full
                    border-2
                    border-[#e3d3c2]
                    bg-white/80
                    focus:bg-white
                    focus:border-[#c8a279]
                    outline-none
                  "
                  placeholder="Enter new password"
                  autoFocus
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#8c7661]
                  "
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="
                block
                text-sm
                font-semibold
                text-[#4d3d2f]
                mb-2
                text-left
              ">
                Confirm Password
              </label>

              <div className="relative">

                <FaLock className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#8c7661]
                " />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(
                      e.target.value
                    );
                    setError("");
                  }}
                  className="
                    w-full
                    pl-11
                    pr-12
                    py-3.5
                    rounded-full
                    border-2
                    border-[#e3d3c2]
                    bg-white/80
                    focus:bg-white
                    focus:border-[#c8a279]
                    outline-none
                  "
                  placeholder="Confirm new password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#8c7661]
                  "
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>
            </div>

            {error && (
              <p className="
                text-red-500
                text-xs
                text-center
              ">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                bg-[#c8a279]
                text-white
                py-3.5
                rounded-full
                font-semibold
                hover:bg-[#b07a4b]
                transition-all
                flex
                items-center
                justify-center
                gap-2
              "
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password →
                </>
              )}
            </button>

          </form>
        )}

        {/* ==================================================
            SUCCESS
        ================================================== */}

        {step === "success" && (
          <div className="
            text-center
            py-4
            sm:py-6
          ">

            <div className="
              flex
              justify-center
              mb-5
            ">
              <div className="
                w-20
                h-20
                rounded-full
                bg-green-100
                flex
                items-center
                justify-center
              ">
                <FaCheckCircle
                  className="
                    text-5xl
                    text-green-500
                  "
                />
              </div>
            </div>

            <h3 className="
              text-lg
              font-semibold
              text-[#4d3d2f]
              mb-2
            ">
              Password Reset Successfully!
            </h3>

            <p className="
              text-sm
              text-[#8c7661]
              mb-6
            ">
              Your password has been updated.
              You can now login with your new
              password.
            </p>

            <button
              type="button"
              onClick={handleBackToLogin}
              className="
                w-full
                bg-[#c8a279]
                text-white
                py-3.5
                rounded-full
                font-semibold
                hover:bg-[#b07a4b]
                transition-all
              "
            >
              Back to Sign In
            </button>

          </div>
        )}

        {/* ==================================================
            BACK TO LOGIN
        ================================================== */}

        {step !== "success" && (
          <div className="
            mt-5
            sm:mt-6
            text-center
          ">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="
                text-sm
                text-[#8c7661]
                hover:text-[#c8a279]
                transition-all
                duration-300
                hover:underline
                flex
                items-center
                justify-center
                gap-2
                mx-auto
              "
            >
              <FaArrowLeft className="text-xs" />
              Back to Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPasswordModal;
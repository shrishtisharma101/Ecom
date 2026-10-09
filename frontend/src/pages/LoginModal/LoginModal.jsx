import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaTimes,
} from "react-icons/fa";
import ForgotPasswordModal from "../../pages/ForgotPasswordModal/ForgotPasswordModal";
import { useAuth } from "../../context/AuthContext";

const LoginModal = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLoginSuccess,
  initialEmail = "",
  registrationSuccess = "",
}) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const modalRef = useRef(null);
  const scrollbarWidth = useRef(0);

  // Calculate scrollbar width
  useEffect(() => {
    scrollbarWidth.current = window.innerWidth - document.documentElement.clientWidth;
  }, []);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
      // Fix: Add padding to body to prevent shift
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth.current}px`;
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/login`,
      {
        email: email,
        password: password,
      }
    );

    console.log("Login Success:", response.data);

    login(response.data.user, response.data.token);

    alert(response.data.message);

    if (onLoginSuccess) {
      onLoginSuccess(response.data);
    } else {
      handleClose();
    }

    // Clear fields
    setEmail("");
    setPassword("");

  } catch (error) {
    console.error("Login Error:", error);

    alert(
      error.response?.data?.message ||
      "Login failed. Please try again."
    );
  }
};

  const openForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className={`
            fixed inset-0 bg-black/50 backdrop-blur-sm
            transition-opacity duration-300 ease-out
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ zIndex: -1 }}
        ></div>

        {/* Modal */}
        <div 
          ref={modalRef}
          className={`
            relative bg-[#f6ede0] rounded-3xl shadow-2xl 
            w-full max-w-md mx-4 p-6 sm:p-8 md:p-10
            border border-[#e3d3c2]
            transition-all duration-300 ease-out
            ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 -translate-y-4 opacity-0'}
            max-h-[90vh] overflow-y-auto
          `}
          style={{ 
            animation: isVisible ? 'none' : 'none',
            willChange: 'transform, opacity'
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#8c7661] hover:text-[#c8a279] transition-all duration-300 hover:rotate-90 hover:scale-110 z-10"
            aria-label="Close modal"
          >
            <FaTimes size={22} />
          </button>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-block bg-[#c8a279] text-white font-bold text-2xl px-4 py-2 rounded-xl mb-3 shadow-lg">
              E
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4d3d2f]">Welcome Back</h2>
            <div className="w-16 h-1 bg-[#c8a279] rounded-full mx-auto mt-2 sm:mt-3"></div>
            <p className="text-[#8c7661] mt-2 sm:mt-3 text-sm">Sign in to your account</p>
          </div>

          {registrationSuccess && (
            <p role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {registrationSuccess}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email */}
            <div className="group">
              <label className="block text-sm font-semibold text-[#4d3d2f] mb-1.5 sm:mb-2 text-left">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-[#8c7661] group-hover:text-[#c8a279] transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5
                    rounded-full border-2 border-[#e3d3c2]
                    bg-white/80
                    focus:border-[#c8a279] focus:bg-white
                    outline-none transition-all duration-300
                    hover:border-[#c8a279] hover:bg-white
                    text-sm
                  "
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-[#4d3d2f] mb-1.5 sm:mb-2 text-left">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-[#8c7661] group-hover:text-[#c8a279] transition-colors duration-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full pl-11 sm:pl-12 pr-11 sm:pr-12 py-3 sm:py-3.5
                    rounded-full border-2 border-[#e3d3c2]
                    bg-white/80
                    focus:border-[#c8a279] focus:bg-white
                    outline-none transition-all duration-300
                    hover:border-[#c8a279] hover:bg-white
                    text-sm
                  "
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8c7661] hover:text-[#c8a279] transition-colors duration-300"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password - Left Aligned */}
            <div className="flex justify-start">
              <button
                type="button"
                onClick={openForgotPassword}
                className="text-sm text-[#c8a279] hover:text-[#b07a4b] transition-all duration-300 hover:translate-x-1"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="
                w-full bg-[#c8a279] text-white py-3 sm:py-3.5 rounded-full
                font-semibold text-sm sm:text-base
                transition-all duration-300
                hover:bg-[#b07a4b] hover:scale-[1.02] hover:shadow-xl
                active:scale-95
                flex items-center justify-center gap-2 sm:gap-3
                group
              "
            >
              <span>Sign In</span>
              <span className="transition-all duration-300 group-hover:translate-x-2">→</span>
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-5 sm:mt-6 text-sm text-[#8c7661]">
            Don't have an account?{" "}
            <button
              onClick={() => {
                handleClose();
                setTimeout(() => onSwitchToRegister(), 300);
              }}
              className="text-[#c8a279] font-semibold hover:text-[#b07a4b] transition-all duration-300 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={closeForgotPassword}
        onSwitchToLogin={() => {
          closeForgotPassword();
        }}
      />
    </>
  );
};

export default LoginModal;
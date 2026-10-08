import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaTimes,
  FaPhone,
  FaCamera,
} from "react-icons/fa";

const RegisterModal = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegistrationSuccess,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [profileImageError, setProfileImageError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);
  const profileImagePreviewRef = useRef(null);
  const scrollbarWidth = useRef(0);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  // Calculate scrollbar width
  useEffect(() => {
    scrollbarWidth.current = window.innerWidth - document.documentElement.clientWidth;
  }, []);

  useEffect(() => {
    return () => {
      if (profileImagePreviewRef.current) {
        URL.revokeObjectURL(profileImagePreviewRef.current);
      }
    };
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
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleClose, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClose, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileImageChange = (e) => {
    const selectedImage = e.target.files?.[0];
    setProfileImageError("");

    if (!selectedImage) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(selectedImage.type)) {
      setProfileImageError("Choose a JPEG, PNG, WEBP, or GIF image.");
      e.target.value = "";
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      setProfileImageError("Profile images must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    if (profileImagePreviewRef.current) {
      URL.revokeObjectURL(profileImagePreviewRef.current);
    }
    profileImagePreviewRef.current = URL.createObjectURL(selectedImage);
    setProfileImagePreview(profileImagePreviewRef.current);
    setProfileImage(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const registrationData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        registrationData.append(key, value);
      });
      if (profileImage) {
        registrationData.append("profileImage", profileImage);
      }

      const response = await axios.post(
        "http://localhost:8000/api/users/register",
        registrationData
      );

      alert(response.data.message || "Account created successfully");
      if (onRegistrationSuccess) {
        onRegistrationSuccess(response.data);
      } else if (onSwitchToLogin) {
        handleClose();
        setTimeout(() => onSwitchToLogin(), 300);
      } else {
        handleClose();
      }
    } catch (error) {
      console.error("Registration Error:", error);

      alert(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  if (!isOpen) return null;

  return (
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
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-block bg-[#c8a279] text-white font-bold text-2xl px-4 py-2 rounded-xl mb-3 shadow-lg">
            E
          </div>
         <h2
  className="text-2xl sm:text-3xl font-bold"
  style={{ color: "#4d3d2f" }}
>
  Create Account
</h2>
          
          
          <div className="w-16 h-1 bg-[#c8a279] rounded-full mx-auto mt-2 sm:mt-3"></div>
          <p className="text-[#8c7661] mt-2 sm:mt-3 text-sm">Join us and start shopping</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Full Name */}
          <div className="group">
            <label className="block text-sm font-semibold text-[#4d3d2f] mb-1.5 sm:mb-2 text-left">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUser className="text-[#8c7661] group-hover:text-[#c8a279] transition-colors duration-300" />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="
                  w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5
                  rounded-full border-2 border-[#e3d3c2]
                  bg-white/80
                  focus:border-[#c8a279] focus:bg-white
                  outline-none transition-all duration-300
                  hover:border-[#c8a279] hover:bg-white
                  text-sm
                "
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

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
                name="email"
                value={formData.email}
                onChange={handleChange}
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

          {/* Phone */}
          <div className="group">
            <label className="block text-sm font-semibold text-[#4d3d2f] mb-1.5 sm:mb-2 text-left">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaPhone className="text-[#8c7661] group-hover:text-[#c8a279] transition-colors duration-300" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="
                  w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5
                  rounded-full border-2 border-[#e3d3c2]
                  bg-white/80
                  focus:border-[#c8a279] focus:bg-white
                  outline-none transition-all duration-300
                  hover:border-[#c8a279] hover:bg-white
                  text-sm
                "
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          {/* Optional profile image */}
          <div>
            <label className="block text-sm font-semibold text-[#4d3d2f] mb-1.5 sm:mb-2 text-left">
              Profile Image <span className="font-normal text-[#8c7661]">(optional)</span>
            </label>
            <div className="flex items-center gap-3">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile preview"
                  className="h-12 w-12 rounded-full border border-[#e3d3c2] object-cover"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#c8a279]">
                  <FaCamera />
                </span>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleProfileImageChange}
                aria-label="Choose profile image"
                className="min-w-0 flex-1 text-sm text-[#6b5a49] file:mr-3 file:rounded-full file:border-0 file:bg-[#c8a279] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#b07a4b]"
              />
            </div>
            {profileImageError && (
              <p role="alert" className="mt-1 text-xs text-red-600">{profileImageError}</p>
            )}
            <p className="mt-1 text-xs text-[#8c7661]">JPEG, PNG, WEBP, or GIF; up to 5 MB</p>
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="
                  w-full pl-11 sm:pl-12 pr-11 sm:pr-12 py-3 sm:py-3.5
                  rounded-full border-2 border-[#e3d3c2]
                  bg-white/80
                  focus:border-[#c8a279] focus:bg-white
                  outline-none transition-all duration-300
                  hover:border-[#c8a279] hover:bg-white
                  text-sm
                "
                placeholder="Create a password"
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

          {/* Confirm Password */}
          <div className="group">
            <label className="block text-sm font-semibold text-[#4d3d2f] mb-1.5 sm:mb-2 text-left">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="text-[#8c7661] group-hover:text-[#c8a279] transition-colors duration-300" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="
                  w-full pl-11 sm:pl-12 pr-11 sm:pr-12 py-3 sm:py-3.5
                  rounded-full border-2 border-[#e3d3c2]
                  bg-white/80
                  focus:border-[#c8a279] focus:bg-white
                  outline-none transition-all duration-300
                  hover:border-[#c8a279] hover:bg-white
                  text-sm
                "
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8c7661] hover:text-[#c8a279] transition-colors duration-300"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 sm:gap-3">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="
                mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded
                border-2 border-[#e3d3c2]
                text-[#c8a279]
                focus:ring-[#c8a279]
                transition-all duration-300
                cursor-pointer
                accent-[#c8a279]
              "
              r equired
            />
            <label htmlFor="agree" className="text-xs sm:text-sm text-[#8c7661] text-left">
              I agree to the{" "}
              <button className="text-[#c8a279] hover:text-[#b07a4b] hover:underline transition-all duration-300">
                Terms & Conditions
              </button>
              {" "}and{" "}
              <button className="text-[#c8a279] hover:text-[#b07a4b] hover:underline transition-all duration-300">
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={!agreed}
            className={`
              w-full bg-[#c8a279] text-white py-3 sm:py-3.5 rounded-full
              font-semibold text-sm sm:text-base
              transition-all duration-300
              hover:bg-[#b07a4b] hover:scale-[1.02] hover:shadow-xl
              active:scale-95
              flex items-center justify-center gap-2 sm:gap-3
              group
              ${!agreed ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span>Create Account</span>
            <span className="transition-all duration-300 group-hover:translate-x-2">→</span>
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-4 sm:mt-5 text-sm text-[#8c7661]">
          Already have an account?{" "}
          <button
            onClick={() => {
              handleClose();
              setTimeout(() => onSwitchToLogin(), 300);
            }}
            className="text-[#c8a279] font-semibold hover:text-[#b07a4b] transition-all duration-300 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
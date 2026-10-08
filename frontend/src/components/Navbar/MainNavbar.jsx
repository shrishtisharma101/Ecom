import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaBars,
  FaHeart,
  FaShoppingCart,
  FaExchangeAlt,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaEllipsisV,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "./SearchBar";
import { useShop } from "../../context/useShop";

const MainNavbar = ({ toggleMenu }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedIn, user, logout, updateUser } = useAuth();
  const {
    cartNotificationCount,
    wishlistNotificationCount,
    compareItems,
  } = useShop();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const profileImageInputRef = useRef(null);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [profileImageUploadMessage, setProfileImageUploadMessage] = useState("");
  const [profileImageUploadFailed, setProfileImageUploadFailed] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !dropdownRef.current?.contains(event.target) &&
        !mobileDropdownRef.current?.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/", { replace: true });
  };

  const handleProfileImageUpload = async (event) => {
    const image = event.target.files?.[0];
    event.target.value = "";

    if (!image) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(image.type)) {
      setProfileImageUploadFailed(true);
      setProfileImageUploadMessage("Choose a JPEG, PNG, WEBP, or GIF image.");
      return;
    }

    if (image.size > 5 * 1024 * 1024) {
      setProfileImageUploadFailed(true);
      setProfileImageUploadMessage("Profile images must be 5 MB or smaller.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setProfileImageUploadFailed(true);
      setProfileImageUploadMessage("Please sign in again to change your profile image.");
      return;
    }

    const imageData = new FormData();
    imageData.append("profileImage", image);
    setProfileImageUploadFailed(false);
    setProfileImageUploadMessage("Uploading profile image...");
    setIsUploadingProfileImage(true);

    try {
      const response = await axios.put(
        "http://localhost:8000/api/users/profile-image",
        imageData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.data?.success || !response.data.user?.profileImage) {
        throw new Error(response.data?.message || "The server did not return the updated profile image.");
      }
      updateUser(response.data.user);
      setProfileImageUploadFailed(false);
      setProfileImageUploadMessage("");
      void Swal.fire({
        icon: "success",
        title: "Profile image updated!",
        text: "Your new profile photo is ready.",
        position: "center",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        backdrop: "rgba(0, 0, 0, 0.35)",
        customClass: {
          popup: "profile-image-success-popup",
          timerProgressBar: "profile-image-success-progress",
        },
        showClass: {
          popup: "profile-image-success-show",
        },
        hideClass: {
          popup: "profile-image-success-hide",
        },
      });
    } catch (error) {
      console.error("Profile image upload failed:", error);
      setProfileImageUploadFailed(true);
      setProfileImageUploadMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile image. Please try again."
      );
    } finally {
      setIsUploadingProfileImage(false);
    }
  };

  const openProfileImagePicker = () => {
    setProfileImageUploadMessage("");
    profileImageInputRef.current?.click();
  };

  return (
    <>
      <header className="bg-[#f6ede0] border-b border-[#e3d3c2] sticky top-0 z-50">
        <input
          ref={profileImageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleProfileImageUpload}
          className="hidden"
          aria-label="Choose a new profile image"
        />
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-4 w-full lg:w-auto justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMenu}
                  className="lg:hidden text-2xl text-[#6b5a49] hover:text-[#c8a279] transition-colors duration-300"
                >
                  <FaBars />
                </button>

                <Link to="/" className="flex items-center gap-3 group">
                  <div className="bg-[#c8a279] text-white font-bold text-2xl px-3 py-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                    E
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-2xl font-bold text-[#4d3d2f] group-hover:text-[#c8a279] transition-colors duration-300">
                      Electro
                    </h1>
                    <p className="text-xs text-[#8c7661]">Online Shopping Store</p>
                  </div>
                </Link>
              </div>

              {/* Mobile Icons - With proper spacing */}
              <div className="flex items-center gap-4 lg:hidden">
                <Link
                  to="/compare"
                  aria-label={`Compare${compareItems.length ? ` (${compareItems.length})` : ""}`}
                  className="relative text-[#6b5a49] transition-colors duration-300 hover:text-[#c8a279]"
                >
                  <FaExchangeAlt size={20} />
                  {compareItems.length > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c79c72] px-1 text-[10px] text-white">{compareItems.length}</span>}
                </Link>
                <Link
                  to="/wishlist"
                  className="relative text-[#6b5a49] hover:text-[#c8a279] transition-colors duration-300"
                >
                  <FaHeart size={20} />
                  {wishlistNotificationCount > 0 && <span className="absolute -top-2 -right-2 bg-[#b86f5c] text-white rounded-full min-w-5 h-5 px-1 text-[10px] flex items-center justify-center">{wishlistNotificationCount}</span>}
                </Link>
                <Link
                  to="/cart"
                  className="relative text-[#6b5a49] hover:text-[#c8a279] transition-colors duration-300"
                >
                  <FaShoppingCart size={22} />
                  {cartNotificationCount > 0 && <span className="absolute -top-2 -right-2 bg-[#c79c72] text-white rounded-full h-5 w-5 text-[10px] flex items-center justify-center">{cartNotificationCount}</span>}
                </Link>
                <div className="relative" ref={mobileDropdownRef}>
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    aria-label={isLoggedIn ? "Open profile menu" : "Open account options"}
                    aria-expanded={isDropdownOpen}
                    className="text-[#6b5a49] hover:text-[#c8a279]"
                  >
                    {isLoggedIn ? (
                      user?.profileImage ? (
                        <img src={user.profileImage} alt="" className="h-6 w-6 rounded-full object-cover" />
                      ) : <FaUserCircle size={23} />
                    ) : <FaEllipsisV size={20} />}
                  </button>
                  <div
                    className={`absolute right-0 top-full z-50 mt-3 w-56 border border-[#e3d3c2] bg-white shadow-xl transition duration-200 ${
                      isDropdownOpen
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="p-2">
                      {isLoggedIn ? <>
                          <div className="border-b border-[#e3d3c2] px-3 py-2">
                            <div className="flex items-center gap-2">
                              {user?.profileImage && (
                                <img src={user.profileImage} alt="" className="h-9 w-9 rounded-full object-cover" />
                              )}
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#4d3d2f]">
                                  {user?.fullName || "My account"}
                                </p>
                                <p className="truncate text-xs text-[#8c7661]">
                                  {user?.email}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={isUploadingProfileImage}
                            onClick={openProfileImagePicker}
                            className="block w-full rounded px-3 py-2.5 text-left text-sm text-[#4d3d2f] hover:bg-[#f6ede0] disabled:opacity-60"
                          >
                            {isUploadingProfileImage ? "Uploading image..." : "Change profile image"}
                          </button>
                          {profileImageUploadMessage && (
                            <p
                              role={profileImageUploadFailed ? "alert" : "status"}
                              className={`px-3 py-2 text-xs ${profileImageUploadFailed ? "text-red-600" : "text-[#6b5a49]"}`}
                            >
                              {profileImageUploadMessage}
                            </p>
                          )}
                          <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block rounded px-3 py-2.5 text-sm text-[#4d3d2f] hover:bg-[#f6ede0]">My Profile</Link>
                          <Link to="/orders" onClick={() => setIsDropdownOpen(false)} className="block rounded px-3 py-2.5 text-sm text-[#4d3d2f] hover:bg-[#f6ede0]">My Orders</Link>
                          <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="block rounded px-3 py-2.5 text-sm text-[#4d3d2f] hover:bg-[#f6ede0]">Settings</Link>
                          <button type="button" onClick={handleLogout} className="w-full border-t border-[#e3d3c2] px-3 py-2.5 text-left text-sm text-red-600">Log out</button>
                      </> : <>
                        <button type="button" onClick={() => navigate("/login")} className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-[#4d3d2f] hover:bg-[#f6ede0]">
                          <FaSignInAlt className="text-[#c8a279]" /> Sign in
                        </button>
                        <button type="button" onClick={() => navigate("/register")} className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-[#4d3d2f] hover:bg-[#f6ede0]">
                          <FaUserPlus className="text-[#c8a279]" /> Create account
                        </button>
                      </>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:max-w-3xl">
              <SearchBar />
            </div>

            <div className="hidden lg:flex items-center gap-6">
              <Link
                to="/compare"
                aria-label={`Compare${compareItems.length ? ` (${compareItems.length})` : ""}`}
                className="relative flex flex-col items-center text-[#6b5a49] transition-all duration-300 hover:scale-105 hover:text-[#c8a279]"
              >
                <FaExchangeAlt size={20} />
                {compareItems.length > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c79c72] px-1 text-xs text-white">{compareItems.length}</span>}
                <span className="text-xs mt-1">Compare</span>
              </Link>

              <Link
                to="/wishlist"
                className="relative flex flex-col items-center text-[#6b5a49] hover:text-[#c8a279] transition-all duration-300 hover:scale-105"
              >
                <FaHeart size={20} />
                {wishlistNotificationCount > 0 && <span className="absolute -top-2 -right-2 bg-[#b86f5c] text-white rounded-full min-w-5 h-5 px-1 text-xs flex items-center justify-center">{wishlistNotificationCount}</span>}
                <span className="text-xs mt-1">Wishlist</span>
              </Link>

              <Link
                to="/cart"
                className="relative flex flex-col items-center text-[#6b5a49] hover:text-[#c8a279] transition-all duration-300 hover:scale-105"
              >
                <FaShoppingCart size={22} />
                {cartNotificationCount > 0 && <span className="absolute -top-2 -right-2 bg-[#c79c72] text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">{cartNotificationCount}</span>}
                <span className="text-xs mt-1">Cart</span>
              </Link>

              {/* Account Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={toggleDropdown}
                  aria-label={isLoggedIn ? "Open profile menu" : "Open account options"}
                  aria-expanded={isDropdownOpen}
                  className="flex flex-col items-center text-[#6b5a49] hover:text-[#c8a279] transition-all duration-300 hover:scale-105 group"
                >
                  <div className="relative">
                    {isLoggedIn ? (
                      user?.profileImage ? (
                        <img src={user.profileImage} alt="" className="h-5 w-5 rounded-full object-cover" />
                      ) : <FaUserCircle size={20} />
                    ) : <FaEllipsisV size={18} />}
                    {isLoggedIn && <FaChevronDown 
                      className={`absolute -bottom-1 -right-3 text-[8px] transition-transform duration-300 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />}
                  </div>
                  <span className="text-xs mt-1">{isLoggedIn ? "Account" : "More"}</span>
                </button>

                {/* Dropdown Menu */}
                <div 
                  className={`
                    absolute right-0 mt-3 w-56 
                    bg-white rounded-2xl shadow-2xl 
                    border border-[#e3d3c2]
                    transform transition-all duration-500 ease-out origin-top-right
                    ${isDropdownOpen 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
                    }
                  `}
                >
                  <div className="p-2">
                    {isLoggedIn ? <>
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-[#e3d3c2] mb-2">
                          <div className="flex items-center gap-2">
                            {user?.profileImage && (
                              <img src={user.profileImage} alt="" className="h-9 w-9 rounded-full object-cover" />
                            )}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#4d3d2f]">{user?.fullName || "My account"}</p>
                              <p className="truncate text-xs text-[#8c7661]">{user?.email}</p>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isUploadingProfileImage}
                          onClick={openProfileImagePicker}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm text-[#4d3d2f] hover:bg-[#f6ede0] disabled:opacity-60"
                        >
                          <FaUserCircle className="text-[#c8a279]" />
                          <span>{isUploadingProfileImage ? "Uploading image..." : "Change profile image"}</span>
                        </button>
                        {profileImageUploadMessage && (
                          <p
                            role={profileImageUploadFailed ? "alert" : "status"}
                            className={`px-4 py-2 text-xs ${profileImageUploadFailed ? "text-red-600" : "text-[#6b5a49]"}`}
                          >
                            {profileImageUploadMessage}
                          </p>
                        )}

                        {/* Menu Items */}
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4d3d2f] hover:bg-[#f6ede0] hover:text-[#c8a279] rounded-xl transition-all duration-300 group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaUserCircle className="text-[#c8a279] group-hover:scale-110 transition-transform duration-300" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4d3d2f] hover:bg-[#f6ede0] hover:text-[#c8a279] rounded-xl transition-all duration-300 group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaShoppingCart className="text-[#c8a279]" />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4d3d2f] hover:bg-[#f6ede0] hover:text-[#c8a279] rounded-xl transition-all duration-300 group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaCog className="text-[#c8a279] group-hover:scale-110 transition-transform duration-300" />
                          <span>Settings</span>
                        </Link>

                        <div className="border-t border-[#e3d3c2] mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group"
                          >
                            <FaSignOutAlt className="group-hover:scale-110 transition-transform duration-300" />
                            <span>Log out</span>
                          </button>
                        </div>
                    </> : <>
                      <button type="button" onClick={() => navigate("/login")} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#4d3d2f] hover:bg-[#f6ede0]">
                        <FaSignInAlt className="text-[#c8a279]" /> Sign in
                      </button>
                      <button type="button" onClick={() => navigate("/register")} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#4d3d2f] hover:bg-[#f6ede0]">
                        <FaUserPlus className="text-[#c8a279]" /> Create account
                      </button>
                    </>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

    </>
  );
};

export default MainNavbar;
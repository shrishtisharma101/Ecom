import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaPhoneAlt } from "react-icons/fa";
import { navLinks } from "./navbarData";
import { useAuth } from "../../context/AuthContext";

const pageDropdown = [
  { title: "My Orders", path: "/orders" },
  { title: "Wishlist", path: "/wishlist" },
];

const BottomNavbar = () => {
  const { isLoggedIn } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobilePopupRef = useRef(null);
  const mobileButtonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        !mobileDropdownRef.current?.contains(event.target) &&
        !mobilePopupRef.current?.contains(event.target)
      ) {
        setIsMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileDropdown = (e) => {
    e.stopPropagation();
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  // Get button position for mobile dropdown
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const handleMobileButtonClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 2,
      left: rect.left + window.scrollX - 30, // Increased from -10 to -30
    });
    toggleMobileDropdown(e);
  };

  return (
    <nav className="bg-[#f6ede0] border-y border-[#e3d3c2] text-[#5d4b3d]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-2">

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* All Categories Button */}
            <Link
              to="/shop"
              className="flex items-center gap-2 bg-[#c8a279] hover:bg-[#b58b61] px-5 py-3 rounded-full font-semibold transition text-white shadow-md hover:shadow-lg hover:scale-105 duration-300 whitespace-nowrap"
            >
              <span>All Categories</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 ml-4">
              {navLinks.map((item) => (
                <div 
                  key={item.id} 
                  className={item.title === "Pages" ? "relative" : undefined}
                  ref={item.title === "Pages" ? dropdownRef : null}
                >
                  {item.title === "Pages" ? (
                    <>
                      <button
                        onClick={toggleDropdown}
                        className="flex items-center gap-1 text-[#5d4b3d] font-medium hover:text-[#c8a279] transition-all duration-300 px-3 py-2 rounded-full hover:bg-[#f5ede6] group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {item.title}
                        </span>
                        <FaChevronDown className={`text-xs transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className={`
                        absolute left-0 top-full mt-1 z-50
                        min-w-[220px] rounded-2xl border border-[#e3d3c2]
                        bg-white shadow-2xl p-2
                        transition-all duration-300 ease-out origin-top-left
                        ${isDropdownOpen 
                          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                        }
                      `}>
                        <div className="space-y-0.5">
                          {pageDropdown.map((page) => (
                            <Link
                              key={page.title}
                              to={page.path}
                              onClick={() => setIsDropdownOpen(false)}
                              className="block rounded-xl px-4 py-2.5 text-sm text-[#5d4b3d] hover:bg-[#f6ede0] hover:text-[#c8a279] transition-all duration-300 hover:translate-x-2 hover:font-semibold"
                            >
                              {page.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="text-[#5d4b3d] font-medium hover:text-[#c8a279] transition-all duration-300 px-3 py-2 rounded-full hover:bg-[#f5ede6] hover:translate-y-[-1px] inline-block"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Contact */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            {!isLoggedIn && <div className="hidden md:flex items-center gap-3 rounded-full bg-[#f5ede6] px-4 py-3 border border-[#e3d3c2] hover:border-[#c8a279] transition-all duration-300 hover:shadow-md">
              <FaPhoneAlt className="text-[#c8a279]" />
              <div>
                <p className="text-xs text-[#8c7661]">24/7 Support</p>
                <span className="font-semibold text-[#5d4b3d]">+0123 456 7890</span>
              </div>
            </div>}
          </div>

        </div>

        {/* Mobile Navigation - Single Line with Scroll */}
        <div className="lg:hidden py-3 relative">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {navLinks.map((item) => {
              if (item.title === "Pages") {
                return (
                  <div key={item.id} className="relative flex-shrink-0" ref={mobileDropdownRef}>
                    <button
                      onClick={handleMobileButtonClick}
                      ref={mobileButtonRef}
                      className="flex items-center gap-1 whitespace-nowrap text-sm text-[#5d4b3d] font-medium px-4 py-2 rounded-full bg-[#f5ede6] hover:bg-[#c8a279] hover:text-white transition-all duration-300 border border-[#e3d3c2] hover:border-[#c8a279]"
                    >
                      <span>{item.title}</span>
                      <FaChevronDown className={`text-xs transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                );
              }
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className="whitespace-nowrap text-sm text-[#5d4b3d] font-medium px-4 py-2 rounded-full bg-[#f5ede6] hover:bg-[#c8a279] hover:text-white transition-all duration-300 border border-[#e3d3c2] hover:border-[#c8a279] flex-shrink-0"
                >
                  {item.title}
                </Link>
              );
            })}
          </div>

          {/* Mobile Dropdown - Fixed Position aligned with button */}
          {isMobileDropdownOpen && (
            <div 
              ref={mobilePopupRef}
              className="fixed z-[99999] min-w-[180px] rounded-2xl border border-[#e3d3c2] bg-white shadow-2xl p-2"
              style={{
                top: dropdownPosition.top + 0,
                left: dropdownPosition.left,
              }}
            >
              <div className="space-y-0.5">
                {pageDropdown.map((page) => (
                  <Link
                    key={page.title}
                    to={page.path}
                    onClick={() => setIsMobileDropdownOpen(false)}
                    className="block rounded-xl px-4 py-2 text-sm text-[#5d4b3d] hover:bg-[#f6ede0] hover:text-[#c8a279] transition-all duration-300 hover:translate-x-2 hover:font-semibold"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
};

export default BottomNavbar;

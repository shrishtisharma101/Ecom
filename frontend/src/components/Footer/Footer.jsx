import { useEffect, useRef, useState } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaGlobe,
  FaChevronRight,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#ede0d5] mt-20 border-t border-[#e7d8c7] overflow-hidden">
      {/* TOP CONTACT BOX */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-14">
        <div
          className="
          bg-white
          rounded-2xl
          shadow-sm
          border
          border-[#eadfd1]
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          overflow-hidden
          "
        >
          {/* Address */}
          <div 
            className={`
              flex items-center gap-3 sm:gap-4 lg:gap-5 p-5 sm:p-6 lg:p-8 
              border-b sm:border-b-0 sm:border-r border-[#f1e5d8] group
              transition-all duration-700 ease-out
              hover:bg-[#f5ede6] cursor-pointer
              ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
            `}
            style={{ transitionDelay: '0.1s' }}
          >
            <div
              className="
              w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16
              min-w-[48px] sm:min-w-[56px] lg:min-w-[64px]
              flex-shrink-0
              rounded-full
              bg-[#c58d5d]
              text-white
              flex
              items-center
              justify-center
              text-lg sm:text-xl lg:text-2xl
              transition-all
              duration-500
              group-hover:scale-110
              group-hover:rotate-12
              group-hover:shadow-lg
              "
            >
              <FaMapMarkerAlt />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#2f2f2f] leading-tight transition-all duration-300 group-hover:text-[#c58d5d] group-hover:translate-x-1">
                Address
              </h3>
              <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base truncate transition-all duration-300 group-hover:text-[#c58d5d] group-hover:translate-x-1">
                Noida Sec 90
              </p>
            </div>
          </div>

          {/* Mail */}
          <div 
            className={`
              flex items-center gap-3 sm:gap-4 lg:gap-5 p-5 sm:p-6 lg:p-8 
              border-b sm:border-b-0 sm:border-r border-[#f1e5d8] group
              transition-all duration-700 ease-out
              hover:bg-[#f5ede6] cursor-pointer
              ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
            `}
            style={{ transitionDelay: '0.2s' }}
          >
            <div
              className="
              w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16
              min-w-[48px] sm:min-w-[56px] lg:min-w-[64px]
              flex-shrink-0
              rounded-full
              bg-[#c58d5d]
              text-white
              flex
              items-center
              justify-center
              text-lg sm:text-xl lg:text-2xl
              transition-all
              duration-500
              group-hover:scale-110
              group-hover:rotate-12
              group-hover:shadow-lg
              "
            >
              <FaEnvelope />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#2f2f2f] leading-tight transition-all duration-300 group-hover:text-[#c58d5d] group-hover:translate-x-1">
                Mail Us
              </h3>
              <p className="text-gray-500 mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base truncate transition-all duration-300 group-hover:text-[#c58d5d] group-hover:translate-x-1">
                shrishtishrma03@gmail.com
              </p>
            </div>
          </div>

          {/* Phone */}
          <div 
            className={`
              flex items-center gap-3 sm:gap-4 lg:gap-5 p-5 sm:p-6 lg:p-8 
              border-b sm:border-b-0 lg:border-r border-[#f1e5d8] group
              transition-all duration-700 ease-out
              hover:bg-[#f5ede6] cursor-pointer
              ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
            `}
            style={{ transitionDelay: '0.3s' }}
          >
            <div
              className="
              w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16
              min-w-[48px] sm:min-w-[56px] lg:min-w-[64px]
              flex-shrink-0
              rounded-full
              bg-[#c58d5d]
              text-white
              flex
              items-center
              justify-center
              text-lg sm:text-xl lg:text-2xl
              transition-all
              duration-500
              group-hover:scale-110
              group-hover:rotate-12
              group-hover:shadow-lg
              "
            >
              <FaPhoneAlt />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#2f2f2f] leading-tight transition-all duration-300 group-hover:text-[#c58d5d] group-hover:translate-x-1">
                Telephone
              </h3>
              <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base truncate transition-all duration-300 group-hover:text-[#c58d5d] group-hover:translate-x-1">
                +91 9569161364
              </p>
            </div>
          </div>

          {/* Website */}
          <div 
            className={`
              flex items-center gap-3 sm:gap-4 lg:gap-5 p-5 sm:p-6 lg:p-8 group
              transition-all duration-700 ease-out
              hover:bg-[#f5ede6] cursor-pointer
              ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
            `}
            style={{ transitionDelay: '0.4s' }}
          >
            <div
              className="
              w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16
              min-w-[48px] sm:min-w-[56px] lg:min-w-[64px]
              flex-shrink-0
              rounded-full
              bg-[#c58d5d]
              text-white
              flex
              items-center
              justify-center
              text-lg sm:text-xl lg:text-2xl
              transition-all
              duration-500
              group-hover:scale-110
              group-hover:rotate-12
              group-hover:shadow-lg
              "
            >
              <FaGlobe />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#2f2f2f] leading-tight transition-all duration-300 group-hover:text-[#c58d5d] group-hover:translate-x-1">
                Website
              </h3>
              <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base truncate transition-all duration-300 group-hover:text-[#c58d5d] group-hover:translate-x-1">
                www.electro.com
              </p>
            </div>
          </div>
        </div>

        {/* MAIN FOOTER START */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mt-12 sm:mt-14 lg:mt-16">
          {/* NEWSLETTER */}
          <div 
            className={`
              transition-all duration-700 ease-out
              ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
            `}
            style={{ transitionDelay: '0.5s' }}
          >
            <h3 className="text-[20px] sm:text-[24px] lg:text-[30px] font-bold text-[#c58d5d] mb-4 sm:mb-6 lg:mb-7 relative inline-block overflow-hidden group">
              Newsletter
              <span className={`
                absolute -bottom-2 left-0 h-0.5 bg-[#c58d5d] rounded-full
                transition-all duration-1000 ease-out
                ${isVisible ? 'w-full' : 'w-0'}
                group-hover:w-full
              `}></span>
            </h3>
            <p className="text-gray-600 leading-7 sm:leading-8 lg:leading-9 text-[14px] sm:text-[15px] lg:text-[17px] mt-3 sm:mt-4 transition-all duration-300 hover:text-[#c58d5d] hover:translate-x-1">
              Subscribe to our newsletter and get the latest updates on
              new arrivals, exclusive offers and special discounts.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:mt-6 lg:mt-8">
              <input
                type="email"
                placeholder="Enter your email"
                className="
                w-full
                h-12 sm:h-[54px]
                rounded-full
                border
                border-[#d8c6b2]
                bg-white
                px-4 sm:px-5
                outline-none
                focus:border-[#c58d5d]
                duration-300
                text-sm sm:text-base
                placeholder-gray-400
                transition-all
                hover:border-[#c58d5d]
                hover:shadow-md
                "
              />
              <button
                className="
                w-full
                h-11 sm:h-[48px]
                bg-[#c58d5d]
                text-white
                rounded-full
                cursor-pointer
                font-semibold
                hover:bg-[#b07a4b]
                hover:scale-105
                hover:shadow-lg
                duration-300
                text-sm
                whitespace-nowrap
                transition-all
                "
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* CUSTOMER SERVICE */}
          <div 
            className={`
              transition-all duration-700 ease-out
              ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
            `}
            style={{ transitionDelay: '0.6s' }}
          >
            <h3 className="text-[20px] sm:text-[24px] lg:text-[30px] font-bold text-[#c58d5d] mb-4 sm:mb-6 lg:mb-7 relative inline-block overflow-hidden group">
              Customer Service
              <span className={`
                absolute -bottom-2 left-0 h-0.5 bg-[#c58d5d] rounded-full
                transition-all duration-1000 ease-out
                ${isVisible ? 'w-full' : 'w-0'}
                group-hover:w-full
              `}></span>
            </h3>
            <ul className="space-y-2 sm:space-y-3 lg:space-y-5 mt-3 sm:mt-4">
              {[
                "Contact Us",
                "Returns",
                "Order History",
                "Site Map",
                "Testimonials",
                "My Account",
                "Unsubscribe Notification",
              ].map((item, index) => (
                <li
                  key={item}
                  className={`
                    flex items-center gap-2 sm:gap-3
                    text-gray-600
                    cursor-pointer
                    text-xs sm:text-sm lg:text-base
                    transition-all duration-300
                    group/list-item
                    ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}
                  `}
                  style={{ transitionDelay: `${0.7 + index * 0.05}s` }}
                >
                  <FaChevronRight className="text-[10px] sm:text-xs lg:text-sm transition-all duration-300 group-hover/list-item:text-[#c58d5d] group-hover/list-item:translate-x-1" />
                  <span className="transition-all duration-300 hover:text-[#c58d5d] hover:translate-x-2 hover:font-semibold">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* INFORMATION */}
          <div 
            className={`
              transition-all duration-700 ease-out
              ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
            `}
            style={{ transitionDelay: '0.7s' }}
          >
            <h3 className="text-[20px] sm:text-[24px] lg:text-[30px] font-bold text-[#c58d5d] mb-4 sm:mb-6 lg:mb-7 relative inline-block overflow-hidden group">
              Information
              <span className={`
                absolute -bottom-2 left-0 h-0.5 bg-[#c58d5d] rounded-full
                transition-all duration-1000 ease-out
                ${isVisible ? 'w-full' : 'w-0'}
                group-hover:w-full
              `}></span>
            </h3>
            <ul className="space-y-2 sm:space-y-3 lg:space-y-5 mt-3 sm:mt-4">
              {[
                "About Us",
                "Delivery Information",
                "Privacy Policy",
                "Terms & Conditions",
                "Warranty",
                "FAQ",
                "Seller Login",
              ].map((item, index) => (
                <li
                  key={item}
                  className={`
                    flex items-center gap-2 sm:gap-3
                    text-gray-600
                    cursor-pointer
                    text-xs sm:text-sm lg:text-base
                    transition-all duration-300
                    group/list-item
                    ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}
                  `}
                  style={{ transitionDelay: `${0.8 + index * 0.05}s` }}
                >
                  <FaChevronRight className="text-[10px] sm:text-xs lg:text-sm transition-all duration-300 group-hover/list-item:text-[#c58d5d] group-hover/list-item:translate-x-1" />
                  <span className="transition-all duration-300 hover:text-[#c58d5d] hover:translate-x-2 hover:font-semibold">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* EXTRAS */}
          <div 
            className={`
              transition-all duration-700 ease-out
              ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
            `}
            style={{ transitionDelay: '0.8s' }}
          >
            <h3 className="text-[20px] sm:text-[24px] lg:text-[30px] font-bold text-[#c58d5d] mb-4 sm:mb-6 lg:mb-7 relative inline-block overflow-hidden group">
              Extras
              <span className={`
                absolute -bottom-2 left-0 h-0.5 bg-[#c58d5d] rounded-full
                transition-all duration-1000 ease-out
                ${isVisible ? 'w-full' : 'w-0'}
                group-hover:w-full
              `}></span>
            </h3>
            <ul className="space-y-2 sm:space-y-3 lg:space-y-5 mt-3 sm:mt-4">
              {[
                "Brands",
                "Gift Vouchers",
                "Affiliates",
                "Wishlist",
                "Order History",
                "Track Your Order",
                "Special Offers",
              ].map((item, index) => (
                <li
                  key={item}
                  className={`
                    flex items-center gap-2 sm:gap-3
                    text-gray-600
                    cursor-pointer
                    text-xs sm:text-sm lg:text-base
                    transition-all duration-300
                    group/list-item
                    ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}
                  `}
                  style={{ transitionDelay: `${0.9 + index * 0.05}s` }}
                >
                  <FaChevronRight className="text-[10px] sm:text-xs lg:text-sm transition-all duration-300 group-hover/list-item:text-[#c58d5d] group-hover/list-item:translate-x-1" />
                  <span className="transition-all duration-300 hover:text-[#c58d5d] hover:translate-x-2 hover:font-semibold">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div
        className="
        max-w-[1400px]
        mx-auto
        px-4 sm:px-6 lg:px-8
        mt-10 sm:mt-12 lg:mt-16
        border-t
        border-[#d5c4b3]
        py-5 sm:py-6 lg:py-8
        flex
        flex-col
        sm:flex-row
        items-center
        justify-between
        gap-3 sm:gap-4 lg:gap-6
        "
      >
        {/* Copyright */}
        <p className={`
          text-gray-600 text-xs sm:text-sm lg:text-[17px] text-center sm:text-left
          transition-all duration-700 ease-out
          hover:text-[#c58d5d] hover:translate-x-2
          ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
        `}
        style={{ transitionDelay: '1s' }}>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-[#c58d5d] hover:text-[#b07a4b] transition-all duration-300">
            Electro
          </span>
          . All Rights Reserved.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {[
            { icon: FaFacebookF, label: 'Facebook', color: '#1877f2' },
            { icon: FaTwitter, label: 'Twitter', color: '#1da1f2' },
            { icon: FaInstagram, label: 'Instagram', color: '#e4405f' },
            { icon: FaYoutube, label: 'Youtube', color: '#ff0000' }
          ].map((social, index) => (
            <a
              key={index}
              href="#"
              aria-label={social.label}
              className={`
                w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12
                rounded-full
                bg-white
                border
                border-[#d5c4b3]
                flex
                items-center
                justify-center
                text-[#c58d5d]
                hover:bg-[#c58d5d]
                hover:text-white
                hover:scale-110
               
                hover:shadow-xl
                duration-300
                text-xs sm:text-sm lg:text-base
                transition-all
                group/social
                ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-50'}
              `}
              style={{ transitionDelay: `${1.1 + index * 0.1}s` }}
            >
              <social.icon className="transition-all duration-300 group-hover/social:scale-110" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
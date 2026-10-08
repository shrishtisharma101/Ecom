import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../context/useShop";
import {
  FaShoppingCart,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import WishlistButton from "../WishlistButton/WishlistButton";
import CompareButton from "../CompareButton/CompareButton";
import { formatPriceINR } from "../../utils/currency";

// ========= IMPORT IMAGES =========
import product1 from "../../assets/images/carousel-1.png";
import product2 from "../../assets/images/carousel-2.png";
import product3 from ".././../assets/images/cam1.png";
import product4 from ".././../assets/images/watch2.png";
import product5 from ".././../assets/images/cam1.png";
import product6 from ".././../assets/images/watch2.png";
import product7 from ".././../assets/images/cam1.png";
import product8 from ".././../assets/images/watch2.png";

const Products = () => {
  const navigate = useNavigate();
  const { addToCart, isLoggedIn } = useShop();
  const sectionRef = useRef(null);
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("All Products");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Check screen size for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const products = [
    {
      id: 1,
      title: "Apple iPad Mini G2356",
      image: product1,
      category: "new",
      badge: "New",
      oldPrice: "$1,250.00",
      price: "$1,050.00",
      rating: 4,
    },
    {
      id: 2,
      title: "Canon DSLR Camera",
      image: product2,
      category: "sale",
      badge: "Sale",
      oldPrice: "$999.00",
      price: "$799.00",
      rating: 5,
    },
    {
      id: 3,
      title: "Camera Lens",
      image: product3,
      category: "featured",
      badge: "",
      oldPrice: "$650.00",
      price: "$499.00",
      rating: 5,
    },
    {
      id: 4,
      title: "Wireless Earbuds",
      image: product4,
      category: "new",
      badge: "New",
      oldPrice: "$220.00",
      price: "$180.00",
      rating: 4,
    },
    {
      id: 5,
      title: "Vintage Camera",
      image: product5,
      category: "sale",
      badge: "Sale",
      oldPrice: "$450.00",
      price: "$340.00",
      rating: 5,
    },
    {
      id: 6,
      title: "Wireless Headphones",
      image: product6,
      category: "top",
      badge: "",
      oldPrice: "$280.00",
      price: "$230.00",
      rating: 4,
    },
    {
      id: 7,
      title: "Wireless Headphones",
      image: product7,
      category: "sale",
      badge: "Sale",
      oldPrice: "$280.00",
      price: "$230.00",
      rating: 4,
    },
    {
      id: 8,
      title: "Wireless Headphones",
      image: product8,
      category: "top",
      badge: "",
      oldPrice: "$280.00",
      price: "$230.00",
      rating: 4,
    },
  ];

  const tabs = [
    "All Products",
    "New Arrivals",
    "Featured",
    "Top Selling",
  ];

  const filteredProducts =
    activeTab === "All Products"
      ? products
      : products.filter((item) => {
          if (activeTab === "New Arrivals")
            return item.category === "new";
          if (activeTab === "Featured")
            return item.category === "featured";
          if (activeTab === "Top Selling")
            return (
              item.category === "sale" ||
              item.category === "top"
            );
          return true;
        });

  return (
    <section
      ref={sectionRef}
      className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-10 lg:mb-14">
        <div
          className={`text-[40px] sm:text-[50px] lg:text-[60px] font-black text-[#2f2f2f] leading-none text-center lg:text-left
          ${show ? "animate-left" : "opacity-0"}`}
        >
          Our <span className="text-[#c58d5d]">Products</span>
        </div>

        {/* Tabs - Responsive */}
        <div
          className={`flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mt-6 lg:mt-0
          ${show ? "animate-right" : "opacity-0"}`}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-3 sm:px-5 lg:px-6
                py-2 sm:py-2.5 lg:py-3
                rounded-full
                text-xs sm:text-sm lg:text-base
                font-semibold
                transition-all
                duration-300
                whitespace-nowrap
                ${activeTab === tab
                  ? "bg-[#c58d5d] text-white shadow-lg scale-105"
                  : "bg-[#f7f3ee] text-gray-700 hover:bg-[#eadfd1]"
                }
              `}
            >
              {isMobile && tab === "All Products" ? "All" : 
               isMobile && tab === "New Arrivals" ? "New" :
               isMobile && tab === "Top Selling" ? "Top" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* GRID START - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {filteredProducts.map((item, index) => (
          <div
            key={item.id}
            className={`
              group
              relative
              overflow-hidden
              rounded-2xl
              bg-white
              p-4 sm:p-5 lg:p-6
              transition-all
              duration-500
              hover:scale-[1.02] sm:hover:scale-105
              hover:shadow-2xl
              ${show
                ? index < 4
                  ? "card-left"
                  : "card-right"
                : "opacity-0"
              }
            `}
            style={{
              animationDelay:
                index < 4
                  ? `${index * 0.2}s`
                  : `${(index - 4) * 0.2}s`,
            }}
          >
            {/* Badge - Responsive */}
            {item.badge && (
              <span
                className={`
                  absolute
                  top-3 sm:top-4 lg:top-5
                  left-3 sm:left-4 lg:left-5
                  px-2 sm:px-3 lg:px-4
                  py-1 sm:py-1.5 lg:py-2
                  rounded-full
                  text-white
                  text-[10px] sm:text-xs lg:text-sm
                  font-semibold
                  ${item.badge === "Sale"
                    ? "bg-red-500"
                    : "bg-[#c58d5d]"
                  }
                `}
              >
                {item.badge}
              </span>
            )}

            {/* Wishlist & Compare - Responsive */}
            <div
              className={`
                absolute
                top-3 sm:top-4 lg:top-5
                right-3 sm:right-4 lg:right-5
                flex
                flex-col
                gap-2 sm:gap-2.5 lg:gap-3
                ${isMobile ? 'opacity-100 translate-x-0' : 
                  'opacity-0 translate-x-8 group-hover:opacity-100 group-hover:translate-x-0'}
                duration-500
              `}
            >
              <WishlistButton
                product={item}
                className="
                  w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10
                  rounded-full
                  bg-[#f7f3ee]
                  flex
                  items-center
                  justify-center
                  hover:bg-[#c58d5d]
                  hover:text-white
                  transition
                  text-sm sm:text-base
                "
              />
              <CompareButton
                product={item}
                className="
                  w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10
                  rounded-full
                  bg-[#f7f3ee]
                  flex
                  items-center
                  justify-center
                  hover:bg-[#c58d5d]
                  hover:text-white
                  transition
                  text-sm sm:text-base
                "
              />
            </div>

            {/* Product Image - Responsive */}
            <div className="flex justify-center items-center h-[160px] sm:h-[200px] lg:h-[220px]">
              <img
                src={item.image}
                alt={item.title}
                className="
                  w-[130px] sm:w-[160px] lg:w-[190px]
                  object-contain
                  transition-all
                  duration-500
                  group-hover:scale-110
                "
                loading="lazy"
              />
            </div>

            {/* Rating - Responsive */}
            <div className="flex justify-center items-center gap-0.5 sm:gap-1 mt-2 sm:mt-3">
              {[1, 2, 3, 4, 5].map((star) =>
                star <= item.rating ? (
                  <FaStar
                    key={star}
                    className="text-[#f4b400] text-[10px] sm:text-xs lg:text-sm"
                  />
                ) : (
                  <FaRegStar
                    key={star}
                    className="text-gray-300 text-[10px] sm:text-xs lg:text-sm"
                  />
                )
              )}
            </div>

            {/* Product Name - Responsive */}
            <h3
              className="
                text-center
                text-base sm:text-[18px] lg:text-[20px]
                font-normal
                text-[#2f2f2f]
                mt-3 sm:mt-4
                leading-6 sm:leading-7
                px-2
              "
            >
              {isMobile && item.title.length > 20 
                ? item.title.substring(0, 18) + '...' 
                : isTablet && item.title.length > 25
                ? item.title.substring(0, 23) + '...'
                : item.title}
            </h3>

            {/* Price - Responsive */}
            <div
              className="
                flex
                justify-center
                items-center
                gap-2 sm:gap-3
                mt-3 sm:mt-4
                flex-wrap
              "
            >
              <span className="line-through text-gray-400 text-sm sm:text-base">
                {formatPriceINR(item.oldPrice)}
              </span>
              <span className="text-[#c58d5d] font-bold text-lg sm:text-xl">
                {formatPriceINR(item.price)}
              </span>
            </div>

            {/* Add To Cart - Responsive */}
            <button
              onClick={() => {
                if (isLoggedIn) {
                  addToCart(item);
                } else {
                  navigate("/cart", { state: { pendingCartItem: item } });
                }
              }}
              className={`
                mt-5 sm:mt-6 lg:mt-7
                mx-auto
                flex
                items-center
                justify-center
                gap-2 sm:gap-3
                bg-[#c58d5d]
                text-white
                px-4 sm:px-5 lg:px-6
                py-2 sm:py-2.5 lg:py-3
                rounded-full
                text-sm sm:text-base
                font-semibold
                cursor-pointer
                w-full sm:w-auto
                ${isMobile ? 'opacity-100 translate-y-0' : 
                  'opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0'}
                transition-all
                duration-500
                hover:bg-[#b07a4d]
                active:scale-95
              `}
            >
              <FaShoppingCart className="text-sm sm:text-base" />
              <span>{isMobile ? 'Add' : 'Add To Cart'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Animation Keyframes - Add to your global CSS or component */}
      <style>{`
        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes cardLeft {
          from {
            opacity: 0;
            transform: translateX(-80px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes cardRight {
          from {
            opacity: 0;
            transform: translateX(80px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-left {
          animation: slideLeft 0.8s ease forwards;
        }
        
        .animate-right {
          animation: slideRight 0.8s ease forwards;
        }
        
        .card-left {
          animation: cardLeft 0.8s ease forwards;
        }
        
        .card-right {
          animation: cardRight 0.8s ease forwards;
        }
      `}</style>
    </section>
  );
};

export default Products;
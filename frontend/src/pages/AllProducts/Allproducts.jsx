import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../context/useShop";
import {
  FaShoppingCart,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import WishlistButton from "../../components/WishlistButton/WishlistButton";
import CompareButton from "../../components/CompareButton/CompareButton";
import { formatPriceINR } from "../../utils/currency";

// Import Images
import product1 from "../../assets/images/carousel-1.png";
import product2 from "../../assets/images/carousel-2.png";
import product3 from ".././../assets/images/cam1.png";
import product4 from ".././../assets/images/watch2.png";
import product5 from ".././../assets/images/cam1.png";
import product6 from ".././../assets/images/watch2.png";
import product7 from ".././../assets/images/cam1.png";
import product8 from ".././../assets/images/watch2.png";

const AllProducts = () => {
  const navigate = useNavigate();
  const { addToCart, isLoggedIn } = useShop();
  const sectionRef = useRef(null);
  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(4);

  // Responsive slides to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2); // Tablet: 2 cards
      } else {
        setSlidesToShow(4); // Desktop: 4 cards
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const products = [
    {
      id: 1,
      title: "Apple iPad Mini G2356",
      image: product1,
      oldPrice: "$1,250.00",
      price: "$1,050.00",
    },
    {
      id: 2,
      title: "Canon DSLR Camera",
      image: product2,
      oldPrice: "$999.00",
      price: "$799.00",
    },
    {
      id: 3,
      title: "Camera Lens",
      image: product3,
      oldPrice: "$650.00",
      price: "$499.00",
    },
    {
      id: 4,
      title: "Wireless Earbuds",
      image: product4,
      oldPrice: "$220.00",
      price: "$180.00",
    },
    {
      id: 5,
      title: "Vintage Camera",
      image: product5,
      oldPrice: "$450.00",
      price: "$340.00",
    },
    {
      id: 6,
      title: "Wireless Headphones",
      image: product6,
      oldPrice: "$280.00",
      price: "$230.00",
    },
    {
      id: 7,
      title: "Gaming Headset",
      image: product7,
      oldPrice: "$280.00",
      price: "$230.00",
    },
    {
      id: 8,
      title: "Smart Watch Pro",
      image: product8,
      oldPrice: "$280.00",
      price: "$230.00",
    },
  ];

  // Duplicate products for infinite loop
  const extendedProducts = [...products, ...products, ...products];
  const startIndex = products.length;
  const totalSlides = products.length;

  // Auto-slide effect
  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      if (!isHovered && !isTransitioning) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [show, isHovered, isTransitioning]);

  // Reset transition state after animation
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // Handle transition end for infinite loop
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex >= startIndex + totalSlides) {
      setCurrentIndex(startIndex);
    }
    if (currentIndex < startIndex) {
      setCurrentIndex(startIndex + totalSlides - 1);
    }
  };

  // Get visible cards
  const getVisibleProducts = () => {
    const start = currentIndex;
    const end = start + slidesToShow;
    return extendedProducts.slice(start, end);
  };

  const visibleProducts = getVisibleProducts();

  // Calculate card width based on slidesToShow
  const cardWidth = 100 / slidesToShow;

  return (
    <section
      ref={sectionRef}
      className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-5 lg:px-8 py-8 sm:py-12 lg:py-20 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* HEADER - Responsive */}
      <div className="text-center mb-8 sm:mb-10 lg:mb-16">
  <div className="relative inline-block">
    <h2
      className={`text-[28px] sm:text-[40px] md:text-[45px] lg:text-[60px] font-bold text-[#d4a574] leading-none
      ${show ? "animate-fade-down" : "opacity-0"}`}
    >
      Products
    </h2>
    {/* Underline */}
    <div className="absolute -bottom-2 sm:-bottom-3 lg:-bottom-4 left-0 w-full h-1 sm:h-1.5 lg:h-1 bg-[#d4a574] rounded-full"></div>
  </div>
  
<h3
  className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2f2f2f] mt-4 sm:mt-5 lg:mt-6
  ${show ? "animate-fade-up" : "opacity-0"}`}
>
  All <span className="text-[#d4a574]">Product</span> Items
</h3>
</div>

      {/* ARROW BUTTONS - Responsive */}
      <div className="flex justify-end gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <button
          onClick={prevSlide}
          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#c58d5d] hover:bg-[#b07a4d] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Previous"
        >
          <FaArrowLeft className="text-xs sm:text-sm lg:text-base" />
        </button>
        <button
          onClick={nextSlide}
          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#c58d5d] hover:bg-[#b07a4d] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Next"
        >
          <FaArrowRight className="text-xs sm:text-sm lg:text-base" />
        </button>
      </div>

      {/* SLIDER CONTAINER */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex - startIndex) * cardWidth}%)`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedProducts.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex-shrink-0 px-1.5 sm:px-2 lg:px-3"
              style={{ width: `${cardWidth}%` }}
            >
              <div
                className={`
                  group
                  relative
                  bg-white
                  rounded-xl sm:rounded-2xl
                  border border-gray-200
                  p-3 sm:p-4 md:p-5 lg:p-7
                  transition-all
                  duration-300
                  hover:shadow-xl
                  hover:border-[#c58d5d]
                  h-full
                `}
              >
                {/* Wishlist & Compare - Responsive */}
                <div
                  className="
                    absolute
                    top-2 sm:top-3 lg:top-4
                    right-2 sm:right-3 lg:right-4
                    flex
                    flex-col
                    gap-1 sm:gap-1.5 lg:gap-2
                    z-10
                    opacity-100
                    sm:opacity-0
                    sm:group-hover:opacity-100
                    transition-all
                    duration-300
                    translate-x-4
                    group-hover:translate-x-0
                  "
                >
                  <WishlistButton
                    product={item}
                    className="
                      w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8
                      rounded-full
                      bg-white
                      shadow-md
                      flex
                      items-center
                      justify-center
                      hover:bg-[#c58d5d]
                      hover:text-white
                      transition
                      text-[8px] sm:text-[10px] lg:text-xs
                    "
                  />
                  <CompareButton
                    product={item}
                    className="
                      w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8
                      rounded-full
                      bg-white
                      shadow-md
                      flex
                      items-center
                      justify-center
                      hover:bg-[#c58d5d]
                      hover:text-white
                      transition
                      text-[8px] sm:text-[10px] lg:text-xs
                    "
                  />
                </div>

                {/* Product Image - Responsive */}
                <div className="flex justify-center items-center h-[80px] sm:h-[100px] md:h-[120px] lg:h-[160px]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="
                      w-[60px] sm:w-[80px] md:w-[100px] lg:w-[140px]
                      object-contain
                      transition-all
                      duration-500
                      group-hover:scale-110
                    "
                    loading="lazy"
                  />
                </div>

                {/* Category - Responsive */}
                <p className="text-center text-gray-500 text-[10px] sm:text-xs lg:text-sm mt-1 sm:mt-2 font-medium">
                  SmartPhone
                </p>

                {/* Product Name - Responsive */}
                <h3
                  className="
                    text-center
                    text-[10px] sm:text-xs md:text-sm lg:text-lg
                    font-semibold
                    text-[#2f2f2f]
                    mt-0.5 sm:mt-1
                    leading-4 sm:leading-5 lg:leading-6
                  "
                >
                  {item.title.length > 20 ? item.title.substring(0, 18) + '...' : item.title}
                </h3>

                {/* Price - Responsive */}
                <div className="flex justify-center items-center gap-1 sm:gap-2 lg:gap-3 mt-1 sm:mt-2">
                  <span className="line-through text-gray-400 text-[8px] sm:text-xs lg:text-sm">
                    {formatPriceINR(item.oldPrice)}
                  </span>
                  <span className="text-[#c58d5d] font-bold text-[10px] sm:text-sm lg:text-lg">
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
                  className="
                    mt-2 sm:mt-3 lg:mt-4
                    mx-auto
                    flex
                    items-center
                    justify-center
                    gap-1 sm:gap-2
                    bg-[#c58d5d]
                    text-white
                    px-2 sm:px-3 lg:px-5
                    py-1.5 sm:py-2 lg:py-2.5
                    rounded-lg
                    text-[8px] sm:text-xs lg:text-sm
                    font-semibold
                    cursor-pointer
                    w-full
                    transition-all
                    duration-300
                    hover:bg-[#b07a4d]
                    hover:scale-105
                    opacity-0
                    translate-y-3
                    group-hover:opacity-100
                    group-hover:translate-y-0
                  "
                >
                  <FaShoppingCart className="text-[8px] sm:text-xs lg:text-sm" />
                  <span className="hidden sm:inline">Add To Cart</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator - Responsive */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 lg:mt-10">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(startIndex + index);
            }}
            className={`
              w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300
              ${index === (currentIndex - startIndex) % products.length
                ? "bg-[#c58d5d] w-4 sm:w-6" 
                : "bg-gray-300 hover:bg-gray-400"
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-down {
          animation: fadeDown 0.8s ease forwards;
        }
        
        .animate-fade-up {
          animation: fadeUp 0.8s ease forwards;
        }
      `}</style>
    </section>
  );
};

export default AllProducts;
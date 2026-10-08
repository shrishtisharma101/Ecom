import { useEffect, useRef, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { formatINR } from "../../utils/currency";

// Import your images
import cameraImage from "../../assets/images/camrra1.jpg"; // Left side camera image
import saleBgImage from "../../assets/images/header-img.jpg"; // Right side background image

const BannerSection = () => {
  const sectionRef = useRef(null);
  const [show, setShow] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-6 lg:gap-8">
        
        {/* LEFT SECTION - Product Card with Image Background */}
        <div
          className={`
            relative
            rounded-2xl 
            overflow-hidden
            h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]
            transition-all 
            duration-700 
            ease-out
            group
            cursor-pointer
            ${show ? "animate-from-left" : "opacity-0 translate-x-[-100px]"}
          `}
        >
          {/* Background Image */}
          <img
            src={cameraImage}
            alt="Canon EOS Rebel T7i Kit"
            className="absolute w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gray-200/30 transition-all duration-300 "></div>

          {/* Content - Centered */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-6 sm:px-8 lg:px-12">
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight text-orange-300 ">
              EOS Rebel <br />
              <span className="text-4xl sm:text-5xl lg:text-6xl">T7i Kit</span>
            </h3>
            
            <div className="mt-3 sm:mt-4">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#c58d5d]">
                {formatINR(899.99)}
              </span>
            </div>

            <button className="mt-5 sm:mt-6 bg-[#c58d5d] hover:bg-[#b07a4d] text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 mx-auto text-sm sm:text-base">
              <FaShoppingCart className="text-sm sm:text-base" />
              <span>Shop Now</span>
            </button>
          </div>
        </div>

        {/* RIGHT SECTION - Sale Banner with Image Background */}
        <div
          className={`
            relative
            rounded-2xl 
            overflow-hidden
            h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]
            transition-all 
            duration-700 
            ease-out
            group
            cursor-pointer
            ${show ? "animate-from-right" : "opacity-0 translate-x-[100px]"}
          `}
        >
          {/* Background Image */}
          <img
            src={saleBgImage}
            alt="Sale Background"
            className="absolute w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Dark Overlay with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r bg-orange-200/70 via-orange-100/50 to-orange-200/30 transition-all duration-300"></div>

          {/* Content - Left Aligned */}
          <div className="relative z-10 h-full flex flex-col justify-center items-start text-left px-6 sm:px-8 lg:px-12">
            {/* SALE Badge */}
            <div className="inline-block bg-[#c58d5d] px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4">
              SALE
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#c58d5d] leading-tight">
              Get UP To <br />
              <span className="text-4xl sm:text-5xl lg:text-6xl text-[#c58d5d]">50% Off</span>
            </h2>

            <p className="mt-2 sm:mt-3 text-white/80 text-sm sm:text-base font-medium">
              On Selected Items
            </p>

            <button className="mt-5 sm:mt-6 bg-white hover:bg-gray-100 text-[#c58d5d] px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm sm:text-base">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fromLeft {
          from {
            opacity: 0;
            transform: translateX(-100px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes fromRight {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .animate-from-left {
          animation: fromLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-from-right {
          animation: fromRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </section>
  );
};

export default BannerSection;
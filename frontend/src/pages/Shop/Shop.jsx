import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaChevronRight } from "react-icons/fa";

// Import Banner Image
import shopBanner from "../../assets/images/shop.jpg";

import Services from "../../../src/services/Serviec";
import OfferBanner from "../../OfferBanner/OfferBanner";
import Products from "../../components/ProductCard/Products";
import BannerSection from "../../components/BannerSection/Banner";
import AllProducts from "../AllProducts/Allproducts";
import Footer from "../../components/Footer/Footer";

const Shop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6ede0]">
      {/* Banner Section - Fixed/Sticky */}
      <section className="relative h-[250px] sm:h-[300px] md:h-3500px] lg:h-[450px] w-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${shopBanner})`,
            backgroundAttachment: 'fixed',
          }}
        ></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-orange-400/30"></div>

        {/* Content - Centered */}
        <div className={`
          relative z-10 h-full flex flex-col items-center justify-center
          px-4 sm:px-6 lg:px-8
          transition-all duration-700 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}>
          {/* Title */}
          <h1 
            style={{ color: '#f8f5f3' }}
            className={`
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold 
              [text-shadow:_0_2px_10px_rgba(0,0,0,0.5)]
              transition-all duration-700 delay-100
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            Shop Page
          </h1>

          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base mt-3 sm:mt-4">
            <Link 
              to="/" 
              className="text-white hover:text-orange-700 transition-colors duration-300 flex items-center gap-1"
            >
              <FaHome size={14} />
              Home
            </Link>
            <FaChevronRight size={12} className="text-white/60" />
            <span className="text-white hover:text-orange-700 cursor-pointer">Pages</span>
            <FaChevronRight size={12} className="text-white/60" />
            <span className="text-white hover:text-orange-700 font-semibold">Shop</span>
          </div>
        </div>
      </section>

      {/* Content that scrolls over the banner */}
      <div className="relative z-20 -mt-10 sm:-mt-16 lg:-mt-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Services - with background to cover banner */}
          <div className="bg-[#f6ede0] rounded-t-3xl sm:rounded-t-4xl pt-10 sm:pt-14 lg:pt-20">
            <Services />
            <OfferBanner />
            <Products />
            <BannerSection />
            <AllProducts />
          </div>
        </div>
      </div>

      {/* Footer - outside the content wrapper */}
      <Footer />
    </div>
  );
};

export default Shop;
import { FaArrowLeft, FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import heroImage from "../../assets/images/carousel-1.png";
import heroImage2 from "../../assets/images/carousel-2.png";
import heroImage3 from "../../assets/images/header-img.jpg";
import Services from "../../../src/services/Serviec";
import OfferBanner from "../../OfferBanner/OfferBanner";
import Products from "../../components/ProductCard/Products";
import BannerSection from "../../components/BannerSection/Banner"; // Import new component
import AllProducts from "../AllProducts/Allproducts";
import Footer from "../../components/Footer/Footer";
import { useShop } from "../../context/useShop";
import { productCatalog } from "../../data/productCatalog";
import { formatPriceINR } from "../../utils/currency";


const Home = () => {
  const navigate = useNavigate();
  const { addToCart, isLoggedIn } = useShop();
  const slides = [
    {
      image: heroImage,
      save: "SAVE UP TO ₹200",
      title: "On Selected Laptops & Desktop Or Smartphone"
    },
    {
      image: heroImage2,
      save: "SAVE UP TO ₹400",
      title: "On Selected Premium Laptop Deals"
    },
  ];

  return (
    <main className="overflow-hidden py-3 sm:py-4 md:py-6">
      {/* Main Grid - Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1.2fr] bg-white">
        
        {/* LEFT SLIDER - Full width on mobile */}
        <section className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[650px] w-full flex items-center overflow-hidden">
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={1}
            spaceBetween={0}
            loop={true}
            speed={700}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: ".swiper-prev",
              nextEl: ".swiper-next",
            }}
            className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px]"
          >
            {slides.map((item, index) => (
              <SwiperSlide key={index} className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px]">
                <div className="flex flex-col-reverse md:grid md:grid-cols-2 items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 h-full py-6 sm:py-8 md:py-10">
                  
                  {/* CONTENT - Left side (moves to top on mobile) */}
                  <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left px-2 sm:px-4 md:px-6 order-2 md:order-1 w-full">
                    <p className="uppercase tracking-[3px] sm:tracking-[4px] md:tracking-[5px] text-gray-600 font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base">
                      {item.save}
                    </p>

                    <h1 className="mt-2 sm:mt-3 md:mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight font-bold text-[#454545]">
                      {item.title}
                    </h1>

                    <p className="mt-2 sm:mt-3 md:mt-4 text-gray-500 text-xs sm:text-sm md:text-base">
                      Terms and Condition Apply
                    </p>

                    <button className="mt-4 sm:mt-5 md:mt-6 bg-[#c8a279] hover:bg-[#b58b61] text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl w-fit text-sm sm:text-base">
                      Shop Now
                    </button>
                  </div>

                  {/* IMAGE - Right side (moves to bottom on mobile) */}
                  <div className="flex justify-center items-center order-1 md:order-2 w-full">
                    <img
                      src={item.image}
                      alt="Product"
                      className="w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[480px] h-[180px] sm:h-[220px] md:h-[280px] lg:h-[350px] xl:h-[400px] object-contain"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* FIXED ARROWS - Responsive */}
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 flex gap-2 sm:gap-3 z-20">
            <button
              className="swiper-prev w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-[#c8a279] hover:bg-[#b58b61] text-white flex items-center justify-center transition duration-300 hover:scale-110 shadow-lg text-sm sm:text-base md:text-lg"
              aria-label="Previous slide"
            >
              <FaArrowLeft />
            </button>
            <button
              className="swiper-next w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-[#c8a279] hover:bg-[#b58b61] text-white flex items-center justify-center transition duration-300 hover:scale-110 shadow-lg text-sm sm:text-base md:text-lg"
              aria-label="Next slide"
            >
              <FaArrowRight />
            </button>
          </div>
        </section>



        {/* RIGHT OFFER - Full width on mobile */}

        
       <section className="relative min-h-[350px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px] xl:h-[650px] overflow-hidden">
  <img
    src={heroImage3}
    className="absolute w-full h-full object-cover"
    alt="Special offer"
  />

  <div className="absolute inset-0 bg-black/40"></div>

  <div className="relative z-10 h-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 flex flex-col text-white">
    
    {/* Top Section - Responsive */}
    <div className="flex justify-between items-start">
      <button className="bg-[#c8a279] hover:bg-[#b58b61] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-xl font-semibold transition hover:scale-105 text-xs sm:text-sm">
        Save ₹48.00
      </button>
      <span className="text-orange-300 font-bold text-xs sm:text-sm">
        Special Offer
      </span>
    </div>

    {/* Spacer to push content down */}
    <div className="flex-1"></div>

    {/* Center Content - Bottom mein */}
    <div className="flex flex-col items-center text-center pb-4 sm:pb-6 md:pb-8">
      <p className="text-[#d6b08b] text-[10px] sm:text-xs md:text-sm uppercase tracking-wider">
        SmartPhone
      </p>

      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-2 sm:mt-3 md:mt-4 leading-tight">
        Apple iPad Mini G2356
      </h2>

      <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4">
        <span className="line-through text-gray-300 text-base sm:text-lg md:text-xl">
          {formatPriceINR(productCatalog[0].oldPrice)}
        </span>
        <span className="text-[#d6b08b] font-bold text-lg sm:text-xl md:text-2xl">
          {formatPriceINR(productCatalog[0].price)}
        </span>
      </div>

      <button onClick={() => {
        if (isLoggedIn) {
          addToCart(productCatalog[0]);
        } else {
          navigate("/cart", { state: { pendingCartItem: productCatalog[0] } });
        }
      }} className="mt-4 sm:mt-5 md:mt-6 mx-auto flex items-center gap-2 sm:gap-3 bg-[#b58b61] hover:bg-[#a0744e] px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold transition duration-300 hover:scale-105 text-sm sm:text-base">
        <FaShoppingCart className="text-xs sm:text-sm md:text-base" />
        <span>Add To Cart</span>
      </button>
    </div>
  </div>
</section>


      </div>

      <Services />
      <OfferBanner />
      <Products />
      <BannerSection />
       <AllProducts />
       <Footer/>
    </main>
  );
};

export default Home;
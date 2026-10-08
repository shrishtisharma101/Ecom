import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useShop } from "../../context/useShop";
import { FaHome, FaChevronRight, FaShoppingCart, FaStar, FaRegStar } from "react-icons/fa";
import WishlistButton from "../../components/WishlistButton/WishlistButton";
import CompareButton from "../../components/CompareButton/CompareButton";

// Import Banner Image
import shopBanner from "../../assets/images/shop.jpg";

// Import Images
import product1 from "../../assets/images/carousel-1.png";
import product2 from "../../assets/images/carousel-2.png";
import product3 from "../../assets/images/cam1.png";
import product4 from "../../assets/images/watch2.png";
import product5 from "../../assets/images/cam1.png";
import product6 from "../../assets/images/watch2.png";
import product7 from "../../assets/images/cam1.png";
import product8 from "../../assets/images/watch2.png";

import Footer from "../../components/Footer/Footer";
import { formatPriceINR } from "../../utils/currency";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart, isLoggedIn } = useShop();
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const searchTerm = searchParams.get("search")?.trim() || "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const allProducts = [
    {
      id: 1,
      title: "Apple iPad Mini G2356",
      image: product1,
      oldPrice: "$1,250.00",
      price: "$1,050.00",
      rating: 4,
      badge: "New",
      category: "Electronics",
    },
    {
      id: 2,
      title: "Canon DSLR Camera",
      image: product2,
      oldPrice: "$999.00",
      price: "$799.00",
      rating: 5,
      badge: "Sale",
      category: "Camera",
    },
    {
      id: 3,
      title: "Camera Lens",
      image: product3,
      oldPrice: "$650.00",
      price: "$499.00",
      rating: 5,
      badge: "",
      category: "Accessories",
    },
    {
      id: 4,
      title: "Wireless Earbuds",
      image: product4,
      oldPrice: "$220.00",
      price: "$180.00",
      rating: 4,
      badge: "New",
      category: "Audio",
    },
    {
      id: 5,
      title: "Vintage Camera",
      image: product5,
      oldPrice: "$450.00",
      price: "$340.00",
      rating: 5,
      badge: "Sale",
      category: "Camera",
    },
    {
      id: 6,
      title: "Wireless Headphones",
      image: product6,
      oldPrice: "$280.00",
      price: "$230.00",
      rating: 4,
      badge: "",
      category: "Audio",
    },
    {
      id: 7,
      title: "Gaming Headset",
      image: product7,
      oldPrice: "$280.00",
      price: "$230.00",
      rating: 4,
      badge: "Sale",
      category: "Gaming",
    },
    {
      id: 8,
      title: "Smart Watch Pro",
      image: product8,
      oldPrice: "$280.00",
      price: "$230.00",
      rating: 4,
      badge: "",
      category: "Wearables",
    },
    {
      id: 9,
      title: "Apple iPad Air M2",
      image: product1,
      oldPrice: "$1,500.00",
      price: "$1,299.00",
      rating: 5,
      badge: "New",
      category: "Electronics",
    },
    {
      id: 10,
      title: "Sony Wireless Earbuds",
      image: product4,
      oldPrice: "$250.00",
      price: "$199.00",
      rating: 4,
      badge: "Sale",
      category: "Audio",
    },
    {
      id: 11,
      title: "Canon EOS R6",
      image: product2,
      oldPrice: "$2,500.00",
      price: "$2,199.00",
      rating: 5,
      badge: "",
      category: "Camera",
    },
    {
      id: 12,
      title: "Bose Headphones",
      image: product6,
      oldPrice: "$350.00",
      price: "$279.00",
      rating: 4,
      badge: "Sale",
      category: "Audio",
    },
  ];

  const filteredProducts = searchTerm
    ? allProducts.filter((product) =>
        `${product.title} ${product.category}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : allProducts;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const visiblePage = Math.min(currentPage, totalPages);
  const indexOfLastProduct = visiblePage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-[#f6ede0]">
      {/* Banner Section - Fixed/Sticky */}
      <section className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full overflow-hidden">
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
          <h1 
            style={{ color: '#f8f5f3' }}
            className={`
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold 
              [text-shadow:_0_2px_10px_rgba(0,0,0,0.5)]
              transition-all duration-700 delay-100
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            {searchTerm ? `Search: ${searchTerm}` : "All Products"}
          </h1>

          <div className="flex items-center justify-center gap-2 text-sm sm:text-base mt-3 sm:mt-4">
            <Link 
              to="/" 
              className="text-[#c8a279] hover:text-[#b07a4b] transition-colors duration-300 flex items-center gap-1"
            >
              <FaHome size={14} />
              Home
            </Link>
            <FaChevronRight size={12} className="text-white/60" />
            <span className="text-white/70">Pages</span>
            <FaChevronRight size={12} className="text-white/60" />
            <span className="text-white font-semibold">Products</span>
          </div>
        </div>
      </section>

      {/* Products Content */}
      <div className="relative z-20 -mt-8 sm:-mt-12 lg:-mt-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f6ede0] rounded-t-3xl sm:rounded-t-4xl pt-8 sm:pt-12 lg:pt-16">
            
            {/* Products Grid */}
            {currentProducts.length === 0 ? (
              <p className="col-span-full py-16 text-center text-[#8c7661]">
                No products found for “{searchTerm}”.
              </p>
            ) : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {currentProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`
                    group bg-white rounded-2xl border border-[#e3d3c2] p-4 sm:p-5
                    hover:shadow-xl hover:border-[#c8a279] transition-all duration-300
                    hover:-translate-y-2
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                  `}
                  style={{
                    transitionDelay: `${index * 0.05}s`
                  }}
                >
                  {/* Badge */}
                  {product.badge && (
                    <span className={`
                      absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-semibold z-10
                      ${product.badge === "Sale" ? "bg-red-500" : "bg-[#c8a279]"}
                    `}>
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist & Compare */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-100 translate-x-0 transition-all duration-300 sm:opacity-0 sm:translate-x-4 sm:group-hover:opacity-100 sm:group-hover:translate-x-0">
                    <WishlistButton
                      product={product}
                      className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#c8a279] hover:text-white transition text-xs"
                    />
                    <CompareButton
                      product={product}
                      className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#c8a279] hover:text-white transition text-xs"
                    />
                  </div>

                  {/* Product Image */}
                  <div className="flex justify-center items-center h-[160px] sm:h-[180px] lg:h-[200px] relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-[120px] sm:w-[140px] lg:w-[160px] object-contain transition-all duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Category */}
                  <p className="text-center text-gray-500 text-xs sm:text-sm mt-2">{product.category}</p>

                  {/* Product Name */}
                  <h3 className="text-center text-sm sm:text-base font-semibold text-[#2f2f2f] mt-1 leading-6">
                    {product.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex justify-center items-center gap-0.5 sm:gap-1 mt-1.5">
                    {[1, 2, 3, 4, 5].map((star) =>
                      star <= product.rating ? (
                        <FaStar key={star} className="text-[#f4b400] text-[10px] sm:text-xs" />
                      ) : (
                        <FaRegStar key={star} className="text-gray-300 text-[10px] sm:text-xs" />
                      )
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex justify-center items-center gap-2 sm:gap-3 mt-2">
                    <span className="line-through text-gray-400 text-xs sm:text-sm">{formatPriceINR(product.oldPrice)}</span>
                    <span className="text-[#c8a279] font-bold text-sm sm:text-base lg:text-lg">{formatPriceINR(product.price)}</span>
                  </div>

                  {/* Add to Cart */}
                  <button onClick={() => {
                    if (isLoggedIn) {
                      addToCart(product);
                    } else {
                      navigate("/cart", { state: { pendingCartItem: product } });
                    }
                  }} className="
                    mt-3 sm:mt-4 mx-auto flex items-center justify-center gap-2
                    bg-[#c8a279] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg
                    text-xs sm:text-sm font-semibold cursor-pointer w-full
                    transition-all duration-300 hover:bg-[#b07a4b] hover:scale-105
                    opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0
                  ">
                    <FaShoppingCart className="text-xs sm:text-sm" />
                    <span>Add To Cart</span>
                  </button>
                </div>
              ))}
            </div>}

            {/* Pagination */}
            {totalPages > 1 && <div className="flex justify-center items-center gap-2 mt-8 sm:mt-10 pb-8 sm:pb-12">
              <button
                onClick={() => paginate(visiblePage - 1)}
                disabled={visiblePage === 1}
                className={`px-4 py-2 border border-[#e3d3c2] rounded-lg text-sm transition-all duration-300 ${
                  visiblePage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#4d3d2f] hover:border-[#c8a279] hover:text-[#c8a279]"
                }`}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                    visiblePage === index + 1
                      ? "bg-[#c8a279] text-white"
                      : "border border-[#e3d3c2] text-[#4d3d2f] hover:border-[#c8a279] hover:text-[#c8a279]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => paginate(visiblePage + 1)}
                disabled={visiblePage === totalPages}
                className={`px-4 py-2 border border-[#e3d3c2] rounded-lg text-sm transition-all duration-300 ${
                  visiblePage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#4d3d2f] hover:border-[#c8a279] hover:text-[#c8a279]"
                }`}
              >
                Next
              </button>
            </div>}

          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductsPage;
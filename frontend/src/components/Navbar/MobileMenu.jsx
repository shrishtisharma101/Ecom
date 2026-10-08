import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { navLinks } from "./navbarData";

const MobileMenu = ({ isOpen, toggleMenu }) => {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={toggleMenu}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-72 h-screen bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-2xl font-bold text-orange-500">
              E-Commerce
            </h2>
            <p className="text-xs text-gray-500">
              Online Shopping
            </p>
          </div>

          <button
            onClick={toggleMenu}
            className="text-2xl text-gray-700 hover:text-red-500"
          >
            <FaTimes />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search Products..."
            className="w-full border rounded-lg px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

        {/* Menu */}
        <div className="flex flex-col">
          {navLinks.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={toggleMenu}
              className="px-6 py-4 border-b hover:bg-orange-50 hover:text-orange-500 transition"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Categories */}
        <div className="px-6 py-5 border-b">
          <h3 className="font-semibold text-gray-700 mb-3">
            Categories
          </h3>

          <div className="flex flex-col gap-2">
            <Link to="/category/mobiles" onClick={toggleMenu}>
              Mobiles
            </Link>

            <Link to="/category/laptops" onClick={toggleMenu}>
              Laptops
            </Link>

            <Link to="/category/fashion" onClick={toggleMenu}>
              Fashion
            </Link>

            <Link to="/category/electronics" onClick={toggleMenu}>
              Electronics
            </Link>

            <Link to="/category/home" onClick={toggleMenu}>
              Home Appliances
            </Link>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="absolute bottom-0 left-0 w-full p-5 border-t bg-white">
          <Link
            to="/login"
            onClick={toggleMenu}
            className="block w-full text-center bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
          >
            Login / Register
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
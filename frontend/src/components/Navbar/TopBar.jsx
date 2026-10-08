import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const TopBar = () => {
  return (
    <div className="bg-[#ede0d5] text-[#6b5a49] text-[12px] sm:text-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 py-2">
          <div className="flex flex-wrap items-center gap-2 text-[#6b5a49]">
            <Link to="/help" className="hover:text-[#8f7a69] transition">
              Help
            </Link>
            <span className="text-[#9b8b79]">/</span>
            <Link to="/support" className="hover:text-[#8f7a69] transition">
              Support
            </Link>
            <span className="text-[#9b8b79]">/</span>
            <Link to="/contact" className="hover:text-[#8f7a69] transition">
              Contact
            </Link>
          </div>

          <div className="text-center lg:text-left text-[#6b5a49]">
            Call Us:{" "}
            <a href="tel:9569161364" className="font-semibold text-[#3f3124] hover:text-[#8f7a69]">
              9569161364
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-end text-[#6b5a49]">
            <span className="font-semibold">INR ₹</span>
            <span className="hidden sm:inline text-[#9b8b79]">|</span>
            <Link to="#" className="hover:text-[#8f7a69] transition">
              English
            </Link>
            <span className="hidden sm:inline text-[#9b8b79]">|</span>
            <Link to="/admin" className="flex items-center gap-1 hover:text-[#8f7a69] transition">
              <FaUser className="text-xs" />
              My Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
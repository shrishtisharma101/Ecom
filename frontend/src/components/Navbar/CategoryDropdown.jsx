import { FaChevronDown } from "react-icons/fa";
import { categories } from "./navbarData";

const CategoryDropdown = () => {
  return (
    <select className="outline-none px-4 bg-transparent text-gray-700 cursor-pointer">
      {categories.map((item, index) => (
        <option key={index}>{item}</option>
      ))}
    </select>
  );
};

export default CategoryDropdown;
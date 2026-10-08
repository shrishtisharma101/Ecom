import { FaExchangeAlt } from "react-icons/fa";
import { useShop } from "../../context/useShop";

const CompareButton = ({ product, className = "" }) => {
  const { compareItems, addToCompare, removeFromCompare } = useShop();
  const isCompared = compareItems.some(
    (item) => String(item.id) === String(product.id) && item.title === product.title
  );

  const toggleCompare = () => {
    if (isCompared) {
      removeFromCompare(product.id, product.title);
    } else {
      addToCompare(product);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleCompare}
      aria-label={`${isCompared ? "Remove" : "Add"} ${product.title} ${isCompared ? "from" : "to"} comparison`}
      aria-pressed={isCompared}
      title={isCompared ? "Remove from comparison" : "Add to comparison"}
      className={`${className} ${isCompared ? "text-[#a8794e] ring-2 ring-[#c8a279]" : ""}`}
    >
      <FaExchangeAlt />
    </button>
  );
};

export default CompareButton;

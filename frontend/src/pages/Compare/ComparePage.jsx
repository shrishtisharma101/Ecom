import { Link, useNavigate } from "react-router-dom";
import {
  FaExchangeAlt,
  FaShoppingCart,
  FaStar,
  FaRegStar,
  FaTrash,
} from "react-icons/fa";
import { useShop } from "../../context/useShop";
import { formatPriceINR } from "../../utils/currency";

const getNumericPrice = (price) =>
  Number(String(price || "0").replace(/[^\d.]/g, "")) || 0;

const ComparePage = () => {
  const navigate = useNavigate();
  const {
    compareItems,
    clearCompare,
    removeFromCompare,
    addToCart,
    isLoggedIn,
  } = useShop();

  const handleAddToCart = (product) => {
    if (isLoggedIn) {
      addToCart(product);
      return;
    }

    navigate("/login", {
      state: {
        from: { pathname: "/compare" },
        pendingCartItem: product,
      },
    });
  };

  if (compareItems.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-4 py-12 text-center">
        <FaExchangeAlt className="text-4xl text-[#c8a279]" />
        <h1 className="mt-4 text-2xl font-bold text-[#4d3d2f] sm:text-3xl">Compare products</h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#8c7661]">
          Add products to compare their prices, categories and ratings side by side.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#c8a279] px-5 font-semibold text-white transition hover:bg-[#b07a4b]"
        >
          Browse products
        </Link>
      </main>
    );
  }

  const comparisonRows = [
    {
      label: "Category",
      value: (product) => product.category || "Not specified",
    },
    {
      label: "Price",
      value: (product) => formatPriceINR(product.price),
    },
    {
      label: "Original price",
      value: (product) => product.oldPrice ? formatPriceINR(product.oldPrice) : "Not specified",
    },
    {
      label: "Savings",
      value: (product) => {
        const savings = getNumericPrice(product.oldPrice) - getNumericPrice(product.price);
        return savings > 0 ? formatPriceINR(savings) : "—";
      },
    },
    {
      label: "Rating",
      value: (product) => (
        <span className="inline-flex items-center gap-1" aria-label={`${product.rating || 0} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((star) =>
            star <= (Number(product.rating) || 0) ? (
              <FaStar key={star} className="text-amber-400" />
            ) : (
              <FaRegStar key={star} className="text-gray-300" />
            )
          )}
          <span className="ml-1 text-xs text-[#8c7661]">{product.rating || 0}/5</span>
        </span>
      ),
    },
  ];

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e3d3c2] pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8794e]">Make a choice</p>
          <h1 className="mt-1 text-2xl font-bold text-[#4d3d2f] sm:text-3xl">Compare products</h1>
          <p className="mt-1 text-sm text-[#8c7661]">
            {compareItems.length} product{compareItems.length === 1 ? "" : "s"} selected
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/shop" className="text-sm font-semibold text-[#9a7049] hover:underline">
            Continue shopping
          </Link>
          <button
            type="button"
            onClick={clearCompare}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#e3d3c2] px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <FaTrash size={12} /> Clear all
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[#e3d3c2] bg-white shadow-sm">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-40 border-b border-r border-[#e3d3c2] bg-[#fbf8f4] p-4 text-sm font-semibold text-[#6b5a49]">
                Product details
              </th>
              {compareItems.map((product) => (
                <th key={`${product.id}-${product.title}`} className="min-w-52 border-b border-[#e3d3c2] p-4 align-top">
                  <div className="flex h-full flex-col items-center text-center">
                    <button
                      type="button"
                      onClick={() => removeFromCompare(product.id, product.title)}
                      aria-label={`Remove ${product.title} from comparison`}
                      className="mb-2 self-end rounded p-2 text-[#a8794e] transition hover:bg-red-50 hover:text-red-600"
                    >
                      <FaTrash size={13} />
                    </button>
                    <img src={product.image} alt={product.title} className="h-32 w-full object-contain" />
                    <h2 className="mt-3 text-sm font-semibold leading-5 text-[#4d3d2f]">{product.title}</h2>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#c8a279] px-4 text-xs font-semibold text-white transition hover:bg-[#b07a4b]"
                    >
                      <FaShoppingCart /> Add to cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.label} className="border-b border-[#f0e7df] last:border-0">
                <th scope="row" className="sticky left-0 z-10 border-r border-[#e3d3c2] bg-[#fbf8f4] p-4 text-sm font-semibold text-[#6b5a49]">
                  {row.label}
                </th>
                {compareItems.map((product) => (
                  <td key={`${product.id}-${product.title}-${row.label}`} className="p-4 text-center text-sm text-[#4d3d2f]">
                    {row.value(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default ComparePage;

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import CategoryDropdown from "./CategoryDropdown";
import { productCatalog } from "../../data/productCatalog";
import { formatPriceINR } from "../../utils/currency";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const normalizedQuery = query.trim().toLowerCase();
  const matches = normalizedQuery
    ? productCatalog
        .filter((product) =>
          `${product.title} ${product.category}`.toLowerCase().includes(normalizedQuery)
        )
        .slice(0, 5)
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    inputRef.current?.blur();
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setIsSuggestionsOpen(false);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full"
    >
      <div className="flex w-full items-center overflow-hidden rounded-lg border-2 border-orange-500 bg-white">
        <div className="hidden border-r bg-gray-50 lg:block">
          <CategoryDropdown />
        </div>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsSuggestionsOpen(true);
          }}
          onFocus={() => setIsSuggestionsOpen(true)}
          onBlur={() => setIsSuggestionsOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsSuggestionsOpen(false);
          }}
          aria-label="Search products"
          aria-expanded={isSuggestionsOpen && normalizedQuery.length > 0}
          autoComplete="off"
          placeholder="Search for Products..."
          className="min-w-0 flex-1 px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />

        <button
          type="submit"
          aria-label="Search"
          className="flex min-h-12 w-12 shrink-0 items-center justify-center bg-orange-500 text-white transition-colors hover:bg-orange-600 sm:w-14"
        >
          <FaSearch className="text-lg" />
        </button>
      </div>

      {isSuggestionsOpen && normalizedQuery && (
        <div className="absolute left-0 right-0 top-full z-[60] mt-1 max-h-80 overflow-y-auto border border-[#e3d3c2] bg-white shadow-xl">
          {matches.length ? matches.map((product) => (
            <button
              key={product.id}
              type="button"
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => {
                setQuery(product.title);
                setIsSuggestionsOpen(false);
                navigate(`/products?search=${encodeURIComponent(product.title)}`);
              }}
              className="flex w-full items-center gap-3 border-b border-[#f0e8df] px-4 py-3 text-left last:border-0 hover:bg-[#faf6f0]"
            >
              <img src={product.image} alt="" className="h-10 w-10 object-contain" />
              <span className="min-w-0 flex-1 truncate text-sm text-[#4d3d2f]">{product.title}</span>
              <span className="text-sm font-semibold text-[#a8794e]">{formatPriceINR(product.price)}</span>
            </button>
          )) : (
            <p className="px-4 py-3 text-sm text-[#8c7661]">No matching products</p>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
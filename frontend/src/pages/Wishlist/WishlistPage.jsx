import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useShop } from "../../context/useShop";
import { formatPriceINR } from "../../utils/currency";

const WishlistPage = () => {
  const { wishlistItems, addToCart, removeFromWishlist, markWishlistNotificationsSeen } = useShop();

  useEffect(() => {
    markWishlistNotificationsSeen();
  }, [markWishlistNotificationsSeen]);

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#e3d3c2] pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-[#4d3d2f] sm:text-3xl">My Wishlist</h1>
          <p className="mt-1 text-sm text-[#8c7661]">{wishlistItems.length} saved product{wishlistItems.length === 1 ? "" : "s"}</p>
        </div>
        <Link to="/shop" className="text-sm font-semibold text-[#9a7049] hover:underline">Continue shopping</Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center text-center">
          <FaHeart className="text-2xl text-[#c8a279]" />
          <p className="mt-4 text-lg font-medium text-[#4d3d2f]">Your wishlist is empty</p>
          <p className="mt-2 text-sm text-[#8c7661]">Like a product to save it here.</p>
          <Link to="/shop" className="mt-5 inline-flex min-h-11 items-center bg-[#c8a279] px-5 font-semibold text-white hover:bg-[#b07a4b]">Browse products</Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item) => (
            <article key={item.id} className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 border border-[#e3d3c2] bg-white p-4">
              <img src={item.image} alt={item.title} className="h-24 w-[88px] object-contain" />
              <div className="min-w-0">
                <h2 className="break-words font-medium text-[#4d3d2f]">{item.title}</h2>
                <p className="mt-1 text-sm font-semibold text-[#a8794e]">{formatPriceINR(item.price)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => addToCart(item)} className="inline-flex min-h-9 items-center gap-2 bg-[#c8a279] px-3 text-xs font-semibold text-white hover:bg-[#b07a4b]"><FaShoppingCart /> Add to cart</button>
                  <button type="button" aria-label={`Remove ${item.title} from wishlist`} onClick={() => removeFromWishlist(item.id, item.title)} className="flex h-9 w-9 items-center justify-center border border-[#e3d3c2] text-red-600 hover:bg-red-50"><FaTrash size={12} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default WishlistPage;
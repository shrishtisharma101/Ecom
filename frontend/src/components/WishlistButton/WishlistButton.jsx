import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { isSameProduct } from "../../context/wishlistUtils";
import { useShop } from "../../context/useShop";

const heartDirections = [
  ["-24px", "-24px"],
  ["0px", "-32px"],
  ["24px", "-24px"],
  ["32px", "0px"],
  ["24px", "24px"],
  ["0px", "32px"],
  ["-24px", "24px"],
  ["-32px", "0px"],
];

const WishlistButton = ({ product, className }) => {
  const navigate = useNavigate();
  const { addToWishlist, isLoggedIn, removeFromWishlist, wishlistItems } = useShop();
  const [burstKey, setBurstKey] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef(null);
  const isWishlisted = wishlistItems.some((item) => isSameProduct(item, product));

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const handleClick = () => {
    if (!isLoggedIn) {
      navigate("/wishlist", { state: { pendingWishlistItem: product } });
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(product.id, product.title);
      setToastMessage("Removed from your wishlist");
      setShowToast(true);
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setShowToast(false), 2000);
      return;
    }

    if (!addToWishlist(product)) return;
    setBurstKey((key) => key + 1);
    setToastMessage("Added to your wishlist");
    setShowToast(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`relative overflow-visible ${className}`}
        aria-label={isWishlisted ? "Product is in wishlist" : "Add to wishlist"}
        aria-pressed={isWishlisted}
        title={isWishlisted ? "Saved to wishlist" : "Add to wishlist"}
      >
        <FaHeart style={isWishlisted ? { color: "#dc2626" } : undefined} />
        {burstKey > 0 && (
          <span key={burstKey} className="wishlist-heart-burst" aria-hidden="true">
            {heartDirections.map(([x, y], index) => (
              <FaHeart
                key={index}
                className="wishlist-heart-particle"
                style={{ "--heart-x": x, "--heart-y": y }}
              />
            ))}
          </span>
        )}
      </button>
      {showToast && (
        <div className="wishlist-toast" role="status" aria-live="polite">
          <FaHeart aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};

export default WishlistButton;

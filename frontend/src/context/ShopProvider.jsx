import { useCallback, useEffect, useState } from "react";
import ShopContext from "./ShopContext";
import { useAuth } from "./AuthContext";
import { isSameProduct } from "./wishlistUtils";

const getUserStorageKey = (listName) => {
  if (!localStorage.getItem("token")) return null;

  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const userId = storedUser?.id || storedUser?._id;
    return userId ? `${listName}:${userId}` : null;
  } catch {
    return null;
  }
};

const getWishlistStorageKey = () => getUserStorageKey("wishlistItems");
const getWishlistNoticeStorageKey = () => getUserStorageKey("wishlistUnseenLikes");
const getCartStorageKey = () => getUserStorageKey("cartItems");
const getCartNoticeStorageKey = () => getUserStorageKey("cartUnseenAdditions");
const COMPARE_STORAGE_KEY = "compareItems";

const readStoredItems = (key) => {
  if (!key) return [];

  try {
    const storedItems = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(storedItems) ? storedItems : [];
  } catch {
    return [];
  }
};

const readStoredCount = (key) => {
  const count = Number(localStorage.getItem(key) || 0);
  return Number.isFinite(count) && count > 0 ? count : 0;
};

export const ShopProvider = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const userId = isLoggedIn ? user?.id || user?._id : null;
  const wishlistStorageKey = userId ? `wishlistItems:${userId}` : null;
  const cartStorageKey = userId ? `cartItems:${userId}` : null;
  const cartNoticeStorageKey = userId ? `cartUnseenAdditions:${userId}` : null;
  const wishlistNoticeStorageKey = userId ? `wishlistUnseenLikes:${userId}` : null;
  const [wishlistsByOwner, setWishlistsByOwner] = useState(() => {
    const initialKey = getWishlistStorageKey();
    return initialKey ? { [initialKey]: readStoredItems(initialKey) } : {};
  });
  const [cartsByOwner, setCartsByOwner] = useState(() => {
    const initialKey = getCartStorageKey();
    return initialKey ? { [initialKey]: readStoredItems(initialKey) } : {};
  });
  const [cartNoticesByOwner, setCartNoticesByOwner] = useState(() => {
    const initialKey = getCartNoticeStorageKey();
    return initialKey ? { [initialKey]: readStoredCount(initialKey) } : {};
  });
  const [wishlistNoticesByOwner, setWishlistNoticesByOwner] = useState(() => {
    const initialKey = getWishlistNoticeStorageKey();
    return initialKey ? { [initialKey]: readStoredCount(initialKey) } : {};
  });
  const [compareItems, setCompareItems] = useState(() =>
    readStoredItems(COMPARE_STORAGE_KEY)
  );

  useEffect(() => {
    const items = wishlistStorageKey && wishlistsByOwner[wishlistStorageKey];
    if (items) localStorage.setItem(wishlistStorageKey, JSON.stringify(items));
  }, [wishlistsByOwner, wishlistStorageKey]);

  useEffect(() => {
    const items = cartStorageKey && cartsByOwner[cartStorageKey];
    if (items) localStorage.setItem(cartStorageKey, JSON.stringify(items));
  }, [cartStorageKey, cartsByOwner]);

  useEffect(() => {
    const count = cartNoticeStorageKey && cartNoticesByOwner[cartNoticeStorageKey];
    if (count !== undefined) localStorage.setItem(cartNoticeStorageKey, String(count));
  }, [cartNoticeStorageKey, cartNoticesByOwner]);

  useEffect(() => {
    const count = wishlistNoticeStorageKey && wishlistNoticesByOwner[wishlistNoticeStorageKey];
    if (count !== undefined) localStorage.setItem(wishlistNoticeStorageKey, String(count));
  }, [wishlistNoticeStorageKey, wishlistNoticesByOwner]);

  useEffect(() => {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareItems));
  }, [compareItems]);

  const cartItems = cartStorageKey
    ? cartsByOwner[cartStorageKey] ?? readStoredItems(cartStorageKey)
    : [];
  const wishlistItems = wishlistStorageKey
    ? wishlistsByOwner[wishlistStorageKey] ?? readStoredItems(wishlistStorageKey)
    : [];
  const cartNotificationCount = cartNoticeStorageKey
    ? cartNoticesByOwner[cartNoticeStorageKey] ?? readStoredCount(cartNoticeStorageKey)
    : 0;
  const wishlistNotificationCount = wishlistNoticeStorageKey
    ? wishlistNoticesByOwner[wishlistNoticeStorageKey] ?? readStoredCount(wishlistNoticeStorageKey)
    : 0;

  const markCartNotificationsSeen = useCallback(() => {
    const owner = getCartNoticeStorageKey();
    if (!owner) return;
    setCartNoticesByOwner((currentNotices) =>
      currentNotices[owner] === 0
        ? currentNotices
        : { ...currentNotices, [owner]: 0 }
    );
  }, []);

  const markWishlistNotificationsSeen = useCallback(() => {
    const owner = getWishlistNoticeStorageKey();
    if (!owner) return;
    setWishlistNoticesByOwner((currentNotices) =>
      currentNotices[owner] === 0
        ? currentNotices
        : { ...currentNotices, [owner]: 0 }
    );
  }, []);

  const addToCart = (product) => {
    const owner = getCartStorageKey();
    if (!owner) return;

    setCartsByOwner((currentCarts) => {
      const currentItems = currentCarts[owner] ?? readStoredItems(owner);
      const exists = currentItems.some((item) => isSameProduct(item, product));
      const updatedItems = exists
        ? currentItems.map((item) =>
            isSameProduct(item, product)
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          )
        : [...currentItems, { ...product, quantity: 1 }];
      return { ...currentCarts, [owner]: updatedItems };
    });

    const noticeKey = getCartNoticeStorageKey();
    if (noticeKey) {
      setCartNoticesByOwner((currentNotices) => ({
        ...currentNotices,
        [noticeKey]: (currentNotices[noticeKey] ?? readStoredCount(noticeKey)) + 1,
      }));
    }
  };

  const clearCart = () => {
    const owner = getCartStorageKey();
    if (!owner) return;

    localStorage.setItem(owner, JSON.stringify([]));
    setCartsByOwner((currentCarts) => ({ ...currentCarts, [owner]: [] }));
  };

  const removeFromCart = (productId, productTitle) => {
    const owner = getCartStorageKey();
    if (!owner) return;

    setCartsByOwner((currentCarts) => {
      const currentItems = currentCarts[owner] ?? readStoredItems(owner);
      return {
        ...currentCarts,
        [owner]: currentItems.filter((item) =>
        String(item.id) !== String(productId) ||
        (productTitle && item.title !== productTitle)
        ),
      };
    });
  };

  const setCartQuantity = (productId, productTitle, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId, productTitle);
      return;
    }

    const owner = getCartStorageKey();
    if (!owner) return;

    setCartsByOwner((currentCarts) => {
      const currentItems = currentCarts[owner] ?? readStoredItems(owner);
      return {
        ...currentCarts,
        [owner]: currentItems.map((item) =>
        String(item.id) === String(productId) && item.title === productTitle
          ? { ...item, quantity }
          : item
        ),
      };
    });
  };

  const addToWishlist = (product) => {
    const owner = getWishlistStorageKey();
    if (!owner) return false;

    const currentItems = readStoredItems(owner);
    if (currentItems.some((item) => isSameProduct(item, product))) return false;

    const updatedItems = [...currentItems, product];
    localStorage.setItem(owner, JSON.stringify(updatedItems));
    setWishlistsByOwner((currentLists) => ({ ...currentLists, [owner]: updatedItems }));

    const noticeKey = getWishlistNoticeStorageKey();
    if (noticeKey) {
      setWishlistNoticesByOwner((currentNotices) => ({
        ...currentNotices,
        [noticeKey]: (currentNotices[noticeKey] ?? readStoredCount(noticeKey)) + 1,
      }));
    }

    return true;
  };

  const removeFromWishlist = (productId, productTitle) => {
    const owner = getWishlistStorageKey();
    if (!owner) return;

    const currentItems = readStoredItems(owner);
    const updatedItems = currentItems.filter((item) =>
      String(item.id) !== String(productId) || item.title !== productTitle
    );
    localStorage.setItem(owner, JSON.stringify(updatedItems));
    setWishlistsByOwner((currentLists) => ({ ...currentLists, [owner]: updatedItems }));
  };

  const addToCompare = (product) => {
    if (compareItems.some((item) => isSameProduct(item, product))) return false;
    setCompareItems((currentItems) =>
      currentItems.some((item) => isSameProduct(item, product))
        ? currentItems
        : [...currentItems, product]
    );
    return true;
  };

  const removeFromCompare = (productId, productTitle) => {
    setCompareItems((currentItems) =>
      currentItems.filter((item) =>
        String(item.id) !== String(productId) || item.title !== productTitle
      )
    );
  };

  const clearCompare = () => setCompareItems([]);

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        wishlistItems,
        compareItems,
        cartCount: cartItems.reduce((total, item) => total + (item.quantity || 1), 0),
        cartNotificationCount,
        wishlistCount: wishlistItems.length,
        wishlistNotificationCount,
        isLoggedIn,
        addToCart,
        clearCart,
        removeFromCart,
        setCartQuantity,
        markCartNotificationsSeen,
        addToWishlist,
        removeFromWishlist,
        markWishlistNotificationsSeen,
        addToCompare,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

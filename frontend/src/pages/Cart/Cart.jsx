import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useShop } from "../../context/useShop";
import { formatINR } from "../../utils/currency";

const getPrice = (price) => Number(String(price || "0").replace(/[^\d.]/g, ""));

const Cart = () => {
  const { cartItems, removeFromCart, setCartQuantity, markCartNotificationsSeen } = useShop();

  useEffect(() => {
    markCartNotificationsSeen();
  }, [markCartNotificationsSeen]);
  const subtotal = cartItems.reduce(
    (total, item) => total + getPrice(item.price) * (item.quantity || 1),
    0
  );

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#e3d3c2] pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-[#4d3d2f] sm:text-3xl">Shopping Cart</h1>
          <p className="mt-1 text-sm text-[#8c7661]">{cartItems.length} product{cartItems.length === 1 ? "" : "s"}</p>
        </div>
        <Link to="/shop" className="text-sm font-semibold text-[#9a7049] hover:underline">Continue shopping</Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center text-center">
          <p className="text-lg font-medium text-[#4d3d2f]">Your cart is empty</p>
          <p className="mt-2 text-sm text-[#8c7661]">Add a product and it will appear here.</p>
          <Link to="/shop" className="mt-5 inline-flex min-h-11 items-center bg-[#c8a279] px-5 font-semibold text-white hover:bg-[#b07a4b]">Browse products</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="divide-y divide-[#e3d3c2] border-y border-[#e3d3c2]">
            {cartItems.map((item) => (
              <article key={item.id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center">
                <img src={item.image} alt={item.title} className="h-20 w-[72px] object-contain sm:w-[88px]" />
                <div className="min-w-0">
                  <h2 className="break-words font-medium text-[#4d3d2f]">{item.title}</h2>
                  <p className="mt-1 text-sm text-[#8c7661]">{formatINR(getPrice(item.price))}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <button type="button" aria-label={`Decrease ${item.title} quantity`} onClick={() => setCartQuantity(item.id, item.title, (item.quantity || 1) - 1)} className="flex h-8 w-8 items-center justify-center border border-[#d8c7b5] text-[#4d3d2f] hover:bg-[#f6ede0]"><FaMinus size={10} /></button>
                    <span className="min-w-5 text-center text-sm">{item.quantity || 1}</span>
                    <button type="button" aria-label={`Increase ${item.title} quantity`} onClick={() => setCartQuantity(item.id, item.title, (item.quantity || 1) + 1)} className="flex h-8 w-8 items-center justify-center border border-[#d8c7b5] text-[#4d3d2f] hover:bg-[#f6ede0]"><FaPlus size={10} /></button>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end sm:gap-4">
                  <span className="font-semibold text-[#4d3d2f]">{formatINR(getPrice(item.price) * (item.quantity || 1))}</span>
                  <button type="button" onClick={() => removeFromCart(item.id, item.title)} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"><FaTrash size={12} /> Remove</button>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit border border-[#e3d3c2] bg-white p-5">
            <h2 className="text-lg font-semibold text-[#4d3d2f]">Order summary</h2>
            <div className="mt-5 flex justify-between border-b border-[#eee4da] pb-4 text-sm text-[#6b5a49]">
              <span>Subtotal</span><span>{formatINR(subtotal)}</span>
            </div>
            <div className="mt-4 flex justify-between font-semibold text-[#4d3d2f]">
              <span>Total</span><span>{formatINR(subtotal)}</span>
            </div>
            <Link to="/checkout" className="mt-6 flex min-h-12 items-center justify-center bg-[#c8a279] px-4 font-semibold text-white hover:bg-[#b07a4b]">Order Now</Link>
          </aside>
        </div>
      )}
    </main>
  );
};

export default Cart;
import { Link } from "react-router-dom";
import { FaBoxOpen, FaHeart, FaArrowRight } from "react-icons/fa";

const Pages = () => {
  const pages = [
    {
      title: "My Orders",
      description: "See every order you have placed, with its items, payment and current status.",
      path: "/orders",
      icon: <FaBoxOpen />,
      action: "View my orders",
    },
    {
      title: "Wishlist",
      description: "Find the products you have saved and manage your wishlist.",
      path: "/wishlist",
      icon: <FaHeart />,
      action: "Open wishlist",
    },
  ];

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#fbf8f4] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-9 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a8794e]">Your account</p>
          <h1 className="mt-2 text-3xl font-bold text-[#3f3124] sm:text-4xl">My Pages</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6b5a49]">
            Quickly access your orders and saved products.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {pages.map((page) => (
            <Link
              key={page.path}
              to={page.path}
              className="group rounded-2xl border border-[#e8ddcf] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#c8a279] hover:shadow-lg sm:p-8"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5ece3] text-xl text-[#a8794e] transition group-hover:bg-[#c8a279] group-hover:text-white">
                {page.icon}
              </span>
              <h2 className="mt-5 text-xl font-bold text-[#4d3d2f]">{page.title}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-[#8c7661]">{page.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#a8794e]">
                {page.action} <FaArrowRight className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Pages;

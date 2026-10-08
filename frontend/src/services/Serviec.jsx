import {
  FaUndoAlt,
  FaPaperPlane,
  FaLifeRing,
  FaCreditCard,
  FaLock,
  FaHeadset,
} from "react-icons/fa";

const services = [
  {
    icon: <FaUndoAlt />,
    title: "FREE RETURN",
    text: "30 days money back guarantee!",
  },
  {
    icon: <FaPaperPlane />,
    title: "FREE SHIPPING",
    text: "Free shipping on all order",
  },
  {
    icon: <FaLifeRing />,
    title: "SUPPORT 24/7",
    text: "We support online 24 hrs a day",
  },
  {
    icon: <FaCreditCard />,
    title: "RECEIVE GIFT CARD",
    text: "Receive gift all over order ₹50",
  },
  {
    icon: <FaLock />,
    title: "SECURE PAYMENT",
    text: "We Value Your Security",
  },
  {
    icon: <FaHeadset />,
    title: "ONLINE SERVICE",
    text: "Free return products in 30 days",
  },
];

export default function Services() {
  return (
    <section className="bg-white mt-10 border border-[#ece2d6]">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {services.map((item, index) => (
          <div
    key={index}
    className="group p-5 border-r border-b xl:border-b-0 border-[#ece2d6] overflow-hidden hover:bg-[#fcf8f3] transition-all duration-300"
  >
            <div className="service-content flex items-start gap-5">
  {/* Icon */}
  <div className="text-3xl text-[#b58b61] flex-shrink-0 transition duration-300 group-hover:scale-110 mt-4">
    {item.icon}
  </div>

  {/* Text */}
  <div>
    <h3 className=" font-bold uppercase text-[#333] leading-6 ">
      {item.title}
    </h3>

    <p className="mt-2 text-gray-500 leading-7">
      {item.text}
    </p>
  </div>
</div>
          </div>
        ))}
      </div>
    </section>
  );
}
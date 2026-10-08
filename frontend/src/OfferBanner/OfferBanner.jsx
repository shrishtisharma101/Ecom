import { useEffect, useRef, useState } from "react";

// cameraImage aur watchImage baad me import kar lena
import cameraImage from "../assets/images/cam1.png";
import watchImage from "../assets/images/watch2.png";

const OfferCards = () => {
  const sectionRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
        }
      },
      {
        threshold: 0.25,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
   <section
  ref={sectionRef}
  className="max-w-[1400px] mx-auto px-5 lg:px-8 py-10 overflow-hidden"
>
  <div className="grid lg:grid-cols-2 gap-6">

    {/* LEFT CARD */}

    <div
      className={`
      bg-white
      rounded-2xl
      border
      border-[#eadfd1]
      h-[240px]
      p-5 lg:p-6
      flex
      justify-between
      items-center
      shadow-sm
      hover:shadow-xl
      transition-all
      duration-500
      ${show ? "animate-left" : "opacity-0"}
      `}
    >

      <div>

        <p className="text-gray-500 text-lg leading-6 max-w-[220px]">
          Find The Best Camera for You!
        </p>

        <h3 className="text-[#c58d5d] text-3xl font-semibold mt-3">
          Smart Camera
        </h3>

        <h2 className="mt-2 text-[56px] leading-none">
          <span className="text-orange-600 font-extrabold">
            40%
          </span>

          <span className="text-[#c58d5d] font-extrabold ml-3">
            Off
          </span>
        </h2>

      </div>

      <div className="ml-4">

        <img
          src={cameraImage}
          alt=""
          className="w-[210px] object-contain hover:scale-110 duration-500"
        />

      </div>

    </div>





    {/* RIGHT CARD */}

    <div
      className={`
      bg-white
      rounded-2xl
      border
      border-[#eadfd1]
      h-[240px]
      p-5 lg:p-6
      flex
      justify-between
      items-center
      shadow-sm
      hover:shadow-xl
      transition-all
      duration-500
      ${show ? "animate-right" : "opacity-0"}
      `}
    >

      <div>

        <p className="text-gray-500 text-lg leading-6 max-w-[220px]">
          Find The Best Watches for You!
        </p>

        <h3 className="text-[#c58d5d] text-3xl font-semibold mt-3">
          Smart Watch
        </h3>

        <h2 className="mt-2 text-[56px] leading-none">
          <span className="text-orange-600 font-extrabold">
            20%
          </span>

          <span className="text-[#c58d5d] font-extrabold ml-3">
            Off
          </span>
        </h2>

      </div>

      <div className="ml-4">

        <img
          src={watchImage}
          alt=""
          className="w-[210px] object-contain hover:scale-110 duration-500"
        />

      </div>

    </div>

  </div>
</section>
  );
};

export default OfferCards;
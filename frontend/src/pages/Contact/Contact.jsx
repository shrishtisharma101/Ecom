import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaChevronRight,
  FaUser,
  FaPaperPlane,
  FaPhone,
  FaEnvelope as FaEnvelopeIcon,
  FaCheckCircle,
} from "react-icons/fa";

// Import Banner Image
import shopBanner from "../../assets/images/shop.jpg";
import Footer from "../../components/Footer/Footer";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Remove error when user starts typing
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // ==========================================
  // HANDLE CONTACT FORM SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage("");
    setIsSubmitted(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      // Backend error
      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send message"
        );
      }

      // Success
      setIsSubmitted(true);

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        project: "",
        subject: "",
        message: "",
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);

    } catch (error) {
      console.error("Contact Form Error:", error);

      setErrorMessage(
        error.message ||
          "Unable to send message. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6ede0]">

      {/* ==========================================
          BANNER SECTION
      ========================================== */}

      <section className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${shopBanner})`,
            backgroundAttachment: "fixed",
          }}
        ></div>

        <div className="absolute inset-0 bg-orange-400/30"></div>

        <div
          className={`
            relative z-10 h-full flex flex-col items-center justify-center
            px-4 sm:px-6 lg:px-8
            transition-all duration-700 ease-out
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }
          `}
        >

          <h1
            style={{ color: "#f8f5f3" }}
            className={`
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold
              [text-shadow:_0_2px_10px_rgba(0,0,0,0.5)]
              transition-all duration-700 delay-100
              ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }
            `}
          >
            Contact Us
          </h1>

          <div className="flex items-center justify-center gap-2 text-sm sm:text-base mt-3 sm:mt-4">

            <Link
              to="/"
              className="text-white hover:text-orange-700 transition-colors duration-300 flex items-center gap-1"
            >
              <FaHome size={14} />
              Home
            </Link>

            <FaChevronRight
              size={12}
              className="text-white/60"
            />

            <span className="text-white/70 hover:text-orange-700 cursor-pointer">
              Pages
            </span>

            <FaChevronRight
              size={12}
              className="text-white/60"
            />

            <span className="text-white font-semibold">
              Contact
            </span>

          </div>
        </div>
      </section>


      {/* ==========================================
          CONTACT CONTENT
      ========================================== */}

      <div className="relative z-20 -mt-8 sm:-mt-12 lg:-mt-16">

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-[#f6ede0] rounded-t-3xl sm:rounded-t-4xl pt-8 sm:pt-12 lg:pt-16">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div
              className={`
                text-center mb-8 sm:mb-12 lg:mb-16
                transition-all duration-700 delay-100
                ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }
              `}
            >

              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4d3d2f]"
                style={{ fontWeight: 800 }}
              >
                Get{" "}
                <span className="text-[#c8a279]">
                  In
                </span>{" "}
                Touch
              </h2>

              <div className="w-16 h-1 bg-[#c8a279] rounded-full mx-auto mt-3 mb-4"></div>

              <div className="flex justify-center">

                <p className="text-[#8c7661] max-w-2xl text-sm sm:text-base text-center">
                  We are here for you! How can we help, We are here for you!
                </p>

              </div>

            </div>


            {/* ==========================================
                CONTACT GRID
            ========================================== */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">


              {/* ==========================================
                  LEFT COLUMN - CONTACT FORM
              ========================================== */}

              <div
                className={`
                  bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#e3d3c2]
                  transition-all duration-700 delay-200
                  ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }
                `}
              >

                <h3 className="text-2xl font-bold text-[#4d3d2f] mb-6">
                  Send Your Message
                </h3>


                {/* ==========================================
                    INFO MESSAGE
                ========================================== */}

                <div className="bg-[#faf0e8] rounded-xl p-4 mb-6">

                  <p className="text-sm text-[#8c7661]">
                    Have a question or need help? Send us a
                    message and we'll get back to you soon.
                  </p>

                </div>


                {/* ==========================================
                    ERROR MESSAGE
                ========================================== */}

                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">

                    <p className="text-sm font-medium">
                      {errorMessage}
                    </p>

                  </div>
                )}


                {/* ==========================================
                    SUCCESS MESSAGE
                ========================================== */}

                {isSubmitted && (
                  <div className="bg-green-50 border border-green-200 text-green-600 rounded-xl p-4 mb-6">

                    <div className="flex items-center gap-2">

                      <FaCheckCircle />

                      <p className="text-sm font-medium">
                        Your message has been sent successfully!
                      </p>

                    </div>

                  </div>
                )}


                {/* ==========================================
                    FORM
                ========================================== */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  {/* NAME + EMAIL */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* NAME */}

                    <div>

                      <label className="block text-sm font-semibold text-[#4d3d2f] mb-1.5 text-left">
                        Your Name
                      </label>

                      <div className="relative">

                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                          <FaUser className="text-[#8c7661] text-sm" />

                        </div>

                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#e3d3c2] bg-white focus:border-[#c8a279] outline-none transition-all duration-300 text-sm"
                          placeholder="Enter your name"
                          required
                        />

                      </div>

                    </div>


                    {/* EMAIL */}

                    <div>

                      <label className="block text-sm font-semibold text-[#4d3d2f] mb-1.5 text-left">
                        Your Email
                      </label>

                      <div className="relative">

                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                          <FaEnvelopeIcon className="text-[#8c7661] text-sm" />

                        </div>

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#e3d3c2] bg-white focus:border-[#c8a279] outline-none transition-all duration-300 text-sm"
                          placeholder="Enter your email"
                          required
                        />

                      </div>

                    </div>

                  </div>


                  {/* PHONE + PROJECT */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* PHONE */}

                    <div>

                      <label className="block text-sm font-semibold text-[#4d3d2f] mb-1.5 text-left">
                        Your Phone
                      </label>

                      <div className="relative">

                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                          <FaPhone className="text-[#8c7661] text-sm" />

                        </div>

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#e3d3c2] bg-white focus:border-[#c8a279] outline-none transition-all duration-300 text-sm"
                          placeholder="Enter your phone"
                        />

                      </div>

                    </div>


                    {/* PROJECT */}

                    <div>

                      <label className="block text-sm font-semibold text-[#4d3d2f] mb-1.5 text-left">
                        Your Project
                      </label>

                      <div className="relative">

                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                          <FaPaperPlane className="text-[#8c7661] text-sm" />

                        </div>

                        <input
                          type="text"
                          name="project"
                          value={formData.project}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#e3d3c2] bg-white focus:border-[#c8a279] outline-none transition-all duration-300 text-sm"
                          placeholder="Enter your project"
                        />

                      </div>

                    </div>

                  </div>


                  {/* SUBJECT */}

                  <div>

                    <label className="block text-sm font-semibold text-[#4d3d2f] mb-1.5 text-left">
                      Subject
                    </label>

                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-full border border-[#e3d3c2] bg-white focus:border-[#c8a279] outline-none transition-all duration-300 text-sm"
                      placeholder="Enter subject"
                      required
                    />

                  </div>


                  {/* MESSAGE */}

                  <div>

                    <label className="block text-sm font-semibold text-[#4d3d2f] mb-1.5 text-left">
                      Message
                    </label>

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 rounded-2xl border border-[#e3d3c2] bg-white focus:border-[#c8a279] outline-none transition-all duration-300 text-sm resize-none"
                      placeholder="Write your message here..."
                      required
                    ></textarea>

                  </div>


                  {/* ==========================================
                      SUBMIT BUTTON
                  ========================================== */}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                      w-full bg-[#c8a279] text-white py-3 rounded-full
                      font-semibold transition-all duration-300
                      flex items-center justify-center gap-2 group
                      ${
                        isLoading
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:bg-[#b07a4b] hover:scale-[1.02] hover:shadow-xl"
                      }
                    `}
                  >

                    {isLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

                        <span>
                          Sending...
                        </span>
                      </>
                    ) : isSubmitted ? (
                      <>
                        <FaCheckCircle className="animate-bounce" />

                        <span>
                          Message Sent!
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          Send Message
                        </span>

                        <span className="transition-all duration-300 group-hover:translate-x-2">
                          →
                        </span>
                      </>
                    )}

                  </button>

                </form>

              </div>


              {/* ==========================================
                  RIGHT COLUMN - MAP
              ========================================== */}

              <div
                className={`
                  transition-all duration-700 delay-300
                  ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }
                `}
              >

                <div className="bg-white rounded-3xl overflow-hidden border border-[#e3d3c2] h-full min-h-[500px] sm:min-h-[550px] lg:min-h-[600px]">

                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5926761416!2d77.22787191508256!3d28.612755582423908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2e9ffbd1d07%3A0x61466ca15602c7c!2sNoida%20Sector%2090!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map"
                    className="hover:scale-105 transition-transform duration-700"
                  ></iframe>

                </div>

              </div>

            </div>

          </div>
        </div>
      </div>


      {/* ==========================================
          FOOTER
      ========================================== */}

      <Footer />

    </div>
  );
};

export default Contact;

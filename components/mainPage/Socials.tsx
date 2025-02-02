import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Socials() {
  return (
    <section className="relative flex justify-center items-center h-[400px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/socials-bg.jpg')" }} // Update with actual image path
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <p className="text-lg md:text-xl font-light mb-6">
          We want to stay in touch with you! Please follow us on social media so we can keep in touch.
        </p>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 text-2xl">
          <a href="#" className="hover:text-gray-300 transition"><FaFacebookF /></a>
          <a href="#" className="hover:text-gray-300 transition"><FaTwitter /></a>
          <a href="#" className="hover:text-gray-300 transition"><FaInstagram /></a>
          <a href="#" className="hover:text-gray-300 transition"><FaLinkedinIn /></a>
        </div>
      </div>
    </section>
  );
}

import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer >
      <div className="py-14 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold ">TropiPine 🍍</h2>
          <p className="mt-3 text-sm">
            Fresh from the farm, sweet from the heart .
            we ensure the highest quality in fruits
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li><a href="/" className="hover:text-primary">Home</a></li>
            <li><a href="/about" className="hover:text-primary">About</a></li>
            <li><a href="/shop" className="hover:text-primary">Shop</a></li>
            <li><a href="/contact" className="hover:text-primary">Contact</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="flex gap-4 mt-3">
            <a href="#" className="hover:text-primary"><Facebook /></a>
            <a href="#" className="hover:text-primary"><Twitter /></a>
            <a href="#" className="hover:text-primary"><Instagram /></a>
            <a href="mailto:info@tropipine.com" className="hover:text-primary"><Mail /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-700 py-4 ">
        © {new Date().getFullYear()} TropiPine. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

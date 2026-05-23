import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">🍍 TropiPine</h3>
            <p className="text-gray-300">Fresh tropical fruits delivered to your door.</p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-green-400"><FaFacebook size={20} /></a>
              <a href="#" className="hover:text-green-400"><FaTwitter size={20} /></a>
              <a href="#" className="hover:text-green-400"><FaInstagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-green-400">Home</a></li>
              <li><a href="/shop" className="hover:text-green-400">Shop</a></li>
              <li><a href="/gallery" className="hover:text-green-400">Gallery</a></li>
              <li><a href="/about" className="hover:text-green-400">About Us</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-green-400">FAQ</a></li>
              <li><a href="#" className="hover:text-green-400">Shipping Info</a></li>
              <li><a href="#" className="hover:text-green-400">Returns</a></li>
              <li><a href="#" className="hover:text-green-400">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <FaPhone />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope />
                <span>info@tropipine.com</span>
              </div>
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TropiPine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

import { Link } from "react-router";  
import ThemeSelector from "./ThemeSelector.jsx";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4 z-50 relative shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex-1">
          <Link 
            to="/" 
            className="text-2xl font-extrabold hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            TropiPine
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-gray-900 dark:text-white font-semibold">
          <Link to="/" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">About</Link>
          <Link to="/gallery" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Gallery</Link>
          <Link to="/shop" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Shop</Link>
          <Link to="/cart" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Cart</Link>
          <Link to="/user" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">User</Link>
        </div>

        {/* Mobile Burger Menu */}
        <div className="md:hidden flex items-center">
          <div className="dropdown dropdown-end ml-2">
            <label tabIndex={0} className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-900 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-4 shadow-lg rounded-xl w-56 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <li><Link to="/" className="hover:text-orange-500 dark:hover:text-orange-400">Home</Link></li>
              <li><Link to="/about" className="hover:text-orange-500 dark:hover:text-orange-400">About</Link></li>
              <li><Link to="/gallery" className="hover:text-orange-500 dark:hover:text-orange-400">Gallery</Link></li>
              <li><Link to="/shop" className="hover:text-orange-500 dark:hover:text-orange-400">Shop</Link></li>
              <li><Link to="/cart" className="hover:text-orange-500 dark:hover:text-orange-400">Cart</Link></li>
              <li><Link to="/user" className="hover:text-orange-500 dark:hover:text-orange-400">User</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

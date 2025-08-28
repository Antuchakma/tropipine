import React from 'react';
import ThemeSelector from '../../lib/ThemeSelector.jsx';
import { Link } from 'react-router';
import f1 from '../../assets/img/f1.jpg';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900 text-base-content dark:text-white">
      
      {/* Navbar */}
      <nav className="bg-base-200 dark:bg-gray-800 p-2 sm:p-2 md:p-4 lg:p-4 xl:p-6 z-50 relative">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex-1">
            <Link to="/" className="text-xl font-bold hover:text-primary transition-colors">
              TropiPine
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
            <ThemeSelector />
          </div>

          {/* Mobile Burger Menu */}
          <div className="md:hidden flex items-center">
            <ThemeSelector />
            <div className="dropdown dropdown-end ml-2">
              <label tabIndex={0} className="btn btn-square btn-ghost">
                {/* Burger icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 dark:bg-gray-800 rounded-box w-52"
              >
                <li>
                  <Link to="/about" className="hover:text-primary">About</Link>
                </li>
                <li>
                  <Link to="/gallery" className="hover:text-primary">Gallery</Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-primary">Shop</Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-primary">Cart</Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary">Login</Link>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </nav>

      {/* Hero section */}
      <div className="p-6">
        <div className="relative overflow-hidden">
          <img src={f1} alt="farmer" className="w-full h-auto object-cover opacity-75" />

          {/* Overlay on image */}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-12 bg-black/30 z-10">
            <div className="flex gap-3"> 
              <button className="btn">hello</button>
              <button className="btn">hello</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;

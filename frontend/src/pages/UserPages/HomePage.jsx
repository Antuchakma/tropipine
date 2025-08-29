import React from "react";
import Navbar from "../../lib/Navbar.jsx";
import Footer from "../../lib/Footer.jsx";
import heroImage from "../../assets/img/f1.jpg"; // replace with your actual image


const HomePage = () => {
  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900 text-base-content dark:text-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-100 via-yellow-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-20">
          {/* Left Content */}
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
              Welcome to <span className="text-orange-500">TropiPine</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-xl">
              Fresh, organic, and tropical — delivering nature’s sweetness
              straight from the farm to your table.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4">
              <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition">
                Shop Now
              </button>
              <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
            <img
              src={heroImage}
              alt="Fresh fruits"
              className="rounded-2xl shadow-2xl w-full max-w-md"
            />
          </div>
        </div>

        {/* Adaptive Wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-20 md:h-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            d="M0,160L40,186.7C80,213,160,267,240,256C320,245,400,171,480,154.7C560,139,640,181,720,208C800,235,880,245,960,229.3C1040,213,1120,171,1200,154.7C1280,139,1360,149,1400,154.7L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
            className="fill-white dark:fill-gray-900"
          ></path>
        </svg>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Why Choose Us?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            We don’t just deliver fruits — we deliver freshness, health, and
            happiness. Every product is hand-selected to ensure top quality.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="p-6 rounded-2xl shadow bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
              <h3 className="text-xl font-semibold text-orange-500">Farm Fresh</h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                Handpicked at peak ripeness and delivered quickly to keep the
                natural taste alive.
              </p>
            </div>
            <div className="p-6 rounded-2xl shadow bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
              <h3 className="text-xl font-semibold text-orange-500">Eco-Friendly</h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                Grown using sustainable methods to preserve the earth for future
                generations.
              </p>
            </div>
            <div className="p-6 rounded-2xl shadow bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
              <h3 className="text-xl font-semibold text-orange-500">Healthy Living</h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                Packed with nutrition to boost your health naturally and
                deliciously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Taste the Freshness Today
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Join thousands of happy customers who enjoy the sweet, juicy, and
          organic fruits from TropiPine.
        </p>
        <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition">
          Get Started
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;

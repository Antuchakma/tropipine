import React from "react";
import Navbar from "../../lib/Navbar.jsx";
import Footer from "../../lib/Footer.jsx";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900 text-base-content dark:text-white flex flex-col">
      <Navbar />

      {/* Hero Section with Adaptive Wave */}
      <section className="relative bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black py-20">
        <div className="container mx-auto text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
            About <span className="text-orange-500">TropiPine</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            At TropiPine, we believe that nature offers the sweetest gifts —
            fresh, organic, and full of flavor. Our mission is to bring farm-fresh fruits
            directly to your table with love, care, and sustainability.
          </p>
        </div>

        {/* Adaptive Wave SVG */}
        <svg
          className="absolute bottom-0 left-0 w-full h-20 md:h-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            d="M0,224L30,192C60,160,120,96,180,85.3C240,75,300,117,360,144C420,171,480,181,540,176C600,171,660,149,720,144C780,139,840,149,900,160C960,171,1020,181,1080,192C1140,203,1200,213,1260,186.7C1320,160,1380,96,1410,64L1440,32L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
            className="fill-white dark:fill-gray-900"
          ></path>
        </svg>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-gray-900 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            From mango orchards to pineapple fields, we ensure every fruit is
            handpicked at its peak ripeness. Our farmers work with dedication,
            using eco-friendly methods to preserve the natural goodness of the land.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-black relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
            Our Journey
          </h2>
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-orange-300 dark:border-orange-500"></div>

            {/* Timeline Item */}
            <div className="mb-12 flex justify-between items-center w-full">
              <div className="order-1 w-5/12"></div>
              <div className="z-20 flex items-center order-1 bg-orange-500 shadow-xl w-8 h-8 rounded-full">
                <span className="mx-auto text-white font-semibold">2025</span>
              </div>
              <div className="order-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-5/12 px-6 py-4 text-left">
                <h3 className="font-bold text-orange-500 text-lg">Founded</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  TropiPine was established with a mission to bring fresh, organic tropical fruits
                  straight from farms to households.
                </p>
              </div>
            </div>

            {/* Timeline Item */}
            <div className="mb-12 flex justify-between items-center w-full flex-row-reverse">
              <div className="order-1 w-5/12"></div>
              <div className="z-20 flex items-center order-1 bg-orange-500 shadow-xl w-8 h-8 rounded-full">
                <span className="mx-auto text-white font-semibold">2026</span>
              </div>
              <div className="order-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-5/12 px-6 py-4 text-left">
                <h3 className="font-bold text-orange-500 text-lg">Growth</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  The company expanded its product range and reached more families
                  nationwide while maintaining eco-friendly practices.
                </p>
              </div>
            </div>

            {/* Timeline Item */}
            <div className="flex justify-between items-center w-full">
              <div className="order-1 w-5/12"></div>
              <div className="z-20 flex items-center order-1 bg-orange-500 shadow-xl w-8 h-8 rounded-full">
                <span className="mx-auto text-white font-semibold">2027+</span>
              </div>
              <div className="order-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-5/12 px-6 py-4 text-left">
                <h3 className="font-bold text-orange-500 text-lg">Still Growing</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  TropiPine continues to innovate and expand while staying true
                  to its mission of freshness, sustainability, and community support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-6 grid gap-10 md:grid-cols-3 text-center">
          <div className="p-6 rounded-2xl shadow bg-white dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-orange-500">Freshness</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              We guarantee that our fruits are always fresh and never stored
              for long periods.
            </p>
          </div>
          <div className="p-6 rounded-2xl shadow bg-white dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-orange-500">Sustainability</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Our farming practices respect nature and maintain the health of the soil.
            </p>
          </div>
          <div className="p-6 rounded-2xl shadow bg-white dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-orange-500">Community</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              We empower local farmers and support communities to thrive with us.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;

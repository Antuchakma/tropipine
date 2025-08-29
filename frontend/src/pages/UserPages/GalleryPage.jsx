import React from "react";
import Navbar from "../../lib/Navbar.jsx";
import Footer from "../../lib/Footer.jsx";

// Sample images for gallery (replace with real images)
const galleryImages = [
  "https://via.placeholder.com/400x300.png?text=Fruit+1",
  "https://via.placeholder.com/400x300.png?text=Fruit+2",
  "https://via.placeholder.com/400x300.png?text=Fruit+3",
  "https://via.placeholder.com/400x300.png?text=Fruit+4",
  "https://via.placeholder.com/400x300.png?text=Fruit+5",
  "https://via.placeholder.com/400x300.png?text=Fruit+6",
];

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 py-20">
        <div className="container mx-auto text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">
            Our <span className="text-orange-500">Gallery</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Take a look at our fresh fruits and farm moments, captured with love and care.
          </p>
        </div>

        {/* Wave SVG */}
        <svg
          className="absolute bottom-0 left-0 w-full h-20 md:h-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            d="M0,224L30,192C60,160,120,96,180,85.3C240,75,300,117,360,144C420,171,480,181,540,176C600,171,660,149,720,144C780,139,840,149,900,160C960,171,1020,181,1080,192C1140,203,1200,213,1260,186.7C1320,160,1380,96,1410,64L1440,32L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
            className="fill-white"
          ></path>
        </svg>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Explore Our Farm
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GalleryPage;

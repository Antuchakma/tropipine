import React, { useState, useEffect } from "react";
import { Link } from "react-router"; // use react-router-dom instead of react-router
import f1 from "../../assets/img/f1.jpg";
import Navbar from "../../lib/Navbar.jsx";
import Footer from "../../lib/Footer.jsx";

const HomePage = () => {
  // Temporary products (later fetched from DB)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Katimon Mango",
      price: "$10",
      image: "https://via.placeholder.com/300x200.png?text=Mango",
      stock: true,
    },
    {
      id: 2,
      name: "Premium Gourmoti",
      price: "$12",
      image: "https://via.placeholder.com/300x200.png?text=Gourmoti",
      stock: false,
    },
    {
      id: 3,
      name: "TropiPine Pineapple",
      price: "$15",
      image: "https://via.placeholder.com/300x200.png?text=Pineapple",
      stock: true,
    },
  ]);

  // Future scope: fetch from DB
  // useEffect(() => {
  //   fetch("/api/products?limit=3")
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data));
  // }, []);

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900 text-base-content dark:text-white">
      
     <Navbar/>
    
      {/* Hero section */}
      <div className="-py-6">
        <div className="relative overflow-hidden">
          <img src={f1} alt="farmer" className="w-full h-auto object-cover opacity-75" />

          
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-12 bg-black/30 z-10">
            <h1 className="font-extrabold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              TropiPine
            </h1>
            <p className="mt-4 py-4 text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl">
              Fresh from the farm, sweet from the heart 
            </p>
            <div className="flex gap-3">
              <button className="btn">Contact Us</button>
              <button className="btn">Our Fruits</button>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="text-center my-10">
          <h2 className="text-3xl md:text-4xl sm:text-2xl font-extrabold tracking-wide">FEATURED</h2>
          <div className="flex items-center justify-center mt-3">
            <div className="w-16 h-[2px] bg-gray-300"></div>
            <div className="mx-3 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
              <span className="text-2xl">🍍</span>
            </div>
            <div className="w-16 h-[2px] bg-gray-300"></div>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src={f1}
                  alt={product.name}
                  className={`w-full h-48 object-cover ${!product.stock ? "opacity-50" : ""}`}
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">{product.name}</h3>
                <p className="text-lg font-semibold">{product.price}</p>
                {!product.stock && <span className="badge badge-error">Out of Stock</span>}
                <div className="card-actions justify-end">
                  <button className="btn btn-primary btn-sm" disabled={!product.stock}>
                    {product.stock ? "Add to Cart" : "Notify Me"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Browse More Button */}
        <div className="text-center mt-10">
          <Link to="/shop" className="btn btn-outline btn-primary">
            Browse More
          </Link>
        </div>

      </div>
        <Footer/>
    </div>
  );
};

export default HomePage;

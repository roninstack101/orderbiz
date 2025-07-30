import React, { useState, useEffect } from "react";
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.png'
import image3 from '../assets/image3.png'

export default function RegistrationPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isShop, setIsShop] = useState(false);

  const images = [image1, image2, image3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] px-4">
       <div className="bg-white rounded-3xl shadow-xl flex w-full max-w-6xl overflow-hidden">
        {/* Left Slideshow */}
       <div className="hidden md:flex relative overflow-hidden justify-center items-center bg-[#f0ebfc] w-1/2 p-6">
  {images.map((img, index) => {
    const isActive = index === currentImage;
    const isPrev =
      (currentImage === 0 && index === images.length - 1) || index === currentImage - 1;

    return (
      <img
        key={index}
        src={img}
        alt={`Slide ${index}`}
        className={`
          absolute w-4/5 h-auto object-contain transition-all duration-700 ease-in-out
          ${isActive ? "translate-x-0 opacity-100 z-20" : ""}
          ${isPrev ? "-translate-x-full opacity-0 z-10" : ""}
          ${!isActive && !isPrev ? "translate-x-full opacity-0 z-0" : ""}
        `}
      />
    );
  })}
</div>



        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto max-h-[90vh]">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Registration</h2>
          <p className="text-gray-500 mb-6">Join now to shop smarter and faster!</p>

          <form className="space-y-5">
            {/* User Details Heading */}
            {isShop && (
              <h3 className="text-lg font-semibold text-gray-700">User Details</h3>
            )}

            {/* User Fields */}
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
             <input
              type="text"
              placeholder="Phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
             <input
              type="text"
              placeholder="Confirm password"
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Shop Fields (when checkbox is checked) */}
            {isShop && (
              <>
                <h3 className="text-lg font-semibold text-gray-700 mt-6">Shop Details</h3>
                <input
                  type="text"
                  placeholder="Shop Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  placeholder="Category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </>
            )}

            {/* Checkbox - BELOW shop fields */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="registerAsShop"
                checked={isShop}
                onChange={(e) => setIsShop(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="registerAsShop" className="text-gray-700 text-sm">
                Register as Shop
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              className={`w-full ${isShop ? "bg-[#f76673]" : "bg-[#00c0a0]"} text-white py-3 rounded-full text-lg font-semibold hover:opacity-90 transition`}
            >
              {isShop ? "REQUEST" : "REGISTER"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center mt-4 text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-[#f76673] font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

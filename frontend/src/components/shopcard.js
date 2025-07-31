import React from "react";

export default function ShopCard({ image, name, address, category, phone }) {
  return (
    <div className="bg-gray-200 rounded-xl p-4 shadow-md w-full max-w-md mx-auto">
      {/* Container switches layout based on screen size */}
      <div className="flex flex-col  items-center  gap-4">
        
        {/* Shop Image */}
        <img
          src={image}
          alt={name}
          className="w-full md:w-50 h-40 object-cover rounded-lg"
        />

        {/* Shop Details */}
        <div className="text-sm md:text-base text-black space-y-1 md:space-y-2">
          <p>
            <span className="font-semibold">Name:</span> {name}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {address}
          </p>
          <p>
            <span className="font-semibold">Category:</span> {category}
          </p>
          <p>
            <span className="font-semibold">Contact:</span> {phone}
          </p>
        </div>
      </div>
    </div>
  );
}

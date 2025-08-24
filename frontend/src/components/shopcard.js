import React from "react";

export default function ShopCard({ image, name, address, category, phone }) {
  console.log("phone number: ", phone);
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg w-full max-w-md mx-auto transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 overflow-hidden">
      <div className="flex flex-col gap-5">
        {/* Shop Image with Overlay */}
        <div className="relative rounded-xl overflow-hidden h-48">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
          <div className="absolute bottom-4 left-4">
            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              {category}
            </span>
          </div>
        </div>

        {/* Shop Details */}
        <div className="space-y-4 px-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 truncate">{name}</h3>
            <div className="flex items-center mt-1 text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm truncate">{address}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-gray-700">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-sm font-medium">{phone}</span>
            </div>
            
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
              View Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
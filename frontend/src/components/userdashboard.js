import React, { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import bgImage from "../assets/counter.png";
import ShopCard from "./shopcard";
import bgImag from "../assets/counter.png";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon } from "@hugeicons/core-free-icons";
import axios from "axios";

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function EcommerceDashboard() {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(500);
  const [showModal, setShowModal] = useState(false);

  // Fetch categories
  useEffect(() => {
    axios.get("http://localhost:4000/api/shopcategory/category").then((res) =>
      setCategories(res.data)
    );
  }, []);

  // Fetch all shops
  useEffect(() => {
    axios.get("http://localhost:4000/api/shopcategory/shops").then((res) => {
      const approvedShops = res.data.filter((shop) => shop.isApproved);
      setShops(approvedShops);
    });
  }, []);

  // Get user location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lon: longitude });
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  // Filter logic (by search, category, and distance)
  useEffect(() => {
    if (!userLocation) return;

    const filtered = shops.filter((shop) => {
      const matchSearch = shop.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory =
        !selectedCategory || shop.category === selectedCategory;

      if (!shop.location || !shop.location.lat || !shop.location.lon)
        return false;

      const dist = haversineDistance(
        userLocation.lat,
        userLocation.lon,
        shop.location.lat,
        shop.location.lon
      );

      return matchSearch && matchCategory && dist <= radius;
    });

    setFilteredShops(filtered);
  }, [shops, searchTerm, selectedCategory, radius, userLocation]);

  const handleShopClick = (shopId) => {
    window.location.href = `/shop/${shopId}`;
  };

  return (
    <div className="h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#0067D8] py-4 px-6 z-20">
        <h1 className="text-white font-bold text-3xl">OrderBiz</h1>
        <div className="relative group">
          <UserCircle className="w-6 h-6 text-white cursor-pointer" />
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href="/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Profile
            </a>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Background Image and Search */}
      <div
        className="relative w-full h-[20pc] md:h-[20pc] xl:h-[500px] bg-cover bg-[position:50%_30%]"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div
            className="rounded-[50px] md:h-14 p-3 flex flex-wrap md:flex-nowrap gap-3 items-center justify-center w-full xl:max-w-2xl max-w-lg"
            style={{
              background: "rgba(255, 255, 255, 0.49)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <input
              type="text"
              placeholder="Search"
              className="flex-1 min-w-3 rounded-[25px] h-10 px-4 bg-white border border-gray-300 text-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 max-w-[100px] rounded-full bg-white border border-gray-300 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Shops List */}
      <div className="flex-grow overflow-y-auto bg-gray-100 z-0">
        <h1 className="text-2xl font-bold px-4 pt-6 pb-2">Nearby Shops</h1>
        <div className="p-4 bg-gray-100 min-h-[400px]">
          {filteredShops.length === 0 ? (
            <p className="text-center text-gray-500 mt-20">
              No shops available.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredShops.map((shop) => (
                <div
                  key={shop._id}
                  onClick={() => handleShopClick(shop._id)}
                  className="cursor-pointer"
                >
                  <ShopCard
                    image={bgImag}
                    name={shop.name}
                    address={shop.address}
                    category={shop.category}
                    phone={shop.phone || "+91 00000 00000"}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Button */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={() => setShowModal(true)}
          className="p-4 bg-[#0067D8] text-white rounded-full shadow-md"
        >
          <HugeiconsIcon icon={FilterIcon} size={32} strokeWidth={1} />
        </button>
      </div>

      {/* Filter Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-40">
          <div className="w-full bg-white rounded-t-2xl p-6 max-h-[50%] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filter Radius</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm">Search Radius: {radius} meters</label>
              <input
                type="range"
                min={100}
                max={5000}
                step={100}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { UserCircle, Funnel, ShoppingCart, History, MapPin, Search, X } from "lucide-react";
import bgImage from "../assets/counter.png";
import ShopCard from "../components/shopcard";
import axios from "axios";
import logo from "../assets/whitelogo.png";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(10000);
    // const [tempRadius, setTempRadius] = useState(radius);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    axios.get("http://localhost:4000/api/shopcategory/category")
      .then((res) => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // Get user's location once
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lon: longitude });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, []);

  // Fetch filtered shops from backend
  useEffect(() => {
    if (!userLocation) return;

    setIsLoading(true);
    axios
      .get("http://localhost:4000/api/shopcategory/nearby", {
        params: {
          lat: userLocation.lat,
          lng: userLocation.lon,
          distance: radius,
        },
      })
      .then((res) => {
        const nearby = res.data;

        const filtered = nearby.filter((shop) => {
          const matchSearch = shop.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const matchCategory =
            !selectedCategory || shop.category === selectedCategory;
          return matchSearch && matchCategory;
        });

        setShops(filtered);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching shops:", err);
        setIsLoading(false);
      });
  }, [searchTerm, selectedCategory, userLocation, radius]);

  const handleShopClick = (shopId) => {
    navigate(`/shop/${shopId}`);
  };

  const formatDistance = (meters) => {
    if (meters < 1000) return `${meters}m away`;
    return `${(meters / 1000).toFixed(1)}km away`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md py-2 px-6 flex justify-between items-center sticky top-0 z-30">
        {/* <h1 className="text-white font-bold text-2xl">OrderBiz</h1> */}
        <img src={logo} alt="OrderBiz Logo" className="w-[8rem]" />
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/orders")}
            className="text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            title="Order History"
          >
            <History size={22} />
          </button>
          
          <button 
            onClick={() => navigate("/cart")}
            className="text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            title="Shopping Cart"
          >
            <ShoppingCart size={22} />
          </button>
          
          <div className="relative group">
            <button className="text-white p-1 rounded-full hover:bg-blue-700 transition-colors">
              <UserCircle size={26} />
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
              <a
                href="/profile"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-b border-gray-100"
              >
                Profile
              </a>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <div className="relative w-full h-64 bg-gray-900">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-6 text-center">
            Discover Shops Near You
          </h2>
          
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-2 flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center px-3 py-2">
              <Search size={20} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search for shops..."
                className="w-full bg-transparent border-none outline-none text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="w-full md:w-auto flex items-center gap-2 border-t md:border-t-0 md:border-l border-gray-200 pt-2 md:pt-0 md:pl-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-auto bg-transparent border-none outline-none text-gray-700 text-sm py-2"
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
          
          {userLocation && (
            <div className="mt-4 flex items-center text-blue-100 text-sm">
              <MapPin size={14} className="mr-1" />
              <span>Searching near your location</span>
            </div>
          )}
        </div>
      </div>

      {/* Shops List */}
      <main className="flex-grow px-4 md:px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Nearby Shops</h2>
          
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-50 border border-blue-100 transition-colors"
          >
            <Funnel size={18} />
            <span>Filter</span>
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-blue-100 p-5 rounded-full mb-4">
              <MapPin size={40} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No shops found
            </h3>
            <p className="text-gray-500 max-w-md">
              {searchTerm || selectedCategory
                ? "Try adjusting your search or filter to find what you're looking for."
                : "No shops are available in your area. Try increasing the search radius."}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Funnel size={18} />
              Adjust Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {shops.map((shop) => (
              <div
                key={shop._id}
                onClick={() => handleShopClick(shop._id)}
                className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
              >
                <ShopCard
                  image={shop.image}
                  name={shop.name}
                  address={shop.address}
                  category={shop.category}
                  phone={shop.owner?.phone}
                  distance={shop.distance ? formatDistance(shop.distance) : ""}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Filter Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-40">
          <div className="w-full max-w-md bg-white rounded-t-2xl md:rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-800">Filter Shops</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block mb-3 text-gray-700 font-medium">
                Search Radius: {radius} meters
              </label>
              <input
                type="range"
                min={100}
                max={10000}
                step={100}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>100m</span>
                <span>5km</span>
                <span>10km</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
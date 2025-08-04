import React, { useEffect, useState} from "react";
import { UserCircle, Funnel} from "lucide-react";
import bgImage from "../assets/counter.png";
import ShopCard from "../components/shopcard";
import bgImag from "../assets/counter.png";
// import { HugeiconsIcon } from "@hugeicons/react";
// import { FilterIcon } from "@hugeicons/core-free-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function UserDashboard() {
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(5000);
  const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    axios.get("http://localhost:4000/api/shopcategory/category").then((res) =>
      setCategories(res.data)
    );
  }, []);

  // Get user's location once
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

  // Fetch filtered shops from backend
  useEffect(() => {
    if (!userLocation) return;

    axios
      .get("http://localhost:4000/api/shopcategory/shops", {
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
      });
  }, [searchTerm, selectedCategory, userLocation, radius]);

  const handleShopClick = (shopId) => {
    navigate(`/shop/${shopId}`);
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
                navigate("/");
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
          {shops.length === 0 ? (
            <p className="text-center text-gray-500 mt-20">No shops available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {shops.map((shop) => (
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
          className="fixed bottom-6 right-6 bg-blue-400 text-white p-4 rounded-full shadow-lg hover:bg-blue-500"
        >
         <Funnel className="w-6 h-6"/>
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
              <label className="block mb-2 text-sm">
                Search Radius: {radius} meters
              </label>
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



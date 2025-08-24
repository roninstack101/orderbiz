import { useEffect, useState, useMemo } from "react";
import { ShoppingCart, UserCircle, Search, ArrowLeft, Filter } from "lucide-react";
import image from "../assets/counter.png";
import ProductCard from "../components/userproductcard";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function ShopPage() {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userId = user?.userId;
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    if (!userId || !token) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(
        `http://localhost:4000/api/cart/getcart/${userId}`,
        config
      );

      const allItems = res.data.groupedByShop.flatMap(
        (shopGroup) => shopGroup.items
      );
      setCart(allItems);
    } catch (err) {
      console.error("Failed to fetch cart", err);
      setCart([]);
    }
  };

  useEffect(() => {
    if (!shopId) return;

    setIsLoading(true);
    Promise.all([
      axios.get(`http://localhost:4000/api/shopcategory/getshop/${shopId}`),
      axios.get(`http://localhost:4000/api/products/shopproduct/${shopId}`)
    ])
    .then(([shopRes, productsRes]) => {
      setShop(shopRes.data);
      setProducts(productsRes.data);
      setIsLoading(false);
    })
    .catch((err) => {
      console.error("Error loading data", err);
      setIsLoading(false);
    });
  }, [shopId]);

  useEffect(() => {
    fetchCart();
  }, [userId, token]);

  const updateCart = async (productId, type) => {
    const url =
      type === "add"
        ? "http://localhost:4000/api/cart/addcart"
        : "http://localhost:4000/api/cart/remove";
    const data = { userid: userId, productid: productId, quantity: 1 };
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.post(url, data, config);
      fetchCart();
    } catch (err) {
      console.error("Cart update failed", err);
    }
  };

  const displayedProducts = useMemo(() => {
    let filteredProducts = [...products];

    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filteredProducts;
  }, [products, searchTerm, sortBy]);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-white font-bold text-2xl">OrderBiz</h1>
        
        <div className="flex items-center gap-4">
         
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


      {/* Shop Banner */}
      <div className="px-4 md:px-6 pt-6">
        <div className=" relative h-48 md:h-56 w-full overflow-hidden rounded-2xl flex items-end shadow-lg">
          <img
            src={shop?.image || image}
            alt="Shop Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute inset-0 flex justify-start items-end p-6">
            <div>
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">
                {shop?.name || "Shop"}
              </h2>
              <p className="text-blue-100 text-sm md:text-base">
                Discover our collection of products
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-6 pt-8 pb-28">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h3 className="text-2xl font-bold text-gray-800">Products</h3>
          
          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 w-full md:w-auto hover:bg-gray-50 transition-colors"
              >
                <Filter size={18} />
                <span>Sort</span>
              </button>
              
              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 py-2">
                  <button
                    onClick={() => {
                      setSortBy("default");
                      setIsSortOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "default" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                  >
                    Default
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("price-asc");
                      setIsSortOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "price-asc" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("price-desc");
                      setIsSortOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "price-desc" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                  >
                    Price: High to Low
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
                >
                  <div className="bg-gray-200 h-40 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {displayedProducts.map((product) => {
              const cartItem = cart.find(
                (item) => item.product._id === product._id
              );
              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  quantity={cartItem?.quantity || 0}
                  onAdd={() => updateCart(product._id, "add")}
                  onRemove={() => updateCart(product._id, "remove")}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-blue-100 p-5 rounded-full mb-4">
              <Search size={40} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm ? "No products found" : "No products available"}
            </h3>
            <p className="text-gray-500 max-w-md">
              {searchTerm
                ? "Try adjusting your search or filter to find what you're looking for."
                : "This shop doesn't have any products listed yet."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <button
        onClick={() => navigate("/cart")}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105 z-20 flex items-center justify-center"
      >
        <ShoppingCart size={24} />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </button>
    </div>
  );
}
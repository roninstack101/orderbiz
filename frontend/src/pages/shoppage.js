import { useEffect, useState, useMemo } from "react";
import { ShoppingCart, UserCircle } from "lucide-react";
import image from "../assets/counter.png";
import ProductCard from "../components/userproductcard";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function ShopPage() {
  const { shopId } = useParams();
  // console.log(shopId);
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]); // This will be our master list
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  console.log(shopId)
  // 2. ✅ Add state for search and sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userId = user?.userId;
  const token = localStorage.getItem("token");
  console.log(userId);
  // console.log(userId);

  const fetchCart = async () => {
    if (!userId || !token) return; // No user, no cart

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(
        `http://localhost:4000/api/cart/getcart/${userId}`,
        config
      );

      // console.log("1. Raw API Response:", res.data);

      // The API returns { groupedByShop: [...] }. We need to flatten it.
      const allItems = res.data.groupedByShop.flatMap(
        (shopGroup) => shopGroup.items
      );
      //  console.log("2. Flattened Cart Items:", allItems);

      setCart(allItems);
    } catch (err) {
      console.error("Failed to fetch cart", err);
      setCart([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    if (!shopId) return;

    axios
      .get(`http://localhost:4000/api/shopcategory/getshop/${shopId}`)
      .then((res) => setShop(res.data))
      .catch((err) => console.error("Error loading shop info", err));

    axios
      .get(`http://localhost:4000/api/products/shopproduct/${shopId}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error loading products", err));
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
      // ✅ After the update is successful, just refetch the whole cart
      fetchCart();
    } catch (err) {
      console.error("Cart update failed", err);
    }
  };

  const displayedProducts = useMemo(() => {
    let filteredProducts = [...products];

    // Apply search filter
    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        // Default sort (e.g., by name or no specific order)
        break;
    }

    return filteredProducts;
  }, [products, searchTerm, sortBy]); // Recalculate only when these change

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#0067D8] py-4 mb-6 px-6 z-20">
        <h1 className="text-white font-bold text-3xl">OrderBiz</h1>
        <div className="relative group z-10">
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

      {/* Shop Banner */}
      <div className="px-4 md:px-6">
        <div className="relative h-48 md:h-56 w-full overflow-hidden rounded-xl flex items-end">
          <img
            src={image}
            alt="Shop Banner"
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 flex justify-start p-5 items-start">
            <h2 className="text-white px-4 py-2 rounded-lg">
              <span className="block text-3xl md:text-2xl font-medium">
                Welcome to,
              </span>
              <span className="block text-4xl md:text-5xl font-bold">
                {shop?.name || "Shop"}
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-6 pt-6 pb-20">
        {/* 4. ✅ Update the JSX with search and sort controls */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
          <h3 className="text-lg font-semibold">Products</h3>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-full w-full md:w-auto"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-full bg-white"
            >
              <option value="default">Sort by</option>
              <option value="price-asc">Price (lowest first)</option>
              <option value="price-desc">Price (highest first)</option>
            </select>
          </div>
        </div>

        {/* 5. ✅ Update the grid to use the new list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.length > 0 ? (
            displayedProducts.length > 0 ? (
              displayedProducts.map((product) => {
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
              })
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products match your search.
              </p>
            )
          ) : (
            Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-full h-32 bg-gray-200 rounded-md animate-pulse"
                ></div>
              ))
          )}
        </div>
      </div>

      {/* Floating Cart Button */}
      <button
        onClick={() => navigate("/cart")}
        className="fixed bottom-6 right-6 bg-blue-400 text-white p-4 rounded-full shadow-lg hover:bg-blue-500"
      >
        <ShoppingCart className="w-6 h-6" />
      </button>
    </div>
  );
}

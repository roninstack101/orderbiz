import { useEffect, useState } from "react";
import { ShoppingCart, UserCircle } from "lucide-react";
import image from '../assets/counter.png';
import ProductCard from "../components/productcard";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


export default function ShopPage() {
  const {shopId} = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userid");
  const token  = localStorage.getItem("token");

  useEffect(() => {
    if (!shopId) return;

    axios.get(`http://localhost:4000/api/shopcategory/getshop/${shopId}`)
      .then(res => setShop(res.data))
      .catch(err => console.error("Error loading shop info", err));

    axios.get(`http://localhost:4000/api/products/shopproduct/${shopId}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error loading products", err));
  }, [shopId]);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:4000/api/cart/getcart/${userId}`, {
          headers: {
    Authorization: `Bearer ${token}`,
  },
      })
        .then(res => setCart(res.data.items || []))
        .catch(() => setCart([]));
    }
  }, [userId]);

  const updateCart = (productId, type) => {
    const url = type === "add" ? "http://localhost:4000/api/cart/addcart" : "http://localhost:4000/api/cart/remove";
    axios.post(url, {
      userid: userId,
      productid: productId,
      quantity: 1,
       headers: {
    Authorization: `Bearer ${token}`,
  },
    })
      .then((res) => setCart(res.data.cart.items))
      .catch((err) => console.error("Cart update failed", err));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
     <div className="flex justify-between items-center bg-[#0067D8] py-4 mb-6 px-6 z-20">
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
              <span className="block text-3xl md:text-2xl font-medium">Welcome to,</span>
              <span className="block text-4xl md:text-5xl font-bold">{shop?.name || "Shop"}</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-6 pt-6 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Products</h3>
          <select className="px-2 py-1 border rounded">
            <option>Sort by</option>
            <option>Name</option>
            <option>Price</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.length > 0 ? (
            products.map((product) => {
              const cartItem = cart.find((item) => item.product._id === product._id);
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
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="w-full h-32 bg-gray-200 rounded-md animate-pulse"></div>
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

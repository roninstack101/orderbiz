import React, { useState, useEffect } from "react";
import axios from "axios";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";

export default function RegistrationPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isShop, setIsShop] = useState(false);

  // Form States
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    shopName: "",
    category: "",
    description: "",
    address: "",
  });

  const images = [image1, image2, image3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, password, confirmPassword, shopName, category, description, address } = form;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      if (isShop) {
        // Shop request
        const shopData = {
          name,
          email,
          phone,
          password,
          shop: {
            name: shopName,
            category,
            description,
            address,
          },
        };

        const res = await axios.post("http://localhost:4000/api/shopenquiries/request", shopData);
        alert(res.data.message);
        window.location.reload();

      } else {
        // Normal registration
        const userData = { name, email, phone, password };
        const res = await axios.post("http://localhost:4000/api/users/register", userData);
        alert(res.data.message);
        window.location.reload();

      }

      
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"  style={{
    background: "linear-gradient(139deg, rgba(255, 255, 255, 1) 8%, rgba(0, 103, 216, 1) 84%)",
  }}>
      <div className="bg-white rounded-3xl shadow-xl flex w-full max-w-6xl overflow-hidden">
        {/* Slideshow */}
        <div className="hidden md:flex relative overflow-hidden justify-center items-center bg-[#0068d8b3] w-1/2 p-6">
          {images.map((img, index) => {
            const isActive = index === currentImage;
            const isPrev =
              (currentImage === 0 && index === images.length - 1) ||
              index === currentImage - 1;

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

        {/* Form */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto max-h-[90vh]">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Registration</h2>
          <p className="text-gray-500 mb-6">Join now to shop smarter and faster!</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {isShop && (
              <h3 className="text-lg font-semibold text-gray-700">User Details</h3>
            )}

            {/* User Fields */}
            <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full" />
            <input type="text" name="email" placeholder="Email" value={form.email} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full" />
            <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full" />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full" />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full" />

            {isShop && (
              <>
                <h3 className="text-lg font-semibold text-gray-700 mt-6">Shop Details</h3>
                <input type="text" name="shopName" placeholder="Shop Name" value={form.shopName} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-full" />
                <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-full" />
                <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-full" />
                <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-full" />
              </>
            )}

            {/* Checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="registerAsShop" checked={isShop}
                onChange={(e) => setIsShop(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
              <label htmlFor="registerAsShop" className="text-gray-700 text-sm">Register as Shop</label>
            </div>

            <button type="submit"
              className={`w-full ${isShop ? "bg-[#f76673]" : "bg-[#00c0a0]"} text-white py-3 rounded-full text-lg font-semibold hover:opacity-90`}>
              {isShop ? "REQUEST" : "REGISTER"}
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-[#f76673] font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

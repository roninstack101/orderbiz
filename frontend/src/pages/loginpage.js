import React, { useState, useEffect } from "react";
import axios from "axios";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");


  const navigate = useNavigate();
  
  
  const images = [image1, image2, image3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  

 const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/users/login", {
        email,
        password,
      });

      toast.success(res.data.message);

      setemail("");
      setpassword("");

      const { token, user } = res.data;
      // console.log( token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("token", token);
    localStorage.setItem("userid", user.userId);

       if (token && user.role) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "shop_owner") {
        navigate("/shop/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } else {
      alert("Invalid login data received.");
    }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4"  style={{
    background: "linear-gradient(139deg, rgba(255, 255, 255, 1) 8%, rgba(0, 103, 216, 1) 84%)",
  }}>
      <div className="bg-white rounded-3xl shadow-xl flex w-full max-w-6xl overflow-hidden h-[550px]">
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
        <div className="w-full md:w-1/2 p-6 xl:px-10 md:px-10 overflow-y-auto max-h-[90vh] flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Login</h2>

          <form className="space-y-5" onSubmit={handleLogin}>
           

            {/* User Fields */}
            <input  type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              className="w-full px-4 py-3 border rounded-full" />
            
            <input  type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-full" />
           
           


            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#0067D8] text-white rounded-md hover:bg-blue-800 transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-500">
            Don't have an account?{" "}
            <a href="/register" className="text-[#f76673] font-medium hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

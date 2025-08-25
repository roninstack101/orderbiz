import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";

// Move libraries array outside of component to prevent re-renders
const libraries = ["places"];
// Store Google Maps API key in a constant outside the component
const googleMapsApiKey = process.env.REACT_APP_Maps_API_KEY;

export default function RegistrationPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isShop, setIsShop] = useState(false);
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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpRequestCount, setOtpRequestCount] = useState(0); // Track OTP requests
  const otpInputRefs = useRef([]);

  const navigate = useNavigate();
  const ahmedabadCenter = { lat: 23.0225, lng: 72.5714 };
  const [markerPosition, setMarkerPosition] = useState(ahmedabadCenter);
  const autocompleteRef = useRef(null);

  // Memoize options with useMemo to prevent unnecessary reloads
  const memoizedOptions = useMemo(
    () => ({
      id: "google-map-script",
      googleMapsApiKey: googleMapsApiKey || "", // guard empty
      libraries: libraries,
    }),
    []
  );

  const { isLoaded } = useJsApiLoader(memoizedOptions);

  useEffect(() => {
    if (!googleMapsApiKey) {
      // Provide a console hint during dev builds
      // eslint-disable-next-line no-console
      console.error(
        "Google Maps API key is missing (REACT_APP_Maps_API_KEY). Map will not load."
      );
    }
  }, []);

  const images = [image1, image2, image3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Autofocus the first OTP input when we enter OTP screen
  useEffect(() => {
    if (otpSent && otpInputRefs.current[0]) {
      otpInputRefs.current[0].focus();
    }
  }, [otpSent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleOtpChange = (index, value) => {
  if (!/^\d*$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  if (value && index < 5) {
    otpInputRefs.current[index + 1]?.focus();
  }

  if (index === 5 && value) {
    const fullOtp = newOtp.join("");
    if (fullOtp.length === 6) {
      // Pass the complete OTP string directly as an argument
      handleVerifyOtp(fullOtp);
    }
  }
};

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (isShop) {
      if (!form.shopName) newErrors.shopName = "Shop name is required";
      if (!form.category) newErrors.category = "Category is required";
      if (!form.description) newErrors.description = "Description is required";
      if (!form.address) newErrors.address = "Address is required";

      if (
        markerPosition.lat === ahmedabadCenter.lat &&
        markerPosition.lng === ahmedabadCenter.lng
      ) {
        newErrors.location = "Please set your shop location on the map";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMarkerDragEnd = (e) => {
    setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    if (errors.location) {
      setErrors({ ...errors, location: "" });
    }
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
    
     if (!place || !place.geometry) {
      console.error("User did not select a prediction from the dropdown.");
      return;
    }  
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        setMarkerPosition({ lat: location.lat(), lng: location.lng() });
        if (errors.location) {
          setErrors({ ...errors, location: "" });
        }
      }
    }
  };

  const sendOtp = async () => {
    // Prevent too many requests
    if (otpRequestCount >= 3) {
      toast.error("Too many OTP requests. Please wait before trying again.");
      return;
    }

    try {
      setOtpSending(true);
      setOtpRequestCount((prev) => prev + 1);

      // Optimistically show OTP UI immediately so the transition is instant
      if (!otpSent) setOtpSent(true);

      const response = await axios.post(
        "http://localhost:4000/api/otp/request-otp",
        {
          email: form.email,
        }
      );

      if (response.data.message === "OTP sent successfully") {
        setCountdown(60); // 60 seconds cooldown
        toast.success("OTP sent to your email");
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (error) {
      // Revert to form screen if we couldn't send
      setOtpSent(false);
      if (error.response && error.response.status === 429) {
        toast.error(
          "Too many requests. Please wait before requesting another OTP."
        );
        setCountdown(60); // Set cooldown period
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } finally {
      setOtpSending(false);
    }
  };

  // Accept an optional otpString argument
const handleVerifyOtp = async (otpString) => {
  // Use the argument if provided, otherwise join the state
  const enteredOtp = otpString || otp.join("");

  if (enteredOtp.length !== 6) {
    toast.error("Please enter a valid 6-digit OTP");
    return;
  }

  setOtpVerifying(true);

  try {
    const response = await axios.post(
      "http://localhost:4000/api/otp/verify-otp",
      {
        email: form.email,
        otp: enteredOtp, // Use the correct variable here
      }
    );

    if (response.data.message === "OTP verified successfully") {
      await completeRegistration();
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  } catch (error) {
    toast.error("OTP verification failed. Please try again.");
  } finally {
    setOtpVerifying(false);
  }
};

  const completeRegistration = async () => {
    setIsSubmitting(true);

    try {
      if (isShop) {
        const shopData = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          shop: {
            name: form.shopName,
            category: form.category,
            description: form.description,
            address: form.address,
            latitude: markerPosition.lat,
            longitude: markerPosition.lng,
          },
        };
        const res = await axios.post(
          "http://localhost:4000/api/shopenquiries/request",
          shopData
        );
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const userData = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        };
        const res = await axios.post(
          "http://localhost:4000/api/users/register",
          userData
        );
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // If OTP hasn't been sent yet, send it (transition is instant now)
    if (!otpSent) {
      await sendOtp();
      return;
    }

    // If OTP has been sent, verify it
    await handleVerifyOtp();
  };

  const resendOtp = async () => {
    if (countdown > 0 || otpSending) return;
    await sendOtp();
  };

  const mapContainerStyle = {
    height: "300px",
    width: "100%",
    borderRadius: "1rem",
  };

  const categoryOptions = [
    "",
    "Grocery",
    "Pharmacy",
    "Electronics",
    "Clothing",
    "Bakery",
    "Stationery",
    "Salon",
    "Restaurant",
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(139deg, rgba(255, 255, 255, 1) 8%, rgba(0, 103, 216, 1) 84%)",
      }}
    >
      <div className="bg-white rounded-3xl shadow-xl flex w-full max-w-6xl overflow-hidden h-auto max-h-[90vh] md:max-h-[650px]">
        {/* Slideshow Section - Left Side */}
        <div className="hidden md:flex relative overflow-hidden justify-center items-center bg-gradient-to-br from-blue-600 to-blue-800 w-1/2 p-6">
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
                className={`absolute w-4/5 h-auto object-contain transition-all duration-700 ease-in-out ${
                  isActive ? "translate-x-0 opacity-100 z-20 scale-100" : ""
                } ${
                  isPrev ? "-translate-x-full opacity-0 z-10 scale-90" : ""
                } ${
                  !isActive && !isPrev
                    ? "translate-x-full opacity-0 z-0 scale-90"
                    : ""
                }`}
              />
            );
          })}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentImage ? "bg-white w-6" : "bg-blue-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Section - Right Side */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-blue-700">
              {otpSent ? "Verify Your Email" : "Create Account"}
            </h2>
            <p className="text-gray-500">
              {otpSent
                ? otpSending
                  ? "Sending your OTP..."
                  : "Enter the code sent to your email"
                : "Join now to shop smarter and faster!"}
            </p>
          </div>

          {otpSent ? (
            // OTP Verification UI
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600">
                  We’ve sent a 6-digit verification code to
                  <br />
                  <span className="font-semibold break-all">{form.email}</span>
                </p>
              </div>

              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={otpSending}
                  />
                ))}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={countdown > 0 || otpSending}
                  className={`text-sm ${
                    countdown > 0 || otpSending
                      ? "text-gray-400"
                      : "text-blue-600 hover:underline"
                  }`}
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                </button>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtpRequestCount(0); // Reset request count when going back
                    setOtp(["", "", "", "", "", ""]);
                  }}
                  className="w-1/2 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-full font-semibold transition-colors"
                  disabled={otpSending || otpVerifying}
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={
                    otpVerifying || otp.join("").length !== 6 || otpSending
                  }
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {otpVerifying ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Registration Form UI
            <form className="space-y-4" onSubmit={handleSubmit}>
              {isShop && (
                <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-100 pb-2">
                  User Details
                </h3>
              )}

              {/* Name Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 ${
                      errors.name
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-blue-300"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 ml-4">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-blue-300"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 ml-4">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => {
                      // ensure only digits and max length 10
                      const cleaned = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      handleChange({
                        target: { name: "phone", value: cleaned },
                      });
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-blue-300"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 ml-4">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-full focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-blue-300"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      // Eye icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5
           c4.478 0 8.268 2.943 9.542 7
           -1.274 4.057-5.064 7-9.542 7
           -4.477 0-8.268-2.943-9.542-7z"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          strokeWidth="2"
                          stroke="currentColor"
                        />
                      </svg>
                    ) : (
                      // Eye-off icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19
           c-4.478 0-8.268-2.943-9.543-7
           a9.97 9.97 0 011.563-3.029m5.858.908
           a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242
           M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29
           M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5
           c4.478 0 8.268 2.943 9.543 7
           a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 ml-4">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-full focus:outline-none focus:ring-2 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-blue-300"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      // Eye icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5
           c4.478 0 8.268 2.943 9.542 7
           -1.274 4.057-5.064 7-9.542 7
           -4.477 0-8.268-2.943-9.542-7z"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          strokeWidth="2"
                          stroke="currentColor"
                        />
                      </svg>
                    ) : (
                      // Eye-off icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19
           c-4.478 0-8.268-2.943-9.543-7
           a9.97 9.97 0 011.563-3.029m5.858.908
           a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242
           M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29
           M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5
           c4.478 0 8.268 2.943 9.543 7
           a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 ml-4">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {isShop && (
                <>
                  <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-100 pb-2 mt-6">
                    Shop Details
                  </h3>

                  {/* Shop Name Field */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="shopName"
                        placeholder="Shop Name"
                        value={form.shopName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 ${
                          errors.shopName
                            ? "border-red-500 focus:ring-red-300"
                            : "border-gray-300 focus:ring-blue-300"
                        }`}
                      />
                    </div>
                    {errors.shopName && (
                      <p className="text-red-500 text-sm mt-1 ml-4">
                        {errors.shopName}
                      </p>
                    )}
                  </div>

                  {/* Category Field */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={form.category}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 ${
                          errors.category
                            ? "border-red-500 focus:ring-red-300"
                            : "border-gray-300 focus:ring-blue-300"
                        }`}
                      />
                    </div>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1 ml-4">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Description Field */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 ${
                          errors.description
                            ? "border-red-500 focus:ring-red-300"
                            : "border-gray-300 focus:ring-blue-300"
                        }`}
                      />
                    </div>
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1 ml-4">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Address Field */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={form.address}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 ${
                          errors.address
                            ? "border-red-500 focus:ring-red-300"
                            : "border-gray-300 focus:ring-blue-300"
                        }`}
                      />
                    </div>
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1 ml-4">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Map Section */}
                  <div className="pt-2">
                    <label className="text-gray-700 text-sm mb-2 block pl-4">
                      Find &amp; pinpoint your shop&apos;s location:
                    </label>

                    {googleMapsApiKey ? (
                      isLoaded ? (
                        <div
                          style={{
                            position: "relative",
                            height: mapContainerStyle.height,
                          }}
                        >
                          <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={markerPosition}
                            zoom={13}
                            options={{
                              mapTypeControl: false,
                              zoomControl: true,
                              streetViewControl: false,
                              fullscreenControl: false,
                            }}
                          >
                            <Autocomplete
                              onLoad={(ref) => (autocompleteRef.current = ref)}
                              onPlaceChanged={handlePlaceChanged}
                            >
                              <input
                                type="text"
                                placeholder="Search for an address"
                                style={{
                                  boxSizing: "border-box",
                                  border: "1px solid transparent",
                                  width: "240px",
                                  height: "40px",
                                  padding: "0 12px",
                                  borderRadius: "9999px",
                                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                                  fontSize: "14px",
                                  outline: "none",
                                  textOverflow: "ellipsis",
                                  position: "absolute",
                                  left: "50%",
                                  marginLeft: "-120px",
                                  top: "10px",
                                  background: "white",
                                }}
                              />
                            </Autocomplete>
                            <Marker
                              position={markerPosition}
                              draggable={true}
                              onDragEnd={handleMarkerDragEnd}
                            />
                          </GoogleMap>
                        </div>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center bg-blue-50 rounded-lg border border-blue-200">
                          Loading Map...
                        </div>
                      )
                    ) : (
                      <div className="h-[300px] flex items-center justify-center bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800 px-4 text-center">
                        Google Maps API key is missing. Please set
                        <code className="px-1 mx-1 bg-yellow-100 rounded">
                          REACT_APP_Maps_API_KEY
                        </code>
                        in your environment to enable the map.
                      </div>
                    )}

                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1 ml-4">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Register as Shop Checkbox */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="registerAsShop"
                  checked={isShop}
                  onChange={(e) => setIsShop(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="registerAsShop"
                  className="text-gray-700 text-sm"
                >
                  Register as Shop
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || otpSending}
                className={`w-full ${
                  isShop
                    ? "bg-[#f76673] hover:bg-[#e55562]"
                    : "bg-[#00c0a0] hover:bg-[#00ae8e]"
                } text-white py-3 rounded-full text-lg font-semibold transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isShop ? "Processing Request..." : "Creating Account..."}
                  </>
                ) : otpSending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending OTP...
                  </>
                ) : isShop ? (
                  "REQUEST SHOP ACCOUNT"
                ) : (
                  "CREATE ACCOUNT"
                )}
              </button>
            </form>
          )}

          <p className="text-sm text-center mt-4 text-gray-500">
            Already have an account?{" "}
            <a href="/" className="text-blue-600 font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

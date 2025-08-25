import { useEffect, useState, useRef } from "react";
import { UserCircle, Store, Edit3, Camera, ArrowLeft, MoreVertical, User, Mail, Phone, Upload, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/whitelogo.png";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [shopImageFile, setShopImageFile] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setLoading(false);
                    return;
                }
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get("http://localhost:4000/api/users/profile", config);

                setUser(res.data.user);
                setShop(res.data.shop);
                setFormData({
                    name: res.data.user.name,
                    email: res.data.user.email,
                    phone: res.data.user.phone,
                });
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.put("http://localhost:4000/api/users/profile", formData, config);
            setUser(prev => ({ ...prev, ...res.data.user }));
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Failed to update profile.");
        }
    };
    
    const handleImageUpdate = async () => {
        if (!shopImageFile) return;
        const uploadData = new FormData();
        uploadData.append('shopImage', shopImageFile);
        try {
            const token = localStorage.getItem("token");
            const config = { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                } 
            };
            const res = await axios.patch(`http://localhost:4000/api/shop/image/${shop._id}`, uploadData, config);
            setShop(res.data.shop);
            setShopImageFile(null);
            alert("Shop image updated successfully!");
        } catch (err) {
            alert("Failed to upload image.");
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({ name: user.name, email: user.email, phone: user.phone });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const SkeletonLoader = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="bg-white p-8 rounded-2xl shadow-lg h-96">
                 <div className="h-32 bg-gray-200 rounded-t-2xl"></div>
                 <div className="h-28 w-28 bg-gray-300 rounded-full mx-auto -mt-14 border-4 border-white"></div>
                 <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mt-4"></div>
                 <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>
            </div>
             <div className="bg-white p-8 rounded-2xl shadow-lg h-96">
                 <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                 <div className="h-40 bg-gray-200 rounded-xl"></div>
            </div>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md sticky top-0 z-10 p-4 flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 rounded-full hover:bg-blue-500 transition-colors"
                >
                    <ArrowLeft size={24} color="#fff" />
                </button>
                <h1 className="text-xl text-white font-bold">Profile</h1>
                <div className="relative">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="p-2 rounded-full hover:bg-blue-500 transition-colors"
                    >
                        <MoreVertical size={24} color="#fff" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-6xl mx-auto py-8 px-4">
                {loading ? <SkeletonLoader /> : !user ? (
                    <div className="text-center text-gray-500 bg-white p-8 rounded-2xl shadow-lg">
                        Could not load profile. Please try again.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* User Profile Card */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                            <div className="px-8 pb-8">
                                <div className="relative flex justify-center">
                                    <div className="absolute -top-16">
                                        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full border-4 border-white flex items-center justify-center shadow-md">
                                            <UserCircle size={80} className="text-indigo-400" />
                                        </div>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleUserUpdate} className="mt-20 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                            <User className="text-blue-600" size={28} /> User Details
                                        </h2>
                                        {!isEditing ? (
                                            <button 
                                                type="button" 
                                                onClick={() => setIsEditing(true)} 
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                            >
                                                <Edit3 size={18} /> Edit Profile
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                                            >
                                                <X size={18} /> Cancel
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <User size={16} /> Name
                                        </label>
                                        <input 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            readOnly={!isEditing} 
                                            className="w-full p-3 text-gray-800 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all read-only:bg-gray-50 read-only:cursor-not-allowed" 
                                        />
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <Mail size={16} /> Email
                                        </label>
                                        <input 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            readOnly={!isEditing} 
                                            className="w-full p-3 text-gray-800 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all read-only:bg-gray-50 read-only:cursor-not-allowed" 
                                        />
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <Phone size={16} /> Phone
                                        </label>
                                        <input 
                                            name="phone" 
                                            value={formData.phone} 
                                            onChange={handleChange} 
                                            readOnly={!isEditing} 
                                            className="w-full p-3 text-gray-800 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all read-only:bg-gray-50 read-only:cursor-not-allowed" 
                                        />
                                    </div>
                                    
                                    {isEditing && (
                                        <button 
                                            type="submit" 
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center gap-2"
                                        >
                                            <Save size={18} /> Update Profile
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Shop Details Card */}
                        {user.role === "shop_owner" && shop && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                                    <Store className="text-blue-600" size={28} /> Shop Details
                                </h2>
                                
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600">Shop Name</label>
                                        <div className="w-full p-3 mt-1 bg-gray-50 rounded-xl border border-gray-200 text-gray-800">
                                            {shop.name}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600">Category</label>
                                        <div className="w-full p-3 mt-1 bg-gray-50 rounded-xl border border-gray-200 text-gray-800">
                                            {shop.category}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-600">Shop Image</label>
                                        <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                                            <img 
                                                src={shopImageFile ? URL.createObjectURL(shopImageFile) : (shop.image || 'https://via.placeholder.com/300x200?text=Shop+Image')} 
                                                alt={shop.name} 
                                                className="w-full h-48 object-cover" 
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                                <button 
                                                    type="button"
                                                    onClick={() => fileInputRef.current.click()} 
                                                    className="flex items-center gap-2 text-white bg-blue-600 bg-opacity-80 hover:bg-opacity-100 px-4 py-2 rounded-lg transition-all"
                                                >
                                                    <Camera size={20} /> Change Image
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={(e) => setShopImageFile(e.target.files[0])} 
                                            accept="image/*" 
                                            className="hidden" 
                                        />
                                        
                                        {shopImageFile && (
                                            <div className="text-center space-y-3">
                                                <p className="text-sm text-gray-600 truncate">{shopImageFile.name}</p>
                                                <button 
                                                    onClick={handleImageUpdate} 
                                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center gap-2"
                                                >
                                                    <Upload size={18} /> Upload Image
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
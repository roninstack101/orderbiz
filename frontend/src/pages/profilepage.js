import { useEffect, useState, useRef } from "react";
import { UserCircle, Store, Edit3, Camera, ArrowLeft, MoreVertical, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
                    return; // No token, stop execution
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
            alert("Profile updated!");
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
            alert("Shop image updated!");
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            <div className="bg-white p-6 rounded-lg shadow-md h-96">
                 <div className="h-32 bg-gray-200 rounded-t-lg"></div>
                 <div className="h-28 w-28 bg-gray-300 rounded-full mx-auto -mt-12 border-4 border-white"></div>
                 <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mt-4"></div>
                 <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md h-96">
                 <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                 <div className="h-40 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-[#0067D8] shadow-sm sticky top-0 z-10 p-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={24} color="#fff" />
                </button>
                <h1 className="text-xl text-white font-bold">Profile</h1>
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-100">
                        <MoreVertical size={24} color="#fff" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-6xl mx-auto py-8 px-4">
                {loading ? <SkeletonLoader /> : !user ? <div className="text-center text-gray-500">Could not load profile.</div> : (
                    <div className="grid grid-cols-1  gap-8">
                        {/* --- User Profile Card (Left Side) --- */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden h-fit">
                            <div className="h-32 bg-gray-200"></div>
                            <div className="p-6 bg-slate-300">
                                <div className="relative">
                                    <div className="absolute -top-24 left-1/2 -translate-x-1/2">
                                        <div className="w-28 h-28 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center">
                                            <UserCircle size={80} className="text-gray-500" />
                                        </div>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleUserUpdate} className="mt-16 space-y-4">
                                    <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 ">
                                    <User className="text-blue-500" /> User Details
                                </h2>
                                        {!isEditing && (
                                            <button type="button" onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-700">
                                                <Edit3 size={16} /> Edit Profile
                                            </button>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Name</label>
                                        <input name="name" value={formData.name} onChange={handleChange} readOnly={!isEditing} className="w-full text-lg font-semibold text-gray-800 p-2 mt-1 border rounded-md read-only:bg-gray-100 read-only:border-transparent focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <input name="email" value={formData.email} onChange={handleChange} readOnly={!isEditing} className="w-full text-lg text-gray-800 p-2 mt-1 border rounded-md read-only:bg-gray-100 read-only:border-transparent focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Phone</label>
                                        <input name="phone" value={formData.phone} onChange={handleChange} readOnly={!isEditing} className="w-full text-lg text-gray-800 p-2 mt-1 border rounded-md read-only:bg-gray-100 read-only:border-transparent focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    {isEditing && (
                                        <div className="flex gap-4 pt-4">
                                            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">Update</button>
                                            <button type="button" onClick={handleCancelEdit} className="bg-gray-200 py-2 px-6 rounded-lg hover:bg-gray-300">Cancel</button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* --- Shop Details Card (Right Side) --- */}
                        {user.role === "shop_owner" && shop && (
                             <div className="bg-slate-300 p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4">
                                    <Store className="text-blue-500" /> Shop Details
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Shop Name</label>
                                        <p className="w-full p-2 mt-1 bg-gray-100 rounded-md border border-gray-200">{shop.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Category</label>
                                        <p className="w-full p-2 mt-1 bg-gray-100 rounded-md border border-gray-200">{shop.category}</p>
                                    </div>
                                    <div className="relative group">
                                        <img src={shopImageFile ? URL.createObjectURL(shopImageFile) : (shop.image || 'https://via.placeholder.com/300')} alt="shop" className="w-full h-48 object-cover rounded-lg" />
                                        <button onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera size={32} />
                                        </button>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={(e) => setShopImageFile(e.target.files[0])} accept="image/*" className="hidden" />
                                    {shopImageFile && (
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 truncate mb-2">{shopImageFile.name}</p>
                                            <button onClick={handleImageUpdate} className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Upload New Image</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
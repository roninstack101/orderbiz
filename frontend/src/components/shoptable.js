import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmationModal from "./confirmationmodal.js";
import ShopModal from "./shopmodal.js";

const API_BASE_URL = "http://localhost:4000";

const ShopsTable = ({ token, searchQuery }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [shopToEdit, setShopToEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [shopToDelete, setShopToDelete] = useState(null);

  const fetchShops = useCallback(async () => {
    if (!token) {
      setError("Authentication token not provided.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/shops`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShops(response.data);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const filteredShops = shops.filter((shop) => {
    const query = (searchQuery || "").toLowerCase();
    return (
      (shop.name || "").toLowerCase().includes(query) ||
      (shop.description || "").toLowerCase().includes(query) ||
      (shop.category || "").toLowerCase().includes(query) ||
      (shop.address || "").toLowerCase().includes(query) ||
      (shop.owner?.name || "").toLowerCase().includes(query)
    );
  });

  const handleOpenModalForAdd = () => {
    setShopToEdit(null);
    setIsShopModalOpen(true);
  };

  const handleOpenModalForEdit = (shop) => {
    setShopToEdit(shop);
    setIsShopModalOpen(true);
  };

  const handleCloseShopModal = () => {
    setIsShopModalOpen(false);
    setShopToEdit(null);
  };

  const handleSaveShop = async (formData, shopId) => {
    try {
      if (shopId) {
        const updateData = {
          name: formData.name,
          category: formData.category,
          address: formData.address,
          description: formData.description,
          location: formData.location,
        };

        await axios.put(
          `${API_BASE_URL}/api/admin/shops/${shopId}`,
          updateData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Shop updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/createshop`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Shop and owner created successfully!");
      }

      handleCloseShopModal();
      fetchShops();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  const handleOpenDeleteModal = (shop) => {
    setShopToDelete(shop);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setShopToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!shopToDelete) return;
    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/delete/shop/${shopToDelete._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Shop deleted successfully!");
      fetchShops();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      handleCloseDeleteModal();
    }
  };

  const formatCoordinates = (coordinates) => {
    if (!coordinates || !coordinates.length) return "N/A";
    return `${coordinates[0].toFixed(6)}, ${coordinates[1].toFixed(6)}`;
  };

  return (
    <div className="relative h-full p-2 sm:p-4">
      {/* --- Desktop Table --- */}
      <div className="hidden md:block overflow-auto h-full no-scrollbar pb-20">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Shop
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Loading shops...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredShops.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  {searchQuery ? "No shops match your search." : "No shops found."}
                </td>
              </tr>
            ) : (
              filteredShops.map((shop) => (
                <tr key={shop._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {shop.name}
                    </div>
                    <div className="text-sm text-gray-500">{shop.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {shop.description}
                    </div>
                    <div className="text-sm text-gray-500">{shop.address}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Location: {formatCoordinates(shop.location?.coordinates)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {shop.owner?.name || "No owner data"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {shop.owner?.email || ""}
                    </div>
                    <div className="text-sm text-gray-500">
                      {shop.owner?.phone || ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        shop.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {shop.isApproved ? "Approved" : "Pending Approval"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModalForEdit(shop)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(shop)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Mobile Card Layout --- */}
      <div className="block md:hidden space-y-4 pb-24">
        {loading ? (
          <div className="text-center text-gray-500">Loading shops...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center text-gray-500">
            {searchQuery ? "No shops match your search." : "No shops found."}
          </div>
        ) : (
          filteredShops.map((shop) => (
            <div
              key={shop._id}
              className="bg-white p-4 rounded-lg shadow-md border"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{shop.name}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    shop.isApproved
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {shop.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{shop.category}</p>
              <p className="text-sm text-gray-600 mb-1">
                {shop.description || "No description"}
              </p>
              <p className="text-sm text-gray-600 mb-1">{shop.address}</p>
              <p className="text-xs text-gray-400">
                Location: {formatCoordinates(shop.location?.coordinates)}
              </p>
              <div className="mt-3">
                <p className="text-sm font-medium">
                  Owner: {shop.owner?.name || "N/A"}
                </p>
                <p className="text-xs text-gray-500">{shop.owner?.email}</p>
                <p className="text-xs text-gray-500">{shop.owner?.phone}</p>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => handleOpenModalForEdit(shop)}
                    className="text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-lg bg-indigo-50 text-sm font-medium flex items-center"
                //   className="text-indigo-600 hover:text-indigo-900 text-sm"
                >
                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Update
                </button>
                <button
                  onClick={() => handleOpenDeleteModal(shop)}
                  className="text-red-600 hover:text-red-800 px-3 py-2 rounded-lg bg-red-50 text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD Button */}
      <button
        onClick={handleOpenModalForAdd}
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-full shadow-lg z-20 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        ADD SHOP
      </button>

      <ShopModal
        isOpen={isShopModalOpen}
        onClose={handleCloseShopModal}
        onSave={handleSaveShop}
        shopToEdit={shopToEdit}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete ${shopToDelete?.name}? This will also remove all associated data.`}
      />
    </div>
  );
};

export default ShopsTable;

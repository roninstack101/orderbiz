import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Define the base URL for your backend API.
const API_BASE_URL = "http://localhost:4000";

// --- Reusable Confirmation Modal for Deletion ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Modal Component for Add/Edit ---
const UserModal = ({ isOpen, onClose, onSave, userToEdit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const isEditMode = !!userToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          name: userToEdit.name || "",
          email: userToEdit.email || "",
          phone: userToEdit.phone || "",
        });
      } else {
        setFormData({
          name: "",
          email: "",
          phone: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, userToEdit, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!formData.phone) newErrors.phone = "Phone number is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData, userToEdit?._id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "Update User" : "Add New User"}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.name && "border-red-500"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email && "border-red-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.phone && "border-red-500"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs italic">{errors.phone}</p>
            )}
          </div>
          {!isEditMode && <></>}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Users Table Component ---
const UsersTable = ({ token, searchQuery }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Add/Edit modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // State for Delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setError("Authentication token not provided.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on the search query, now with defensive checks
  const filteredUsers = users.filter((user) => {
    const query = (searchQuery || "").toLowerCase(); // Ensure searchQuery is a string
    return (
      (user.name || "").toLowerCase().includes(query) ||
      (user.email || "").toLowerCase().includes(query) ||
      (user.phone || "").toLowerCase().includes(query)
    );
  });

  // --- Handlers for Add/Edit Modal ---
  const handleOpenModalForAdd = () => {
    setUserToEdit(null);
    setIsUserModalOpen(true);
  };

  const handleOpenModalForEdit = (user) => {
    setUserToEdit(user);
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setUserToEdit(null);
  };

  const handleSaveUser = async (formData, userId) => {
    try {
      if (userId) {
        // Update existing user
        await axios.put(`${API_BASE_URL}/api/admin/users/${userId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Add new user
        await axios.post(`${API_BASE_URL}/api/admin/register`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      handleCloseUserModal();
      fetchUsers(); // Refresh data
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message;
      toast.error(errorMessage);
    }
  };

  // --- Handlers for Delete Modal ---
  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      // CORRECTED API ENDPOINT
      await axios.delete(
        `${API_BASE_URL}/api/admin/delete/user/${userToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers(); // Refresh data
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message;
      alert(`Error: ${errorMessage}`);
    } finally {
      handleCloseDeleteModal();
    }
  };

  return (
    <div className="relative h-full">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-auto h-full no-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  {searchQuery
                    ? "No users match your search."
                    : "No users found."}
                </td>
              </tr>
            ) : (
              <>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModalForEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(user)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Spacer row to prevent the ADD button from overlapping the last item */}
                <tr>
                  <td colSpan="4" className="py-12"></td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards with Improved Styling */}
      <div className="md:hidden p-4 space-y-4 pb-24">
        {" "}
        {/* Added pb-24 for bottom padding */}
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? "No users match your search." : "No users found."}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                  {user.name}
                </h3>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 whitespace-nowrap flex-shrink-0">
                  {user.role}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start">
                  <svg
                    className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm text-gray-700 truncate">
                    {user.email}
                  </span>
                </div>

                <div className="flex items-start">
                  <svg
                    className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-sm text-gray-700">{user.phone}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleOpenModalForEdit(user)}
                  className="text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-lg bg-indigo-50 text-sm font-medium flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Update
                </button>
                <button
                  onClick={() => handleOpenDeleteModal(user)}
                  className="text-red-600 hover:text-red-800 px-3 py-2 rounded-lg bg-red-50 text-sm font-medium flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1极速v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Button - Kept as original */}
      <button
        onClick={handleOpenModalForAdd}
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-full shadow-lg z-20"
      >
        ADD
      </button>

      {/* Render Modals */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        onSave={handleSaveUser}
        userToEdit={userToEdit}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default UsersTable;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

const ShopRequestsTable = ({ token, searchQuery }) => { // 1. Accept searchQuery prop
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = useCallback(async () => {
    if (!token) {
      setError("Authentication token not provided. Please log in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/shoprequest/getShoprequest`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // 2. Filter the requests based on the search query before rendering
  const filteredRequests = requests.filter(request => {
    const query = searchQuery.toLowerCase();
    // Check against multiple fields for a comprehensive search
    return (
      request.name.toLowerCase().includes(query) ||
      request.email.toLowerCase().includes(query) ||
      request.shop.name.toLowerCase().includes(query) ||
      request.shop.category.toLowerCase().includes(query)
    );
  });

  const handleAction = async (requestId, action) => {
    if (!token) {
      alert("Error: Authentication token not found. Please log in.");
      return;
    }
    setProcessingId(requestId);
    try {
      const isApproval = action === 'approve';
      const url = isApproval ? `${API_BASE_URL}/api/shoprequest/shopapproval/${requestId}` : `${API_BASE_URL}/api/shoprequest/shopdecline/${requestId}`;
      const method = isApproval ? 'put' : 'delete';
      await axios({
        method: method,
        url: url,
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchRequests();
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message;
      alert(`Error: ${errorMessage}`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Details</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Details</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Loading requests...</td></tr>
          ) : error ? (
            <tr><td colSpan="4" className="px-6 py-4 text-center text-red-500">{error}</td></tr>
          ) : filteredRequests.length === 0 ? ( // 3. Use the filtered array's length
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                {/* Show a different message if a search is active */}
                {searchQuery ? 'No requests match your search.' : 'No pending shop requests found.'}
              </td>
            </tr>
          ) : (
            filteredRequests.map((request) => ( // 4. Map over the filtered array
              <tr key={request._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{request.name}</div>
                  <div className="text-sm text-gray-500">{request.email}</div>
                  <div className="text-sm text-gray-500">{request.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{request.shop.name} <span className="text-xs text-gray-500">({request.shop.category})</span></div>
                  <div className="text-sm text-gray-500">{request.shop.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleAction(request._id, 'approve')}
                      disabled={processingId === request._id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {processingId === request._id ? 'Processing...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleAction(request._id, 'decline')}
                      disabled={processingId === request._id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {processingId === request._id ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShopRequestsTable;

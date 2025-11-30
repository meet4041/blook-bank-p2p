import React, { useState, useEffect, useContext } from "react";
import { getRequests, updateStatus } from "../api/requestApi";
import { AuthContext } from "../context/AuthContext"; 

const BloodRequests = () => {
  const { user } = useContext(AuthContext); 
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null); 

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getRequests();
      if (response.success && Array.isArray(response.data)) {
        setRequests(response.data);
      } else {
        setError("Failed to load requests");
      }
    } catch (err) {
      setError(err.message || "Failed to load blood requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdating(id);
      const response = await updateStatus(id, { status: newStatus }); 
      
      if (response.success) {
        setRequests(requests.map(req => 
          req._id === id ? { ...req, status: newStatus } : req
        ));
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading requests...</div>;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 mt-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Blood Requests</h2>
      
      {requests.length === 0 ? (
        <div className="text-center text-gray-500">No blood requests found.</div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="bg-white p-4 rounded-lg shadow border flex flex-col md:flex-row justify-between items-start">
              
              {/* Left Side: Request Info */}
              <div>
                <h3 className="font-semibold text-lg">{request.patientName}</h3>
                <p className="text-gray-600">Group: <span className="font-medium">{request.bloodGroup}</span></p>
                <p className="text-gray-600">Units: <span className="font-medium">{request.unitsRequired}</span></p>
                <p className="text-gray-600">Hospital: {request.hospital}, {request.city}</p>
                <p className="text-sm text-gray-400 mt-1">By: {request.requestedBy?.name || 'Unknown'}</p>
              </div>

              {/* Right Side: Status Actions */}
              <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                <p className="text-sm text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>

                {/* LOGIC: If Hospital, show Dropdown. If User, show Badge. */}
                {user?.role === 'hospital' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <select
                      value={request.status}
                      disabled={updating === request._id}
                      onChange={(e) => handleStatusChange(request._id, e.target.value)}
                      className={`border rounded px-2 py-1 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none
                        ${request.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                          request.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                          request.status === 'fulfilled' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50'}
                      `}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>
                ) : (
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'fulfilled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BloodRequests;
import React, { useState, useEffect, useContext } from "react";
import { getDonors, verifyDonor } from "../api/donorApi";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const Donors = () => {
  const { user } = useContext(AuthContext); // Get current user
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await getDonors();
      if (response.success && Array.isArray(response.data)) {
        setDonors(response.data);
      } else {
        setError("Failed to load donors - invalid response format");
      }
    } catch (err) {
      setError(err.message || "Failed to load donors");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    if (!window.confirm("Are you sure you want to verify this donor?")) return;
    
    try {
      const response = await verifyDonor(id);
      if (response.success) {
        // Update UI locally to show Verified immediately
        setDonors(donors.map(d => 
          d._id === id ? { ...d, verified: true } : d
        ));
      }
    } catch (err) {
      alert("Failed to verify donor: " + err.message);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading donors...</div>;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 mt-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Donors</h2>
      
      {donors.length === 0 ? (
        <div className="text-center text-gray-500">No donors found.</div>
      ) : (
        <div className="space-y-4">
          {donors.map((donor) => (
            <div key={donor._id} className="bg-white p-4 rounded-lg shadow border flex flex-col md:flex-row justify-between items-start">
              
              {/* Left Side: Donor Info */}
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {donor.name}
                  {/* Status Badge */}
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    donor.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {donor.verified ? 'VERIFIED' : 'PENDING'}
                  </span>
                </h3>
                <p className="text-gray-600">Blood Group: <span className="font-medium">{donor.bloodGroup}</span></p>
                <p className="text-gray-600">Phone: <span className="font-medium">{donor.phone}</span></p>
                <p className="text-gray-600">City: <span className="font-medium">{donor.city}</span></p>
                <p className="text-sm text-gray-400 mt-1">Added by: {donor.addedBy?.name || 'Unknown'}</p>
              </div>

              {/* Right Side: Actions */}
              <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                <p className="text-sm text-gray-500">
                  {new Date(donor.createdAt).toLocaleDateString()}
                </p>

                {/* HOSPITAL ACTION: Verify Button */}
                {user?.role === 'hospital' && !donor.verified && (
                  <button 
                    onClick={() => handleVerify(donor._id)}
                    className="bg-green-600 text-white text-sm px-4 py-2 rounded shadow hover:bg-green-700 transition"
                  >
                    Verify Donor
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Donors;
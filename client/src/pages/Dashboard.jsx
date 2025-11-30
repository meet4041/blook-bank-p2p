import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import QuoteWidget from "../components/NearbyCenters";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchDashboardData = async () => {
      try {
        // Mock data - you'll replace this with actual API call
        const mockStats = {
          verifiedDonors: 24,
          pendingRequests: 8,
          totalDonors: 42,
          completedRequests: 15
        };
        setStats(mockStats);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <main>
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <header className="text-center mb-8">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name || 'User'}!
            {user?.role && (
              <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                {user.role.toUpperCase()}
              </span>
            )}
          </p>
        </header>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-red-600">{stats.verifiedDonors}</div>
              <div className="text-sm text-gray-600">Verified Donors</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalDonors}</div>
              <div className="text-sm text-gray-600">Total Donors</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completedRequests}</div>
              <div className="text-sm text-gray-600">Completed Requests</div>
            </div>
          </div>
        )}

        {/* Overpass widget */}
        <div className="mb-8">
          <QuoteWidget />
        </div>

        {/* Action Buttons */}
        <section className="text-center">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition shadow"
              onClick={() => navigate("/donors")}
            >
              Manage Donors
            </button>
            <button
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition shadow"
              onClick={() => navigate("/requests")}
            >
              Manage Requests
            </button>
            
            {/* Show Add Donor button only for hospital/admin roles */}
            {(user?.role === 'hospital' || user?.role === 'admin') && (
              <button
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow"
                onClick={() => navigate("/add-donor")}
              >
                Add Donor
              </button>
            )}
            
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow"
              onClick={() => navigate("/add-request")}
            >
              Add Request
            </button>
          </div>

          {/* Show message if user can't add donors */}
          {user?.role === 'user' && (
            <div className="mt-4 text-sm text-gray-600">
              <p>Note: Only Hospital and Admin users can add donors. Contact administrator for access.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
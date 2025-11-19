import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthContext } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Donors from "./pages/Donors";
import AddDonor from "./pages/AddDonor";
import BloodRequests from "./pages/BloodRequests";
import AddRequest from "./pages/AddRequest";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext); // use token from context
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/donors" element={<ProtectedRoute><Donors /></ProtectedRoute>} />
        <Route path="/add-donor" element={<ProtectedRoute><AddDonor /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><BloodRequests /></ProtectedRoute>} />
        <Route path="/add-request" element={<ProtectedRoute><AddRequest /></ProtectedRoute>} />

        {/* 404 Page */}
        <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

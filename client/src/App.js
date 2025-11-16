import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SearchDonors from "./pages/SearchDonors";
import Requests from "./pages/Requests";
import IncomingRequests from "./pages/IncomingRequests";
import VerifyHospitals from "./pages/VerifyHospitals";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchDonors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incoming"
          element={
            <ProtectedRoute>
              <IncomingRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/verify-hospitals"
          element={
            <ProtectedRoute>
              <VerifyHospitals />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

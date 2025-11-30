import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" 
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Attempting registration...", form);
      const result = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role 
      });
      console.log("Registration response:", result);
      
      if (result.token) {
        login(result.token, result.user);
        navigate("/dashboard");
      } else {
        setError("Registration successful but no authentication token received");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="max-w-md mx-auto px-4 mt-12">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input 
                name="name" 
                value={form.name}
                onChange={handleChange} 
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" 
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input 
                name="email" 
                type="email" 
                value={form.email}
                onChange={handleChange} 
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" 
                required
              />
            </div>

            {/* ADD ROLE SELECTION */}
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="user">User</option>
                <option value="hospital">Hospital</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input 
                name="password" 
                type="password" 
                value={form.password}
                onChange={handleChange} 
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" 
                required
                minLength="6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Confirm Password</label>
              <input 
                name="confirmPassword" 
                type="password" 
                value={form.confirmPassword}
                onChange={handleChange} 
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" 
                required
              />
            </div>

            <div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;
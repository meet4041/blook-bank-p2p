import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { setUser } = useAuth();

  const submit = async (e) => {
    e.preventDefault();

    const res = await loginUser(form);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <br />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <br />
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;

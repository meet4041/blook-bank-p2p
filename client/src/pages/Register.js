import { useState } from "react";
import { registerUser } from "../api/authApi";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "DONOR",
  });

  const submit = async (e) => {
    e.preventDefault();
    await registerUser(form);
    alert("Registered!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        /><br/>

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        /><br/>

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        /><br/>

        <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="DONOR">Donor</option>
          <option value="HOSPITAL">Hospital</option>
        </select><br/>

        <button>Register</button>
      </form>
    </div>
  );
};

export default Register;

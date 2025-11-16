import { useState } from "react";
import { searchDonors } from "../api/userApi";

const SearchDonors = () => {
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [donors, setDonors] = useState([]);

  const submit = async (e) => {
    e.preventDefault();
    const res = await searchDonors(`city=${city}&bloodGroup=${bloodGroup}`);
    setDonors(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Search Donors</h2>

      <form onSubmit={submit}>
        <input placeholder="City" onChange={(e) => setCity(e.target.value)} />
        <input placeholder="Blood Group" onChange={(e) => setBloodGroup(e.target.value)} />
        <button>Search</button>
      </form>

      <ul>
        {donors.map((d) => (
          <li key={d._id}>{d.name} - {d.bloodGroup}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchDonors;

import { useEffect, useState } from "react";
import { getUnverifiedHospitals, verifyHospital } from "../api/userApi";

const VerifyHospitals = () => {
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await getUnverifiedHospitals();
    setList(res.data);
  };

  const verify = async (id) => {
    await verifyHospital(id);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Verify Hospitals</h2>

      <ul>
        {list.map((h) => (
          <li key={h._id}>
            {h.name} — {h.city}
            <button onClick={() => verify(h._id)}>Verify</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerifyHospitals;

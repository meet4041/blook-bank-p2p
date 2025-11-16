import { useEffect, useState } from "react";
import { getOutgoingRequests } from "../api/requestApi";

const Requests = () => {
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await getOutgoingRequests();
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Outgoing Requests</h2>
      <ul>
        {list.map((r) => (
          <li key={r._id}>
            {r.bloodGroup} — Status: {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Requests;

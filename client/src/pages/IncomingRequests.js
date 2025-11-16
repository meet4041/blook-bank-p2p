import { useEffect, useState } from "react";
import { getIncomingRequests, updateRequestStatus } from "../api/requestApi";

const IncomingRequests = () => {
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await getIncomingRequests();
    setList(res.data);
  };

  const update = async (id, status) => {
    await updateRequestStatus(id, { status });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Incoming Requests</h2>

      <ul>
        {list.map((r) => (
          <li key={r._id}>
            Request from {r.hospitalName} for {r.bloodGroup}
            <button onClick={() => update(r._id, "ACCEPTED")}>Accept</button>
            <button onClick={() => update(r._id, "DECLINED")}>Decline</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncomingRequests;

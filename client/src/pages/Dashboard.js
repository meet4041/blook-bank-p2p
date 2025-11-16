import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome {user.name}</h2>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default Dashboard;

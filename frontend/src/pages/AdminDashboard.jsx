import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/");
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get(
        "http://localhost:5000/api/users/all-users",
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      const trainersRes = await axios.get(
        "http://localhost:5000/api/users/all-trainers",
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      setUsers(usersRes.data);
      setTrainers(trainersRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const approveUser = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      alert("User Approved");
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const approveTrainer = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      alert("Trainer Approved");
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const assignTrainer = async (userId, trainerId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/assign-trainer/${userId}`,
        { trainerId },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      alert("Trainer Assigned");
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin Dashboard</h2>
      <button onClick={logout}>Logout</button>

      <hr />

      <h3>Pending User Approvals</h3>

      {users.filter((u) => !u.isApproved).map((user) => (
        <div
          key={user._id}
          style={{ border: "1px solid red", padding: "10px", marginBottom: "10px" }}
        >
          <p>
            <strong>{user.name}</strong> ({user.email})
          </p>

          <button onClick={() => approveUser(user._id)}>Approve User</button>
        </div>
      ))}

      <hr />

      <h3>Pending Trainer Approvals</h3>

      {trainers.filter((t) => !t.isApproved).map((trainer) => (
        <div
          key={trainer._id}
          style={{ border: "1px solid orange", padding: "10px", marginBottom: "10px" }}
        >
          <p>
            <strong>{trainer.name}</strong> ({trainer.email})
          </p>

          <p>Qualification: {trainer.qualification}</p>
          <p>Experience: {trainer.experience}</p>

          <button onClick={() => approveTrainer(trainer._id)}>
            Approve Trainer
          </button>
        </div>
      ))}

      <hr />

      <h3>Assign Trainer to Approved Users</h3>

      {users.filter((u) => u.isApproved).map((user) => (
        <div
          key={user._id}
          style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
        >
          <p>
            <strong>{user.name}</strong> ({user.email})
          </p>

          <select onChange={(e) => assignTrainer(user._id, e.target.value)}>
            <option value="">Select Trainer</option>

            {trainers
              .filter((t) => t.isApproved)
              .map((trainer) => (
                <option key={trainer._id} value={trainer._id}>
                  {trainer.name}
                </option>
              ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
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
    await axios.put(
      `http://localhost:5000/api/users/approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${userInfo.token}` } }
    );
    fetchData();
  };

  const approveTrainer = async (id) => {
    await axios.put(
      `http://localhost:5000/api/users/approve-trainer/${id}`,
      {},
      { headers: { Authorization: `Bearer ${userInfo.token}` } }
    );
    fetchData();
  };

  const assignTrainer = async (userId, trainerId) => {
    await axios.put(
      `http://localhost:5000/api/users/assign-trainer/${userId}`,
      { trainerId },
      { headers: { Authorization: `Bearer ${userInfo.token}` } }
    );
    fetchData();
  };

  const deleteUser = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/users/${id}`,
      { headers: { Authorization: `Bearer ${userInfo.token}` } }
    );
    fetchData();
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">👑 Admin Dashboard</h2>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* USERS */}
      <h3 className="text-xl font-semibold mb-3">Pending User Approvals</h3>

      <div className="grid md:grid-cols-2 gap-4">
        {users.filter((u) => !u.isApproved).map((user) => (
          <div key={user._id} className="bg-white text-black p-4 rounded-xl shadow">
            <p className="font-bold">{user.name}</p>
            <p className="text-sm">{user.email}</p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => approveUser(user._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => deleteUser(user._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TRAINERS */}
      <h3 className="text-xl font-semibold mt-8 mb-3">Pending Trainer Approvals</h3>

      <div className="grid md:grid-cols-2 gap-4">
        {trainers.filter((t) => !t.isApproved).map((trainer) => (
          <div key={trainer._id} className="bg-white text-black p-4 rounded-xl shadow">
            <p className="font-bold">{trainer.name}</p>
            <p className="text-sm">{trainer.email}</p>
            <p className="text-sm">🎓 {trainer.qualification}</p>
            <p className="text-sm">💼 {trainer.experience} years</p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => approveTrainer(trainer._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => deleteUser(trainer._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ASSIGN TRAINER */}
      <h3 className="text-xl font-semibold mt-8 mb-3">
        Assign Trainer to Users
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {users.filter((u) => u.isApproved).map((user) => (
          <div key={user._id} className="bg-white text-black p-4 rounded-xl shadow">
            <p className="font-bold">{user.name}</p>
            <p className="text-sm">{user.email}</p>

            <select
              onChange={(e) => assignTrainer(user._id, e.target.value)}
              className="mt-3 w-full p-2 border rounded"
            >
              <option value="">Select Trainer</option>
              {trainers
                .filter((t) => t.isApproved)
                .map((trainer) => (
                  <option key={trainer._id} value={trainer._id}>
                    {trainer.name}
                  </option>
                ))}
            </select>

            <button
              onClick={() => deleteUser(user._id)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete User
            </button>
          </div>
        ))}
      </div>

      {/* APPROVED TRAINERS */}
      <h3 className="text-xl font-semibold mt-8 mb-3">Approved Trainers</h3>

      <div className="grid md:grid-cols-2 gap-4">
        {trainers.filter((t) => t.isApproved).map((trainer) => (
          <div key={trainer._id} className="bg-white text-black p-4 rounded-xl shadow">
            <p className="font-bold">{trainer.name}</p>
            <p className="text-sm">{trainer.email}</p>
            <p className="text-sm">🎓 {trainer.qualification}</p>
            <p className="text-sm">💼 {trainer.experience} years</p>

            <button
              onClick={() => deleteUser(trainer._id)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete Trainer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BMICalculator from "../components/BMIcalculator";

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [users, setUsers] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  // ✅ separate states (important fix)
  const [workoutUser, setWorkoutUser] = useState("");
  const [nutritionUser, setNutritionUser] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [nutritionTitle, setNutritionTitle] = useState("");
  const [nutritionDescription, setNutritionDescription] = useState("");
  const [nutritionPlans, setNutritionPlans] = useState([]);

  // ================= AUTH =================
  useEffect(() => {
    if (!userInfo || userInfo.role !== "trainer") {
      navigate("/");
    }
  }, []);

  // ================= FETCH =================
  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/users/assigned-users",
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    setUsers(res.data);
  };

  const fetchWorkouts = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/workouts",
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    setWorkouts(res.data);
  };

  const fetchNutrition = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/nutrition",
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    setNutritionPlans(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchWorkouts();
    fetchNutrition();
  }, []);

  // ================= WORKOUT =================
  const handleAssignWorkout = async (e) => {
    e.preventDefault();

    if (!workoutUser) return alert("Select user");

    await axios.post(
      "http://localhost:5000/api/workouts",
      {
        userId: workoutUser,
        title,
        description,
      },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );

    alert("Workout Assigned");
    setTitle("");
    setDescription("");
    setWorkoutUser("");
    fetchWorkouts();
  };

  const handleDeleteWorkout = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/workouts/${id}`,
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    fetchWorkouts();
  };

  // ================= NUTRITION =================
  const handleCreateNutrition = async (e) => {
    e.preventDefault();

    if (!nutritionUser) return alert("Select user");

    await axios.post(
      "http://localhost:5000/api/nutrition",
      {
        title: nutritionTitle,
        description: nutritionDescription,
        user: nutritionUser,
      },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );

    alert("Nutrition Created");
    setNutritionTitle("");
    setNutritionDescription("");
    setNutritionUser("");
    fetchNutrition();
  };

  const handleDeleteNutrition = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/nutrition/${id}`,
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    fetchNutrition();
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome, {userInfo?.name} 👋
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
        >
          Logout
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* NUTRITION */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h2 className="text-xl font-bold mb-4">Create Nutrition Plan</h2>

          <form onSubmit={handleCreateNutrition} className="flex flex-col gap-3">

            <select
              value={nutritionUser}
              onChange={(e) => setNutritionUser(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Nutrition Title"
              value={nutritionTitle}
              onChange={(e) => setNutritionTitle(e.target.value)}
              className="border p-2 rounded"
            />

            <textarea
              placeholder="Nutrition Description"
              value={nutritionDescription}
              onChange={(e) => setNutritionDescription(e.target.value)}
              className="border p-2 rounded"
            />

            <button className="bg-green-500 text-white py-2 rounded">
              Create Nutrition
            </button>

          </form>
        </div>

        {/* WORKOUT */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h2 className="text-xl font-bold mb-4">Assign Workout</h2>

          <form onSubmit={handleAssignWorkout} className="flex flex-col gap-3">

            <select
              value={workoutUser}
              onChange={(e) => setWorkoutUser(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Workout Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded"
            />

            <textarea
              placeholder="Workout Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded"
            />

            <button className="bg-purple-600 text-white py-2 rounded">
              Assign Workout
            </button>

          </form>
        </div>

        {/* BMI */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h2 className="text-xl font-bold mb-4">BMI Calculator</h2>

          {!workoutUser ? (
            <p>Select user</p>
          ) : (
            users
              .filter((u) => u._id === workoutUser)
              .map((user) => (
                <BMICalculator key={user._id} userData={user} />
              ))
          )}
        </div>

      </div>

      {/* WORKOUT LIST */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-5">
        <h2 className="text-xl font-bold mb-4">Assigned Workouts</h2>

        {workouts.map((workout) => (
          <div key={workout._id} className="flex justify-between mb-2">
            <div>
              <h4>{workout.title}</h4>
              <p>{workout.user?.name}</p>
            </div>

            <button
              onClick={() => handleDeleteWorkout(workout._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* NUTRITION LIST */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-5">
        <h2 className="text-xl font-bold mb-4">Nutrition Plans</h2>

        {nutritionPlans.length === 0 ? (
          <p>No nutrition plans yet</p>
        ) : (
          nutritionPlans.map((plan) => (
            <div key={plan._id} className="flex justify-between mb-2">
              <div>
                <h4>{plan.title}</h4>
                <p>{plan.user?.name}</p>
              </div>

              <button
                onClick={() => handleDeleteNutrition(plan._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default TrainerDashboard;
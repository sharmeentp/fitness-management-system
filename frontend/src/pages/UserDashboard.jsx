import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo || userInfo.role !== "user") {
        navigate("/");
        return;
      }

      try {
        const profileResponse = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        setUser(profileResponse.data);

        const workoutResponse = await axios.get(
          "http://localhost:5000/api/workouts",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        setWorkouts(workoutResponse.data);

        const nutritionResponse = await axios.get(
          "http://localhost:5000/api/nutrition",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        setNutritionPlans(nutritionResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handlePayment = () => {
    navigate("/payment");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          Welcome, {user.name} 👋
        </h1>

        <div className="flex gap-3">
          {!user.isPremium && (
            <button
              onClick={handlePayment}
              className="bg-yellow-400 text-white px-4 py-2 rounded-lg"
            >
              Upgrade 💳
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-xl p-5 shadow mb-6">
        <h2 className="text-lg font-bold mb-2">Profile</h2>

        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

        {user.isPremium && (
          <span className="inline-block mt-2 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm">
            ⭐ Premium Member
          </span>
        )}
      </div>

      {/* TRAINER */}
      <div className="bg-white rounded-xl p-5 shadow mb-6">
        <h2 className="text-lg font-bold mb-3">Assigned Trainer</h2>

        {user.trainer ? (
          <>
            <p><strong>Name:</strong> {user.trainer.name}</p>
            <p><strong>Email:</strong> {user.trainer.email}</p>
          </>
        ) : (
          <p>No trainer assigned yet.</p>
        )}
      </div>

      {/* WORKOUTS */}
      <div className="bg-white rounded-xl p-5 shadow mb-6">
        <h2 className="text-lg font-bold mb-3">Workouts</h2>

        {workouts.length === 0 ? (
          <p>No workouts assigned yet.</p>
        ) : (
          workouts.map((workout) => (
            <div
              key={workout._id}
              className="border p-3 rounded mb-3"
            >
              <h3 className="font-bold">{workout.title}</h3>
              <p>{workout.description}</p>

              <p className="text-sm mt-1">
                Status:{" "}
                {workout.completed ? "Completed ✅" : "Pending ⏳"}
              </p>

              {!workout.completed && (
                <button
                  onClick={async () => {
                    try {
                      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

                      await axios.put(
                        `http://localhost:5000/api/workouts/${workout._id}/complete`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                          },
                        }
                      );

                      const response = await axios.get(
                        "http://localhost:5000/api/workouts",
                        {
                          headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                          },
                        }
                      );

                      setWorkouts(response.data);
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                >
                  Mark Completed
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* NUTRITION */}
      <div className="bg-white rounded-xl p-5 shadow">
        <h2 className="text-lg font-bold mb-3">Nutrition Plans</h2>

        {nutritionPlans.length === 0 ? (
          <p>No nutrition plans available.</p>
        ) : (
          nutritionPlans.map((plan) => (
            <div key={plan._id} className="border p-3 rounded mb-3">
              <h3 className="font-bold">{plan.title}</h3>
              <p>{plan.description}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default UserDashboard;
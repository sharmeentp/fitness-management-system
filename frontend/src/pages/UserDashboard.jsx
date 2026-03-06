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
        // Fetch profile
        const profileResponse = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        setUser(profileResponse.data);

        // Fetch workouts
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
    <div style={{ padding: "30px" }}>
      {/* Top Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleLogout} style={{ marginRight: "10px" }}>
          Logout
        </button>

       {!user.isPremium && (
  <button onClick={handlePayment}>
    Upgrade to Premium 💳
  </button>
)}
      </div>

      <h1>
  Welcome, {user.name}{" "}
  {user.isPremium && (
    <span style={{
      backgroundColor: "gold",
      padding: "5px 10px",
      borderRadius: "15px",
      marginLeft: "10px"
    }}>
      ⭐ Premium Member
    </span>
  )}
</h1>

<p>Role: {user.role}</p>

      <hr />

      {/* Trainer Section */}
      <h2>Assigned Trainer</h2>

      {user.trainer ? (
        <div
          style={{
            background: "#f3f3f3",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <p><strong>Name:</strong> {user.trainer.name}</p>
          <p><strong>Email:</strong> {user.trainer.email}</p>
        </div>
      ) : (
        <p>No trainer assigned yet.</p>
      )}

      <hr />

      {/* Workouts Section */}
      <h2>Assigned Workouts</h2>

      {workouts.length === 0 ? (
        <p>No workouts assigned yet.</p>
      ) : (
        workouts.map((workout) => (
          <div
            key={workout._id}
            style={{
              background: "#f3f3f3",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <h3>{workout.title}</h3>
            <p>{workout.description}</p>

            <p>
              <strong>Status:</strong>{" "}
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

                    // Refresh workouts
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
                style={{ marginTop: "10px" }}
              >
                Mark as Completed
              </button>
            )}
          </div>
        ))
      )}
      <hr />

<h2>Nutrition Plans</h2>

{nutritionPlans.length === 0 ? (
  <p>No nutrition plans available.</p>
) : (
  nutritionPlans.map((plan) => (
    <div
      key={plan._id}
      style={{
        background: "#f3f3f3",
        padding: "15px",
        marginBottom: "10px",
      }}
    >
      <h3>{plan.title}</h3>
      <p>{plan.description}</p>
    </div>
  ))
)}
    </div>
  );
};

export default UserDashboard;
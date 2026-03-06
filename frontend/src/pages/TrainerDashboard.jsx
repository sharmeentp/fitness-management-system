import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [users, setUsers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [nutritionTitle, setNutritionTitle] = useState("");
const [nutritionDescription, setNutritionDescription] = useState("");
const [nutritionPlans, setNutritionPlans] = useState([]);


  // Redirect if not trainer
  useEffect(() => {
    if (!userInfo || userInfo.role !== "trainer") {
      navigate("/");
    }
  }, []);

 const fetchUsers = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/users/assigned-users",
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    setUsers(res.data);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchUsers();
}, []);

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/workouts",
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setWorkouts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNutrition = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/nutrition",
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );

    setNutritionPlans(res.data);
  } catch (error) {
    console.log(error);
  }
};

const handleCreateNutrition = async (e) => {
  e.preventDefault();

  if (!selectedUser) {
    alert("Please select a user");
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/api/nutrition",
      {
        title: nutritionTitle,
        description: nutritionDescription,
        user: selectedUser,   // ✅ THIS IS THE FIX
      },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );

    alert("Nutrition Plan Created");

    setNutritionTitle("");
    setNutritionDescription("");
    setSelectedUser("");  // reset dropdown

    fetchNutrition();
  } catch (error) {
    console.log(error);
    alert("Error creating nutrition");
  }
};
  useEffect(() => {
    fetchUsers();
    fetchWorkouts();
    fetchNutrition();
  }, []);

  // Create OR Update Workout
  const handleAssignWorkout = async (e) => {
  e.preventDefault();

  if (!selectedUser) {
    alert("Please select a user");
    return;
  }

  if (!title || !description) {
    alert("Please enter title and description");
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/api/workouts",
      {
        userId: selectedUser,
        title: title,
        description: description
      },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      }
    );

    alert("Workout Assigned Successfully");

    setTitle("");
    setDescription("");
    setSelectedUser("");

    fetchWorkouts();

  } catch (error) {
    console.log(error.response?.data || error);
    alert("Workout assignment failed");
  }
};
  const handleEdit = (workout) => {
    setEditingId(workout._id);
    setTitle(workout.title);
    setDescription(workout.description);
    setSelectedUser(workout.user?._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/workouts/${id}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      alert("Workout Deleted Successfully");
      fetchWorkouts();
    } catch (error) {
      console.log(error);
      alert("Error deleting workout");
    }
  };



  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h2>Welcome Trainer: {userInfo?.name}</h2>

      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>

      <hr />
      

      <h3>{editingId ? "Edit Workout" : "Assign Workout"}</h3>

      <form onSubmit={handleAssignWorkout} style={styles.form}>
        {!editingId && (
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={styles.input}
          >
            <option value="">Select User</option>
            {users.map((user) => (
             <option key={user._id} value={user._id}>
  {user.name} ({user.email}) {user.isPremium ? "⭐ Premium" : ""}
</option>
            ))}
          </select>
        )}

        <input
          type="text"
          placeholder="Workout Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />

        <textarea
          placeholder="Workout Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          {editingId ? "Update Workout" : "Assign Workout"}
        </button>
      </form>

      <hr />

    

      <h3>Create Nutrition Plan</h3>
      <select
  value={selectedUser}
  onChange={(e) => setSelectedUser(e.target.value)}
  required
  style={styles.input}
>
  <option value="">Select User</option>
  {users.map((user) => (
    <option key={user._id} value={user._id}>
      {user.name} ({user.email})
    </option>
  ))}
</select>

<form onSubmit={handleCreateNutrition} style={styles.form}>
  <input
    type="text"
    placeholder="Nutrition Title"
    value={nutritionTitle}
    onChange={(e) => setNutritionTitle(e.target.value)}
    required
    style={styles.input}
  />

  <textarea
    placeholder="Nutrition Description"
    value={nutritionDescription}
    onChange={(e) => setNutritionDescription(e.target.value)}
    required
    style={styles.textarea}
  />

  <button type="submit" style={styles.button}>
    Create Nutrition
  </button>
</form>

<hr />

<h3>My Nutrition Plans</h3>

{nutritionPlans.length === 0 ? (
  <p>No nutrition plans yet.</p>
) : (
  nutritionPlans.map((plan) => (
    <div key={plan._id} style={styles.card}>
      <h4>{plan.title}</h4>
      <p>{plan.description}</p>
      <small>
  Assigned To: {plan.user?.name} ({plan.user?.email})
</small>

      <button
        onClick={async () => {
          try {
            await axios.delete(
              `http://localhost:5000/api/nutrition/${plan._id}`,
              {
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                },
              }
            );

            alert("Deleted Successfully");
            fetchNutrition();
          } catch (error) {
            console.log(error);
          }
        }}
        style={{ backgroundColor: "red", color: "white" }}
      >
        Delete
      </button>
    </div>
  ))
)}

      <h3>My Assigned Workouts</h3>

      {workouts.length === 0 ? (
        <p>No workouts assigned yet.</p>
      ) : (
        workouts.map((workout) => (
          <div key={workout._id} style={styles.card}>
            <h4>{workout.title}</h4>
            <p>{workout.description}</p>

            <p>
              <strong>Status:</strong>{" "}
              {workout.completed ? "Completed ✅" : "Pending ⏳"}
            </p>

           <small>
  Assigned To: {workout.user?.name} ({workout.user?.email}){" "}
  {workout.user?.isPremium ? "⭐ Premium" : ""}
</small>

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => handleEdit(workout)}
                style={{ marginRight: "10px" }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(workout._id)}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { padding: "30px" },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    gap: "10px",
  },
  input: { padding: "8px" },
  textarea: { padding: "8px", height: "80px" },
  button: {
    padding: "10px",
    backgroundColor: "#7b2ff7",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  logout: {
    padding: "8px 15px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginBottom: "10px",
  },
  card: {
    border: "1px solid #ccc",
    padding: "10px",
    marginTop: "10px",
  },
};

export default TrainerDashboard;


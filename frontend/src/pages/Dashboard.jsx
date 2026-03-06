import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ================= FETCH WORKOUTS =================
  const fetchWorkouts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/workouts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWorkouts(res.data);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // ================= CREATE WORKOUT (TRAINER) =================
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/workouts",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkouts([...workouts, res.data]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.log("Create error:", error);
    }
  };

  // ================= MARK COMPLETED (USER) =================
  const handleComplete = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/workouts/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWorkouts(
        workouts.map((w) =>
          w._id === id ? { ...w, completed: true } : w
        )
      );
    } catch (error) {
      console.log("Complete error:", error);
    }
  };

  // ================= DELETE WORKOUT (TRAINER) =================
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/workouts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWorkouts(workouts.filter((w) => w._id !== id));
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  // ================= EDIT WORKOUT (TRAINER) =================
  const handleEdit = async (workout) => {
    const newTitle = prompt("Enter new title:", workout.title);
    const newDescription = prompt(
      "Enter new description:",
      workout.description
    );

    if (!newTitle || !newDescription) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/workouts/${workout._id}`,
        { title: newTitle, description: newDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWorkouts(
        workouts.map((w) =>
          w._id === workout._id ? res.data : w
        )
      );
    } catch (error) {
      console.log("Edit error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {/* ================= TRAINER CREATE FORM ================= */}
      {user.role === "trainer" && (
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Workout Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <br /><br />
          <textarea
            placeholder="Workout Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <br /><br />
          <button type="submit">Add Workout</button>
          <hr />
        </form>
      )}

      {/* ================= WORKOUT LIST ================= */}
      {workouts.map((workout) => (
        <div
          key={workout._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{workout.title}</h3>
          <p>{workout.description}</p>

          {workout.completed && (
            <p style={{ color: "green" }}>Completed</p>
          )}

          {/* USER BUTTON */}
          {user.role === "user" && !workout.completed && (
            <button
              onClick={() => handleComplete(workout._id)}
            >
              Mark Completed
            </button>
          )}

          {/* TRAINER BUTTONS */}
          {user.role === "trainer" && (
            <>
              <button
                onClick={() => handleEdit(workout)}
                style={{ marginRight: "10px" }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(workout._id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;

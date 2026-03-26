import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/users/register", {
        name,
        email,
        password,
        role,
        age,
        gender,
        height,
        weight,
        qualification: role === "trainer" ? qualification : "",
        experience: role === "trainer" ? experience : "",
      });

      alert("Registered Successfully! Waiting for admin approval");
      navigate("/");
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 p-4">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          📝 Register
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-3">

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-400"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-400"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="user">User</option>
            <option value="trainer">Trainer</option>
          </select>

          {/* USER FIELDS */}
          {role === "user" && (
            <>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border p-2 rounded-lg"
              />

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border p-2 rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="number"
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="border p-2 rounded-lg"
              />

              <input
                type="number"
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border p-2 rounded-lg"
              />
            </>
          )}

          {/* TRAINER FIELDS */}
          {role === "trainer" && (
            <>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border p-2 rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                placeholder="Qualification"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="border p-2 rounded-lg"
              />

              <input
                type="number"
                placeholder="Experience (years)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="border p-2 rounded-lg"
              />
            </>
          )}

          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold mt-2"
          >
            Register
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-purple-600 font-semibold">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
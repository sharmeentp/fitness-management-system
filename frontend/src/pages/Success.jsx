import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const upgradeUser = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) return;

      try {
        await axios.put(
          "http://localhost:5000/api/users/upgrade",
          {},
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        console.log("User upgraded to premium");
      } catch (error) {
        console.log("Upgrade error:", error);
      }
    };

    upgradeUser();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Payment Successful 🎉</h2>
      <p>You are now a Premium Member.</p>

      <button onClick={() => navigate("/user")}>
        Go Back to Dashboard
      </button>
    </div>
  );
};

export default Success;
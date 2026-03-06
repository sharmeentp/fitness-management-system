import React from "react";

const Payment = () => {
  const handlePayment = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;

      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: 500 }),
        }
      );

      const data = await res.json();

      console.log("Payment Response:", data);

      if (data.url) {
        window.location.href = data.url; // redirect to Stripe
      } else {
        alert("Payment failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Premium Membership</h2>
      <button onClick={handlePayment}>
        Pay ₹500
      </button>
    </div>
  );
};

export default Payment;
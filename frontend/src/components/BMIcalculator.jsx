import React, { useState, useEffect } from "react";

const BMICalculator = ({ userData }) => {
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    if (!userData) return;

    const height = userData.height;
    const weight = userData.weight;

    if (!height || !weight) return;

    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    setBmi(bmiValue);

    // Category
    let cat = "";
    if (bmiValue < 18.5) cat = "Underweight";
    else if (bmiValue < 25) cat = "Normal";
    else if (bmiValue < 30) cat = "Overweight";
    else cat = "Obese";

    setCategory(cat);

    // 🤖 AI Advice
    if (cat === "Underweight") {
      setAdvice("Increase calorie intake and strength training.");
    } else if (cat === "Normal") {
      setAdvice("Maintain your healthy lifestyle 👍");
    } else if (cat === "Overweight") {
      setAdvice("Start cardio + balanced diet.");
    } else {
      setAdvice("Consult trainer + strict diet plan needed.");
    }

    // 🔥 Save to backend
    const saveBMI = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        await fetch("http://localhost:5000/api/bmi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({
            userId: userData._id,
            height,
            weight,
            bmi: bmiValue,
          }),
        });

        console.log("BMI saved ✅");
      } catch (error) {
        console.log("Error saving BMI ❌", error);
      }
    };

    saveBMI();
  }, [userData]);

  if (!userData) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-xl font-bold mb-4">
        📊 BMI Report (AI Powered)
      </h2>

      <p><strong>Height:</strong> {userData.height} cm</p>
      <p><strong>Weight:</strong> {userData.weight} kg</p>

      {bmi && (
        <>
          <h3 className="mt-3 font-semibold">BMI: {bmi}</h3>
          <p>Category: {category}</p>

          <div className="mt-3 p-3 bg-purple-100 rounded">
            <p className="font-semibold text-purple-800">
              🤖 AI Recommendation:
            </p>
            <p>{advice}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default BMICalculator;
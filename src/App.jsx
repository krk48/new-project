import React, { useState } from "react";
import "./App.css";

// Initial Food Database
const initialFoodDB = {
  egg: { protein: 6, calcium: 25, iron: 1, serving: "1 boiled egg (~50g)" },
  milk: { protein: 8, calcium: 300, iron: 0, serving: "1 glass (~250ml)" },
  idli: { protein: 2, calcium: 10, iron: 0.2, serving: "1 medium idli (~40g)" },
  dal: { protein: 9, calcium: 19, iron: 2, serving: "1 katori (~150g cooked)" },
  chicken: { protein: 27, calcium: 15, iron: 1.3, serving: "100g cooked chicken" },
  paneer: { protein: 14, calcium: 265, iron: 0.5, serving: "100g paneer" },
  spinach: { protein: 3, calcium: 99, iron: 2.7, serving: "1 cup cooked (~180g)" },
  sambar: { protein: 4, calcium: 30, iron: 0.6, serving: "1 katori (~150g)" },
  bread: { protein: 2, calcium: 30, iron: 0.7, serving: "1 slice (~25g)" },
};

// Daily Nutrient Requirements
const RDA = { protein: 50, calcium: 1000, iron: 12 };

// Suggestions
const suggestions = {
  protein: "🥚 Eat eggs, dal, or chicken for more protein.",
  calcium: "🥛 Drink milk or eat paneer/spinach for calcium.",
  iron: "🥬 Add spinach or dal for more iron.",
};

function App() {
  const [selectedRole, setSelectedRole] = useState(""); // dropdown choice
  const [role, setRole] = useState(null); // logged-in role
  const [foodDB, setFoodDB] = useState(initialFoodDB);

  // Login info
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // User Dashboard
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [mealInput, setMealInput] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [meals, setMeals] = useState([]);
  const [result, setResult] = useState(null);

  // Admin Dashboard
  const [newFood, setNewFood] = useState("");
  const [nutrients, setNutrients] = useState({ protein: "", calcium: "", iron: "", serving: "" });

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedRole === "admin" && username === "admin" && password === "admin123") {
      setRole("admin");
    } else if (selectedRole === "user" && username === "user" && password === "user123") {
      setRole("user");
    } else {
      alert("❌ Invalid credentials! Users: user/user123, Admin: admin/admin123");
    }
  };

  const addMeal = () => {
    if (mealInput && quantity > 0) {
      setMeals([...meals, { food: mealInput.toLowerCase().trim(), qty: Number(quantity) }]);
      setMealInput("");
      setQuantity(1);
    }
  };

  const analyzeMeals = () => {
    let total = { protein: 0, calcium: 0, iron: 0 };
    meals.forEach(({ food, qty }) => {
      if (foodDB[food]) {
        total.protein += foodDB[food].protein * qty;
        total.calcium += foodDB[food].calcium * qty;
        total.iron += foodDB[food].iron * qty;
      }
    });

    let feedback = {};
    let advice = [];

    Object.keys(RDA).forEach((nutrient) => {
      if (total[nutrient] >= RDA[nutrient]) feedback[nutrient] = `✅ Good! ${nutrient} is sufficient`;
      else {
        feedback[nutrient] = `⚠ You need ${RDA[nutrient] - total[nutrient]} more ${nutrient}`;
        advice.push(suggestions[nutrient]);
      }
    });

    setResult({ total, feedback, advice });
  };

  const addFood = () => {
    if (newFood && nutrients.protein && nutrients.calcium && nutrients.iron && nutrients.serving) {
      setFoodDB({
        ...foodDB,
        [newFood.toLowerCase()]: {
          protein: Number(nutrients.protein),
          calcium: Number(nutrients.calcium),
          iron: Number(nutrients.iron),
          serving: nutrients.serving,
        },
      });
      alert(`${newFood} added successfully!`);
      setNewFood("");
      setNutrients({ protein: "", calcium: "", iron: "", serving: "" });
    }
  };

  const logout = () => {
    setRole(null);
    setMeals([]);
    setResult(null);
    setUsername("");
    setPassword("");
    setName("");
    setSelectedRole("");
  };

  // --- Render ---
  if (!role)
    return (
      <div className="container">
        <h2>🍽 Nutrition Tracker Login</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Login</button>
        </form>
      </div>
    );

  if (role === "admin")
    return (
      <div className="container">
        <h2>👨‍⚕️ Admin Dashboard</h2>
        <input type="text" placeholder="Food name" value={newFood} onChange={(e) => setNewFood(e.target.value)} />
        <input type="number" placeholder="Protein (g)" value={nutrients.protein} onChange={(e) => setNutrients({ ...nutrients, protein: e.target.value })} />
        <input type="number" placeholder="Calcium (mg)" value={nutrients.calcium} onChange={(e) => setNutrients({ ...nutrients, calcium: e.target.value })} />
        <input type="number" placeholder="Iron (mg)" value={nutrients.iron} onChange={(e) => setNutrients({ ...nutrients, iron: e.target.value })} />
        <input type="text" placeholder="Serving info (e.g., 1 slice, 1 cup)" value={nutrients.serving} onChange={(e) => setNutrients({ ...nutrients, serving: e.target.value })} />
        <button onClick={addFood}>Add Food</button>

        <h3>📋 Current Foods:</h3>
        <ul>
          {Object.entries(foodDB).map(([food, data]) => (
            <li key={food}>
              <b>{food}</b> ({data.serving}) → Protein: {data.protein}g, Calcium: {data.calcium}mg, Iron: {data.iron}mg
            </li>
          ))}
        </ul>
        <button onClick={logout}>Logout</button>
      </div>
    );

  if (role === "user")
    return (
      <div className="container">
        <h2>👤 User Dashboard</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} />

        <div className="meal-input">
          <input type="text" placeholder="Food (e.g., egg)" value={mealInput} onChange={(e) => setMealInput(e.target.value)} />
          <input type="number" min="1" placeholder="Qty" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <button onClick={addMeal}>Add Meal</button>
        </div>

        <button onClick={analyzeMeals}>Analyze</button>

        {result && (
          <div className="results">
            <h3>📊 Nutrient Summary for {name}</h3>
            <p>Protein: {result.total.protein}g</p>
            <p>Calcium: {result.total.calcium}mg</p>
            <p>Iron: {result.total.iron}mg</p>

            <h4>Feedback:</h4>
            <ul>
              {Object.values(result.feedback).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            {result.advice.length > 0 && (
              <div>
                <h4>🍽 Suggestions:</h4>
                <ul>
                  {result.advice.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4>ℹ Serving Info:</h4>
              <ul>
                {Object.entries(foodDB).map(([food, data]) => (
                  <li key={food}>
                    <b>{food}</b>: {data.serving}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button onClick={logout}>Logout</button>
      </div>
    );
}

export default App;

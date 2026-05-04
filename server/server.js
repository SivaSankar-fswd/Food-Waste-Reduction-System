require("dotenv").config();
const express = require("express");
const cors = require("cors");


const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const contactRoutes = require("./routes/contactRoutes");


const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for large images
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Root route for health check
app.get("/", (req, res) => {
  res.send("Food Donate API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/contact", contactRoutes);

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chatbot", chatRoutes);

const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

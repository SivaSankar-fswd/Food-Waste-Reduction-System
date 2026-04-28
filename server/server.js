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

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/contact", contactRoutes);

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chatbot", chatRoutes);

const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

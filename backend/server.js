
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";


import bookingRoutes from "./routes/bookingRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ status: "✅ Backend is running", time: new Date().toISOString() });
});


const users = [
  {
    id: 1,
    name: "Admin",
    email: "admin@example.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
];


app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required ❌" });

    const userExists = users.find((u) => u.email === email);
    if (userExists)
      return res.status(400).json({ error: "User already exists ❌" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      role: "user",
    };
    users.push(newUser);

    res.json({ message: "User registered ✅", user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed ❌" });
  }
});


app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) return res.status(400).json({ error: "User not found ❌" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password ❌" });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful ✅", token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed ❌" });
  }
});


app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required ❌" });

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ error: "User not found ❌" });

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour

  console.log(
    `🔗 Password reset link for ${email}: http://localhost:3000/reset-password/${resetToken}`
  );

  res.json({ message: "Password reset link generated ✅" });
});


app.post("/api/auth/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = users.find(
    (u) => u.resetToken === token && u.resetTokenExpiry > Date.now()
  );
  if (!user) return res.status(400).json({ error: "Invalid or expired token ❌" });

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  delete user.resetToken;
  delete user.resetTokenExpiry;

  res.json({ message: "Password has been reset successfully ✅" });
});


export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Access denied ❌" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied ❌" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token ❌" });
  }
}

app.use("/api/bookings", bookingRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes); 


mongoose
  .connect(process.env.MONGO_URI, { dbName: "my-movie" })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

//====== Middleware ======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//====== Routes ======
app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);

//====== 404 handler ======
app.use((req, res) => {
  res.status(404).json({ message: "Route 404 not found" });
});

//====== Error handler ======
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

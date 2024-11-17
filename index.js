import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// import cors from "cors";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import academicRoutes from "./routes/academic.routes.js";
import jobRoutes from "./routes/Jobs.routes.js";
import profRoutes from "./routes/profile.routes.js";

import cors from "cors";
dotenv.config({});
// import cors from "cors"

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use(cookieParser());
const corsOptions = {
  origin: "http//localhost:5173",
  credentials: true,
};
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Replace with your frontend URL
  })
);

const port = process.env.PORT || 3000;
//api's
app.use("/api/user", userRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/profile", profRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  connectDB();
  console.log(`listening at port ${port}`);
});

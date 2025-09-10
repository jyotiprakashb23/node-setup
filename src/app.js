import express from "express";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import propertyRouter from "./routes/propertyRoutes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/properties", propertyRouter);

app.get("/", (req, res) => {
  res.send("Hello from Express App!");
});

export default app;

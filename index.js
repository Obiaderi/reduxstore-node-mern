import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// custom Imports
import userRouter from "./routes/user.js";
import tourRouter from "./routes/tour.js";

//
const port = process.env.PORT || 5000;

const app = express();
dotenv.config();

// log our http requests
app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// custom Use
app.use("/users", userRouter);
app.use("/tour", tourRouter);
app.use("/", (req, res) => {
  res.send("Welcome to ReduxStore APIs");
});

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`server running on port ${port}, with MongoDB connected`);
    });
  })
  .catch((err) => console.log(`${err}, did not connect`));

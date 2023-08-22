import express from "express";
import cors from "cors";
import pool from "./db";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import "dotenv/config";
const app = express();
const port = process.env.PORT || 3001;

//middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

//routes
app.use("/", routes);

app.listen(port, async () => {
  try {
    const db = await pool.connect();
    console.log(`Connected to database and listening on port: ${port}`);
    db.release();
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
});

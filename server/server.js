import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/records.js";
import eventRouter from "./routes/events.js";
dotenv.config({ path: ".env" });

const port = process.env.PORT || 5001;
const app = express();

app.use(
  cors({origin: "*",})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/records", router);  // Routes pour records/users
app.use("/api/events", eventRouter);  // Routes pour events

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
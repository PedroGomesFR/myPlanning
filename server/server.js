import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import router from "./routes/records.js";
import eventRouter from "./routes/events.js";
import serviceRouter from "./routes/services.js";
import uploadRouter from "./routes/uploads.js";
import bookingRouter from "./routes/bookings.js";
import reviewRouter from "./routes/reviews.js";
import availabilityRouter from "./routes/availability.js"; // Added availabilityRouter
import adminRouter from "./routes/admin.js"; // Added adminRouter
dotenv.config({ path: ".env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5001;
const app = express();

app.use(
  cors({ origin: "*", })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads directory
app.use("/api/records", router); // Register records routes
app.use("/api/services", serviceRouter); // Register services routes
app.use("/api/bookings", bookingRouter); // Register bookings routes
app.use("/api/reviews", reviewRouter); // Register reviews routes
app.use("/api/availability", availabilityRouter); // Register availability routes
app.use("/api/uploads", uploadRouter); // Register uploads routes
app.use("/api/admin", adminRouter); // Register admin routes

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
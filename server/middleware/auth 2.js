import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "mycontacts_jwt_secret";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "24h" });
};

export const verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("No token provided");

      return res
        .status(401)
        .json({ error: "No token provided, authorization denied" });
    }
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token is invalid or expired" });
  }
};
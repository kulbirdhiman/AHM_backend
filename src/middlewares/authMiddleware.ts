import jwt from "jsonwebtoken";
import User from "../models/User";
import { Request, Response, NextFunction } from "express";

export const protect = async (req: any, res: Response, next: NextFunction) => {
  console.log("call")
  try {
    const token = req.cookies.jwt;
    console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log(decoded?.id)
    req.user = await User.findByPk(decoded.id);

    if (!req.user) {
      // return res.status(401).json({ message: "User not found ", });
      console.log("s")
    }

    next();
  } catch (error) {
    console.log("Auth Error:", error);
    res.status(401).json({ message: "Not authorized" });
  }
};

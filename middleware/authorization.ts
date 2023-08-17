import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import pool from "../db";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  const secret = process.env.JWT_SECRET as string;

  if (token) {
    try {
      const decoded = jwt.verify(token, secret);

      const { userId } = decoded as { userId: number };

      if (userId) {
        const user = await pool.query("SELECT * FROM users WHERE id =$1", [
          userId,
        ]);
        const userData = {
          id: user.rows[0].id,
          username: user.rows[0].username,
          email: user.rows[0].email,
          avatar: user.rows[0].avatar,
          bg_img: user.rows[0].bg_img,
        };
        req.user = userData;
        return next();
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  } else {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};

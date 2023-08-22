import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (res: Response, payload: any) => {
  const secret = process.env.JWT_SECRET;

  const token = jwt.sign(payload, secret as string, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

export default generateToken;

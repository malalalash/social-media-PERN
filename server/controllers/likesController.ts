import { Request, Response } from "express";
import pool from "../db";

export const addLike = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const newLike = await pool.query(
      `INSERT INTO likes (post_id, user_id) VALUES ($1, $2)`,
      [id, userId]
    );

    return res.status(200).json({
      message: "Liked!",
      likedPost: newLike.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const removeLike = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const deleteLike = await pool.query(
      `DELETE FROM likes WHERE post_id = $1 AND user_id = $2`,
      [id, userId]
    );
    return res.status(200).json({
      message: "Unliked!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const getLikes = async (req: Request, res: Response) => {
  try {
    const id = req.query.postId;
    const likes = await pool.query(
      `SELECT user_id FROM likes WHERE post_id = $1`,
      [id]
    );

    return res.status(200).json({
      likes: likes.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

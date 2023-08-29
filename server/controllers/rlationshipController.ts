import { Request, Response } from "express";
import pool from "../db";

export const follow = async (req: Request, res: Response) => {
  try {
    const followerId = req.user?.id;
    const followedId = req.params.id;

    const existingFollow = await pool.query(
      `SELECT id FROM relationships WHERE follower_id = $1 AND followed_id = $2`,
      [followerId, followedId]
    );
    if (existingFollow.rows.length > 0) {
      const deleteFollow = await pool.query(
        `DELETE FROM relationships WHERE follower_id = $1 AND followed_id = $2`,
        [followerId, followedId]
      );
      return res.status(200).json({
        message: "Unfollowed!",
      });
    }

    const newFollow = await pool.query(
      `INSERT INTO relationships (follower_id, followed_id) VALUES ($1, $2)`,
      [followerId, followedId]
    );
    return res.status(200).json({
      message: "Followed!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const followedId = req.params.id;
    const followers = await pool.query(
      `SELECT * FROM relationships WHERE followed_id = $1`,
      [followedId]
    );

    return res.status(200).json({
      followers: followers.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getFollowed = async (req: Request, res: Response) => {
  try {
    const followerId = req.params.id;
    const following = await pool.query(
      `SELECT * FROM relationships WHERE follower_id = $1`,
      [followerId]
    );
    return res.status(200).json({
      following: following.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

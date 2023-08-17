import { Request, Response } from "express";
import pool from "../db";

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const postId = req.query.postId;
    const allComments = await pool.query(
      `SELECT c.id, c.content, c.user_id, c.post_id, c.created_at, u.username, u.avatar FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at DESC;`,
      [postId]
    );

    return res.status(200).json({
      comments: allComments.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong loading comments",
    });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { postId, content } = req.body;
    const newComment = await pool.query(
      `INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3)`,
      [userId, postId, content]
    );

    return res.status(200).json({
      message: "Comment added!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Could not add comment",
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const isComment = await pool.query(`SELECT * FROM comments WHERE id = $1`, [
      id,
    ]);
    if (isComment.rows.length < 1) {
      return res.status(400).json({
        message: "Comment not found",
      });
    }
    if (isComment.rows[0].user_id !== userId) {
      return res.status(400).json({
        message: "Unauthorized: You can only delete your own comments",
      });
    }

    const deleteComment = await pool.query(
      `DELETE FROM comments WHERE id = $1`,
      [id]
    );
    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Could not delete comment",
    });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const userId = req.user?.id;

    // check if comment exists
    const isComment = await pool.query(`SELECT * FROM comments WHERE id =$1`, [
      id,
    ]);
    if (isComment.rows.length < 1) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    // check if creator of the comment is the user
    if (isComment.rows[0].user_id !== userId) {
      return res.status(403).json({
        message: "Unauthorized: You can only update your own comments",
      });
    }

    const updatedComment = await pool.query(
      `UPDATE comments SET content = $1 WHERE id = $2`,
      [description, id]
    );
    const result = updatedComment.rows[0];
    return res.status(200).json({
      message: "Comment updated successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Could not update comment",
    });
  }
};

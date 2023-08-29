import { Request, Response } from "express";
import pool from "../db";
import { deleteImage, resizeImage, uploadImage } from "../cloudinary";
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const nextPage = page + 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = (page - 1) * limit;
    const limitedPosts = await pool.query(
      "SELECT p.id, p.description, p.img, p.created_at, p.user_id, p.public_id, u.username, u.avatar FROM posts p JOIN users u ON p.user_id = u.id ORDER BY created_at DESC LIMIT $1 OFFSET $2;",
      [limit, offset]
    );
    const posts = limitedPosts.rows;

    if (posts.length < 10) {
      return res.status(200).json({
        posts,
        page: undefined,
        nextPage: undefined,
      });
    }
    return res.status(200).json({
      posts,
      page,
      nextPage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const createPost = async (req: Request, res: Response) => {
  try {
    const { description, img } = req.body;
    const userId = req.user?.id;

    if (img) {
      const response = await uploadImage(img);
      const public_id = response?.public_id;
      const resizedImage = resizeImage(public_id!);
      const newPost = await pool.query(
        "INSERT INTO posts (description, img, user_id, public_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [description, resizedImage, userId, public_id]
      );
      return res.status(201).json({
        message: "Post created successfully",
        post: newPost.rows[0],
      });
    } else {
      const newPost = await pool.query(
        "INSERT INTO posts (description, user_id) VALUES ($1, $2) RETURNING *",
        [description, userId]
      );
      return res.status(201).json({
        message: "Post created successfully",
        post: newPost.rows[0],
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong creating post",
    });
  }
};
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const userId = req.user?.id;

    // check if post exists
    const isPost = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (isPost.rows.length < 1) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // check for creator of the post
    if (isPost.rows[0].user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only update your own posts" });
    }

    // update post
    const updatedPostQuery = await pool.query(
      "UPDATE posts SET description = $1 WHERE id = $2 RETURNING *",
      [description, id]
    );

    const updatedPost = updatedPostQuery.rows[0];
    return res.status(200).json({
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong updating post",
    });
  }
};
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { public_id } = req.body;
    const userId = req.user?.id;

    if (public_id) {
      const response = await deleteImage(public_id);
    }

    const isPost = await pool.query("SELECT * FROM posts WHERE id =$1", [id]);

    if (isPost.rows.length < 1) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (isPost.rows[0].user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only delete your own posts" });
    }

    const deletePost = await pool.query("DELETE FROM posts WHERE id = $1", [
      id,
    ]);

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong deleting post",
    });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const getPosts = await pool.query(
      `SELECT p.id, p.description, p.img, p.created_at, p.user_id, p.public_id, u.username, u.avatar FROM posts p JOIN users u ON p.user_id = u.id WHERE p.user_id = $1 ORDER BY created_at DESC LIMIT 10`,
      [id]
    );

    if (getPosts.rows.length < 0) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }
    return res.status(200).json({
      posts: getPosts.rows,
      message: "Posts fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong loading posts",
    });
  }
};

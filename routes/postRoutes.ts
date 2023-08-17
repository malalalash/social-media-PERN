import { Router } from "express";
import { checkAuth } from "../middleware/authorization";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  
} from "../controllers/postsController";

const router = Router();

// get all posts
router.get("/", checkAuth, getAllPosts);

// create new post
router.post("/create", checkAuth, createPost);

// update post
router.put("/update/:id", checkAuth, updatePost);

// delete post
router.delete("/delete/:id", checkAuth, deletePost);

// get posts by user
router.get("/user/:id", checkAuth, getUserPosts);

export default router;

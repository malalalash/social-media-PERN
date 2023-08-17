import { Router } from "express";
import { addLike, removeLike, getLikes } from "../controllers/likesController";
import { checkAuth } from "../middleware/authorization";

const router = Router();

// like a post
router.post("/post/:id/like", checkAuth, addLike);

// dislike a post
router.delete("/post/:id/dislike", checkAuth, removeLike);

// get all likes
router.get("/likes", checkAuth, getLikes);

export default router;

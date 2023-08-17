import { Router } from "express";
import { checkAuth } from "../middleware/authorization";
import {
  addComment,
  getAllComments,
  deleteComment,
  updateComment,
} from "../controllers/commentsController";

const router = Router();

// get all comments
router.get("/", checkAuth, getAllComments);

// create new comment
router.post("/create", checkAuth, addComment);

// delete comment
router.delete("/delete/:id", checkAuth, deleteComment);

// edit comment
router.put("/update/:id", checkAuth, updateComment);

export default router;

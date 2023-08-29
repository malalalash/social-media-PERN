import { Router } from "express";
import {
  follow,
  getFollowers,
  getFollowed,
} from "../controllers/rlationshipController";
import { checkAuth } from "../middleware/authorization";

const router = Router();

router.post("/follow/:id", checkAuth, follow);

router.get("/followers/:id", checkAuth, getFollowers);

router.get("/followed/:id", checkAuth, getFollowed);

export default router;

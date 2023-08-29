import { Router } from "express";
import userRoutes from "./usersRoutes";
import postRoutes from "./postRoutes";
import likesRoutes from "./likesRoutes";
import commentsRoutes from "./commentsRoutes";
import relationshipsRoutes from "./relationshipsRoutes";

const router = Router();

router.use("/", userRoutes);
router.use("/post", postRoutes);
router.use("/", likesRoutes);
router.use("/comments", commentsRoutes);
router.use("/", relationshipsRoutes);

export default router;

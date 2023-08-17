import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getUser,
  updateAvatar,
  updateUser,
  deleteUser,
  updateBgImg,
  getUserById,
  getUsersAutocomplete,
} from "../controllers/userController";
import { checkAuth } from "../middleware/authorization";

const router = Router();

// login route
router.post("/login", loginUser);

// register route
router.post("/register", createUser);

// logout user
router.post("/logout", logoutUser);

// get user
router.get("/user/", checkAuth, getUser);

// update user info
router.put("/user/update", checkAuth, updateUser);

// update avatar
router.put("/upload/avatar", checkAuth, updateAvatar);

// update background image
router.put("/upload/background", checkAuth, updateBgImg);

// delete user
router.delete("/user/delete", checkAuth, deleteUser);

// get single user
router.get("/user/:id", checkAuth, getUserById);

// get users autocomplete
router.get("/users/autocomplete", checkAuth, getUsersAutocomplete);

export default router;

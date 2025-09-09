import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserById,
} from "../controllers/User.controller";
const router = express.Router();

router.route("/").post(registerUser).get(getAllUsers);
router.route("/login").post(loginUser);
router.route("/:id").put(updateUser).delete(deleteUser).get(getUserById);

export default router;

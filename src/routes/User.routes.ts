import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserById,
} from "../controllers/User.controller";
import { protect } from "../middlewares/authMiddleware";
const router = express.Router();

router.route("/").post(registerUser).get(getAllUsers);
router.route("/login").post(loginUser);
router.route("/:id").put(updateUser).delete(deleteUser).get(getUserById);
// router.get("/profile", protect, (req:any, res) => {
//   console.log("api call")
//   // res.json({ message: "Profile data", user: req.user });
// });

router.route("/profile").get( ()=>{
  console.log("appi call")
} )

export default router;

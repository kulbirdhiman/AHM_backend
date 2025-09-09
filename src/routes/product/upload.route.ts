import express from "express";
import upload from "../../middlewares/uploads";

// import { authenticateUser } from "../middlewares/auth"; // Optional authentication middleware
import { deleteFiles, uploadFile } from "../../controllers/upload.controller";

const router = express.Router();

// POST /v1/upload
router.post("/", upload.array("file"), uploadFile);

router.post("/delete", deleteFiles);

export default router;

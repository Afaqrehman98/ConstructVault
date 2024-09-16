import express from "express";
import {
  getFoldersController,
  createFolderController,
  updateFolderController,
  deleteFolderController,
} from "../controllers/FolderController";
import { validateId, validateFolderName } from "../middlewares/validation";

const router = express.Router();

// Route to get all folders
router.get("/", getFoldersController);

// Route to create a new folder
router.post("/", createFolderController);

// Route to update a folder's name
router.patch("/:id", updateFolderController);

// Route to delete a folder
router.delete("/:id", deleteFolderController);

export default router;

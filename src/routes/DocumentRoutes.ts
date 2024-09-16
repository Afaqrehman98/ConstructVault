import express from "express";
import multer from "multer";
import {
  uploadDocumentController,
  downloadDocumentController,
  deleteDocumentController,
  updateDocumentController,
} from "../controllers/DocumentController";
import { checkFilePresence } from "../middlewares/validation";

const router = express.Router();
// Multer setup
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit, can be adjusted based on needs
}).single("data"); // 'file' should match the field name used in form-data

// Route to handle file download
router.get("/:id", downloadDocumentController);

// Route to handle file upload
router.post("/", upload, checkFilePresence, uploadDocumentController);

// Route to handle file delete
router.patch("/:id", updateDocumentController);

// Route to handle file delete
router.delete("/:id", deleteDocumentController);

export default router;

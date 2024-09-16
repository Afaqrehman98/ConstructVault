import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File; // Type for a single file upload
      files?: { [fieldname: string]: Multer.File[] } | Multer.File[]; // Type for multiple file uploads
    }
  }
}

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Middleware for validating folder name
export const validateFolderName = [
  body("name")
    .notEmpty()
    .withMessage("Folder name is required")
    .isString()
    .withMessage("Folder name must be a string")
    .custom((value) => {
      // Allow "root" or "Folder-X" format
      const isValidRoot = value === "root";
      const isValidFolderName = /^Folder-\d+$/.test(value);
      if (!isValidRoot && !isValidFolderName) {
        throw new Error(
          'Folder name must be "root" or in the format "Folder-X" where X is a number.'
        );
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Middleware triggered");
    const errors = validationResult(req);
    console.log("Validation Errors:", errors.array());

    if (!errors.isEmpty()) {
      console.log("Returning validation error response");
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("No validation errors, proceeding to next middleware");
    next();
  },
];

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({ error: "ID parameter is required" });
  }

  next();
};

export const checkFilePresence = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  next();
};

import { Request, Response } from "express";
import {
  fetchFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} from "../services/FolderService";

// Get all folders and their subfolders and documents
export const getFoldersController = async (req: Request, res: Response) => {
  try {
    // Call the service to get folders
    const folders = await fetchFolders();

    // Return the folders as JSON
    res.json(folders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving folders" });
  }
};

// Create a folder
export const createFolderController = async (req: Request, res: Response) => {
  try {
    const { name, parentId } = req.body;

    // Call the service to create the folder
    const newFolder = await createFolder(name, parentId);

    // Return the created folder with status 201
    res.status(201).json(newFolder);
  } catch (error) {
    console.error(error);

    // Handle error
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error creating folder" });
    }
  }
};

// Update a folder's name
export const updateFolderController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || !name) {
      return res.status(400).json({ message: "ID and name are required" });
    }

    // Call the update function
    const folder = await updateFolder(name, id);

    // Respond with the updated folder
    res.json(folder);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error updating folder" });
    }
  }
};

// Delete a folder
export const deleteFolderController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Call the service to delete the folder
    await deleteFolder(id);

    // Send a 204 No Content response on successful deletion
    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error deleting folder" });
    }
  }
};

import { Request, Response } from "express";
import DocumentService from "../services/DocumentService";
import { Readable } from "stream";
import stream from "stream";
import util from "util";

const pipeline = util.promisify(stream.pipeline);

export const uploadDocumentController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { parentId } = req.body;
    const file = req.file;

    const newDocument = await DocumentService.uploadDocument(file, parentId);

    res.status(201).json(newDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const downloadDocumentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const stream = await DocumentService.downloadDocument(id);

    if (!stream) {
      return res.status(404).json({ message: "File not found in S3" });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${id.split("-")[1]}"`
    );

    if (stream instanceof Readable) {
      await pipeline(stream, res);
    } else {
      res.status(500).json({ message: "Unexpected stream type from S3" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const deleteDocumentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await DocumentService.deleteDocument(id);

    res.status(200).json({ message: "Document Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const updateDocumentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedDocument = await DocumentService.updateDocument(id, name);

    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

import { Document } from "../models/document";
import { Folder } from "../models/folder";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Op } from "sequelize";
import { sequelize } from "../utils/db";
import s3Client from "../utils/s3Client";
import path from "path";
import { Readable } from "stream";

class DocumentService {
  async uploadDocument(
    file: Express.Multer.File,
    parentId: string | undefined
  ): Promise<Document> {
    const fileName = Date.now() + path.extname(file.originalname);
    const uploadParams = {
      Bucket: "cocrafter-dev",
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    let folderId: number | null = null;

    if (parentId && parentId !== "root") {
      const folder = await Folder.findOne({
        where: {
          name: {
            [Op.iLike]: parentId,
          },
        },
      });

      if (!folder) {
        throw new Error("Parent folder not found");
      }

      folderId = folder.id;
    }

    const maxDocument = await Document.findOne({
      attributes: [[sequelize.fn("max", sequelize.col("id")), "maxId"]],
    });

    const maxId = maxDocument?.get("maxId") as number | undefined;
    const nextId = maxId ? maxId + 1 : 1;
    const documentName = `Document-${nextId}`;

    return Document.create({
      name: documentName,
      parentId: folderId,
      url: `${process.env.S3_ENDPOINT}/cocrafter-dev/${fileName}`,
    });
  }

  async downloadDocument(id: string): Promise<Readable | null> {
    const documentId = parseInt(id.split("-")[1], 10);

    if (isNaN(documentId)) {
      throw new Error("Invalid document ID format");
    }

    const document = await Document.findByPk(documentId);

    if (!document) {
      throw new Error("Document not found");
    }

    const downloadParams = {
      Bucket: "cocrafter-dev",
      Key: document.url.split("/").pop(),
    };

    const { Body } = await s3Client.send(new GetObjectCommand(downloadParams));

    if (!Body) {
      throw new Error("File not found in S3");
    }

    return Body as Readable;
  }

  async deleteDocument(id: string): Promise<void> {
    const documentId = parseInt(id.split("-")[1], 10);

    if (isNaN(documentId)) {
      throw new Error("Invalid document ID format");
    }

    const document = await Document.findByPk(documentId);

    if (!document) {
      throw new Error("Document not found");
    }

    await document.destroy();
  }

  async updateDocument(id: string, name: string): Promise<Document> {
    const documentId = parseInt(id.split("-")[1], 10);

    if (isNaN(documentId)) {
      throw new Error("Invalid document ID format");
    }

    const document = await Document.findByPk(documentId);

    if (!document) {
      throw new Error("Document not found");
    }

    document.name = name;
    await document.save();
    return document;
  }
}

export default new DocumentService();

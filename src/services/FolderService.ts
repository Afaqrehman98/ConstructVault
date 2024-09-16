import { Folder } from "../models/folder";
import { Document } from "../models/document";
import { Op } from "sequelize";
import { getNextFolderNumber, deleteSubfolders } from "../utils/folderUtils";

// Utility function to transform folder structure
const transformFolderStructure = (folder: any): any => {
  return {
    id: `${folder.name}`,
    name: folder.name,
    children: (folder.subfolders || []).map((subfolder: any) =>
      transformFolderStructure(subfolder)
    ),
    documents: (folder.documents || []).map((document: any) => ({
      id: `document-${document.id}`,
      name: document.name,
    })),
  };
};

export const fetchFolders = async (): Promise<any> => {
  try {
    const folders = await Folder.findAll({
      include: [
        {
          model: Folder,
          as: "subfolders",
          include: [
            {
              model: Folder,
              as: "subfolders",
              include: [{ model: Document, as: "documents" }],
            },
            { model: Document, as: "documents" },
          ],
        },
        { model: Document, as: "documents" },
      ],
      where: { parentId: null },
    });

    const rootDocuments = await Document.findAll({
      where: { parentId: null },
    });

    if (!Array.isArray(folders)) {
      throw new Error("Fetched folders is not an array or is undefined");
    }

    const transformedFolders = folders.map((folder: any) =>
      transformFolderStructure(folder)
    );

    const rootLevelDocuments = rootDocuments.map((document: any) => ({
      id: `document-${document.id}`,
      name: document.name,
    }));

    return {
      id: "root",
      name: "Root",
      children: transformedFolders,
      documents: rootLevelDocuments,
    };
  } catch (error) {
    throw new Error(`Error fetching folders: ${error}`);
  }
};

export const createFolder = async (name?: string, parentId?: string | null) => {
  try {
    let actualParentId: number | null = null;

    if (parentId) {
      if (parentId === "root") {
        actualParentId = null;
      } else {
        const parentFolder = await Folder.findOne({
          where: { name: parentId },
        });
        if (parentFolder) {
          actualParentId = parentFolder.id;
        } else {
          throw new Error("Parent folder does not exist");
        }
      }
    }

    if (!name) {
      let newIdNumber: number;

      if (actualParentId === null) {
        newIdNumber = await getNextFolderNumber(null);
        name = `Folder-${newIdNumber}`;
      } else {
        const parentFolder = await Folder.findByPk(actualParentId);
        if (!parentFolder) {
          throw new Error("Parent folder does not exist");
        }

        const parentFolderName = parentFolder.name || "Folder";
        newIdNumber = await getNextFolderNumber(actualParentId);
        name = `${parentFolderName}-${newIdNumber}`;
      }
    }

    const newFolder = await Folder.create({ name, parentId: actualParentId });
    return newFolder;
  } catch (error) {
    throw new Error(`Error creating folder: ${error}`);
  }
};

export const updateFolder = async (name: string, id: string) => {
  try {
    const folder = await Folder.findOne({
      where: {
        name: {
          [Op.iLike]: id,
        },
      },
    });

    if (!folder) {
      throw new Error("Folder not found");
    }

    folder.name = name;
    await folder.save();

    return folder;
  } catch (error) {
    console.error(error);
    throw new Error(`Error updating folder: ${error}`);
  }
};

export const deleteFolder = async (name: string) => {
  try {
    const folder = await Folder.findOne({
      where: {
        name: {
          [Op.iLike]: name,
        },
      },
    });
    if (!folder) {
      throw new Error("Folder not found");
    }

    if (folder.parentId === null) {
      await deleteSubfolders(folder.id);
      await Document.destroy({ where: { parentId: folder.id } });
    }

    await folder.destroy();

    return true;
  } catch (error) {
    throw new Error(`Error deleting folder: ${error}`);
  }
};

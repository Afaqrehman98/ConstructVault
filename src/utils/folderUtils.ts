import { Folder } from "../models/folder";
import { Document } from "../models/document";

// Helper function to get the next available folder number based on parentId
export const getNextFolderNumber = async (
  parentId: number | null
): Promise<number> => {
  let maxNumber: number;

  if (parentId === null) {
    // Get the highest number among root-level folders
    const rootFolders = await Folder.findAll({
      where: { parentId: null },
      attributes: ["name"],
    });
    const existingNumbers = rootFolders
      .map((folder) => {
        const match = folder.name.match(/-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => !isNaN(num))
      .sort((a, b) => a - b);

    maxNumber =
      existingNumbers.length > 0
        ? existingNumbers[existingNumbers.length - 1]
        : 0;
  } else {
    // Get the highest number among subfolders of the given parentId
    const subfolders = await Folder.findAll({
      where: { parentId },
      attributes: ["name"],
    });

    const existingNumbers = subfolders
      .map((folder) => {
        const match = folder.name.match(/-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => !isNaN(num))
      .sort((a, b) => a - b);

    maxNumber =
      existingNumbers.length > 0
        ? existingNumbers[existingNumbers.length - 1]
        : 0;
  }

  return maxNumber + 1;
};

// Helper function to recursively delete subfolders
export const deleteSubfolders = async (parentId: number) => {
  const subfolders = await Folder.findAll({ where: { parentId } });

  for (const subfolder of subfolders) {
    await deleteSubfolders(subfolder.id);
    await Document.destroy({ where: { parentId: subfolder.id } });
    await subfolder.destroy();
  }
};

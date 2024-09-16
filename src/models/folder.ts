import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { Document } from "./document";

interface FolderAttributes {
  id: number;
  name: string;
  parentId?: number | null;
}

interface FolderCreationAttributes extends Optional<FolderAttributes, "id"> {}

export class Folder
  extends Model<FolderAttributes, FolderCreationAttributes>
  implements FolderAttributes
{
  public id!: number;
  public name!: string;
  public parentId?: number | null;
}

Folder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "folders",
  }
);

// Define associations
Folder.hasMany(Folder, { as: "subfolders", foreignKey: "parentId" });
Folder.hasMany(Document, { as: "documents", foreignKey: "parentId" });
Folder.belongsTo(Folder, { as: "parent", foreignKey: "parentId" });
Document.belongsTo(Folder, { as: "parentFolder", foreignKey: "parentId" });

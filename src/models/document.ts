import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../utils/db";

interface DocumentAttributes {
  id: number;
  name: string;
  parentId?: number | null;
  url: string;
}

interface DocumentCreationAttributes
  extends Optional<DocumentAttributes, "id"> {}

export class Document
  extends Model<DocumentAttributes, DocumentCreationAttributes>
  implements DocumentAttributes
{
  public id!: number;
  public name!: string;
  public parentId?: number | null;
  public url!: string;
}

Document.init(
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
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "documents",
  }
);

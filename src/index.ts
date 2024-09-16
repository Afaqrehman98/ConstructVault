import express from "express";
import folderRoutes from "./routes/FolderRoutes";
import documentRoutes from "./routes/DocumentRoutes";
import cors from "cors";
import { sequelize } from "./utils/db";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v2/folders", folderRoutes);

app.use("/api/v2/documents", documentRoutes);

// Sync database and start the server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

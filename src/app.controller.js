import express from "express";
import { connectToDatabase } from "./database/connection.js";
import booksRouter from "./module/books/books.controller.js";

export const bootstrap = async () => {
  const app = express();
  app.use(express.json());
  app.use(booksRouter);

  const { dbName } = await connectToDatabase();
  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      message: "Server is running",
      data: {
        dbName,
      },
    });
  });
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

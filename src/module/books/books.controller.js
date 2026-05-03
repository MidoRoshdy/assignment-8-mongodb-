import { Router } from "express";
import {
  aggregateBooksAfter2000Projection,
  aggregateBooksAfter2000Sorted,
  aggregateBooksJoinLogs,
  aggregateUnwindGenres,
  createAuthorsCollectionImplicitly,
  createBooksCollection,
  createBooksTitleIndex,
  createLogsCappedCollection,
  deleteBooksBeforeYear,
  findBookByTitle,
  findBooksByGenre,
  findBooksByYearRange,
  findBooksExcludingGenres,
  findBooksWithIntegerYear,
  insertManyBooks,
  insertOneBook,
  insertOneLog,
  skipLimitBooksSortedByYearDesc,
  updateBookYearByTitle,
} from "./books.service.js";

const router = Router();

router.post("/collection/books", async (req, res) => {
  const data = await createBooksCollection();
  res.json(data);
});

router.post("/collection/authors", async (req, res) => {
  const data = await createAuthorsCollectionImplicitly(req.body);
  res.json(data);
});

router.post("/collection/logs/capped", async (req, res) => {
  const data = await createLogsCappedCollection();
  res.json(data);
});

router.post("/collection/books/index", async (req, res) => {
  const data = await createBooksTitleIndex();
  res.json(data);
});

router.post("/books", async (req, res) => {
  const data = await insertOneBook(req.body);
  res.status(201).json(data);
});

router.post("/books/batch", async (req, res) => {
  const data = await insertManyBooks(req.body);
  res.status(201).json(data);
});

router.post("/logs", async (req, res) => {
  const data = await insertOneLog(req.body);
  res.status(201).json(data);
});

router.patch("/books/:title", async (req, res) => {
  const data = await updateBookYearByTitle(req.params.title, req.body.year ?? 2022);
  res.json(data);
});

router.get("/books/title", async (req, res) => {
  const data = await findBookByTitle(req.query.title);
  res.json(data);
});

router.get("/books/year", async (req, res) => {
  const data = await findBooksByYearRange(req.query.from, req.query.to);
  res.json(data);
});

router.get("/books/genre", async (req, res) => {
  const data = await findBooksByGenre(req.query.genre);
  res.json(data);
});

router.get("/books/skip-limit", async (req, res) => {
  const data = await skipLimitBooksSortedByYearDesc();
  res.json(data);
});

router.get("/books/year-integer", async (req, res) => {
  const data = await findBooksWithIntegerYear();
  res.json(data);
});

router.get("/books/exclude-genres", async (req, res) => {
  const data = await findBooksExcludingGenres();
  res.json(data);
});

router.delete("/books/before-year", async (req, res) => {
  const data = await deleteBooksBeforeYear(req.query.year);
  res.json(data);
});

router.get("/books/aggregate1", async (req, res) => {
  const data = await aggregateBooksAfter2000Sorted();
  res.json(data);
});

router.get("/books/aggregate2", async (req, res) => {
  const data = await aggregateBooksAfter2000Projection();
  res.json(data);
});

router.get("/books/aggregate3", async (req, res) => {
  const data = await aggregateUnwindGenres();
  res.json(data);
});

router.get("/books/aggregate4", async (req, res) => {
  const data = await aggregateBooksJoinLogs();
  res.json(data);
});

export default router;

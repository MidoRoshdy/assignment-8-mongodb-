import { connectToDatabase } from "../../database/connection.js";

const getDb = async () => {
  const { client, dbName } = await connectToDatabase();
  return client.db(dbName);
};

export const createBooksCollection = async () => {
  const db = await getDb();
  const existing = await db.listCollections({ name: "books" }).toArray();
  if (existing.length > 0) {
    return { message: "books collection already exists" };
  }

  await db.createCollection("books", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title"],
        properties: {
          title: {
            bsonType: "string",
            minLength: 1,
            description: "title must be a non-empty string",
          },
        },
      },
    },
  });

  return { message: "books collection created with validation rule" };
};

export const createAuthorsCollectionImplicitly = async (authorDoc) => {
  const db = await getDb();
  const defaultAuthor = {
    name: "Unknown Author",
    country: "Unknown",
    createdAt: new Date(),
  };

  const result = await db
    .collection("authors")
    .insertOne(authorDoc ?? defaultAuthor);
  return { insertedId: result.insertedId };
};

export const createLogsCappedCollection = async () => {
  const db = await getDb();
  const existing = await db.listCollections({ name: "logs" }).toArray();
  if (existing.length === 0) {
    await db.createCollection("logs", {
      capped: true,
      size: 1024 * 1024,
    });
    return { message: "logs capped collection created" };
  }

  return { message: "logs collection already exists" };
};

export const createBooksTitleIndex = async () => {
  const db = await getDb();
  const indexName = await db.collection("books").createIndex({ title: 1 });
  return { indexName };
};

export const insertOneBook = async (book) => {
  const db = await getDb();
  const result = await db.collection("books").insertOne(book);
  return { insertedId: result.insertedId };
};

export const insertManyBooks = async (books) => {
  const db = await getDb();
  const result = await db.collection("books").insertMany(books);
  return {
    insertedCount: result.insertedCount,
    insertedIds: result.insertedIds,
  };
};

export const insertOneLog = async (log) => {
  const db = await getDb();
  const result = await db.collection("logs").insertOne({
    message: log?.message ?? "New log entry",
    bookTitle: log?.bookTitle ?? null,
    createdAt: new Date(),
  });
  return { insertedId: result.insertedId };
};

export const updateBookYearByTitle = async (title, year) => {
  const db = await getDb();
  const result = await db
    .collection("books")
    .updateOne({ title }, { $set: { year: Number(year) } });
  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};

export const findBookByTitle = async (title) => {
  const db = await getDb();
  return db.collection("books").findOne({ title });
};

export const findBooksByYearRange = async (from, to) => {
  const db = await getDb();
  return db
    .collection("books")
    .find({
      year: { $gte: Number(from), $lte: Number(to) },
    })
    .toArray();
};

export const findBooksByGenre = async (genre) => {
  const db = await getDb();
  return db.collection("books").find({ genres: genre }).toArray();
};

export const skipLimitBooksSortedByYearDesc = async () => {
  const db = await getDb();
  return db
    .collection("books")
    .find({})
    .sort({ year: -1 })
    .skip(2)
    .limit(3)
    .toArray();
};

export const findBooksWithIntegerYear = async () => {
  const db = await getDb();
  return db
    .collection("books")
    .find({ year: { $type: "int" } })
    .toArray();
};

export const findBooksExcludingGenres = async () => {
  const db = await getDb();
  return db
    .collection("books")
    .find({
      genres: { $nin: ["Horror", "Science Fiction"] },
    })
    .toArray();
};

export const deleteBooksBeforeYear = async (year) => {
  const db = await getDb();
  const result = await db
    .collection("books")
    .deleteMany({ year: { $lt: Number(year) } });
  return { deletedCount: result.deletedCount };
};

export const aggregateBooksAfter2000Sorted = async () => {
  const db = await getDb();
  return db
    .collection("books")
    .aggregate([{ $match: { year: { $gt: 2000 } } }, { $sort: { year: -1 } }])
    .toArray();
};

export const aggregateBooksAfter2000Projection = async () => {
  const db = await getDb();
  return db
    .collection("books")
    .aggregate([
      { $match: { year: { $gt: 2000 } } },
      { $project: { _id: 0, title: 1, author: 1, year: 1 } },
    ])
    .toArray();
};

export const aggregateUnwindGenres = async () => {
  const db = await getDb();
  return db
    .collection("books")
    .aggregate([{ $unwind: "$genres" }])
    .toArray();
};

export const aggregateBooksJoinLogs = async () => {
  const db = await getDb();
  return db
    .collection("books")
    .aggregate([
      {
        $lookup: {
          from: "logs",
          localField: "title",
          foreignField: "bookTitle",
          as: "logs",
        },
      },
    ])
    .toArray();
};

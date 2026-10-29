const express = require("express");
const { getBooks, saveBooks } = require("./data/bookStore");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the Book Library API!");
});


 // Get all books with optional status filtering
app.get("/api/books", async (req, res) => {
  try {
    const { status } = req.query;

    if (status && !["read", "unread"].includes(status)) {
      return res.status(400).json({
        message: "Status must be 'read' or 'unread'."
      });
    }

    let books = await getBooks();

    if (status) {
      books = books.filter(
        (book) => book.status === status
      );
    }

    res.status(200).json({
      count: books.length,
      books: books
    });
  } catch (error) {
    console.error("Error fetching books:", error);

    res.status(500).json({
      message: "Unable to retrieve books."
    });
  }
});

 // Get a single book by ID
app.get("/api/books/:id", async (req, res) => {
  try {
    const books = await getBooks();

    const book = books.find(
      (item) => item.id === req.params.id
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found."
      });
    }

    res.status(200).json({ book: book });
  } catch (error) {
    console.error("Error fetching book:", error);

    res.status(500).json({
      message: "Unable to retrieve book."
    });
  }
});


 // Update a book's read/unread status
app.patch("/api/books/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["read", "unread"].includes(status)) {
      return res.status(400).json({
        message: "Status must be 'read' or 'unread'."
      });
    }

    const books = await getBooks();

    const bookIndex = books.findIndex(
      (item) => item.id === req.params.id
    );

    if (bookIndex === -1) {
      return res.status(404).json({
        message: "Book not found."
      });
    }

    books[bookIndex].status = status;

    await saveBooks(books);

    res.status(200).json({
      message: "Book status updated successfully.",
      book: books[bookIndex]
    });
  } catch (error) {
    console.error("Error updating book status:", error);

    res.status(500).json({
      message: "Unable to update book status."
    });
  }
});


 // Delete a book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const books = await getBooks();

    const bookIndex = books.findIndex(
      (item) => item.id === req.params.id
    );

    if (bookIndex === -1) {
      return res.status(404).json({
        message: "Book not found."
      });
    }

    const deletedBook = books[bookIndex];

    books.splice(bookIndex, 1);

    await saveBooks(books);

    res.status(200).json({
      message: "Book deleted successfully.",
      book: deletedBook
    });
  } catch (error) {
    console.error("Error deleting book:", error);

    res.status(500).json({
      message: "Unable to delete book."
    });
  }
});

// Create a new book
app.post("/api/books", async (req, res) => {
  try {
    const { title, author, status, description } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof author !== "string" ||
      !author.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        message: "Title, author, and description are required."
      });
    }

    const bookStatus = status ?? "unread";

    if (!["read", "unread"].includes(bookStatus)) {
      return res.status(400).json({
        message: "Status must be 'read' or 'unread'."
      });
    }

    const books = await getBooks();

    const newBook = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      status: bookStatus,
      description: description.trim(),
      date: new Date().toISOString()
    };

    books.push(newBook);
    await saveBooks(books);

    res.status(201).json({
      message: "Book created successfully.",
      book: newBook
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({
      message: "Unable to create book."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
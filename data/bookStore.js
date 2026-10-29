const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "books.json");

async function getBooks() {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

async function saveBooks(books) {
  await fs.writeFile(
    filePath,
    JSON.stringify(books, null, 2),
    "utf8"
  );
}

module.exports = {
  getBooks,
  saveBooks
};
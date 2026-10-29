const API_URL = "/api/books";

const bookList = document.getElementById("book-list");
const message = document.getElementById("message");
const totalCount = document.getElementById("total-count");
const readCount = document.getElementById("read-count");
const unreadCount = document.getElementById("unread-count");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");

let allBooks = [];

// Display a message to the user
function showMessage(text) {
  message.textContent = text;
}

// Load books from the backend
async function loadBooks() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to load books.");
    }

    const data = await response.json();
    allBooks = data.books;

    updateStatistics();
    renderBooks();
  } catch (error) {
    console.error(error);
    showMessage("Unable to load books. Please try again.");
  }
}

// Update total, read, and unread counts
function updateStatistics() {
  totalCount.textContent = allBooks.length;

  readCount.textContent = allBooks.filter(
    (book) => book.status === "read"
  ).length;

  unreadCount.textContent = allBooks.filter(
    (book) => book.status === "unread"
  ).length;
}

// Display books on the page
function renderBooks() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedStatus = filterSelect.value;

  const filteredBooks = allBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm);

    const matchesStatus =
      selectedStatus === "all" ||
      book.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  bookList.replaceChildren();

  if (filteredBooks.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = allBooks.length === 0
      ? "Your library is empty. Add your first book above!"
      : "No books match your search or filter.";

    bookList.appendChild(emptyState);
    return;
  }

  filteredBooks.forEach((book) => {
    const card = document.createElement("article");
    card.className = "book-card";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.className = "book-author";
    author.textContent = `by ${book.author}`;

    const status = document.createElement("span");
    status.className = `status ${book.status}`;
    status.textContent = book.status;

    const description = document.createElement("p");
    description.className = "book-description";
    description.textContent = book.description;

    const date = document.createElement("p");
    date.className = "book-meta";
    date.textContent = `Added on ${new Date(book.date).toLocaleDateString()}`;

    const actions = document.createElement("div");
    actions.className = "book-actions";

    const toggleButton = document.createElement("button");
    toggleButton.textContent = book.status === "read"
      ? "Mark Unread"
      : "Mark Read";
    toggleButton.addEventListener("click", () => {
      updateBookStatus(book.id, book.status === "read" ? "unread" : "read");
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "danger";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteBook(book.id));

    
    const detailsButton = document.createElement("button");
    detailsButton.className = "secondary";
    detailsButton.textContent = "View Details";
    detailsButton.addEventListener("click", () => {
        viewBookDetails(book.id);
    });

    actions.append(detailsButton, toggleButton, deleteButton);

    card.append(title, author, status, description, date, actions);
    bookList.appendChild(card);
  });
}

// Filter and search without reloading the page
searchInput.addEventListener("input", renderBooks);
filterSelect.addEventListener("change", renderBooks);

// Load books when the page opens
loadBooks();


const bookForm = document.getElementById("book-form");

// Add a new book
bookForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const book = {
    title: document.getElementById("title").value.trim(),
    author: document.getElementById("author").value.trim(),
    description: document.getElementById("description").value.trim(),
    status: document.getElementById("status").value
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(book)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to add book.");
    }

    bookForm.reset();
    showMessage("Book added successfully!");
    await loadBooks();
  } catch (error) {
    showMessage(error.message);
  }
});

// Update a book's reading status
async function updateBookStatus(id, status) {
  try {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update status.");
    }

    showMessage("Reading status updated!");
    await loadBooks();
  } catch (error) {
    showMessage(error.message);
  }
}

// Delete a book
async function deleteBook(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this book?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to delete book.");
    }

    showMessage("Book deleted successfully!");
    await loadBooks();
  } catch (error) {
    showMessage(error.message);
  }
}

// View book details
async function viewBookDetails(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load book details.");
    }

    const book = data.book;

    window.alert(
      `Title: ${book.title}\n` +
      `Author: ${book.author}\n` +
      `Status: ${book.status}\n` +
      `Description: ${book.description}\n` +
      `Date Added: ${new Date(book.date).toLocaleDateString()}`
    );
  } catch (error) {
    showMessage(error.message);
  }
}
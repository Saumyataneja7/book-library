# Book Library Application

A simple book library web application built with Node.js and Express.js. Users can add books, view book details, track reading status, filter books, search by title or author, and delete books.

## Features

- Add books with title, author, description, and reading status
- View all books and individual book details
- Mark books as read or unread
- Delete books from the library
- Filter books by reading status
- Search books by title or author
- Display total, read, and unread book counts
- Store book data in a JSON file
- Validate requests and return appropriate error messages

## Technology Stack

- Node.js
- Express.js
- HTML
- CSS
- JavaScript
- JSON file storage

## Project Structure

```text
book-library/
├── data/
│   ├── books.json
│   └── bookStore.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Prerequisites

Install Node.js and npm before running the application.

## Run Locally

1. Open a terminal in the project directory.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm start
   ```

4. Open the following URL in your browser:

   http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/books` | Create a book |
| GET | `/api/books` | Retrieve all books |
| GET | `/api/books/:id` | Retrieve a specific book |
| PATCH | `/api/books/:id/status` | Update reading status |
| DELETE | `/api/books/:id` | Delete a book |
| GET | `/api/books?status=read` | Filter read books |
| GET | `/api/books?status=unread` | Filter unread books |

## Data Storage

Books are stored in `data/books.json`. Each book includes an ID, title, author, reading status, description, and date added.

## Error Handling

The application validates required fields and reading status, returns appropriate HTTP error codes for invalid requests and missing books, and handles server-side errors.

## License

Created as a Node.js assignment project.
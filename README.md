# 🎬 Movie Watchlist Web Application

A full-stack web application that allows users to browse movies, manage watchlists, track watched content, and share reviews with ratings.

---

## 🚀 Features

### 👤 User Authentication
- Register and login with secure password hashing (bcrypt)
- Session-based authentication
- Role-based access (Admin vs User)

### 🎥 Movie Management
- Browse all movies
- Filter movies by genre
- Search movies dynamically
- View detailed movie information

### ⭐ Reviews & Ratings
- Add, edit, and delete personal reviews
- Rate movies (1–5 scale)
- Automatic average rating calculation per movie
- Like / Unlike other users’ reviews

### 📌 Personal Lists
- Add/remove movies from Watchlist
- Mark/unmark movies as Watched
- Track viewing history

### 👤 Profile Page
- Edit personal bio
- View:
  - Recently viewed movies
  - Watchlist
  - Recommended movies
  - Personal reviews

---

## 🛠️ Tech Stack

**Frontend**
- EJS (Embedded JavaScript Templates)
- HTML / CSS / Vanilla JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB (Mongoose ODM)

**Authentication**
- express-session
- bcrypt (password hashing)

---

## 🔐 Security Features

- Passwords are hashed before storage
- Backend validation for all user inputs
- Protected routes using authentication middleware
- Authorization checks (users cannot modify others' data)

---

## 📂 Project Structure

```
movie-watchlist/
│
├── controllers/        # MVC Controllers, Business logic
│   ├── like-controllers.js
│   ├── movie-controllers.js
│   ├── review-controllers.js
│   ├── user-controllers.js
│   ├── watched-controllers.js
│   └── watchlist-controllers.js
│
├── middleware/         # Auth middleware
│   └── auth.js
│
├── models/             # Mongoose schemas
│   ├── like.js
│   ├── movie.js
│   ├── Review.js
│   ├── user.js
│   ├── watchedlist.js
│   └── watchlist.js
│
├── public/             # Static files (CSS)
│   └── css/
│       └── style.css
│
├── routes/             # Route definitions
│   ├── movieRoute.js
│   ├── reviewRoute.js
│   ├── userRoutes.js
│   ├── watchedRoutes.js
│   ├── watchlistRoutes.js
│   └── likeRoute.js
│
├── views/              # EJS templates
│   ├── movies/
│   │   ├── _movieForm.ejs
│   │   ├── addMovie.ejs
│   │   ├── editMovie.ejs
│   │   ├── movieDetail.ejs
│   │   └── movieList.ejs
│   │
│   ├── partials/
│   │   └── navbar.ejs
│   │
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── profile.ejs
│   ├── myReviews.ejs
│   ├── watched-movies.ejs
│   └── watchlist.ejs
│
│
├── .env                # Environment variables
├── package.json
└── server.js           # Entry point
```

---

## ⚙️ Installation

1. Clone the repository:
`git clone `
`cd movie-watchlist`

2. Install dependencies:
`npm install`

3. Create a `.env` file:
`MONGO_URI=your_mongodb_connection_string`

4. Run the server
`node server.js`

5. Open in browser:
`http://localhost:3000`

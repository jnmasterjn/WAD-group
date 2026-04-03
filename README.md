# 🎬 Movie Watchlist Web Application

A web application that allows users to browse movies, manage watchlists, track watched content, and share reviews with ratings.

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

### 🔒 Admin Features
- Add new movies
- Edit existing movie details
- Delete movies from the database
- Access restricted admin-only functionalities

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
WAD-group/
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
```
git clone <your-repo-url>
cd WAD-group
```

2. Install dependencies:
```
npm install
```

3. Set up MongoDB:
   
- Install MongoDB locally or use MongoDB Atlas

4. Create a `.env` file in the root directory:
```
MONGO_URI=your_mongodb_connection_string
```

5. Start the server
```
node server.js
```

6. Open in browser:
```
http://localhost:3000
```

---

## 🔗 API Endpoints

Review Interaction
- `POST /like/:id` – Like a user review
- `POST /like/:id` — Unlike a user review

Movie
- `GET /movie` – Get all movies
- `GET /movie/:id` – Get single movie details
- `GET /movie/add` – Show add movie form(admin only)
- `POST /movie/add` – Handle add movie request (admin only)
- `GET /movie/edit/:id` – Show edit movie form(admin only)
- `POST /movie/edit/:id` – Handle edit movie request (admin only)
- `POST /movie/delete/:id` – Handle delete movie request (admin only)

Review
- `GET /myReviews` – View all reviews by current user
- `POST /myReviews` – Handle add review form submission request
- `GET /review/edit/:id` – Show review edit form 
- `POST /review/edit/:id` – Handle submit edited review request
- `POST /review/delete/:id` – Handle delete review request

User
- `GET /register` – Show register form
- `POST /register` – Handle register logic
- `GET /login` – Show login form
- `POST /login` – Handle login logic
- `POST /logout` – Handle logout logic
- `GET /profile` – Show user profile page
- `POST /profile/bio` – Handle user create bio request
- `POST /profile/bio/edit` – Handle user edit bio request
- `GET /` – Landing page

Watched Movies
- `POST /watched/add/:id` – Handle add movie to watched list request
- `GET /watched` – Show all user's watched movies
- `POST /watched/remove/:id` – Handle remove watched movie request
- `POST /watched/editdesc` – Handle edit watchedlist description request

Watchlist
- `POST /watchlist/add/:id` – Handle add movie to watchlist request
- `GET /watchlist` – Show the user's watchlist
- `POST /watchlist/remove/:id` – Remove a movie from the watchlist
- `POST /watchlist/editdesc` – Handle edit watchlist description request

---

## 🛢️ Database Schema

- Like
  - user: ObjectId
  - review: ObjectId
  - createdAt: Date

- Movie
  - title: String
  - description: String
  - genre: String
  - releaseYear: Number
  - image: String
  - averageRating: Number
  - ratingCount: Number
  - createdAt: Date
  - updatedAt: Date
 
- Review
  - user: ObjectId
  - username: String
  - movie: ObjectId
  - comment: String
  - rating: Number
  - createdAt: Date
  - updatedAt: Date
 
- User
  - username: String
  - password: String
  - bio: String
  - isAdmin: Boolean
  - createdAt: Date
  - updatedAt: Date
 
- Watchedlist
  - user: ObjectId
  - movies: ObjectId
  - watchedlistDesc: String
  - createdAt: Date
  - updatedAt: Date

- Watchlist
  - user: ObjectId
  - movies: ObjectId
  - watchlistDesc: String
  - createdAt: Date
  - updatedAt: Date

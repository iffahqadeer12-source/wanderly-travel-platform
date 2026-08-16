# 🌍 Wanderly - Travel Destination Platform

A full-stack Travel & Tourism platform built using the MERN Stack.

## 🚀 Project Overview

Wanderly is a travel destination platform that allows users to explore destinations, search for places, browse destinations by category, view featured locations, and open detailed destination pages.

The application uses MongoDB to store destination data and connects the React frontend to a Node.js and Express.js backend API.

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Lucide React
* CSS

### Backend

* Node.js
* Express.js
* Mongoose
* CORS
* dotenv

### Database

* MongoDB

### API Testing

* Postman

## ✨ Features

### Frontend

* Responsive travel website
* Hero section
* Featured destinations
* All destinations
* Search destinations
* Category-based browsing
* Destination details page
* Destination image, location, description, rating, and popularity
* Loading states
* Error handling
* Empty search results handling
* React Router navigation
* About section

### Backend

* REST API
* MongoDB destination storage
* Full CRUD functionality
* Get all destinations
* Get a single destination
* Add destinations
* Update destinations
* Delete destinations
* Filter destinations by category
* Rating and popularity fields

## 📁 Project Structure

```text
mern/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── destinationController.js
│   ├── models/
│   │   └── Destination.js
│   ├── routes/
│   │   └── destinationRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── DestinationDetails.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔌 API Endpoints

Base URL:

```text
http://localhost:5000/api/destinations
```

| Method | Endpoint                               | Description                     |
| ------ | -------------------------------------- | ------------------------------- |
| GET    | `/api/destinations`                    | Get all destinations            |
| GET    | `/api/destinations/:id`                | Get one destination             |
| GET    | `/api/destinations?category=Mountains` | Filter destinations by category |
| POST   | `/api/destinations`                    | Add a destination               |
| PUT    | `/api/destinations/:id`                | Update a destination            |
| DELETE | `/api/destinations/:id`                | Delete a destination            |

## 🗄️ Destination Data

Each destination can contain:

* Name
* Country
* City
* Description
* Image URL
* Category
* Rating
* Popularity
* Featured status

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd mern
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
PORT=5000
```

### 4. Start the backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## 🔗 Frontend-Backend Integration

The React frontend retrieves destination information from the Express API using Axios.

```text
React
  ↓
Axios
  ↓
Express API
  ↓
Mongoose
  ↓
MongoDB
```

The Vite development server proxies `/api` requests to the Express backend during local development.

Destination information displayed on the website is retrieved from the backend database.

## 🧪 API Testing

The REST API was tested using Postman.

Tested operations include:

* Retrieve all destinations
* Retrieve a single destination
* Filter destinations by category
* Add a destination
* Update a destination
* Delete a destination

## 📄 Week 2 Implementation

The Week 2 task extends the original Wanderly platform with:

* Destination rating and popularity fields
* Category filtering
* Destination details page
* React Router navigation
* Loading and error states
* Improved API integration
* Updated project documentation

## 👩‍💻 Project

Built as a MERN Stack Development internship task.

---

⭐ Built with the MERN Stack

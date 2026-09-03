# 🌍 Wanderly - Travel & Itinerary Management Platform

Wanderly is a full-stack Travel & Tourism platform built using the MERN stack. It allows users to explore destinations, create trips, manage itineraries, add activities, and organize their travel plans from a single dashboard.

## 🚀 Live Demo

Frontend: https://wanderly-frontend-three.vercel.app

Backend API: https://wanderly-travel-platform.vercel.app

---

## 📌 Features

### 🔐 User Authentication
- User registration
- User login
- JWT-based authentication
- Protected routes
- Secure password hashing using bcrypt
- Logout functionality

### 🌍 Destinations
- View travel destinations
- Search destinations
- View destination details
- Featured destinations
- Destination categories
- Destination API integration

### ✈️ Trip Management
Users can:

- Create a new trip
- View all personal trips
- Open individual trip details
- Edit trips
- Delete trips
- Set trip status
- Specify number of travelers
- Add trip descriptions

### 🗓️ Itinerary Management
Each trip can contain multiple itinerary days.

Users can:

- Add itinerary days
- Add multiple activities to each day
- Edit activities
- Delete activities
- Organize activities by day

Each activity includes:

- Activity name
- Location
- Time
- Category
- Description

### 📊 Trip Dashboard
The dashboard displays:

- Total Trips
- Upcoming Trips
- Completed Trips
- Total Planned Days
- Recent Trips
- Favorite Trips

### ⭐ Favorite Trips
Users can mark trips as favorites and easily access their favorite travel plans.

### 📱 Responsive Design
The platform is designed to work across:

- Desktop
- Tablet
- Mobile devices

---

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- Axios
- React Router
- Lucide React
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

### Deployment
- Vercel
- MongoDB Atlas
- GitHub

---

## 📂 Project Structure

```text
Wanderly/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── destinationController.js
│   │   └── tripController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Destination.js
│   │   └── Trip.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── destinationRoutes.js
│   │   └── tripRoutes.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── AuthContext.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── TripPlanner.jsx
│   │   ├── TripDetails.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
└── README.md
🔌 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a user
POST	/api/auth/login	Login user
Destinations
Method	Endpoint	Description
GET	/api/destinations	Get all destinations
GET	/api/destinations/:id	Get single destination
POST	/api/destinations	Add destination
PUT	/api/destinations/:id	Update destination
DELETE	/api/destinations/:id	Delete destination
Trips
Method	Endpoint	Description
POST	/api/trips	Create trip
GET	/api/trips	Get user's trips
GET	/api/trips/:id	Get single trip
PUT	/api/trips/:id	Update trip
DELETE	/api/trips/:id	Delete trip
Itinerary
Method	Endpoint	Description
POST	/api/trips/:id/days	Add itinerary day
POST	/api/trips/:id/days/:dayId/activities	Add activity
PUT	/api/trips/:id/days/:dayId/activities/:activityId	Update activity
DELETE	/api/trips/:id/days/:dayId/activities/:activityId	Delete activity
🗄️ Database Models
User

The User model stores:

Name
Email
Password
Profile information
Favorites
Destination

The Destination model stores:

Name
Country
City
Description
Image URL
Category
Featured status
Trip

The Trip model stores:

User
Trip Name
Destination
Start Date
End Date
Number of Travelers
Description
Status
Itinerary
Itinerary

Each itinerary contains:

Day number
Date
Activities

Each activity contains:

Name
Location
Time
Category
Description
🔑 Environment Variables
Backend

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Frontend

Create a .env file inside the frontend folder:

VITE_API_URL=http://localhost:5000/api

For production, use your deployed backend API URL.

💻 Installation
1. Clone the Repository
git clone YOUR_GITHUB_REPOSITORY_URL
2. Navigate to the Project
cd Wanderly
3. Install Backend Dependencies
cd backend
npm install
4. Configure Backend Environment Variables

Create the .env file and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
5. Start Backend
npm run dev

The backend will run on:

http://localhost:5000
🎨 Install Frontend Dependencies

Open another terminal:

cd frontend
npm install
Start Frontend
npm run dev

The frontend will run on:

http://localhost:5173
🔒 Security

The application uses:

JWT authentication
Protected API routes
Password hashing with bcrypt
Environment variables for sensitive configuration
User-specific trip access

Users can only access and manage their own trips.

📊 Dashboard

The Trip Dashboard provides a quick overview of the user's travel plans.

It calculates:

Total Trips
Upcoming Trips
Completed Trips
Total Planned Days

It also provides quick access to:

Recent trips
Favorite trips
Individual trip details
🧪 API Testing

The backend APIs were tested using Postman.

Tested functionality includes:

User registration
User login
Trip creation
Get trips
Get single trip
Update trip
Delete trip
Add itinerary day
Add activity
Update activity
Delete activity
☁️ Deployment

The project is deployed using Vercel.

Frontend
https://wanderly-frontend-three.vercel.app
Backend
https://wanderly-travel-platform.vercel.app

MongoDB is hosted using MongoDB Atlas.

🔮 Future Improvements

Possible future improvements include:

Google Maps integration
Weather information for destinations
Hotel booking
Flight search
Persistent favorite trips in the database
Trip sharing
Collaborative itinerary planning
Notifications and reminders
AI-powered trip recommendations
Budget tracking
Dark mode
Social login
👩‍💻 Author

Developed as a MERN Stack Travel & Tourism project.

Wanderly — Plan your journey. Explore the world. 🌍✈️

⭐ Project Highlights

This project demonstrates practical experience with:

React.js
Node.js
Express.js
MongoDB
Mongoose
REST APIs
JWT Authentication
CRUD Operations
React Router
Axios
Protected Routes
Itinerary Management
Responsive Web Development
Vercel Deployment

### Do this now

1. Open your **main Wanderly folder**.
2. Create/open **`README.md`**.
3. Paste everything above.
4. Save it.
5. **Do NOT put your real `MONGO_URI` or `JWT_SECRET` in README.**
6. Make sure `.env` is in `.gitignore`.

After this, the main remaining step is **GitHub final upload + checking the deployed website**.
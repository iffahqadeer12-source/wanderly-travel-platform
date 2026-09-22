# 🌍 Wanderly - Full-Stack Travel & Tourism Platform

Wanderly is a full-stack Travel & Tourism platform built using the MERN stack. It allows users to explore destinations, discover travel services, manage trips and itineraries, make bookings, submit reviews and ratings, save favorites, and receive personalized travel recommendations from a single platform.

## 🚀 Live Demo

**Frontend:**  
https://wanderly-frontend-three.vercel.app

**Backend API:**  
https://wanderly-travel-platform.vercel.app

**GitHub Repository:**  
https://github.com/iffahqadeer12-source/wanderly-travel-platform

---

## 📌 Features

### 🔐 User Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Password hashing using bcrypt
- Logout functionality
- User-specific protected functionality

### 🌍 Destinations

- Browse travel destinations
- Search destinations
- View destination details
- Featured destinations
- Destination categories
- Destination information and details
- Favorites support

### 🏨 Travel Services

- Browse available travel services
- View service details
- Service categories
- Service location and pricing
- Service availability
- Service ratings
- Booking integration

### 📋 Booking System

Users can:

- Book available travel services
- Submit booking information
- View booking confirmation
- View their bookings
- Access booking information from the user area

### ⭐ Reviews & Ratings

The platform provides a complete review and rating system.

Users can:

- Add reviews
- Edit their own reviews
- Delete their own reviews
- Give star ratings
- Mark reviews as helpful
- Filter reviews by rating
- View average ratings
- View rating distribution
- View review information

Review ownership and authentication are enforced for protected actions.

### ❤️ Favorites

Users can:

- Add destinations to favorites
- Remove destinations from favorites
- View their favorite destinations
- Access favorites from their user area

### ✨ Personalized Recommendations

Wanderly includes a personalized travel recommendation system based on user preferences.

Users can specify:

- Budget
- Travel style
- Preferred category
- Preferred location
- Trip duration

The recommendation system uses rule-based matching to generate personalized destinations and services.

Recommendations include:

- Match percentage
- Recommendation reasons
- Personalized destinations
- Personalized travel services
- Favorites
- Recently viewed destinations

### 🗺️ Trip Management

Users can:

- Create trips
- View personal trips
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
- Add multiple activities
- Edit activities
- Delete activities
- Organize activities by day

Each activity can include:

- Activity name
- Location
- Time
- Category
- Description

### 👤 User Area

The user area provides access to:

- Profile
- My Bookings
- My Reviews
- Favorites
- Personalized Recommendations
- Personal travel information

### 📱 Responsive Design

The platform is designed to work across:

- Desktop
- Tablet
- Mobile devices

### ⚠️ Validation & Error Handling

The application includes:

- Form validation
- Authentication validation
- Invalid request handling
- Loading states
- Empty states
- Error states
- API error handling

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

### Tools & Deployment

- Git
- GitHub
- Postman
- Vercel
- MongoDB Atlas
- VS Code

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
│   │   ├── tripController.js
│   │   ├── reviewController.js
│   │   └── recommendationController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Destination.js
│   │   ├── Trip.js
│   │   ├── Review.js
│   │   └── UserPreference.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── destinationRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── recommendationRoutes.js
│   │
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── AuthContext.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Recommendations.jsx
│   │   ├── Reviews.jsx
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
GET	/api/destinations/:id	Get a destination
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
Reviews
Method	Endpoint	Description
GET	/api/reviews/...	Get reviews
POST	/api/reviews/...	Create review
PUT	/api/reviews/:id	Update review
DELETE	/api/reviews/:id	Delete review
Recommendations
Method	Endpoint	Description
GET	/api/recommendations	Get personalized recommendations
GET	/api/recommendations/preferences	Get user preferences
POST	/api/recommendations/preferences	Save/update user preferences

API routes may require JWT authentication where protected.

🗄️ Database Models
User

Stores user information including:

Name
Email
Password
Profile information
Favorites
Recently viewed destinations
Destination

Stores destination information including:

Name
Country
City
Description
Image URL
Category
Featured status
Trip

Stores:

User
Trip name
Destination
Start date
End date
Number of travelers
Description
Status
Itinerary
Review

Stores:

User
Destination/service
Rating
Review text
Helpful count
Optional review image
Timestamps
User Preference

Stores personalized recommendation preferences:

User
Budget
Travel style
Preferred category
Preferred location
Trip duration
✨ Recommendation System

The recommendation system uses a rule-based scoring approach.

Preference matching contributes to the recommendation score based on factors such as:

Category
Location
Budget
Travel style
Trip duration

The system can also consider:

Favorites
Recently viewed destinations

The resulting recommendations include a match percentage and explanation for why an item was recommended.

🔑 Environment Variables
Backend

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Frontend

Create a .env file inside the frontend folder:

VITE_API_URL=http://localhost:5000/api

For production, use the deployed backend API URL.

Never commit real credentials or secrets to GitHub.

💻 Installation
1. Clone the Repository
git clone https://github.com/iffahqadeer12-source/wanderly-travel-platform.git
2. Navigate to the Project
cd wanderly-travel-platform
3. Install Backend Dependencies
cd backend
npm install
4. Configure Backend Environment Variables

Create:

backend/.env

and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
5. Start Backend
node server.js

The backend will run on:

http://localhost:5000
6. Install Frontend Dependencies

Open another terminal:

cd frontend
npm install
7. Start Frontend
npm run dev

The frontend will run on:

http://localhost:5173
🔒 Security

The application uses:

JWT authentication
Protected API routes
Password hashing with bcrypt
Environment variables for sensitive configuration
User-specific protected functionality
Authentication checks for protected actions
🧪 Testing

The application was tested across its major modules, including:

User registration
User login
Protected routes
Destinations
Favorites
Travel services
Bookings
Reviews
Ratings
Helpful review votes
Personalized recommendations
User preferences
My Bookings
My Reviews
User profile
Frontend/backend communication

Backend APIs were also tested using Postman.

☁️ Deployment

The project is deployed using Vercel.

Frontend

https://wanderly-frontend-three.vercel.app

Backend

https://wanderly-travel-platform.vercel.app

Database

MongoDB Atlas

Source Code

https://github.com/iffahqadeer12-source/wanderly-travel-platform

🔮 Future Improvements

Possible future improvements include:

Google Maps integration
Weather information for destinations
Flight search
Trip sharing
Collaborative itinerary planning
Notifications and reminders
Budget tracking
Social login
Advanced analytics
Admin dashboard
Role-based administration
API documentation interface
👩‍💻 Author

Developed as a MERN Stack Full-Stack Travel & Tourism project.

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
Travel Services
Booking System
Reviews & Ratings
Favorites
Personalized Recommendations
Itinerary Management
Responsive Web Development
Vercel Deployment


### ⚠️ One important correction before you paste it

I intentionally did **not** invent detailed service/booking endpoint paths because the README you gave me doesn't show those exact routes. Your README should document the **actual route names from your code**, not guessed ones.

So for the final README, I want to verify the actual backend `routes` folder before we claim every endpoint.

**Don't commit this README yet.**

Your application itself is ready. The README is just the last documentation cleanup. After we verify the actual route filenames/endpoints, we'll finalize it and then you can submit.

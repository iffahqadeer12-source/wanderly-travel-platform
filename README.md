\# 🌍 Wanderly - Travel Destination Platform



A full-stack Travel \& Tourism platform built using the MERN Stack.



\## 🚀 Project Overview



Wanderly is a travel destination platform that allows users to explore destinations, search for places, browse destinations by category, and discover featured locations.



The application uses MongoDB to store destination data and connects the React frontend to a Node.js and Express.js backend API.



\## 🛠️ Technologies Used



\### Frontend



\- React.js

\- Vite

\- Axios

\- Lucide React

\- CSS



\### Backend



\- Node.js

\- Express.js

\- Mongoose

\- CORS

\- dotenv



\### Database



\- MongoDB



\### API Testing



\- Postman



\## ✨ Features



\- Responsive travel website

\- Hero section

\- Featured destinations

\- All destinations

\- Search destinations

\- Travel categories

\- About section

\- MongoDB destination storage

\- REST API

\- Full CRUD functionality

\- React frontend and backend integration



\## 📁 Project Structure



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

│   │   ├── index.css

│   │   └── main.jsx

│   ├── package.json

│   └── vite.config.js

│

└── README.md

```



\## 🔌 API Endpoints



Base URL:



```text

http://localhost:5000/api/destinations

```



| Method | Endpoint | Description |

|---|---|---|

| GET | /api/destinations | Get all destinations |

| GET | /api/destinations/:id | Get one destination |

| POST | /api/destinations | Add a destination |

| PUT | /api/destinations/:id | Update a destination |

| DELETE | /api/destinations/:id | Delete a destination |



\## 🗄️ Destination Data



Each destination can contain:



\- Name

\- Country

\- City

\- Description

\- Image URL

\- Category

\- Featured status



\## ⚙️ Installation



\### 1. Clone the repository



```bash

git clone YOUR\_GITHUB\_REPOSITORY\_URL

cd mern

```



\### 2. Install backend dependencies



```bash

cd backend

npm install

```



\### 3. Configure environment variables



Create a `.env` file inside the `backend` folder:



```env

MONGO\_URI=YOUR\_MONGODB\_CONNECTION\_STRING

PORT=5000

```



\### 4. Start the backend



```bash

npm run dev

```



The backend runs on:



```text

http://localhost:5000

```



\### 5. Install frontend dependencies



Open another terminal:



```bash

cd frontend

npm install

```



\### 6. Start the frontend



```bash

npm run dev

```



The frontend runs on:



```text

http://localhost:5173

```



\## 🔗 Frontend-Backend Integration



The React frontend retrieves destination information from the Express API using Axios.



```text

React

&#x20;  ↓

Axios

&#x20;  ↓

Express API

&#x20;  ↓

Mongoose

&#x20;  ↓

MongoDB

```



Destination information displayed on the website is retrieved from the backend database.



\## 🧪 API Testing



The REST API was tested using Postman.



Tested operations include:



\- Retrieve all destinations

\- Retrieve a single destination

\- Add a destination

\- Update a destination

\- Delete a destination



\## 👩‍💻 Project



Built as a Week 1 MERN Stack Development task.



\---



⭐ Built with the MERN Stack


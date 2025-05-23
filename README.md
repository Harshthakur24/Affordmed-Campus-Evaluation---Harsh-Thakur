# Social Media Analytics Microservice

A microservice that provides real-time analytical insights for social media data.

## Features

- Top Users: Display the top five users with the most commented posts
- Trending Posts: Show posts with the maximum number of comments
- Real-time Feed: Display the latest posts with automatic updates

## Tech Stack

### Backend
- Node.js
- Express
- Axios for HTTP requests

### Frontend
- React with TypeScript
- Material-UI for styling
- React Router for navigation
- Axios for API calls

## Setup and Installation

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   PORT=5000
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Backend
- `GET /users`: Get top five users with most commented posts
- `GET /posts?type=popular`: Get posts with maximum comments
- `GET /posts?type=latest`: Get latest five posts

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   └── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navigation.tsx
    │   ├── pages/
    │   │   ├── TopUsers.tsx
    │   │   ├── TrendingPosts.tsx
    │   │   └── Feed.tsx
    │   └── App.tsx
    └── package.json
```
# Affordmed-Campus-Evaluation---Harsh-Thakur
# Affordmed-Campus-Evaluation---Harsh-Thakur
# Affordmed-Campus-Evaluation---Harsh-Thakur
# Affordmed-Campus-Evaluation---Harsh-Thakur

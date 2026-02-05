# Travel AI Backend API

A backend system for an AI-powered travel itinerary application that generates personalized travel plans based on user interests and locations.

## Features
- Generate travel itineraries using Gemini AI
- Manage user interests and travel locations
- Provide direction and recommendation APIs
- RESTful APIs for frontend/mobile clients
- Store itineraries and metadata in MongoDB

## Tech Stack 
- Node.js - Express.js - TypeScript - MongoDB - Gemini API

## Tech Stack
- Node.js
- Express.js
- TypeScript
- MongoDB
- Gemini API
- React Native (Expo)

 ## Demo
Full UI screenshots:  
https://github.com/huy04092004/travel-ai-app/tree/main/docs

## Project Structure

    travel-ai-api/
    ├── routes/
    │   ├── direction.js      // Direction APIs
    │   ├── interest.js       // User interest APIs
    │   ├── location.js       // Location APIs
    │   ├── locationv2.js     // Enhanced location APIs
    │   └── travel_AI.js      // AI itinerary generation APIs
    ├── models/
    │   ├── Interests.js      // Interest schema
    │   ├── Location_v2.js    // Location schema
    │   └── Itinerary.js      // Itinerary schema

## Main APIs
| Method | Endpoint | Description |
|--------|---------|------------|
| POST | /api/ai/generate | Generate itinerary using AI |
| GET | /api/locations | Get travel locations |
| POST | /api/interests | Save user interests |
| GET | /api/directions | Get travel directions |

## How to Run Locally
```bash
git clone https://github.com/huy04092004/travel-ai-backend.git
cd travel-ai-backend
npm install
npm run dev

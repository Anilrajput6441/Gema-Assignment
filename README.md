# Student Assessment Report System

A full-stack application for managing and displaying student speaking assessment reports, built with Next.js, Node.js, Express, and MongoDB.

## Features

- **Report Display**: View student assessment reports with scores, charts, and feedback
- **Multi-Section Form**: Submit new assessments through a step-by-step form
- **Score Visualization**: Bar charts and radar charts for skill scores
- **Automatic Feedback**: Feedback generation based on score ranges
- **Backend Storage**: MongoDB Atlas integration for data persistence
- **Fallback Support**: JSON fallback when backend is unavailable

## Tech Stack

### Frontend
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS
- Chart.js / react-chartjs-2
- Axios

### Backend
- Node.js
- Express.js
- MongoDB / Mongoose
- CORS enabled

## Project Structure

```
Gema-Assignment/
├── client/                 # Next.js frontend
│   ├── app/
│   │   ├── components/     # React components
│   │   ├── submit/         # Form submission page
│   │   └── page.tsx        # Main report page
│   ├── lib/                # Utilities and API client
│   └── data/               # Fallback JSON data
└── server/                 # Express backend
    ├── config/             # Database configuration
    ├── models/             # Mongoose models
    ├── controllers/       # Route controllers
    └── routes/             # API routes
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your MongoDB Atlas connection string to `.env`:
```
PORT=8001
MONGODB_URI=your_mongodb_atlas_connection_string_here
```

5. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:8001`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (optional, for custom API URL):
```
NEXT_PUBLIC_API_URL=http://localhost:8001/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Assessments

- `POST /api/assessments` - Create a new assessment
- `GET /api/assessments` - Get all assessments
- `GET /api/assessments?latest=true` - Get the latest assessment
- `GET /api/assessments/:id` - Get a specific assessment by ID

### Health Check

- `GET /api/health` - Server health check

## Data Model

### Assessment Schema

```javascript
{
  studentName: String (required),
  testDate: Date (required),
  overallScore: Number (0-9, required),
  skills: {
    pronunciation: Number (0-9, required),
    fluency: Number (0-9, required),
    vocabulary: Number (0-9, required),
    grammar: Number (0-9, required)
  },
  feedback: {
    overall: String,
    pronunciation: String,
    fluency: String,
    vocabulary: String,
    grammar: String
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Feedback Logic

Feedback is automatically generated based on score ranges:

- **Score ≥ 8**: "Excellent performance with strong control."
- **Score 6-7**: "Good performance with minor inaccuracies."
- **Score < 6**: "Needs improvement."

This logic applies to:
- Overall score
- Each individual skill (Pronunciation, Fluency, Vocabulary, Grammar)

## Where Scores Are Stored

1. **Primary Storage**: MongoDB Atlas database
   - All submitted assessments are stored in MongoDB
   - Data persists across server restarts

2. **Fallback Storage**: `client/data/fallback-data.json`
   - Used when backend is unavailable
   - Provides sample data for testing
   - Automatically loaded if API request fails

## How Feedback Logic Works

1. **Automatic Generation**: When a user submits scores, feedback is automatically generated using the `generateAllFeedback()` function in `client/lib/feedbackLogic.ts`

2. **Score-Based Rules**: 
   - The function checks each score against predefined ranges
   - Returns appropriate feedback message based on the score value
   - Applied to overall score and all four skills

3. **Backend Storage**: Generated feedback is saved along with the assessment data in MongoDB

## Usage

1. **View Report**: Navigate to `http://localhost:3000` to see the latest assessment report
2. **Submit Assessment**: Click "Submit Assessment" button in the header
3. **Fill Form**: Complete the multi-section form:
   - Section 1: Student Information (Name, Test Date)
   - Section 2: Scores (Overall and all 4 skills)
   - Section 3: Review and Submit
4. **View Results**: After submission, you'll be redirected to the main page to see the new report

## Development

### Running Both Servers

In separate terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

## Notes

- The application uses ES6 modules (`import/export`)
- CORS is enabled for cross-origin requests
- The form includes validation for all required fields
- Charts are rendered using Chart.js with both bar and radar chart options
- The UI is fully responsive and uses Tailwind CSS for styling

## License

ISC


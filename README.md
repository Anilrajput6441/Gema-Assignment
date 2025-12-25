# Student Assessment Report System

A full-stack application for managing and displaying student speaking assessment reports with support for multiple exam types (Speechace, CEFR, IELTS, PTE, TOEFL, TOEIC). Built with Next.js, Node.js, and Express.

## Features

- **User Management**: Create user accounts with profile information (name, email, mobile, profile photo)
- **Multi-Exam Support**: Submit and view scores for multiple exam types in a single user account
- **Score Visualization**: Interactive bar charts and radar charts for skill-wise score analysis
- **Dynamic Feedback**: Automatic feedback generation based on score ranges for overall and individual skills
- **Animated Score Display**: Dynamic GIF animations based on performance (excellent, good, needs improvement)
- **Tab-Based Navigation**: Switch between different exam types using tabs
- **Local Storage Integration**: Automatic userId persistence for seamless user experience
- **Fallback Support**: JSON fallback when backend is unavailable

## Tech Stack

### Frontend
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS
- Chart.js / react-chartjs-2
- Roboto Slab font

### Backend
- Node.js
- Express.js
- JSON file storage (no database required)
- CORS enabled

## Project Structure

```
Gema-Assignment/
├── client/                      # Next.js frontend
│   ├── app/
│   │   ├── components/          # React components
│   │   │   ├── Chart.tsx        # Score visualization charts
│   │   │   ├── ScoreCard.tsx    # Overall score with animated GIF
│   │   │   ├── SkillScores.tsx  # Individual skill scores
│   │   │   ├── FeedbackSection.tsx # Descriptive feedback
│   │   │   ├── UserInfoSection.tsx  # User profile display
│   │   │   └── ExamTypeTabs.tsx     # Exam type navigation
│   │   ├── create-user/         # User creation page
│   │   ├── submit-exam/         # Exam submission page
│   │   └── page.tsx             # Main dashboard
│   ├── lib/
│   │   ├── api.ts               # API client and data fetching
│   │   ├── examTypes.ts         # Exam type configurations
│   │   └── feedbackLogic.ts     # Feedback generation logic
│   └── data/                    # Fallback JSON data
│       ├── assessments.json
│       └── fallback-data.json
└── server/                      # Express backend
    ├── controllers/
    │   ├── user.controller.js   # User and exam data handlers
    │   └── health.controller.js # Health check
    ├── routes/
    │   ├── user.routes.js       # User API routes
    │   └── health.routes.js     # Health check route
    └── data/
        └── users.json           # User data storage (auto-created)
```

## How to Start from Scratch

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd Gema-Assignment

# Or extract the project folder
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies

```bash
# From project root
cd client
npm install
```

### Step 4: Start the Backend Server

```bash
# From server directory
cd server
npm start

# Or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:8000`

### Step 5: Start the Frontend Development Server

```bash
# From client directory (in a new terminal)
cd client
npm run dev
```

The frontend will run on `http://localhost:3000`

### Step 6: Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You'll see a welcome message if no user data exists
3. Click "Create user account first" to get started

## How to Run the Project

### Running Both Servers

You need to run both the backend and frontend servers simultaneously:

**Terminal 1 (Backend):**
```bash
cd server
npm start
# Server runs on http://localhost:8000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3000
```

### Production Build

**Build Frontend:**
```bash
cd client
npm run build
npm start
```

**Backend:**
```bash
cd server
npm start
```

## Workflow

### 1. Create User Account
- Navigate to `/create-user` or click "Create user account first"
- Fill in:
  - Student Name (required)
  - Email (required)
  - Mobile (optional)
  - Profile Photo (defaults to `/profile.jpg`)
- Click "Create User"
- User ID is automatically saved to browser's local storage
- You'll be redirected to the exam submission form

### 2. Submit Exam Data
- Navigate to `/submit-exam` (automatically redirected after user creation)
- Fill in exam data for all exam types:
  - **Speechace** (0-9 scale)
  - **CEFR** (A1-C2, 1-6 scale)
  - **IELTS** (0-9 scale)
  - **PTE** (0-90 scale)
  - **TOEFL** (0-120 scale)
  - **TOEIC** (0-200 scale)
- For each exam type, enter:
  - Test Date
  - Overall Score
  - Individual Skill Scores:
    - Pronunciation
    - Fluency
    - Vocabulary
    - Grammar
- Click "Submit All Exam Data"
- You'll be redirected to the dashboard to view results

### 3. View Assessment Report
- The main dashboard (`/`) displays:
  - User profile information
  - Exam type tabs for navigation
  - Overall score with animated GIF (changes based on performance)
  - Score visualization (radar chart)
  - Skill-wise scores (bar chart)
  - Descriptive feedback for each skill

## Where Scores Are Stored

### Primary Storage: JSON File
All user data and exam scores are stored in:
```
server/data/users.json
```

**Data Structure:**
```json
[
  {
    "userId": "user_1234567890_abc123",
    "studentName": "John Doe",
    "email": "john@example.com",
    "mobile": "+1234567890",
    "profilePhoto": "/profile.jpg",
    "exams": [
      {
        "_id": "exam_1234567890_xyz789",
        "examType": "speechace",
        "testDate": "2024-01-15T00:00:00.000Z",
        "overallScore": 8,
        "scores": [8, 7, 8, 7],  // [pronunciation, fluency, vocabulary, grammar]
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Notes:**
- The `users.json` file is automatically created when the first user is created
- Data persists across server restarts
- Each user can have multiple exams (one per exam type)
- Scores are stored as arrays: `[pronunciation, fluency, vocabulary, grammar]`

### Fallback Storage: Frontend JSON Files
If the backend is unavailable, the frontend falls back to:
- `client/data/assessments.json` - Sample user data
- `client/data/fallback-data.json` - Default fallback data

### Browser Local Storage
- `userId` is stored in browser's local storage for automatic user identification
- This allows the app to remember which user is logged in

## How Feedback Logic Works

### Feedback Generation

Feedback is automatically generated based on score ranges using the `generateAllFeedback()` function in `client/lib/feedbackLogic.ts`.

### Score-Based Rules

The feedback logic uses percentage-based thresholds:

1. **Excellent Performance** (Score ≥ 8 or Percentage ≥ 88%)
   - Feedback: `"Excellent performance with strong control."`
   - GIF: Ryan Gosling Clap GIF (for overall score ≥ 83%)

2. **Good Performance** (Score 6-7 or Percentage 66-87%)
   - Feedback: `"Good performance with minor inaccuracies."`
   - GIF: Great Job Success GIF (for overall score 78-82%)

3. **Needs Improvement** (Score < 6 or Percentage < 66%)
   - Feedback: `"Needs improvement."`
   - GIF: Bored School GIF (for overall score < 78%)

### Application

Feedback is generated for:
- **Overall Score**: Based on the overall exam score
- **Pronunciation**: Based on pronunciation skill score
- **Fluency**: Based on fluency skill score
- **Vocabulary**: Based on vocabulary skill score
- **Grammar**: Based on grammar skill score

### Implementation Details

```typescript
// Function signature
generateAllFeedback(
  scores: {
    overall: number;
    pronunciation: number;
    fluency: number;
    vocabulary: number;
    grammar: number;
  },
  maxScore: number = 9
)

// Returns
{
  overall: string,
  pronunciation: string,
  fluency: string,
  vocabulary: string,
  grammar: string
}
```

### Score Card GIF Selection

The overall score card displays different animated GIFs based on the score percentage:

- **≥ 83%**: Ryan Gosling Clap GIF (`/Ryan Gosling Clap GIF.gif`)
- **78-82%**: Great Job Success GIF (`/Great Job Success GIF by BEARISH.gif`)
- **< 78%**: Bored School GIF (`/Bored School GIF.gif`)

The GIF is displayed inside an animated blob shape that continuously morphs.

## API Endpoints

### User Management

- `POST /api/users` - Create a new user
  - Body: `{ studentName, email, mobile?, profilePhoto? }`
  - Returns: `{ userId, studentName, email }`

- `GET /api/users` - Get all users with their exams
  - Returns: Array of all users

- `GET /api/users/:userId` - Get a specific user by userId
  - Returns: Complete user object with all exams

### Exam Data

- `POST /api/users/:userId/exams` - Submit all exam data for a user
  - Body: `{ exams: [{ examType, testDate, overallScore, skills }] }`
  - Replaces all existing exams for the user
  - Returns: `{ userId, studentName, totalExams }`

### Health Check

- `GET /api/health` - Server health check
  - Returns: `{ status: "ok", timestamp }`

## Exam Types and Score Ranges

| Exam Type | Max Score | Min Score | Score Label |
|-----------|-----------|-----------|-------------|
| Speechace | 9 | 0 | /9 |
| CEFR | 6 | 1 | (A1-C2) |
| IELTS | 9 | 0 | /9 |
| PTE | 90 | 0 | /90 |
| TOEFL | 120 | 0 | /120 |
| TOEIC | 200 | 0 | /200 |

## Development Notes

- The application uses ES6 modules (`import/export`)
- CORS is enabled for cross-origin requests
- Form validation is included for all required fields
- Charts are rendered using Chart.js with both bar and radar chart options
- The UI is fully responsive and uses Tailwind CSS for styling
- Roboto Slab font is applied globally across the application
- All comments follow the `//======comment========` style

## Troubleshooting

### Backend not starting
- Check if port 8000 is already in use
- Verify Node.js version (v18+)
- Check that all dependencies are installed: `npm install`

### Frontend not connecting to backend
- Ensure backend is running on `http://localhost:8000`
- Check browser console for CORS errors
- Verify API_BASE_URL in `client/lib/api.ts`

### No data showing
- Check if `server/data/users.json` exists and has valid JSON
- Verify userId in browser's local storage
- Check browser console for API errors
- Frontend will fallback to JSON files if backend is unavailable

### User ID not persisting
- Check browser's local storage settings
- Ensure cookies/local storage is enabled
- Clear local storage and create a new user

## License

ISC

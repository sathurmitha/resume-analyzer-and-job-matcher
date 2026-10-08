# Resume Analyzer & Job Matcher

A complete full-stack web application that allows users to upload their resume, automatically extract skills, analyze skill gaps, and match with relevant job postings.

## Features

- **User Authentication**: Secure JWT-based registration and login system.
- **Resume Upload & Parsing**: Upload PDF resumes and automatically extract text using NLP techniques.
- **Skill Extraction**: Identifies key skills and categorizes them automatically.
- **ATS Resume Scoring**: Scores contact details, searchable skills, standard resume sections, parseability, education, experience, projects, and certifications out of 100.
- **Job Matching Algorithm**: Compares extracted skills with job requirements to calculate a match percentage.
- **Skill Gap Analysis**: Identifies missing skills and provides personalized recommendations.
- **Job Database**: Browse, filter, and save relevant jobs.
- **Analysis History**: Keep track of previous resume scores and matched jobs.
- **Profile-Based Job Matching**: Rank stored jobs against skills from the latest resume and profile.
- **Responsive Dashboard**: Modern UI built with React and Tailwind CSS.

## Tech Stack

**Frontend:**
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (Icons)

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Multer (File Uploads)
- pdf-parse (PDF Text Extraction)

## Project Structure

```
resume-analyzer/
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context for state (Auth)
│   │   ├── layouts/     # Dashboard layouts
│   │   ├── pages/       # Application routes/pages
│   │   └── services/    # API calls using Axios
│   └── package.json
└── server/              # Node.js backend application
    ├── config/          # Database configuration
    ├── controllers/     # Route logic
    ├── middleware/      # Auth & Upload middlewares
    ├── models/          # Mongoose schemas
    ├── routes/          # Express route definitions
    ├── scripts/         # DB Seed scripts
    ├── services/        # Parsers and Algorithms
    ├── uploads/         # Uploaded PDF files
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB installation)

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure the variables (see `.env.example`):
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Run the database seeder to populate sample jobs:
```bash
npm run seed
```

Start the backend development server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

## Future Enhancements
- Integration with an actual LLM (like OpenAI API) for deeper, contextual resume understanding.
- Live job connectors for LinkedIn, Naukri, and Internshala using approved partner/API access.
- Generating tailored cover letters based on the matched job.

## External Job Board Integration

The application does not scrape job boards or collect a user's LinkedIn, Naukri, or Internshala password. Those sites generally restrict automated job-search access, and access to live listings requires the relevant official API, partner agreement, or an approved feed.

Imported listings should be normalized into the `Job` model with `source` set to `linkedin`, `naukri`, or `internshala`, and a stable `sourceJobId`. The existing `/api/jobs/matches` endpoint then ranks them against the user's latest resume and profile skills. Once approved provider credentials are available, each provider can be implemented as a server-side adapter that writes this normalized shape into MongoDB; secrets must remain in the server `.env` file.

# AceVantage: AI Interview Pilot

AceVantage is your personal technical co-pilot for the modern job market. From real-time interview assistance to automated document crafting, it provides everything you need to secure your next role.

## Key Features Implemented

- **🔐 Mock Authenticaton & Admin**: Includes user login (`briansmc@gmail.com` / `password123!`) and Admin dashboard (`admin` / `password123!`) to track usage, manage users, and adjust subscription pricing.
- **🚀 Real-time Live Pilot**: Instant transcription and AI-suggested answers during live interviews. Supports model switching (Gemini, GPT 5.4, Claude 3.5, Grok 3).
- **🖥️ Screen Data Analysis**: Paste code snippets or upload screenshots directly to the Live Pilot to solve on-screen technical problems on the fly.
- **📱 Device & App Optimized**: Tailor the layout and audio capture for specific meeting apps (Zoom, Teams, Meet, Skype) and devices (PC vs Phone layouts).
- **🎓 AI Mock Interviews**: Risk-free practice sessions with an adaptive AI interviewer.
- **🛠️ Web Assessment Solver**: Real-time analysis and solutions for online technical tests and coding assessments.
- **📄 AI Resume Optimizer**: Tailor your resume for specific job descriptions and store the last 20 generated resumes to bypass ATS filters.
- **🤖 AI Job Apply Assistant**: Tabulate your data into a highly secure form filler to automatically generate answers to behavioral questions and application fields.
- **📊 Performance Analytics**: Deep insights into your skill mastery, clarity trends, and overall readiness scores.
- **🕵️ Stealth Mode**: A variable-opacity UI that allows you to use the tool discretely as an overlay.

## Project Structure & Tasks

- `/src/App.tsx`: Main UI logic, state management, and tab routing. Contains the Live Pilot, Model Switching, and Auth Gate.
- `/src/components/`: Modularized components for Auth, Admin, Home, JobApply, ResumeOptimizer, etc.
- `/src/lib/gemini.ts`: AI service integration references.
- `/src/types.ts`: Centralized TypeScript definitions for data integrity.

## How to use

1. **Login**: Sign in using your email or try the admin login to check out the dashboard.
2. **Setup your Profile**: Go to the 'Profile' tab and upload your resume or paste your LinkedIn bio. This allows the AI to tailor its answers to your experience.
3. **Start the Pilot**: Navigate to 'Live Pilot', select your target app (Zoom, Teams, etc.), and click 'Start Microphone'. Use 'Screen Data Analysis' for any on-screen code questions.
4. **Practice**: Use the 'AI Mock' tab to simulate a real interview. Speak your answers and watch the 'Interviewer Feedback' panel update in real-time.
5. **Job Application Assistant & Resume Optimizer**: Navigate to the respective tabs to input your work history securely and tailor your applications and resumes to specific job postings.
6. **Solve Tests**: If you are in an online assessment, switch to 'Web Test' mode. Paste the question or screen data for an instant step-by-step solution.

---
*Note: This application requires a valid `GEMINI_API_KEY` configured in your environment to function.*

# AceVantage: AI Interview Pilot

AceVantage is your personal technical co-pilot for the modern job market. From real-time interview assistance to automated document crafting, it provides everything you need to secure your next role.

## Key Features Implemented

- **🚀 Real-time Live Pilot**: Instant transcription and AI-suggested answers during live interviews.
- **🎓 AI Mock Interviews**: Risk-free practice sessions with a adaptive AI interviewer.
- **🛠️ Web Assessment Solver**: Real-time analysis and solutions for online technical tests and coding assessments.
- **📄 Content Studio**: Professional resume analysis and instant cover letter generation tailored to specific job descriptions.
- **📊 Performance Analytics**: Deep insights into your skill mastery, clarity trends, and overall readiness scores.
- **🕵️ Stealth Mode**: A variable-opacity UI that allows you to use the tool discretely as an overlay.

## Project Structure & Tasks

- `/src/App.tsx`: Main UI logic, state management, and tab routing.
- `/src/lib/gemini.ts`: AI service integration (Powered by Google Gemini 3.1 Pro).
- `/src/types.ts`: Centralized TypeScript definitions for data integrity.
- `/Dev-Summary.txt`: Detailed technical breakdown of files and technologies.
- `/Requirements.txt`: Project origin and core functional roadmap.

## How to use

1. **Setup your Profile**: Go to the 'Profile' tab and upload your resume or paste your LinkedIn bio. This allows the AI to tailor its answers to your experience.
2. **Start the Pilot**: Navigate to 'Live Pilot' and click 'Start Microphone'. As the interviewer speaks, the AI will automatically suggest the best ways for you to respond based on your background.
3. **Practice**: Use the 'AI Mock' tab to simulate a real interview. Speak your answers and watch the 'Interviewer Feedback' panel update in real-time.
4. **Solve Tests**: If you are in an online assessment, switch to 'Web Test' mode. Paste the question or screen data for an instant step-by-step solution.
5. **Optimize Documents**: Use the 'Resume/Docs' tab to get actionable feedback on your resume or generate a cover letter for a specific job description.

---
*Note: This application requires a valid `GEMINI_API_KEY` configured in your environment to function.*

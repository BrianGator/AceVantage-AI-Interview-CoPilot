import { GoogleGenAI } from "@google/genai";
import { Message, UserProfile } from "../types";

const API_KEY = process.env.GEMINI_API_KEY;
const isMockMode = !API_KEY || API_KEY === 'MY_GEMINI_API_KEY' || API_KEY === '';

const ai = new GoogleGenAI({ apiKey: isMockMode ? 'MOCK_KEY' : API_KEY });

// --- Mock Response Generators ---
function getMockInterviewAnswer(question: string, profile: UserProfile) {
  const skills = profile.skills.length > 0 ? profile.skills.slice(0, 2).join(' and ') : 'technical skills';
  return `Based on my experience as a ${profile.targetRole}, I would approach this by leveraging my background in ${skills}. In my previous roles, I focused on high-quality delivery and ${question.toLowerCase().includes('team') ? 'collaborative problem solving' : 'optimized workflow design'}. Specifically, I ensure that architecture follows best practices like scalability and maintainability.`;
}

function getMockAssessmentSolution(question: string) {
  return `ANSWER: OPTION B (Optimized Approach)
ACTION: Select the second option and verify the implementation logic.
EXPLANATION: This approach minimizes cognitive complexity and ensures O(n) time complexity by avoiding nested loops. For ${question.substring(0, 20)}..., standard industry practice favors modularity over monolithic structures.`;
}

export async function generateInterviewAnswer(
  question: string,
  profile: UserProfile,
  transcriptContext: Message[]
) {
  if (isMockMode) {
    await new Promise(r => setTimeout(r, 800)); // Simulate latency
    return getMockInterviewAnswer(question, profile);
  }

  const model = "gemini-3.1-pro-preview";
  // ... rest of the existing code
  
  const recentTranscript = transcriptContext
    .slice(-5)
    .map(m => `${m.speaker === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.text}`)
    .join('\n');

  const systemPrompt = `
    You are an expert Interview Coach. Your task is to provide the BEST response for a candidate during a live interview.
    
    CANDIDATE PROFILE:
    Role: ${profile.targetRole}
    Skills: ${profile.skills.join(', ')}
    Resume Summary: ${profile.resumeText.substring(0, 1000)}
    LinkedIn: ${profile.linkedInUrl}
    
    RECENT CONVERSATION CONTEXT:
    ${recentTranscript}
    
    INSTRUCTIONS:
    1. Provide a professional, concise, and structured answer.
    2. Use the STAR method (Situation, Task, Action, Result) if applicable.
    3. Infuse relevant keywords from the candidate's skills and resume.
    4. If it's a coding question, provide code in the candidate's preferred language (defaulting to Java/Javascript if not specified).
    5. Stay authentic but highlight strengths.
    6. If the question is about technical QA (SQL, Selenium, Playwright), provide specific examples of implementations.
    
    Current Question: "${question}"
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }]
    });
    return result.text || "I'm sorry, I couldn't generate an answer at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating answer. Please check your connection.";
  }
}

export async function generateMockInterviewQuestion(profile: UserProfile, transcript: Message[]) {
  if (isMockMode) {
    await new Promise(r => setTimeout(r, 600));
    const questions = [
      `How would you handle a complex regression issue in a ${profile.targetRole} environment?`,
      `Tell me about a time you had to explain technical ${profile.skills[0] || 'logic'} to a non-technical stakeholder.`,
      `What is your philosophy on documentation and code quality in high-velocity teams?`
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }
  const model = "gemini-3-flash-preview";
  const prompt = `You are a technical interviewer for ${profile.targetRole}. 
  Based on the candidate's skills (${profile.skills.join(', ')}) and resume (${profile.resumeText.substring(0, 500)}), 
  ask a challenging follow-up question based on the conversation history: ${JSON.stringify(transcript.slice(-5))}.
  Keep it professional and focused on the job requirements.`;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    return result.text || `Tell me about your experience with ${profile.skills[0]}.`;
  } catch (error) {
    return "What is your biggest technical challenge?";
  }
}

export async function generateResumeFeedback(profile: UserProfile) {
  if (isMockMode) {
    await new Promise(r => setTimeout(r, 1000));
    return `1. Quantify your achievements in ${profile.targetRole} using more metrics.
2. Highlight your specific contributions to ${profile.skills[0] || 'core projects'}.
3. Modernize the layout to emphasize readable technical stacks.
4. Add a strong executive summary at the top.
5. Ensure reverse-chronological order is strictly followed.`;
  }
  const model = "gemini-3-flash-preview";
  const prompt = `Analyze this resume for a ${profile.targetRole} position. 
  Resume: ${profile.resumeText}
  Provide 5 actionable improvements to make it stand out. Return in a simple list format.`;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    return result.text || "Add more metrics to your experience.";
  } catch (error) {
    return `Optimize for keywords related to ${profile.targetRole}.`;
  }
}

export async function generateCoverLetter(profile: UserProfile, jobDescription: string) {
  if (isMockMode) {
    await new Promise(r => setTimeout(r, 1200));
    return `Dear Hiring Manager,\n\nI am thrilled to apply for the ${profile.targetRole} position. With my background in ${profile.skills.join(', ')}, I am confident I can bring immediate value to your team. My experience aligns perfectly with your requirements for specialized growth and technical excellence.\n\nBest regards,\nCandidate`;
  }
  const model = "gemini-3-flash-preview";
  const prompt = `Write a professional cover letter for a ${profile.targetRole} position.
  Candidate Skills: ${profile.skills.join(', ')}
  Job Description: ${jobDescription}
  Resume Context: ${profile.resumeText.substring(0, 1000)}
  Make it compelling and tailored to the job description.`;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    return result.text || "Dear Hiring Manager...";
  } catch (error) {
    return "I am writing to express my interest...";
  }
}

export async function solveAssessmentQuestion(questionData: string, profile: UserProfile) {
  if (isMockMode) {
    await new Promise(r => setTimeout(r, 1500));
    return getMockAssessmentSolution(questionData);
  }
  const model = "gemini-1.5-flash";
  const prompt = `Solve this technical assessment question for a ${profile.targetRole}.
  Question Data: ${questionData}
  
  CONTEXT:
  User Skills: ${profile.skills.join(', ')}
  
  INSTRUCTIONS:
  1. Identify the correct answer (if Multiple Choice).
  2. Provide the exact text to type (if Text box).
  3. Briefly explain WHY this is the correct answer.
  4. If multiple answers are correct, list ALL of them.
  
  Format the output as:
  ANSWER: [The Answer]
  ACTION: [e.g. Click Option B, or Paste specific code]
  EXPLANATION: [Brief reasoning]`;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    return result.text || "Unable to solve. Please provide more context.";
  } catch (error) {
    return "Error analyzing assessment question.";
  }
}

export async function analysisPerformance(session: { transcript: Message[], answers: any[] }) {
  if (isMockMode) {
    return { 
      score: 88, 
      keyStrengths: ["Technical Communication", "Structure"], 
      areasForImprovement: ["Depth of Examples"] 
    };
  }
  const model = "gemini-3-flash-preview";
  
  const content = `
    Analyze this interview performance and provide feedback.
    Transcript: ${JSON.stringify(session.transcript.slice(-20))}
    Answers provided: ${JSON.stringify(session.answers)}
    
    Provide output in JSON format with score (0-100), keyStrengths (array), and areasForImprovement (array).
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: content }] }],
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(result.text || '{}');
  } catch (error) {
    return { score: 70, keyStrengths: ["Persistence"], areasForImprovement: ["Clarity"] };
  }
}

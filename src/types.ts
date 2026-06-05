import * as pdfjsLib from 'pdfjs-dist';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    text += strings.join(' ') + '\n';
  }
  
  return text;
}
export type Message = {
  id: string;
  speaker: 'interviewer' | 'me' | 'system';
  text: string;
  timestamp: number;
};

export type Answer = {
  id: string;
  questionId: string;
  questionText: string;
  answerText: string;
  timestamp: number;
  tags?: string[];
};

export type InterviewProfile = {
  id: string;
  name: string;
  resumeText: string;
  companyName: string;
  companyDescription: string;
  position: string;
  jobDescription: string;
  createdAt: number;
};

export type UserProfile = {
  linkedInUrl: string;
  resumeText: string;
  targetRole: string;
  skills: string[];
};

export type InterviewSession = {
  id: string;
  date: number;
  transcript: Message[];
  answers: Answer[];
  performanceScore: number;
  feedback: string[];
};

export type AIModel = 'gemini' | 'openai-5.4' | 'claude-3.5' | 'grok-3'; 

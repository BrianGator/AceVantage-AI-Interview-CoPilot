import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Mic, MicOff, Settings, Save, Trash2, 
  Send, User, FileText, BarChart3, 
  Settings2, Power, History, Download, 
  BrainCircuit, LayoutDashboard, MessageSquare,
  CheckCircle2, AlertCircle, Sparkles, Terminal, BookOpen,
  GraduationCap, ClipboardList, PenTool, FileCheck, Layers
} from 'lucide-react';
import { parsePdf } from './types.ts';

const MOCK_ANALYTICS_DATA = [
  { name: 'S1', readiness: 45, technical: 40, clarity: 50 },
  { name: 'S2', readiness: 55, technical: 50, clarity: 55 },
  { name: 'S3', readiness: 48, technical: 45, clarity: 60 },
  { name: 'S4', readiness: 75, technical: 70, clarity: 75 },
  { name: 'S5', readiness: 85, technical: 80, clarity: 85 },
  { name: 'S6', readiness: 92, technical: 85, clarity: 90 },
];
import { motion, AnimatePresence } from 'motion/react';
import { Message, Answer, UserProfile, InterviewSession, AIModel } from './types.ts';
import { 
  generateInterviewAnswer, 
  analysisPerformance, 
  generateMockInterviewQuestion, 
  generateResumeFeedback, 
  generateCoverLetter, 
  solveAssessmentQuestion 
} from './lib/gemini.ts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [activeTab, setActiveTab] = useState<'live' | 'mock' | 'assessment' | 'documents' | 'reports' | 'profile'>('live');
  const [profile, setProfile] = useState<UserProfile>({
    linkedInUrl: '',
    resumeText: '',
    targetRole: 'Software QA Automation Engineer',
    skills: ['Java', 'Selenium', 'SQL', 'Playwright', 'QA Automation', 'Javascript']
  });
  const [selectedMic, setSelectedMic] = useState<string>('');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [manualQuestion, setManualQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiModel, setAiModel] = useState<AIModel>('gemini');
  const [opacity, setOpacity] = useState(100);
  const [isStealth, setIsStealth] = useState(false);
  
  // New Feature States
  const [isMockActive, setIsMockActive] = useState(false);
  const [mockQuestion, setMockQuestion] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [isWebPilot, setIsWebPilot] = useState(false);
  const [assessmentInput, setAssessmentInput] = useState('');
  const [assessmentResult, setAssessmentResult] = useState('');
  const [isSolving, setIsSolving] = useState(false);

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const answersEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const results = event.results;
        const lastResult = results[results.length - 1];
        const text = lastResult[0].transcript.trim();

        if (lastResult.isFinal) {
          // Detect speaker (simple heuristic: if it's a question, it might be interviewer)
          const isQuestion = text.includes('?') || 
            /how|what|why|describe|would|could|tell/i.test(text.split(' ')[0]);
          
          const newMessage: Message = {
            id: Date.now().toString(),
            speaker: isQuestion ? 'interviewer' : 'me',
            text: text,
            timestamp: Date.now()
          };
          
          setTranscript(prev => [...prev, newMessage]);
          
          // Auto-answer if it's an interviewer question
          if (isQuestion) {
            handleAutoAnswer(text);
          }
        }
      };

      recognition.onend = () => {
        if (isRecording) recognition.start();
      };

      recognitionRef.current = recognition;
    }

    // Get Devices
    navigator.mediaDevices.enumerateDevices().then(d => {
      const audioInput = d.filter(device => device.kind === 'audioinput');
      setDevices(audioInput);
      if (audioInput.length > 0) setSelectedMic(audioInput[0].deviceId);
    });
  }, []);

  useEffect(() => {
    if (isRecording) {
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
    }
  }, [isRecording]);

  const toggleRecording = () => setIsRecording(!isRecording);

  const handleAutoAnswer = async (question: string) => {
    setIsGenerating(true);
    try {
      const answerText = await generateInterviewAnswer(question, profile, transcript);
      const newAnswer: Answer = {
        id: Date.now().toString(),
        questionId: Date.now().toString(),
        questionText: question,
        answerText: answerText,
        timestamp: Date.now(),
        tags: ['Auto-GPT']
      };
      setAnswers(prev => [...prev, newAnswer]);
    } finally {
      setIsGenerating(false);
    }
  };

  const answerLastQuestion = () => {
    const lastInterviewerMsg = [...transcript].reverse().find(m => m.speaker === 'interviewer');
    if (lastInterviewerMsg) {
      handleAutoAnswer(lastInterviewerMsg.text);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuestion.trim()) return;
    handleAutoAnswer(manualQuestion);
    setManualQuestion('');
  };

  const saveSession = () => {
    const data = { transcript, answers, profile, date: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-session-${Date.now()}.json`;
    a.click();
  };

  const clearSession = () => {
    if (confirm('Clear all data for this session?')) {
      setTranscript([]);
      setAnswers([]);
      setIsMockActive(false);
    }
  };

  const handleDocumentGenerate = async (type: 'resume' | 'cover-letter') => {
    setIsGeneratingDoc(true);
    let result = '';
    if (type === 'resume') {
      result = await generateResumeFeedback(profile);
    } else {
      result = await generateCoverLetter(profile, jobDescription);
    }
    setGeneratedDoc(result);
    setIsGeneratingDoc(false);
  };

  const handleSolveAssessment = async () => {
    if (!assessmentInput.trim()) return;
    setIsSolving(true);
    const result = await solveAssessmentQuestion(assessmentInput, profile);
    setAssessmentResult(result);
    setIsSolving(false);
  };

  // --- Handlers ---
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        const text = await parsePdf(file);
        setProfile({ ...profile, resumeText: text });
      } else {
        const text = await file.text();
        setProfile({ ...profile, resumeText: text });
      }
    }
  };

  const startMockInterview = async () => {
    setIsMockActive(true);
    setIsGenerating(true);
    const firstQ = await generateMockInterviewQuestion(profile, []);
    setTranscript([{ id: 'start', speaker: 'interviewer', text: firstQ, timestamp: Date.now() }]);
    setMockQuestion(firstQ);
    setIsGenerating(false);
  };

  return (
    <div 
      className="flex h-screen w-full overflow-hidden bg-neutral-950 font-sans text-neutral-100 transition-opacity duration-300"
      style={{ opacity: opacity / 100 }}
    >
      {/* Persistent Web Sidebar */}
      <aside className={cn(
        "flex w-64 flex-col border-r border-neutral-800 bg-neutral-900/50 backdrop-blur-xl transition-all duration-300",
        isStealth && "w-16 opacity-10 hover:w-64 hover:opacity-100"
      )}>
        <div className="flex h-16 items-center gap-3 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-900/40">
            <BrainCircuit size={18} className="text-white" />
          </div>
          {!isStealth && <span className="font-bold tracking-tight text-white">AceVantage</span>}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {[
            { id: 'live', icon: LayoutDashboard, label: 'Live Pilot' },
            { id: 'mock', icon: GraduationCap, label: 'AI Mock' },
            { id: 'assessment', icon: Terminal, label: 'Web Test' },
            { id: 'documents', icon: PenTool, label: 'Resume/Docs' },
            { id: 'reports', icon: BarChart3, label: 'Analytics' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              )}
            >
              <tab.icon size={18} className={cn(activeTab === tab.id ? "text-white" : "text-neutral-500 group-hover:text-white")} />
              {!isStealth && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-neutral-800 p-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-neutral-800",
              activeTab === 'profile' ? "text-blue-400" : "text-neutral-400"
            )}
          >
            <User size={18} />
            {!isStealth && <span>My Profile</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-900/30 px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
             <div className="flex flex-col">
               <h1 className="text-sm font-bold capitalize text-white">{activeTab.replace('-', ' ')}</h1>
               {isRecording && (
                 <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-500/80">Recording Live</span>
                 </div>
               )}
             </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 items-center gap-1 rounded-xl bg-neutral-800/40 p-1">
               <button 
                onClick={() => setIsStealth(!isStealth)}
                className={cn("flex items-center gap-2 rounded-lg px-3 py-1 text-[10px] font-bold uppercase transition-all", isStealth ? "bg-white text-black" : "text-neutral-500 hover:text-white")}
               >
                 Stealth Mode
               </button>
            </div>
            
            <div className="h-4 w-px bg-neutral-800" />
            
            <button onClick={saveSession} className="glass-button h-10 w-10 p-0 rounded-xl" title="Save">
              <Save size={16} />
            </button>
            
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-lg">
              {profile.linkedInUrl ? <CheckCircle2 size={16} /> : "B"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
        {activeTab === 'live' && (
          <div className="flex h-full w-full">
            {/* Left Sidebar: Controls */}
            <aside className="w-64 border-r border-neutral-800 p-4 shrink-0 overflow-y-auto">
              <div className="space-y-6">
                <section>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">Audio Source</label>
                  <select 
                    value={selectedMic}
                    onChange={(e) => setSelectedMic(e.target.value)}
                    className="input-field w-full text-xs"
                  >
                    {devices.map(device => (
                      <option key={device.deviceId} value={device.deviceId}>{device.label || 'Microphone'}</option>
                    ))}
                    {devices.length === 0 && <option>No Microphones Found</option>}
                  </select>
                </section>

                <section>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">AI Engine</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setAiModel('gemini')}
                      className={cn("glass-button text-[10px] truncate px-1", aiModel === 'gemini' && "border-blue-500 text-blue-400 bg-blue-500/10")}
                    >Gemini 1.5</button>
                    <button 
                      onClick={() => setAiModel('openai-5.4')}
                      className={cn("glass-button text-[10px] truncate px-1", aiModel === 'openai-5.4' && "border-green-500 text-green-400 bg-green-500/10")}
                    >GPT 5.4</button>
                    <button 
                      onClick={() => setAiModel('claude-3.5')}
                      className={cn("glass-button text-[10px] truncate px-1", aiModel === 'claude-3.5' && "border-purple-500 text-purple-400 bg-purple-500/10")}
                    >Claude 3.5</button>
                    <button 
                      onClick={() => setAiModel('grok-3')}
                      className={cn("glass-button text-[10px] truncate px-1", aiModel === 'grok-3' && "border-orange-500 text-orange-400 bg-orange-500/10")}
                    >Grok-3</button>
                  </div>
                </section>

                <section>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">Stealth & Overlay</label>
                  <div className="space-y-4 rounded-xl bg-neutral-800/30 p-3 ring-1 ring-neutral-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-300">Camouflage UI</span>
                      <button 
                        onClick={() => setIsStealth(!isStealth)}
                        className={cn(
                          "h-5 w-10 rounded-full transition-colors relative",
                          isStealth ? "bg-blue-600" : "bg-neutral-600"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 h-3 w-3 rounded-full bg-white transition-all",
                          isStealth ? "left-6" : "left-1"
                        )} />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-neutral-500 font-bold uppercase">
                        <span>Window Opacity</span>
                        <span>{opacity}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={opacity} 
                        onChange={(e) => setOpacity(parseInt(e.target.value))}
                        className="w-full accent-blue-500 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-2">
                  <button 
                    onClick={toggleRecording}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 rounded-xl py-4 font-bold transition-all shadow-lg active:scale-95",
                      isRecording 
                        ? "bg-red-600 hover:bg-red-500 text-white shadow-red-900/40" 
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40"
                    )}
                  >
                    {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                    {isRecording ? "STOP LISTENING" : "START RECORDING"}
                  </button>
                  <p className="text-center text-[10px] text-neutral-600 italic">Captures system audio & microphone</p>
                </section>

                <div className="h-px bg-neutral-800" />

                <section className="space-y-3">
                  <button onClick={answerLastQuestion} className="primary-button w-full text-xs py-3 bg-neutral-100 text-neutral-900 hover:bg-white font-bold">
                    RE-ANSWER LAST QUESTION
                  </button>
                  <button onClick={clearSession} className="glass-button w-full text-xs text-red-400 hover:bg-red-900/20">
                    <Trash2 size={12} /> CLEAR SESSION
                  </button>
                </section>
              </div>
            </aside>

            {/* Split Panels */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Panel: Transcription */}
              <div className={cn(
                "flex flex-1 flex-col border-r border-neutral-800 transition-all",
                isStealth && "bg-white text-neutral-900 border-neutral-200"
              )}>
                <div className={cn(
                  "flex items-center justify-between border-b px-4 py-2",
                  isStealth ? "bg-neutral-100 border-neutral-200" : "border-neutral-800 bg-neutral-900/30"
                )}>
                  <span className={cn(
                    "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider",
                    isStealth ? "text-neutral-500" : "text-neutral-400"
                  )}>
                    {isStealth ? <FileText size={14} /> : <MessageSquare size={14} />}
                    {isStealth ? "Meeting_Notes.txt" : "Final Transcript"}
                  </span>
                  <div className="flex h-2 w-2 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
                  <AnimatePresence>
                    {transcript.map((msg) => (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "max-w-[85%] rounded-lg p-3",
                          isStealth 
                            ? "bg-transparent text-neutral-800 border-b border-neutral-100" 
                            : msg.speaker === 'interviewer' 
                              ? "bg-neutral-800 text-neutral-200 self-start border-l-4 border-blue-500" 
                              : "bg-blue-900/20 text-blue-100 self-end ml-auto border-r-4 border-blue-400 shadow-xs"
                        )}
                      >
                        <div className={cn(
                          "mb-1 flex items-center justify-between text-[10px] font-bold uppercase",
                          isStealth ? "text-neutral-400" : "opacity-50"
                        )}>
                          <span>{msg.speaker === 'interviewer' ? 'Interviewer' : 'Me'}</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {transcript.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-neutral-600 italic">
                      <Mic size={32} className="opacity-20" />
                      <p>Waiting for audio input...</p>
                    </div>
                  )}
                  <div ref={transcriptEndRef} />
                </div>
              </div>

              {/* Right Panel: Auto-Answers */}
              <div className={cn(
                "flex flex-1 flex-col transition-all",
                isStealth ? "bg-white border-l border-neutral-200 shadow-inner" : "bg-neutral-900/10"
              )}>
                <div className={cn(
                  "flex items-center justify-between border-b px-4 py-2",
                  isStealth ? "bg-neutral-100 border-neutral-200" : "border-neutral-800 bg-neutral-900/30"
                )}>
                  <span className={cn(
                    "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider",
                    isStealth ? "text-neutral-500" : "text-neutral-400"
                  )}>
                    {isStealth ? <FileText size={14} /> : <BrainCircuit size={14} className="text-purple-400" />}
                    {isStealth ? "Suggested_Bullet_Points.md" : "Copilot Responses"}
                  </span>
                  {isGenerating && <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {answers.map((answer) => (
                    <motion.div 
                      key={answer.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "rounded-2xl p-5 shadow-xl transition-colors",
                        isStealth 
                          ? "bg-neutral-50/50 ring-1 ring-neutral-200/50" 
                          : "bg-neutral-800/40 ring-1 ring-neutral-700/50"
                      )}
                    >
                      <div className="mb-3">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest",
                          isStealth ? "text-neutral-400" : "text-neutral-500"
                        )}>Question Detected</span>
                        <p className={cn(
                          "mt-1 font-semibold italic",
                          isStealth ? "text-neutral-600" : "text-neutral-300"
                        )}>"{answer.questionText}"</p>
                      </div>
                      <div className={cn(
                        "rounded-xl p-4 text-sm leading-relaxed border",
                        isStealth 
                          ? "bg-white text-neutral-800 border-neutral-200" 
                          : "bg-neutral-900/60 text-neutral-200 border-neutral-800"
                      )}>
                        {answer.answerText.split('\n').map((line, i) => (
                          <p key={i} className={cn(line.trim() === '' ? 'h-3' : 'mb-2')}>
                            {line}
                          </p>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-2">
                          {answer.tags?.map(tag => (
                            <span key={tag} className={cn(
                              "rounded-md px-2 py-0.5 text-[10px] font-bold border",
                              isStealth ? "bg-neutral-100 text-neutral-400 border-neutral-200" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            )}>{tag}</span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => navigator.clipboard.writeText(answer.answerText)}
                            className="text-neutral-500 hover:text-blue-400 transition-colors" 
                            title="Copy to Clipboard"
                          >
                            <Save size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {answers.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-neutral-600">
                      <div className="h-16 w-16 items-center justify-center rounded-3xl bg-neutral-900 flex border border-neutral-800">
                        <BrainCircuit size={32} className="opacity-20" />
                      </div>
                      <p className="text-sm italic">AI suggestions will appear here</p>
                    </div>
                  )}
                  <div ref={answersEndRef} />
                </div>

                {/* Footer: Manual Question Box */}
                <div className={cn(
                  "border-t p-4 transition-all",
                  isStealth ? "bg-white border-neutral-100" : "border-neutral-800 bg-neutral-900/50"
                )}>
                  <form onSubmit={handleManualSubmit} className="relative">
                    <input 
                      type="text" 
                      value={manualQuestion}
                      onChange={(e) => setManualQuestion(e.target.value)}
                      placeholder={isStealth ? "Type a note..." : "Manually ask a question to tailored resume/profile..."}
                      className={cn(
                        "input-field w-full pr-12 h-12 text-base",
                        isStealth ? "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder:text-neutral-300 shadow-none" : "bg-neutral-800"
                      )}
                    />
                    <button 
                      type="submit"
                      className={cn(
                        "absolute right-2 top-1.5 h-9 w-9 items-center justify-center rounded-lg transition-colors",
                        isStealth ? "bg-neutral-200 text-neutral-500 hover:bg-neutral-300" : "bg-blue-600 text-white hover:bg-blue-500"
                      )}
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="mx-auto max-w-4xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
             <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">My Career Profile</h2>
                  <p className="text-neutral-400">Tailor your AI Copilot to your expertise</p>
                </div>
                <div className="h-16 w-16 bg-blue-600/10 rounded-full flex items-center justify-center border border-blue-500/20 text-blue-400">
                  <User size={32} />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-neutral-300">LinkedIn Profile URL</label>
                  <input 
                    type="url" 
                    value={profile.linkedInUrl}
                    onChange={(e) => setProfile({...profile, linkedInUrl: e.target.value})}
                    placeholder="https://linkedin.com/in/username"
                    className="input-field w-full h-12 bg-neutral-900"
                  />
                  
                  <label className="block text-sm font-semibold text-neutral-300">Target Role</label>
                  <input 
                    type="text" 
                    value={profile.targetRole}
                    onChange={(e) => setProfile({...profile, targetRole: e.target.value})}
                    placeholder="e.g. Senior QA Engineer"
                    className="input-field w-full h-12 bg-neutral-900"
                  />

                  <label className="block text-sm font-semibold text-neutral-300">Key Skills (comma separated)</label>
                  <textarea 
                    value={profile.skills.join(', ')}
                    onChange={(e) => setProfile({...profile, skills: e.target.value.split(',').map(s => s.trim())})}
                    className="input-field w-full h-32 bg-neutral-900 resize-none pt-3"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-neutral-300">Resume Content (Paste or Upload)</label>
                  <div className="relative group">
                    <textarea 
                      value={profile.resumeText}
                      onChange={(e) => setProfile({...profile, resumeText: e.target.value})}
                      placeholder="Paste your resume content here for deep analysis..."
                      className="input-field w-full h-[324px] bg-neutral-900 resize-none font-mono text-xs pt-3"
                    />
                    <div className="absolute right-4 bottom-4">
                      <label className="primary-button bg-blue-600/80 hover:bg-blue-600 cursor-pointer">
                        <Download size={16} /> Load File
                        <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleResumeUpload} />
                      </label>
                    </div>
                  </div>
                </div>
             </div>

             <div className="flex justify-end pt-4">
                <button className="primary-button px-12 h-14 text-lg font-bold">SAVE PROFILE</button>
             </div>
          </div>
        )}

        {activeTab === 'mock' && (
          <div className="flex h-full w-full">
            <div className="flex-1 flex flex-col items-center justify-center p-8">
               <AnimatePresence mode="wait">
                {!isMockActive ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md text-center space-y-6"
                  >
                    <div className="mx-auto h-20 w-20 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
                      <GraduationCap size={48} />
                    </div>
                    <h2 className="text-2xl font-bold">Ace your next meeting</h2>
                    <p className="text-neutral-400">Start a mock interview tailored to your profile. The AI will ask questions and provide real-time feedback.</p>
                    <button onClick={startMockInterview} className="primary-button w-full h-14 text-lg">
                      START MOCK INTERVIEW
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex h-full w-full max-w-6xl gap-8 overflow-hidden">
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1 overflow-y-auto space-y-4 p-4">
                        {transcript.map(msg => (
                          <div key={msg.id} className={cn(
                            "p-4 rounded-2xl max-w-[80%]",
                            msg.speaker === 'interviewer' ? "bg-neutral-800 self-start" : "bg-blue-600 self-end ml-auto"
                          )}>
                            <p className="text-sm">{msg.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-neutral-800">
                         <div className="flex gap-2">
                           <button className={cn("glass-button px-6", isRecording ? "bg-red-600/20 text-red-400 border-red-500/50" : "bg-blue-600/20 text-blue-400 border-blue-500/50")}>
                             {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                             {isRecording ? "Stop Speaking" : "Answer Verbally"}
                           </button>
                           <input 
                            placeholder="Type your response..."
                            className="input-field flex-1"
                           />
                           <button className="primary-button h-10 w-10 p-0"><Send size={18} /></button>
                         </div>
                      </div>
                    </div>
                    <div className="w-80 panel-border rounded-3xl p-6 border bg-neutral-900">
                      <h3 className="font-bold mb-4">Interviewer Feedback</h3>
                      <div className="space-y-4">
                         <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                           <p className="text-xs font-bold text-green-400 mb-1 uppercase">Good Highlight</p>
                           <p className="text-xs text-neutral-400">Great mention of STAR method on the last question.</p>
                         </div>
                         <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                           <p className="text-xs font-bold text-amber-400 mb-1 uppercase">Tip</p>
                           <p className="text-xs text-neutral-400">Try to be more specific about your Selenium framework architecture.</p>
                         </div>
                      </div>
                    </div>
                  </div>
                )}
               </AnimatePresence>
            </div>
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="h-full w-full flex flex-col p-8 items-center overflow-y-auto">
             <div className="max-w-4xl w-full space-y-8">
               <div className="flex justify-between items-end">
                 <div>
                   <h2 className="text-3xl font-bold">{isWebPilot ? 'Web Assessment Pilot' : 'Online Assessment Practice'}</h2>
                   <p className="text-neutral-400">
                     {isWebPilot 
                       ? 'Analyze live web assessment questions and get instant solutions.' 
                       : 'Simulate real-world technical tasks and coding assessments.'}
                   </p>
                 </div>
                 <div className="flex gap-4">
                   <button 
                    onClick={() => setIsWebPilot(!isWebPilot)}
                    className={cn(
                      "glass-button",
                      isWebPilot ? "border-blue-500 text-blue-400" : ""
                    )}
                   >
                     {isWebPilot ? <LayoutDashboard size={16} /> : <Terminal size={16} />}
                     {isWebPilot ? 'Practice Mode' : 'Web Pilot Mode'}
                   </button>
                   <button className="primary-button"><Layers size={16} /> New {isWebPilot ? 'Analysis' : 'Task'}</button>
                 </div>
               </div>

               {isWebPilot ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="panel-border rounded-3xl p-6 border bg-neutral-900 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-neutral-400 uppercase">Question Input</h3>
                        <span className="text-[10px] text-neutral-600 font-bold">PASTE TEXT OR UPLOAD SCREENSHOT</span>
                      </div>
                      <textarea 
                        value={assessmentInput}
                        onChange={(e) => setAssessmentInput(e.target.value)}
                        placeholder="Paste the question text, options, or describe the problem here..."
                        className="input-field w-full h-80 text-sm font-mono leading-relaxed"
                      />
                      <div className="flex gap-2">
                        <label className="glass-button flex-1 cursor-pointer">
                          <Download size={14} /> Screen Data
                          <input type="file" className="hidden" accept="image/*" />
                        </label>
                        <button 
                          onClick={handleSolveAssessment}
                          disabled={isSolving || !assessmentInput}
                          className="primary-button flex-1"
                        >
                          {isSolving ? 'ANALYZING...' : 'SOLVE QUESTION'}
                        </button>
                      </div>
                    </div>

                    <div className="panel-border rounded-3xl p-6 border bg-neutral-950 flex flex-col">
                       <h3 className="font-bold text-sm text-neutral-400 uppercase mb-4">AI Recommendation</h3>
                       <div className="flex-1 overflow-y-auto space-y-4">
                          {assessmentResult ? (
                            <div className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                              {assessmentResult.split('\n').map((line, i) => {
                                if (line.startsWith('ANSWER:')) return <p key={i} className="text-green-400 font-bold mb-2">{line}</p>;
                                if (line.startsWith('ACTION:')) return <p key={i} className="text-blue-400 font-bold mb-2">{line}</p>;
                                return <p key={i} className="mb-1 text-neutral-300">{line}</p>;
                              })}
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-700 italic">
                               <Sparkles size={48} className="opacity-10 mb-4" />
                               <p>Input a question to generate a pilot solution.</p>
                            </div>
                          )}
                       </div>
                       {assessmentResult && (
                         <div className="mt-4 pt-4 border-t border-neutral-900 flex justify-end">
                            <button 
                              onClick={() => navigator.clipboard.writeText(assessmentResult)}
                              className="glass-button h-8"
                            >
                              <Save size={14} /> COPY SOLUTION
                            </button>
                         </div>
                       )}
                    </div>
                 </div>
               ) : (
                 <>
                   <div className="grid grid-cols-3 gap-6">
                     {[
                       { title: 'SQL Complexity', level: 'Easy', q: 10, type: 'Database' },
                       { title: 'Automation Logic', level: 'Medium', q: 15, type: 'Coding' },
                       { title: 'System Design', level: 'Hard', q: 5, type: 'Architecture' }
                     ].map((t, i) => (
                       <div key={i} className="panel-border rounded-3xl p-6 border bg-neutral-900 hover:ring-2 ring-blue-500/50 transition-all cursor-pointer">
                          <div className="flex justify-between items-start mb-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                              t.level === 'Easy' ? "bg-green-500/20 text-green-400" : t.level === 'Medium' ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
                            )}>{t.level}</span>
                            <ClipboardList size={20} className="text-neutral-600" />
                          </div>
                          <h4 className="font-bold text-lg">{t.title}</h4>
                          <p className="text-xs text-neutral-500 mt-1">{t.type} • {t.q} Questions</p>
                          <button className="mt-6 w-full glass-button py-2 border-dashed border-neutral-700 hover:border-neutral-500">START Practice</button>
                       </div>
                     ))}
                   </div>

                   <div className="panel-border rounded-3xl p-8 border bg-neutral-900 min-h-[400px]">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Question {assessmentStep + 1} of 15</p>
                          <p className="font-bold">Write a Selenium script to handle a dynamic dropdown that loads content via AJAX.</p>
                        </div>
                     </div>
                     <div className="h-64 bg-neutral-950 rounded-2xl border border-neutral-800 p-4 font-mono text-sm text-green-400">
                        <p className="opacity-50">// Type your code here...</p>
                        <p className="mt-2 animate-pulse">|</p>
                     </div>
                     <div className="flex justify-between mt-6">
                        <button className="glass-button">Skip</button>
                        <button className="primary-button px-8">Submit Answer</button>
                     </div>
                   </div>
                 </>
               )}
             </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="h-full w-full flex flex-col p-8 items-center overflow-y-auto">
             <div className="max-w-5xl w-full grid grid-cols-3 gap-8">
                <div className="col-span-1 space-y-6">
                   <div className="panel-border rounded-3xl p-6 border bg-neutral-900 space-y-6">
                      <h3 className="text-lg font-bold flex items-center gap-2"><Sparkles size={18} className="text-blue-400" /> Content Studio</h3>
                      
                      <div className="space-y-4">
                        <button 
                          onClick={() => handleDocumentGenerate('resume')}
                          className="w-full primary-button bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 justify-start h-14"
                        >
                          <FileCheck size={20} /> Improve Resume
                        </button>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-500 uppercase">Target Job Description</label>
                          <textarea 
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here..."
                            className="input-field w-full h-32 text-xs"
                          />
                          <button 
                            disabled={!jobDescription}
                            onClick={() => handleDocumentGenerate('cover-letter')}
                            className="w-full primary-button h-14"
                          >
                            <PenTool size={20} /> Generate Cover Letter
                          </button>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="col-span-2 space-y-6">
                    <div className="panel-border rounded-3xl p-8 border bg-neutral-950 min-h-[600px] flex flex-col relative">
                       <div className="flex items-center justify-between mb-6">
                         <h3 className="font-bold text-neutral-400 uppercase tracking-widest text-xs">Generated Output</h3>
                         <div className="flex gap-2">
                            <button className="glass-button h-8 w-8 p-0"><Download size={14} /></button>
                            <button className="glass-button h-8 w-8 p-0" onClick={() => navigator.clipboard.writeText(generatedDoc)}><Save size={14} /></button>
                         </div>
                       </div>
                       
                       {isGeneratingDoc ? (
                         <div className="flex-1 flex flex-col items-center justify-center gap-4">
                           <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                           <p className="text-neutral-500 font-medium">AI is crafting your document...</p>
                         </div>
                       ) : generatedDoc ? (
                         <div className="prose prose-invert max-w-none text-sm font-mono whitespace-pre-wrap leading-relaxed">
                            {generatedDoc}
                         </div>
                       ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 italic">
                            <FileCheck size={48} className="opacity-10 mb-4" />
                            <p>Select an option on the left to start generating.</p>
                         </div>
                       )}
                    </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto">
            <div className="flex justify-between items-end">
               <div>
                  <h2 className="text-3xl font-bold">Interview Analytics & Reports</h2>
                  <p className="text-neutral-400">Comprehensive breakdown of your past performances.</p>
               </div>
               <div className="flex gap-2">
                 <button className="glass-button text-xs">Export PDF</button>
                 <button className="glass-button text-xs">Share Report</button>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
               <div className="col-span-2 panel-border rounded-3xl p-8 border bg-neutral-900 border-neutral-800">
                  <h3 className="font-bold mb-6">Skill Mastery Heatmap</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {['Selenium', 'Java', 'SQL', 'Automation', 'API Testing', 'Performance', 'Agile', 'Soft Skills'].map(s => (
                      <div key={s} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase text-neutral-500">
                          <span>{s}</span>
                          <span>{Math.floor(Math.random() * 40) + 60}%</span>
                        </div>
                        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12 h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_ANALYTICS_DATA}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                          <XAxis dataKey="name" stroke="#525252" fontSize={10} />
                          <YAxis stroke="#525252" fontSize={10} />
                          <RechartsTooltip contentStyle={{ background: '#171717', border: '1px solid #262626' }} />
                          <Bar dataKey="technical" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="clarity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div className="panel-border rounded-3xl p-8 border bg-neutral-900 flex flex-col gap-8">
                  <div>
                    <h3 className="font-bold mb-4">Improvement Focus</h3>
                    <div className="space-y-3">
                      {[
                        { t: "Deep dive into PyTest fixtures", i: "CRITICAL" },
                        { t: "K8s basic troubleshooting", i: "HIGH" },
                        { t: "NFR metrics definition", i: "MED" }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700">
                          <p className="text-xs font-bold text-neutral-300 mb-1">{item.t}</p>
                          <span className={cn(
                            "text-[8px] px-1.5 py-0.5 rounded font-black",
                            item.i === 'CRITICAL' ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                          )}>{item.i}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-neutral-800 text-center">
                    <p className="text-4xl font-black text-blue-500">A-</p>
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-2">Current Grade</p>
                    <p className="text-[10px] text-neutral-400 mt-4 leading-relaxed">You are in the top 15% of candidates for ${profile.targetRole} role simulations.</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>

        {/* AI Mode Status */}
        {(!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') && (
        <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-blue-600/10 backdrop-blur-md p-4 text-blue-400 shadow-2xl flex items-center gap-3 border border-blue-500/50">
          <Sparkles size={24} className="animate-pulse" />
          <div>
            <p className="font-bold text-xs uppercase tracking-widest">Demo Mode Active</p>
            <p className="text-[10px] font-medium opacity-80">Local simulations providing responses.</p>
          </div>
        </div>
      )}
    </div>
  );
}

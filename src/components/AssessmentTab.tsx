import React, { useState } from "react";
import {
  LayoutDashboard,
  Terminal,
  Layers,
  Download,
  Sparkles,
} from "lucide-react";
import { cn } from "../lib/utils";

export const AssessmentTab = ({ profile, solveAssessmentQuestion }: any) => {
  const [isWebPilot, setIsWebPilot] = useState(false);
  const [assessmentInput, setAssessmentInput] = useState("");
  const [assessmentResult, setAssessmentResult] = useState("");
  const [isSolving, setIsSolving] = useState(false);
  const [assessmentStep, setAssessmentStep] = useState(0);

  const handleSolveAssessment = async () => {
    if (!assessmentInput.trim()) return;
    setIsSolving(true);
    const result = await solveAssessmentQuestion(assessmentInput, profile);
    setAssessmentResult(result);
    setIsSolving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSolving(true);
      // Simulating OCR for image parsing
      setTimeout(() => {
        setAssessmentInput(
          "Parsed screen data:\nQuestion: What is a key benefit of using Tailwind CSS?\nOptions:\nA) No utility classes\nB) Rapid styling directly in markup\nC) Built-in database connection\nD) Requires separate CSS files per component",
        );
        setIsSolving(false);
      }, 1500);
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-8 items-center overflow-y-auto">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold">
              {isWebPilot
                ? "Web Assessment Pilot"
                : "Online Assessment Practice"}
            </h2>
            <p className="text-neutral-400">
              {isWebPilot
                ? "Analyze live web assessment questions and get instant solutions."
                : "Simulate real-world technical tasks and coding assessments."}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsWebPilot(!isWebPilot)}
              className={
                "glass-button " +
                (isWebPilot ? "border-blue-500 text-blue-400" : "")
              }
            >
              {isWebPilot ? (
                <LayoutDashboard size={16} />
              ) : (
                <Terminal size={16} />
              )}
              {isWebPilot ? "Practice Mode" : "Web Pilot Mode"}
            </button>
            <button className="primary-button">
              <Layers size={16} /> New {isWebPilot ? "Analysis" : "Task"}
            </button>
          </div>
        </div>

        {isWebPilot ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="panel-border rounded-3xl p-6 border bg-neutral-900 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-neutral-400 uppercase">
                  Question Input
                </h3>
                <span className="text-[10px] text-neutral-600 font-bold">
                  PASTE TEXT OR UPLOAD SCREENSHOT
                </span>
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
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                <button
                  onClick={handleSolveAssessment}
                  disabled={isSolving || !assessmentInput}
                  className="primary-button flex-1"
                >
                  {isSolving ? "ANALYZING..." : "SOLVE QUESTION"}
                </button>
              </div>
            </div>

            <div className="panel-border rounded-3xl p-6 border bg-neutral-950 flex flex-col">
              <h3 className="font-bold text-sm text-neutral-400 uppercase mb-4">
                AI Recommendation
              </h3>
              <div className="flex-1 overflow-y-auto space-y-4">
                {assessmentResult ? (
                  <div className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                    {assessmentResult.split("\n").map((line, i) => {
                      if (line.startsWith("ANSWER:"))
                        return (
                          <p key={i} className="text-green-400 font-bold mb-2">
                            {line}
                          </p>
                        );
                      if (line.startsWith("ACTION:"))
                        return (
                          <p key={i} className="text-blue-400 font-bold mb-2">
                            {line}
                          </p>
                        );
                      return (
                        <p key={i} className="mb-1 text-neutral-300">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-700 italic">
                    <Sparkles size={48} className="opacity-10 mb-4" />
                    <p>Input a question to generate a pilot solution.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="panel-border rounded-3xl p-8 border bg-neutral-900 text-center max-w-2xl mx-auto space-y-6">
              <div className="mx-auto h-20 w-20 rounded-xl bg-neutral-800 flex items-center justify-center">
                <Terminal size={32} className="text-neutral-500" />
              </div>
              <h3 className="text-2xl font-bold">Start Practice Assessment</h3>
              <p className="text-neutral-400">
                Choose a topic to simulate a timed, multi-part task.
              </p>

              <div className="grid grid-cols-2 gap-4 text-left">
                {[
                  "Software QA Testing",
                  "Selenium & Playwright",
                  "API Testing (Postman/RestAssured)",
                  "Agile Scrum Methodologies",
                  "Java & Typescript Fundamentals",
                  "SQL & Databases",
                ].map((t, i) => (
                  <button
                    key={i}
                    className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-blue-500 hover:bg-neutral-800 transition-colors"
                  >
                    <h4 className="font-bold text-sm mb-1 text-white">{t}</h4>
                    <p className="text-xs text-neutral-500">
                      20 Mins · 5 Tasks
                    </p>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-neutral-500 italic mt-4">
                Option to answer questions with audio will be available in the
                test.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

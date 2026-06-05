import React from "react";
import {
  Play,
  GraduationCap,
  Video,
  Users,
  Monitor,
  BarChart3,
  PenTool,
  BookOpen,
  Layers,
  Terminal,
} from "lucide-react";
import { cn } from "../lib/utils";

export const Home = ({
  setActiveTab,
  currentUser,
}: {
  setActiveTab: (tab: any) => void;
  currentUser?: any;
}) => {
  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h2 className="text-4xl font-bold mb-8">
            Good afternoon, {currentUser?.fullName?.split(" ")[0] || "User"}
          </h2>

          <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-blue-900/20 border border-neutral-800 rounded-3xl p-8 relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center cursor-pointer">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Land your dream job with Verve AI
                </h3>
                <p className="text-neutral-400 mb-6">
                  Follow our 3-step playbook: upload your resume, run a mock,
                  then launch Copilot in your real interview.
                </p>
                <button className="glass-button text-sm bg-black/40 hover:bg-black/60">
                  Quickstart guide <span className="ml-2">↗</span>
                </button>
              </div>
              <div className="space-y-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-4 text-sm font-medium">
                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </div>
                  Upload resume
                </div>
                <div
                  className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-4 text-sm font-medium cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => setActiveTab("mock")}
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </div>
                  Run a mock
                </div>
                <div
                  className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-4 text-sm font-medium cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => setActiveTab("live")}
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </div>
                  Launch Copilot
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setActiveTab("live")}
            className="bg-blue-600 hover:bg-blue-500 transition-colors rounded-3xl p-6 text-left flex items-start gap-4 group"
          >
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Play size={24} className="text-white fill-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Start Interview Copilot
              </h3>
              <p className="text-blue-100 text-sm">
                Launch the real-time AI assistant for your live interview
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("mock")}
            className="bg-neutral-800 hover:bg-neutral-700 transition-colors border border-neutral-700 rounded-3xl p-6 text-left flex items-start gap-4"
          >
            <div className="h-12 w-12 rounded-xl bg-neutral-700 flex items-center justify-center shrink-0">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Start AI Mock Interview
              </h3>
              <p className="text-neutral-400 text-sm">
                Practice with an AI interviewer tailored to your job description
              </p>
            </div>
          </button>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">
            Quick Launch Platforms
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() =>
                window.open("https://zoom.us/join", "_blank", "noreferrer")
              }
              className="panel-border rounded-2xl p-4 flex items-center gap-3 hover:bg-neutral-800 transition-colors"
            >
              <Video size={20} className="text-blue-400" />
              <span className="font-semibold text-sm">Zoom</span>
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://teams.microsoft.com",
                  "_blank",
                  "noreferrer",
                )
              }
              className="panel-border rounded-2xl p-4 flex items-center gap-3 hover:bg-neutral-800 transition-colors"
            >
              <Users size={20} className="text-purple-400" />
              <span className="font-semibold text-sm">Microsoft Teams</span>
            </button>
            <button
              onClick={() =>
                window.open("https://meet.google.com", "_blank", "noreferrer")
              }
              className="panel-border rounded-2xl p-4 flex items-center gap-3 hover:bg-neutral-800 transition-colors"
            >
              <Monitor size={20} className="text-green-400" />
              <span className="font-semibold text-sm">Google Meet</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">
            All Features
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                id: "profiles",
                icon: <Users size={18} />,
                label: "Interview Profiles",
              },
              {
                id: "assessment",
                icon: <Terminal size={18} />,
                label: "Web Test",
              },
              {
                id: "question-bank",
                icon: <BookOpen size={18} />,
                label: "Question Bank",
              },
              {
                id: "knowledge-base",
                icon: <Layers size={18} />,
                label: "Knowledge Base",
              },
              {
                id: "reports",
                icon: <BarChart3 size={18} />,
                label: "Interview Reports",
              },
              { id: "tools", icon: <PenTool size={18} />, label: "AI Tools" },
            ].map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className="panel-border rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-neutral-800 transition-colors text-center"
              >
                <div className="text-neutral-400">{feature.icon}</div>
                <span className="font-semibold text-xs text-neutral-300">
                  {feature.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel-border rounded-3xl border bg-neutral-950 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-neutral-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500">
              Past Interviews
            </h3>
            <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
              <button className="px-3 py-1 text-xs font-bold rounded-md bg-neutral-700 text-white">
                Copilot 15
              </button>
              <button className="px-3 py-1 text-xs font-bold rounded-md text-neutral-400 hover:text-white">
                Mock 1
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <h4 className="text-xs font-medium text-neutral-500 mb-4">
                Today
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-neutral-900 transition-colors group cursor-pointer border border-transparent hover:border-neutral-800">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-neutral-400">
                      2
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">2026 QA</p>
                      <p className="text-xs text-neutral-500">QA Engineer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-400">
                        Score: 92/100
                      </p>
                      <p className="text-xs text-neutral-500">1:51 PM</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-neutral-900 transition-colors group cursor-pointer border border-transparent hover:border-neutral-800">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-neutral-400">
                      R
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">
                        Rooms To Go
                      </p>
                      <p className="text-xs text-neutral-500">Sr QA Engineer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-400">
                        Score: 78/100
                      </p>
                      <p className="text-xs text-neutral-500">1:07 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium text-neutral-500 mb-4">
                Yesterday
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-neutral-900 transition-colors group cursor-pointer border border-transparent hover:border-neutral-800">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-neutral-400">
                      2
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">2026 QA</p>
                      <p className="text-xs text-neutral-500">QA Engineer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-400">
                        Score: 88/100
                      </p>
                      <p className="text-xs text-neutral-500">1:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

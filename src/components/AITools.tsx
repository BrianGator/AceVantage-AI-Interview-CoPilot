import React from "react";
import {
  PenTool,
  Layers,
  BookOpen,
  User,
  Terminal,
  Mail,
  FileText,
  CheckCircle,
} from "lucide-react";
import { cn } from "../lib/utils";

export const AITools = () => {
  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <h2 className="text-3xl font-bold mb-8">AI Tools</h2>

      <div className="space-y-12 max-w-6xl mx-auto">
        <section>
          <h3 className="text-xl font-semibold mb-2 text-neutral-300">
            Interview Tools
          </h3>
          <p className="text-neutral-500 mb-6 text-sm">
            Core tools for organizing your interview materials and personal
            context
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              icon={<FileText />}
              title="Resume Library"
              desc="Manage your uploaded resumes"
            />
            <ToolCard
              icon={<PenTool />}
              title="Resume Builder"
              badge="JD"
              desc="Edit your master resume or tailor a new one from a job description."
            />
            <ToolCard
              icon={<BookOpen />}
              title="Cheatsheet"
              badge="STAR NOTES"
              desc="Create private notes for your interview"
            />
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2 text-neutral-300">
            Interview Preparation
          </h3>
          <p className="text-neutral-500 mb-6 text-sm">
            Tools to help you prepare for interviews and organize your materials
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              icon={<span className="font-bold text-xl">?</span>}
              title="Questions For Interviewers"
              desc="Create questions to ask interviewers and save to your cheatsheet"
              badge="5 QUESTIONS"
            />
            <ToolCard
              icon={<Layers />}
              title="Interview Flashcards"
              desc="Create AI-generated flashcards to help you prepare for interviews"
              badge="Q · 2/24"
            />
            <ToolCard
              icon={<Terminal />}
              title="Old Question Bank"
              desc="Access the legacy question bank and migrate your saved lists to Question Bank V2"
              badge="ARCHIVE · V1"
            />
            <ToolCard
              icon={<User />}
              title="LinkedIn Mock Interview"
              desc="Create mock interview from LinkedIn job posts"
              badge="Senior Product Engineer"
            />
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2 text-neutral-300">
            Career Tools
          </h3>
          <p className="text-neutral-500 mb-6 text-sm">
            AI-powered tools to help you advance your career and create
            professional documents
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              icon={<FileText />}
              title="Cover Letter"
              desc="Generate and edit cover letters from interview profile job context."
              badge="04/22"
            />
            <ToolCard
              icon={<Mail />}
              title="Outreach Email"
              desc="Generate recruiter outreach messages from the selected interview profile."
              badge="New message"
            />
            <ToolCard
              icon={<CheckCircle />}
              title="Resume JD Match"
              desc="Compare resume keywords against interview profile job descriptions."
              badge="JD"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const ToolCard = ({
  icon,
  title,
  desc,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}) => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 hover:bg-neutral-800 transition-all cursor-pointer group shadow-lg">
    <div className="flex justify-between items-start mb-6">
      <div className="h-12 w-12 rounded-xl bg-neutral-800 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
        {icon}
      </div>
      {badge && (
        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
          {badge}
        </span>
      )}
    </div>
    <h4 className="font-bold text-xl mb-2">{title}</h4>
    <p className="text-sm text-neutral-400 leading-relaxed">{desc}</p>
  </div>
);

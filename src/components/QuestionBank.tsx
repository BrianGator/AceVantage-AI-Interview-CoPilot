import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../lib/utils";

export const QuestionBank = () => {
  const collections = [
    { title: "Top 50 Behavioral", count: 50, badge: "50" },
    { title: "Coding Essentials", count: 75, badge: "75" },
    { title: "System Design 101", count: 25, badge: "101" },
    { title: "Product Sense", count: 25, badge: "PM" },
    { title: "Data & ML", count: 25, badge: "ML" },
    { title: "AI Engineering", count: 25, badge: "AI" },
    { title: "Management & Leadership", count: 25, badge: "MGR" },
    { title: "Case Interview", count: 25, badge: "CASE" },
  ];

  const types = [
    { name: "Software QA Testing", count: 1143 },
    { name: "Selenium Test Automation", count: 1665 },
    { name: "Playwright Test Automation", count: 195 },
    { name: "Cypress Test Automation", count: 450 },
    { name: "API Testing", count: 481 },
    { name: "Java", count: 155 },
    { name: "Typescript", count: 918 },
    { name: "Azure Devops", count: 139 },
    { name: "Jira", count: 94 },
  ];

  const companies = [
    { name: "Amazon", count: 2282 },
    { name: "Google", count: 1960 },
    { name: "Meta", count: 1540 },
    { name: "Microsoft", count: 1522 },
    { name: "Bloomberg", count: 1079 },
    { name: "TCS", count: 768 },
    { name: "Apple", count: 464 },
    { name: "Tiktok", count: 423 },
  ];

  const sampleQuestions = [
    {
      q: "What is the difference between implicitly_wait() and explicit wait in Selenium?",
      a: "Implicit wait sets a default wait time for all elements across the driver session, while explicit wait applies to a specific element until a certain condition is met (e.g., elementToBeClickable).",
    },
    {
      q: "Explain the architecture of Playwright and how it differs from Selenium.",
      a: "Playwright uses a WebSocket connection to communicate directly with the browser engines (Chromium, Firefox, WebKit) in an event-driven way, whereas Selenium uses the WebDriver protocol (HTTP requests) which can be slower and more prone to flakiness.",
    },
  ];

  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-900 to-neutral-900"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              Interview Vault
            </h2>
            <p className="text-neutral-400 text-lg max-w-xl mx-auto">
              5,000+ real interview questions from top companies. Sourced from
              candidate reports, updated daily.
            </p>
            <div className="mt-8 max-w-2xl mx-auto relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search questions by topic, company, or role..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-colors shadow-2xl"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">
                Select by Type
              </h3>
              <div className="space-y-2">
                {types.map((t) => (
                  <button
                    key={t.name}
                    className="w-full flex items-center justify-between py-2 text-sm text-neutral-400 hover:text-white transition-colors group"
                  >
                    <span>{t.name}</span>
                    <span className="bg-neutral-800 group-hover:bg-neutral-700 px-2 py-0.5 rounded text-[10px]">
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">
                Select by Company
              </h3>
              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search companies..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-9 pr-3 text-sm outline-none"
                />
              </div>
              <div className="space-y-2">
                {companies.map((c) => (
                  <button
                    key={c.name}
                    className="w-full flex items-center justify-between py-2 text-sm text-neutral-400 hover:text-white transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-neutral-800 flex items-center justify-center font-bold text-[10px] text-white">
                        {c.name.substring(0, 1)}
                      </div>
                      <span>{c.name}</span>
                    </div>
                    <span className="text-[10px]">{c.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Curated Collections</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {collections.map((c) => (
                  <div
                    key={c.title}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 hover:border-neutral-600 cursor-pointer transition-colors"
                  >
                    <div className="h-10 w-10 bg-neutral-800 rounded-xl mb-3 flex items-center justify-center text-xs font-bold text-blue-400">
                      {c.badge}
                    </div>
                    <h4 className="font-bold text-sm mb-1">{c.title}</h4>
                    <p className="text-xs text-neutral-500">
                      {c.count} questions
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Sample QA Questions</h3>
              <div className="space-y-4">
                {sampleQuestions.map((sq, i) => (
                  <div
                    key={i}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
                  >
                    <h4 className="font-bold text-lg mb-4">{sq.q}</h4>
                    {expandedQ === i ? (
                      <div className="mt-4 pt-4 border-t border-neutral-800 animate-in fade-in slide-in-from-top-2">
                        <p className="text-sm text-neutral-300 leading-relaxed">
                          {sq.a}
                        </p>
                        <button
                          onClick={() => setExpandedQ(null)}
                          className="mt-4 text-xs font-bold text-neutral-500 hover:text-neutral-300 flex items-center gap-1"
                        >
                          Hide Answer <ChevronUp size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setExpandedQ(i)}
                        className="text-xs font-bold bg-blue-600/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600/30 transition-colors flex items-center gap-2"
                      >
                        Show Answer <ChevronDown size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

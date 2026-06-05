import React from "react";
import { Search, FileText } from "lucide-react";
import { cn } from "../lib/utils";

export const InterviewReports = () => {
  const mockReports = [
    {
      id: 1,
      profile: "2026 QA",
      position: "QA Engineer",
      type: "Mock",
      domain: "Software Engineering",
      date: "38 minutes ago",
      duration: "1.1 minutes",
    },
    {
      id: 2,
      profile: "2026 QA",
      position: "QA Engineer",
      type: "Live",
      domain: "General Interview",
      date: "41 minutes ago",
      duration: "2.3 minutes",
    },
    {
      id: 3,
      profile: "Rooms To Go",
      position: "Sr QA Engineer",
      type: "Live",
      domain: "General Interview",
      date: "1 hour ago",
      duration: "18.6 minutes",
    },
    {
      id: 4,
      profile: "2026 QA",
      position: "QA Engineer",
      type: "Live",
      domain: "General Interview",
      date: "yesterday",
      duration: "90 minutes",
    },
  ];

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold">Interview Reports</h2>
              <span className="bg-blue-600/20 text-blue-400 font-bold px-3 py-1 rounded-full text-sm">
                16
              </span>
            </div>
            <p className="text-neutral-400">
              Review transcripts, metrics, and actionable feedback from your
              sessions.
            </p>
          </div>
        </div>

        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by company or role..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500">
                <th className="p-6 font-semibold">Interview Profile</th>
                <th className="p-6 font-semibold">Type</th>
                <th className="p-6 font-semibold">Domain</th>
                <th className="p-6 font-semibold">Date</th>
                <th className="p-6 font-semibold">Duration</th>
                <th className="p-6 font-semibold">Report</th>
              </tr>
            </thead>
            <tbody>
              {mockReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-neutral-800/50 hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                >
                  <td className="p-6">
                    <div className="font-bold text-white mb-1">
                      {report.profile}
                    </div>
                    <div className="text-sm text-neutral-400">
                      {report.position}
                    </div>
                  </td>
                  <td className="p-6 text-sm">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                        report.type === "Live"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                      )}
                    >
                      {report.type}
                    </span>
                  </td>
                  <td className="p-6 text-sm text-neutral-300">
                    {report.domain}
                  </td>
                  <td className="p-6 text-sm text-neutral-400">
                    {report.date}
                  </td>
                  <td className="p-6 text-sm text-neutral-400">
                    {report.duration}
                  </td>
                  <td className="p-6">
                    <button className="h-8 w-12 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

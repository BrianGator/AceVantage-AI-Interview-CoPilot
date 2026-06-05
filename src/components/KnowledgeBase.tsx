import React from "react";
import { Upload, File, Trash2 } from "lucide-react";

export const KnowledgeBase = () => {
  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Teach your copilot what only you know
          </h2>
          <p className="text-neutral-400">
            Add behavioral stories, company research, or interview notes. Verve
            pulls from them live so answers sound like you.
          </p>
        </div>

        <div className="border-2 border-dashed border-neutral-700 bg-neutral-900/50 rounded-3xl p-12 text-center hover:border-blue-500 hover:bg-neutral-800 transition-all cursor-pointer group">
          <div className="h-20 w-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 group-hover:scale-110 transition-transform">
            <Upload size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Upload Knowledge Documents</h3>
          <p className="text-neutral-500 text-sm mb-6 max-w-sm mx-auto">
            Supports PDF, DOCX, TXT, and Markdown files up to 10MB.
          </p>
          <button className="primary-button px-8 h-12">Browse Files</button>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.txt,.docx,.md"
            multiple
          />
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Uploaded Documents</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400">
                  <File size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">My_STAR_Stories.pdf</p>
                  <p className="text-xs text-neutral-500">
                    140 KB · Uploaded 2 days ago
                  </p>
                </div>
              </div>
              <button className="text-neutral-500 hover:text-red-400 p-2">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400">
                  <File size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Company_Research_Acme.txt</p>
                  <p className="text-xs text-neutral-500">
                    12 KB · Uploaded 1 week ago
                  </p>
                </div>
              </div>
              <button className="text-neutral-500 hover:text-red-400 p-2">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

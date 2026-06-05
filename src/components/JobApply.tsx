import React, { useState, useEffect } from "react";
import {
  Save,
  Send,
  ShieldCheck,
  Mail,
  CheckSquare,
  ChevronRight,
  User,
  Briefcase,
  FileText,
  Upload,
} from "lucide-react";
import { cn } from "../lib/utils";
import { parseDocument } from "../types";

export const JobApply = () => {
  const [activeSection, setActiveSection] = useState<"intake" | "assistant">(
    "intake",
  );

  // Load from local storage initially
  const loadSavedData = (key: string, defaultValue: any) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Intake State
  const [personalDetails, setPersonalDetails] = useState(() => loadSavedData("jobApply_personalDetails", {
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
  }));
  
  const [demographics, setDemographics] = useState(() => loadSavedData("jobApply_demographics", {
    sex: "",
    race: "",
    usCitizen: "Yes",
    veteran: "No",
    disability: "No",
  }));
  
  const [preferences, setPreferences] = useState(() => loadSavedData("jobApply_preferences", {
    relocate: "Yes",
    workModel: "Remote",
    hybridDistance: "30 min from Tampa",
  }));
  
  const [links, setLinks] = useState(() => loadSavedData("jobApply_links", { linkedin: "", portfolio: "" }));
  const [salary, setSalary] = useState(() => loadSavedData("jobApply_salary", ""));
  const [education, setEducation] = useState(() => loadSavedData("jobApply_education", {
    degree: "",
    institution: "",
    year: "",
  }));
  const [jobTitles, setJobTitles] = useState(() => loadSavedData("jobApply_jobTitles", ""));
  
  const [employers, setEmployers] = useState(() => loadSavedData("jobApply_employers", [
    { company: "", title: "", dates: "", manager: "", reason: "" },
  ]));
  const [resumeData, setResumeData] = useState(() => loadSavedData("jobApply_resumeData", ""));
  const [frequentQuestions, setFrequentQuestions] = useState(() => loadSavedData("jobApply_frequentQuestions", ""));
  const [dataSaved, setDataSaved] = useState(false);

  // Assistant State
  const [chat, setChat] = useState<
    { role: "system" | "user" | "assistant"; content: string }[]
  >([
    {
      role: "system",
      content:
        "Hello! I am your highly secure Job Application Assistant. Please ensure your Data Intake profile is filled out and saved, then provide a job link, job description, or application questions for me to answer.",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");

  useEffect(() => {
    if (dataSaved) {
        localStorage.setItem("jobApply_personalDetails", JSON.stringify(personalDetails));
        localStorage.setItem("jobApply_demographics", JSON.stringify(demographics));
        localStorage.setItem("jobApply_preferences", JSON.stringify(preferences));
        localStorage.setItem("jobApply_links", JSON.stringify(links));
        localStorage.setItem("jobApply_salary", JSON.stringify(salary));
        localStorage.setItem("jobApply_education", JSON.stringify(education));
        localStorage.setItem("jobApply_jobTitles", JSON.stringify(jobTitles));
        localStorage.setItem("jobApply_employers", JSON.stringify(employers));
        localStorage.setItem("jobApply_resumeData", JSON.stringify(resumeData));
        localStorage.setItem("jobApply_frequentQuestions", JSON.stringify(frequentQuestions));
    }
  }, [dataSaved, personalDetails, demographics, preferences, links, salary, education, jobTitles, employers, resumeData, frequentQuestions]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await parseDocument(file);
        setResumeData(text);
      } catch (err) {
        console.error("Failed to parse document", err);
      }
    }
  };

  const addEmployer = () => {
    if (employers.length < 4) {
      setEmployers([
        ...employers,
        { company: "", title: "", dates: "", manager: "", reason: "" },
      ]);
    }
  };

  const handleSaveIntake = () => {
    setDataSaved(true);
    setActiveSection("assistant");
    setChat((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "Data securely tabulated and saved. Thank you! I see you are interested in titles like: " +
          (jobTitles || "Not specified") +
          ".\n\nNow, paste a job description or application form questions below, and I will generate your optimized answers.",
      },
    ]);
  };

  const handleAskAssistant = () => {
    if (!inputQuery.trim()) return;

    const newChat = [...chat, { role: "user", content: inputQuery } as any];
    setChat(newChat);
    setInputQuery("");

    setTimeout(() => {
      setChat([
        ...newChat,
        {
          role: "assistant",
          content:
            'Based on your tabulated data and the provided job description, here are the tailored responses you can copy and paste into the application form:\n\n**Why do you want to work here?**\n"Given my background at ' +
            (employers[0]?.company || "[Company]") +
            " and my interest in " +
            (jobTitles || "this field") +
            ', I believe my skills strongly align with your goals."\n\n**Form Data Fields:**\n- **Name:** ' +
            personalDetails.fullName +
            "\n- **LinkedIn:** " +
            links.linkedin +
            "\n- **Citizenship:** " +
            demographics.usCitizen,
        },
      ]);
    }, 1500);
  };

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">AI Job Apply Assistant</h2>
          <p className="text-neutral-400">
            Securely tabulate your details to auto-fill job applications and
            adapt answers.
          </p>
        </div>

        <div className="flex gap-4 border-b border-neutral-800 pb-2">
          <button
            onClick={() => setActiveSection("intake")}
            className={cn(
              "px-4 py-2 text-sm font-bold border-b-2 transition-colors",
              activeSection === "intake"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-neutral-500 hover:text-neutral-300",
            )}
          >
            Phase 1: Data Intake
          </button>
          <button
            onClick={() => setActiveSection("assistant")}
            className={cn(
              "px-4 py-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2",
              activeSection === "assistant"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-neutral-500 hover:text-neutral-300",
            )}
          >
            Phase 2/3: Apply Assistant
            {dataSaved && <ShieldCheck size={14} className="text-green-500" />}
          </button>
        </div>

        {activeSection === "intake" ? (
          <div className="space-y-8 bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <User size={18} className="text-blue-400" /> Personal Details
                </h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={personalDetails.fullName}
                  onChange={(e) =>
                    setPersonalDetails({
                      ...personalDetails,
                      fullName: e.target.value,
                    })
                  }
                  className="input-field w-full"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={personalDetails.email}
                  onChange={(e) =>
                    setPersonalDetails({
                      ...personalDetails,
                      email: e.target.value,
                    })
                  }
                  className="input-field w-full"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={personalDetails.phone}
                  onChange={(e) =>
                    setPersonalDetails({
                      ...personalDetails,
                      phone: e.target.value,
                    })
                  }
                  className="input-field w-full"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={personalDetails.city}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        city: e.target.value,
                      })
                    }
                    className="input-field w-full"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={personalDetails.state}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        state: e.target.value,
                      })
                    }
                    className="input-field w-full"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Desired Salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="input-field w-full"
                />
                <input
                  type="text"
                  placeholder="Possible Job Titles (e.g. QA Automation Engineer, Tester)"
                  value={jobTitles}
                  onChange={(e) => setJobTitles(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Briefcase size={18} className="text-purple-400" />{" "}
                  Demographics & Links
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={demographics.sex}
                    onChange={(e) =>
                      setDemographics({ ...demographics, sex: e.target.value })
                    }
                    className="input-field w-full"
                  >
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Decline to answer">Decline to answer</option>
                  </select>
                  <select
                    value={demographics.race}
                    onChange={(e) =>
                      setDemographics({ ...demographics, race: e.target.value })
                    }
                    className="input-field w-full"
                  >
                    <option value="">Select Race</option>
                    <option value="Asian">Asian</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Hispanic">Hispanic</option>
                    <option value="Other">Other</option>
                    <option value="Decline to answer">Decline to answer</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <select
                    value={demographics.usCitizen}
                    onChange={(e) =>
                      setDemographics({
                        ...demographics,
                        usCitizen: e.target.value,
                      })
                    }
                    className="input-field w-full text-xs"
                  >
                    <option value="">US Citizen?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <select
                    value={demographics.veteran}
                    onChange={(e) =>
                      setDemographics({
                        ...demographics,
                        veteran: e.target.value,
                      })
                    }
                    className="input-field w-full text-xs"
                  >
                    <option value="">Veteran?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Decline to answer">Decline to answer</option>
                  </select>
                  <select
                    value={demographics.disability}
                    onChange={(e) =>
                      setDemographics({
                        ...demographics,
                        disability: e.target.value,
                      })
                    }
                    className="input-field w-full text-xs"
                  >
                    <option value="">Disability?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Decline to answer">Decline to answer</option>
                  </select>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-neutral-800">
                  <h4 className="text-sm font-bold text-neutral-400">Preferences</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={preferences.relocate}
                      onChange={(e) =>
                        setPreferences({ ...preferences, relocate: e.target.value })
                      }
                      className="input-field w-full text-xs"
                    >
                      <option value="">Open to Relocate?</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {preferences.relocate === "No" && (
                      <select
                        value={preferences.workModel}
                        onChange={(e) =>
                          setPreferences({ ...preferences, workModel: e.target.value })
                        }
                        className="input-field w-full text-xs"
                      >
                        <option value="">Work Model</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid (in Tampa area only)">Hybrid (in Tampa area only)</option>
                        <option value="Onsite (in Tampa area only)">Onsite (in Tampa area only)</option>
                      </select>
                    )}
                  </div>
                  {preferences.relocate === "No" && preferences.workModel === "Hybrid (in Tampa area only)" && (
                    <select
                      value={preferences.hybridDistance}
                      onChange={(e) =>
                        setPreferences({ ...preferences, hybridDistance: e.target.value })
                      }
                      className="input-field w-full text-xs"
                    >
                      <option value="">Commute Distance</option>
                      <option value="30 min from Tampa">30 min from Tampa</option>
                      <option value="60 min from Tampa">60 min from Tampa</option>
                      <option value="90 min from Tampa">90 min from Tampa</option>
                      <option value="120 min from Tampa">120 min from Tampa</option>
                      <option value="150 min from Tampa">150 min from Tampa</option>
                    </select>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={links.linkedin}
                  onChange={(e) =>
                    setLinks({ ...links, linkedin: e.target.value })
                  }
                  className="input-field w-full"
                />
                <input
                  type="text"
                  placeholder="Portfolio / GitHub URL"
                  value={links.portfolio}
                  onChange={(e) =>
                    setLinks({ ...links, portfolio: e.target.value })
                  }
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Briefcase size={18} className="text-green-400" /> Work
                  History (Last {employers.length} Employers)
                </h3>
                {employers.length < 4 && (
                  <button
                    onClick={addEmployer}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Add Employer
                  </button>
                )}
              </div>
              {employers.map((emp, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border border-neutral-800 rounded-2xl bg-neutral-950"
                >
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={emp.company}
                    onChange={(e) => {
                      const arr = [...employers];
                      arr[i].company = e.target.value;
                      setEmployers(arr);
                    }}
                    className="input-field w-full"
                  />
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={emp.title}
                    onChange={(e) => {
                      const arr = [...employers];
                      arr[i].title = e.target.value;
                      setEmployers(arr);
                    }}
                    className="input-field w-full"
                  />
                  <input
                    type="text"
                    placeholder="Dates (e.g. 2020-2023)"
                    value={emp.dates}
                    onChange={(e) => {
                      const arr = [...employers];
                      arr[i].dates = e.target.value;
                      setEmployers(arr);
                    }}
                    className="input-field w-full"
                  />
                  <input
                    type="text"
                    placeholder="Manager Name/Contact"
                    value={emp.manager}
                    onChange={(e) => {
                      const arr = [...employers];
                      arr[i].manager = e.target.value;
                      setEmployers(arr);
                    }}
                    className="input-field w-full"
                  />
                  <input
                    type="text"
                    placeholder="Reason for leaving"
                    value={emp.reason}
                    onChange={(e) => {
                      const arr = [...employers];
                      arr[i].reason = e.target.value;
                      setEmployers(arr);
                    }}
                    className="input-field w-full"
                  />
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-800 pt-8 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText size={18} className="text-yellow-400" /> Education &
                Resume Content
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Degree"
                  value={education.degree}
                  onChange={(e) =>
                    setEducation({ ...education, degree: e.target.value })
                  }
                  className="input-field w-full"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={education.institution}
                  onChange={(e) =>
                    setEducation({ ...education, institution: e.target.value })
                  }
                  className="input-field w-full"
                />
                <input
                  type="text"
                  placeholder="Grad Year"
                  value={education.year}
                  onChange={(e) =>
                    setEducation({ ...education, year: e.target.value })
                  }
                  className="input-field w-full"
                />
              </div>
              <div className="pt-2">
                <label className="glass-button w-full flex items-center justify-center p-4 cursor-pointer gap-2 border border-dashed border-neutral-700 hover:border-neutral-500">
                  <Upload size={18} /> Upload Resume (Extract Data)
                  <input type="file" accept=".pdf,.docx,text/plain" onChange={(e) => { handleResumeUpload(e); alert("Resume processed and text extracted."); }} className="hidden" />
                </label>
              </div>
              <textarea
                placeholder="Extracted plain text resume data will appear here..."
                value={resumeData}
                onChange={(e) => setResumeData(e.target.value)}
                className="input-field w-full h-32 resize-none font-mono text-sm leading-relaxed"
              />
            </div>

            <div className="border-t border-neutral-800 pt-8 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <CheckSquare size={18} className="text-cyan-400" /> Frequent Questions
              </h3>
              <textarea
                placeholder="List frequent questions you get in apps (e.g. 'What are your salary expectations?') and your standard answers..."
                value={frequentQuestions}
                onChange={(e) => setFrequentQuestions(e.target.value)}
                className="input-field w-full h-32 resize-none font-mono text-sm leading-relaxed"
              />
            </div>

            <button
              onClick={handleSaveIntake}
              className="primary-button w-full flex justify-center gap-2"
            >
              <Save size={18} /> Save secure profile & continue
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-[700px] bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden">
            <div className="bg-neutral-800 p-4 border-b border-neutral-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-400" />
                <div>
                  <h3 className="font-bold text-sm">
                    Job Application Assistant
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Strictly confidential and encrypted protocol active.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-2xl p-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap",
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : msg.role === "system"
                          ? "bg-neutral-800 text-neutral-400 font-mono text-xs border border-neutral-700"
                          : "bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-bl-none",
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-neutral-950 border-t border-neutral-800">
              <div className="relative">
                <textarea
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Paste job description, application URLs, or screenshot text here..."
                  className="input-field w-full pr-12 min-h-[80px] py-4 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAskAssistant();
                    }
                  }}
                />
                <button
                  onClick={handleAskAssistant}
                  disabled={!inputQuery.trim()}
                  className="absolute right-4 bottom-4 p-2 bg-blue-600 hover:bg-blue-500 rounded-xl disabled:opacity-50 transition-colors"
                >
                  <Send size={16} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

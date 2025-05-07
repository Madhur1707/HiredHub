import { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  Star,
  User,
  Briefcase,
  Calendar,
  Code,
  BadgeCheck,
  ExternalLink,
} from "lucide-react";

const ShortlistAI = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      applications: 87,
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      department: "Product",
      applications: 64,
    },
    { id: 3, title: "UI/UX Designer", department: "Design", applications: 43 },
  ];

  const candidates = [
    {
      id: 1,
      name: "Jane Doe",
      title: "Senior Frontend Developer",
      experience: "5 years",
      skills: ["React", "TypeScript", "Node.js", "Redux", "Tailwind CSS"],
      match: 96,
      highlights: [
        "Led team of 4 developers",
        "Improved site performance by 40%",
      ],
      image: "/api/placeholder/60/60",
    },
    {
      id: 2,
      name: "John Smith",
      title: "Full Stack Developer",
      experience: "3 years",
      skills: ["MongoDB", "Express", "React", "Node.js", "GraphQL"],
      match: 92,
      highlights: [
        "Built 3 production apps from scratch",
        "Open source contributor",
      ],
      image: "/api/placeholder/60/60",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      title: "Frontend Engineer",
      experience: "4 years",
      skills: ["Vue.js", "React", "JavaScript", "SCSS", "Webpack"],
      match: 89,
      highlights: [
        "Mentored junior developers",
        "Led component library migration",
      ],
      image: "/api/placeholder/60/60",
    },
  ];

  const handleRunAnalysis = () => {
    if (!selectedJob) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b pb-5 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Resume Shortlisting
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Automatically identify and rank top candidates that match your
                job requirements
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="text-gray-700 bg-white px-4 py-2 border rounded-md hover:bg-gray-50 shadow-sm text-sm font-medium flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              <button className="text-gray-700 bg-white px-4 py-2 border rounded-md hover:bg-gray-50 shadow-sm text-sm font-medium flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Job selection */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Select Job Posting
              </h2>

              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search job postings..."
                />
              </div>

              <div className="space-y-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className={`border rounded-md p-4 cursor-pointer transition-colors ${
                      selectedJob?.id === job.id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {job.department}
                        </p>
                      </div>
                      {selectedJob?.id === job.id && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center mt-3 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-4">Posted 7 days ago</span>
                      <User className="w-4 h-4 mr-1" />
                      <span>{job.applications} applicants</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className={`mt-6 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !selectedJob || isProcessing
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
                disabled={!selectedJob || isProcessing}
                onClick={handleRunAnalysis}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Run AI Shortlisting"
                )}
              </button>
            </div>
          </div>

          {/* Right column - Results */}
          <div className="lg:col-span-2">
            {!showResults ? (
              <div className="bg-white p-10 rounded-lg shadow-sm border h-full flex flex-col items-center justify-center text-center">
                <img
                  src="/api/placeholder/120/120"
                  alt="Select a job"
                  className="mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Results Yet
                </h3>
                <p className="text-gray-500 max-w-md">
                  Select a job posting from the left panel and run the AI
                  shortlisting process to see top candidates ranked by match
                  score.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Top Candidates for {selectedJob?.title}
                    </h2>
                    <div className="text-sm text-gray-500">
                      Showing top {candidates.length} of{" "}
                      {selectedJob?.applications} applicants
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Technical skills
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Experience level
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Leadership potential
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <BadgeCheck className="w-3 h-3 mr-1" />
                      AI-verified
                    </span>
                  </div>
                </div>

                <div className="divide-y">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start">
                        <img
                          src={candidate.image}
                          alt={candidate.name}
                          className="h-12 w-12 rounded-full mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {candidate.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {candidate.title}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-xl font-bold text-blue-600">
                                {candidate.match}%
                              </div>
                              <div className="text-xs text-gray-500">
                                match score
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-start">
                              <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 mr-2" />
                              <div>
                                <div className="text-xs text-gray-500">
                                  Experience
                                </div>
                                <div className="text-sm">
                                  {candidate.experience}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Code className="w-4 h-4 text-gray-400 mt-0.5 mr-2" />
                              <div>
                                <div className="text-xs text-gray-500">
                                  Top Skills
                                </div>
                                <div className="text-sm">
                                  {candidate.skills.slice(0, 3).join(", ")}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Star className="w-4 h-4 text-gray-400 mt-0.5 mr-2" />
                              <div>
                                <div className="text-xs text-gray-500">
                                  Highlight
                                </div>
                                <div className="text-sm">
                                  {candidate.highlights[0]}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between">
                            <div className="flex flex-wrap gap-2">
                              {candidate.skills
                                .slice(0, 4)
                                .map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {candidate.skills.length > 4 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                  +{candidate.skills.length - 4} more
                                </span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                                Review CV
                              </button>
                              <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700">
                                Contact
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortlistAI;

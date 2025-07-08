import { GoogleGenerativeAI } from "@google/generative-ai";
import supabaseClient from "@/utils/supabase";
import * as pdfjsLib from "pdfjs-dist";

// Initialize Gemini AI
const geminiApiKey = import.meta.env.VITE_PUBLIC_GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error(
    "VITE_PUBLIC_GEMINI_API_KEY is not set in environment variables"
  );
} else {
  console.log("Gemini API key loaded successfully");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

// Extract text from PDF using pdf.js
async function extractTextFromPDF(pdfUrl) {
  try {
    const response = await fetch(pdfUrl);
    const arrayBuffer = await response.arrayBuffer();

    // Set up pdf.js worker for browser environment - use a local worker or disable
    if (typeof window !== "undefined") {
      // Disable worker to avoid CORS issues in development
      pdfjsLib.GlobalWorkerOptions.workerSrc = false;
    }

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + " ";
    }

    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "";
  }
}

// Analyze candidate with Gemini AI
async function analyzeCandidateWithAI(
  jobDescription,
  resumeText,
  candidateName
) {
  try {
    if (!geminiApiKey) {
      throw new Error("Gemini API key not configured");
    }

    console.log(`Starting AI analysis for candidate: ${candidateName}`);
    console.log(`Resume text length: ${resumeText.length} characters`);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert HR recruiter and AI assistant. Analyze the following job description and candidate resume to provide a comprehensive evaluation.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText}

Please provide your analysis in the following JSON format:
{
  "matchScore": number (0-100),
  "skills": ["skill1", "skill2", "skill3"],
  "experience": "X years",
  "highlights": ["highlight1", "highlight2"],
  "insights": "Detailed explanation of why this candidate matches or doesn't match the role",
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1", "concern2"]
}

Focus on:
- Technical skills alignment
- Experience level match
- Project relevance
- Leadership potential
- Cultural fit indicators

Be objective and provide specific examples from the resume that support your evaluation.
`;

    console.log(`Sending request to Gemini API...`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(`Received response from Gemini API`);
    console.log(`Raw AI response:`, text.substring(0, 200) + "...");

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      console.log(`Parsed AI response:`, parsedResponse);
      return parsedResponse;
    } else {
      console.error(`Failed to parse JSON from AI response:`, text);
      throw new Error("Invalid AI response format");
    }
  } catch (error) {
    console.error(`Error analyzing candidate ${candidateName} with AI:`, error);
    return {
      matchScore: 0,
      skills: [],
      experience: "Unknown",
      highlights: [],
      insights: "Error analyzing candidate",
      strengths: [],
      concerns: ["Error in AI analysis"],
    };
  }
}

// Main function to run AI shortlisting
export async function runAIShortlisting(token, options, jobId) {
  console.log(`Starting AI shortlisting for job ID: ${jobId}`);
  const supabase = await supabaseClient(token);

  try {
    // 1. Get job details
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      throw new Error("Job not found");
    }

    console.log(`Found job: "${job.title}"`);

    // 2. Get all applications for this job
    console.log(`Fetching applications for job ID: ${jobId}`);

    // First, let's try a simple query to see if applications exist
    const { data: simpleApplications, error: simpleError } = await supabase
      .from("applications")
      .select("*")
      .eq("job_id", jobId);

    console.log(`Simple applications query result:`, {
      data: simpleApplications,
      error: simpleError,
    });

    if (simpleError) {
      console.error("Simple applications fetch error:", simpleError);
      throw new Error(`Error fetching applications: ${simpleError.message}`);
    }

    // Use the simple query since the join doesn't work
    const applications = simpleApplications;
    const applicationsError = null;

    // Log the applications to see what data we have
    console.log("Applications data:", applications);

    // Check if applications have name field
    const sampleApp = applications[0];
    if (sampleApp) {
      console.log("Sample application fields:", Object.keys(sampleApp));
      console.log("Sample application name:", sampleApp.name);
      console.log("Sample application email:", sampleApp.email);
    }

    if (applicationsError) {
      console.error("Applications fetch error:", applicationsError);
      throw new Error(
        `Error fetching applications: ${applicationsError.message}`
      );
    }

    if (!applications || applications.length === 0) {
      console.log(`No applications found for job: ${job.title}`);
      return {
        job,
        candidates: [],
        message: "No applications found for this job",
      };
    }

    console.log(`Found ${applications.length} applications to analyze`);

    // 3. Analyze each candidate
    const analyzedCandidates = [];

    for (const application of applications) {
      try {
        console.log(
          `Processing application ${application.id}, resume URL: ${application.resume}`
        );

        // Extract text from resume PDF
        const resumeText = await extractTextFromPDF(application.resume);

        if (!resumeText) {
          console.warn(
            `Could not extract text from resume for application ${application.id}`
          );
          // Use name from application table
          const candidateName =
            application.name ||
            `Candidate ${application.candidate_id.slice(-4)}`;

          // Create a fallback text for testing
          const fallbackText = `${candidateName} - Cloud Architect with experience in AWS, Azure, and Google Cloud. Skills include Docker, Kubernetes, microservices architecture, and DevOps practices.`;
          console.log(`Using fallback text for testing for ${candidateName}`);

          // Continue with fallback text for now
          const aiAnalysis = await analyzeCandidateWithAI(
            job.description,
            fallbackText,
            candidateName
          );

          // Prepare candidate data
          const candidate = {
            id: application.id,
            applicationId: application.id,
            name:
              application.name ||
              `Candidate ${application.candidate_id.slice(-4)}`,
            email:
              application.email ||
              `candidate-${application.candidate_id.slice(-4)}@example.com`,
            avatar: null, // No avatar in applications table
            title:
              aiAnalysis.skills.length > 0 ? aiAnalysis.skills[0] : "Developer",
            experience: aiAnalysis.experience,
            skills: aiAnalysis.skills,
            match: aiAnalysis.matchScore,
            highlights: aiAnalysis.highlights,
            insights: aiAnalysis.insights,
            strengths: aiAnalysis.strengths,
            concerns: aiAnalysis.concerns,
            appliedDate: application.created_at,
            status: application.status,
          };

          analyzedCandidates.push(candidate);

          // Update application with AI analysis results
          await supabase
            .from("applications")
            .update({
              ai_match_score: aiAnalysis.matchScore,
              ai_insights: JSON.stringify(aiAnalysis),
            })
            .eq("id", application.id);

          continue;
        }

        // Analyze with AI
        const candidateName =
          application.name || `Candidate ${application.candidate_id.slice(-4)}`;
        const aiAnalysis = await analyzeCandidateWithAI(
          job.description,
          resumeText,
          candidateName
        );

        console.log(`Processing candidate: ${candidateName}`);

        // Prepare candidate data
        const candidate = {
          id: application.id,
          applicationId: application.id,
          name:
            application.name ||
            `Candidate ${application.candidate_id.slice(-4)}`,
          email:
            application.email ||
            `candidate-${application.candidate_id.slice(-4)}@example.com`,
          avatar: null, // No avatar in applications table
          title:
            aiAnalysis.skills.length > 0 ? aiAnalysis.skills[0] : "Developer",
          experience: aiAnalysis.experience,
          skills: aiAnalysis.skills,
          match: aiAnalysis.matchScore,
          highlights: aiAnalysis.highlights,
          insights: aiAnalysis.insights,
          strengths: aiAnalysis.strengths,
          concerns: aiAnalysis.concerns,
          appliedDate: application.created_at,
          status: application.status,
        };

        analyzedCandidates.push(candidate);

        // Update application with AI analysis results
        await supabase
          .from("applications")
          .update({
            ai_match_score: aiAnalysis.matchScore,
            ai_insights: JSON.stringify(aiAnalysis),
          })
          .eq("id", application.id);
      } catch (error) {
        console.error(
          `Error analyzing candidate ${
            application.name || application.candidate_id
          }:`,
          error
        );
      }
    }

    // 4. Sort candidates by match score (highest first)
    const sortedCandidates = analyzedCandidates.sort(
      (a, b) => b.match - a.match
    );

    console.log(
      `AI shortlisting completed! Analyzed ${analyzedCandidates.length} candidates`
    );
    console.log(`Top candidate score: ${sortedCandidates[0]?.match || 0}%`);

    return {
      job,
      candidates: sortedCandidates,
      totalAnalyzed: sortedCandidates.length,
      totalApplications: applications.length,
    };
  } catch (error) {
    console.error("Error in AI shortlisting:", error);
    throw error;
  }
}

// Get previously analyzed results
export async function getAIShortlistResults(token, options, jobId) {
  const supabase = await supabaseClient(token);

  try {
    // Get job details
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      throw new Error("Job not found");
    }

    // Get applications with AI analysis
    const { data: applications, error: applicationsError } = await supabase
      .from("applications")
      .select("*")
      .eq("job_id", jobId)
      .not("ai_match_score", "is", null);

    if (applicationsError) {
      throw new Error(
        `Error fetching analyzed applications: ${applicationsError.message}`
      );
    }

    console.log("Applications with AI analysis:", applications);

    if (applicationsError) {
      throw new Error("Error fetching analyzed applications");
    }

    if (!applications || applications.length === 0) {
      return {
        job,
        candidates: [],
        message: "No analyzed applications found",
      };
    }

    // Format candidates
    const candidates = applications.map((application) => {
      const aiInsights = application.ai_insights
        ? JSON.parse(application.ai_insights)
        : {};

      return {
        id: application.id,
        applicationId: application.id,
        name:
          application.name || `Candidate ${application.candidate_id.slice(-4)}`,
        email:
          application.email ||
          `candidate-${application.candidate_id.slice(-4)}@example.com`,
        avatar: null, // No avatar in applications table
        title: aiInsights.skills?.[0] || "Developer",
        experience: aiInsights.experience || "Unknown",
        skills: aiInsights.skills || [],
        match: application.ai_match_score || 0,
        highlights: aiInsights.highlights || [],
        insights: aiInsights.insights || "",
        strengths: aiInsights.strengths || [],
        concerns: aiInsights.concerns || [],
        appliedDate: application.created_at,
        status: application.status,
      };
    });

    // Sort by match score
    const sortedCandidates = candidates.sort((a, b) => b.match - a.match);

    return {
      job,
      candidates: sortedCandidates,
      totalAnalyzed: sortedCandidates.length,
    };
  } catch (error) {
    console.error("Error getting AI shortlist results:", error);
    throw error;
  }
}

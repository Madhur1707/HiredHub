import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_PUBLIC_GEMINI_API_KEY);

export async function runShortlist({ job, applicants }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an AI HR assistant. Given the job description and a list of applicants with resume content, shortlist the top candidates.

Job Title: ${job.title}
Job Description: ${job.description}

Applicants:
${applicants
  .map(
    (a, i) => `Candidate ${i + 1}:
Name: ${a.name}
Resume: ${a.resume_text}`
  )
  .join("\n\n")}

Output a shortlist with candidate names and a short justification.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text;
}

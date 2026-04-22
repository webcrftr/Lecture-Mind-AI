import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const ai = new GoogleGenAI({ apiKey });

export async function processContent(text: string, type: string) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are an expert tutor for JEE and NEET competitive exams.
    Analyze the following educational content and generate:
    1. Summaries (short, medium, detailed)
    2. Key concepts
    3. Formulas (if applicable)
    4. 5 MCQ questions for a quiz
    5. 5 Flashcards (Question/Answer pairs)
    6. Main Subject (Physics, Chemistry, Biology, or Maths)
    7. Main Topic name

    Content Type: ${type}
    Content text: ${text}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.OBJECT,
            properties: {
              short: { type: Type.STRING },
              medium: { type: Type.STRING },
              detailed: { type: Type.STRING }
            },
            required: ["short", "medium", "detailed"]
          },
          concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
          formulas: { type: Type.ARRAY, items: { type: Type.STRING } },
          quizzes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ["question", "answer"]
            }
          },
          subject: { type: Type.STRING },
          topic: { type: Type.STRING }
        },
        required: ["summary", "concepts", "formulas", "quizzes", "flashcards", "subject", "topic"]
      }
    }
  });

  return JSON.parse(response.text);
}

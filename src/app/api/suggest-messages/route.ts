import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const runtime = "edge";

const fallbackQuestions = [
    "What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?",
    "What's a movie or book that changed your mindset?||If you could travel anywhere tomorrow, where would you go?||What's your favorite way to unwind after a long day?",
    "What's the best piece of advice you've ever received?||What's a skill you wish you had learned earlier?||What's a small win you celebrated recently?",
];

function getModel() {
    const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (googleKey && googleKey.trim().length > 0) {
        const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
        return google(modelName);
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && groqKey.trim().length > 0) {
        return groq("llama-3.3-70b-versatile");
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey.trim().length > 0) {
        return openai("gpt-4o-mini");
    }

    return null;
}

export async function POST(req: Request) {
    const randomFallback = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];

    try {
        const model = getModel();

        if (!model) {
            return new Response(randomFallback, {
                headers: { "Content-Type": "text/plain; charset=utf-8" },
            });
        }

        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        const { text } = await generateText({
            model,
            messages: [{ role: "user", content: prompt }],
        });

        if (!text || text.trim().length === 0) {
            return new Response(randomFallback, {
                headers: { "Content-Type": "text/plain; charset=utf-8" },
            });
        }

        return new Response(text, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    } catch (error) {
        console.warn("AI generation failed, returning fallback questions:", error);
        return new Response(randomFallback, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    }
}
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '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' });

// Helper function to clean markdown JSON formatting often returned by LLMs
const cleanJSONResponse = (text) => {
    return text.replace(/```json\n?|```/g, '').trim();
};

const generateCurriculum = async (user) => {
    const { name, semester, skillLevel, weakSubjects, careerGoal, numberOfWeeks } = user;
    const totalWeeks = numberOfWeeks || 4;
    const focusAreas = weakSubjects && weakSubjects.length > 0 ? weakSubjects.join(', ') : 'General Computer Science';

    const prompt = `
You are an expert personalized AI tutor for a university student.
Create a structured syllabus for a student named: ${name}
Semester: ${semester}
Current Skill Level: ${skillLevel}
Career Goal: ${careerGoal}
Focus Areas / Weak Subjects to Improve: ${focusAreas}

Required Duration: ${totalWeeks} weeks

Output exactly a JSON object following this format:
{
    "title": "${careerGoal} Roadmap for ${name} – ${totalWeeks} Week Plan",
    "target": "${careerGoal}",
    "difficulty": "${skillLevel}",
    "semester": "${semester}",
    "weeks": [
        {
            "week": 1,
            "title": "Week 1: <Main Topic>",
            "subject": "<Subject Category>",
            "description": "<Short description of what to study, incorporating their career goal>",
            "subtopics": ["<Subtopic 1>", "<Subtopic 2>", "<Subtopic 3>"],
            "completed": false
        }
    ]
}

Ensure you generate exactly ${totalWeeks} items in the "weeks" array. The curriculum MUST logically progress over ${totalWeeks} weeks to build skills in their focus areas. Return ONLY the valid JSON, with NO additional text or markdown formatting outside of it.`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a highly capable AI tutor that outputs pure JSON. Never wrap in markdown blocks, never provide conversational text.'
                },
                {
                    role: 'user',
                    content: prompt,
                }
            ],
            model: 'llama-3.1-8b-instant', // Fast model suitable for this schema
            temperature: 0.5,
            response_format: { type: "json_object" }
        });
        
        let rawText = chatCompletion.choices[0]?.message?.content || '{}';
        rawText = cleanJSONResponse(rawText);
        return JSON.parse(rawText);
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate AI curriculum: " + error.message);
    }
};

// AI Notes generator
const generateNotes = async (topic) => {
    const prompt = `
Give me a structured, comprehensive set of study notes on the topic: "${topic}".
Include fundamental definitions, how it works, its real-world applications or use cases, and tips for interviews / exams if applicable.

Return ONLY a JSON object exactly like this:
{
    "content": "<Markdown formatted detailed notes about ${topic}>",
    "resources": [
        "<Resource Name 1>: URL or description",
        "<Resource Name 2>: URL or description"
    ]
}
No other text, just valid JSON output.`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You output pure JSON objects only.'
                },
                {
                    role: 'user',
                    content: prompt,
                }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.5,
            response_format: { type: "json_object" }
        });
        
        let rawText = chatCompletion.choices[0]?.message?.content || '{}';
        rawText = cleanJSONResponse(rawText);
        return JSON.parse(rawText);
    } catch (error) {
        console.error("AI Notes Generation Error:", error);
        throw new Error("Failed to generate AI notes: " + error.message);
    }
};

// AI Quiz generator
const generateMCQs = async (topic) => {
    const prompt = `
Generate 5 high-quality multiple choice questions testing knowledge of the topic: "${topic}".
They should range from basic to intermediate difficulty.

Return ONLY a JSON object that has a "questions" array inside it:
{
    "questions": [
        {
            "question": "<The question string>",
            "options": ["<Option 1>", "<Option 2>", "<Option 3>", "<Option 4>"],
            "answer": <index of the correct option (0-3)>
        }
    ]
}`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You output pure JSON objects only.'
                },
                {
                    role: 'user',
                    content: prompt,
                }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.5,
            response_format: { type: "json_object" }
        });
        
        let rawText = chatCompletion.choices[0]?.message?.content || '{"questions":[]}';
        rawText = cleanJSONResponse(rawText);
        const parsed = JSON.parse(rawText);
        return parsed.questions || parsed; // sometimes models ignore wrapping 
    } catch (error) {
        console.error("AI MCQ Generation Error:", error);
        throw new Error("Failed to generate AI MCQs: " + error.message);
    }
};

module.exports = { generateCurriculum, generateNotes, generateMCQs };

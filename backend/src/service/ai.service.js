import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// 1. Initialize the AI with your API key
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
    matchScore: z
        .number()
        .describe(
            'Overall score from 0 to 100 based on the comparsion of candidate profile with job description.',
        ),
    technicalQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe(
                        'A domain-specific question tailored to the hard skills required for this specific role.',
                    ),
                intention: z
                    .string()
                    .describe(
                        'The "hidden" motive. What competency is the interviewer checking? (e.g., Analytical thinking, technical depth, or process adherence).',
                    ),
                answer: z
                    .string()
                    .describe(
                        'A high-impact response guide. Include: 1. Key terminology to use. 2. A specific example from the candidate\'s past. 3. The "Ideal Outcome" to describe.',
                    ),
                complexity: z
                    .enum(['basic', 'intermediate', 'advanced'])
                    .describe('The depth of knowledge required.'),
            }),
        )
        .describe('Role-specific questions focusing on the "How" and "What" of the job.'),

    behavioralQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe(
                        'Soft-skill questions (e.g., conflict resolution, adaptability, leadership) based on the "STAR" method.',
                    ),
                intention: z
                    .string()
                    .describe(
                        'The specific trait being evaluated, such as "Emotional Intelligence," "Stress Management," or "Cultural Alignment."',
                    ),
                answer: z
                    .string()
                    .describe(
                        'Strategy: Which story from the candidate’s history best fits this? What "Lesson Learned" should be highlighted?',
                    ),
            }),
        )
        .describe(
            'Interpersonal and situational questions focusing on the "Who" and "Why" of the candidate.',
        ),

    skillGaps: z
        .array(
            z.object({
                gap: z
                    .string()
                    .describe(
                        'A specific requirement from the JD that is missing or weak in the candidate’s profile.',
                    ),
                severity: z.enum(['low', 'medium', 'high']).describe('Impact on hiring chances.'),
                pivotStatement: z
                    .string()
                    .describe(
                        'A specific "Pivot Script": How to redirect the interviewer toward a related strength if they ask about this gap.',
                    ),
            }),
        )
        .describe(
            'A strategic audit of the candidate’s weaknesses relative to this specific role.',
        ),

    preparationPlan: z
        .array(
            z.object({
                phase: z
                    .string()
                    .describe(
                        'The stage of prep (e.g., "Research Phase", "Mock Practice", "Final Review").',
                    ),
                focusArea: z.string().describe('The primary topic of study.'),
                actionItems: z
                    .array(z.string())
                    .describe('Concrete, actionable steps for the candidate to take.'),
                successCriteria: z
                    .string()
                    .describe('How the candidate knows they are ready for this specific phase.'),
            }),
        )
        .describe(
            'A chronological roadmap to move the candidate from "Unprepared" to "Interview Ready".',
        ),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
    });

    const prompt = `
        # ROLE
        You are an elite Technical Recruiter and Interview Coach with 20+ years of experience in talent acquisition and performance coaching. Your specialty is "High-Stakes Gap Analysis"—identifying exactly where a candidate's profile meets, exceeds, or falls short of a Job Description (JD).

        # OBJECTIVE
        Generate a hyper-personalized Interview Preparation Report in JSON format. Your goal is to transform the candidate from a "paper match" into a "top-tier performer" by providing them with strategic "Pivot Scripts" and tailored technical deep-dives.

        # INPUT DATA
        - **Candidate Resume:** ${resume}
        - **Candidate Self-Description:** ${selfDescription}
        - **Target Job Description:** ${jobDescription}

        # EXECUTION STEPS (Chain-of-Thought)
        1. **The Delta Analysis:** Compare the JD's "Must-Haves" against the Resume. Identify the 3 most critical Skill Gaps.
        2. **Technical Probing:** Select technical questions that aren't just "definitions" but "scenarios." Target the intersection of what the JD asks for and the candidate's actual listed projects.
        3. **The Intent Reveal:** For every question, explain the "Interviewer's Secret Agenda"—what are they actually trying to find out?
        4. **Behavioral Strategy:** Map the candidate's self-description and resume highlights to the soft skills demanded by the JD (e.g., leadership, conflict, or pace).
        5. **The Roadmap:** Create a tiered preparation plan that prioritizes fixing "High-Severity" gaps first.

        # GUIDELINES FOR CONTENT
        - **Answers:** Do not provide generic answers. Use the candidate's specific projects (e.g., specific names, metrics, or technologies mentioned) to anchor the responses.
        - **Tone:** Professional, direct, and highly tactical.
        - **Skill Gaps:** If a candidate is missing a secondary skill, provide a "Pivot Statement" to help them redirect the interviewer to a strength they DO have.

        # OUTPUT INSTRUCTIONS
        - Return ONLY valid JSON.
        - Ensure all descriptions in the schema are fulfilled with high-density information.
        - No conversational filler outside the JSON.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Use 2.5 Flash as per your project requirement
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            // This SDK uses 'responseJsonSchema' exactly as you wrote it
            responseJsonSchema: zodToJsonSchema(interviewReportSchema),
        },
    });

    // 3. In this SDK, response.text is a property, not a function
    const recipe = JSON.parse(response.text);
    console.log(recipe);
}

export { generateInterviewReport };

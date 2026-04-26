import OpenAI from 'openai';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// 1. Initialize the AI with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
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
                order: z.number().describe('Execution order of this phase starting from 1'),
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

const normalize = (data) => {
    const fixArray = (arr) =>
        arr.map((item) => {
            if (typeof item === 'string') {
                try {
                    return JSON.parse(item);
                } catch {
                    return item;
                }
            }
            return item;
        });

    return {
        ...data,
        technicalQuestions: fixArray(data.technicalQuestions),
        behavioralQuestions: fixArray(data.behavioralQuestions),
        skillGaps: fixArray(data.skillGaps),
        preparationPlan: fixArray(data.preparationPlan),
    };
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `
        You are a senior technical recruiter.

        TASK:
        Generate an interview preparation report based on:
        - Resume: ${resume}
        - Self Description: ${selfDescription}
        - Job Description: ${jobDescription || 'N/A'}

        OUTPUT RULES:
        - Return ONLY valid JSON
        - Follow structure EXACTLY
        - No explanations, no extra text

        COUNTS:
        - technicalQuestions: 5
        - behavioralQuestions: 3
        - skillGaps: 3
        - preparationPlan: 3-5 steps

        STRUCTURE:

        {
        "matchScore": number (0-100),

        "technicalQuestions": [
            {
                "question": string,
                "intention": string,
                "answer": string,
                "complexity": "basic" | "intermediate" | "advanced"
            }
        ],

        "behavioralQuestions": [
            {
                "question": string,
                "intention": string,
                "answer": string
            }
        ],

        "skillGaps": [
            {
                "gap": string,
                "severity": "low" | "medium" | "high",
                "pivotStatement": string
            }
        ],

        "preparationPlan": [
            {
                "order": number,
                "phase": string,
                "focusArea": string,
                "actionItems": string[],
                "successCriteria": string
            }
        ]
        }

        STRICT:
        - Arrays must contain OBJECTS (not strings)
        - No labels like "question", "gap" inside arrays
        - No inline strings like "order: 1, phase: ..."
        - actionItems MUST be array of strings
        - order must be sequential (1,2,3...)

        QUALITY:
        - Technical questions = scenario-based
        - Answers = include terminology + example + outcome
        - Skill gaps = specific, not generic
        - Behavioral = real experience based
    `;

    const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        response_format: {
            type: 'json_object',
        },
    });

    console.log('=====================================');

    // Extract JSON text
    const jsonString = response.choices[0]?.message?.content || '{}';
    const cleaned = normalize(JSON.parse(jsonString));

    // Re-validate with Zod to ensure type safety
    const parsed = interviewReportSchema.parse(cleaned);

    console.log(JSON.stringify(parsed, null, 2));
    return parsed;
}

export { generateInterviewReport };

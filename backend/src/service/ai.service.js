import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';
import { promptGenerator } from '../lib/promptGenerator.js';

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY_2,
});

const interviewReportSchema = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
            complexity: z.enum(['basic', 'intermediate', 'advanced']),
        }),
    ),
    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        }),
    ),
    skillGaps: z.array(
        z.object({
            gap: z.string(),
            severity: z.enum(['low', 'medium', 'high']),
            pivotStatement: z.string(),
        }),
    ),
    preparationPlan: z.array(
        z.object({
            order: z.number(),
            phase: z.string(),
            focusArea: z.string(),
            actionItems: z.array(z.string()),
            successCriteria: z.string(),
        }),
    ),
});

const geminiResponseSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: { type: Type.NUMBER },
        technicalQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer: { type: Type.STRING },
                    complexity: { type: Type.STRING, enum: ['basic', 'intermediate', 'advanced'] },
                },
                required: ['question', 'intention', 'answer', 'complexity'],
            },
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer: { type: Type.STRING },
                },
                required: ['question', 'intention', 'answer'],
            },
        },
        skillGaps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    gap: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
                    pivotStatement: { type: Type.STRING },
                },
                required: ['gap', 'severity', 'pivotStatement'],
            },
        },
        preparationPlan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    order: { type: Type.INTEGER },
                    phase: { type: Type.STRING },
                    focusArea: { type: Type.STRING },
                    actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                    successCriteria: { type: Type.STRING },
                },
                required: ['order', 'phase', 'focusArea', 'actionItems', 'successCriteria'],
            },
        },
    },
    required: [
        'matchScore',
        'technicalQuestions',
        'behavioralQuestions',
        'skillGaps',
        'preparationPlan',
    ],
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = promptGenerator({ resume, selfDescription, jobDescription });

    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: geminiResponseSchema, // ✅ Use native schema, not zodToJsonSchema()
        },
    });

    console.log(response.text)
    const parsed = interviewReportSchema.parse(JSON.parse(response.text));
    return parsed;
}

export { generateInterviewReport };

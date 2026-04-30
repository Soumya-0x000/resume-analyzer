import mongoose from 'mongoose';

const technicalQuestionsSchema = new mongoose.Schema(
    {
        question: { type: String, required: [true, 'Question is required'] },
        intention: { type: String, required: [true, 'Intention is required'] },
        answer: { type: String, required: [true, 'Answer is required'] },
        complexity: {
            type: String,
            enum: ['basic', 'intermediate', 'advanced'],
            required: [true, 'Complexity is required'],
        },
    },
    { _id: false },
);

const behavioralQuestionsSchema = new mongoose.Schema(
    {
        question: { type: String, required: [true, 'Question is required'] },
        intention: { type: String, required: [true, 'Intention is required'] },
        answer: { type: String, required: [true, 'Answer is required'] },
    },
    { _id: false },
);

const skillGapsSchema = new mongoose.Schema(
    {
        gap: { type: String, required: [true, 'Gap is required'] },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: [true, 'Severity is required'],
        },
        pivotStatement: { type: String, required: [true, 'Pivot statement is required'] },
    },
    { _id: false },
);

const preparationPlanSchema = new mongoose.Schema(
    {
        order: { type: Number, required: [true, 'Order is required'] },
        phase: { type: String, required: [true, 'Phase is required'] },
        focusArea: { type: String, required: [true, 'Focus area is required'] },
        actionItems: [{ type: String, required: [true, 'Action items are required'] }],
        successCriteria: { type: String, required: [true, 'Success criteria is required'] },
    },
    { _id: false },
);

const interviewReportSchema = new mongoose.Schema({
    jobDescription: { type: String, required: [true, 'Job Description is required'] },
    resume: { type: String },
    selfDescription: { type: String },
    matchScore: { type: Number, min: 0, max: 100 },
    technicalQuestions: { type: [technicalQuestionsSchema], default: [] },
    behavioralQuestions: { type: [behavioralQuestionsSchema], default: [] },
    skillGaps: { type: [skillGapsSchema], default: [] },
    preparationPlan: { type: [preparationPlanSchema], default: [] },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'User is required'],
    },
});

const InterviewReportModel = mongoose.model('interviewReport', interviewReportSchema);
export default InterviewReportModel;

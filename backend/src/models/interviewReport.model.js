import mongoose from 'mongoose';

const technicalQuestionsSchema = new mongoose.Schema(
    {
        question: { type: String, required: [true, 'Question is required'] },
        intention: { type: String, required: [true, 'Intention is required'] },
        answer: { type: String, required: [true, 'Answer is required'] },
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
        skill: { type: String, required: [true, 'Skill is required'] },
        enum: ['low', 'medium', 'high'],
        severity: { type: String, required: [true, 'Severity is required'] },
    },
    { _id: false },
);

const preparationPlanSchema = new mongoose.Schema({
    day: { type: Number, required: [true, 'Day is required'] },
    focus: { type: String, required: [true, 'Focus is required'] },
    tasks: [{ type: String, required: [true, 'Tasks are required'] }],
});

const interviewReportSchema = new mongoose.Schema({
    jobDescription: { type: String, required: [true, 'Job Description is required'] },
    resume: { type: String },
    selfDescription: { type: String },
    matchScore: { type: Number, min: 0, max: 100 },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema],
    skillGaps: [skillGapsSchema],
    preparationPlan: [preparationPlanSchema],
});

const InterviewReportModel = mongoose.model('InterviewReportModel', interviewReportSchema);
export default InterviewReportModel;

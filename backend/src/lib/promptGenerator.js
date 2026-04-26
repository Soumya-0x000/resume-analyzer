export const promptGenerator = ({ resume, selfDescription, jobDescription }) => {
    return `
        You are a senior technical recruiter and career coach specializing in interview preparation.

        TASK:
        Analyze the candidate's profile against the job description and generate a comprehensive interview preparation report.

        INPUTS:
        - Resume: ${resume}
        - Self Description: ${selfDescription}
        - Job Description: ${jobDescription || 'N/A'}

        REQUIREMENTS:
        - technicalQuestions: Generate exactly 5 scenario-based questions tailored to the role's hard skills
        - behavioralQuestions: Generate exactly 3 STAR-method questions targeting soft skills
        - skillGaps: Identify exactly 3 specific gaps between the candidate's profile and the JD
        - preparationPlan: Generate 3 to 5 chronological phases to get the candidate interview-ready

        QUALITY GUIDELINES:
        - Technical questions must be scenario-based, not generic
        - Each answer must include: key terminology, a specific past example, and an ideal outcome
        - Skill gaps must be specific to this JD, not generic weaknesses
        - Behavioral questions must be grounded in real experience the candidate likely has
        - Pivot statements must redirect to a genuine related strength from the resume
        - matchScore should reflect realistic alignment (be critical, not generous)
    `;
};

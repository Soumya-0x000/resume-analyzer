import app from './src/app.js';
import 'dotenv/config';
import { connectDB } from './src/config/database.js';
import { resume, selfDescription, jobDescription } from './src/service/temp.js';
import { generateInterviewReport } from './src/service/ai.service.js';

await connectDB();

generateInterviewReport({ resume, selfDescription, jobDescription });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

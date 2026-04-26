import crypto from 'crypto';

export function createCacheKey({ resume, selfDescription, jobDescription }) {
    const normalized = JSON.stringify({
        resume: resume?.trim() || '',
        selfDescription: selfDescription?.trim() || '',
        jobDescription: jobDescription?.trim() || '',
    });

    return crypto.createHash('sha256').update(normalized).digest('hex');
}

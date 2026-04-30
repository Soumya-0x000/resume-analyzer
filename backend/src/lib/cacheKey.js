import crypto from 'crypto';

function normalize(input) {
    if (!input) return '';

    if (typeof input === 'string') {
        return input.trim();
    }

    if (Buffer.isBuffer(input)) {
        return input.toString('utf-8').trim();
    }

    return String(input).trim();
}

export function createCacheKey({ resume, selfDescription, jobDescription }) {
    const normalized = JSON.stringify({
        resume: normalize(resume),
        selfDescription: normalize(selfDescription),
        jobDescription: normalize(jobDescription),
    });

    return crypto.createHash('sha256').update(normalized).digest('hex');
}

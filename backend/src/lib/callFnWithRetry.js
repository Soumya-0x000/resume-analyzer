export async function callFnWithRetry(fn, retries = 3) {
    let attempt = 0;

    while (attempt < retries) {
        try {
            return await fn();
        } catch (err) {
            const status = err?.status;

            // retry only for transient errors
            if (status === 503 || status === 429) {
                const delay = 500 * Math.pow(2, attempt); // 500ms → 1s → 2s

                await new Promise((res) => setTimeout(res, delay));
                attempt++;
                continue;
            }

            throw err; // non-retry error
        }
    }

    throw new Error('Retry limit exceeded');
}

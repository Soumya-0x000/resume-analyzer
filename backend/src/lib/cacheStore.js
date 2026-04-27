const store = new Map();

export function getCache(key) {
    const entry = store.get(key);

    if (!entry) return null;

    // expire check
    if (Date.now() > entry.expiry) {
        store.delete(key);
        return null;
    }

    return entry.value;
}

export function setCache(key, value, ttlMs) {
    store.set(key, {
        value,
        expiry: Date.now() + ttlMs,
    });
}

export function deleteCache(key) {
    store.delete(key);
}

export function clearCache() {
    store.clear();
}

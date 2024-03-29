cache = new Map();

function set(key, value, expirationTime) {
    const expiration = Date.now() + expirationTime;
    cache.set(key, { value, expiration });
}

function get(key, expirationTime) {
    const entry = cache.get(key);
    if (!entry || entry.expiration < Date.now()) {
        cache.delete(key);
        return null;
    }
    entry.expiration = Date.now() + expirationTime;
    return entry.value;
}

function deleteCache(key){
    cache.delete(key);
}

const setCache = (key, model) => {
    set(key, model, 600000);
};

const getCachedModel = (key) => {
    const value = get(key, 600000); // Pass expirationTime here
    return value;
};

const clearCachedModel = (key) => {
    deleteCache(key);
};

module.exports = { setCache, getCachedModel, clearCachedModel };

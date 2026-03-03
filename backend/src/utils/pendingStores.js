// Almacenamiento temporal en memoria
// key: email  →  value: { storeData, code, expiresAt }
const pendingStores = new Map();

export const savePendingStore = (email, storeData, code) => {
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutos
    pendingStores.set(email, { storeData, code, expiresAt });
};

export const getPendingStore = (email) => {
    const entry = pendingStores.get(email);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        pendingStores.delete(email);
        return null;
    }
    return entry;
};

export const deletePendingStore = (email) => {
    pendingStores.delete(email);
};
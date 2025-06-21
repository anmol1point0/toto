// Shared Logger utility for all levels
export const Logger = {
    info: (message, data = null) => {
        console.log(`[GAME] ${message}`, data || '');
    },
    warn: (message, data = null) => {
        console.warn(`[GAME] ${message}`, data || '');
    },
    error: (message, data = null) => {
        console.error(`[GAME] ${message}`, data || '');
    }
}; 
/**
 * Local Storage Service
 * Handles history persistence and retrieval
 */

const STORAGE_KEYS = {
    HISTORY: 'socialai_history',
    USER_PREFERENCES: 'socialai_preferences',
    GENERATED_CAPTIONS: 'socialai_captions',
};

const MAX_HISTORY_ITEMS = 50;

/**
 * Get all history items
 * @returns {Array} Array of history items
 */
export const getHistory = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('[Storage] Failed to get history:', error);
        return [];
    }
};

/**
 * Add a new history item
 * @param {Object} item - History item to add
 */
export const addToHistory = (item) => {
    try {
        const history = getHistory();

        const newItem = {
            id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            ...item,
        };

        // Add to beginning of array
        history.unshift(newItem);

        // Limit history size
        if (history.length > MAX_HISTORY_ITEMS) {
            history.pop();
        }

        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

        return newItem;
    } catch (error) {
        console.error('[Storage] Failed to add to history:', error);
        return null;
    }
};

/**
 * Clear all history
 */
export const clearHistory = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
        return true;
    } catch (error) {
        console.error('[Storage] Failed to clear history:', error);
        return false;
    }
};

/**
 * Delete a specific history item
 * @param {string} id - ID of the item to delete
 */
export const deleteHistoryItem = (id) => {
    try {
        const history = getHistory();
        const filtered = history.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('[Storage] Failed to delete history item:', error);
        return false;
    }
};

/**
 * Save user preferences
 * @param {Object} prefs - User preferences object
 */
export const savePreferences = (prefs) => {
    try {
        const existing = getPreferences();
        const updated = { ...existing, ...prefs };
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('[Storage] Failed to save preferences:', error);
        return false;
    }
};

/**
 * Get user preferences
 * @returns {Object} User preferences
 */
export const getPreferences = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        return data ? JSON.parse(data) : {
            defaultTone: 'professional',
            defaultPlatform: 'instagram',
            includeEmojis: true,
            autoSaveHistory: true,
        };
    } catch (error) {
        console.error('[Storage] Failed to get preferences:', error);
        return {};
    }
};

/**
 * Save a generated caption for reuse
 * @param {Object} captionData - Caption and hashtags
 */
export const saveCaption = (captionData) => {
    try {
        const captions = getSavedCaptions();
        captions.unshift({
            id: `cap_${Date.now()}`,
            savedAt: new Date().toISOString(),
            ...captionData,
        });

        // Limit saved captions
        if (captions.length > 20) {
            captions.pop();
        }

        localStorage.setItem(STORAGE_KEYS.GENERATED_CAPTIONS, JSON.stringify(captions));
        return true;
    } catch (error) {
        console.error('[Storage] Failed to save caption:', error);
        return false;
    }
};

/**
 * Get saved captions
 * @returns {Array} Array of saved captions
 */
export const getSavedCaptions = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.GENERATED_CAPTIONS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('[Storage] Failed to get saved captions:', error);
        return [];
    }
};

export default {
    getHistory,
    addToHistory,
    clearHistory,
    deleteHistoryItem,
    savePreferences,
    getPreferences,
    saveCaption,
    getSavedCaptions,
};

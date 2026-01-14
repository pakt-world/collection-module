/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

// Constants for storage keys
export const COLLECTION_STORAGE_KEY = "pakt_collection_store";
export const SELECTED_SCHEMA_KEY = "pakt_selected_schema";

const isBrowser = typeof window !== "undefined";

const setLocalStorage = (key: string, value: string) => {
    if (!isBrowser) return;

    window.localStorage.setItem(key, value);
};

const getLocalStorage = (key: string): string | null => {
    if (!isBrowser) return null;
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
};

const removeLocalStorage = (key: string) => {
    if (!isBrowser) return;

    window.localStorage.removeItem(key);
};

export const setCookie = (key: string, value: string, options?: any) => {
    if (typeof document !== "undefined") {
        document.cookie = `${key}=${value}; path=/`;
    }
    setLocalStorage(key, value);
};

export const getCookie = (key: string): string | null => {
    if (typeof document !== "undefined") {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${key}=`);
        if (parts.length === 2) {
            const cookieVal = parts.pop()?.split(";").shift() || null;
            if (cookieVal) return cookieVal;
        }
    }
    return getLocalStorage(key);
};

export const removeCookie = (key: string) => {
    if (typeof document !== "undefined") {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    removeLocalStorage(key);
};

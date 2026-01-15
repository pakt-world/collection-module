/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { paktSDKService } from "./pakt-sdk";

/**
 * Get the authentication token from localStorage
 * @returns The auth token string or null if not found
 */
export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("pakt_auth_token");
}

/**
 * Get the initialized PaktSDK instance
 * @returns The SDK instance
 * @throws Error if SDK is not initialized
 */
export async function getPaktSDK() {
    if (!paktSDKService.getInitialized()) {
        throw new Error("PAKT SDK not initialized. Call initialize() first.");
    }
    const sdk = paktSDKService.getSDK();
    if (!sdk) {
        throw new Error("PAKT SDK not initialized");
    }
    return sdk;
}

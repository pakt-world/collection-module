/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCallback, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { paktSDKService } from "../lib/pakt-sdk";
import { triggerGlobalError } from "../lib/error-handler";
import { useCollectionStore } from "../store/collection-store";
import Logger from "../lib/logger";
import type {
    CollectionResponse,
    ICollectionSchemaDto,
    ICollectionStoreDto,
    CreateCollectionSchemaDto,
    UpdateCollectionSchemaDto,
    CreateCollectionStoreDto,
    UpdateCollectionStoreDto,
    FindCollectionSchemaDto,
    FindCollectionStoreDto,
    filterCollectionSchemaDto,
    filterCollectionStoreDto,
} from "../lib/pakt-sdk";

interface UsePaktCollectionReturn {
    // State
    schemas: ICollectionSchemaDto[] | null;
    selectedSchema: ICollectionSchemaDto | null;
    selectedSchemaReference: string | null;
    collections: FindCollectionStoreDto | null;
    collectionCount: number | null;
    loading: boolean;
    error: string | null;

    // Schema Methods
    getAllSchemas: (
        authToken: string,
        filter?: filterCollectionSchemaDto
    ) => Promise<CollectionResponse<FindCollectionSchemaDto>>;
    getSchemaById: (
        authToken: string,
        id: string
    ) => Promise<CollectionResponse<ICollectionSchemaDto>>;
    selectSchema: (schema: ICollectionSchemaDto) => void;
    createSchema: (
        payload: CreateCollectionSchemaDto
    ) => Promise<CollectionResponse<ICollectionSchemaDto>>;
    updateSchema: (
        id: string,
        payload: UpdateCollectionSchemaDto
    ) => Promise<CollectionResponse<ICollectionSchemaDto>>;
    deleteSchema: (id: string) => Promise<CollectionResponse<object>>;

    // Collection Methods
    getAllCollections: (
        authToken: string,
        schemaReference: string,
        filter?: filterCollectionStoreDto
    ) => Promise<CollectionResponse<FindCollectionStoreDto>>;
    getCollectionById: (
        authToken: string,
        schemaReference: string,
        id: string
    ) => Promise<CollectionResponse<ICollectionStoreDto>>;
    getCollectionCount: (
        authToken: string,
        schemaReference: string,
        filter?: filterCollectionStoreDto
    ) => Promise<CollectionResponse<number>>;
    createCollection: (
        authToken: string,
        schemaReference: string,
        payload: CreateCollectionStoreDto
    ) => Promise<CollectionResponse<ICollectionStoreDto>>;
    updateCollection: (
        authToken: string,
        schemaReference: string,
        id: string,
        payload: UpdateCollectionStoreDto
    ) => Promise<CollectionResponse<ICollectionStoreDto>>;
    deleteCollection: (
        authToken: string,
        schemaReference: string,
        id: string
    ) => Promise<CollectionResponse<object>>;

    // Utility Methods
    clearError: () => void;
    clearSelectedSchema: () => void;
}

/**
 * Internal hook for direct collection functionality.
 * For context-based usage, use the usePaktCollection hook from collection-context.
 * @internal
 */
export const usePaktCollectionInternal = (): UsePaktCollectionReturn => {
    const {
        schemas,
        selectedSchema,
        selectedSchemaReference,
        collections,
        collectionCount,
        setSelectedSchema,
        setSchemas,
        setCollections,
        setCollectionCount,
        clearStore,
    } = useCollectionStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper function to create error response
    const setAndTriggerError = useCallback((message: string) => {
        setError(message);
        triggerGlobalError(message);
    }, []);

    const createErrorResponse = useCallback(
        <T>(
            errorMessage: string,
            defaultMessage: string
        ): CollectionResponse<T> => {
            const message = errorMessage || defaultMessage;
            setAndTriggerError(message);
            return {
                status: "error",
                message,
                data: null as unknown as T,
                statusCode: 500,
            };
        },
        [setAndTriggerError]
    );

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Clear selected schema
    const clearSelectedSchema = useCallback(() => {
        setSelectedSchema(null);
    }, [setSelectedSchema]);

    // Select schema
    const selectSchema = useCallback(
        (schema: ICollectionSchemaDto) => {
            setSelectedSchema(schema);
        },
        [setSelectedSchema]
    );

    // Get All Schemas
    const getAllSchemas = useCallback(
        async (
            authToken: string,
            filter?: filterCollectionSchemaDto
        ): Promise<CollectionResponse<FindCollectionSchemaDto>> => {
            // Wait for SDK initialization with retry mechanism
            const maxRetries = 10;
            const retryDelay = 200;

            for (let retries = 0; retries < maxRetries; retries++) {
                if (paktSDKService.getInitialized()) {
                    break;
                }
                // eslint-disable-next-line no-await-in-loop
                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, retryDelay);
                });
            }

            if (!paktSDKService.getInitialized()) {
                Logger.error(
                    "PAKT SDK not initialized after retries. Cannot fetch schemas."
                );
                return createErrorResponse<FindCollectionSchemaDto>(
                    "SDK not initialized",
                    "Failed to get schemas"
                );
            }

            setLoading(true);
            setError(null);

            try {
                const response = await paktSDKService.getAllSchemas(
                    authToken,
                    filter
                );

                if (response.status === "success" && response.data) {
                    setSchemas(response.data.data || null);
                } else {
                    setAndTriggerError(
                        response.message || "Failed to get schemas"
                    );
                }

                return response;
            } catch (err) {
                Logger.error("Failed to get schemas:", {
                    error: err instanceof Error ? err.message : String(err),
                });
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to get schemas";
                return createErrorResponse<FindCollectionSchemaDto>(
                    errorMessage,
                    "Failed to get schemas"
                );
            } finally {
                setLoading(false);
            }
        },
        [createErrorResponse, setAndTriggerError, setSchemas]
    );

    // Get Schema By ID
    const getSchemaById = useCallback(
        async (
            authToken: string,
            id: string
        ): Promise<CollectionResponse<ICollectionSchemaDto>> => {
            setLoading(true);
            setError(null);

            try {
                const response = await paktSDKService.getSchemaById(
                    authToken,
                    id
                );

                if (response.status === "error") {
                    setAndTriggerError(
                        response.message || "Failed to get schema"
                    );
                }

                return response;
            } catch (err) {
                Logger.error("Failed to get schema:", {
                    error: err instanceof Error ? err.message : String(err),
                });
                const errorMessage =
                    err instanceof Error ? err.message : "Failed to get schema";
                return createErrorResponse<ICollectionSchemaDto>(
                    errorMessage,
                    "Failed to get schema"
                );
            } finally {
                setLoading(false);
            }
        },
        [createErrorResponse, setAndTriggerError]
    );

    // Create Schema
    const createSchema = useCallback(
        async (
            payload: CreateCollectionSchemaDto
        ): Promise<CollectionResponse<ICollectionSchemaDto>> => {
            setLoading(true);
            setError(null);

            try {
                const response = await paktSDKService.createSchema(payload);

                if (response.status === "success" && response.data) {
                    // Refresh schemas list
                    // Note: We'd need authToken to refresh, but create doesn't require it
                    // This is a limitation - caller should refresh manually
                } else {
                    setAndTriggerError(
                        response.message || "Failed to create schema"
                    );
                }

                return response;
            } catch (err) {
                Logger.error("Failed to create schema:", {
                    error: err instanceof Error ? err.message : String(err),
                });
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to create schema";
                return createErrorResponse<ICollectionSchemaDto>(
                    errorMessage,
                    "Failed to create schema"
                );
            } finally {
                setLoading(false);
            }
        },
        [createErrorResponse, setAndTriggerError]
    );

    // Update Schema
    const updateSchema = useCallback(
        async (
            id: string,
            payload: UpdateCollectionSchemaDto
        ): Promise<CollectionResponse<ICollectionSchemaDto>> => {
            setLoading(true);
            setError(null);

            try {
                const response = await paktSDKService.updateSchema(id, payload);

                if (response.status === "error") {
                    setAndTriggerError(
                        response.message || "Failed to update schema"
                    );
                }

                return response;
            } catch (err) {
                Logger.error("Failed to update schema:", {
                    error: err instanceof Error ? err.message : String(err),
                });
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to update schema";
                return createErrorResponse<ICollectionSchemaDto>(
                    errorMessage,
                    "Failed to update schema"
                );
            } finally {
                setLoading(false);
            }
        },
        [createErrorResponse, setAndTriggerError]
    );

    // Delete Schema
    const deleteSchema = useCallback(
        async (id: string): Promise<CollectionResponse<object>> => {
            setLoading(true);
            setError(null);

            try {
                const response = await paktSDKService.deleteSchema(id);

                if (response.status === "error") {
                    setAndTriggerError(
                        response.message || "Failed to delete schema"
                    );
                }

                return response;
            } catch (err) {
                Logger.error("Failed to delete schema:", {
                    error: err instanceof Error ? err.message : String(err),
                });
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to delete schema";
                return createErrorResponse<object>(
                    errorMessage,
                    "Failed to delete schema"
                );
            } finally {
                setLoading(false);
            }
        },
        [createErrorResponse, setAndTriggerError]
    );

    // Get All Collections
    const getAllCollections = useCallback(
        async (
            authToken: string,
            schemaReference: string,
            filter?: filterCollectionStoreDto
        ): Promise<CollectionResponse<FindCollectionStoreDto>> => {
            setLoading(true);
            setError(null);

            try {
                const response = await paktSDKService.getAllCollections({
                    authToken,
                    schemaReference,
                    filter,
                });

                if (response.status === "success" && response.data) {
                    setCollections(response.data);
                } else {
                    setAndTriggerError(
                        response.message || "Failed to get collections"
                    );
                }

                return response;
            } catch (err) {
                Logger.error("Failed to get collections:", {
                    error: err instanceof Error ? err.message : String(err),
                });
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to get collections";
                return createErrorResponse<FindCollectionStoreDto>(
                    errorMessage,
                    "Failed to get collections"
                );
            } finally {
                setLoading(false);
            }
        },
        [createErrorResponse, setAndTriggerError, setCollections]
    );

    // Get Collection By ID
    const getCollectionById = useCallback(
        async (
            authToken: string,
            schemaReference: string,
            id: string
        ): Promise<CollectionResponse<ICollectionStoreDto>> => {
            setLoading(true);
            setError(null);

            try {
                const response = await paktSDKService.getCollectionById({
                    authToken,
                    schemaReference,
                    id,
                });

                if (response.status === "error") {
                    setAndTriggerError(
                        response.message || "Failed to get collection"
                    );
                }

                return response;
            } catch (err) {
                Logger.error("Failed to get collection:", {
                    error: err instanceof Error ? err.message : String(err),
                });
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to get collection";
                return createErrorResponse<ICollectionStoreDto>(
                    errorMessage,
                    "Failed to get collection"
                );
            } finally {
                setLoading(false);
            }
        },
        [createErrorResponse, setAndTriggerError]
    );

    // Get Collection Count
    const getCollectionCount = useCallback(
        async (
            authToken: string,
            schemaReference: string,
            filter?: filterCollectionStoreDto
        ): Promise<CollectionResponse<number>> => {
            setLoading(true);
            setError(null);

            try {
                const response = await paktSDKService.getCollectionCount({
                    authToken,
                    schemaReference,
                    filter,
                });

                if (response.status === "success" && response.data !== null) {
                    setCollectionCount(response.data);
                } else {
                    setAndTriggerError(
                        response.message || "Failed to get collection count"
                    );
                }

                return response;
            } catch (err) {
                Logger.error("Failed to get collection count:", {
                    error: err instanceof Error ? err.message : String(err),
                });
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to get collection count";
                return createErrorResponse<number>(
                    errorMessage,
                    "Failed to get collection count"
                );
            } finally {
                setLoading(false);
            }
        },
        [createErrorResponse, setAndTriggerError, setCollectionCount]
    );

    // Create Collection
    const createCollection = useCallback(
        async (
            authToken: string,
            schemaReference: string,
            payload: CreateCollectionStoreDto
        ): Promise<CollectionResponse<ICollectionStoreDto>> => {
            setLoading(true);
            setError(null);

            try {
                const response = await paktSDKService.createCollection({
                    authToken,
                    schemaReference,
                    payload,
                });

                if (response.status === "error") {
                    setAndTriggerError(
                        response.message || "Failed to create collection"
                    );
                }

                return response;
            } catch (err) {
                Logger.error("Failed to create collection:", {
                    error: err instanceof Error ? err.message : String(err),
                });
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to create collection";
                return createErrorResponse<ICollectionStoreDto>(
                    errorMessage,
                    "Failed to create collection"
                );
            } finally {
                setLoading(false);
            }
        },
        [createErrorResponse, setAndTriggerError]
    );

    // Update Collection
    const updateCollection = useCallback(
        async (
            authToken: string,
            schemaReference: string,
            id: string,
            payload: UpdateCollectionStoreDto
        ): Promise<CollectionResponse<ICollectionStoreDto>> => {
            setLoading(true);
            setError(null);

            try {
                const response = await paktSDKService.updateCollection({
                    authToken,
                    schemaReference,
                    id,
                    payload,
                });

                if (response.status === "error") {
                    setAndTriggerError(
                        response.message || "Failed to update collection"
                    );
                }

                return response;
            } catch (err) {
                Logger.error("Failed to update collection:", {
                    error: err instanceof Error ? err.message : String(err),
                });
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to update collection";
                return createErrorResponse<ICollectionStoreDto>(
                    errorMessage,
                    "Failed to update collection"
                );
            } finally {
                setLoading(false);
            }
        },
        [createErrorResponse, setAndTriggerError]
    );

    // Delete Collection
    const deleteCollection = useCallback(
        async (
            authToken: string,
            schemaReference: string,
            id: string
        ): Promise<CollectionResponse<object>> => {
            setLoading(true);
            setError(null);

            try {
                const response = await paktSDKService.deleteCollection({
                    authToken,
                    schemaReference,
                    id,
                });

                if (response.status === "error") {
                    setAndTriggerError(
                        response.message || "Failed to delete collection"
                    );
                }

                return response;
            } catch (err) {
                Logger.error("Failed to delete collection:", {
                    error: err instanceof Error ? err.message : String(err),
                });
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to delete collection";
                return createErrorResponse<object>(
                    errorMessage,
                    "Failed to delete collection"
                );
            } finally {
                setLoading(false);
            }
        },
        [createErrorResponse, setAndTriggerError]
    );

    return {
        // State
        schemas,
        selectedSchema,
        selectedSchemaReference,
        collections,
        collectionCount,
        loading,
        error,

        // Schema Methods
        getAllSchemas,
        getSchemaById,
        selectSchema,
        createSchema,
        updateSchema,
        deleteSchema,

        // Collection Methods
        getAllCollections,
        getCollectionById,
        getCollectionCount,
        createCollection,
        updateCollection,
        deleteCollection,

        // Utility Methods
        clearError,
        clearSelectedSchema,
    };
};

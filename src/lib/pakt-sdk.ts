// Import PAKT SDK types and classes
import {
    PaktSDK,
    ResponseDto,
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
} from "@pakt/sdk";

export interface PaktSDKConfig {
    baseUrl: string;
    testnet?: boolean;
    verbose?: boolean;
}

export interface CollectionResponse<T = any> {
    status: "success" | "error";
    message: string;
    data: T;
    statusCode?: number;
    code?: number;
}

class PaktSDKService {
    private sdk: any = null;
    private config: PaktSDKConfig | null = null;
    private isInitialized: boolean = false;

    async initialize(config: PaktSDKConfig): Promise<void> {
        try {
            this.config = config;
            this.sdk = await PaktSDK.init(config);
            this.isInitialized = true;
        } catch (error) {
            this.isInitialized = false;
            throw new Error(
                `Failed to initialize PAKT SDK: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    private ensureInitialized(): any {
        if (!this.isInitialized || !this.sdk) {
            throw new Error(
                "PAKT SDK not initialized. Call initialize() first."
            );
        }
        return this.sdk;
    }

    private static createErrorResponse<T>(
        error: unknown,
        defaultMessage: string
    ): CollectionResponse<T> {
        let statusCode = 500;
        let message = defaultMessage;

        if (error instanceof Error) {
            message = error.message;

            // Extract status code from Axios errors
            if (
                typeof (error as any).response !== "undefined" &&
                (error as any).response?.status
            ) {
                statusCode = (error as any).response.status;
            }
            // Extract status code from fetch errors or other error formats
            else if (typeof (error as any).status === "number") {
                statusCode = (error as any).status;
            } else if (typeof (error as any).statusCode === "number") {
                statusCode = (error as any).statusCode;
            } else if (typeof (error as any).code === "number") {
                // Some errors use 'code' for status code
                const { code } = error as any;
                if (code >= 100 && code < 600) {
                    statusCode = code;
                }
            }
        } else if (typeof error === "object" && error !== null) {
            // Handle error objects that might have status information
            const err = error as any;
            if (typeof err.status === "number") {
                statusCode = err.status;
            } else if (typeof err.statusCode === "number") {
                statusCode = err.statusCode;
            } else if (
                typeof err.code === "number" &&
                err.code >= 100 &&
                err.code < 600
            ) {
                statusCode = err.code;
            }
            if (err.message) {
                message = err.message;
            }
        }

        return {
            status: "error",
            message,
            data: null as T,
            statusCode,
        };
    }

    // Check if SDK is initialized
    getInitialized(): boolean {
        return this.isInitialized;
    }

    // Get current config
    getConfig(): PaktSDKConfig | null {
        return this.config;
    }

    getSDK(): any {
        return this.sdk;
    }

    // Collection Schema Methods
    async getAllSchemas(
        authToken: string,
        filter?: filterCollectionSchemaDto
    ): Promise<CollectionResponse<FindCollectionSchemaDto>> {
        const sdk = this.ensureInitialized();
        try {
            const response = await sdk.collectionSchema.getAll(
                authToken,
                filter
            );
            return response as CollectionResponse<FindCollectionSchemaDto>;
        } catch (error) {
            return PaktSDKService.createErrorResponse<FindCollectionSchemaDto>(
                error,
                "Failed to get collection schemas"
            );
        }
    }

    async getSchemaById(
        authToken: string,
        id: string
    ): Promise<CollectionResponse<ICollectionSchemaDto>> {
        const sdk = this.ensureInitialized();
        try {
            const response = await sdk.collectionSchema.getById(authToken, id);
            return response as CollectionResponse<ICollectionSchemaDto>;
        } catch (error) {
            return PaktSDKService.createErrorResponse<ICollectionSchemaDto>(
                error,
                "Failed to get collection schema"
            );
        }
    }

    async createSchema(
        payload: CreateCollectionSchemaDto
    ): Promise<CollectionResponse<ICollectionSchemaDto>> {
        const sdk = this.ensureInitialized();
        try {
            const response = await sdk.collectionSchema.create(payload);
            return response as CollectionResponse<ICollectionSchemaDto>;
        } catch (error) {
            return PaktSDKService.createErrorResponse<ICollectionSchemaDto>(
                error,
                "Failed to create collection schema"
            );
        }
    }

    async updateSchema(
        id: string,
        payload: UpdateCollectionSchemaDto
    ): Promise<CollectionResponse<ICollectionSchemaDto>> {
        const sdk = this.ensureInitialized();
        try {
            const response = await sdk.collectionSchema.update(id, payload);
            return response as CollectionResponse<ICollectionSchemaDto>;
        } catch (error) {
            return PaktSDKService.createErrorResponse<ICollectionSchemaDto>(
                error,
                "Failed to update collection schema"
            );
        }
    }

    async deleteSchema(id: string): Promise<CollectionResponse<object>> {
        const sdk = this.ensureInitialized();
        try {
            const response = await sdk.collectionSchema.delete(id);
            return response as CollectionResponse<Record<string, never>>;
        } catch (error) {
            return PaktSDKService.createErrorResponse<Record<string, never>>(
                error,
                "Failed to delete collection schema"
            );
        }
    }

    // Collection Store Methods
    async getAllCollections(props: {
        authToken: string;
        schemaReference: string;
        filter?: filterCollectionStoreDto;
    }): Promise<CollectionResponse<FindCollectionStoreDto>> {
        const sdk = this.ensureInitialized();
        try {
            const response = await sdk.collectionStore.getAll(props);
            return response as CollectionResponse<FindCollectionStoreDto>;
        } catch (error) {
            return PaktSDKService.createErrorResponse<FindCollectionStoreDto>(
                error,
                "Failed to get collections"
            );
        }
    }

    async getCollectionById(props: {
        authToken: string;
        schemaReference: string;
        id: string;
    }): Promise<CollectionResponse<ICollectionStoreDto>> {
        const sdk = this.ensureInitialized();
        try {
            const response = await sdk.collectionStore.getById(props);
            return response as CollectionResponse<ICollectionStoreDto>;
        } catch (error) {
            return PaktSDKService.createErrorResponse<ICollectionStoreDto>(
                error,
                "Failed to get collection"
            );
        }
    }

    async getCollectionCount(props: {
        authToken: string;
        schemaReference: string;
        filter?: filterCollectionStoreDto;
    }): Promise<CollectionResponse<number>> {
        const sdk = this.ensureInitialized();
        try {
            const response = await sdk.collectionStore.getCount(props);
            return response as CollectionResponse<number>;
        } catch (error) {
            return PaktSDKService.createErrorResponse<number>(
                error,
                "Failed to get collection count"
            );
        }
    }

    async createCollection(props: {
        authToken: string;
        schemaReference: string;
        payload: CreateCollectionStoreDto;
    }): Promise<CollectionResponse<ICollectionStoreDto>> {
        const sdk = this.ensureInitialized();
        try {
            const response = await sdk.collectionStore.create(props);
            return response as CollectionResponse<ICollectionStoreDto>;
        } catch (error) {
            return PaktSDKService.createErrorResponse<ICollectionStoreDto>(
                error,
                "Failed to create collection"
            );
        }
    }

    async updateCollection(props: {
        authToken: string;
        schemaReference: string;
        id: string;
        payload: UpdateCollectionStoreDto;
    }): Promise<CollectionResponse<ICollectionStoreDto>> {
        const sdk = this.ensureInitialized();
        try {
            const response = await sdk.collectionStore.update(props);
            return response as CollectionResponse<ICollectionStoreDto>;
        } catch (error) {
            return PaktSDKService.createErrorResponse<ICollectionStoreDto>(
                error,
                "Failed to update collection"
            );
        }
    }

    async deleteCollection(props: {
        authToken: string;
        schemaReference: string;
        id: string;
    }): Promise<CollectionResponse<object>> {
        const sdk = this.ensureInitialized();
        try {
            const response = await sdk.collectionStore.delete(props);
            return response as CollectionResponse<object>;
        } catch (error) {
            return PaktSDKService.createErrorResponse<object>(
                error,
                "Failed to delete collection"
            );
        }
    }

    // Reset SDK state (useful for testing or re-initialization)
    reset(): void {
        this.sdk = null;
        this.config = null;
        this.isInitialized = false;
    }
}

// Export a singleton instance
export const paktSDKService = new PaktSDKService();

// Export types for use in components
export type {
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
};

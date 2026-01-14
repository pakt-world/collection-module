/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { createContext, useContext, ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

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

export interface CollectionContextType {
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

const CollectionContext = createContext<CollectionContextType | undefined>(
    undefined
);

export const useCollectionContext = (): CollectionContextType => {
    const context = useContext(CollectionContext);
    if (!context) {
        throw new Error(
            "useCollectionContext must be used within a PaktCollectionProvider"
        );
    }
    return context;
};

/**
 * Hook to access collection functionality from context.
 * This is the recommended way to use collections in components.
 * Must be used within a PaktCollectionProvider.
 */
export const usePaktCollection = (): CollectionContextType => {
    return useCollectionContext();
};

export { CollectionContext };

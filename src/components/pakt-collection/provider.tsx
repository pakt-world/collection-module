/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo, ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ConfigProvider } from "../../context/config-context";
import {
    CollectionContext,
    CollectionContextType,
} from "../../context/collection-context";
import { usePaktCollectionInternal } from "../../hooks/use-pakt-collection";
import {
    CollectionTextConfig,
    ICollectionSchemaDto,
    ICollectionStoreDto,
} from "./types";
import { ConfigContextType } from "../../types";
import "../../styles/index.css";

interface PaktCollectionProviderProps {
    config: ConfigContextType;
    textConfig?: CollectionTextConfig;
    children: ReactNode;
    onSchemaCreated?: (schema: ICollectionSchemaDto) => void;
    onSchemaUpdated?: (schema: ICollectionSchemaDto) => void;
    onSchemaDeleted?: (schemaId: string) => void;
    onCollectionCreated?: (collection: ICollectionStoreDto) => void;
    onCollectionUpdated?: (collection: ICollectionStoreDto) => void;
    onCollectionDeleted?: (collectionId: string) => void;
}

export const PaktCollectionProvider = ({
    config,
    textConfig,
    children,
    onSchemaCreated,
    onSchemaUpdated,
    onSchemaDeleted,
    onCollectionCreated,
    onCollectionUpdated,
    onCollectionDeleted,
}: PaktCollectionProviderProps) => {
    // Get all collection functionality from hook
    const collectionHook = usePaktCollectionInternal();

    const contextValue: CollectionContextType = useMemo(
        () => ({
            // State from hook
            schemas: collectionHook.schemas,
            selectedSchema: collectionHook.selectedSchema,
            selectedSchemaReference: collectionHook.selectedSchemaReference,
            collections: collectionHook.collections,
            collectionCount: collectionHook.collectionCount,
            loading: collectionHook.loading,
            error: collectionHook.error,

            // Schema methods from hook
            getAllSchemas: collectionHook.getAllSchemas,
            getSchemaById: collectionHook.getSchemaById,
            selectSchema: collectionHook.selectSchema,
            createSchema: async (payload) => {
                const response = await collectionHook.createSchema(payload);
                if (
                    response.status === "success" &&
                    response.data &&
                    onSchemaCreated
                ) {
                    onSchemaCreated(response.data);
                }
                return response;
            },
            updateSchema: async (id, payload) => {
                const response = await collectionHook.updateSchema(id, payload);
                if (
                    response.status === "success" &&
                    response.data &&
                    onSchemaUpdated
                ) {
                    onSchemaUpdated(response.data);
                }
                if (response.status === "success" && onSchemaDeleted) {
                    onSchemaDeleted(id);
                }
                return response;
            },
            deleteSchema: async (id) => {
                const response = await collectionHook.deleteSchema(id);
                if (response.status === "success" && onSchemaDeleted) {
                    onSchemaDeleted(id);
                }
                return response;
            },

            // Collection methods from hook
            getAllCollections: collectionHook.getAllCollections,
            getCollectionById: collectionHook.getCollectionById,
            getCollectionCount: collectionHook.getCollectionCount,
            createCollection: async (authToken, schemaReference, payload) => {
                const response = await collectionHook.createCollection(
                    authToken,
                    schemaReference,
                    payload
                );
                if (
                    response.status === "success" &&
                    response.data &&
                    onCollectionCreated
                ) {
                    onCollectionCreated(response.data);
                }
                return response;
            },
            updateCollection: async (
                authToken,
                schemaReference,
                id,
                payload
            ) => {
                const response = await collectionHook.updateCollection(
                    authToken,
                    schemaReference,
                    id,
                    payload
                );
                if (
                    response.status === "success" &&
                    response.data &&
                    onCollectionUpdated
                ) {
                    onCollectionUpdated(response.data);
                }
                return response;
            },
            deleteCollection: async (authToken, schemaReference, id) => {
                const response = await collectionHook.deleteCollection(
                    authToken,
                    schemaReference,
                    id
                );
                if (response.status === "success" && onCollectionDeleted) {
                    onCollectionDeleted(id);
                }
                return response;
            },

            // Utility methods
            clearError: collectionHook.clearError,
            clearSelectedSchema: collectionHook.clearSelectedSchema,
        }),
        [
            collectionHook,
            onSchemaCreated,
            onSchemaUpdated,
            onSchemaDeleted,
            onCollectionCreated,
            onCollectionUpdated,
            onCollectionDeleted,
        ]
    );

    return (
        <ConfigProvider config={config}>
            <CollectionContext.Provider value={contextValue}>
                {children}
            </CollectionContext.Provider>
        </ConfigProvider>
    );
};

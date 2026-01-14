/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ICollectionSchemaDto, FindCollectionStoreDto } from "../lib/pakt-sdk";

const COLLECTION_STORAGE_KEY = "pakt_collection_store";

interface CollectionState {
    selectedSchema: ICollectionSchemaDto | null;
    selectedSchemaReference: string | null;
    schemas: ICollectionSchemaDto[] | null;
    collections: FindCollectionStoreDto | null;
    collectionCount: number | null;
    setSelectedSchema: (schema: ICollectionSchemaDto | null) => void;
    setSchemas: (schemas: ICollectionSchemaDto[] | null) => void;
    setCollections: (collections: FindCollectionStoreDto | null) => void;
    setCollectionCount: (count: number | null) => void;
    clearStore: () => void;
}

export const useCollectionStore = create<CollectionState>()(
    persist(
        (set) => ({
            selectedSchema: null,
            selectedSchemaReference: null,
            schemas: null,
            collections: null,
            collectionCount: null,
            setSelectedSchema: (schema: ICollectionSchemaDto | null) =>
                set({
                    selectedSchema: schema,
                    selectedSchemaReference: schema?.reference || null,
                }),
            setSchemas: (schemas: ICollectionSchemaDto[] | null) =>
                set({ schemas }),
            setCollections: (collections: FindCollectionStoreDto | null) =>
                set({ collections }),
            setCollectionCount: (count: number | null) =>
                set({ collectionCount: count }),
            clearStore: () => {
                set({
                    selectedSchema: null,
                    selectedSchemaReference: null,
                    schemas: null,
                    collections: null,
                    collectionCount: null,
                });
                if (typeof window !== "undefined") {
                    localStorage.removeItem(COLLECTION_STORAGE_KEY);
                }
            },
        }),
        {
            name: COLLECTION_STORAGE_KEY,
        }
    )
);

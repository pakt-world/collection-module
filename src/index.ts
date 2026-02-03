// PaktCollectionProvider
export { PaktCollectionProvider } from "./components/pakt-collection/provider";

// Internal hook for direct usage (advanced use cases)
export { usePaktCollectionInternal } from "./hooks/use-pakt-collection";

// React Query hooks
export { useCollections } from "./hooks/use-collections";
export { useSchemas } from "./hooks/use-schemas";
export { useWallet } from "./hooks/use-wallet";
export { useEscrow } from "./hooks/use-escrow";
export { useFile } from "./hooks/use-file";

// Collection types
export type {
    CollectionSchemaData,
    CollectionStoreData,
    CollectionTextConfig,
    PaktCollectionProps,
    ICollectionSchemaDto,
    ICollectionStoreDto,
    CreateCollectionSchemaDto,
    UpdateCollectionSchemaDto,
    CreateCollectionStoreDto,
    UpdateCollectionStoreDto,
} from "./components/pakt-collection/types";

// Collection context types
export type { CollectionContextType } from "./context/collection-context";

// Configuration types
export type { ConfigContextType, ITheme } from "./types";

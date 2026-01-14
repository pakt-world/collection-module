// PaktCollectionProvider
export { PaktCollectionProvider } from "./components/pakt-collection/provider";

// Collection hook - Context-based hook (recommended)
export { usePaktCollection } from "./context/collection-context";

// Internal hook for direct usage (advanced use cases)
export { usePaktCollectionInternal } from "./hooks/use-pakt-collection";

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

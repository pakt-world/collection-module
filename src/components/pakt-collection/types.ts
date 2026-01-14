import { ConfigContextType } from "../../types";
import {
    ICollectionSchemaDto,
    ICollectionStoreDto,
    CreateCollectionSchemaDto,
    UpdateCollectionSchemaDto,
    CreateCollectionStoreDto,
    UpdateCollectionStoreDto,
} from "../../lib/pakt-sdk";

export type CollectionSchemaData = ICollectionSchemaDto;

export type CollectionStoreData = ICollectionStoreDto;

export interface CollectionTextConfig {
    title?: string;
    description?: string;
}

export interface PaktCollectionProps {
    config: ConfigContextType;
    textConfig?: CollectionTextConfig;
    onSchemaCreated?: (schema: ICollectionSchemaDto) => void;
    onSchemaUpdated?: (schema: ICollectionSchemaDto) => void;
    onSchemaDeleted?: (schemaId: string) => void;
    onCollectionCreated?: (collection: ICollectionStoreDto) => void;
    onCollectionUpdated?: (collection: ICollectionStoreDto) => void;
    onCollectionDeleted?: (collectionId: string) => void;
}

export type {
    ICollectionSchemaDto,
    ICollectionStoreDto,
    CreateCollectionSchemaDto,
    UpdateCollectionSchemaDto,
    CreateCollectionStoreDto,
    UpdateCollectionStoreDto,
};

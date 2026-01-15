/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
    ResponseDto,
    ICollectionStoreDto,
    CreateCollectionStoreDto,
    UpdateCollectionStoreDto,
    FindCollectionStoreDto,
    filterCollectionStoreDto,
} from "@pakt/sdk";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { getToken, getPaktSDK } from "../lib/pakt-sdk-helpers";

export function useCollections(schemaReference: string) {
    const queryClient = useQueryClient();
    const authToken = getToken();

    /* -------------------- Queries -------------------- */
    const useCollectionsQuery = (filter?: filterCollectionStoreDto) =>
        useQuery({
            queryKey: ["collections", schemaReference, filter, authToken],
            queryFn: async (): Promise<ResponseDto<FindCollectionStoreDto>> => {
                const sdk = await getPaktSDK();
                return await sdk.collectionStore.getAll({
                    authToken: authToken || "",
                    schemaReference,
                    filter,
                });
            },
            enabled: !!schemaReference,
        });

    const getCountQuery = useQuery({
        queryKey: ["collections-count", schemaReference, authToken],
        queryFn: async (): Promise<ResponseDto<number>> => {
            const sdk = await getPaktSDK();
            return await sdk.collectionStore.getCount({
                authToken: authToken || "",
                schemaReference,
            });
        },
        enabled: !!schemaReference,
    });

    const useCollectionById = (id: string) =>
        useQuery({
            queryKey: ["collection", schemaReference, id, authToken],
            queryFn: async (): Promise<ResponseDto<ICollectionStoreDto>> => {
                const sdk = await getPaktSDK();
                return await sdk.collectionStore.getById({
                    authToken: authToken || "",
                    schemaReference,
                    id,
                });
            },
            enabled: !!schemaReference && !!id,
        });

    /* -------------------- Mutations -------------------- */

    const createCollection = useMutation({
        mutationFn: async (
            payload: CreateCollectionStoreDto
        ): Promise<ResponseDto<ICollectionStoreDto>> => {
            const sdk = await getPaktSDK();
            return await sdk.collectionStore.create({
                authToken: authToken || "",
                schemaReference,
                payload,
            });
        },
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    queryKey: ["collections", schemaReference],
                })
                .catch(() => {
                    // Error handling is done by React Query
                });
            queryClient
                .invalidateQueries({
                    queryKey: ["collections-count", schemaReference],
                })
                .catch(() => {
                    // Error handling is done by React Query
                });
        },
    });

    const updateCollection = useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateCollectionStoreDto;
        }): Promise<ResponseDto<ICollectionStoreDto>> => {
            const sdk = await getPaktSDK();
            return await sdk.collectionStore.update({
                authToken: authToken || "",
                schemaReference,
                id,
                payload,
            });
        },
        onSuccess: (
            _data: unknown,
            variables: { id: string; payload: UpdateCollectionStoreDto }
        ) => {
            queryClient
                .invalidateQueries({
                    queryKey: ["collections", schemaReference],
                })
                .catch(() => {
                    // Error handling is done by React Query
                });
            queryClient
                .invalidateQueries({
                    queryKey: ["collection", schemaReference, variables.id],
                })
                .catch(() => {
                    // Error handling is done by React Query
                });
            queryClient
                .invalidateQueries({
                    queryKey: ["collections-count", schemaReference],
                })
                .catch(() => {
                    // Error handling is done by React Query
                });
        },
    });

    const deleteCollection = useMutation({
        mutationFn: async (id: string): Promise<ResponseDto<object>> => {
            const sdk = await getPaktSDK();
            return await sdk.collectionStore.delete({
                authToken: authToken || "",
                schemaReference,
                id,
            });
        },
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    queryKey: ["collections", schemaReference],
                })
                .catch(() => {
                    // Error handling is done by React Query
                });
            queryClient
                .invalidateQueries({
                    queryKey: ["collections-count", schemaReference],
                })
                .catch(() => {
                    // Error handling is done by React Query
                });
        },
    });

    return {
        /* queries */
        getCountQuery,
        useCollectionsQuery,
        useCollectionById,

        /* mutations */
        createCollection,
        updateCollection,
        deleteCollection,
    };
}

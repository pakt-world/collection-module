/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
    ResponseDto,
    ICollectionSchemaDto,
    CreateCollectionSchemaDto,
    UpdateCollectionSchemaDto,
    FindCollectionSchemaDto,
    filterCollectionSchemaDto,
} from "@pakt/sdk";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { getToken, getPaktSDK } from "../lib/pakt-sdk-helpers";

export function useSchemas() {
    const queryClient = useQueryClient();
    const authToken = getToken();

    /* -------------------- Queries -------------------- */
    const useSchemasQuery = (filter?: filterCollectionSchemaDto) =>
        useQuery({
            queryKey: ["schemas", filter, authToken],
            queryFn: async (): Promise<
                ResponseDto<FindCollectionSchemaDto>
            > => {
                const sdk = await getPaktSDK();
                return await sdk.collectionSchema.getAll(
                    authToken || "",
                    filter
                );
            },
        });

    const useSchemaById = (id: string) =>
        useQuery({
            queryKey: ["schema", id, authToken],
            queryFn: async (): Promise<ResponseDto<ICollectionSchemaDto>> => {
                const sdk = await getPaktSDK();
                return await sdk.collectionSchema.getById(authToken || "", id);
            },
            enabled: !!id,
        });

    /* -------------------- Mutations -------------------- */

    const createSchema = useMutation({
        mutationFn: async (
            payload: CreateCollectionSchemaDto
        ): Promise<ResponseDto<ICollectionSchemaDto>> => {
            const sdk = await getPaktSDK();
            return await sdk.collectionSchema.create(payload);
        },
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    queryKey: ["schemas"],
                })
                .catch(() => {
                    // Error handling is done by React Query
                });
        },
    });

    const updateSchema = useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateCollectionSchemaDto;
        }): Promise<ResponseDto<ICollectionSchemaDto>> => {
            const sdk = await getPaktSDK();
            return await sdk.collectionSchema.update(id, payload);
        },
        onSuccess: (
            _data: unknown,
            variables: { id: string; payload: UpdateCollectionSchemaDto }
        ) => {
            queryClient
                .invalidateQueries({
                    queryKey: ["schemas"],
                })
                .catch(() => {
                    // Error handling is done by React Query
                });
            queryClient
                .invalidateQueries({
                    queryKey: ["schema", variables.id],
                })
                .catch(() => {
                    // Error handling is done by React Query
                });
        },
    });

    const deleteSchema = useMutation({
        mutationFn: async (id: string): Promise<ResponseDto<object>> => {
            const sdk = await getPaktSDK();
            return await sdk.collectionSchema.delete(id);
        },
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    queryKey: ["schemas"],
                })
                .catch(() => {
                    // Error handling is done by React Query
                });
        },
    });

    return {
        /* queries */
        useSchemasQuery,
        useSchemaById,

        /* mutations */
        createSchema,
        updateSchema,
        deleteSchema,
    };
}

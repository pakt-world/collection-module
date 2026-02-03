/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
    ResponseDto,
    IUploadDto,
    CreateFileUpload,
    FindUploadDto,
    FilterUploadDto,
} from "@pakt/sdk";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { getToken, getPaktSDK } from "../lib/pakt-sdk-helpers";

export function useFile() {
    const queryClient = useQueryClient();
    const authToken = getToken() || "";

    /* -------------------- Queries -------------------- */

    const useFileUploadsQuery = (filter?: FilterUploadDto) =>
        useQuery({
            queryKey: ["file-uploads", filter, authToken],
            queryFn: async (): Promise<ResponseDto<FindUploadDto>> => {
                const sdk = await getPaktSDK();
                return await sdk.file.getFileUploads(authToken, filter);
            },
        });

    const useFileUploadById = (id: string) =>
        useQuery({
            queryKey: ["file-upload", id, authToken],
            queryFn: async (): Promise<ResponseDto<IUploadDto>> => {
                const sdk = await getPaktSDK();
                return await sdk.file.getAFileUpload(authToken, id);
            },
            enabled: !!id,
        });

    /* -------------------- Mutations -------------------- */

    const fileUpload = useMutation({
        mutationFn: async (
            payload: CreateFileUpload
        ): Promise<ResponseDto<IUploadDto>> => {
            const sdk = await getPaktSDK();
            return await sdk.file.fileUpload(authToken, payload);
        },
        onSuccess: () => {
            queryClient
                .invalidateQueries({ queryKey: ["file-uploads"] })
                .catch(() => {});
        },
    });

    return {
        /* queries */
        useFileUploadsQuery,
        useFileUploadById,

        /* mutations */
        fileUpload,
    };
}

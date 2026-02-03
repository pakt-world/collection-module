/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
    ResponseDto,
    IPaymentDataDto,
    ICreatePaymentDto,
    IValidatePaymentDto,
    IReleasePaymentDto,
    IBlockchainCoinDto,
    IRPCDto,
} from "@pakt/sdk";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { getToken, getPaktSDK } from "../lib/pakt-sdk-helpers";

export function useEscrow() {
    const queryClient = useQueryClient();
    const authToken = getToken() || "";

    /* -------------------- Queries -------------------- */

    const usePaymentMethodsQuery = () =>
        useQuery({
            queryKey: ["payment-methods", authToken],
            queryFn: async (): Promise<
                ResponseDto<IBlockchainCoinDto[]>
            > => {
                const sdk = await getPaktSDK();
                return await sdk.escrow.paymentMethods(authToken);
            },
        });

    const useActiveRpcQuery = () =>
        useQuery({
            queryKey: ["payment-rpc", authToken],
            queryFn: async (): Promise<ResponseDto<IRPCDto>> => {
                const sdk = await getPaktSDK();
                return await sdk.escrow.activeRpc(authToken);
            },
        });

    /* -------------------- Mutations -------------------- */

    const createPayment = useMutation({
        mutationFn: async (
            payload: ICreatePaymentDto
        ): Promise<ResponseDto<IPaymentDataDto>> => {
            const sdk = await getPaktSDK();
            return await sdk.escrow.create(authToken, payload);
        },
        onSuccess: () => {
            queryClient
                .invalidateQueries({ queryKey: ["payment-methods"] })
                .catch(() => {});
        },
    });

    const validatePayment = useMutation({
        mutationFn: async (
            payload: IValidatePaymentDto
        ): Promise<ResponseDto<object>> => {
            const sdk = await getPaktSDK();
            return await sdk.escrow.validate(authToken, payload);
        },
    });

    const releasePayment = useMutation({
        mutationFn: async (
            payload: IReleasePaymentDto
        ): Promise<ResponseDto<object>> => {
            const sdk = await getPaktSDK();
            return await sdk.escrow.release(authToken, payload);
        },
    });

    return {
        /* queries */
        usePaymentMethodsQuery,
        useActiveRpcQuery,

        /* mutations */
        createPayment,
        validatePayment,
        releasePayment,
    };
}

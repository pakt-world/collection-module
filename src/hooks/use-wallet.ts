/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    ResponseDto,
    IWalletResponseDto,
    ISingleWalletDto,
    IWalletExchangeDto,
    FindTransactionsDto,
    ITransactionDto,
    ITransactionStatsDto,
    AggTxns,
} from "@pakt/sdk";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { getToken, getPaktSDK } from "../lib/pakt-sdk-helpers";

export function useWallet() {
    const queryClient = useQueryClient();
    const authToken = getToken() || "";

    /* -------------------- Wallet Queries -------------------- */

    const useWalletsQuery = () =>
        useQuery({
            queryKey: ["wallets", authToken],
            queryFn: async (): Promise<ResponseDto<IWalletResponseDto>> => {
                const sdk = await getPaktSDK();
                return await sdk.wallet.getWallets(authToken);
            },
        });

    const useWalletById = (id: string) =>
        useQuery({
            queryKey: ["wallet", id, authToken],
            queryFn: async (): Promise<ResponseDto<ISingleWalletDto>> => {
                const sdk = await getPaktSDK();
                return await sdk.wallet.getSingleWalletById(authToken, id);
            },
            enabled: !!id,
        });

    const useWalletByCoin = (coin: string) =>
        useQuery({
            queryKey: ["wallet", "coin", coin, authToken],
            queryFn: async (): Promise<ResponseDto<ISingleWalletDto>> => {
                const sdk = await getPaktSDK();
                return await sdk.wallet.getSingleWalletByCoin(authToken, coin);
            },
            enabled: !!coin,
        });

    const useExchangeQuery = () =>
        useQuery({
            queryKey: ["wallet-exchange", authToken],
            queryFn: async (): Promise<ResponseDto<IWalletExchangeDto>> => {
                const sdk = await getPaktSDK();
                return await sdk.wallet.getExchange(authToken);
            },
        });

    /* -------------------- Transaction Queries -------------------- */

    const useTransactionsQuery = () =>
        useQuery({
            queryKey: ["transactions", authToken],
            queryFn: async (): Promise<ResponseDto<FindTransactionsDto>> => {
                const sdk = await getPaktSDK();
                return await sdk.wallet.getTransactions(authToken);
            },
        });

    const useTransactionById = (id: string) =>
        useQuery({
            queryKey: ["transaction", id, authToken],
            queryFn: async (): Promise<ResponseDto<ITransactionDto>> => {
                const sdk = await getPaktSDK();
                return await sdk.wallet.getATransaction(authToken, id);
            },
            enabled: !!id,
        });

    const useTransactionStatsQuery = () =>
        useQuery({
            queryKey: ["transaction-stats", authToken],
            queryFn: async (): Promise<ResponseDto<ITransactionStatsDto[]>> => {
                const sdk = await getPaktSDK();
                return await sdk.wallet.getTransactionStats(authToken);
            },
        });

    const useAggregateTransactionStatsQuery = () =>
        useQuery({
            queryKey: ["transaction-aggregate-stats", authToken],
            queryFn: async (): Promise<ResponseDto<AggTxns[]>> => {
                const sdk = await getPaktSDK();
                return await sdk.wallet.getAggregateTransactionStats(authToken);
            },
        });

    /* -------------------- Cache Invalidation -------------------- */

    const invalidateWalletQueries = () =>
        queryClient.invalidateQueries({ queryKey: ["wallets"] }).catch(() => {});

    const invalidateTransactionQueries = () =>
        queryClient
            .invalidateQueries({ queryKey: ["transactions"] })
            .catch(() => {});

    return {
        /* wallet queries */
        useWalletsQuery,
        useWalletById,
        useWalletByCoin,
        useExchangeQuery,

        /* transaction queries */
        useTransactionsQuery,
        useTransactionById,
        useTransactionStatsQuery,
        useAggregateTransactionStatsQuery,

        /* cache invalidation */
        invalidateWalletQueries,
        invalidateTransactionQueries,
    };
}

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import Logger from "../lib/logger";
import { PaktCollectionProvider } from "../components/pakt-collection/provider";
import { useSchemas } from "../hooks/use-schemas";
import { useCollections } from "../hooks/use-collections";
import type {
    ICollectionSchemaDto,
    ICollectionStoreDto,
    CreateCollectionStoreDto,
    UpdateCollectionStoreDto,
} from "../lib/pakt-sdk";

const AppContent = () => {
    const [authToken, setAuthToken] = useState<string>("");
    const [tokenInput, setTokenInput] = useState<string>("");
    const [selectedSchema, setSelectedSchema] =
        useState<ICollectionSchemaDto | null>(null);
    const [filter] = useState<Record<string, unknown> | undefined>(undefined);

    // Use React Query hooks
    const {
        useSchemasQuery,
        useSchemaById,
        createSchema,
        updateSchema,
        deleteSchema,
    } = useSchemas();

    const schemasQuery = useSchemasQuery(filter);

    // Collections hook - always call hooks, but use enabled flag
    const collectionsHook = useCollections(selectedSchema?.reference || "");

    const collectionsQuery = collectionsHook.useCollectionsQuery(filter);
    const countQuery = collectionsHook.getCountQuery;
    const [selectedCollectionId, setSelectedCollectionId] =
        useState<string>("");
    const collectionByIdQuery = collectionsHook.useCollectionById(
        selectedCollectionId || ""
    );

    // Form states
    const [createPayload, setCreatePayload] = useState<string>("{}");
    const [updateId, setUpdateId] = useState<string>("");
    const [updatePayload, setUpdatePayload] = useState<string>("{}");
    const [deleteId, setDeleteId] = useState<string>("");
    const [getByIdId, setGetByIdId] = useState<string>("");

    useEffect(() => {
        // Try to get token from localStorage
        const storedToken = localStorage.getItem("pakt_auth_token") || "";
        if (storedToken) {
            setAuthToken(storedToken);
        }
    }, []);

    const handleSetToken = () => {
        if (tokenInput.trim()) {
            setAuthToken(tokenInput.trim());
            localStorage.setItem("pakt_auth_token", tokenInput.trim());
            // Refetch queries when token changes
            schemasQuery.refetch().catch(() => {
                // Error handling is done by React Query
            });
        }
    };

    const handleSelectSchema = (schema: ICollectionSchemaDto) => {
        setSelectedSchema(schema);
        setSelectedCollectionId(""); // Reset selected collection
    };

    const handleCreateCollection = () => {
        if (!selectedSchema?.reference) {
            // eslint-disable-next-line no-alert
            alert("Please select a schema first");
            return;
        }

        try {
            const payload = JSON.parse(createPayload) as Record<
                string,
                unknown
            >;
            collectionsHook.createCollection.mutate(
                payload as CreateCollectionStoreDto,
                {
                    onSuccess: (response) => {
                        Logger.info("Collection created:", response);
                        setCreatePayload("{}");
                    },
                    onError: (error) => {
                        // eslint-disable-next-line no-alert
                        alert(
                            `Failed to create collection: ${
                                error instanceof Error
                                    ? error.message
                                    : String(error)
                            }`
                        );
                    },
                }
            );
        } catch (err) {
            // eslint-disable-next-line no-alert
            alert(
                `Invalid JSON payload: ${
                    err instanceof Error ? err.message : String(err)
                }`
            );
        }
    };

    const handleUpdateCollection = () => {
        if (!selectedSchema?.reference || !updateId) {
            // eslint-disable-next-line no-alert
            alert("Please select a schema and enter collection ID");
            return;
        }

        try {
            const payload = JSON.parse(updatePayload) as Record<
                string,
                unknown
            >;
            collectionsHook.updateCollection.mutate(
                { id: updateId, payload },
                {
                    onSuccess: (response) => {
                        Logger.info("Collection updated:", {
                            response: response as Record<string, unknown>,
                        });
                        setUpdateId("");
                        setUpdatePayload("{}");
                    },
                    onError: (error) => {
                        // eslint-disable-next-line no-alert
                        alert(
                            `Failed to update collection: ${
                                error instanceof Error
                                    ? error.message
                                    : String(error)
                            }`
                        );
                    },
                }
            );
        } catch (err) {
            // eslint-disable-next-line no-alert
            alert(
                `Invalid JSON payload: ${
                    err instanceof Error ? err.message : String(err)
                }`
            );
        }
    };

    const handleDeleteCollection = () => {
        if (!selectedSchema?.reference || !deleteId) {
            // eslint-disable-next-line no-alert
            alert("Please select a schema and enter collection ID");
            return;
        }

        collectionsHook.deleteCollection.mutate(deleteId, {
            onSuccess: (response) => {
                Logger.info("Collection deleted:", response);
                setDeleteId("");
            },
            onError: (error) => {
                // eslint-disable-next-line no-alert
                alert(
                    `Failed to delete collection: ${
                        error instanceof Error ? error.message : String(error)
                    }`
                );
            },
        });
    };

    const handleGetCollectionById = () => {
        if (!getByIdId) {
            // eslint-disable-next-line no-alert
            alert("Please enter collection ID");
            return;
        }
        setSelectedCollectionId(getByIdId);
    };

    // Extract schemas array from nested response structure
    // ResponseDto<FindCollectionSchemaDto> -> FindCollectionSchemaDto.schemas -> ICollectionSchemaDto[]
    // Response structure: { data: { schemas: [...], total, page, limit }, status, message, code }
    // Note: API returns 'schemas' but type definition may say 'data', so we check both
    const schemas =
        (schemasQuery.data?.data as any)?.schemas ||
        (schemasQuery.data?.data as any)?.data ||
        null;
    const collections = collectionsQuery?.data?.data?.data || null;
    const collectionCount = countQuery?.data?.data || null;

    return (
        <div className="pka:min-h-screen pka:bg-gradient-to-br pka:from-blue-900 pka:via-purple-900 pka:to-indigo-900 pka:p-4">
            <div className="pka:max-w-6xl pka:mx-auto pka:text-white">
                <h1 className="pka:mb-4 pka:text-4xl pka:font-bold pka:text-center">
                    Pakt Collection Module Demo
                </h1>
                <p className="pka:mb-8 pka:text-lg pka:text-gray-300 pka:text-center">
                    Manage collection schemas and collections
                </p>

                {/* Instructions */}
                <div className="pka:mb-6 pka:rounded-lg pka:bg-blue-500/20 pka:border pka:border-blue-400 pka:p-4">
                    <h3 className="pka:text-lg pka:font-semibold pka:mb-2">
                        How to Test:
                    </h3>
                    <ol className="pka:list-decimal pka:list-inside pka:space-y-1 pka:text-sm pka:text-gray-200">
                        <li>
                            Enter your authentication token in the field below
                        </li>
                        <li>Click &quot;Set Token&quot; to save it</li>
                        <li>
                            Click &quot;Load Schemas&quot; to fetch available
                            schemas
                        </li>
                        <li>Click on a schema to select it</li>
                        <li>
                            Once a schema is selected, you can:
                            <ul className="pka:list-disc pka:list-inside pka:ml-4 pka:mt-1">
                                <li>View collections (automatically loaded)</li>
                                <li>Create new collections</li>
                                <li>
                                    Get, update, or delete collections by ID
                                </li>
                            </ul>
                        </li>
                    </ol>
                </div>

                {/* Auth Token Input */}
                <div className="pka:mb-6 pka:rounded-lg pka:bg-white/10 pka:p-4 pka:backdrop-blur-sm">
                    <h2 className="pka:mb-2 pka:text-xl pka:font-semibold">
                        Authentication Token
                    </h2>
                    <div className="pka:flex pka:gap-2">
                        <input
                            type="text"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                            placeholder="Enter auth token"
                            className="pka:flex-1 pka:rounded pka:px-3 pka:py-2 pka:text-gray-900"
                        />
                        <button
                            type="button"
                            onClick={handleSetToken}
                            className="pka:rounded-lg pka:bg-white pka:px-6 pka:py-2 pka:font-semibold pka:text-blue-900 pka:transition-colors pka:hover:bg-gray-100"
                        >
                            Set Token
                        </button>
                    </div>
                    {authToken && (
                        <p className="pka:mt-2 pka:text-sm pka:text-gray-300">
                            Token set: {authToken.substring(0, 20)}...
                        </p>
                    )}
                </div>

                {/* Error Display */}
                {schemasQuery.error && (
                    <div className="pka:mb-4 pka:rounded-lg pka:bg-red-500/20 pka:border pka:border-red-500 pka:p-4">
                        <p className="pka:text-red-200">
                            Schemas Error:{" "}
                            {schemasQuery.error instanceof Error
                                ? schemasQuery.error.message
                                : String(schemasQuery.error)}
                        </p>
                    </div>
                )}

                {collectionsQuery?.error && (
                    <div className="pka:mb-4 pka:rounded-lg pka:bg-red-500/20 pka:border pka:border-red-500 pka:p-4">
                        <p className="pka:text-red-200">
                            Collections Error:{" "}
                            {collectionsQuery.error instanceof Error
                                ? collectionsQuery.error.message
                                : String(collectionsQuery.error)}
                        </p>
                    </div>
                )}

                {/* Loading Indicator */}
                {(schemasQuery.isLoading ||
                    collectionsQuery?.isLoading ||
                    countQuery?.isLoading) && (
                    <div className="pka:mb-4 pka:text-center pka:text-gray-300">
                        Loading...
                    </div>
                )}

                {/* Schemas Section */}
                <div className="pka:mb-6 pka:rounded-lg pka:bg-white/10 pka:p-6 pka:backdrop-blur-sm">
                    <div className="pka:flex pka:items-center pka:justify-between pka:mb-4">
                        <h2 className="pka:text-2xl pka:font-semibold">
                            Collection Schemas
                        </h2>
                        <button
                            type="button"
                            onClick={() => schemasQuery.refetch()}
                            disabled={!authToken || schemasQuery.isLoading}
                            className="pka:rounded-lg pka:bg-white pka:px-4 pka:py-2 pka:font-semibold pka:text-blue-900 pka:transition-colors pka:hover:bg-gray-100 pka:disabled:opacity-50"
                        >
                            Load Schemas
                        </button>
                    </div>

                    {schemasQuery.data && (
                        <div className="pka:rounded pka:p-3 pka:bg-white/5 pka:mb-4">
                            <div className="pka:mb-2 pka:font-semibold">
                                Schemas API Response:
                            </div>
                            <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-96 pka:bg-black/20 pka:p-3 pka:rounded">
                                {JSON.stringify(schemasQuery.data, null, 2)}
                            </pre>
                            <div className="pka:mt-2 pka:text-xs pka:text-gray-400">
                                Found{" "}
                                {schemas
                                    ? `${schemas.length} schema(s)`
                                    : "0 schemas"}
                            </div>
                        </div>
                    )}

                    {schemas && schemas.length > 0 ? (
                        <div className="pka:space-y-2">
                            {schemas.map((schema: ICollectionSchemaDto) => (
                                <div
                                    key={schema._id}
                                    className={`pka:rounded pka:p-3 pka:cursor-pointer pka:transition-colors ${
                                        selectedSchema?._id === schema._id
                                            ? "pka:bg-blue-500/30"
                                            : "pka:bg-white/5 pka:hover:bg-white/10"
                                    }`}
                                    onClick={() => handleSelectSchema(schema)}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            handleSelectSchema(schema);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="pka:font-semibold">
                                        {schema.name}
                                    </div>
                                    <div className="pka:text-sm pka:text-gray-300">
                                        Reference: {schema.reference}
                                    </div>
                                    {schema.description && (
                                        <div className="pka:text-sm pka:text-gray-400 pka:mt-1">
                                            {schema.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : schemasQuery.isSuccess ? (
                        schemas?.length === 0 ? (
                            <div className="pka:rounded pka:p-4 pka:bg-yellow-500/20 pka:border pka:border-yellow-400">
                                <p className="pka:text-yellow-200 pka:font-semibold">
                                    No schemas found.
                                </p>
                                <p className="pka:text-yellow-300 pka:text-sm pka:mt-1">
                                    Make sure your auth token is valid and you
                                    have schemas created in your account.
                                </p>
                            </div>
                        ) : (
                            <div className="pka:rounded pka:p-4 pka:bg-orange-500/20 pka:border pka:border-orange-400">
                                <p className="pka:text-orange-200 pka:font-semibold">
                                    Response received but schemas array not
                                    found
                                </p>
                                <p className="pka:text-orange-300 pka:text-sm pka:mt-1">
                                    Check the response structure above. Expected
                                    path: response.data.schemas
                                </p>
                            </div>
                        )
                    ) : schemasQuery.isError ? (
                        <div className="pka:rounded pka:p-4 pka:bg-red-500/20 pka:border pka:border-red-400">
                            <p className="pka:text-red-200 pka:font-semibold">
                                Error loading schemas
                            </p>
                            <p className="pka:text-red-300 pka:text-sm pka:mt-1">
                                Check your auth token and try again.
                            </p>
                        </div>
                    ) : (
                        <div className="pka:rounded pka:p-4 pka:bg-gray-500/20 pka:border pka:border-gray-400">
                            <p className="pka:text-gray-300">
                                No schemas loaded. Click &quot;Load
                                Schemas&quot; to fetch.
                            </p>
                            {!authToken && (
                                <p className="pka:text-gray-400 pka:text-sm pka:mt-1">
                                    ⚠️ Please set an auth token first
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Collections Section */}
                {selectedSchema ? (
                    <div className="pka:space-y-4">
                        <div className="pka:rounded-lg pka:bg-green-500/20 pka:border pka:border-green-400 pka:p-4 pka:mb-4">
                            <p className="pka:text-green-200 pka:font-semibold">
                                ✓ Schema Selected: {selectedSchema.name}
                            </p>
                            <p className="pka:text-green-300 pka:text-sm pka:mt-1">
                                Reference: {selectedSchema.reference}
                            </p>
                        </div>
                        <div className="pka:rounded-lg pka:bg-white/10 pka:p-6 pka:backdrop-blur-sm">
                            <div className="pka:flex pka:items-center pka:justify-between pka:mb-4">
                                <h2 className="pka:text-2xl pka:font-semibold">
                                    Collection Store Operations (
                                    {selectedSchema.name})
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedSchema(null);
                                        setSelectedCollectionId("");
                                    }}
                                    className="pka:rounded-lg pka:bg-red-500/20 pka:px-4 pka:py-2 pka:font-semibold pka:text-red-200 pka:transition-colors pka:hover:bg-red-500/30"
                                >
                                    Clear Selection
                                </button>
                            </div>

                            {/* Collections Response */}
                            {collectionsQuery?.data && (
                                <div className="pka:mb-4 pka:p-4 pka:bg-white/5 pka:rounded">
                                    <div className="pka:mb-2 pka:font-semibold">
                                        GetAll Collections Response:
                                    </div>
                                    <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-48 pka:bg-black/20 pka:p-2 pka:rounded">
                                        {JSON.stringify(
                                            collectionsQuery.data,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                            )}

                            {/* Collection Count Response */}
                            {countQuery?.data && (
                                <div className="pka:mb-4 pka:p-4 pka:bg-white/5 pka:rounded">
                                    <div className="pka:mb-2 pka:font-semibold">
                                        Collection Count Response:
                                    </div>
                                    <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-48 pka:bg-black/20 pka:p-2 pka:rounded">
                                        {JSON.stringify(
                                            countQuery.data,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                            )}

                            {/* Create Collection */}
                            <div className="pka:mb-4 pka:p-4 pka:bg-white/5 pka:rounded">
                                <h3 className="pka:text-lg pka:font-semibold pka:mb-2">
                                    Create Collection
                                </h3>
                                <div className="pka:space-y-2">
                                    <textarea
                                        value={createPayload}
                                        onChange={(e) =>
                                            setCreatePayload(e.target.value)
                                        }
                                        placeholder='{"field1": "value1", "field2": "value2"}'
                                        className="pka:w-full pka:rounded pka:px-3 pka:py-2 pka:text-gray-900 pka:font-mono pka:text-sm"
                                        rows={4}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCreateCollection}
                                        disabled={
                                            !authToken ||
                                            collectionsHook.createCollection
                                                .isPending
                                        }
                                        className="pka:rounded-lg pka:bg-green-500 pka:px-4 pka:py-2 pka:font-semibold pka:text-white pka:transition-colors pka:hover:bg-green-600 pka:disabled:opacity-50"
                                    >
                                        {collectionsHook.createCollection
                                            .isPending
                                            ? "Creating..."
                                            : "Create Collection"}
                                    </button>
                                </div>
                                {collectionsHook.createCollection.data && (
                                    <div className="pka:mt-3">
                                        <div className="pka:mb-1 pka:font-semibold pka:text-sm">
                                            Create Response:
                                        </div>
                                        <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-48 pka:bg-black/20 pka:p-2 pka:rounded">
                                            {String(
                                                JSON.stringify(
                                                    collectionsHook
                                                        .createCollection
                                                        .data as unknown,
                                                    null,
                                                    2
                                                ) || ""
                                            )}
                                        </pre>
                                    </div>
                                )}
                                {collectionsHook.createCollection.error && (
                                    <div className="pka:mt-3 pka:text-red-300 pka:text-sm">
                                        Error:{" "}
                                        {collectionsHook.createCollection
                                            .error instanceof Error
                                            ? collectionsHook.createCollection
                                                  .error.message
                                            : String(
                                                  collectionsHook
                                                      .createCollection.error
                                              )}
                                    </div>
                                )}
                            </div>

                            {/* Get Collection By ID */}
                            <div className="pka:mb-4 pka:p-4 pka:bg-white/5 pka:rounded">
                                <h3 className="pka:text-lg pka:font-semibold pka:mb-2">
                                    Get Collection By ID
                                </h3>
                                <div className="pka:flex pka:gap-2">
                                    <input
                                        type="text"
                                        value={getByIdId}
                                        onChange={(e) =>
                                            setGetByIdId(e.target.value)
                                        }
                                        placeholder="Enter collection ID"
                                        className="pka:flex-1 pka:rounded pka:px-3 pka:py-2 pka:text-gray-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleGetCollectionById}
                                        disabled={!getByIdId}
                                        className="pka:rounded-lg pka:bg-blue-500 pka:px-4 pka:py-2 pka:font-semibold pka:text-white pka:transition-colors pka:hover:bg-blue-600 pka:disabled:opacity-50"
                                    >
                                        Get By ID
                                    </button>
                                </div>
                                {collectionByIdQuery?.data && (
                                    <div className="pka:mt-3">
                                        <div className="pka:mb-1 pka:font-semibold pka:text-sm">
                                            Get By ID Response:
                                        </div>
                                        <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-48 pka:bg-black/20 pka:p-2 pka:rounded">
                                            {JSON.stringify(
                                                collectionByIdQuery.data,
                                                null,
                                                2
                                            )}
                                        </pre>
                                    </div>
                                )}
                                {collectionByIdQuery?.error && (
                                    <div className="pka:mt-3 pka:text-red-300 pka:text-sm">
                                        Error:{" "}
                                        {collectionByIdQuery.error instanceof
                                        Error
                                            ? collectionByIdQuery.error.message
                                            : String(collectionByIdQuery.error)}
                                    </div>
                                )}
                            </div>

                            {/* Update Collection */}
                            <div className="pka:mb-4 pka:p-4 pka:bg-white/5 pka:rounded">
                                <h3 className="pka:text-lg pka:font-semibold pka:mb-2">
                                    Update Collection
                                </h3>
                                <div className="pka:space-y-2">
                                    <input
                                        type="text"
                                        value={updateId}
                                        onChange={(e) =>
                                            setUpdateId(e.target.value)
                                        }
                                        placeholder="Enter collection ID"
                                        className="pka:w-full pka:rounded pka:px-3 pka:py-2 pka:text-gray-900"
                                    />
                                    <textarea
                                        value={updatePayload}
                                        onChange={(e) =>
                                            setUpdatePayload(e.target.value)
                                        }
                                        placeholder='{"field1": "newValue"}'
                                        className="pka:w-full pka:rounded pka:px-3 pka:py-2 pka:text-gray-900 pka:font-mono pka:text-sm"
                                        rows={4}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleUpdateCollection}
                                        disabled={
                                            !authToken ||
                                            collectionsHook.updateCollection
                                                .isPending
                                        }
                                        className="pka:rounded-lg pka:bg-yellow-500 pka:px-4 pka:py-2 pka:font-semibold pka:text-white pka:transition-colors pka:hover:bg-yellow-600 pka:disabled:opacity-50"
                                    >
                                        {collectionsHook.updateCollection
                                            .isPending
                                            ? "Updating..."
                                            : "Update Collection"}
                                    </button>
                                </div>
                                {collectionsHook.updateCollection.data ? (
                                    <div className="pka:mt-3">
                                        <div className="pka:mb-1 pka:font-semibold pka:text-sm">
                                            Update Response:
                                        </div>
                                        <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-48 pka:bg-black/20 pka:p-2 pka:rounded">
                                            {String(
                                                JSON.stringify(
                                                    collectionsHook
                                                        .updateCollection
                                                        .data as unknown,
                                                    null,
                                                    2
                                                ) ?? ""
                                            )}
                                        </pre>
                                    </div>
                                ) : null}
                                {collectionsHook.updateCollection.error && (
                                    <div className="pka:mt-3 pka:text-red-300 pka:text-sm">
                                        Error:{" "}
                                        {collectionsHook.updateCollection
                                            .error instanceof Error
                                            ? collectionsHook.updateCollection
                                                  .error.message
                                            : String(
                                                  collectionsHook
                                                      .updateCollection.error
                                              )}
                                    </div>
                                )}
                            </div>

                            {/* Delete Collection */}
                            <div className="pka:mb-4 pka:p-4 pka:bg-white/5 pka:rounded">
                                <h3 className="pka:text-lg pka:font-semibold pka:mb-2">
                                    Delete Collection
                                </h3>
                                <div className="pka:flex pka:gap-2">
                                    <input
                                        type="text"
                                        value={deleteId}
                                        onChange={(e) =>
                                            setDeleteId(e.target.value)
                                        }
                                        placeholder="Enter collection ID"
                                        className="pka:flex-1 pka:rounded pka:px-3 pka:py-2 pka:text-gray-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleDeleteCollection}
                                        disabled={
                                            !authToken ||
                                            collectionsHook.deleteCollection
                                                .isPending
                                        }
                                        className="pka:rounded-lg pka:bg-red-500 pka:px-4 pka:py-2 pka:font-semibold pka:text-white pka:transition-colors pka:hover:bg-red-600 pka:disabled:opacity-50"
                                    >
                                        {collectionsHook.deleteCollection
                                            .isPending
                                            ? "Deleting..."
                                            : "Delete Collection"}
                                    </button>
                                </div>
                                {collectionsHook.deleteCollection.data && (
                                    <div className="pka:mt-3">
                                        <div className="pka:mb-1 pka:font-semibold pka:text-sm">
                                            Delete Response:
                                        </div>
                                        <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-48 pka:bg-black/20 pka:p-2 pka:rounded">
                                            {String(
                                                JSON.stringify(
                                                    collectionsHook
                                                        .deleteCollection
                                                        .data as unknown,
                                                    null,
                                                    2
                                                ) || ""
                                            )}
                                        </pre>
                                    </div>
                                )}
                                {collectionsHook.deleteCollection.error && (
                                    <div className="pka:mt-3 pka:text-red-300 pka:text-sm">
                                        Error:{" "}
                                        {collectionsHook.deleteCollection
                                            .error instanceof Error
                                            ? collectionsHook.deleteCollection
                                                  .error.message
                                            : String(
                                                  collectionsHook
                                                      .deleteCollection.error
                                              )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

const App = () => {
    const customConfig = {
        baseUrl: "https://api-devpaktbuild.chain.site",
        verbose: true,
    };

    return (
        <PaktCollectionProvider
            config={customConfig}
            onSchemaCreated={(schema: ICollectionSchemaDto) => {
                Logger.info("Schema created:", schema);
            }}
            onCollectionCreated={(collection: ICollectionStoreDto) => {
                Logger.info("Collection created:", collection);
            }}
        >
            <AppContent />
        </PaktCollectionProvider>
    );
};

export default App;

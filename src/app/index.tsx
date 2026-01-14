/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import Logger from "../lib/logger";
import { PaktCollectionProvider } from "../components/pakt-collection/provider";
import { usePaktCollection } from "../context/collection-context";
import {
    ICollectionSchemaDto,
    ICollectionStoreDto,
    CollectionResponse,
    FindCollectionSchemaDto,
    FindCollectionStoreDto,
    CreateCollectionStoreDto,
    UpdateCollectionStoreDto,
} from "../lib/pakt-sdk";

const AppContent = () => {
    const {
        schemas,
        selectedSchema,
        collections,
        collectionCount,
        loading,
        error,
        getAllSchemas,
        selectSchema,
        getAllCollections,
        getCollectionCount,
        getCollectionById,
        createCollection,
        updateCollection,
        deleteCollection,
        clearError,
        clearSelectedSchema,
    } = usePaktCollection();

    const [authToken, setAuthToken] = useState<string>("");
    const [tokenInput, setTokenInput] = useState<string>("");
    const [schemasResponse, setSchemasResponse] =
        useState<CollectionResponse<FindCollectionSchemaDto> | null>(null);
    const [collectionsResponse, setCollectionsResponse] =
        useState<CollectionResponse<FindCollectionStoreDto> | null>(null);
    const [countResponse, setCountResponse] =
        useState<CollectionResponse<number> | null>(null);
    const [createResponse, setCreateResponse] =
        useState<CollectionResponse<ICollectionStoreDto> | null>(null);
    const [updateResponse, setUpdateResponse] =
        useState<CollectionResponse<ICollectionStoreDto> | null>(null);
    const [deleteResponse, setDeleteResponse] =
        useState<CollectionResponse<object> | null>(null);
    const [getByIdResponse, setGetByIdResponse] =
        useState<CollectionResponse<ICollectionStoreDto> | null>(null);

    // Form states
    const [createPayload, setCreatePayload] = useState<string>("{}");
    const [updateId, setUpdateId] = useState<string>("");
    const [updatePayload, setUpdatePayload] = useState<string>("{}");
    const [deleteId, setDeleteId] = useState<string>("");
    const [getByIdId, setGetByIdId] = useState<string>("");

    useEffect(() => {
        // Try to get token from localStorage or cookie
        const storedToken = localStorage.getItem("pakt_auth_token") || "";
        if (storedToken) {
            setAuthToken(storedToken);
        }
    }, []);

    const handleSetToken = () => {
        if (tokenInput.trim()) {
            setAuthToken(tokenInput.trim());
            localStorage.setItem("pakt_auth_token", tokenInput.trim());
        }
    };

    const handleLoadSchemas = async () => {
        if (!authToken) {
            // eslint-disable-next-line no-alert
            alert("Please set an auth token first");
            return;
        }
        const response = await getAllSchemas(authToken);
        setSchemasResponse(response);
    };

    const handleSelectSchema = (schema: ICollectionSchemaDto) => {
        selectSchema(schema);
        if (authToken && schema.reference) {
            getAllCollections(authToken, schema.reference)
                .then((response) => {
                    setCollectionsResponse(response);
                })
                .catch(() => {
                    // Error handling is done in the hook
                });
            getCollectionCount(authToken, schema.reference)
                .then((response) => {
                    setCountResponse(response);
                })
                .catch(() => {
                    // Error handling is done in the hook
                });
        }
    };

    const handleCreateCollection = async () => {
        if (!authToken || !selectedSchema?.reference) {
            // eslint-disable-next-line no-alert
            alert("Please set auth token and select a schema first");
            return;
        }
        try {
            const payload = JSON.parse(createPayload);
            const response = await createCollection(
                authToken,
                selectedSchema.reference,
                payload
            );
            setCreateResponse(response);
            // Refresh collections list
            if (authToken && selectedSchema.reference) {
                getAllCollections(authToken, selectedSchema.reference)
                    .then((res) => setCollectionsResponse(res))
                    .catch(() => {
                        // Error handling is done in the hook
                    });
                getCollectionCount(authToken, selectedSchema.reference)
                    .then((res) => setCountResponse(res))
                    .catch(() => {
                        // Error handling is done in the hook
                    });
            }
        } catch (err) {
            // eslint-disable-next-line no-alert
            alert(
                `Invalid JSON payload: ${
                    err instanceof Error ? err.message : String(err)
                }`
            );
        }
    };

    const handleUpdateCollection = async () => {
        if (!authToken || !selectedSchema?.reference || !updateId) {
            // eslint-disable-next-line no-alert
            alert(
                "Please set auth token, select a schema, and enter collection ID"
            );
            return;
        }
        try {
            const payload = JSON.parse(updatePayload);
            const response = await updateCollection(
                authToken,
                selectedSchema.reference,
                updateId,
                payload
            );
            setUpdateResponse(response);
            // Refresh collections list
            if (authToken && selectedSchema.reference) {
                getAllCollections(authToken, selectedSchema.reference)
                    .then((res) => setCollectionsResponse(res))
                    .catch(() => {
                        // Error handling is done in the hook
                    });
            }
        } catch (err) {
            // eslint-disable-next-line no-alert
            alert(
                `Invalid JSON payload: ${
                    err instanceof Error ? err.message : String(err)
                }`
            );
        }
    };

    const handleDeleteCollection = async () => {
        if (!authToken || !selectedSchema?.reference || !deleteId) {
            // eslint-disable-next-line no-alert
            alert(
                "Please set auth token, select a schema, and enter collection ID"
            );
            return;
        }
        const response = await deleteCollection(
            authToken,
            selectedSchema.reference,
            deleteId
        );
        setDeleteResponse(response);
        // Refresh collections list
        if (authToken && selectedSchema.reference) {
            getAllCollections(authToken, selectedSchema.reference)
                .then((res) => setCollectionsResponse(res))
                .catch(() => {
                    // Error handling is done in the hook
                });
            getCollectionCount(authToken, selectedSchema.reference)
                .then((res) => setCountResponse(res))
                .catch(() => {
                    // Error handling is done in the hook
                });
        }
    };

    const handleGetCollectionById = async () => {
        if (!authToken || !selectedSchema?.reference || !getByIdId) {
            // eslint-disable-next-line no-alert
            alert(
                "Please set auth token, select a schema, and enter collection ID"
            );
            return;
        }
        const response = await getCollectionById(
            authToken,
            selectedSchema.reference,
            getByIdId
        );
        setGetByIdResponse(response);
    };

    return (
        <div className="pka:min-h-screen pka:bg-gradient-to-br pka:from-blue-900 pka:via-purple-900 pka:to-indigo-900 pka:p-4">
            <div className="pka:max-w-6xl pka:mx-auto pka:text-white">
                <h1 className="pka:mb-4 pka:text-4xl pka:font-bold pka:text-center">
                    Pakt Collection Module Demo
                </h1>
                <p className="pka:mb-8 pka:text-lg pka:text-gray-300 pka:text-center">
                    Manage collection schemas and collections
                </p>

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

                {error && (
                    <div className="pka:mb-4 pka:rounded-lg pka:bg-red-500/20 pka:border pka:border-red-500 pka:p-4">
                        <div className="pka:flex pka:items-center pka:justify-between">
                            <p className="pka:text-red-200">{error}</p>
                            <button
                                type="button"
                                onClick={clearError}
                                className="pka:text-red-300 pka:hover:text-red-100"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {loading && (
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
                            onClick={handleLoadSchemas}
                            disabled={!authToken || loading}
                            className="pka:rounded-lg pka:bg-white pka:px-4 pka:py-2 pka:font-semibold pka:text-blue-900 pka:transition-colors pka:hover:bg-gray-100 pka:disabled:opacity-50"
                        >
                            Load Schemas
                        </button>
                    </div>

                    {schemasResponse && (
                        <div className="pka:rounded pka:p-3 pka:bg-white/5 pka:mb-4">
                            <div className="pka:mb-2 pka:font-semibold">
                                Schemas API Response:
                            </div>
                            <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-96 pka:bg-black/20 pka:p-3 pka:rounded">
                                {JSON.stringify(schemasResponse, null, 2)}
                            </pre>
                        </div>
                    )}
                    {schemas && schemas.length > 0 ? (
                        <div className="pka:space-y-2">
                            {schemas.map((schema) => (
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
                    ) : (
                        <p className="pka:text-gray-400">
                            No schemas loaded. Click &quot;Load Schemas&quot; to
                            fetch.
                        </p>
                    )}
                </div>

                {/* Collections Section */}
                {selectedSchema && (
                    <div className="pka:space-y-4">
                        <div className="pka:rounded-lg pka:bg-white/10 pka:p-6 pka:backdrop-blur-sm">
                            <div className="pka:flex pka:items-center pka:justify-between pka:mb-4">
                                <h2 className="pka:text-2xl pka:font-semibold">
                                    Collection Store Operations (
                                    {selectedSchema.name})
                                </h2>
                                <button
                                    type="button"
                                    onClick={clearSelectedSchema}
                                    className="pka:rounded-lg pka:bg-red-500/20 pka:px-4 pka:py-2 pka:font-semibold pka:text-red-200 pka:transition-colors pka:hover:bg-red-500/30"
                                >
                                    Clear Selection
                                </button>
                            </div>

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
                                        disabled={!authToken || loading}
                                        className="pka:rounded-lg pka:bg-green-500 pka:px-4 pka:py-2 pka:font-semibold pka:text-white pka:transition-colors pka:hover:bg-green-600 pka:disabled:opacity-50"
                                    >
                                        Create Collection
                                    </button>
                                </div>
                                {createResponse && (
                                    <div className="pka:mt-3">
                                        <div className="pka:mb-1 pka:font-semibold pka:text-sm">
                                            Create Response:
                                        </div>
                                        <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-48 pka:bg-black/20 pka:p-2 pka:rounded">
                                            {JSON.stringify(
                                                createResponse,
                                                null,
                                                2
                                            )}
                                        </pre>
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
                                        disabled={!authToken || loading}
                                        className="pka:rounded-lg pka:bg-blue-500 pka:px-4 pka:py-2 pka:font-semibold pka:text-white pka:transition-colors pka:hover:bg-blue-600 pka:disabled:opacity-50"
                                    >
                                        Get By ID
                                    </button>
                                </div>
                                {getByIdResponse && (
                                    <div className="pka:mt-3">
                                        <div className="pka:mb-1 pka:font-semibold pka:text-sm">
                                            Get By ID Response:
                                        </div>
                                        <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-48 pka:bg-black/20 pka:p-2 pka:rounded">
                                            {JSON.stringify(
                                                getByIdResponse,
                                                null,
                                                2
                                            )}
                                        </pre>
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
                                        disabled={!authToken || loading}
                                        className="pka:rounded-lg pka:bg-yellow-500 pka:px-4 pka:py-2 pka:font-semibold pka:text-white pka:transition-colors pka:hover:bg-yellow-600 pka:disabled:opacity-50"
                                    >
                                        Update Collection
                                    </button>
                                </div>
                                {updateResponse && (
                                    <div className="pka:mt-3">
                                        <div className="pka:mb-1 pka:font-semibold pka:text-sm">
                                            Update Response:
                                        </div>
                                        <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-48 pka:bg-black/20 pka:p-2 pka:rounded">
                                            {JSON.stringify(
                                                updateResponse,
                                                null,
                                                2
                                            )}
                                        </pre>
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
                                        disabled={!authToken || loading}
                                        className="pka:rounded-lg pka:bg-red-500 pka:px-4 pka:py-2 pka:font-semibold pka:text-white pka:transition-colors pka:hover:bg-red-600 pka:disabled:opacity-50"
                                    >
                                        Delete Collection
                                    </button>
                                </div>
                                {deleteResponse && (
                                    <div className="pka:mt-3">
                                        <div className="pka:mb-1 pka:font-semibold pka:text-sm">
                                            Delete Response:
                                        </div>
                                        <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-48 pka:bg-black/20 pka:p-2 pka:rounded">
                                            {JSON.stringify(
                                                deleteResponse,
                                                null,
                                                2
                                            )}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Collections Response */}
                        {collectionsResponse && (
                            <div className="pka:rounded-lg pka:bg-white/10 pka:p-6 pka:backdrop-blur-sm">
                                <h2 className="pka:text-2xl pka:font-semibold pka:mb-4">
                                    GetAll Collections Response
                                </h2>
                                <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-96 pka:bg-black/20 pka:p-3 pka:rounded">
                                    {JSON.stringify(
                                        collectionsResponse,
                                        null,
                                        2
                                    )}
                                </pre>
                            </div>
                        )}

                        {/* Collection Count Response */}
                        {countResponse && (
                            <div className="pka:rounded-lg pka:bg-white/10 pka:p-6 pka:backdrop-blur-sm">
                                <h2 className="pka:text-2xl pka:font-semibold pka:mb-4">
                                    Collection Count Response
                                </h2>
                                <pre className="pka:text-xs pka:text-gray-300 pka:overflow-auto pka:max-h-96 pka:bg-black/20 pka:p-3 pka:rounded">
                                    {JSON.stringify(countResponse, null, 2)}
                                </pre>
                            </div>
                        )}

                        {/* Legacy Collections Display (if no response yet) */}
                        {!collectionsResponse &&
                            collections &&
                            collections.data &&
                            collections.data.length > 0 && (
                                <div className="pka:rounded-lg pka:bg-white/10 pka:p-6 pka:backdrop-blur-sm">
                                    <div className="pka:flex pka:items-center pka:justify-between pka:mb-4">
                                        <h2 className="pka:text-2xl pka:font-semibold">
                                            Collections ({selectedSchema.name})
                                        </h2>
                                        {collectionCount !== null && (
                                            <span className="pka:text-gray-300">
                                                Total: {collectionCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="pka:space-y-2">
                                        {collections.data.map(
                                            (
                                                collection: ICollectionStoreDto
                                            ) => (
                                                <div
                                                    key={collection._id}
                                                    className="pka:rounded pka:p-3 pka:bg-white/5"
                                                >
                                                    <div className="pka:font-semibold">
                                                        Collection ID:{" "}
                                                        {collection._id}
                                                    </div>
                                                    <pre className="pka:text-xs pka:text-gray-300 pka:mt-1 pka:overflow-auto">
                                                        {JSON.stringify(
                                                            collection,
                                                            null,
                                                            2
                                                        )}
                                                    </pre>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                )}
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

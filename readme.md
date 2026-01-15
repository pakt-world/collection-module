# @pakt/collection-module

A comprehensive React collection management module for Pakt applications. This package provides a complete solution for managing collection schemas and collections with full CRUD operations, filtering, and state management using React Query.

## Features

- **React Query Integration**: Built on `@tanstack/react-query` for powerful caching, synchronization, and state management
- **Collection Schema Management**: Create, read, update, and delete collection schemas
- **Collection Store Management**: Full CRUD operations for collections within schemas
- **Automatic Cache Management**: React Query handles cache invalidation and refetching automatically
- **TypeScript Support**: Full type definitions included
- **Filtering & Pagination**: Built-in support for filtering and querying collections
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Built-in loading state management via React Query
- **Customizable UI**: Theme customization support

## Installation

```bash
yarn add @pakt/collection-module @tanstack/react-query
# or
npm install @pakt/collection-module @tanstack/react-query
# or
bun add @pakt/collection-module @tanstack/react-query
```

**Note**: `@tanstack/react-query` is a peer dependency and must be installed separately.

## Quick Start

### Using React Query Hooks (Recommended)

```typescript
import React from 'react';
import { PaktCollectionProvider, useCollections, useSchemas } from '@pakt/collection-module';
import '@pakt/collection-module/dist/styles.css';

function App() {
  const config = {
    baseUrl: "https://api-devpaktbuild.chain.site",
    verbose: true,
  };

  return (
    <PaktCollectionProvider config={config}>
      <CollectionDemo />
    </PaktCollectionProvider>
  );
}

function CollectionDemo() {
  const schemaReference = "person-profile"; // Your schema reference
  
  // Use React Query hooks
  const { useSchemasQuery } = useSchemas();
  const { useCollectionsQuery, createCollection, updateCollection, deleteCollection } = useCollections(schemaReference);

  const schemasQuery = useSchemasQuery();
  const collectionsQuery = useCollectionsQuery();

  // Access data, loading, and error states
  const schemas = schemasQuery.data?.data?.schemas || [];
  const collections = collectionsQuery.data?.data?.data || [];

  if (schemasQuery.isLoading) return <div>Loading schemas...</div>;
  if (collectionsQuery.isLoading) return <div>Loading collections...</div>;
  if (schemasQuery.error) return <div>Error: {schemasQuery.error.message}</div>;

  const handleCreate = () => {
    createCollection.mutate({
      firstName: "John",
      email: "john@example.com",
      // ... other fields
    });
  };

  return (
    <div>
      <h1>Schemas</h1>
      {schemas.map(schema => (
        <div key={schema._id}>
          <h2>{schema.name}</h2>
          <p>{schema.description}</p>
        </div>
      ))}

      <h1>Collections</h1>
      <button onClick={handleCreate}>Create Collection</button>
      {collections.map(collection => (
        <div key={collection._id}>
          {/* Render collection data */}
        </div>
      ))}
    </div>
  );
}
```

## Configuration

### ConfigContextType

The main configuration object for the PaktCollectionProvider:

```typescript
interface ConfigContextType {
  baseUrl: string;        // Required: API base URL
  testnet?: boolean;      // Optional: Use testnet environment
  verbose?: boolean;      // Optional: Enable verbose logging
  theme?: ITheme;         // Optional: Theme customization
}
```

### Theme Configuration

Customize the appearance of the collection components with semantic color tokens:

```typescript
interface ITheme {
  // Brand Colors
  brandPrimary?: string;           // Main brand color for buttons, links, icons
  brandSecondary?: string;         // Secondary brand color for backgrounds
  
  // Text Colors
  headingText?: string;            // Color for headings and titles
  bodyText?: string;               // Color for body text and descriptions
  inverseText?: string;            // White text for dark backgrounds
  
  // Background Colors
  formBackground?: string;         // Background color for forms and cards
  modalOverlay?: string;           // Overlay color for modals and dialogs
  
  // Interactive Elements
  buttonPrimaryBackground?: string;    // Primary button background (supports gradients)
  buttonPrimaryText?: string;          // Primary button text color
  buttonPrimaryHover?: string;         // Primary button hover state
  buttonOutlineBackground?: string;    // Outline button background
  buttonOutlineText?: string;          // Outline button text color
  
  // Form Input Colors
  inputBackground?: string;        // Input field background
  inputBorder?: string;            // Input field border
  inputFocusBorder?: string;       // Input field focus border
  inputPlaceholder?: string;       // Input placeholder text
  inputText?: string;              // Input text color
  
  // State Colors
  errorBackground?: string;        // Error state background
  errorText?: string;             // Error state text
  successText?: string;           // Success state text
}
```

**Example:**

```typescript
const config: ConfigContextType = {
  baseUrl: "https://api-devpaktbuild.chain.site",
  theme: {
    brandPrimary: "#007C5B",
    buttonPrimaryBackground: "linear-gradient(102.28deg, #008D6C 32.23%, #11FFC7 139.92%)",
    formBackground: "#FFFFFF",
    errorText: "#DC2626",
  },
};
```

## React Query Hooks

### useSchemas Hook

The `useSchemas` hook provides React Query hooks for schema operations:

```typescript
import { useSchemas } from '@pakt/collection-module';

function MyComponent() {
  const {
    useSchemasQuery,      // Query hook for fetching schemas
    useSchemaById,        // Query hook for fetching a single schema
    createSchema,         // Mutation for creating a schema
    updateSchema,         // Mutation for updating a schema
    deleteSchema,         // Mutation for deleting a schema
  } = useSchemas();

  // Use the query hook
  const schemasQuery = useSchemasQuery({ limit: 10 });
  
  // Access data, loading, and error states
  const schemas = schemasQuery.data?.data?.schemas || [];
  const isLoading = schemasQuery.isLoading;
  const error = schemasQuery.error;

  // Use mutations
  const handleCreate = () => {
    createSchema.mutate({
      name: "My Schema",
      reference: "my-schema",
      description: "Schema description",
    }, {
      onSuccess: (data) => {
        console.log("Schema created:", data);
      },
      onError: (error) => {
        console.error("Error:", error);
      },
    });
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {schemas.map(schema => (
        <div key={schema._id}>{schema.name}</div>
      ))}
      <button onClick={handleCreate}>Create Schema</button>
    </div>
  );
}
```

### useCollections Hook

The `useCollections` hook provides React Query hooks for collection operations. It requires a `schemaReference` parameter:

```typescript
import { useCollections } from '@pakt/collection-module';

function MyComponent() {
  const schemaReference = "person-profile";
  
  const {
    useCollectionsQuery,  // Query hook for fetching collections
    getCountQuery,        // Query hook for fetching collection count
    useCollectionById,    // Query hook for fetching a single collection
    createCollection,     // Mutation for creating a collection
    updateCollection,     // Mutation for updating a collection
    deleteCollection,     // Mutation for deleting a collection
  } = useCollections(schemaReference);

  // Use query hooks
  const collectionsQuery = useCollectionsQuery({ limit: 20 });
  const countQuery = getCountQuery;
  const singleCollectionQuery = useCollectionById("collection-id");

  // Access data
  const collections = collectionsQuery.data?.data?.data || [];
  const count = countQuery.data?.data || 0;

  // Use mutations
  const handleCreate = () => {
    createCollection.mutate({
      firstName: "John",
      email: "john@example.com",
      dateOfBirth: "1990-01-01",
    }, {
      onSuccess: () => {
        // Cache is automatically invalidated and refetched
        console.log("Collection created!");
      },
    });
  };

  const handleUpdate = (id: string) => {
    updateCollection.mutate({
      id,
      payload: {
        firstName: "Jane",
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteCollection.mutate(id, {
      onSuccess: () => {
        console.log("Collection deleted!");
      },
    });
  };

  return (
    <div>
      <p>Total collections: {count}</p>
      {collections.map(collection => (
        <div key={collection._id}>
          <button onClick={() => handleUpdate(collection._id)}>Update</button>
          <button onClick={() => handleDelete(collection._id)}>Delete</button>
        </div>
      ))}
      <button onClick={handleCreate}>Create Collection</button>
    </div>
  );
}
```

## Hook API Reference

### useSchemas()

Returns React Query hooks and mutations for schema operations.

**Returns:**

```typescript
{
  useSchemasQuery: (filter?: filterCollectionSchemaDto) => UseQueryResult<ResponseDto<FindCollectionSchemaDto>>;
  useSchemaById: (id: string) => UseQueryResult<ResponseDto<ICollectionSchemaDto>>;
  createSchema: UseMutationResult<ResponseDto<ICollectionSchemaDto>, Error, CreateCollectionSchemaDto>;
  updateSchema: UseMutationResult<ResponseDto<ICollectionSchemaDto>, Error, { id: string; payload: UpdateCollectionSchemaDto }>;
  deleteSchema: UseMutationResult<ResponseDto<object>, Error, string>;
}
```

### useCollections(schemaReference: string)

Returns React Query hooks and mutations for collection operations.

**Parameters:**

- `schemaReference` (string, required): The reference of the schema to work with

**Returns:**

```typescript
{
  useCollectionsQuery: (filter?: filterCollectionStoreDto) => UseQueryResult<ResponseDto<FindCollectionStoreDto>>;
  getCountQuery: UseQueryResult<ResponseDto<number>>;
  useCollectionById: (id: string) => UseQueryResult<ResponseDto<ICollectionStoreDto>>;
  createCollection: UseMutationResult<ResponseDto<ICollectionStoreDto>, Error, CreateCollectionStoreDto>;
  updateCollection: UseMutationResult<ResponseDto<ICollectionStoreDto>, Error, { id: string; payload: UpdateCollectionStoreDto }>;
  deleteCollection: UseMutationResult<ResponseDto<object>, Error, string>;
}
```

## Usage Examples

### Complete Example with React Query

```typescript
import React, { useState } from 'react';
import { PaktCollectionProvider, useSchemas, useCollections } from '@pakt/collection-module';

function App() {
  return (
    <PaktCollectionProvider
      config={{
        baseUrl: "https://api-devpaktbuild.chain.site",
        verbose: true,
      }}
    >
      <CollectionManager />
    </PaktCollectionProvider>
  );
}

function CollectionManager() {
  const [selectedSchemaRef, setSelectedSchemaRef] = useState<string>("");

  const { useSchemasQuery, createSchema } = useSchemas();
  const schemasQuery = useSchemasQuery();

  const schemas = schemasQuery.data?.data?.schemas || [];

  return (
    <div>
      <h1>Schemas</h1>
      {schemas.map(schema => (
        <div
          key={schema._id}
          onClick={() => setSelectedSchemaRef(schema.reference)}
        >
          <h2>{schema.name}</h2>
          <p>{schema.description}</p>
        </div>
      ))}

      {selectedSchemaRef && (
        <CollectionList schemaReference={selectedSchemaRef} />
      )}
    </div>
  );
}

function CollectionList({ schemaReference }: { schemaReference: string }) {
  const {
    useCollectionsQuery,
    getCountQuery,
    createCollection,
    updateCollection,
    deleteCollection,
  } = useCollections(schemaReference);

  const collectionsQuery = useCollectionsQuery();
  const countQuery = getCountQuery;

  const collections = collectionsQuery.data?.data?.data || [];
  const count = countQuery.data?.data || 0;

  const handleCreate = () => {
    createCollection.mutate({
      // Your collection data based on schema
      field1: "value1",
      field2: "value2",
    });
  };

  return (
    <div>
      <h2>Collections ({count})</h2>
      <button onClick={handleCreate}>Create Collection</button>
      
      {collectionsQuery.isLoading && <div>Loading...</div>}
      {collectionsQuery.error && (
        <div>Error: {collectionsQuery.error.message}</div>
      )}

      {collections.map(collection => (
        <div key={collection._id}>
          <pre>{JSON.stringify(collection, null, 2)}</pre>
          <button
            onClick={() => updateCollection.mutate({
              id: collection._id,
              payload: { field1: "updated" },
            })}
          >
            Update
          </button>
          <button
            onClick={() => deleteCollection.mutate(collection._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Authentication Token Management

The hooks automatically read the authentication token from `localStorage` using the key `pakt_auth_token`. Set the token before using the hooks:

```typescript
// Set the token
localStorage.setItem("pakt_auth_token", "your-auth-token");

// The hooks will automatically use this token
const { useSchemasQuery } = useSchemas();
const schemasQuery = useSchemasQuery();
```

### Query Filtering

Both hooks support filtering:

```typescript
// Filter schemas
const schemasQuery = useSchemasQuery({
  limit: 10,
  page: 1,
});

// Filter collections
const collectionsQuery = useCollectionsQuery({
  limit: 20,
  offset: 0,
});
```

### Cache Management

React Query automatically manages cache invalidation. When mutations succeed, related queries are automatically invalidated and refetched:

```typescript
const { createCollection } = useCollections(schemaReference);

// After this mutation succeeds, all collection queries are automatically refetched
createCollection.mutate(payload, {
  onSuccess: () => {
    // Cache is already invalidated and refetched automatically
    console.log("Done!");
  },
});
```

## Component Props

### PaktCollectionProvider Props

```typescript
interface PaktCollectionProps {
  config: ConfigContextType;                    // Required: Configuration object
  textConfig?: CollectionTextConfig;            // Optional: Custom text configuration
  onSchemaCreated?: (schema: ICollectionSchemaDto) => void;     // Optional: Schema created callback
  onSchemaUpdated?: (schema: ICollectionSchemaDto) => void;   // Optional: Schema updated callback
  onSchemaDeleted?: (schemaId: string) => void;               // Optional: Schema deleted callback
  onCollectionCreated?: (collection: ICollectionStoreDto) => void;  // Optional: Collection created callback
  onCollectionUpdated?: (collection: ICollectionStoreDto) => void;  // Optional: Collection updated callback
  onCollectionDeleted?: (collectionId: string) => void;              // Optional: Collection deleted callback
}
```

**Note**: The `PaktCollectionProvider` automatically includes a `QueryClientProvider` with a pre-configured `QueryClient`, so you don't need to set up React Query yourself. Just wrap your app with `PaktCollectionProvider` and start using the hooks!

## Response Format

All methods return a `ResponseDto<T>` object:

```typescript
interface ResponseDto<T> {
  status: "success" | "error";
  message: string;
  data: T;
  statusCode?: number;
  code?: number;
}
```

**Schema Response Example:**

```typescript
{
  status: "success",
  message: "OK",
  data: {
    schemas: [...],
    total: 1,
    page: 1,
    limit: 12
  },
  code: 200
}
```

**Collection Response Example:**

```typescript
{
  status: "success",
  message: "OK",
  data: {
    data: [...collections],
    total: 100,
    page: 1,
    limit: 20
  },
  code: 200
}
```

## Types

### Collection Schema Types

```typescript
interface ICollectionSchemaDto {
  _id: string;
  name: string;
  reference: string;
  description?: string;
  schema: SchemaField[];
  access: {
    read: string;
    write: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CreateCollectionSchemaDto {
  name: string;
  reference: string;
  description?: string;
  schema: SchemaField[];
  access?: {
    read: string;
    write: string;
  };
}

interface UpdateCollectionSchemaDto {
  name?: string;
  description?: string;
  schema?: SchemaField[];
  access?: {
    read?: string;
    write?: string;
  };
}
```

### Collection Store Types

```typescript
interface ICollectionStoreDto {
  _id: string;
  // Dynamic fields based on schema
  [key: string]: any;
}

interface CreateCollectionStoreDto {
  // Dynamic fields based on schema
  [key: string]: any;
}

interface UpdateCollectionStoreDto {
  // Dynamic fields to update
  [key: string]: any;
}
```

## Legacy Context-Based Hook (Alternative)

For backward compatibility, the module also exports a context-based hook `usePaktCollectionInternal`. However, the React Query hooks (`useCollections` and `useSchemas`) are recommended for new projects as they provide better caching, synchronization, and state management.

## PAKT SDK Integration

The module integrates with the PAKT SDK (`@pakt/sdk`) for backend collection management. The SDK handles:

- Collection schema CRUD operations
- Collection store CRUD operations
- Filtering and pagination
- Authentication token management
- Error handling and response formatting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Please refer to the `CODE_OF_CONDUCT.md` and `LICENSE` files.

## License

MIT

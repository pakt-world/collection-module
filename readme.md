# @pakt/collection-module

A comprehensive React collection management module for Pakt applications. This package provides a complete solution for managing collection schemas and collections with full CRUD operations, filtering, and state management.

## Features

- **Collection Schema Management**: Create, read, update, and delete collection schemas
- **Collection Store Management**: Full CRUD operations for collections within schemas
- **State Management**: Built-in Zustand store for persistent state management
- **TypeScript Support**: Full type definitions included
- **Filtering & Pagination**: Built-in support for filtering and querying collections
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Built-in loading state management
- **Customizable UI**: Theme customization support

## Installation

```bash
yarn add @pakt/collection-module
# or
npm install @pakt/collection-module
# or
bun add @pakt/collection-module
```

## Quick Start

```typescript
import React from 'react';
import { PaktCollectionProvider, usePaktCollection } from '@pakt/collection-module';
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
  const {
    schemas,
    collections,
    loading,
    error,
    getAllSchemas,
    getAllCollections,
    createCollection,
  } = usePaktCollection();

  const authToken = "your-auth-token";

  // Load schemas
  React.useEffect(() => {
    getAllSchemas(authToken);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Collection Schemas</h1>
      {schemas?.map(schema => (
        <div key={schema._id}>
          <h2>{schema.name}</h2>
          <p>{schema.description}</p>
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

### Text Configuration

Customize the text displayed in collection components:

```typescript
interface CollectionTextConfig {
  title?: string;        // Title for collection components
  description?: string;  // Description for collection components
}
```

## Using the Hook

The `usePaktCollection` hook provides everything you need for collection management:

```typescript
import { usePaktCollection } from '@pakt/collection-module';

function MyComponent() {
  const { 
    // State
    schemas,                    // Array of collection schemas
    selectedSchema,            // Currently selected schema
    collections,               // Collections data
    collectionCount,           // Total collection count
    loading,                   // Loading state
    error,                     // Error message
    
    // Schema Methods
    getAllSchemas,             // Fetch all schemas
    getSchemaById,             // Get schema by ID
    selectSchema,              // Select a schema
    createSchema,              // Create a new schema
    updateSchema,              // Update a schema
    deleteSchema,              // Delete a schema
    
    // Collection Methods
    getAllCollections,         // Fetch all collections for a schema
    getCollectionById,         // Get collection by ID
    getCollectionCount,         // Get collection count
    createCollection,          // Create a new collection
    updateCollection,           // Update a collection
    deleteCollection,           // Delete a collection
    
    // Utility Methods
    clearError,                // Clear error state
    clearSelectedSchema,        // Clear selected schema
  } = usePaktCollection();

  // Your component logic here
}
```

## API Methods

### Collection Schema Methods

#### getAllSchemas

Fetch all collection schemas with optional filtering:

```typescript
const response = await getAllSchemas(
  authToken: string,
  filter?: filterCollectionSchemaDto
);
```

**Example:**

```typescript
const response = await getAllSchemas(authToken, {
  limit: 10,
  offset: 0,
  // ... other filter options
});
```

#### getSchemaById

Get a specific schema by ID:

```typescript
const response = await getSchemaById(
  authToken: string,
  id: string
);
```

#### createSchema

Create a new collection schema:

```typescript
const response = await createSchema({
  name: "My Collection Schema",
  reference: "my-collection-schema",
  description: "Description of the schema",
  // ... other schema fields
});
```

#### updateSchema

Update an existing schema:

```typescript
const response = await updateSchema(schemaId, {
  name: "Updated Name",
  description: "Updated description",
  // ... other fields to update
});
```

#### deleteSchema

Delete a schema:

```typescript
const response = await deleteSchema(schemaId);
```

### Collection Store Methods

#### getAllCollections

Fetch all collections for a specific schema:

```typescript
const response = await getAllCollections(
  authToken: string,
  schemaReference: string,
  filter?: filterCollectionStoreDto
);
```

**Example:**

```typescript
const response = await getAllCollections(
  authToken,
  "my-collection-schema",
  {
    limit: 20,
    offset: 0,
  }
);
```

#### getCollectionById

Get a specific collection by ID:

```typescript
const response = await getCollectionById(
  authToken: string,
  schemaReference: string,
  id: string
);
```

#### getCollectionCount

Get the total count of collections for a schema:

```typescript
const response = await getCollectionCount(
  authToken: string,
  schemaReference: string,
  filter?: filterCollectionStoreDto
);
```

#### createCollection

Create a new collection:

```typescript
const response = await createCollection(
  authToken: string,
  schemaReference: string,
  {
    // Collection data matching the schema fields
    field1: "value1",
    field2: "value2",
  }
);
```

#### updateCollection

Update an existing collection:

```typescript
const response = await updateCollection(
  authToken: string,
  schemaReference: string,
  collectionId: string,
  {
    // Fields to update
    field1: "new value",
  }
);
```

#### deleteCollection

Delete a collection:

```typescript
const response = await deleteCollection(
  authToken: string,
  schemaReference: string,
  collectionId: string
);
```

## Usage Examples

### Basic Implementation

```typescript
import React, { useEffect } from 'react';
import { PaktCollectionProvider, usePaktCollection } from '@pakt/collection-module';

function App() {
  const config = {
    baseUrl: "https://api-devpaktbuild.chain.site",
    verbose: true,
  };

  return (
    <PaktCollectionProvider config={config}>
      <CollectionManager />
    </PaktCollectionProvider>
  );
}

function CollectionManager() {
  const {
    schemas,
    collections,
    loading,
    error,
    getAllSchemas,
    selectSchema,
    getAllCollections,
    createCollection,
  } = usePaktCollection();

  const authToken = "your-auth-token";

  useEffect(() => {
    getAllSchemas(authToken);
  }, []);

  const handleSchemaSelect = async (schema: ICollectionSchemaDto) => {
    selectSchema(schema);
    if (schema.reference) {
      await getAllCollections(authToken, schema.reference);
    }
  };

  const handleCreateCollection = async () => {
    if (!selectedSchema?.reference) return;
    
    await createCollection(authToken, selectedSchema.reference, {
      // Your collection data
      title: "New Collection",
      description: "Collection description",
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Collection Schemas</h1>
      {schemas?.map(schema => (
        <div key={schema._id} onClick={() => handleSchemaSelect(schema)}>
          <h2>{schema.name}</h2>
          <p>{schema.description}</p>
        </div>
      ))}

      {selectedSchema && (
        <div>
          <h2>Collections for {selectedSchema.name}</h2>
          <button onClick={handleCreateCollection}>Create Collection</button>
          {collections?.data?.map(collection => (
            <div key={collection._id}>
              {/* Render collection data */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### With Callbacks

```typescript
import React from 'react';
import { PaktCollectionProvider } from '@pakt/collection-module';

function App() {
  const config = {
    baseUrl: "https://api-devpaktbuild.chain.site",
  };

  return (
    <PaktCollectionProvider
      config={config}
      onSchemaCreated={(schema) => {
        console.log("Schema created:", schema);
        // Handle schema creation
      }}
      onCollectionCreated={(collection) => {
        console.log("Collection created:", collection);
        // Handle collection creation
      }}
      onCollectionUpdated={(collection) => {
        console.log("Collection updated:", collection);
        // Handle collection update
      }}
      onCollectionDeleted={(collectionId) => {
        console.log("Collection deleted:", collectionId);
        // Handle collection deletion
      }}
    >
      {/* Your app */}
    </PaktCollectionProvider>
  );
}
```

### Error Handling

```typescript
import { usePaktCollection } from '@pakt/collection-module';

function MyComponent() {
  const { error, clearError, getAllSchemas } = usePaktCollection();

  useEffect(() => {
    if (error) {
      // Handle error (show toast, log, etc.)
      console.error("Collection error:", error);
      
      // Clear error after handling
      setTimeout(() => clearError(), 5000);
    }
  }, [error]);

  return (
    <div>
      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
      {/* Rest of component */}
    </div>
  );
}
```

## Response Format

All methods return a `CollectionResponse<T>` object:

```typescript
interface CollectionResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
  statusCode?: number;
  code?: number;
}
```

**Example Response:**

```typescript
{
  status: "success",
  message: "Collections retrieved successfully",
  data: {
    data: [...collections],
    total: 100,
    limit: 20,
    offset: 0,
  },
  statusCode: 200,
  code: 200,
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
  // ... other schema fields
}

interface CreateCollectionSchemaDto {
  name: string;
  reference: string;
  description?: string;
  // ... other fields
}

interface UpdateCollectionSchemaDto {
  name?: string;
  description?: string;
  // ... other updatable fields
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

## PAKT SDK Integration

The module integrates with the PAKT SDK for backend collection management. The SDK handles:

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

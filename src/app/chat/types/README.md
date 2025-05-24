# Chat Type System

This document outlines the organization of the type definitions for the chat integration system.

## Type Organization

The chat module uses a **single consolidated type file** to avoid duplication, ensure consistency, and prevent sync issues:

### Core Type Definitions

- **`chat-types.ts`**: Contains ALL type definitions for Genesys chat integration in one file:
  - `ScriptLoadPhase`: Enum for tracking script loading phases
  - `CXBus`: Communication bus for Genesys widgets
  - `GenesysWidgets`: Configuration for Genesys widgets
  - `GenesysGlobal`: Global Genesys object structure
  - `ChatSettings`: Configuration passed to click_to_chat.js
  - `GenesysChat`: Public API exposed by click_to_chat.js
  - `GenesysCXBus`: CXBus reference exposed by click_to_chat.js
  - `GenesysWindow`: Window extensions for Genesys

### Type Exports

- **`index.ts`**: Barrel file that re-exports all types from the consolidated file
  ```typescript
  export * from './chat-types';
  ```

### Global Type Extensions

- **`src/app/chat/global.d.ts`**: Extends the global Window interface with Genesys properties

  ```typescript
  import { GenesysWindow } from './types/chat-types';

  declare global {
    interface Window extends GenesysWindow {
      // Custom events for Genesys chat
      addEventListener(/* ... */): void;
      // ...
    }
  }
  ```

- **`src/types/chat.ts`** and **`src/types/chat.d.ts`**: Re-export all types for backward compatibility

  ```typescript
  export * from '../app/chat/types/chat-types';
  ```

- **`src/global.d.ts`**: Extends Window interface using the GenesysWindow

  ```typescript
  import { GenesysWindow } from './types/chat';

  declare global {
    interface Window extends GenesysWindow {
      // Additional properties not in GenesysWindow
    }
  }
  ```

## Usage Guidelines

1. **Importing Types**: Import directly from the consolidated file:

   ```typescript
   import { ChatSettings, GenesysCXBus } from '../types/chat-types';
   ```

   Or use the barrel file (slightly less reliable for syncing):

   ```typescript
   import { ChatSettings, GenesysCXBus } from '../types';
   ```

2. **Adding New Types**: Add new types directly to `chat-types.ts`.

3. **Extending Window Interface**: If you need to add global properties, extend the `GenesysWindow` interface in `chat-types.ts`.

4. **Type Assertions**: When needed, use type assertions to handle window properties:
   ```typescript
   (window as any).chatSettings = config;
   ```

## Type Files Layout

```
src/
├── app/
│   └── chat/
│       └── types/
│           ├── chat-types.ts     # SINGLE SOURCE OF TRUTH for all type definitions
│           ├── index.ts          # Barrel file for exports
│           └── README.md         # Documentation
├── types/
│   ├── chat.ts                   # Re-export from chat-types.ts
│   └── global.d.ts               # Global Window extension
└── global.d.ts                   # Root global declarations
```

## Best Practices

1. **Single Source of Truth**: All chat-related types are in `chat-types.ts`.
2. **Direct Imports**: Prefer importing directly from `chat-types.ts` for maximum reliability.
3. **Document New Types**: Add JSDoc comments to explain the purpose of each type.
4. **Keep Types Updated**: When adding new functionality, update the types in `chat-types.ts`.

## Why This Approach?

This consolidated approach ensures:

1. **Repository Sync**: All types are in a single file that's guaranteed to sync with the repository
2. **No Duplication**: All types are defined exactly once
3. **Easy Updates**: Changes only need to be made in one place
4. **Import Simplicity**: Direct imports from a single file

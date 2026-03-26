# Developer Guide

This guide walks you through the architecture, core patterns, and conventions used in this project so you can start contributing quickly.

---

## Folder Structure

```
chat-project/
├── client/                              # React + Vite frontend
│   └── src/
│       ├── main.jsx                     # React DOM entry point
│       ├── App.jsx                      # Root component, renders FlowCanvas
│       ├── App.css                      # CSS variables and global resets
│       ├── components/
│       │   ├── FlowCanvas/              # Main canvas (presentational shell)
│       │   ├── Toolbar/                 # Action buttons (Run, Save, View History)
│       │   ├── HistorySidebar/          # Slide-in panel for saved flows
│       │   ├── nodes/                   # Custom React Flow nodes
│       │   │   ├── TextInputNode.jsx    # Prompt input textarea
│       │   │   └── ResultNode.jsx       # AI response display
│       │   └── ui/                      # Generic UI primitives
│       │       ├── Spinner.jsx
│       │       └── Toast.jsx
│       ├── hooks/
│       │   ├── useFlowRunner.js         # Central state orchestrator
│       │   ├── useAskAi.js              # AI request lifecycle
│       │   └── useSaveConversation.js   # Save request lifecycle
│       ├── services/
│       │   └── api.js                   # Axios HTTP client
│       └── constants/
│           └── flowDefaults.js          # Initial nodes, edges, node type registry
│
└── server/                              # Express + MongoDB backend
    └── src/
        ├── index.js                     # Server entry point (connect DB, listen)
        ├── app.js                       # Express app setup and middleware stack
        ├── config/
        │   ├── env.js                   # Env var validation and freeze
        │   └── db.js                    # MongoDB/Mongoose connection
        ├── routes/
        │   ├── aiRoutes.js              # POST /api/ask-ai
        │   └── conversationRoutes.js    # CRUD /api/conversations
        ├── controllers/
        │   ├── aiController.js          # Validates prompt, calls service
        │   └── conversationController.js# Validates data, calls Mongoose
        ├── services/
        │   └── openRouterService.js     # OpenRouter API integration
        ├── models/
        │   └── Conversation.js          # Mongoose schema (prompt, response)
        ├── middleware/
        │   ├── errorHandler.js          # Centralized error handling
        │   └── requestLogger.js         # Request logging middleware (factory)
        └── logger/
            └── ConsoleLogger.js         # Formats and writes log lines to stdout
```

---

## Backend Patterns

### Layer Separation: Routes -> Controllers -> Services -> Models

Every request flows through four distinct layers. Each layer has one job:

```
Request
  -> Route         (maps URL to controller function)
  -> Controller    (validates input, calls service, sends response)
  -> Service       (business logic / external API calls)
  -> Model         (database schema and queries)
```

**Example: `POST /api/ask-ai`**

```
aiRoutes.js          router.post('/ask-ai', askAi)
                         |
aiController.js      validates prompt is a non-empty string
                         |
openRouterService.js calls OpenRouter API, extracts response content
                         |
                     response sent back to client
```

**Why this matters:** If you need to swap out the AI provider, you only touch `openRouterService.js`. The controller and route stay the same.

### Adding a New Endpoint

1. **Model** (if it needs a new collection): Create a schema in `server/src/models/`.
2. **Controller**: Add a function in `server/src/controllers/` that validates input and calls the model or service.
3. **Route**: Wire the controller to a URL in `server/src/routes/`.
4. **Register**: Import the route file in `app.js` and mount it with `app.use('/api', yourRoutes)`.

### Middleware Stack (order matters)

Defined in `app.js`, applied in this order:

```
1. cors             – Allow requests from the client origin
2. express.json     – Parse JSON request bodies
3. requestLogger    – Log every request (method, URL, status, duration, IP)
4. routes           – Handle the actual request
5. errorHandler     – Catch any unhandled errors (must be last)
```

### Logging (SOLID Pattern)

Logging follows dependency inversion. The middleware does not call `console.log` directly:

```
requestLogger.js    – Factory function: createRequestLogger(logger)
                      Extracts request metadata (method, url, status, duration, ip)
                      Calls logger.log(entry)

ConsoleLogger.js    – Implements log(entry), formats and writes to stdout
```

To switch to file-based logging, create a `FileLogger` with the same `log(entry)` method and pass it to `createRequestLogger()` in `app.js`. No middleware code changes needed.

**Log format:**
```
[2026-03-26T05:23:04.626Z] GET /api/health -> 200 (3ms) from ::1
```

### Error Handling

The project uses `express-async-errors` so you do not need try/catch in route handlers for async errors. They propagate automatically to `errorHandler.js`.

For intentional error responses, throw an error with a `statusCode` property:

```js
const error = new Error('Not found');
error.statusCode = 404;
throw error;
```

### Environment Config

`config/env.js` validates that required variables exist at startup and freezes the config object. If `MONGODB_URI` or `OPENROUTER_API_KEY` is missing, the server crashes immediately with a clear message rather than failing later at runtime.

Always import config from `env.js`, never read `process.env` directly in application code:

```js
const env = require('./config/env');
// env.PORT, env.MONGODB_URI, etc.
```

---

## Frontend Patterns

### Component Architecture

The frontend follows a clear separation between **presentational components** and **logic hooks**:

```
FlowCanvas (presentational shell)
  ├── uses useFlowRunner() for all state and actions
  ├── renders Toolbar (buttons)
  ├── renders ReactFlow (canvas with nodes)
  ├── renders HistorySidebar (saved flows panel)
  └── renders Toast (notifications)
```

`FlowCanvas` owns zero business logic. It delegates everything to `useFlowRunner` and passes callbacks down to child components.

### The Hook Layer

Three custom hooks manage all async and state logic:

| Hook | Responsibility |
|---|---|
| `useFlowRunner` | Central orchestrator. Manages prompt text, last response, node/edge state. Wires together the two hooks below. |
| `useAskAi` | Manages the loading/success/error lifecycle for `POST /api/ask-ai`. |
| `useSaveConversation` | Manages the loading/success/error lifecycle for `POST /api/conversations`. |

Both `useAskAi` and `useSaveConversation` follow the same pattern:

```js
const [status, setStatus] = useState('idle');   // 'idle' | 'loading' | 'success' | 'error'
const [error, setError] = useState(null);

const execute = useCallback(async (...args) => {
  setStatus('loading');
  try {
    const result = await apiCall(...args);
    setStatus('success');
    return result;
  } catch (err) {
    setError(err.response?.data?.error || 'Fallback message');
    setStatus('error');
    return null;
  }
}, []);
```

If you add a new API call, follow this same pattern: create a `useYourAction.js` hook in `hooks/`, manage its lifecycle independently, and compose it in `useFlowRunner`.

### Node State Sync

React Flow nodes are updated via a `useEffect` in `useFlowRunner`:

```js
useEffect(() => {
  setNodes((nds) =>
    nds.map((node) => {
      if (node.id === 'input-1') {
        return { ...node, data: { ...node.data, prompt: promptText, onChange: setPromptText } };
      }
      if (node.id === 'result-1') {
        return { ...node, data: { ...node.data, response: lastResponse, status, error } };
      }
      return node;
    })
  );
}, [promptText, lastResponse, status, error, setNodes]);
```

This keeps React state as the single source of truth. Nodes are just a visual projection of that state.

### Custom React Flow Nodes

Custom nodes live in `components/nodes/`. Key conventions:

- Wrap with `memo()` to prevent unnecessary re-renders.
- Use the `nodrag nowheel` CSS classes on interactive elements (textareas, scrollable divs) so React Flow does not intercept those interactions.
- Receive data through the `data` prop (passed via the node state in `useFlowRunner`).
- Use `<Handle>` components from `@xyflow/react` for connection points.

### Node Type Registry

Defined in `constants/flowDefaults.js` at **module scope**:

```js
export const NODE_TYPES = {
  textInput: TextInputNode,
  result: ResultNode,
};
```

This must stay outside of any component. If defined inside a component, React Flow will unmount and remount every node on each render.

### API Client

All HTTP calls go through `services/api.js`. The axios instance uses a Vite dev proxy (`/api` -> `http://localhost:5000`) so the client never hardcodes the backend URL in development.

To add a new endpoint, add a function here and import it in your hook:

```js
export async function yourNewCall(params) {
  const { data } = await api.post('/api/your-endpoint', params);
  return data;
}
```

### CSS Conventions

- Global CSS variables are in `App.css` (colors, radius, shadows).
- Each component has a co-located `.css` file in its own folder.
- BEM-style class names: `.component__element--modifier`.
- No CSS modules or CSS-in-JS — plain CSS with variables.

---

## Data Flow (End to End)

### Running a Flow

```
User types in TextInputNode
  -> data.onChange(value) updates promptText in useFlowRunner
  -> useEffect syncs promptText into node data
  -> User clicks "Run Flow"
  -> handleRunFlow() fires
  -> Edge animates (visual feedback)
  -> useAskAi.execute(promptText) calls POST /api/ask-ai
  -> Backend: aiController validates -> openRouterService calls OpenRouter
  -> Response returns
  -> setLastResponse(response) updates state
  -> useEffect syncs response into ResultNode data
  -> Edge stops animating
```

### Saving a Flow

```
User clicks "Save"
  -> handleSave() fires
  -> useSaveConversation.execute(prompt, response) calls POST /api/conversations
  -> Backend: conversationController validates -> Conversation.create() saves to MongoDB
  -> Toast shows "Saved to database!"
```

### Viewing History

```
User clicks "View History"
  -> HistorySidebar opens, calls GET /api/conversations
  -> Backend: conversationController.getConversations() queries MongoDB
  -> Sidebar renders list of saved flows
  -> User clicks "Load into flow" on a card
  -> loadFlow(prompt, response) updates promptText and lastResponse
  -> useEffect syncs both into nodes
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ask-ai` | Send `{ prompt }`, receive `{ response }` |
| POST | `/api/conversations` | Save `{ prompt, response }` to MongoDB |
| GET | `/api/conversations` | List all saved conversations (newest first) |
| DELETE | `/api/conversations/:id` | Delete a saved conversation |
| GET | `/api/health` | Health check, returns `{ status: "ok" }` |

---

## Quick Checklist for New Features

- [ ] **Backend**: Model -> Controller -> Route -> Register in `app.js`
- [ ] **Frontend API**: Add function in `services/api.js`
- [ ] **Frontend hook**: Create `useYourFeature.js` following the status/error pattern
- [ ] **Compose**: Wire the hook into `useFlowRunner` (or directly into a component if unrelated to the flow)
- [ ] **UI**: Build the component with a co-located CSS file using BEM naming and CSS variables from `App.css`

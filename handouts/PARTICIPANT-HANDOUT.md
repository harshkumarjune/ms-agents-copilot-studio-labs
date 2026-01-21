# DW-104 Participant Handout
## Build and Extend Agents Using Pro-Code Capabilities
### Microsoft 365 Agents Toolkit & Copilot Studio

---

## Course Overview

| Day | Focus | Labs |
|-----|-------|------|
| **Day 1** | M365 Agents Toolkit (VS Code) | Labs 1, 2, 3 |
| **Day 2** | Copilot Studio Pro-Code | Labs 4, 5 |

---

## Key Concepts

### Copilots vs Agents

| Aspect | Copilot | Agent |
|--------|---------|-------|
| **Role** | Assists user actions | Acts autonomously |
| **Control** | User-initiated | Can be proactive |
| **Scope** | General-purpose | Task-specialized |
| **Example** | "Help me write this email" | "Monitor inbox and flag urgent items" |

### The Agent Loop

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ OBSERVE  │ → │  THINK   │ → │   ACT    │
│          │    │          │    │          │
│ Perceive │    │ Reason   │    │ Execute  │
│ input    │    │ & plan   │    │ action   │
└──────────┘    └──────────┘    └──────────┘
      ↑                               │
      └───────────────────────────────┘
```

### Agent Types

| Type | Best For | Complexity |
|------|----------|------------|
| **Declarative** | Standard scenarios, fast development | Low |
| **Custom Engine** | Complex logic, custom orchestration | High |
| **Copilot Studio** | Low-code + pro-code hybrid | Medium |

---

## Day 1: M365 Agents Toolkit

### Essential Commands

```bash
# Create new agent project
Ctrl+Shift+P → "M365 Agents: Create a New App"

# Sign in to M365
Ctrl+Shift+P → "M365 Agents: Sign in to Microsoft 365"

# Start debugging (deploy to Teams)
F5

# Install dependencies
npm install

# Compile TypeSpec
npx tsp compile appPackage/yourfile.tsp --emit @typespec/openapi3
```

### Project Structure

```
my-agent/
├── appPackage/
│   ├── manifest.json          # Teams app identity
│   ├── declarativeAgent.json  # Agent configuration
│   ├── ai-plugin.json         # Plugin definition
│   └── yourapi.tsp            # TypeSpec API definition
├── src/
│   └── functions/             # API implementations
├── env/
│   └── .env.local             # Environment variables
└── teamsapp.yml               # Deployment config
```

### TypeSpec Quick Reference

```typespec
// Define a model
model Product {
  @key id: string;
  name: string;
  price: float32;
  inStock: boolean;
}

// Define an endpoint
@route("/products")
interface ProductOps {
  @get list(): Product[];
  @get @route("/{id}") get(@path id: string): Product;
  @post create(@body product: Product): Product;
}
```

### Declarative Agent JSON

```json
{
  "name": "My Agent",
  "description": "What it does",
  "instructions": "You are... [system prompt]",
  "capabilities": {
    "conversation_starters": [
      {"title": "Option 1", "text": "Sample query"}
    ]
  },
  "actions": [{"$ref": "ai-plugin.json"}]
}
```

---

## Day 2: Copilot Studio & Azure

### Copilot Studio URLs

| Resource | URL |
|----------|-----|
| Copilot Studio | https://copilotstudio.microsoft.com |
| Azure Portal | https://portal.azure.com |
| AI Foundry | https://ai.azure.com |

### Azure AI Search Quick Reference

```bash
# Create index
curl -X POST "https://YOUR-SEARCH.search.windows.net/indexes?api-version=2024-07-01" \
  -H "api-key: YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d @create-index.json

# Upload documents
curl -X POST "https://YOUR-SEARCH.search.windows.net/indexes/INDEX_NAME/docs/index?api-version=2024-07-01" \
  -H "api-key: YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d @documents.json

# Search
curl -X POST "https://YOUR-SEARCH.search.windows.net/indexes/INDEX_NAME/docs/search?api-version=2024-07-01" \
  -H "api-key: YOUR_QUERY_KEY" \
  -H "Content-Type: application/json" \
  -d '{"search": "your query", "top": 5}'
```

### MCP Protocol Basics

```
┌─────────────────┐         ┌─────────────────┐
│  COPILOT STUDIO │  MCP    │   MCP SERVER    │
│     AGENT       │◄───────►│                 │
│                 │ Protocol│  ┌───────────┐  │
│  Orchestrates   │         │  │   TOOLS   │  │
│  Plans          │         │  └───────────┘  │
│  Invokes        │         │  ┌───────────┐  │
│                 │         │  │ RESOURCES │  │
└─────────────────┘         │  └───────────┘  │
                            └─────────────────┘

MCP Messages:
• tools/list     - Get available tools
• tools/call     - Execute a tool
• resources/list - Get available resources
• resources/read - Read resource content
```

---

## Lab Summary

### Lab 1: Repair Service Agent
**Goal:** Build declarative agent with TypeSpec API
**Key Skills:** TypeSpec, Plugins, API Integration
**Output:** Agent in Teams that checks repair status

### Lab 2: Geo Locator Game
**Goal:** Build agent using only instructions (no code)
**Key Skills:** Instruction Engineering, Prompt Design
**Output:** Interactive geography trivia game

### Lab 3: Semantic Kernel Agent
**Goal:** Build custom engine agent with full code control
**Key Skills:** Semantic Kernel, Plugins, Orchestration
**Output:** Research assistant with multi-step workflows

### Lab 4: MCP Server
**Goal:** Deploy MCP server and connect to Copilot Studio
**Key Skills:** MCP Protocol, Azure Deployment
**Output:** Enterprise tools accessible from Copilot Studio

### Lab 5: Retail Agent
**Goal:** Build agent with Azure AI Search and custom model
**Key Skills:** RAG Pattern, BYOM, Semantic Search
**Output:** Smart product search assistant

---

## Instruction Engineering Principles

### The CRISP Framework

| Element | Description | Example |
|---------|-------------|---------|
| **C**ontext | Background info | "You are a repair service assistant" |
| **R**ules | Constraints & guidelines | "Never reveal internal pricing formulas" |
| **I**nstructions | Step-by-step behavior | "1. Ask for ticket ID, 2. Look up status" |
| **S**amples | Example interactions | "User: 'Check status' → Agent: 'What's your ticket ID?'" |
| **P**ersonality | Tone & style | "Be professional but friendly" |

### Good vs Bad Instructions

❌ **Bad:** "Help users with repairs"

✅ **Good:**
```
You are the Contoso Repair assistant. When a user asks about repairs:

1. Ask for their ticket ID (format: REP-XXX)
2. Look up the ticket using the getRepairStatus tool
3. Present status with:
   - Current status (Submitted/InProgress/Complete)
   - Estimated completion date
   - Cost estimate if available
4. Ask if they need anything else

If ticket not found, offer to create a new one.
```

---

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| TypeSpec won't compile | Check syntax, install `@typespec/http @typespec/openapi3` |
| M365 sign-in fails | Use InPrivate/Incognito browser |
| Teams sideload blocked | Admin Center → Teams → Setup policies → Enable upload |
| F5 debugging hangs | Close other VS Code instances, kill node processes |
| Azure deployment fails | Check region quotas, try different region |
| Search returns nothing | Verify index name, check API key type (admin vs query) |
| Copilot Studio connection error | Check CORS settings on server |

---

## Keyboard Shortcuts

### VS Code

| Action | Windows | Mac |
|--------|---------|-----|
| Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Start Debugging | `F5` | `F5` |
| Stop Debugging | `Shift+F5` | `Shift+F5` |
| Terminal | `` Ctrl+` `` | `` Cmd+` `` |
| Save | `Ctrl+S` | `Cmd+S` |
| Find in Files | `Ctrl+Shift+F` | `Cmd+Shift+F` |

### Copilot Studio

| Action | Shortcut |
|--------|----------|
| Test agent | Click "Test" button or `Ctrl+Enter` |
| Save | `Ctrl+S` |
| Publish | Click "Publish" button |

---

## Resources & Links

### Documentation
- [M365 Agents Toolkit](https://learn.microsoft.com/microsoftteams/platform/toolkit/)
- [TypeSpec](https://typespec.io)
- [Copilot Studio](https://learn.microsoft.com/microsoft-copilot-studio/)
- [Semantic Kernel](https://learn.microsoft.com/semantic-kernel/)
- [Azure AI Search](https://learn.microsoft.com/azure/search/)
- [MCP Protocol](https://modelcontextprotocol.io)

### Certification Path
- **PL-400:** Microsoft Power Platform Developer
- **AI-102:** Azure AI Engineer Associate

---

## Notes Section

### Day 1 Notes
```
_____________________________________________
_____________________________________________
_____________________________________________
_____________________________________________
_____________________________________________
```

### Day 2 Notes
```
_____________________________________________
_____________________________________________
_____________________________________________
_____________________________________________
_____________________________________________
```

### Questions for Instructor
```
_____________________________________________
_____________________________________________
_____________________________________________
```

---

*DW-104 Participant Handout | Version 1.0 | January 2026*

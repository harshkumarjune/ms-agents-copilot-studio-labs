# Microsoft 365 Agents Quick Reference Card
## DW-104: Pro-Code Training Cheat Sheet

---

## Agent Types at a Glance

| Type | When to Use | Key Files | Dev Time |
|------|-------------|-----------|----------|
| **Declarative** | Standard scenarios, quick deployment | `declarativeAgent.json`, `ai-plugin.json` | Hours |
| **Custom Engine** | Complex reasoning, custom LLMs | `orchestrator.ts`, plugins | Days |
| **MCP Server** | External tool/data integration | `server.ts`, tools | Hours-Days |

---

## Essential Commands

### M365 Agents Toolkit (VS Code)

```
Ctrl+Shift+P → "M365 Agents: Create New App"     # New project
F5                                                # Debug/run locally
Ctrl+Shift+P → "M365 Agents: Deploy"             # Deploy to Azure
Ctrl+Shift+P → "M365 Agents: Publish"            # Publish to Teams
```

### Node.js / npm

```bash
npm install                    # Install dependencies
npm run build                  # Build project
npm run dev                    # Start dev server
npm run typespec:compile       # Compile TypeSpec to OpenAPI
```

### Azure CLI

```bash
az login                       # Login to Azure
az account set -s <sub-id>     # Set subscription
az webapp up --name <app>      # Deploy web app
```

---

## Project Structure

```
my-agent/
├── appPackage/
│   ├── manifest.json          # Teams app manifest
│   ├── declarativeAgent.json  # Agent definition
│   └── ai-plugin.json         # Plugin config
├── src/
│   ├── api/                   # API implementations
│   └── functions/             # Azure Functions
├── infra/                     # Bicep/Terraform
├── .env                       # Environment vars
├── package.json               # Dependencies
└── teamsapp.yml               # Deployment config
```

---

## Key Configuration Files

### declarativeAgent.json

```json
{
  "$schema": "...declarative-agent/v1.2/schema.json",
  "version": "v1.2",
  "name": "Agent Name",
  "description": "What this agent does",
  "instructions": "## Role\nYou are...",
  "capabilities": [
    { "name": "WebSearch", "enabled": false }
  ],
  "actions": [
    { "id": "pluginId", "file": "ai-plugin.json" }
  ],
  "conversation_starters": [
    { "title": "Start", "text": "Help me with..." }
  ]
}
```

### ai-plugin.json (Function)

```json
{
  "name": "functionName",
  "description": "What this function does",
  "parameters": {
    "type": "object",
    "properties": {
      "param1": {
        "type": "string",
        "description": "Description"
      }
    },
    "required": ["param1"]
  }
}
```

---

## TypeSpec Basics

```typespec
// Model definition
model Repair {
  id: string;
  title: string;
  status: "open" | "in_progress" | "closed";
  createdAt: utcDateTime;
}

// API operation
@route("/repairs")
interface RepairOperations {
  @get list(): Repair[];
  @get read(@path id: string): Repair;
  @post create(@body repair: RepairRequest): Repair;
}
```

Compile: `npm run typespec:compile`

---

## Semantic Kernel Patterns

### Initialize Kernel

```typescript
import { Kernel } from "@microsoft/semantic-kernel";

const kernel = new Kernel();
kernel.addService(new AzureOpenAITextCompletion({
  deploymentName: "gpt-4",
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_KEY
}));
```

### Add Plugin

```typescript
kernel.addPlugin(new MyPlugin(), "pluginName");
const result = await kernel.invoke(
  kernel.getPlugin("pluginName").get("functionName"),
  { arg1: "value" }
);
```

### Invoke Prompt

```typescript
const result = await kernel.invokePrompt(`
  Summarize: {{$input}}
`, { input: userText });
```

---

## MCP Server Template

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server({ name: "my-server", version: "1.0.0" }, {
  capabilities: { tools: {}, resources: {} }
});

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "my_tool",
    description: "What it does",
    inputSchema: { type: "object", properties: {...} }
  }]
}));

// Handle tool call
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  // Execute tool logic
  return { content: [{ type: "text", text: result }] };
});
```

---

## Azure AI Search (RAG)

### Create Index Schema

```json
{
  "name": "my-index",
  "fields": [
    { "name": "id", "type": "Edm.String", "key": true },
    { "name": "content", "type": "Edm.String", "searchable": true },
    { "name": "contentVector", "type": "Collection(Edm.Single)",
      "dimensions": 1536, "vectorSearchProfile": "vector-profile" }
  ],
  "vectorSearch": {
    "profiles": [{ "name": "vector-profile", "algorithm": "hnsw" }]
  }
}
```

### Hybrid Search Query

```typescript
const results = await searchClient.search(query, {
  vectorSearchOptions: {
    queries: [{
      kind: "vector",
      vector: embedding,
      fields: ["contentVector"],
      kNearestNeighborsCount: 5
    }]
  },
  queryType: "semantic",
  top: 5
});
```

---

## Governance & Security

### Admin Centers

| Task | Location |
|------|----------|
| Agent deployment | M365 Admin Center |
| Cost controls | Power Platform Admin Center |
| DLP policies | Microsoft Purview |
| Access policies | Entra Admin Center |

### Security Checklist

- [ ] Configure Microsoft Entra Agent ID
- [ ] Set up DLP policies
- [ ] Apply sensitivity labels
- [ ] Enable audit logging
- [ ] Configure conditional access
- [ ] Set cost limits

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Teams won't load agent | Clear Teams cache, sign out/in |
| F5 debug hangs | Check no other debug session running |
| API timeout | Check Azure Function timeout settings |
| TypeSpec compile error | Check syntax, especially decorators |
| Plugin not recognized | Verify `ai-plugin.json` format |

---

## Environment Variables

```env
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com/
AZURE_OPENAI_KEY=xxx
AZURE_OPENAI_DEPLOYMENT=gpt-4

# Azure AI Search
AZURE_SEARCH_ENDPOINT=https://xxx.search.windows.net
AZURE_SEARCH_KEY=xxx
AZURE_SEARCH_INDEX=my-index

# MCP Server
MCP_SERVER_PORT=3001
```

---

## Useful Links

- [M365 Agents Toolkit Docs](https://learn.microsoft.com/microsoft-365-copilot/extensibility/)
- [Semantic Kernel](https://learn.microsoft.com/semantic-kernel/)
- [MCP Specification](https://modelcontextprotocol.io/)
- [Azure AI Search](https://learn.microsoft.com/azure/search/)
- [TypeSpec](https://typespec.io/)

---

*Quick Reference v1.0 | DW-104 Training*

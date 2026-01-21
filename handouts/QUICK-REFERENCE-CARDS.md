# Quick Reference Cards
## DW-104: Microsoft 365 Agents Pro-Code Training

---

# CARD 1: TypeSpec Syntax Reference

## Basic Types

| Type | Example | Notes |
|------|---------|-------|
| `string` | `name: string` | Text values |
| `int32` | `count: int32` | Integer numbers |
| `float32` | `price: float32` | Decimal numbers |
| `boolean` | `inStock: boolean` | true/false |
| `bytes` | `data: bytes` | Binary data |

## Optional & Key Fields

```typespec
model Product {
  @key id: string;           // Primary key
  name: string;              // Required field
  description?: string;      // Optional (?)
}
```

## Enums

```typespec
enum Status {
  Pending,
  InProgress,
  Completed,
  Cancelled
}

model Order {
  status: Status;
}
```

## Collections

```typespec
model Cart {
  items: Product[];                    // Array
  tags: string[];                      // String array
  metadata: Record<string>;            // Dictionary
}
```

## HTTP Operations

| Decorator | HTTP Method | Example |
|-----------|-------------|---------|
| `@get` | GET | List, Read |
| `@post` | POST | Create |
| `@put` | PUT | Replace |
| `@patch` | PATCH | Update |
| `@delete` | DELETE | Remove |

## Route Definition

```typespec
@route("/products")
interface ProductOperations {
  @get
  @operationId("listProducts")
  @doc("List all products")
  list(@query category?: string): Product[];

  @get
  @route("/{id}")
  @operationId("getProduct")
  get(@path id: string): Product;

  @post
  @operationId("createProduct")
  create(@body product: Product): Product;

  @delete
  @route("/{id}")
  @operationId("deleteProduct")
  delete(@path id: string): void;
}
```

## Query, Path, Header, Body

```typespec
@get
search(
  @query q: string,           // ?q=value
  @query limit?: int32,       // ?limit=10
  @header authorization: string,  // Header
  @path id: string            // /products/{id}
): Product[];

@post
create(@body product: Product): Product;
```

## Compile Command

```bash
npx tsp compile appPackage/api.tsp --emit @typespec/openapi3
```

---

# CARD 2: Declarative Agent Configuration

## Agent JSON Structure

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.2/schema.json",
  "version": "v1.2",
  "name": "Agent Name",
  "description": "What the agent does",
  "instructions": "System prompt...",
  "capabilities": {
    "conversation_starters": []
  },
  "actions": []
}
```

## Conversation Starters

```json
"conversation_starters": [
  {
    "title": "Short Label",
    "text": "Full prompt text that triggers this action"
  }
]
```

## Actions (Plugins)

```json
"actions": [
  {
    "$ref": "ai-plugin.json"
  }
]
```

## Plugin JSON Structure

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/plugin/v2.2/schema.json",
  "schema_version": "v2.2",
  "name_for_human": "Display Name",
  "description_for_human": "Description",
  "namespace": "pluginNamespace",
  "functions": [
    {
      "name": "functionName",
      "description": "What this function does - AI reads this!"
    }
  ],
  "runtimes": [
    {
      "type": "OpenApi",
      "auth": { "type": "None" },
      "spec": { "url": "apiSpecificationFile/api.json" }
    }
  ]
}
```

## Teams Manifest Key Fields

```json
{
  "manifestVersion": "1.17",
  "id": "${{TEAMS_APP_ID}}",
  "name": { "short": "Name", "full": "Full Name" },
  "description": { "short": "Brief", "full": "Detailed" },
  "copilotAgents": {
    "declarativeAgents": [
      {
        "id": "agentId",
        "file": "declarativeAgent.json"
      }
    ]
  }
}
```

---

# CARD 3: Instruction Engineering Patterns

## Structure Template

```markdown
You are [PERSONA]. Your role is to [PRIMARY FUNCTION].

## Capabilities
1. [Capability 1]
2. [Capability 2]
3. [Capability 3]

## Rules
- [Constraint 1]
- [Constraint 2]
- [What NOT to do]

## Response Format
[How to format responses]

## Examples
User: "[sample input]"
Assistant: "[sample response]"

## Edge Cases
- If [situation], then [action]
- If [unknown], then [fallback]
```

## Effective Patterns

| Pattern | Example |
|---------|---------|
| **Persona** | "You are a helpful customer service agent for Contoso" |
| **Boundaries** | "Only answer questions about our products. For other topics, politely redirect" |
| **Format** | "Always respond with bullet points and include pricing" |
| **Tone** | "Be professional but friendly. Use clear, simple language" |
| **Fallback** | "If you don't know, say so and offer to connect to a human" |

## State Tracking Instructions

```markdown
## State Management
Always track and mention:
- Current step in the workflow
- User's previous selections
- Running totals or scores
- Number of attempts remaining

Begin each response by acknowledging the current state.
```

## Multi-Turn Conversation Pattern

```markdown
## Conversation Flow
1. GREETING: Welcome user, explain capabilities
2. GATHER: Ask clarifying questions one at a time
3. CONFIRM: Summarize understanding before acting
4. EXECUTE: Perform the requested action
5. FOLLOW-UP: Ask if anything else is needed

Never skip the CONFIRM step for important actions.
```

## Error Handling Instructions

```markdown
## Error Handling
- If user input is unclear: Ask for clarification with specific options
- If action fails: Explain what went wrong and suggest alternatives
- If outside scope: Politely explain limitations and redirect
- If frustrated user: Acknowledge, apologize, offer human escalation
```

---

# CARD 4: Semantic Kernel Patterns

## Kernel Setup

```typescript
import { Kernel } from "@microsoft/semantic-kernel";
import { AzureChatCompletion } from "@microsoft/semantic-kernel/azureopenai";

const kernel = new Kernel();

kernel.addService(new AzureChatCompletion({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  deploymentName: "gpt-4"
}));
```

## Creating Plugins

```typescript
import { kernel_function } from "@microsoft/semantic-kernel";

class MyPlugin {
  @kernel_function({
    name: "function_name",
    description: "Description for AI to understand when to use"
  })
  async myFunction(input: string): Promise<string> {
    // Implementation
    return result;
  }
}

// Register plugin
kernel.addPlugin(new MyPlugin(), "pluginName");
```

## Invoking Functions

```typescript
// Direct invocation
const result = await kernel.invokePrompt("Your prompt here");

// With variables
const result = await kernel.invokePrompt(
  "Summarize this: {{$input}}",
  { input: textToSummarize }
);

// Call specific function
const result = await kernel.invoke("pluginName", "functionName", {
  param1: "value1"
});
```

## Memory Pattern

```typescript
class ConversationMemory {
  private history: string[] = [];

  add(role: string, content: string) {
    this.history.push(`${role}: ${content}`);
  }

  getContext(): string {
    return this.history.slice(-10).join('\n'); // Last 10 messages
  }

  clear() {
    this.history = [];
  }
}
```

## Planner Pattern

```typescript
async function executeWithPlan(kernel: Kernel, goal: string) {
  // 1. Create plan
  const planPrompt = `
    Goal: ${goal}
    Available functions: ${kernel.getPlugins().map(p => p.name).join(', ')}
    Create a step-by-step plan using these functions.
  `;

  const plan = await kernel.invokePrompt(planPrompt);

  // 2. Execute plan steps
  for (const step of parseSteps(plan)) {
    await kernel.invoke(step.plugin, step.function, step.args);
  }
}
```

---

# CARD 5: MCP Server Implementation

## Server Structure

```typescript
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// List tools
app.get("/mcp/tools", (req, res) => {
  res.json({ tools: [...] });
});

// Execute tool
app.post("/mcp/tools/:toolName", (req, res) => {
  const { toolName } = req.params;
  const args = req.body;
  // Execute and return result
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(3001);
```

## Tool Definition Schema

```json
{
  "name": "tool_name",
  "description": "Clear description for AI",
  "inputSchema": {
    "type": "object",
    "properties": {
      "param1": {
        "type": "string",
        "description": "What this parameter does"
      },
      "param2": {
        "type": "number",
        "description": "Numeric value for X"
      }
    },
    "required": ["param1"]
  }
}
```

## Azure Deployment Commands

```bash
# Login
az login

# Create resources
az group create --name rg-mcp --location eastus

az appservice plan create \
  --name plan-mcp \
  --resource-group rg-mcp \
  --sku B1 --is-linux

az webapp create \
  --name mcp-server-NAME \
  --resource-group rg-mcp \
  --plan plan-mcp \
  --runtime "NODE:18-lts"

# Deploy
npm run build
zip -r deploy.zip dist package.json package-lock.json

az webapp deploy \
  --resource-group rg-mcp \
  --name mcp-server-NAME \
  --src-path deploy.zip \
  --type zip

# Configure
az webapp config appsettings set \
  --resource-group rg-mcp \
  --name mcp-server-NAME \
  --settings PORT=8080
```

## Copilot Studio Integration

1. Go to **Tools** → **+ Add tool**
2. Select **Custom connector** or **OpenAPI**
3. Enter server URL: `https://your-server.azurewebsites.net/openapi.json`
4. Configure authentication (if any)
5. Save and test

---

# CARD 6: Azure AI Search Reference

## Index Field Types

| Type | Use Case |
|------|----------|
| `Edm.String` | Text content |
| `Edm.Int32` | Integers |
| `Edm.Double` | Decimals |
| `Edm.Boolean` | True/False |
| `Edm.DateTimeOffset` | Dates |
| `Collection(Edm.String)` | String arrays |
| `Edm.ComplexType` | Nested objects |

## Field Attributes

| Attribute | Purpose |
|-----------|---------|
| `key: true` | Primary key (required) |
| `searchable: true` | Full-text search |
| `filterable: true` | Use in $filter |
| `sortable: true` | Use in $orderby |
| `facetable: true` | Aggregation/counts |
| `retrievable: true` | Return in results |

## Index Definition

```json
{
  "name": "products",
  "fields": [
    {"name": "id", "type": "Edm.String", "key": true},
    {"name": "name", "type": "Edm.String", "searchable": true, "sortable": true},
    {"name": "category", "type": "Edm.String", "filterable": true, "facetable": true},
    {"name": "price", "type": "Edm.Double", "filterable": true, "sortable": true},
    {"name": "tags", "type": "Collection(Edm.String)", "searchable": true}
  ],
  "semantic": {
    "configurations": [{
      "name": "my-semantic-config",
      "prioritizedFields": {
        "titleField": {"fieldName": "name"},
        "contentFields": [{"fieldName": "description"}],
        "keywordsFields": [{"fieldName": "tags"}]
      }
    }]
  }
}
```

## Search Query Examples

```bash
# Simple search
{"search": "laptop"}

# With filter
{"search": "laptop", "filter": "price lt 1500"}

# With facets
{"search": "*", "facets": ["category", "brand"]}

# Semantic search
{
  "search": "laptop for video editing",
  "queryType": "semantic",
  "semanticConfiguration": "my-semantic-config"
}

# Combined
{
  "search": "wireless headphones",
  "filter": "category eq 'Audio' and price lt 400",
  "orderby": "rating desc",
  "top": 5,
  "select": "name,price,rating"
}
```

## Filter Syntax

| Operator | Example |
|----------|---------|
| `eq` | `category eq 'Laptops'` |
| `ne` | `status ne 'Sold'` |
| `gt`, `ge` | `price gt 100` |
| `lt`, `le` | `rating le 4.5` |
| `and`, `or` | `price lt 500 and rating gt 4` |
| `search.in` | `search.in(category, 'A,B,C')` |

---

# CARD 7: Copilot Studio Configuration

## Agent Settings

| Setting | Location | Purpose |
|---------|----------|---------|
| Name & Description | Overview | Agent identity |
| Instructions | Overview | System prompt |
| Knowledge | Knowledge | Data sources |
| Tools | Tools | External APIs |
| Topics | Topics | Conversation flows |
| Channels | Channels | Deployment targets |

## Adding Knowledge Sources

### Azure AI Search
1. **Knowledge** → **+ Add knowledge**
2. Select **Azure AI Search**
3. Enter:
   - Service URL
   - API Key (Query key)
   - Index Name
4. Enable semantic search
5. Save

### SharePoint
1. **Knowledge** → **+ Add knowledge**
2. Select **SharePoint**
3. Choose sites/libraries
4. Save

### Dataverse
1. **Knowledge** → **+ Add knowledge**
2. Select **Dataverse**
3. Select tables
4. Save

## Custom Model (BYOM)

1. **Settings** → **Generative AI**
2. Select **Use custom model**
3. Configure:
   ```
   Endpoint: https://YOUR-RESOURCE.openai.azure.com/
   API Key: YOUR_KEY
   Deployment: gpt-4
   API Version: 2024-02-15-preview
   ```
4. Save

## Publishing

1. Click **Publish** (top right)
2. Select version note
3. Choose channels:
   - Microsoft Teams
   - Web Chat
   - Custom websites
4. Configure channel settings
5. Deploy

## Testing

- Use **Test** panel (right side)
- Check **Activity** for tool calls
- View **Variables** for state
- Monitor **Analytics** for usage

---

# CARD 8: Common Patterns & Anti-Patterns

## Patterns

### RAG (Retrieval-Augmented Generation)

```
User Query → Search Index → Retrieve Docs → Augment Prompt → Generate Response
```

**Implementation:**
1. User asks question
2. Search knowledge base
3. Include relevant docs in prompt
4. Generate contextual response

### Chain of Thought

```markdown
## Instructions
When solving complex problems:
1. Break down the problem into steps
2. Show your reasoning for each step
3. Verify each step before proceeding
4. Provide final answer with confidence level
```

### Tool Selection

```markdown
## Tool Selection Rules
- For employee queries → use get_employee or search_employees
- For inventory queries → use get_inventory
- For support requests → use create_ticket
- When unsure → ask user to clarify before calling tools
```

## Anti-Patterns to Avoid

| Anti-Pattern | Why Bad | Better Approach |
|--------------|---------|-----------------|
| Vague instructions | Unpredictable behavior | Be specific and structured |
| No error handling | Crashes or bad UX | Include fallback instructions |
| Too many tools | Confusion in selection | Group related tools, clear descriptions |
| No examples | AI guesses format | Include sample interactions |
| Ignoring context | Loses conversation state | Explicit state tracking |
| Over-promising | Sets wrong expectations | Clear scope boundaries |

## Security Checklist

- [ ] Never expose API keys in client code
- [ ] Use Query keys (not Admin) for search
- [ ] Validate user input before tool calls
- [ ] Implement rate limiting
- [ ] Log tool usage for audit
- [ ] Use HTTPS everywhere
- [ ] Configure CORS properly

---

*Quick Reference Cards v1.0 | DW-104 | January 2026*

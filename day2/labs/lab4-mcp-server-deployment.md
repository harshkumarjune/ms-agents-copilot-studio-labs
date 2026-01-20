# Lab 4: Deploy an MCP Server and Use It in Copilot Studio
## Model Context Protocol Integration

**Duration:** 45 minutes
**Difficulty:** High
**LOD Module:** PL-400-M02-L01

---

## 🎯 Lab Objectives

By the end of this lab, you will be able to:
1. Understand Model Context Protocol (MCP) architecture
2. Build and deploy an MCP server
3. Configure MCP integration in Copilot Studio
4. Create an agent that leverages MCP tools
5. Test and debug MCP connections

---

## 📋 Scenario

**Enterprise Data Assistant** - Your organization needs an agent that can:
- Access internal databases and systems
- Execute specialized business operations
- Integrate with legacy applications
- Provide secure, authenticated tool access

MCP provides a standardized protocol for connecting AI agents to external tools and data sources, enabling enterprise-grade integrations.

---

## 🔧 Prerequisites Checklist

Before starting, verify:
- [ ] Access to Copilot Studio (copilotstudio.microsoft.com)
- [ ] Node.js 18+ installed
- [ ] Azure subscription for App Service deployment
- [ ] Basic understanding of REST APIs
- [ ] Completed Day 1 labs

---

## Part 1: Understanding MCP Architecture (10 minutes)

### What is Model Context Protocol?

```
┌─────────────────────────────────────────────────────────────────┐
│                    MCP ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐         ┌─────────────────────────────┐   │
│  │  COPILOT STUDIO │         │        MCP SERVER           │   │
│  │      AGENT      │◄───────►│                             │   │
│  │                 │   MCP   │  ┌─────────┐  ┌─────────┐  │   │
│  │  • Orchestrates │ Protocol│  │  TOOL   │  │  TOOL   │  │   │
│  │  • Plans        │         │  │    1    │  │    2    │  │   │
│  │  • Invokes      │         │  └─────────┘  └─────────┘  │   │
│  └─────────────────┘         │                             │   │
│                              │  ┌─────────┐  ┌─────────┐  │   │
│                              │  │ RESOURCE│  │ RESOURCE│  │   │
│                              │  │    1    │  │    2    │  │   │
│                              │  └─────────┘  └─────────┘  │   │
│                              └─────────────────────────────┘   │
│                                                                 │
│  MCP PROTOCOL MESSAGES:                                        │
│  • tools/list      - Get available tools                       │
│  • tools/call      - Execute a tool                            │
│  • resources/list  - Get available resources                   │
│  • resources/read  - Read resource content                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### MCP vs Traditional APIs

| Aspect | Traditional API | MCP |
|--------|-----------------|-----|
| Discovery | Manual documentation | Automatic tool listing |
| Schema | Various formats | Standardized JSON Schema |
| Invocation | HTTP calls | Protocol messages |
| Context | None | Rich context passing |
| AI Optimization | No | Yes, designed for LLMs |

---

## Part 2: Build the MCP Server (15 minutes)

### Step 2.1: Create Project

```bash
mkdir enterprise-mcp-server
cd enterprise-mcp-server
npm init -y
```

### Step 2.2: Install Dependencies

```bash
npm install @modelcontextprotocol/sdk express cors dotenv uuid
npm install -D typescript @types/node @types/express ts-node nodemon
```

### Step 2.3: Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 2.4: Create MCP Server

Create `src/server.ts`:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  Tool,
  Resource
} from "@modelcontextprotocol/sdk/types.js";

// Define available tools
const tools: Tool[] = [
  {
    name: "get_employee",
    description: "Get employee information by ID or email",
    inputSchema: {
      type: "object",
      properties: {
        identifier: {
          type: "string",
          description: "Employee ID or email address"
        }
      },
      required: ["identifier"]
    }
  },
  {
    name: "search_employees",
    description: "Search employees by department, role, or name",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query"
        },
        department: {
          type: "string",
          description: "Filter by department"
        },
        limit: {
          type: "number",
          description: "Maximum results to return",
          default: 10
        }
      },
      required: ["query"]
    }
  },
  {
    name: "get_inventory",
    description: "Get inventory status for a product",
    inputSchema: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description: "Product ID or SKU"
        },
        warehouse: {
          type: "string",
          description: "Warehouse location (optional)"
        }
      },
      required: ["productId"]
    }
  },
  {
    name: "create_ticket",
    description: "Create a support ticket in the helpdesk system",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Ticket title"
        },
        description: {
          type: "string",
          description: "Detailed description"
        },
        priority: {
          type: "string",
          enum: ["low", "medium", "high", "urgent"],
          description: "Ticket priority"
        },
        category: {
          type: "string",
          enum: ["IT", "HR", "Facilities", "Finance"],
          description: "Ticket category"
        }
      },
      required: ["title", "description", "priority", "category"]
    }
  },
  {
    name: "run_report",
    description: "Run a pre-defined business report",
    inputSchema: {
      type: "object",
      properties: {
        reportName: {
          type: "string",
          enum: ["sales_summary", "inventory_status", "employee_roster", "expense_report"],
          description: "Name of the report to run"
        },
        dateRange: {
          type: "object",
          properties: {
            start: { type: "string", description: "Start date (YYYY-MM-DD)" },
            end: { type: "string", description: "End date (YYYY-MM-DD)" }
          }
        },
        format: {
          type: "string",
          enum: ["summary", "detailed", "export"],
          default: "summary"
        }
      },
      required: ["reportName"]
    }
  }
];

// Define available resources
const resources: Resource[] = [
  {
    uri: "enterprise://policies/handbook",
    name: "Employee Handbook",
    description: "Company policies and procedures",
    mimeType: "text/markdown"
  },
  {
    uri: "enterprise://data/departments",
    name: "Department Directory",
    description: "List of all departments and their details",
    mimeType: "application/json"
  },
  {
    uri: "enterprise://data/products",
    name: "Product Catalog",
    description: "Complete product catalog with pricing",
    mimeType: "application/json"
  }
];

// Mock data
const mockEmployees = [
  { id: "EMP001", name: "Alice Johnson", email: "alice@contoso.com", department: "Engineering", role: "Senior Developer" },
  { id: "EMP002", name: "Bob Smith", email: "bob@contoso.com", department: "Sales", role: "Account Executive" },
  { id: "EMP003", name: "Carol White", email: "carol@contoso.com", department: "HR", role: "HR Manager" },
  { id: "EMP004", name: "David Brown", email: "david@contoso.com", department: "Engineering", role: "DevOps Engineer" },
  { id: "EMP005", name: "Eve Davis", email: "eve@contoso.com", department: "Finance", role: "Financial Analyst" }
];

const mockInventory = [
  { productId: "SKU001", name: "Laptop Pro 15", stock: 45, warehouse: "Main", price: 1299.99 },
  { productId: "SKU002", name: "Wireless Mouse", stock: 250, warehouse: "Main", price: 29.99 },
  { productId: "SKU003", name: "USB-C Hub", stock: 120, warehouse: "West", price: 49.99 },
  { productId: "SKU004", name: "Monitor 27\"", stock: 30, warehouse: "Main", price: 399.99 }
];

// Tool implementations
async function executeTool(name: string, args: any): Promise<any> {
  switch (name) {
    case "get_employee": {
      const employee = mockEmployees.find(
        e => e.id === args.identifier || e.email === args.identifier
      );
      if (!employee) {
        return { error: `Employee not found: ${args.identifier}` };
      }
      return employee;
    }

    case "search_employees": {
      const query = args.query.toLowerCase();
      let results = mockEmployees.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.role.toLowerCase().includes(query) ||
        e.department.toLowerCase().includes(query)
      );
      if (args.department) {
        results = results.filter(e => e.department === args.department);
      }
      return results.slice(0, args.limit || 10);
    }

    case "get_inventory": {
      const product = mockInventory.find(p => p.productId === args.productId);
      if (!product) {
        return { error: `Product not found: ${args.productId}` };
      }
      if (args.warehouse && product.warehouse !== args.warehouse) {
        return { ...product, stock: 0, note: `No stock in ${args.warehouse}` };
      }
      return product;
    }

    case "create_ticket": {
      const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}`;
      return {
        ticketId,
        title: args.title,
        description: args.description,
        priority: args.priority,
        category: args.category,
        status: "Open",
        createdAt: new Date().toISOString(),
        message: `Ticket ${ticketId} created successfully`
      };
    }

    case "run_report": {
      const reportData: Record<string, any> = {
        sales_summary: {
          totalSales: 125000,
          orderCount: 450,
          avgOrderValue: 277.78,
          topProduct: "Laptop Pro 15",
          period: args.dateRange || "Last 30 days"
        },
        inventory_status: {
          totalProducts: mockInventory.length,
          totalValue: mockInventory.reduce((sum, p) => sum + (p.stock * p.price), 0),
          lowStock: mockInventory.filter(p => p.stock < 50).map(p => p.name),
          lastUpdated: new Date().toISOString()
        },
        employee_roster: {
          totalEmployees: mockEmployees.length,
          byDepartment: mockEmployees.reduce((acc, e) => {
            acc[e.department] = (acc[e.department] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        },
        expense_report: {
          totalExpenses: 45000,
          byCategory: {
            Travel: 15000,
            Software: 12000,
            Equipment: 10000,
            Other: 8000
          },
          pending: 5,
          approved: 23
        }
      };

      return {
        report: args.reportName,
        format: args.format || "summary",
        data: reportData[args.reportName] || { error: "Report not found" },
        generatedAt: new Date().toISOString()
      };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// Resource content
function getResourceContent(uri: string): string {
  switch (uri) {
    case "enterprise://policies/handbook":
      return `# Employee Handbook\n\n## Work Hours\nStandard hours: 9 AM - 5 PM\nFlexible scheduling available with manager approval.\n\n## PTO Policy\n- 15 days vacation\n- 10 sick days\n- 5 personal days\n\n## Remote Work\nHybrid model: 3 days office, 2 days remote.`;

    case "enterprise://data/departments":
      return JSON.stringify([
        { name: "Engineering", head: "Alice Johnson", size: 25 },
        { name: "Sales", head: "Bob Smith", size: 15 },
        { name: "HR", head: "Carol White", size: 5 },
        { name: "Finance", head: "Eve Davis", size: 8 }
      ], null, 2);

    case "enterprise://data/products":
      return JSON.stringify(mockInventory, null, 2);

    default:
      return `Resource not found: ${uri}`;
  }
}

// Create and configure server
const server = new Server(
  {
    name: "enterprise-mcp-server",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools
}));

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  console.log(`Executing tool: ${name}`, args);

  try {
    const result = await executeTool(name, args || {});
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing ${name}: ${error}`
        }
      ],
      isError: true
    };
  }
});

// Handle resource listing
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources
}));

// Handle resource reading
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const content = getResourceContent(uri);
  const resource = resources.find(r => r.uri === uri);

  return {
    contents: [
      {
        uri,
        mimeType: resource?.mimeType || "text/plain",
        text: content
      }
    ]
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Enterprise MCP Server running on stdio");
}

main().catch(console.error);
```

### Step 2.5: Create HTTP Wrapper (for Copilot Studio)

Create `src/http-server.ts`:

```typescript
import express from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Import tool implementations (simplified for HTTP)
const mockEmployees = [
  { id: "EMP001", name: "Alice Johnson", email: "alice@contoso.com", department: "Engineering", role: "Senior Developer" },
  { id: "EMP002", name: "Bob Smith", email: "bob@contoso.com", department: "Sales", role: "Account Executive" },
  { id: "EMP003", name: "Carol White", email: "carol@contoso.com", department: "HR", role: "HR Manager" }
];

const mockInventory = [
  { productId: "SKU001", name: "Laptop Pro 15", stock: 45, warehouse: "Main", price: 1299.99 },
  { productId: "SKU002", name: "Wireless Mouse", stock: 250, warehouse: "Main", price: 29.99 }
];

// MCP-compatible endpoints

// List available tools
app.get("/mcp/tools", (req, res) => {
  res.json({
    tools: [
      {
        name: "get_employee",
        description: "Get employee information by ID or email",
        inputSchema: {
          type: "object",
          properties: {
            identifier: { type: "string", description: "Employee ID or email" }
          },
          required: ["identifier"]
        }
      },
      {
        name: "search_employees",
        description: "Search employees by department, role, or name",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            department: { type: "string" },
            limit: { type: "number" }
          },
          required: ["query"]
        }
      },
      {
        name: "get_inventory",
        description: "Get inventory status for a product",
        inputSchema: {
          type: "object",
          properties: {
            productId: { type: "string" }
          },
          required: ["productId"]
        }
      },
      {
        name: "create_ticket",
        description: "Create a support ticket",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
            category: { type: "string", enum: ["IT", "HR", "Facilities", "Finance"] }
          },
          required: ["title", "description", "priority", "category"]
        }
      }
    ]
  });
});

// Execute tool
app.post("/mcp/tools/:toolName", (req, res) => {
  const { toolName } = req.params;
  const args = req.body;

  console.log(`Executing tool: ${toolName}`, args);

  try {
    let result;

    switch (toolName) {
      case "get_employee":
        result = mockEmployees.find(
          e => e.id === args.identifier || e.email === args.identifier
        ) || { error: "Employee not found" };
        break;

      case "search_employees":
        const query = (args.query || "").toLowerCase();
        result = mockEmployees.filter(e =>
          e.name.toLowerCase().includes(query) ||
          e.department.toLowerCase().includes(query)
        ).slice(0, args.limit || 10);
        break;

      case "get_inventory":
        result = mockInventory.find(p => p.productId === args.productId)
          || { error: "Product not found" };
        break;

      case "create_ticket":
        result = {
          ticketId: `TKT-${Date.now().toString(36).toUpperCase()}`,
          ...args,
          status: "Open",
          createdAt: new Date().toISOString()
        };
        break;

      default:
        result = { error: `Unknown tool: ${toolName}` };
    }

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// OpenAPI spec for Copilot Studio
app.get("/openapi.json", (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "Enterprise MCP Server",
      version: "1.0.0",
      description: "MCP-compatible API for enterprise tools"
    },
    servers: [
      { url: process.env.SERVER_URL || `http://localhost:${PORT}` }
    ],
    paths: {
      "/mcp/tools/{toolName}": {
        post: {
          operationId: "executeTool",
          summary: "Execute an MCP tool",
          parameters: [
            {
              name: "toolName",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: { type: "object" }
              }
            }
          },
          responses: {
            "200": {
              description: "Tool execution result",
              content: {
                "application/json": {
                  schema: { type: "object" }
                }
              }
            }
          }
        }
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Enterprise MCP HTTP Server running on port ${PORT}`);
  console.log(`OpenAPI spec: http://localhost:${PORT}/openapi.json`);
  console.log(`Tools list: http://localhost:${PORT}/mcp/tools`);
});
```

### Step 2.6: Update Package Scripts

Update `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/http-server.js",
    "start:stdio": "node dist/server.js",
    "dev": "nodemon --exec ts-node src/http-server.ts",
    "test": "curl http://localhost:3001/mcp/tools"
  }
}
```

---

## Part 3: Deploy to Azure (10 minutes)

### Step 3.1: Create Azure App Service

```bash
# Login to Azure
az login

# Create resource group
az group create --name rg-mcp-server --location eastus

# Create App Service plan
az appservice plan create \
  --name plan-mcp-server \
  --resource-group rg-mcp-server \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --name enterprise-mcp-server-$RANDOM \
  --resource-group rg-mcp-server \
  --plan plan-mcp-server \
  --runtime "NODE:18-lts"
```

### Step 3.2: Deploy Code

```bash
# Build
npm run build

# Create deployment package
zip -r deploy.zip dist package.json package-lock.json

# Deploy
az webapp deploy \
  --resource-group rg-mcp-server \
  --name <your-app-name> \
  --src-path deploy.zip \
  --type zip
```

### Step 3.3: Configure App Settings

```bash
az webapp config appsettings set \
  --resource-group rg-mcp-server \
  --name <your-app-name> \
  --settings \
    PORT=8080 \
    SERVER_URL=https://<your-app-name>.azurewebsites.net
```

### Step 3.4: Verify Deployment

```bash
# Get the URL
az webapp show --name <your-app-name> --resource-group rg-mcp-server --query defaultHostName -o tsv

# Test
curl https://<your-app-name>.azurewebsites.net/health
curl https://<your-app-name>.azurewebsites.net/mcp/tools
```

---

## Part 4: Configure Copilot Studio (10 minutes)

### Step 4.1: Access Copilot Studio

1. Navigate to https://copilotstudio.microsoft.com
2. Sign in with your M365 account
3. Select your environment

### Step 4.2: Create New Agent

1. Click **+ Create**
2. Select **New agent**
3. Configure:

   | Setting | Value |
   |---------|-------|
   | Name | Enterprise Assistant |
   | Description | AI assistant with enterprise tool access |
   | Instructions | You are an Enterprise Assistant... |

### Step 4.3: Add MCP Tool

1. Go to **Tools** in the left panel
2. Click **+ Add tool**
3. Select **Custom connector** or **API**
4. Configure:

```
Name: Enterprise MCP Server
Description: Access enterprise tools via MCP
API URL: https://<your-app-name>.azurewebsites.net/openapi.json
Authentication: None (or configure API key)
```

### Step 4.4: Write Agent Instructions

In the agent configuration, add instructions:

```
You are the Enterprise Assistant, connected to our internal systems via MCP.

## Available Tools
You have access to these enterprise tools:
- get_employee: Look up employee information
- search_employees: Search for employees by name, department, or role
- get_inventory: Check product inventory levels
- create_ticket: Create support tickets

## How to Use Tools
When a user asks about employees, inventory, or needs to create a ticket:
1. Identify which tool is appropriate
2. Gather any required parameters from the user
3. Execute the tool
4. Present results in a clear, formatted way

## Guidelines
- Always confirm before creating tickets
- Format employee info as a neat profile
- For inventory queries, include stock levels and location
- If a search returns multiple results, list them clearly
```

### Step 4.5: Test in Copilot Studio

Use the test panel to verify:

```
Test 1: "Find employee Alice Johnson"
Expected: Tool call to get_employee, returns employee profile

Test 2: "Search for all Engineering employees"
Expected: Tool call to search_employees with department filter

Test 3: "Check inventory for SKU001"
Expected: Tool call to get_inventory, returns stock info

Test 4: "Create a high priority IT ticket for laptop issue"
Expected: Gathers details, calls create_ticket
```

---

## ✅ Lab Completion Checklist

- [ ] Created MCP server project
- [ ] Implemented tools (employee, inventory, tickets, reports)
- [ ] Created HTTP wrapper for Copilot Studio
- [ ] Deployed to Azure App Service
- [ ] Verified deployment with health check
- [ ] Configured tool in Copilot Studio
- [ ] Wrote agent instructions
- [ ] Tested all tool invocations
- [ ] Agent correctly uses MCP tools

---

## 🎓 Key Takeaways

1. **MCP standardizes** tool integration for AI agents
2. **Tools declare** their capabilities via schema
3. **HTTP wrappers** enable Copilot Studio integration
4. **Agent instructions** guide tool selection and usage
5. **Enterprise tools** can be securely exposed via MCP

---

## 📚 Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [Copilot Studio Tools Documentation](https://learn.microsoft.com/microsoft-copilot-studio/tools)
- [Azure App Service Documentation](https://learn.microsoft.com/azure/app-service/)

---

*Lab 4 Complete! Proceed to Lab 5: Retail Agent with Azure AI Search*

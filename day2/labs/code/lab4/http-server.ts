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

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

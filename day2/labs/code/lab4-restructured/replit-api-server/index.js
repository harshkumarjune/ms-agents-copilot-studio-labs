/**
 * Contoso Employee & Inventory API Server
 *
 * For DW-104 Training - Lab 4: Custom API Connector
 * Deploy this to Replit, Render, or Railway
 *
 * Instructions:
 * 1. Create new Repl at replit.com (Node.js template)
 * 2. Copy this entire file to index.js
 * 3. Copy package.json to your Repl
 * 4. Click "Run" - your API will be live!
 * 5. Copy the URL (e.g., https://your-repl.replit.app)
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// MOCK DATA - Contoso Corporation
// ============================================

const employees = [
  {
    id: "EMP001",
    name: "Alice Johnson",
    email: "alice.johnson@contoso.com",
    department: "Engineering",
    role: "Senior Developer",
    location: "Seattle",
    manager: "David Chen",
    phone: "+1-555-0101",
    startDate: "2021-03-15",
    skills: ["JavaScript", "Python", "Azure", "React"]
  },
  {
    id: "EMP002",
    name: "Bob Smith",
    email: "bob.smith@contoso.com",
    department: "Sales",
    role: "Account Executive",
    location: "New York",
    manager: "Sarah Williams",
    phone: "+1-555-0102",
    startDate: "2020-07-22",
    skills: ["Negotiation", "CRM", "Presentations"]
  },
  {
    id: "EMP003",
    name: "Carol White",
    email: "carol.white@contoso.com",
    department: "HR",
    role: "HR Manager",
    location: "Chicago",
    manager: "Michael Brown",
    phone: "+1-555-0103",
    startDate: "2019-01-10",
    skills: ["Recruiting", "Employee Relations", "Compliance"]
  },
  {
    id: "EMP004",
    name: "David Chen",
    email: "david.chen@contoso.com",
    department: "Engineering",
    role: "Engineering Director",
    location: "Seattle",
    manager: "CEO",
    phone: "+1-555-0104",
    startDate: "2018-05-01",
    skills: ["Architecture", "Leadership", "Cloud Computing"]
  },
  {
    id: "EMP005",
    name: "Emma Davis",
    email: "emma.davis@contoso.com",
    department: "Marketing",
    role: "Marketing Specialist",
    location: "Austin",
    manager: "Jennifer Lee",
    phone: "+1-555-0105",
    startDate: "2022-09-01",
    skills: ["Digital Marketing", "SEO", "Content Strategy"]
  },
  {
    id: "EMP006",
    name: "Frank Wilson",
    email: "frank.wilson@contoso.com",
    department: "Finance",
    role: "Financial Analyst",
    location: "New York",
    manager: "Robert Taylor",
    phone: "+1-555-0106",
    startDate: "2021-11-15",
    skills: ["Excel", "Financial Modeling", "Reporting"]
  },
  {
    id: "EMP007",
    name: "Grace Martinez",
    email: "grace.martinez@contoso.com",
    department: "Engineering",
    role: "QA Engineer",
    location: "Seattle",
    manager: "David Chen",
    phone: "+1-555-0107",
    startDate: "2022-02-28",
    skills: ["Testing", "Automation", "Selenium", "Jest"]
  },
  {
    id: "EMP008",
    name: "Henry Thompson",
    email: "henry.thompson@contoso.com",
    department: "Support",
    role: "Support Lead",
    location: "Denver",
    manager: "Carol White",
    phone: "+1-555-0108",
    startDate: "2020-04-15",
    skills: ["Customer Service", "Troubleshooting", "Documentation"]
  }
];

const inventory = [
  {
    sku: "LAP-PRO-001",
    name: "ProBook Elite 15",
    category: "Laptops",
    price: 1299.99,
    stock: 45,
    location: "Warehouse A",
    supplier: "TechCorp",
    lastRestocked: "2026-01-15"
  },
  {
    sku: "LAP-CRT-002",
    name: "CreatorStudio 16",
    category: "Laptops",
    price: 2199.99,
    stock: 23,
    location: "Warehouse A",
    supplier: "TechCorp",
    lastRestocked: "2026-01-10"
  },
  {
    sku: "PHN-GAL-001",
    name: "Galaxy Pro Max",
    category: "Smartphones",
    price: 1099.99,
    stock: 120,
    location: "Warehouse B",
    supplier: "MobileTech",
    lastRestocked: "2026-01-18"
  },
  {
    sku: "AUD-SMP-001",
    name: "SoundMax Pro Headphones",
    category: "Audio",
    price: 349.99,
    stock: 78,
    location: "Warehouse B",
    supplier: "AudioWorks",
    lastRestocked: "2026-01-12"
  },
  {
    sku: "AUD-SBL-002",
    name: "SoundBuds Lite",
    category: "Audio",
    price: 79.99,
    stock: 200,
    location: "Warehouse B",
    supplier: "AudioWorks",
    lastRestocked: "2026-01-20"
  },
  {
    sku: "WRB-FTU-001",
    name: "FitTrack Ultra Smartwatch",
    category: "Wearables",
    price: 449.99,
    stock: 0,
    location: "Warehouse C",
    supplier: "WearTech",
    lastRestocked: "2025-12-01",
    note: "OUT OF STOCK - Restock expected February 2026"
  },
  {
    sku: "WRB-FTB-002",
    name: "FitBand Basic",
    category: "Wearables",
    price: 149.99,
    stock: 150,
    location: "Warehouse C",
    supplier: "WearTech",
    lastRestocked: "2026-01-16"
  },
  {
    sku: "TV-CVO-001",
    name: "CinemaView 65 OLED",
    category: "TVs",
    price: 1999.99,
    stock: 15,
    location: "Warehouse D",
    supplier: "DisplayPro",
    lastRestocked: "2026-01-08"
  },
  {
    sku: "ACC-PWR-001",
    name: "PowerBank Ultra 20000",
    category: "Accessories",
    price: 59.99,
    stock: 300,
    location: "Warehouse B",
    supplier: "PowerTech",
    lastRestocked: "2026-01-19"
  },
  {
    sku: "ACC-HUB-002",
    name: "USB-C Hub Pro",
    category: "Accessories",
    price: 89.99,
    stock: 95,
    location: "Warehouse B",
    supplier: "ConnectTech",
    lastRestocked: "2026-01-17"
  }
];

const tickets = [];
let ticketCounter = 1000;

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get('/', (req, res) => {
  res.json({
    service: "Contoso API Server",
    version: "1.0.0",
    status: "healthy",
    timestamp: new Date().toISOString(),
    endpoints: {
      employees: {
        list: "GET /api/employees",
        search: "GET /api/employees?search=term",
        getById: "GET /api/employees/:id",
        getByDepartment: "GET /api/employees/department/:dept"
      },
      inventory: {
        list: "GET /api/inventory",
        search: "GET /api/inventory?search=term",
        getBySku: "GET /api/inventory/:sku",
        getByCategory: "GET /api/inventory/category/:category",
        lowStock: "GET /api/inventory/low-stock"
      },
      tickets: {
        create: "POST /api/tickets",
        list: "GET /api/tickets",
        getById: "GET /api/tickets/:id"
      }
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// ============================================
// EMPLOYEE ENDPOINTS
// ============================================

// List all employees or search
app.get('/api/employees', (req, res) => {
  const { search, department, location } = req.query;

  let results = [...employees];

  if (search) {
    const searchLower = search.toLowerCase();
    results = results.filter(e =>
      e.name.toLowerCase().includes(searchLower) ||
      e.email.toLowerCase().includes(searchLower) ||
      e.department.toLowerCase().includes(searchLower) ||
      e.role.toLowerCase().includes(searchLower) ||
      e.skills.some(s => s.toLowerCase().includes(searchLower))
    );
  }

  if (department) {
    results = results.filter(e =>
      e.department.toLowerCase() === department.toLowerCase()
    );
  }

  if (location) {
    results = results.filter(e =>
      e.location.toLowerCase() === location.toLowerCase()
    );
  }

  res.json({
    count: results.length,
    employees: results
  });
});

// Get employee by ID
app.get('/api/employees/:id', (req, res) => {
  const employee = employees.find(e =>
    e.id.toLowerCase() === req.params.id.toLowerCase()
  );

  if (!employee) {
    return res.status(404).json({
      error: "Employee not found",
      id: req.params.id
    });
  }

  res.json(employee);
});

// Get employees by department
app.get('/api/employees/department/:dept', (req, res) => {
  const deptLower = req.params.dept.toLowerCase();
  const results = employees.filter(e =>
    e.department.toLowerCase() === deptLower
  );

  res.json({
    department: req.params.dept,
    count: results.length,
    employees: results
  });
});

// ============================================
// INVENTORY ENDPOINTS
// ============================================

// List all inventory or search
app.get('/api/inventory', (req, res) => {
  const { search, category, inStock } = req.query;

  let results = [...inventory];

  if (search) {
    const searchLower = search.toLowerCase();
    results = results.filter(i =>
      i.name.toLowerCase().includes(searchLower) ||
      i.sku.toLowerCase().includes(searchLower) ||
      i.category.toLowerCase().includes(searchLower)
    );
  }

  if (category) {
    results = results.filter(i =>
      i.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (inStock === 'true') {
    results = results.filter(i => i.stock > 0);
  } else if (inStock === 'false') {
    results = results.filter(i => i.stock === 0);
  }

  res.json({
    count: results.length,
    items: results
  });
});

// Get inventory item by SKU
app.get('/api/inventory/:sku', (req, res) => {
  const item = inventory.find(i =>
    i.sku.toLowerCase() === req.params.sku.toLowerCase()
  );

  if (!item) {
    return res.status(404).json({
      error: "Inventory item not found",
      sku: req.params.sku
    });
  }

  res.json(item);
});

// Get inventory by category
app.get('/api/inventory/category/:category', (req, res) => {
  const catLower = req.params.category.toLowerCase();
  const results = inventory.filter(i =>
    i.category.toLowerCase() === catLower
  );

  res.json({
    category: req.params.category,
    count: results.length,
    items: results
  });
});

// Get low stock items (stock < 20)
app.get('/api/inventory/low-stock', (req, res) => {
  const threshold = parseInt(req.query.threshold) || 20;
  const results = inventory.filter(i => i.stock < threshold);

  res.json({
    threshold: threshold,
    count: results.length,
    items: results
  });
});

// ============================================
// TICKET ENDPOINTS
// ============================================

// Create a new ticket
app.post('/api/tickets', (req, res) => {
  const { title, description, priority, category, requestedBy } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["title", "description"]
    });
  }

  const ticket = {
    id: `TKT-${++ticketCounter}`,
    title,
    description,
    priority: priority || "medium",
    category: category || "general",
    requestedBy: requestedBy || "anonymous",
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tickets.push(ticket);

  res.status(201).json({
    message: "Ticket created successfully",
    ticket
  });
});

// List all tickets
app.get('/api/tickets', (req, res) => {
  const { status, priority } = req.query;

  let results = [...tickets];

  if (status) {
    results = results.filter(t => t.status === status);
  }

  if (priority) {
    results = results.filter(t => t.priority === priority);
  }

  res.json({
    count: results.length,
    tickets: results
  });
});

// Get ticket by ID
app.get('/api/tickets/:id', (req, res) => {
  const ticket = tickets.find(t =>
    t.id.toLowerCase() === req.params.id.toLowerCase()
  );

  if (!ticket) {
    return res.status(404).json({
      error: "Ticket not found",
      id: req.params.id
    });
  }

  res.json(ticket);
});

// ============================================
// OpenAPI SPEC ENDPOINT (for Copilot Studio)
// ============================================

app.get('/openapi.json', (req, res) => {
  const spec = {
    openapi: "3.0.0",
    info: {
      title: "Contoso Employee & Inventory API",
      version: "1.0.0",
      description: "API for managing employees, inventory, and support tickets at Contoso Corporation"
    },
    servers: [
      {
        url: `https://${req.get('host')}`,
        description: "Production server"
      }
    ],
    paths: {
      "/api/employees": {
        get: {
          operationId: "searchEmployees",
          summary: "Search for employees",
          description: "Search employees by name, department, role, location, or skills",
          parameters: [
            {
              name: "search",
              in: "query",
              description: "Search term to find employees",
              schema: { type: "string" }
            },
            {
              name: "department",
              in: "query",
              description: "Filter by department name",
              schema: { type: "string" }
            },
            {
              name: "location",
              in: "query",
              description: "Filter by office location",
              schema: { type: "string" }
            }
          ],
          responses: {
            "200": {
              description: "List of employees",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      count: { type: "integer" },
                      employees: { type: "array" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/employees/{id}": {
        get: {
          operationId: "getEmployee",
          summary: "Get employee by ID",
          description: "Retrieve detailed information about a specific employee",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Employee ID (e.g., EMP001)",
              schema: { type: "string" }
            }
          ],
          responses: {
            "200": { description: "Employee details" },
            "404": { description: "Employee not found" }
          }
        }
      },
      "/api/inventory": {
        get: {
          operationId: "searchInventory",
          summary: "Search inventory",
          description: "Search inventory items by name, SKU, or category",
          parameters: [
            {
              name: "search",
              in: "query",
              description: "Search term",
              schema: { type: "string" }
            },
            {
              name: "category",
              in: "query",
              description: "Filter by category",
              schema: { type: "string" }
            },
            {
              name: "inStock",
              in: "query",
              description: "Filter by stock availability (true/false)",
              schema: { type: "string" }
            }
          ],
          responses: {
            "200": { description: "List of inventory items" }
          }
        }
      },
      "/api/inventory/{sku}": {
        get: {
          operationId: "getInventoryItem",
          summary: "Get inventory item by SKU",
          description: "Retrieve detailed information about a specific inventory item",
          parameters: [
            {
              name: "sku",
              in: "path",
              required: true,
              description: "Product SKU",
              schema: { type: "string" }
            }
          ],
          responses: {
            "200": { description: "Inventory item details" },
            "404": { description: "Item not found" }
          }
        }
      },
      "/api/inventory/low-stock": {
        get: {
          operationId: "getLowStockItems",
          summary: "Get low stock items",
          description: "Retrieve inventory items with stock below threshold",
          parameters: [
            {
              name: "threshold",
              in: "query",
              description: "Stock threshold (default: 20)",
              schema: { type: "integer" }
            }
          ],
          responses: {
            "200": { description: "List of low stock items" }
          }
        }
      },
      "/api/tickets": {
        get: {
          operationId: "listTickets",
          summary: "List support tickets",
          description: "Retrieve all support tickets with optional filters",
          parameters: [
            {
              name: "status",
              in: "query",
              description: "Filter by status",
              schema: { type: "string" }
            },
            {
              name: "priority",
              in: "query",
              description: "Filter by priority",
              schema: { type: "string" }
            }
          ],
          responses: {
            "200": { description: "List of tickets" }
          }
        },
        post: {
          operationId: "createTicket",
          summary: "Create a support ticket",
          description: "Create a new support ticket in the system",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "description"],
                  properties: {
                    title: { type: "string", description: "Ticket title" },
                    description: { type: "string", description: "Detailed description" },
                    priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
                    category: { type: "string" },
                    requestedBy: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "201": { description: "Ticket created successfully" },
            "400": { description: "Missing required fields" }
          }
        }
      }
    }
  };

  res.json(spec);
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         Contoso API Server - Running!                      ║
╠════════════════════════════════════════════════════════════╣
║  Port: ${PORT}                                                ║
║  Health: http://localhost:${PORT}/health                      ║
║  OpenAPI: http://localhost:${PORT}/openapi.json               ║
╠════════════════════════════════════════════════════════════╣
║  Endpoints:                                                ║
║  • GET  /api/employees         - List/search employees     ║
║  • GET  /api/employees/:id     - Get employee by ID        ║
║  • GET  /api/inventory         - List/search inventory     ║
║  • GET  /api/inventory/:sku    - Get item by SKU           ║
║  • GET  /api/inventory/low-stock - Get low stock items     ║
║  • POST /api/tickets           - Create support ticket     ║
║  • GET  /api/tickets           - List tickets              ║
╚════════════════════════════════════════════════════════════╝
  `);
});

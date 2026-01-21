# Lab 4: External API Integration
## Custom API with Free Hosting + HTTP Actions

**Duration:** 60 minutes
**Difficulty:** Intermediate-Advanced
**Environment:** Copilot Studio Trial + Replit (free)

---

## Overview

In this lab, you'll build and deploy a custom REST API, then connect it to a Copilot Studio agent. This demonstrates how agents can access external data and systems without requiring Azure services.

### What You'll Build

1. **API Server** - Node.js/Express API with employee, inventory, and ticket endpoints
2. **Cloud Deployment** - Deploy to Replit (free, instant deployment)
3. **Copilot Studio Agent** - Enterprise assistant that calls your API

### Learning Objectives

By completing this lab, you will:
1. Build a REST API for agent consumption
2. Deploy to free cloud hosting
3. Connect Copilot Studio to external APIs
4. Handle API responses in conversation flows
5. Implement error handling for integrations

---

## Prerequisites

- [ ] Completed Labs 1-3
- [ ] Copilot Studio Trial access
- [ ] Web browser (for Replit)
- [ ] Basic understanding of APIs and JSON

**No local development tools required!** We'll use Replit's browser-based IDE.

---

## Part 1: Create API Server on Replit (15 minutes)

### Step 1.1: Create Replit Account

1. Go to **https://replit.com**
2. Click **Sign Up** (or log in if you have an account)
3. You can use Google, GitHub, or email signup

### Step 1.2: Create New Repl

1. Click **+ Create Repl**
2. Select template: **Node.js**
3. Name your Repl: `contoso-enterprise-api`
4. Click **Create Repl**

### Step 1.3: Set Up Project Files

**Replace the contents of `index.js` with:**

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all origins (required for Copilot Studio)
app.use(cors());
app.use(express.json());

// ============================================
// MOCK DATA
// ============================================

const employees = [
  {
    id: "EMP001",
    name: "Alice Johnson",
    email: "alice@contoso.com",
    department: "Engineering",
    role: "Senior Developer",
    location: "Seattle",
    phone: "555-0101"
  },
  {
    id: "EMP002",
    name: "Bob Smith",
    email: "bob@contoso.com",
    department: "Sales",
    role: "Account Executive",
    location: "New York",
    phone: "555-0102"
  },
  {
    id: "EMP003",
    name: "Carol White",
    email: "carol@contoso.com",
    department: "HR",
    role: "HR Manager",
    location: "Chicago",
    phone: "555-0103"
  },
  {
    id: "EMP004",
    name: "David Lee",
    email: "david@contoso.com",
    department: "Engineering",
    role: "DevOps Engineer",
    location: "Seattle",
    phone: "555-0104"
  },
  {
    id: "EMP005",
    name: "Eva Martinez",
    email: "eva@contoso.com",
    department: "Marketing",
    role: "Marketing Director",
    location: "Austin",
    phone: "555-0105"
  }
];

const inventory = [
  { sku: "SKU001", name: "Laptop Pro 15", category: "Computers", stock: 45, price: 1299.99, location: "Warehouse A" },
  { sku: "SKU002", name: "Wireless Mouse", category: "Accessories", stock: 250, price: 29.99, location: "Warehouse B" },
  { sku: "SKU003", name: "USB-C Hub", category: "Accessories", stock: 120, price: 49.99, location: "Warehouse A" },
  { sku: "SKU004", name: "Monitor 27\"", category: "Displays", stock: 30, price: 399.99, location: "Warehouse A" },
  { sku: "SKU005", name: "Keyboard Wireless", category: "Accessories", stock: 180, price: 79.99, location: "Warehouse B" },
  { sku: "SKU006", name: "Webcam HD", category: "Accessories", stock: 95, price: 89.99, location: "Warehouse B" }
];

let tickets = [
  { id: "TKT-001", title: "Laptop not starting", requester: "Alice Johnson", status: "Open", priority: "High", created: "2026-01-20" },
  { id: "TKT-002", title: "Need software installation", requester: "Bob Smith", status: "In Progress", priority: "Medium", created: "2026-01-19" }
];

let ticketCounter = 3;

// ============================================
// API ENDPOINTS
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    endpoints: ["/api/employees", "/api/inventory", "/api/tickets"]
  });
});

// ---- EMPLOYEE ENDPOINTS ----

// List all employees or search
app.get('/api/employees', (req, res) => {
  const { search, department } = req.query;

  let results = employees;

  if (search) {
    const searchLower = search.toLowerCase();
    results = results.filter(e =>
      e.name.toLowerCase().includes(searchLower) ||
      e.email.toLowerCase().includes(searchLower) ||
      e.role.toLowerCase().includes(searchLower)
    );
  }

  if (department) {
    results = results.filter(e =>
      e.department.toLowerCase() === department.toLowerCase()
    );
  }

  res.json({
    count: results.length,
    employees: results
  });
});

// Get single employee by ID
app.get('/api/employees/:id', (req, res) => {
  const emp = employees.find(e => e.id.toUpperCase() === req.params.id.toUpperCase());
  if (!emp) {
    return res.status(404).json({
      error: "Employee not found",
      searchedId: req.params.id
    });
  }
  res.json(emp);
});

// ---- INVENTORY ENDPOINTS ----

// List all inventory or search
app.get('/api/inventory', (req, res) => {
  const { search, category, lowStock } = req.query;

  let results = inventory;

  if (search) {
    const searchLower = search.toLowerCase();
    results = results.filter(i =>
      i.name.toLowerCase().includes(searchLower) ||
      i.sku.toLowerCase().includes(searchLower)
    );
  }

  if (category) {
    results = results.filter(i =>
      i.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (lowStock === 'true') {
    results = results.filter(i => i.stock < 50);
  }

  res.json({
    count: results.length,
    items: results
  });
});

// Get single inventory item by SKU
app.get('/api/inventory/:sku', (req, res) => {
  const item = inventory.find(i => i.sku.toUpperCase() === req.params.sku.toUpperCase());
  if (!item) {
    return res.status(404).json({
      error: "Product not found",
      searchedSku: req.params.sku
    });
  }
  res.json(item);
});

// ---- TICKET ENDPOINTS ----

// List all tickets
app.get('/api/tickets', (req, res) => {
  const { status, priority } = req.query;

  let results = tickets;

  if (status) {
    results = results.filter(t =>
      t.status.toLowerCase() === status.toLowerCase()
    );
  }

  if (priority) {
    results = results.filter(t =>
      t.priority.toLowerCase() === priority.toLowerCase()
    );
  }

  res.json({
    count: results.length,
    tickets: results
  });
});

// Create new ticket
app.post('/api/tickets', (req, res) => {
  const { title, description, requester, priority } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTicket = {
    id: `TKT-${String(ticketCounter++).padStart(3, '0')}`,
    title: title,
    description: description || "",
    requester: requester || "Unknown",
    status: "Open",
    priority: priority || "Medium",
    created: new Date().toISOString().split('T')[0]
  };

  tickets.push(newTicket);

  res.status(201).json({
    message: "Ticket created successfully",
    ticket: newTicket
  });
});

// Get single ticket
app.get('/api/tickets/:id', (req, res) => {
  const ticket = tickets.find(t => t.id.toUpperCase() === req.params.id.toUpperCase());
  if (!ticket) {
    return res.status(404).json({
      error: "Ticket not found",
      searchedId: req.params.id
    });
  }
  res.json(ticket);
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Contoso Enterprise API running on port ${PORT}`);
  console.log(`📋 Endpoints available:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /api/employees`);
  console.log(`   GET  /api/employees/:id`);
  console.log(`   GET  /api/inventory`);
  console.log(`   GET  /api/inventory/:sku`);
  console.log(`   GET  /api/tickets`);
  console.log(`   POST /api/tickets`);
});
```

### Step 1.4: Configure package.json

Click on the **package.json** file (or create it) and ensure it contains:

```json
{
  "name": "contoso-enterprise-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

### Step 1.5: Run the Server

1. Click the green **Run** button at the top
2. Wait for npm to install dependencies
3. You should see in the console:
   ```
   🚀 Contoso Enterprise API running on port 3000
   ```
4. Replit will show a **Webview** panel with your API URL

**IMPORTANT:** Copy your Replit URL - it looks like:
`https://contoso-enterprise-api.yourusername.repl.co`

**CHECKPOINT 1:** API server running on Replit with public URL.

---

## Part 2: Test API Endpoints (5 minutes)

### Step 2.1: Test in Browser

Open new browser tabs and test these URLs (replace with your Replit URL):

1. **Health Check:**
   ```
   https://YOUR-REPL-URL/health
   ```
   Expected: JSON with status "healthy"

2. **List Employees:**
   ```
   https://YOUR-REPL-URL/api/employees
   ```
   Expected: JSON with 5 employees

3. **Search Employees:**
   ```
   https://YOUR-REPL-URL/api/employees?department=Engineering
   ```
   Expected: Only Engineering employees

4. **Get Inventory:**
   ```
   https://YOUR-REPL-URL/api/inventory
   ```
   Expected: JSON with 6 inventory items

5. **Low Stock Items:**
   ```
   https://YOUR-REPL-URL/api/inventory?lowStock=true
   ```
   Expected: Items with stock < 50

### Step 2.2: Verify CORS

The API must work from other domains. The `cors()` middleware enables this.

**CHECKPOINT 2:** All API endpoints return correct data.

---

## Part 3: Create Copilot Studio Agent (10 minutes)

### Step 3.1: Create New Agent

1. Go to **Copilot Studio** → **+ Create** → **New agent**
2. Configure:

| Field | Value |
|-------|-------|
| Name | `Enterprise Assistant` |
| Description | `Internal assistant with access to employee, inventory, and ticketing systems` |

3. Click **Create**

### Step 3.2: Set Up Instructions

```markdown
You are the Contoso Enterprise Assistant, an internal helper with access to company systems.

## Your Capabilities

1. **Employee Directory** - Look up employee information
2. **Inventory Check** - Check product stock levels
3. **IT Tickets** - Create and check support tickets

## Response Guidelines
- Be professional and helpful
- Format data clearly using tables when appropriate
- If an employee or product isn't found, say so helpfully
- Confirm actions before making changes
```

**CHECKPOINT 3:** Agent created with instructions.

---

## Part 4: Create API-Connected Topics (20 minutes)

### Step 4.1: Create Employee Lookup Topic

1. Go to **Topics** → **+ Add topic** → **From blank**
2. Name: `Find Employee`

**Trigger Phrases:**
```
Find employee
Look up employee
Search for employee
Employee information
Who is
Employee directory
```

**Build Flow:**

**Node 1: Ask for Search**
- **Ask**: `Who would you like to find? You can search by name, department, or role.`
- **Save as**: `EmployeeSearch`

**Node 2: HTTP Request** (If available in your environment)

If HTTP Request action is available:
- Method: GET
- URL: `https://YOUR-REPL-URL/api/employees?search={EmployeeSearch}`
- Save response as: `EmployeeResult`

**Alternative: Use Power Automate**

If HTTP isn't directly available, create a Power Automate flow:
1. Trigger: When called from Copilot Studio
2. Input: SearchTerm (text)
3. HTTP Action: GET to your API URL
4. Response: Return the JSON

**Node 3: Display Results**

```
🔍 **Employee Search Results**

{EmployeeResult}

Would you like to:
• Search for another employee
• Check inventory
• Create a support ticket
```

### Step 4.2: Create Inventory Check Topic

1. Create new topic: `Check Inventory`

**Trigger Phrases:**
```
Check inventory
Stock level
Product availability
How many do we have
Inventory check
```

**Build Flow:**

**Node 1: Ask for Product**
- **Ask**: `What product would you like to check? Enter a product name or SKU.`
- **Save as**: `ProductSearch`

**Node 2: HTTP Request or Power Automate**
- URL: `https://YOUR-REPL-URL/api/inventory?search={ProductSearch}`
- Save as: `InventoryResult`

**Node 3: Display Results**
```
📦 **Inventory Check**

{InventoryResult}

Would you like to:
• Check another product
• View low stock items
• Do something else
```

### Step 4.3: Create Ticket Creation Topic

1. Create new topic: `Create IT Ticket`

**Trigger Phrases:**
```
Create ticket
New IT ticket
Submit support request
I need help with
Report an issue
```

**Build Flow:**

**Node 1: Collect Ticket Details**
- **Ask**: `What issue do you need help with?`
- **Save as**: `TicketTitle`

**Node 2: Collect Priority**
- **Ask**: `What's the priority level?`
- **Options**: Low, Medium, High, Critical
- **Save as**: `TicketPriority`

**Node 3: Collect Requester**
- **Ask**: `What's your name?`
- **Save as**: `RequesterName`

**Node 4: HTTP POST** (via Power Automate if needed)
- Method: POST
- URL: `https://YOUR-REPL-URL/api/tickets`
- Body:
  ```json
  {
    "title": "{TicketTitle}",
    "requester": "{RequesterName}",
    "priority": "{TicketPriority}"
  }
  ```
- Save response as: `TicketResponse`

**Node 5: Confirm Creation**
```
✅ **Ticket Created Successfully!**

Your support ticket has been submitted:
{TicketResponse}

Our IT team will respond based on priority level:
• Critical: Within 1 hour
• High: Within 4 hours
• Medium: Within 24 hours
• Low: Within 48 hours

Is there anything else I can help with?
```

### Step 4.4: Save All Topics

Click **Save** on each topic.

**CHECKPOINT 4:** All API-connected topics created.

---

## Part 5: Test Integration (10 minutes)

### Step 5.1: Open Test Panel

Click **Test** in Copilot Studio.

### Step 5.2: Test Employee Lookup

```
You: "Find Alice Johnson"
Expected: Returns Alice's information from API
```

```
You: "Who works in Engineering?"
Expected: Returns David and Alice (Engineering department)
```

### Step 5.3: Test Inventory Check

```
You: "Check stock for laptop"
Expected: Returns Laptop Pro 15 inventory info
```

```
You: "Show low stock items"
Expected: Returns items with stock < 50
```

### Step 5.4: Test Ticket Creation

```
You: "Create an IT ticket"
Expected: Asks for title, priority, name
You: "My laptop won't connect to WiFi"
You: "High"
You: "John Doe"
Expected: Confirms ticket created with ID
```

### Step 5.5: Verify API Received Data

Check your Replit console - you should see requests being logged.

Test the tickets endpoint to see your new ticket:
```
https://YOUR-REPL-URL/api/tickets
```

**CHECKPOINT 5:** All integrations working end-to-end.

---

## Exit Criteria

Before completing this lab, verify:

| Criteria | Status |
|----------|--------|
| ✅ API deployed and accessible | |
| ✅ Health endpoint returns healthy | |
| ✅ Employee search works | |
| ✅ Inventory search works | |
| ✅ Ticket creation works | |
| ✅ Copilot Studio successfully calls API | |
| ✅ Data displays correctly in chat | |
| ✅ Error cases handled gracefully | |

---

## Troubleshooting

### API Returns CORS Error
- Verify `cors()` middleware is added
- Ensure server was restarted after adding cors
- Check browser console for specific error

### Replit Server Stops
- Free tier may sleep after inactivity
- Access any endpoint to wake it up
- Consider upgrading for always-on

### HTTP Action Not Available
- Use Power Automate as alternative
- Create cloud flow with HTTP connector
- Call flow from Copilot Studio

### Variables Not Passing
- Check variable names match exactly
- Verify URL encoding for special characters
- Test API URL manually first

### Empty Responses
- Check API is returning JSON
- Verify Content-Type header
- Test endpoint directly in browser

---

## Alternative: Using Power Automate

If HTTP actions aren't available in your Copilot Studio environment:

### Create Power Automate Flow

1. Go to **Power Automate** → **Create** → **Instant cloud flow**
2. Select trigger: **When Power Virtual Agents calls a flow**
3. Add input: `SearchTerm` (text)
4. Add action: **HTTP**
   - Method: GET
   - URI: `https://YOUR-URL/api/employees?search=@{triggerBody()['text']}`
5. Add action: **Respond to Power Virtual Agents**
   - Output: Body from HTTP response

### Connect in Copilot Studio

1. In your topic, add **Call an action**
2. Select your Power Automate flow
3. Map input variable
4. Use output in message

---

## Extension Challenges (Optional)

1. **Add authentication** - Implement API key validation
2. **Update ticket status** - Add PATCH endpoint
3. **Inventory alerts** - Notify when stock is low
4. **Employee photos** - Add image URLs to responses
5. **Audit logging** - Log all API requests

---

## Summary

In this lab, you learned:
- Building REST APIs for agent consumption
- Deploying to free cloud hosting (Replit)
- Connecting Copilot Studio to external APIs
- Handling HTTP requests and responses
- Formatting API data for conversation display

These skills enable you to connect agents to any system with an API - CRMs, ERPs, custom databases, and more.

---

## Next Steps

Continue to **Lab 5: Knowledge-Powered Agent** to learn about document-based knowledge and RAG patterns.

---

## Appendix: API Reference

### Base URL
`https://YOUR-REPL-URL`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/employees | List/search employees |
| GET | /api/employees/:id | Get single employee |
| GET | /api/inventory | List/search inventory |
| GET | /api/inventory/:sku | Get single item |
| GET | /api/tickets | List tickets |
| POST | /api/tickets | Create ticket |
| GET | /api/tickets/:id | Get single ticket |

### Query Parameters

**Employees:**
- `search` - Search by name, email, or role
- `department` - Filter by department

**Inventory:**
- `search` - Search by name or SKU
- `category` - Filter by category
- `lowStock` - Show items with stock < 50

**Tickets:**
- `status` - Filter by status
- `priority` - Filter by priority

---

*Lab 4: External API Integration | DW-104 Day 2 | January 2026*

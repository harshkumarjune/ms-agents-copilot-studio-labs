# Lab 1: Build a Repair Service Declarative Agent with TypeSpec
## Microsoft 365 Agents Toolkit

**Duration:** 45 minutes
**Difficulty:** Medium
**LOD Module:** PL-400-M01-L01

---

## 🎯 Lab Objectives

By the end of this lab, you will be able to:
1. Create a new declarative agent project using M365 Agents Toolkit
2. Define an API specification using TypeSpec
3. Configure agent instructions and capabilities
4. Build and test plugins for agent actions
5. Deploy the agent to Microsoft Teams

---

## 📋 Scenario

**Contoso Repair Services** needs an AI-powered agent to help customers:
- Check repair status for their devices
- Schedule new repair appointments
- Get repair cost estimates
- Submit repair requests

You'll build a declarative agent that integrates with a repair service API.

---

## 🔧 Prerequisites Checklist

Before starting, verify:
- [ ] VS Code with M365 Agents Toolkit installed
- [ ] Node.js 18+ installed
- [ ] M365 Developer tenant access
- [ ] Signed into M365 Agents Toolkit in VS Code

---

## Part 1: Create the Project (10 minutes)

### Step 1.1: Initialize New Project

1. **Open VS Code**

2. **Open Command Palette:**
   - Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (macOS)

3. **Create New Agent:**
   - Type: `M365 Agents: Create a New App`
   - Select this option

4. **Configure Project:**

   | Setting | Value |
   |---------|-------|
   | Project Type | Declarative Agent |
   | Template | Declarative Agent with API Plugin |
   | Project Name | `repair-service-agent` |
   | Language | TypeScript |
   | Location | Your workspace folder |

5. **Wait for Scaffolding:**
   - The toolkit will create the project structure
   - This may take 1-2 minutes

### Step 1.2: Explore Project Structure

Open the project and examine the structure:

```
repair-service-agent/
├── appPackage/
│   ├── manifest.json          # Teams app manifest
│   ├── declarativeAgent.json  # Agent configuration
│   ├── ai-plugin.json         # Plugin definition
│   └── repairservice.tsp      # TypeSpec API definition
├── src/
│   └── functions/             # Azure Functions for API
│       └── repairs.ts         # Repair service handlers
├── infra/                     # Infrastructure as Code
├── env/
│   └── .env.local             # Environment variables
├── teamsapp.yml               # Deployment configuration
└── package.json
```

### Step 1.3: Install Dependencies

Open terminal in VS Code (`Ctrl+`` `) and run:

```bash
npm install
```

**Expected Output:**
```
added 150 packages, and audited 151 packages in 10s
found 0 vulnerabilities
```

---

## Part 2: Configure the Declarative Agent (10 minutes)

### Step 2.1: Edit Agent Configuration

Open `appPackage/declarativeAgent.json`:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.2/schema.json",
  "version": "v1.2",
  "name": "Contoso Repair Service Agent",
  "description": "An AI assistant that helps customers with device repair services including status checks, appointments, and cost estimates.",
  "instructions": "You are the Contoso Repair Service assistant. Your role is to help customers with their device repair needs. You can:\n\n1. Check repair status - Ask for the repair ticket ID and provide current status\n2. Schedule appointments - Help customers book repair appointments\n3. Provide cost estimates - Give repair cost estimates based on device type and issue\n4. Submit repair requests - Create new repair tickets\n\nAlways be polite, professional, and helpful. If you don't have information, offer to connect the customer with a human agent. Format responses clearly with relevant details.",
  "capabilities": {
    "conversation_starters": [
      {
        "title": "Check Repair Status",
        "text": "What's the status of my repair ticket #12345?"
      },
      {
        "title": "Schedule Repair",
        "text": "I need to schedule a repair for my laptop"
      },
      {
        "title": "Get Cost Estimate",
        "text": "How much would it cost to fix a cracked phone screen?"
      },
      {
        "title": "Submit New Request",
        "text": "I want to submit a new repair request for my tablet"
      }
    ]
  },
  "actions": [
    {
      "$ref": "ai-plugin.json"
    }
  ]
}
```

**Save the file** (`Ctrl+S`)

### Step 2.2: Configure the Plugin

Open `appPackage/ai-plugin.json`:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/plugin/v2.2/schema.json",
  "schema_version": "v2.2",
  "name_for_human": "Contoso Repair Service",
  "description_for_human": "Manage device repairs, check status, and schedule appointments",
  "namespace": "repairs",
  "functions": [
    {
      "name": "getRepairStatus",
      "description": "Get the current status of a repair ticket by its ID"
    },
    {
      "name": "listRepairs",
      "description": "List all repair tickets for a customer"
    },
    {
      "name": "createRepair",
      "description": "Create a new repair request for a device"
    },
    {
      "name": "getEstimate",
      "description": "Get a cost estimate for a specific type of repair"
    },
    {
      "name": "scheduleAppointment",
      "description": "Schedule a repair appointment at a service center"
    }
  ],
  "runtimes": [
    {
      "type": "OpenApi",
      "auth": {
        "type": "None"
      },
      "spec": {
        "url": "apiSpecificationFile/repairservice.json"
      }
    }
  ]
}
```

---

## Part 3: Define API with TypeSpec (15 minutes)

### Step 3.1: Create TypeSpec Definition

Open or create `appPackage/repairservice.tsp`:

```typespec
import "@typespec/http";
import "@typespec/openapi3";

using TypeSpec.Http;

@service({
  title: "Contoso Repair Service API",
  version: "1.0.0"
})
namespace ContosoRepairs;

// Data Models
model Repair {
  @key
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  deviceType: DeviceType;
  issueDescription: string;
  status: RepairStatus;
  estimatedCost: float32;
  createdDate: string;
  scheduledDate?: string;
  completedDate?: string;
}

model RepairRequest {
  customerName: string;
  customerEmail: string;
  deviceType: DeviceType;
  issueDescription: string;
}

model CostEstimate {
  deviceType: DeviceType;
  issueType: string;
  estimatedCost: float32;
  estimatedDuration: string;
}

model Appointment {
  repairId: string;
  scheduledDate: string;
  location: string;
  confirmed: boolean;
}

enum DeviceType {
  Laptop,
  Desktop,
  Tablet,
  Smartphone,
  Smartwatch,
  Other
}

enum RepairStatus {
  Submitted,
  Diagnosed,
  InProgress,
  Completed,
  ReadyForPickup
}

// API Operations
@route("/repairs")
interface RepairOperations {
  @get
  @operationId("listRepairs")
  @doc("List all repairs for a customer")
  list(@query customerId?: string): Repair[];

  @get
  @route("/{id}")
  @operationId("getRepairStatus")
  @doc("Get repair status by ticket ID")
  getStatus(@path id: string): Repair;

  @post
  @operationId("createRepair")
  @doc("Create a new repair request")
  create(@body request: RepairRequest): Repair;
}

@route("/estimates")
interface EstimateOperations {
  @get
  @operationId("getEstimate")
  @doc("Get cost estimate for a repair")
  getEstimate(
    @query deviceType: DeviceType,
    @query issueType: string
  ): CostEstimate;
}

@route("/appointments")
interface AppointmentOperations {
  @post
  @operationId("scheduleAppointment")
  @doc("Schedule a repair appointment")
  schedule(@body appointment: {
    repairId: string;
    preferredDate: string;
    location: string;
  }): Appointment;
}
```

### Step 3.2: Compile TypeSpec to OpenAPI

Run the TypeSpec compiler:

```bash
npx tsp compile appPackage/repairservice.tsp --emit @typespec/openapi3
```

**Expected Output:** Creates `appPackage/apiSpecificationFile/repairservice.json`

### Step 3.3: Verify OpenAPI Spec

Check that the generated file contains:
- All endpoints (`/repairs`, `/estimates`, `/appointments`)
- All operation IDs matching your plugin functions
- Proper request/response schemas

---

## Part 4: Implement API Functions (10 minutes)

### Step 4.1: Create Mock Data

Open or create `src/functions/repairs.ts`:

```typescript
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// Mock repair database
const repairs: Map<string, Repair> = new Map([
  ["REP-001", {
    id: "REP-001",
    customerId: "CUST-123",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    deviceType: "Laptop",
    issueDescription: "Screen flickering intermittently",
    status: "InProgress",
    estimatedCost: 150.00,
    createdDate: "2026-01-15",
    scheduledDate: "2026-01-18"
  }],
  ["REP-002", {
    id: "REP-002",
    customerId: "CUST-124",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    deviceType: "Smartphone",
    issueDescription: "Cracked screen replacement",
    status: "ReadyForPickup",
    estimatedCost: 89.99,
    createdDate: "2026-01-10",
    completedDate: "2026-01-17"
  }]
]);

// Cost estimates by device and issue
const estimates: Record<string, Record<string, CostEstimate>> = {
  Laptop: {
    screen: { estimatedCost: 150.00, estimatedDuration: "2-3 days" },
    battery: { estimatedCost: 89.00, estimatedDuration: "1 day" },
    keyboard: { estimatedCost: 120.00, estimatedDuration: "1-2 days" }
  },
  Smartphone: {
    screen: { estimatedCost: 89.99, estimatedDuration: "1-2 hours" },
    battery: { estimatedCost: 49.99, estimatedDuration: "1 hour" },
    charging: { estimatedCost: 39.99, estimatedDuration: "1 hour" }
  },
  Tablet: {
    screen: { estimatedCost: 129.99, estimatedDuration: "1 day" },
    battery: { estimatedCost: 79.99, estimatedDuration: "4 hours" }
  }
};

interface Repair {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  deviceType: string;
  issueDescription: string;
  status: string;
  estimatedCost: number;
  createdDate: string;
  scheduledDate?: string;
  completedDate?: string;
}

interface CostEstimate {
  estimatedCost: number;
  estimatedDuration: string;
}

// GET /repairs - List repairs
export async function listRepairs(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("listRepairs function processed a request");

  const customerId = request.query.get("customerId");
  let result = Array.from(repairs.values());

  if (customerId) {
    result = result.filter(r => r.customerId === customerId);
  }

  return {
    status: 200,
    jsonBody: result
  };
}

// GET /repairs/{id} - Get repair status
export async function getRepairStatus(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("getRepairStatus function processed a request");

  const id = request.params.id;
  const repair = repairs.get(id);

  if (!repair) {
    return {
      status: 404,
      jsonBody: { error: `Repair ticket ${id} not found` }
    };
  }

  return {
    status: 200,
    jsonBody: repair
  };
}

// POST /repairs - Create new repair
export async function createRepair(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("createRepair function processed a request");

  const body = await request.json() as any;
  const newId = `REP-${String(repairs.size + 1).padStart(3, '0')}`;

  const newRepair: Repair = {
    id: newId,
    customerId: `CUST-${Date.now()}`,
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    deviceType: body.deviceType,
    issueDescription: body.issueDescription,
    status: "Submitted",
    estimatedCost: 0,
    createdDate: new Date().toISOString().split('T')[0]
  };

  repairs.set(newId, newRepair);

  return {
    status: 201,
    jsonBody: newRepair
  };
}

// GET /estimates - Get cost estimate
export async function getEstimate(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("getEstimate function processed a request");

  const deviceType = request.query.get("deviceType") || "Laptop";
  const issueType = request.query.get("issueType")?.toLowerCase() || "screen";

  const deviceEstimates = estimates[deviceType];
  if (!deviceEstimates) {
    return {
      status: 200,
      jsonBody: {
        deviceType,
        issueType,
        estimatedCost: 99.99,
        estimatedDuration: "To be determined after diagnosis"
      }
    };
  }

  const estimate = deviceEstimates[issueType];
  if (!estimate) {
    return {
      status: 200,
      jsonBody: {
        deviceType,
        issueType,
        estimatedCost: 99.99,
        estimatedDuration: "To be determined after diagnosis"
      }
    };
  }

  return {
    status: 200,
    jsonBody: {
      deviceType,
      issueType,
      ...estimate
    }
  };
}

// POST /appointments - Schedule appointment
export async function scheduleAppointment(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("scheduleAppointment function processed a request");

  const body = await request.json() as any;

  const repair = repairs.get(body.repairId);
  if (!repair) {
    return {
      status: 404,
      jsonBody: { error: `Repair ticket ${body.repairId} not found` }
    };
  }

  // Update repair with scheduled date
  repair.scheduledDate = body.preferredDate;
  repairs.set(body.repairId, repair);

  return {
    status: 200,
    jsonBody: {
      repairId: body.repairId,
      scheduledDate: body.preferredDate,
      location: body.location || "Contoso Service Center - Main Street",
      confirmed: true,
      message: `Your appointment is confirmed for ${body.preferredDate}`
    }
  };
}
```

### Step 4.2: Register Functions

Create or update `src/functions/index.ts`:

```typescript
import { app } from "@azure/functions";
import { listRepairs, getRepairStatus, createRepair, getEstimate, scheduleAppointment } from "./repairs";

app.http("listRepairs", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "repairs",
  handler: listRepairs
});

app.http("getRepairStatus", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "repairs/{id}",
  handler: getRepairStatus
});

app.http("createRepair", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "repairs",
  handler: createRepair
});

app.http("getEstimate", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "estimates",
  handler: getEstimate
});

app.http("scheduleAppointment", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "appointments",
  handler: scheduleAppointment
});
```

---

## Part 5: Test and Deploy (10 minutes)

### Step 5.1: Local Testing

1. **Start Local Server:**
   ```bash
   npm start
   ```

2. **Test API Endpoints:**

   Open a new terminal and test:

   ```bash
   # List repairs
   curl http://localhost:7071/api/repairs

   # Get specific repair
   curl http://localhost:7071/api/repairs/REP-001

   # Get estimate
   curl "http://localhost:7071/api/estimates?deviceType=Smartphone&issueType=screen"
   ```

3. **Verify Responses** match expected format

### Step 5.2: Deploy to Teams

1. **Sign In to M365:**
   - Press `Ctrl+Shift+P`
   - Type `M365 Agents: Sign in to Microsoft 365`
   - Complete authentication

2. **Provision Resources:**
   - Press `F5` to start debugging
   - Or run: `npm run deploy`

3. **Install in Teams:**
   - Teams will open automatically
   - Approve the app installation
   - Select where to install (Personal, Team, or Chat)

### Step 5.3: Test the Agent

1. **Open the Agent:**
   - In Teams, find your agent in the app bar or chat
   - Click to start a conversation

2. **Test Conversation Starters:**
   - Click "Check Repair Status"
   - Ask: "What's the status of repair ticket REP-001?"

3. **Test Various Queries:**

   | Test Query | Expected Behavior |
   |------------|-------------------|
   | "Check status for REP-001" | Returns repair details |
   | "How much to fix a phone screen?" | Returns cost estimate |
   | "I need to schedule a repair" | Guides through scheduling |
   | "Submit a new repair request" | Creates new ticket |

---

## ✅ Lab Completion Checklist

Verify you have completed:

- [ ] Created declarative agent project
- [ ] Configured agent instructions and capabilities
- [ ] Defined API using TypeSpec
- [ ] Implemented all API functions
- [ ] Tested locally with curl/Postman
- [ ] Deployed to Teams
- [ ] Tested all conversation starters
- [ ] Agent responds correctly to repair queries

---

## 🎓 Key Takeaways

1. **Declarative Agents** are defined through configuration, not code
2. **TypeSpec** provides type-safe API definitions that compile to OpenAPI
3. **Plugins** extend agent capabilities with external APIs
4. **Conversation Starters** help users understand agent capabilities
5. **Instructions** guide the AI's behavior and personality

---

## 🚀 Challenge Extension (Optional)

If you finish early, try these enhancements:

1. **Add Authentication:**
   - Implement OAuth 2.0 for the API
   - Update plugin configuration for auth

2. **Add More Features:**
   - Warranty check function
   - Parts availability lookup
   - Repair history by customer

3. **Improve Instructions:**
   - Add personality traits
   - Handle edge cases
   - Multi-language support

---

## 📚 Resources

- [M365 Agents Toolkit Documentation](https://learn.microsoft.com/microsoftteams/platform/toolkit/teams-toolkit-fundamentals)
- [TypeSpec Documentation](https://typespec.io)
- [Declarative Agent Schema](https://developer.microsoft.com/json-schemas/copilot/declarative-agent/)

---

*Lab 1 Complete! Proceed to Lab 2: Geo Locator Game Agent*

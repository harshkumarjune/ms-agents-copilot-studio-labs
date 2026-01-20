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

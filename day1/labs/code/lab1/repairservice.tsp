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

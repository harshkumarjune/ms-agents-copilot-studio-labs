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

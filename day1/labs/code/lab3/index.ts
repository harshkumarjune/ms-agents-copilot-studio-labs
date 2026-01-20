import { config } from "dotenv";
import * as path from "path";
import * as restify from "restify";
import {
  CloudAdapter,
  ConfigurationBotFrameworkAuthentication,
  ConfigurationBotFrameworkAuthenticationOptions
} from "botbuilder";
import { ResearchAssistantBot } from "./TeamsBot";

// Load environment variables
config({ path: path.join(__dirname, "..", "env", ".env.local") });

// Create HTTP server
const server = restify.createServer();
server.use(restify.plugins.bodyParser());

// Configure bot authentication
const botFrameworkAuth = new ConfigurationBotFrameworkAuthentication(
  {} as ConfigurationBotFrameworkAuthenticationOptions
);

// Create adapter
const adapter = new CloudAdapter(botFrameworkAuth);

// Error handling
adapter.onTurnError = async (context, error) => {
  console.error(`[onTurnError] Error: ${error}`);
  await context.sendActivity("Sorry, an error occurred. Please try again.");
};

// Create bot
const bot = new ResearchAssistantBot();

// Listen for incoming requests
server.post("/api/messages", async (req, res) => {
  await adapter.process(req, res, (context) => bot.run(context));
});

// Start server
const port = process.env.PORT || 3978;
server.listen(port, () => {
  console.log(`\nResearch Assistant bot started at http://localhost:${port}`);
  console.log(`\nEndpoint: http://localhost:${port}/api/messages`);
});

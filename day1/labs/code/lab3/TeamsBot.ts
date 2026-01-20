import {
  TeamsActivityHandler,
  TurnContext,
  MessageFactory,
  CardFactory,
  Attachment
} from "botbuilder";
import { AgentOrchestrator, AgentResponse } from "./AgentOrchestrator";
import { SearchPlugin } from "./SearchPlugin";
import { SummaryPlugin } from "./SummaryPlugin";

export class ResearchAssistantBot extends TeamsActivityHandler {
  private orchestrator: AgentOrchestrator;
  private userSessions: Map<string, AgentOrchestrator> = new Map();

  constructor() {
    super();

    this.onMessage(async (context, next) => {
      await this.handleMessage(context);
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      await this.sendWelcomeMessage(context);
      await next();
    });
  }

  private getOrCreateSession(userId: string): AgentOrchestrator {
    if (!this.userSessions.has(userId)) {
      const orchestrator = new AgentOrchestrator({
        azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
        azureApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureDeployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
        openaiApiKey: process.env.OPENAI_API_KEY,
        modelId: "gpt-4"
      });

      // Register plugins
      orchestrator.registerPlugin(new SearchPlugin(), "search");
      orchestrator.registerPlugin(new SummaryPlugin(), "summary");

      this.userSessions.set(userId, orchestrator);
    }

    return this.userSessions.get(userId)!;
  }

  private async handleMessage(context: TurnContext): Promise<void> {
    const userId = context.activity.from.id;
    const userMessage = context.activity.text?.trim();

    if (!userMessage) {
      return;
    }

    // Handle special commands
    if (userMessage.toLowerCase() === "/clear") {
      this.userSessions.delete(userId);
      await context.sendActivity("Session cleared. Starting fresh!");
      return;
    }

    if (userMessage.toLowerCase() === "/help") {
      await this.sendHelpCard(context);
      return;
    }

    // Send typing indicator
    await context.sendActivity({ type: "typing" });

    try {
      const orchestrator = this.getOrCreateSession(userId);
      const response = await orchestrator.processMessage(userMessage);

      // Format and send response
      await this.sendFormattedResponse(context, response);
    } catch (error) {
      console.error("Error processing message:", error);
      await context.sendActivity(
        "I apologize, but I encountered an error. Please try again."
      );
    }
  }

  private async sendFormattedResponse(
    context: TurnContext,
    response: AgentResponse
  ): Promise<void> {
    // Send main response
    await context.sendActivity(response.content);

    // If there are citations, send a summary card
    if (response.citations.length > 0) {
      const citationCard = this.createCitationCard(response.citations);
      await context.sendActivity({ attachments: [citationCard] });
    }

    // If functions were called, show activity summary
    if (response.functionsCalled.length > 0) {
      const activitySummary = `📊 *Research activity:* ${response.functionsCalled.join(", ")}`;
      await context.sendActivity(activitySummary);
    }
  }

  private createCitationCard(citations: any[]): Attachment {
    const citationList = citations
      .map((c, i) => `${i + 1}. ${c.source}`)
      .join("\n");

    return CardFactory.adaptiveCard({
      type: "AdaptiveCard",
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: "📚 Sources",
          weight: "bolder",
          size: "medium"
        },
        {
          type: "TextBlock",
          text: citationList,
          wrap: true
        }
      ]
    });
  }

  private async sendWelcomeMessage(context: TurnContext): Promise<void> {
    const welcomeCard = CardFactory.adaptiveCard({
      type: "AdaptiveCard",
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.5",
      body: [
        {
          type: "Image",
          url: "https://adaptivecards.io/content/bot-logo.png",
          size: "small",
          horizontalAlignment: "center"
        },
        {
          type: "TextBlock",
          text: "🔬 Research Assistant",
          weight: "bolder",
          size: "large",
          horizontalAlignment: "center"
        },
        {
          type: "TextBlock",
          text: "I'm your AI-powered research assistant. I can help you:",
          wrap: true
        },
        {
          type: "FactSet",
          facts: [
            { title: "🔍", value: "Search and find information" },
            { title: "📝", value: "Summarize complex topics" },
            { title: "📊", value: "Analyze and compare sources" },
            { title: "📚", value: "Track citations and references" }
          ]
        },
        {
          type: "TextBlock",
          text: "Just ask me anything! For example:\n• 'Research the latest AI developments'\n• 'Summarize climate change impacts'\n• 'Compare different energy sources'",
          wrap: true,
          spacing: "medium"
        }
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Start Researching",
          data: { action: "startResearch" }
        },
        {
          type: "Action.Submit",
          title: "Help",
          data: { action: "help" }
        }
      ]
    });

    await context.sendActivity({ attachments: [welcomeCard] });
  }

  private async sendHelpCard(context: TurnContext): Promise<void> {
    const helpCard = CardFactory.adaptiveCard({
      type: "AdaptiveCard",
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: "📖 Research Assistant Help",
          weight: "bolder",
          size: "large"
        },
        {
          type: "TextBlock",
          text: "**Commands:**",
          weight: "bolder"
        },
        {
          type: "TextBlock",
          text: "• `/clear` - Start a new session\n• `/help` - Show this help message",
          wrap: true
        },
        {
          type: "TextBlock",
          text: "**Example Questions:**",
          weight: "bolder",
          spacing: "medium"
        },
        {
          type: "TextBlock",
          text: "• 'What is quantum computing?'\n• 'Research renewable energy trends'\n• 'Compare machine learning frameworks'\n• 'Summarize the history of the internet'",
          wrap: true
        },
        {
          type: "TextBlock",
          text: "**Tips:**",
          weight: "bolder",
          spacing: "medium"
        },
        {
          type: "TextBlock",
          text: "• Be specific with your questions\n• Ask follow-up questions for deeper insights\n• Request summaries or bullet points if needed",
          wrap: true
        }
      ]
    });

    await context.sendActivity({ attachments: [helpCard] });
  }
}

# Lab 3: Build a Custom Engine Agent with M365 Agents SDK & Semantic Kernel
## Advanced Agent Development

**Duration:** 45 minutes
**Difficulty:** High
**LOD Module:** PL-400-M01-L03

---

## 🎯 Lab Objectives

By the end of this lab, you will be able to:
1. Create a custom engine agent using the M365 Agents SDK
2. Integrate Semantic Kernel for AI orchestration
3. Implement custom plugins with complex business logic
4. Use memory and planning capabilities
5. Deploy a fully custom AI agent to Teams

---

## 📋 Scenario

**Smart Research Assistant** - Build an advanced agent that:
- Searches and summarizes information from multiple sources
- Maintains conversation memory across sessions
- Uses planning to break down complex research tasks
- Integrates custom plugins for specialized operations
- Provides citations and source tracking

This lab showcases the power of **custom engine agents** for scenarios requiring advanced orchestration beyond declarative configurations.

---

## 🔧 Prerequisites Checklist

Before starting, verify:
- [ ] Completed Labs 1 and 2
- [ ] Node.js 18+ and npm
- [ ] VS Code with M365 Agents Toolkit
- [ ] Azure OpenAI or OpenAI API access (provided in LOD)
- [ ] Basic understanding of Semantic Kernel concepts

---

## Part 1: Project Setup (10 minutes)

### Step 1.1: Create Custom Engine Project

1. **Create New Agent:**
   - Press `Ctrl+Shift+P`
   - Select `M365 Agents: Create a New App`

2. **Configure:**

   | Setting | Value |
   |---------|-------|
   | Project Type | Custom Engine Agent |
   | Template | AI Agent with Semantic Kernel |
   | Project Name | `research-assistant-agent` |
   | Language | TypeScript |

### Step 1.2: Install Dependencies

```bash
cd research-assistant-agent
npm install

# Additional packages for Semantic Kernel
npm install @microsoft/semantic-kernel
npm install @azure/openai
npm install uuid
```

### Step 1.3: Project Structure

```
research-assistant-agent/
├── appPackage/
│   └── manifest.json
├── src/
│   ├── agent/
│   │   ├── ResearchAgent.ts      # Main agent class
│   │   ├── AgentOrchestrator.ts  # SK orchestration
│   │   └── memory/
│   │       └── ConversationMemory.ts
│   ├── plugins/
│   │   ├── SearchPlugin.ts       # Web search
│   │   ├── SummaryPlugin.ts      # Text summarization
│   │   └── CitationPlugin.ts     # Source tracking
│   ├── bot/
│   │   └── TeamsBot.ts           # Teams integration
│   └── index.ts
├── env/
│   └── .env.local
└── package.json
```

### Step 1.4: Configure Environment

Create/update `.env.local`:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://your-endpoint.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Or OpenAI Configuration
OPENAI_API_KEY=your-openai-key

# Teams Bot Configuration
BOT_ID=${{BOT_ID}}
BOT_PASSWORD=${{BOT_PASSWORD}}

# Agent Configuration
AGENT_NAME=Research Assistant
MAX_TOKENS=4096
TEMPERATURE=0.7
```

---

## Part 2: Build the Semantic Kernel Core (15 minutes)

### Step 2.1: Create Agent Orchestrator

Create `src/agent/AgentOrchestrator.ts`:

```typescript
import {
  Kernel,
  KernelFunction,
  ChatHistory,
  PromptExecutionSettings
} from "@microsoft/semantic-kernel";
import {
  AzureOpenAIChatCompletion,
  OpenAIChatCompletion
} from "@microsoft/semantic-kernel/connectors";

export interface AgentConfig {
  azureEndpoint?: string;
  azureApiKey?: string;
  azureDeployment?: string;
  openaiApiKey?: string;
  modelId: string;
}

export class AgentOrchestrator {
  private kernel: Kernel;
  private chatHistory: ChatHistory;
  private systemPrompt: string;

  constructor(config: AgentConfig) {
    this.kernel = this.initializeKernel(config);
    this.chatHistory = new ChatHistory();
    this.systemPrompt = this.getSystemPrompt();

    // Add system message
    this.chatHistory.addSystemMessage(this.systemPrompt);
  }

  private initializeKernel(config: AgentConfig): Kernel {
    const kernel = new Kernel();

    if (config.azureEndpoint && config.azureApiKey) {
      // Use Azure OpenAI
      const chatCompletion = new AzureOpenAIChatCompletion({
        endpoint: config.azureEndpoint,
        apiKey: config.azureApiKey,
        deploymentName: config.azureDeployment || "gpt-4"
      });
      kernel.addService(chatCompletion);
    } else if (config.openaiApiKey) {
      // Use OpenAI
      const chatCompletion = new OpenAIChatCompletion({
        apiKey: config.openaiApiKey,
        modelId: config.modelId
      });
      kernel.addService(chatCompletion);
    }

    return kernel;
  }

  private getSystemPrompt(): string {
    return `You are a Research Assistant, an advanced AI agent designed to help users find, analyze, and synthesize information.

## Your Capabilities
1. **Search**: Find relevant information across multiple sources
2. **Summarize**: Create concise summaries of complex topics
3. **Analyze**: Compare and contrast information from different sources
4. **Cite**: Always provide sources for your information
5. **Plan**: Break down complex research tasks into steps

## Behavior Guidelines
- Always cite sources with [Source: name] format
- If unsure, say so and suggest how to verify
- Break complex questions into sub-questions
- Provide balanced perspectives on controversial topics
- Format responses with clear headings and bullet points

## Available Functions
You can call the following functions:
- search(query): Search for information
- summarize(text, style): Summarize text
- addCitation(source, excerpt): Track sources
- createPlan(goal): Create a research plan

When you need to use a function, respond with:
<function_call name="functionName">
{"param1": "value1", "param2": "value2"}
</function_call>`;
  }

  registerPlugin(plugin: any, pluginName: string): void {
    this.kernel.plugins.addFromObject(plugin, pluginName);
  }

  async processMessage(userMessage: string): Promise<AgentResponse> {
    // Add user message to history
    this.chatHistory.addUserMessage(userMessage);

    // Get chat completion service
    const chatService = this.kernel.getService("chat");

    // Execute with function calling
    const response = await this.executeWithFunctions(userMessage);

    // Add assistant response to history
    this.chatHistory.addAssistantMessage(response.content);

    return response;
  }

  private async executeWithFunctions(input: string): Promise<AgentResponse> {
    const executionSettings: PromptExecutionSettings = {
      maxTokens: parseInt(process.env.MAX_TOKENS || "4096"),
      temperature: parseFloat(process.env.TEMPERATURE || "0.7")
    };

    // Create prompt with function calling capability
    const prompt = `
${this.systemPrompt}

Chat History:
${this.formatChatHistory()}

User: ${input}

Respond helpfully. If you need to search or process information, use the available functions.
`;

    try {
      const result = await this.kernel.invokePrompt(prompt, {
        executionSettings
      });

      const responseText = result.value?.toString() || "";

      // Check for function calls in response
      const functionCalls = this.parseFunctionCalls(responseText);

      if (functionCalls.length > 0) {
        // Execute functions and get results
        const functionResults = await this.executeFunctions(functionCalls);

        // Generate final response with function results
        return this.generateFinalResponse(input, functionResults);
      }

      return {
        content: responseText,
        citations: this.extractCitations(responseText),
        functionsCalled: []
      };
    } catch (error) {
      console.error("Error in agent execution:", error);
      return {
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        citations: [],
        functionsCalled: []
      };
    }
  }

  private formatChatHistory(): string {
    return this.chatHistory.messages
      .slice(-10) // Last 10 messages for context
      .map(m => `${m.role}: ${m.content}`)
      .join("\n");
  }

  private parseFunctionCalls(response: string): FunctionCall[] {
    const calls: FunctionCall[] = [];
    const regex = /<function_call name="(\w+)">\s*(\{[^}]+\})\s*<\/function_call>/g;

    let match;
    while ((match = regex.exec(response)) !== null) {
      calls.push({
        name: match[1],
        parameters: JSON.parse(match[2])
      });
    }

    return calls;
  }

  private async executeFunctions(calls: FunctionCall[]): Promise<FunctionResult[]> {
    const results: FunctionResult[] = [];

    for (const call of calls) {
      try {
        const func = this.kernel.plugins.getFunction(call.name);
        if (func) {
          const result = await func.invoke(this.kernel, call.parameters);
          results.push({
            name: call.name,
            result: result.value,
            success: true
          });
        }
      } catch (error) {
        results.push({
          name: call.name,
          result: `Error: ${error}`,
          success: false
        });
      }
    }

    return results;
  }

  private async generateFinalResponse(
    originalInput: string,
    functionResults: FunctionResult[]
  ): Promise<AgentResponse> {
    const resultsContext = functionResults
      .map(r => `Function ${r.name}: ${JSON.stringify(r.result)}`)
      .join("\n");

    const prompt = `
Based on the user's question and the function results, provide a comprehensive response.

User Question: ${originalInput}

Function Results:
${resultsContext}

Provide a helpful, well-formatted response that synthesizes this information.
Always include citations in [Source: name] format.
`;

    const result = await this.kernel.invokePrompt(prompt);
    const content = result.value?.toString() || "";

    return {
      content,
      citations: this.extractCitations(content),
      functionsCalled: functionResults.map(r => r.name)
    };
  }

  private extractCitations(text: string): Citation[] {
    const citations: Citation[] = [];
    const regex = /\[Source: ([^\]]+)\]/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      citations.push({
        source: match[1],
        context: this.getContextAround(text, match.index)
      });
    }

    return citations;
  }

  private getContextAround(text: string, index: number): string {
    const start = Math.max(0, index - 100);
    const end = Math.min(text.length, index + 100);
    return text.substring(start, end);
  }

  clearHistory(): void {
    this.chatHistory = new ChatHistory();
    this.chatHistory.addSystemMessage(this.systemPrompt);
  }
}

// Type definitions
interface FunctionCall {
  name: string;
  parameters: Record<string, any>;
}

interface FunctionResult {
  name: string;
  result: any;
  success: boolean;
}

interface Citation {
  source: string;
  context: string;
}

interface AgentResponse {
  content: string;
  citations: Citation[];
  functionsCalled: string[];
}

export { AgentResponse, Citation };
```

### Step 2.2: Create Search Plugin

Create `src/plugins/SearchPlugin.ts`:

```typescript
import { KernelFunction, kernel_function } from "@microsoft/semantic-kernel";

export class SearchPlugin {
  private searchResults: Map<string, SearchResult[]> = new Map();

  @kernel_function({
    name: "search",
    description: "Search for information on a topic"
  })
  async search(
    @kernel_function.parameter({ name: "query", description: "Search query" })
    query: string,
    @kernel_function.parameter({ name: "maxResults", description: "Maximum results", defaultValue: 5 })
    maxResults: number = 5
  ): Promise<SearchResult[]> {
    console.log(`Searching for: ${query}`);

    // In production, this would call a real search API (Bing, Google, Azure AI Search)
    // For this lab, we'll use mock data
    const results = this.getMockSearchResults(query, maxResults);

    // Store results for citation tracking
    this.searchResults.set(query, results);

    return results;
  }

  @kernel_function({
    name: "searchNews",
    description: "Search for recent news articles"
  })
  async searchNews(
    @kernel_function.parameter({ name: "topic", description: "News topic" })
    topic: string
  ): Promise<NewsArticle[]> {
    console.log(`Searching news for: ${topic}`);

    // Mock news results
    return [
      {
        title: `Latest developments in ${topic}`,
        source: "Tech News Daily",
        date: new Date().toISOString().split('T')[0],
        snippet: `Recent advancements in ${topic} have shown promising results...`,
        url: `https://example.com/news/${encodeURIComponent(topic)}`
      },
      {
        title: `${topic}: What experts are saying`,
        source: "Industry Weekly",
        date: new Date().toISOString().split('T')[0],
        snippet: `Leading experts in the field of ${topic} have released new findings...`,
        url: `https://example.com/expert-analysis/${encodeURIComponent(topic)}`
      }
    ];
  }

  private getMockSearchResults(query: string, maxResults: number): SearchResult[] {
    // Simulated search results based on common topics
    const topics: Record<string, SearchResult[]> = {
      "artificial intelligence": [
        {
          title: "Introduction to Artificial Intelligence",
          snippet: "AI refers to the simulation of human intelligence in machines programmed to think and learn.",
          url: "https://example.com/ai-intro",
          source: "AI Encyclopedia"
        },
        {
          title: "Machine Learning vs Deep Learning",
          snippet: "Understanding the differences between ML and DL approaches in AI development.",
          url: "https://example.com/ml-dl",
          source: "Tech Research Journal"
        },
        {
          title: "AI in Enterprise Applications",
          snippet: "How businesses are leveraging AI for automation and decision-making.",
          url: "https://example.com/enterprise-ai",
          source: "Business Technology Review"
        }
      ],
      "climate change": [
        {
          title: "Climate Change: The Science Explained",
          snippet: "Understanding the causes and effects of global climate change.",
          url: "https://example.com/climate-science",
          source: "Environmental Science Institute"
        },
        {
          title: "Renewable Energy Solutions",
          snippet: "Exploring solar, wind, and other renewable alternatives to fossil fuels.",
          url: "https://example.com/renewables",
          source: "Green Energy Foundation"
        }
      ],
      "default": [
        {
          title: `Research on ${query}`,
          snippet: `Comprehensive overview of ${query} including key findings and analysis.`,
          url: `https://example.com/research/${encodeURIComponent(query)}`,
          source: "Research Database"
        },
        {
          title: `${query}: A Complete Guide`,
          snippet: `Everything you need to know about ${query} in one comprehensive guide.`,
          url: `https://example.com/guide/${encodeURIComponent(query)}`,
          source: "Knowledge Base"
        }
      ]
    };

    const queryLower = query.toLowerCase();
    let results = topics["default"];

    for (const [key, value] of Object.entries(topics)) {
      if (queryLower.includes(key)) {
        results = value;
        break;
      }
    }

    return results.slice(0, maxResults);
  }
}

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

interface NewsArticle {
  title: string;
  source: string;
  date: string;
  snippet: string;
  url: string;
}

export { SearchResult, NewsArticle };
```

### Step 2.3: Create Summary Plugin

Create `src/plugins/SummaryPlugin.ts`:

```typescript
import { kernel_function } from "@microsoft/semantic-kernel";

export class SummaryPlugin {
  @kernel_function({
    name: "summarize",
    description: "Summarize text in different styles"
  })
  async summarize(
    @kernel_function.parameter({ name: "text", description: "Text to summarize" })
    text: string,
    @kernel_function.parameter({ name: "style", description: "Summary style: brief, detailed, or bullet" })
    style: "brief" | "detailed" | "bullet" = "brief"
  ): Promise<string> {
    console.log(`Summarizing in ${style} style`);

    // In production, this might call the LLM for summarization
    // For this lab, we demonstrate the plugin pattern

    const wordCount = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());

    switch (style) {
      case "brief":
        return this.createBriefSummary(sentences);
      case "detailed":
        return this.createDetailedSummary(text, sentences);
      case "bullet":
        return this.createBulletSummary(sentences);
      default:
        return this.createBriefSummary(sentences);
    }
  }

  @kernel_function({
    name: "extractKeyPoints",
    description: "Extract key points from text"
  })
  async extractKeyPoints(
    @kernel_function.parameter({ name: "text", description: "Source text" })
    text: string,
    @kernel_function.parameter({ name: "count", description: "Number of key points" })
    count: number = 5
  ): Promise<string[]> {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);

    // Simple extraction - in production, use NLP
    return sentences
      .sort((a, b) => b.length - a.length)
      .slice(0, count)
      .map(s => s.trim());
  }

  @kernel_function({
    name: "compareTexts",
    description: "Compare and contrast two texts"
  })
  async compareTexts(
    @kernel_function.parameter({ name: "text1", description: "First text" })
    text1: string,
    @kernel_function.parameter({ name: "text2", description: "Second text" })
    text2: string
  ): Promise<ComparisonResult> {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const common = [...words1].filter(w => words2.has(w));
    const unique1 = [...words1].filter(w => !words2.has(w));
    const unique2 = [...words2].filter(w => !words1.has(w));

    return {
      similarity: common.length / Math.max(words1.size, words2.size),
      commonThemes: common.slice(0, 10),
      uniqueToFirst: unique1.slice(0, 10),
      uniqueToSecond: unique2.slice(0, 10)
    };
  }

  private createBriefSummary(sentences: string[]): string {
    // Take first 2-3 sentences as summary
    return sentences.slice(0, 3).join(". ").trim() + ".";
  }

  private createDetailedSummary(text: string, sentences: string[]): string {
    const intro = `This text contains ${sentences.length} sentences covering the following:`;
    const mainPoints = sentences.slice(0, 5).map(s => `- ${s.trim()}`).join("\n");
    return `${intro}\n\n${mainPoints}`;
  }

  private createBulletSummary(sentences: string[]): string {
    return sentences
      .slice(0, 7)
      .map(s => `• ${s.trim()}`)
      .join("\n");
  }
}

interface ComparisonResult {
  similarity: number;
  commonThemes: string[];
  uniqueToFirst: string[];
  uniqueToSecond: string[];
}

export { ComparisonResult };
```

---

## Part 3: Build Teams Integration (10 minutes)

### Step 3.1: Create Teams Bot Handler

Create `src/bot/TeamsBot.ts`:

```typescript
import {
  TeamsActivityHandler,
  TurnContext,
  MessageFactory,
  CardFactory,
  Attachment
} from "botbuilder";
import { AgentOrchestrator, AgentResponse } from "../agent/AgentOrchestrator";
import { SearchPlugin } from "../plugins/SearchPlugin";
import { SummaryPlugin } from "../plugins/SummaryPlugin";

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
```

### Step 3.2: Create Entry Point

Create/update `src/index.ts`:

```typescript
import { config } from "dotenv";
import * as path from "path";
import * as restify from "restify";
import {
  CloudAdapter,
  ConfigurationBotFrameworkAuthentication,
  ConfigurationBotFrameworkAuthenticationOptions
} from "botbuilder";
import { ResearchAssistantBot } from "./bot/TeamsBot";

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
  console.log("\nEndpoint: http://localhost:${port}/api/messages");
});
```

---

## Part 4: Deploy and Test (10 minutes)

### Step 4.1: Build Project

```bash
npm run build
```

### Step 4.2: Start Local Debug

1. Press `F5` to start debugging
2. Wait for Teams to open
3. Install the agent when prompted

### Step 4.3: Test Scenarios

**Test 1: Basic Research Query**
```
You: "What is machine learning?"

Expected: Comprehensive response with search results and citations
```

**Test 2: Complex Research**
```
You: "Compare renewable energy sources and their efficiency"

Expected: Multi-part response with comparisons and sources
```

**Test 3: Summarization**
```
You: "Summarize the benefits of cloud computing in bullet points"

Expected: Bullet-point summary with key points
```

**Test 4: Session Memory**
```
You: "Earlier we discussed machine learning. Can you elaborate on neural networks?"

Expected: References previous context, continues conversation
```

### Step 4.4: Verify Features

| Feature | Test Method | Expected Result |
|---------|-------------|-----------------|
| Search | Ask research question | Results with sources |
| Memory | Reference earlier topic | Maintains context |
| Citations | Check response | [Source: name] format |
| Commands | Type `/help` | Help card appears |
| Clear | Type `/clear` | Session resets |

---

## ✅ Lab Completion Checklist

- [ ] Created custom engine agent project
- [ ] Configured Semantic Kernel orchestrator
- [ ] Implemented SearchPlugin
- [ ] Implemented SummaryPlugin
- [ ] Built Teams bot handler
- [ ] Deployed to Teams
- [ ] Tested research queries
- [ ] Verified citation tracking
- [ ] Tested session memory
- [ ] Commands working (/help, /clear)

---

## 🎓 Key Takeaways

1. **Custom Engine Agents** provide full control over orchestration
2. **Semantic Kernel** simplifies AI plugin development
3. **Plugins** modularize agent capabilities
4. **Memory** enables contextual conversations
5. **Function calling** allows agents to use tools intelligently

---

## 📚 Resources

- [M365 Agents SDK Documentation](https://learn.microsoft.com/microsoftteams/platform/bots/how-to/teams-conversational-ai/)
- [Semantic Kernel Documentation](https://learn.microsoft.com/semantic-kernel/)
- [Bot Framework Documentation](https://docs.botframework.com)

---

*Lab 3 Complete! Day 1 labs finished. See you on Day 2!*

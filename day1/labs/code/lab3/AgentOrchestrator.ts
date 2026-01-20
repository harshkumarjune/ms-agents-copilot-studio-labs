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

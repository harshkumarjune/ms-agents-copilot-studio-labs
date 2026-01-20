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

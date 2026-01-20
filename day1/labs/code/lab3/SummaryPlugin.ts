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

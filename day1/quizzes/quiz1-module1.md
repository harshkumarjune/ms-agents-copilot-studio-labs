# Day 1 Quiz: Build Agents for Microsoft 365 Copilot
## Module 1 Assessment

**Duration:** 15 minutes
**Questions:** 15
**Passing Score:** 70% (11/15)

---

## Instructions

- Select the **best** answer for each question
- Some questions may have multiple correct answers (marked as "Select all that apply")
- Review your answers before submitting
- You may reference slides but not lab materials

---

## Questions

### Q1. Copilots vs Agents (Conceptual)

What is the primary difference between a Copilot and an Agent in the Microsoft ecosystem?

- A) Copilots are more expensive to deploy
- B) Agents can execute tasks autonomously while Copilots assist users with tasks
- C) Copilots only work in Microsoft Word
- D) Agents require Azure AD Premium licensing

**Answer:** B

---

### Q2. Declarative Agents (Definition)

Which statement best describes a declarative agent?

- A) An agent built entirely with Python code
- B) An agent defined through configuration files (JSON/YAML) rather than custom code
- C) An agent that only works with SharePoint
- D) An agent that requires Kubernetes deployment

**Answer:** B

---

### Q3. Custom Engine Agents (Use Case)

When should you choose a custom engine agent over a declarative agent? (Select all that apply)

- A) When you need complex custom orchestration logic
- B) When you want the fastest development time
- C) When you need to integrate a custom LLM
- D) When you need advanced tool chaining
- E) When building a simple FAQ bot

**Answer:** A, C, D

---

### Q4. M365 Agents Toolkit (Components)

What does the Microsoft 365 Agents Toolkit provide? (Select all that apply)

- A) VS Code extension for development
- B) Project templates and scaffolding
- C) Local debugging capabilities
- D) Production hosting infrastructure
- E) Manifest validation

**Answer:** A, B, C, E

---

### Q5. TypeSpec (Purpose)

What is TypeSpec used for in agent development?

- A) Styling the agent's UI
- B) Defining API contracts and schemas that compile to OpenAPI
- C) Managing agent memory
- D) Configuring Azure resources

**Answer:** B

---

### Q6. Agent Manifest (Structure)

Which file defines the core configuration of a declarative agent?

- A) package.json
- B) declarativeAgent.json
- C) tsconfig.json
- D) teamsapp.yml

**Answer:** B

---

### Q7. Plugins (Architecture)

What protocol do M365 Copilot plugins typically use to define their capabilities?

- A) GraphQL
- B) gRPC
- C) OpenAPI (Swagger)
- D) SOAP

**Answer:** C

---

### Q8. Copilot Connectors (Function)

What is the primary purpose of Copilot Connectors?

- A) To connect physical devices to the agent
- B) To ingest external data sources for agent knowledge
- C) To connect to social media platforms
- D) To manage user authentication

**Answer:** B

---

### Q9. Agent Instructions (Best Practice)

When writing agent instructions, which approach is recommended?

- A) Keep instructions as brief as possible
- B) Use structured formatting with headers, lists, and examples
- C) Only include technical specifications
- D) Avoid providing examples to the AI

**Answer:** B

---

### Q10. M365 Agents SDK (Capability)

What additional capability does the M365 Agents SDK provide compared to declarative agents?

- A) Prettier UI
- B) Custom orchestration code and full control over agent behavior
- C) Faster response times
- D) Lower licensing costs

**Answer:** B

---

### Q11. Semantic Kernel (Integration)

What is Microsoft Semantic Kernel primarily used for?

- A) Image processing
- B) AI orchestration with plugins, planners, and memory
- C) Database management
- D) Network security

**Answer:** B

---

### Q12. Conversation Starters (Purpose)

What is the purpose of "conversation_starters" in a declarative agent configuration?

- A) To automatically start conversations at scheduled times
- B) To provide example prompts that help users understand agent capabilities
- C) To configure the agent's greeting message
- D) To set up webhooks for external triggers

**Answer:** B

---

### Q13. Teams Integration (Deployment)

How do you deploy a declarative agent to Microsoft Teams for testing?

- A) Email the manifest to Microsoft support
- B) Use F5 debugging in VS Code with M365 Agents Toolkit
- C) Upload directly to the Teams mobile app
- D) Configure through Azure DevOps pipelines only

**Answer:** B

---

### Q14. Agent Memory (Concept)

In a custom engine agent, why is conversation memory important?

- A) It reduces API costs
- B) It enables the agent to maintain context across multiple turns
- C) It speeds up response times
- D) It is required for compliance

**Answer:** B

---

### Q15. Scenario Question (Applied Knowledge)

Your company needs an AI assistant that:
- Answers questions about company policies (stored in SharePoint)
- Creates IT support tickets
- Checks equipment inventory

Which approach would be MOST appropriate?

- A) Build a custom engine agent from scratch
- B) Build a declarative agent with plugins and connectors
- C) Use Microsoft Copilot without customization
- D) Build separate agents for each task

**Answer:** B

---

## Answer Key

| Q | Answer | Topic |
|---|--------|-------|
| 1 | B | Copilots vs Agents |
| 2 | B | Declarative Agents |
| 3 | A, C, D | Custom Engine Agents |
| 4 | A, B, C, E | M365 Agents Toolkit |
| 5 | B | TypeSpec |
| 6 | B | Agent Manifest |
| 7 | C | Plugins |
| 8 | B | Copilot Connectors |
| 9 | B | Agent Instructions |
| 10 | B | M365 Agents SDK |
| 11 | B | Semantic Kernel |
| 12 | B | Conversation Starters |
| 13 | B | Teams Integration |
| 14 | B | Agent Memory |
| 15 | B | Scenario Application |

---

## Scoring Guide

| Score | Grade | Status |
|-------|-------|--------|
| 14-15 | A | Excellent |
| 12-13 | B | Good |
| 11 | C | Pass |
| < 11 | F | Review Required |

---

## Topics for Review (if needed)

If you scored below passing:
- Review Pre-Read materials 1 and 2
- Re-watch demo recordings
- Practice with Lab 1 and 2
- Discuss concepts with instructor

---

*Quiz designed for DW-104 Module 1 Assessment*

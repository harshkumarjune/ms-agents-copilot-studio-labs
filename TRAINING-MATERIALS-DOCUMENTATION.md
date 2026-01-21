# DW-104: Microsoft 365 Agents Pro-Code Training
## Complete Training Materials Documentation

**Version:** 2.0 (Restructured for Copilot Studio)
**Last Updated:** January 2026
**Author:** Harsh Kumar

---

## Executive Summary

This training has been restructured to work with **Copilot Studio Trial** accounts, eliminating dependencies on:
- Microsoft 365 Developer Program sandbox (not available)
- Azure AI Search (access denied)
- Azure AI Foundry/OpenAI (access denied)
- M365 Agents Toolkit deployment capabilities

The restructured labs maintain the same learning objectives while using available resources.

---

## Table of Contents

1. [Environment Constraints](#environment-constraints)
2. [Original vs Restructured Labs](#original-vs-restructured-labs)
3. [Complete File Inventory](#complete-file-inventory)
4. [Setup Requirements](#setup-requirements)
5. [Day 1 Overview](#day-1-overview)
6. [Day 2 Overview](#day-2-overview)
7. [M365 Agents Toolkit Demo](#m365-agents-toolkit-demo)
8. [Resources & Links](#resources--links)

---

## Environment Constraints

### What We Have
| Resource | Status | Access |
|----------|--------|--------|
| Copilot Studio | ✅ Available | Trial account |
| Power Automate | ✅ Available | Trial account |
| Free Cloud Hosting | ✅ Available | Replit, Render, Railway |
| VS Code | ✅ Available | Local installation |
| M365 Agents Toolkit | ⚠️ Partial | Demo only (no deployment) |

### What We Don't Have
| Resource | Status | Impact |
|----------|--------|--------|
| M365 Developer Sandbox | ❌ Not Available | Can't deploy to Teams |
| Azure AI Search | ❌ Access Denied | Use file upload knowledge |
| Azure AI Foundry | ❌ Access Denied | Use built-in GPT |
| Azure OpenAI | ❌ Access Denied | Use built-in GPT |

---

## Original vs Restructured Labs

| Lab | Original Approach | Restructured Approach | Learning Maintained |
|-----|------------------|----------------------|---------------------|
| **1** | M365 Toolkit + TypeSpec API | Copilot Studio Topics + Entities | ✅ Agent creation, conversation flows |
| **2** | Instructions-based agent | Same (works as-is) | ✅ Prompt engineering |
| **3** | Semantic Kernel + Plugins | Topics + Power Automate | ✅ Multi-step workflows, state |
| **4** | Azure App Service + MCP | Replit (free) + HTTP Action | ✅ External API integration |
| **5** | Azure AI Search + BYOM | File Upload + Built-in GPT | ✅ RAG, knowledge grounding |

---

## Complete File Inventory

### Slides
```
slides/
├── day1-module1-slides.html          # Day 1 presentation (to be updated)
└── day2-modules2-3-slides.html       # Day 2 presentation (to be updated)
```

### Trainer Guides
```
trainer-guides/
├── RESTRUCTURED-LABS-COPILOT-STUDIO-ONLY.md  # Main lab guide (restructured)
├── TRAINER-DAY-OF-CHECKLIST.md               # Day-of execution checklist
├── TRAINERS-LOD-EXECUTION-GUIDE.md           # LOD environment guide
├── COMPLETE-LAB-EXECUTION-GUIDE.md           # Original lab guide
├── ADVANCED-TOPICS-GUIDE.md                  # Deep dive extensions
└── COMPREHENSIVE-TROUBLESHOOTING-GUIDE.md    # All known issues & fixes
```

### Participant Handouts
```
handouts/
├── PARTICIPANT-HANDOUT.md            # Printable participant guide
└── QUICK-REFERENCE-CARDS.md          # 8 reference cards
```

### Lab Code Files
```
day2/labs/code/
├── lab4-restructured/
│   └── replit-api-server/
│       ├── index.js                  # Complete API server
│       ├── package.json              # Dependencies
│       └── README.md                 # Deployment guide
└── lab5-restructured/
    └── products-catalog.txt          # Knowledge file for upload
```

### This Documentation
```
TRAINING-MATERIALS-DOCUMENTATION.md   # This file
TRAINEE-SETUP-AND-LAB-GUIDE.md       # Trainee-facing instructions
```

---

## Setup Requirements

### Trainer Pre-Training Checklist
- [ ] Copilot Studio access verified
- [ ] Replit account created with Lab 4 API deployed
- [ ] GitHub repo accessible with all materials
- [ ] Slides updated and tested
- [ ] Quick reference cards printed

### Trainee Requirements
| Requirement | Purpose |
|-------------|---------|
| Microsoft account | Access Copilot Studio |
| Copilot Studio trial | Build agents |
| Replit account (free) | Lab 4 API hosting |
| Modern browser | Chrome, Edge, or Firefox |
| VS Code (optional) | M365 Toolkit demo |

---

## Day 1 Overview

### Schedule
| Time | Activity | Duration |
|------|----------|----------|
| 9:00 | Welcome & Environment Setup | 30 min |
| 9:30 | Slides: AI Agents & Microsoft Ecosystem | 90 min |
| 11:00 | Break | 15 min |
| 11:15 | Slides: Copilot Studio Introduction | 45 min |
| 12:00 | Lunch | 60 min |
| 13:00 | **Lab 1: Customer Service Agent** | 60 min |
| 14:00 | Break | 15 min |
| 14:15 | **Lab 2: Interactive Game Agent** | 60 min |
| 15:15 | Break | 15 min |
| 15:30 | M365 Agents Toolkit Demo | 30 min |
| 16:00 | Day 1 Wrap-up & Q&A | 30 min |

### Lab 1: Customer Service Agent
**Objective:** Build an agent using Copilot Studio Topics and Entities

**What Trainees Learn:**
- Creating agents in Copilot Studio
- Designing Topics for conversation flows
- Using Entities to capture structured data
- Testing in the Copilot Studio test panel

**Exit Criteria:**
- Agent responds to product inquiries
- Agent handles order status checks
- Agent has appropriate fallback behavior

### Lab 2: Interactive Game Agent
**Objective:** Build a number guessing game using pure instructions

**What Trainees Learn:**
- Instruction engineering (prompt design)
- State management through prompts
- Creating engaging conversational experiences
- No-code approach to agent behavior

**Exit Criteria:**
- Agent generates random number and tracks guesses
- Agent provides higher/lower hints
- Agent celebrates wins and tracks attempts

---

## Day 2 Overview

### Schedule
| Time | Activity | Duration |
|------|----------|----------|
| 9:00 | Day 1 Review & Q&A | 30 min |
| 9:30 | Slides: Pro-Code Concepts | 60 min |
| 10:30 | Break | 15 min |
| 10:45 | **Lab 3: Multi-Step Workflow Agent** | 75 min |
| 12:00 | Lunch | 60 min |
| 13:00 | Slides: External Integrations & RAG | 45 min |
| 13:45 | **Lab 4: Custom API Connector** | 75 min |
| 15:00 | Break | 15 min |
| 15:15 | **Lab 5: Knowledge-Powered Agent** | 60 min |
| 16:15 | Certification Paths & Wrap-up | 45 min |

### Lab 3: Multi-Step Workflow Agent
**Objective:** Build IT Helpdesk agent with complex flows

**What Trainees Learn:**
- Designing multi-step Topic flows
- Using variables for state tracking
- Connecting to Power Automate
- Building verification workflows

**Exit Criteria:**
- Password reset flow with verification
- Software request flow with approval steps
- Hardware issue flow with troubleshooting

### Lab 4: Custom API Connector
**Objective:** Connect Copilot Studio to external API

**What Trainees Learn:**
- Deploying APIs to free hosting (Replit)
- Creating HTTP actions in Copilot Studio
- Integrating external data sources
- Error handling in API integrations

**Exit Criteria:**
- API deployed and accessible
- Agent retrieves employee data from API
- Agent queries inventory from API
- Agent creates support tickets via API

### Lab 5: Knowledge-Powered Agent
**Objective:** Build knowledge-grounded retail agent

**What Trainees Learn:**
- Uploading knowledge files to Copilot Studio
- Configuring knowledge behavior
- Prompt engineering for grounded responses
- Handling "not found" scenarios

**Exit Criteria:**
- Knowledge source configured
- Agent answers product questions accurately
- Agent handles out-of-stock items correctly
- Agent doesn't hallucinate products

---

## M365 Agents Toolkit Demo

### Why Include This Demo
Even though we can't deploy to Teams, the M365 Agents Toolkit demo shows trainees:
1. The **pro-code development experience** they'll use in production
2. How **TypeSpec** works for API definitions
3. The **project structure** for declarative agents
4. What's possible when they have full M365 access

### Demo Script (30 minutes)

#### Part 1: Installation & Overview (10 min)
```
1. Open VS Code
2. Show Extensions → Search "M365 Agents Toolkit"
3. Install the extension
4. Show the sidebar icon and features
5. Explain: "This is what you'd use with a full M365 Developer subscription"
```

#### Part 2: Create Sample Project (10 min)
```
1. Click "Create New Agent"
2. Select "Declarative Agent" template
3. Choose "With API Plugin"
4. Walk through generated files:
   - appPackage/manifest.json
   - appPackage/declarativeAgent.json
   - appPackage/ai-plugin.json
   - src/api/repairs.ts
5. Show TypeSpec file and explain syntax
```

#### Part 3: Explain the Gap (10 min)
```
1. Show the "Sign In" button
2. Explain: "This requires M365 Developer subscription"
3. Explain: "In production, you'd sign in and deploy to Teams"
4. Show: "What we did in Copilot Studio achieves the same learning"
5. Bridge: "TypeSpec → Topics, Plugins → HTTP Actions"
```

### Key Points for Trainees
- M365 Agents Toolkit is the **professional development environment**
- Today's Copilot Studio labs teach the **same concepts**
- When you have full M365 access, you can deploy to Teams
- The **architecture and patterns** are identical

---

## Resources & Links

### Essential URLs
| Resource | URL |
|----------|-----|
| Copilot Studio | https://copilotstudio.microsoft.com |
| Power Automate | https://make.powerautomate.com |
| Replit | https://replit.com |
| GitHub Materials | https://github.com/harshjunekumar/m365-agents-training |

### Documentation
| Topic | Link |
|-------|------|
| Copilot Studio Docs | https://learn.microsoft.com/copilot-studio |
| M365 Agents Toolkit | https://learn.microsoft.com/microsoft-365-copilot/extensibility |
| TypeSpec | https://typespec.io |
| Power Automate | https://learn.microsoft.com/power-automate |

### Certification Paths
| Certification | Relevance |
|---------------|-----------|
| PL-400 | Power Platform Developer - Copilot Studio |
| AI-102 | Azure AI Engineer - Azure OpenAI, AI Search |
| Applied Skills | Copilot Extensions - Hands-on validation |

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Original training materials |
| 2.0 | Jan 2026 | Restructured for Copilot Studio only |

---

*DW-104 Training Materials Documentation | Version 2.0 | January 2026*

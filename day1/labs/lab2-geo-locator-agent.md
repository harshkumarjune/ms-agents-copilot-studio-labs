# Lab 2: Build an Instructions-Based Geo Locator Game Agent
## Microsoft 365 Agents Toolkit

**Duration:** 40 minutes
**Difficulty:** Medium
**LOD Module:** PL-400-M01-L02

---

## 🎯 Lab Objectives

By the end of this lab, you will be able to:
1. Create an instructions-driven declarative agent
2. Design engaging game mechanics using natural language instructions
3. Implement conversation flow without traditional programming
4. Use agent capabilities for interactive experiences
5. Test and refine agent behavior through iteration

---

## 📋 Scenario

**GeoQuest Challenge** - Create an engaging geography trivia game agent that:
- Provides location-based clues to players
- Tracks score across multiple rounds
- Offers hints when players are stuck
- Celebrates correct answers with fun facts
- Maintains game state throughout the conversation

This lab focuses on **instruction engineering** - crafting detailed instructions that guide AI behavior without traditional code.

---

## 🔧 Prerequisites Checklist

Before starting, verify:
- [ ] Completed Lab 1 (familiar with project structure)
- [ ] VS Code with M365 Agents Toolkit installed
- [ ] M365 Developer tenant access
- [ ] Signed into M365 Agents Toolkit

---

## Part 1: Create the Game Agent Project (8 minutes)

### Step 1.1: Initialize Project

1. **Create New Agent:**
   - Press `Ctrl+Shift+P`
   - Select `M365 Agents: Create a New App`

2. **Configure Project:**

   | Setting | Value |
   |---------|-------|
   | Project Type | Declarative Agent |
   | Template | Basic Declarative Agent |
   | Project Name | `geo-locator-game` |
   | Language | TypeScript |

3. **Open Project** when scaffolding completes

### Step 1.2: Project Structure

Your project will have a simpler structure (no API plugin):

```
geo-locator-game/
├── appPackage/
│   ├── manifest.json
│   └── declarativeAgent.json   # Main focus
├── env/
├── teamsapp.yml
└── package.json
```

---

## Part 2: Design the Game Instructions (15 minutes)

### Step 2.1: Core Game Design

Before writing instructions, plan the game:

```
┌─────────────────────────────────────────────────────────────┐
│                    GEOQUEST GAME DESIGN                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  GAME FLOW:                                                 │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐    │
│  │ Welcome │ → │  Clue   │ → │ Guess   │ → │ Result  │    │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘    │
│       │             │             │             │          │
│       │             ▼             ▼             ▼          │
│       │        [Hint?]       [Correct?]    [Next/End?]    │
│       │             │             │             │          │
│       └─────────────┴─────────────┴─────────────┘          │
│                                                             │
│  SCORING:                                                   │
│  • Correct (no hints): 100 points                          │
│  • Correct (with hint): 50 points                          │
│  • Incorrect: 0 points                                      │
│  • Bonus round: 2x multiplier                              │
│                                                             │
│  DIFFICULTY LEVELS:                                         │
│  • Easy: Famous landmarks, major cities                     │
│  • Medium: Lesser-known locations, regional features        │
│  • Hard: Obscure places, tricky clues                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Step 2.2: Write Comprehensive Instructions

Open `appPackage/declarativeAgent.json` and replace with:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.2/schema.json",
  "version": "v1.2",
  "name": "GeoQuest Challenge",
  "description": "An exciting geography trivia game where you guess locations from clever clues!",
  "instructions": "You are GeoQuest, an enthusiastic and fun geography game host. Your personality is upbeat, encouraging, and educational.\n\n## GAME RULES\n\n### Starting a Game\nWhen a user wants to play:\n1. Welcome them warmly to GeoQuest Challenge\n2. Ask their preferred difficulty (Easy, Medium, or Hard)\n3. Explain scoring: 100 points for correct answers, 50 if they used a hint\n4. Offer to play 5 rounds (or let them choose 3, 5, or 10)\n5. Start Round 1 immediately after they confirm\n\n### Giving Clues\nFor each round:\n1. Announce the round number and current score\n2. Give a creative, poetic clue about a real place\n3. The clue should NOT contain the place name\n4. Include cultural, historical, or geographical hints\n5. Make Easy clues obvious, Hard clues cryptic\n\n### Clue Examples by Difficulty\n\n**Easy Examples:**\n- \"I stand tall in New York Harbor, a gift from France, welcoming millions with my torch held high\" (Statue of Liberty)\n- \"I'm the longest wall ever built, winding through mountains, visible from above\" (Great Wall of China)\n\n**Medium Examples:**\n- \"Cherry blossoms frame my ancient temples, where geishas once walked and bullet trains now speed past\" (Kyoto, Japan)\n- \"I'm a city of canals with no cars, where gondolas glide beneath bridges of sighs\" (Venice, Italy)\n\n**Hard Examples:**\n- \"At the meeting of three borders, I shelter ancient monasteries where monks still pray in Ge'ez\" (Lalibela, Ethiopia)\n- \"My blue domes overlook a caldera, born from volcanic fury, now painted in sunset hues\" (Santorini, Greece)\n\n### Processing Guesses\nWhen the user guesses:\n1. If CORRECT:\n   - Celebrate enthusiastically!\n   - Award points (100 or 50 if hint was used)\n   - Share 2-3 fun facts about the location\n   - Update total score\n   - Move to next round or end game\n\n2. If INCORRECT:\n   - Encourage them kindly\n   - Ask if they want a hint (costs 50 points)\n   - Let them guess again (max 3 attempts)\n   - After 3 wrong guesses, reveal answer with interesting facts\n\n### Giving Hints\nWhen user asks for hint:\n1. Note that using hint reduces points to 50\n2. Give a more direct clue without revealing the answer\n3. Include continent or country for harder questions\n\n### Ending the Game\nAfter final round:\n1. Announce final score\n2. Give a fun title based on score:\n   - 0-200: \"Armchair Traveler\"\n   - 201-400: \"Weekend Explorer\"\n   - 401-600: \"Seasoned Voyager\"\n   - 601-800: \"Globe Trotter\"\n   - 801-1000: \"Geography Genius\"\n3. Offer to play again with different settings\n\n### Game State Tracking\nAlways remember and mention:\n- Current round number\n- Total score so far\n- Difficulty level\n- Whether hint was used this round\n\n### Special Features\n- BONUS ROUND: Every 5th round is a bonus with 2x points\n- STREAK BONUS: 3 correct in a row = 25 bonus points\n- SPEED BONUS: Quick correct answer = 10 bonus points (mention \"That was fast!\")\n\n### Personality Guidelines\n- Be enthusiastic but not overwhelming\n- Use travel and geography puns occasionally\n- If someone gets frustrated, be extra supportive\n- Share your \"excitement\" about each location\n- Use emojis sparingly for celebration: 🌍 🎉 ✈️ 🗺️\n\n### Edge Cases\n- If user gives partial answer, ask to be more specific\n- If user asks unrelated question, kindly redirect to game\n- If user wants to quit mid-game, save their score and offer to resume later\n- Accept common alternate names (e.g., \"Big Apple\" for New York)",
  "capabilities": {
    "conversation_starters": [
      {
        "title": "🌍 Start New Game",
        "text": "I want to play GeoQuest!"
      },
      {
        "title": "🎯 Quick Round",
        "text": "Give me one geography challenge"
      },
      {
        "title": "📚 Easy Mode",
        "text": "Let's play an easy geography game"
      },
      {
        "title": "🔥 Hard Challenge",
        "text": "I'm ready for the hardest geography questions!"
      }
    ]
  }
}
```

### Step 2.3: Analyze Instruction Techniques

```
┌─────────────────────────────────────────────────────────────┐
│              INSTRUCTION ENGINEERING TECHNIQUES              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. PERSONA DEFINITION                                      │
│     "You are GeoQuest, an enthusiastic and fun..."          │
│     → Establishes consistent personality                    │
│                                                             │
│  2. STRUCTURED RULES                                        │
│     Using headers (##) and numbered lists                   │
│     → Clear organization for complex behavior               │
│                                                             │
│  3. EXAMPLES                                                │
│     Providing sample clues by difficulty                    │
│     → Shows exact format and quality expected               │
│                                                             │
│  4. CONDITIONAL LOGIC                                       │
│     "If CORRECT... If INCORRECT..."                         │
│     → Handles branching conversation paths                  │
│                                                             │
│  5. STATE TRACKING                                          │
│     "Always remember: round number, score..."               │
│     → Maintains context across conversation                 │
│                                                             │
│  6. EDGE CASE HANDLING                                      │
│     "If user gives partial answer..."                       │
│     → Graceful handling of unexpected inputs                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 3: Update Application Manifest (5 minutes)

### Step 3.1: Configure Teams Manifest

Open `appPackage/manifest.json` and update:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.17/MicrosoftTeams.schema.json",
  "manifestVersion": "1.17",
  "version": "1.0.0",
  "id": "${{TEAMS_APP_ID}}",
  "developer": {
    "name": "Contoso Learning",
    "websiteUrl": "https://www.contoso.com",
    "privacyUrl": "https://www.contoso.com/privacy",
    "termsOfUseUrl": "https://www.contoso.com/terms"
  },
  "name": {
    "short": "GeoQuest",
    "full": "GeoQuest Challenge - Geography Trivia Game"
  },
  "description": {
    "short": "Test your geography knowledge!",
    "full": "GeoQuest Challenge is an exciting geography trivia game where you guess locations from clever clues. Choose your difficulty, earn points, and become a Geography Genius!"
  },
  "icons": {
    "color": "color.png",
    "outline": "outline.png"
  },
  "accentColor": "#2E7D32",
  "copilotAgents": {
    "declarativeAgents": [
      {
        "id": "geoQuestAgent",
        "file": "declarativeAgent.json"
      }
    ]
  },
  "permissions": [
    "identity",
    "messageTeamMembers"
  ],
  "validDomains": []
}
```

### Step 3.2: Create Custom Icons (Optional)

Create simple icons for your game:
- `color.png`: 192x192 colorful globe/map icon
- `outline.png`: 32x32 outline version

For this lab, you can use the default icons provided by the template.

---

## Part 4: Test and Iterate (10 minutes)

### Step 4.1: Deploy to Teams

1. **Sign In:**
   ```
   Ctrl+Shift+P → M365 Agents: Sign in to Microsoft 365
   ```

2. **Start Debugging:**
   - Press `F5`
   - Wait for Teams to open

3. **Install Agent:**
   - Approve installation when prompted
   - Select Personal scope

### Step 4.2: Test Game Flow

Test each game scenario:

**Test 1: Starting a Game**
```
You: "I want to play GeoQuest!"

Expected Response:
🌍 Welcome to GeoQuest Challenge! I'm thrilled to have you here!

Before we begin, let me ask:
- What difficulty would you like? (Easy, Medium, or Hard)
- How many rounds? (3, 5, or 10)

Scoring reminder:
- 100 points for correct answers
- 50 points if you use a hint
- Bonus rounds every 5 rounds for 2x points!

Ready to explore the world? 🗺️
```

**Test 2: Playing a Round**
```
You: "Medium difficulty, 5 rounds"

Expected Response:
Perfect! Medium difficulty, 5 rounds. Let's go!

═══════════════════════════════════
📍 ROUND 1 | Score: 0 | Medium
═══════════════════════════════════

Here's your clue:

"I'm a city where ancient gladiators fought,
Where fountains grant wishes freely sought,
My Colosseum stands proud through time,
And every corner tells stories sublime."

What city am I? 🤔
```

**Test 3: Correct Answer**
```
You: "Rome"

Expected Response:
🎉 CORRECT! That's Rome, Italy!

+100 points! Your score: 100

Fun Facts about Rome:
• Rome was founded in 753 BC, making it nearly 3,000 years old
• The Trevi Fountain collects about €3,000 in coins daily
• There are over 2,000 fountains in Rome - more than any other city!

Ready for Round 2? ✈️
```

**Test 4: Using a Hint**
```
You: "I need a hint"

Expected Response:
No problem! Here's your hint (answer will be worth 50 points):

This European capital is famous for:
- Pizza and pasta (it's the country's origin!)
- The Vatican City is entirely within this city
- The Pantheon has stood here for almost 2,000 years

Take another guess! 🗺️
```

**Test 5: Incorrect Answer**
```
You: "Paris"

Expected Response:
Not quite! Paris is beautiful but not the answer.

You have 2 more attempts.
Would you like another hint, or want to guess again?

Remember: The clue mentioned gladiators and the Colosseum! 💭
```

### Step 4.3: Refine Instructions

Based on testing, you might need to adjust instructions. Common refinements:

| Issue | Solution |
|-------|----------|
| Agent forgets score | Add "ALWAYS state current score after each answer" |
| Clues too obvious | Add more cryptic clue examples |
| Game ends abruptly | Add transition phrases between rounds |
| Repetitive responses | Add variety instructions: "Use different celebratory phrases" |

### Step 4.4: Document Improvements

Note what worked and what needed adjustment:

```
┌─────────────────────────────────────────────────────────────┐
│                    ITERATION NOTES                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  What Worked Well:                                          │
│  • _________________________________________                │
│  • _________________________________________                │
│  • _________________________________________                │
│                                                             │
│  What Needed Adjustment:                                    │
│  • _________________________________________                │
│  • _________________________________________                │
│  • _________________________________________                │
│                                                             │
│  Instructions Added/Modified:                               │
│  • _________________________________________                │
│  • _________________________________________                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 5: Advanced Instruction Techniques (Optional - 5 minutes)

### Step 5.1: Add Multiplayer Support

Add to instructions:

```
### Multiplayer Mode
If multiple people want to play:
1. Ask each player's name
2. Take turns: "Player 1, here's your clue..."
3. Track individual scores
4. Announce standings after each round
5. Crown the winner at the end
```

### Step 5.2: Add Theme Modes

```
### Theme Modes
If user requests a theme:
- "Capital Cities": Only use capital city locations
- "Wonders": Ancient and modern wonders
- "Natural": Mountains, rivers, national parks
- "Beach": Coastal and island destinations
- "Historical": Places of historical significance
```

### Step 5.3: Add Adaptive Difficulty

```
### Adaptive Difficulty
- If player gets 3 correct in a row, increase difficulty
- If player gets 2 wrong in a row, offer easier question
- Say: "You're doing great! Let me challenge you more..."
- Or: "Let's try something a bit easier..."
```

---

## ✅ Lab Completion Checklist

Verify you have completed:

- [ ] Created basic declarative agent project
- [ ] Wrote comprehensive game instructions
- [ ] Defined game rules, scoring, and personality
- [ ] Included examples for AI guidance
- [ ] Deployed to Teams
- [ ] Tested full game flow
- [ ] Verified score tracking works
- [ ] Tested hint system
- [ ] Agent handles edge cases
- [ ] Documented improvements made

---

## 🎓 Key Takeaways

1. **Instructions are code** - Well-crafted instructions produce predictable, quality behavior
2. **Structure matters** - Use headers, lists, and clear formatting
3. **Examples guide quality** - Show the AI exactly what you want
4. **State tracking** - Explicitly tell the AI what to remember
5. **Edge cases** - Handle unexpected inputs gracefully
6. **Iteration is essential** - Test and refine continuously

---

## 🚀 Challenge Extension

If you finish early:

1. **Add a Leaderboard:**
   - Store top scores
   - Show personal bests
   - Weekly challenges

2. **Add Learning Mode:**
   - Explain wrong answers in detail
   - Provide maps or images (describe them)
   - Quiz on previous wrong answers

3. **Add Time Pressure:**
   - Speed bonus instructions
   - "Countdown" feeling in responses

---

## 📚 Resources

- [Declarative Agent Best Practices](https://learn.microsoft.com/copilot/agents)
- [Prompt Engineering Guide](https://learn.microsoft.com/azure/ai-services/openai/concepts/prompt-engineering)
- [Conversation Design Principles](https://learn.microsoft.com/microsoftteams/platform/bots/design/bots)

---

*Lab 2 Complete! Proceed to Lab 3: M365 Agents SDK with Semantic Kernel*

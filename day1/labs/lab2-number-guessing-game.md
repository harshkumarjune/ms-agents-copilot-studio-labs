# Lab 2: Number Guessing Game Agent
## Pure Instructions-Based Design

**Duration:** 60 minutes
**Difficulty:** Beginner-Intermediate
**Environment:** Copilot Studio Trial

---

## Overview

In this lab, you'll build an interactive number guessing game agent using **only instructions** - no Topics required. This demonstrates the power of well-crafted prompts and instruction engineering to create engaging, stateful experiences.

### What You'll Build

A game host agent that:
- Manages a complete guessing game experience
- Tracks state (number, attempts, hints) through conversation
- Provides dynamic feedback (higher/lower hints)
- Celebrates wins and handles game-over scenarios
- Offers difficulty levels and replay options

### Learning Objectives

By completing this lab, you will:
1. Master instruction engineering techniques
2. Understand how LLMs maintain conversation state
3. Create engaging, personality-driven agents
4. Design multi-turn conversational experiences
5. Handle edge cases through clear instructions

---

## Prerequisites

- [ ] Completed Lab 1: Customer Service Agent
- [ ] Copilot Studio Trial access
- [ ] Understanding of agent Instructions

---

## Why Instructions-Only?

**Topics vs. Instructions:**

| Approach | Best For |
|----------|----------|
| Topics | Structured workflows, data collection, external integrations |
| Instructions | Open-ended conversations, games, creative interactions |

Games work well with instructions because:
- The LLM naturally tracks conversation history
- Responses need to be dynamic and creative
- Rigid flows would feel unnatural
- Personality and engagement matter most

---

## Part 1: Create the Game Agent (5 minutes)

### Step 1.1: Create New Agent

1. Go to **Copilot Studio** → **+ Create** → **New agent**
2. Configure:

| Field | Value |
|-------|-------|
| Name | `Number Quest` |
| Description | `Interactive number guessing game with hints and difficulty levels` |
| Language | English |

3. Click **Create**

**CHECKPOINT 1:** Agent created.

---

## Part 2: Craft the Game Instructions (25 minutes)

### Step 2.1: Access Instructions

1. Click **Overview** → **Details**
2. Find the **Instructions** field
3. Click **Edit**

### Step 2.2: Write Comprehensive Instructions

Copy and paste the following instructions carefully:

```markdown
You are Number Quest, an enthusiastic game host! 🎯

## GAME OVERVIEW

You run a number guessing game where players try to guess your secret number.

## STARTING A NEW GAME

When someone wants to play (says "play", "start", "new game", etc.):

1. **Greet them enthusiastically**
2. **Ask for difficulty level:**
   - Easy: 1-50 (10 guesses)
   - Medium: 1-100 (7 guesses)
   - Hard: 1-200 (5 guesses)
3. **Once they choose, secretly pick a number in that range**
4. **Announce the game has started**
5. **Tell them the range and number of guesses**
6. **IMPORTANT: Remember your secret number throughout the game!**

## HANDLING GUESSES

When the player guesses a number:

1. **Compare to your secret number**

2. **If CORRECT:**
   - Celebrate! 🎉
   - Tell them how many guesses it took
   - Award a title based on guesses used:
     * 1-2 guesses: "🏆 Legendary Mind Reader!"
     * 3-4 guesses: "⭐ Number Wizard!"
     * 5-6 guesses: "🎯 Sharp Guesser!"
     * 7+ guesses: "✨ Persistent Winner!"
   - Ask if they want to play again

3. **If INCORRECT but guesses remain:**
   - Tell them if the secret number is HIGHER ⬆️ or LOWER ⬇️
   - Show remaining guesses
   - Give encouragement
   - If they're very close (within 5), hint "You're getting warm! 🔥"
   - If they're far (more than 50 away), hint "Still quite cold! ❄️"

4. **If INCORRECT and no guesses left:**
   - Say "Game Over! 😔"
   - Reveal the secret number
   - Tell them encouraging stats about their attempts
   - Offer to play again

## STATE TRACKING

You MUST track throughout the game:
- Your secret number (don't reveal it!)
- Remaining guesses
- Guesses made so far
- Current difficulty level

Show this after each guess:
```
📊 Guess #{attempt_number} | Remaining: {guesses_left} | Range: {min}-{max}
```

## GIVING HINTS

If player asks for hint (costs 1 guess):
- Tell them if the number is in the lower or upper half of remaining range
- Deduct from remaining guesses
- Only allow if they have 2+ guesses left

## SPECIAL COMMANDS

Recognize these requests:
- "new game" / "restart" → Start fresh game
- "hint" → Provide hint (costs 1 guess)
- "give up" → Reveal number, offer new game
- "rules" / "how to play" → Explain the game
- "score" / "stats" → Show current game state

## PERSONALITY

- Be enthusiastic but not annoying
- Use emojis sparingly: 🎯 🎉 ⬆️ ⬇️ 🔥 ❄️ 💡
- Celebrate every correct guess
- Be encouraging after wrong guesses
- Add suspense: "Ooh, so close!" or "Interesting choice..."
- Use phrases like:
  * "The number spirits whisper..."
  * "My magical number says..."
  * "Fortune favors the bold!"

## EXAMPLE GAME FLOW

Player: "Let's play!"
You: "🎯 Welcome to Number Quest! I'm your game host. Ready to test your intuition?

Choose your challenge:
• **Easy** (1-50, 10 guesses) - Great for warming up
• **Medium** (1-100, 7 guesses) - The classic challenge
• **Hard** (1-200, 5 guesses) - For true masters

What difficulty would you like?"

Player: "Medium"
You: "Excellent choice! 🎲

I've selected my secret number between 1 and 100. You have 7 guesses to find it.

Let the quest begin! What's your first guess?"

Player: "50"
You: "Hmm, 50... The number spirits say: **Go HIGHER!** ⬆️

📊 Guess #1 | Remaining: 6 | Range: 51-100

Try again, brave guesser!"

## IMPORTANT RULES

1. NEVER reveal your number until the game ends
2. ALWAYS be consistent with your chosen number
3. ALWAYS give higher/lower feedback
4. ALWAYS track guess count accurately
5. NEVER change your number mid-game
6. If unsure what player wants, ask clarifying questions
7. If player sends non-number text during game, gently remind them to guess a number
```

### Step 2.3: Save Instructions

Click **Save**

**CHECKPOINT 2:** Comprehensive game instructions saved.

---

## Part 3: Add Conversation Starters (5 minutes)

### Step 3.1: Configure Starters

1. Go to **Overview** → **Conversation starters**
2. Add these starters:

```
🎯 Start a new game!
📖 How do I play?
🔥 Give me the hardest challenge!
🎮 Quick game (Easy mode)
```

### Step 3.2: Save

Click **Save** if prompted.

**CHECKPOINT 3:** Conversation starters configured.

---

## Part 4: Test the Complete Game (20 minutes)

### Step 4.1: Open Test Panel

Click **Test** (bottom right) to open the test chat.

### Step 4.2: Test Scenario 1 - Complete Easy Game

Play through a full easy game:

```
You: "Let's play a game!"
Expected: Welcome message, asks for difficulty

You: "Easy"
Expected: Confirms 1-50 range, 10 guesses, asks for first guess

You: "25"
Expected: Higher or lower feedback, shows remaining guesses

[Continue guessing until you win or lose]
Expected: Appropriate celebration or game-over message
```

**Verify:**
- [ ] Game starts correctly
- [ ] Higher/lower hints are accurate
- [ ] Guess count decrements properly
- [ ] Win/lose messages display
- [ ] Replay offered at end

### Step 4.3: Test Scenario 2 - Hint Request

```
You: "new game"
You: "medium"
You: "50"
[Note if higher or lower]
You: "hint"
Expected: Provides hint about upper/lower half, deducts a guess
```

**Verify:**
- [ ] Hint is given
- [ ] Guess count reduced
- [ ] Hint is actually helpful

### Step 4.4: Test Scenario 3 - Give Up

```
You: "start over"
You: "hard"
You: "100"
You: "give up"
Expected: Reveals the secret number, offers new game
```

**Verify:**
- [ ] Number is revealed
- [ ] No penalty or shame
- [ ] New game offered

### Step 4.5: Test Scenario 4 - Edge Cases

```
Test: "What's the number?" (trying to cheat)
Expected: Agent refuses to reveal, encourages guessing

Test: "Is it 42?" vs "42" (different formats)
Expected: Both recognized as guesses

Test: "banana" (invalid input during game)
Expected: Asks for a valid number

Test: "rules" (mid-game)
Expected: Explains rules, continues game
```

### Step 4.6: Document Test Results

| Test Case | Input | Expected | Actual | Pass/Fail |
|-----------|-------|----------|--------|-----------|
| Start game | "play" | Asks difficulty | | |
| Select easy | "easy" | 1-50, 10 guesses | | |
| First guess | "25" | Higher/lower hint | | |
| Request hint | "hint" | Hint + -1 guess | | |
| Give up | "give up" | Reveals number | | |
| Invalid input | "apple" | Asks for number | | |
| Win game | [correct] | Celebration | | |
| Lose game | [run out] | Game over | | |

**CHECKPOINT 4:** All test scenarios verified.

---

## Part 5: Refine and Optimize (5 minutes)

### Step 5.1: Identify Improvements

Based on your testing, note any issues:
- Did the agent forget its number?
- Were hints accurate?
- Was personality engaging?
- Were edge cases handled?

### Step 5.2: Adjust Instructions if Needed

Common fixes:
- Add more explicit state tracking instructions
- Clarify number format acceptance
- Strengthen personality guidelines
- Add more edge case handling

### Step 5.3: Retest After Changes

If you made changes, run through tests again.

**CHECKPOINT 5:** Agent refined and optimized.

---

## Exit Criteria

Before completing this lab, verify:

| Criteria | Status |
|----------|--------|
| ✅ Agent starts game correctly | |
| ✅ Difficulty levels work (Easy/Medium/Hard) | |
| ✅ Higher/lower hints are accurate | |
| ✅ Guess count tracks correctly | |
| ✅ Win celebration displays with title | |
| ✅ Game over reveals number | |
| ✅ Hints work (cost 1 guess) | |
| ✅ "Give up" reveals number | |
| ✅ Invalid inputs handled gracefully | |
| ✅ Personality is engaging | |

---

## Troubleshooting

### Agent Forgets the Number
- Strengthen instruction: "ALWAYS remember your secret number"
- Add: "Your number is fixed once chosen. NEVER change it."
- Consider making the game shorter (fewer turns)

### Inconsistent Higher/Lower Hints
- The LLM may occasionally make mistakes
- Add explicit: "If guess < secret, say HIGHER. If guess > secret, say LOWER."
- Test multiple times to verify consistency

### Game Doesn't End Properly
- Ensure clear win/lose conditions in instructions
- Add explicit end-game messages
- Include "offer to play again" in both scenarios

### Personality Too Flat
- Add more example phrases
- Include specific emoji guidance
- Add "suspense building" examples

### Doesn't Recognize Commands
- Add more trigger phrase variations
- Be explicit: "'play', 'start', 'game', 'begin' all mean start new game"

---

## Extension Challenges (Optional)

If you complete early, try these enhancements:

1. **Add a scoring system** - Track wins across multiple games
2. **Create a leaderboard concept** - Best scores for each difficulty
3. **Add themed variations** - "Treasure Hunt" or "Space Explorer" themes
4. **Implement binary search hints** - Teach optimal strategy
5. **Add time pressure** - Mention if taking too long between guesses

---

## Key Concepts Learned

### Instruction Engineering Principles

1. **Be Explicit** - State rules clearly and completely
2. **Provide Examples** - Show exactly what you expect
3. **Handle Edge Cases** - Anticipate user behavior
4. **Define Personality** - Give character guidelines
5. **Track State** - Explain what to remember
6. **Structure Responses** - Use formatting templates

### When to Use Instructions vs Topics

| Use Instructions | Use Topics |
|------------------|------------|
| Open-ended conversations | Structured data collection |
| Games and creative interactions | Form filling |
| Dynamic, context-dependent responses | Integration with external systems |
| Personality-driven experiences | Strict workflow requirements |
| Exploration and discovery | Validation and conditions |

---

## Summary

In this lab, you learned:
- How to create complex experiences using only instructions
- Instruction engineering techniques for games
- State management through conversation context
- Personality design for engaging agents
- Edge case handling through clear guidelines

This lab demonstrates that **well-crafted instructions** can create sophisticated, engaging experiences without any code or complex topic flows.

---

## Next Steps

On Day 2, you'll continue with:
- **Lab 3**: Multi-Step Workflow Agent (Topics + Power Automate)
- **Lab 4**: Custom API Integration
- **Lab 5**: Knowledge-Powered Agent

---

*Lab 2: Number Guessing Game | DW-104 Day 1 | January 2026*

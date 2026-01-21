# Lab 1: Customer Service Agent
## Copilot Studio Topics & Entities

**Duration:** 60 minutes
**Difficulty:** Beginner
**Environment:** Copilot Studio Trial

---

## Overview

In this lab, you'll build a customer service agent for Contoso Repair Service using Copilot Studio's Topics and Entities features. This lab demonstrates declarative agent concepts using a visual, low-code approach.

### What You'll Build

A repair service assistant that can:
- Check repair status using ticket IDs
- Provide cost estimates for different repairs
- Handle user questions with structured conversation flows
- Gracefully manage unknown requests

### Learning Objectives

By completing this lab, you will:
1. Understand declarative agent concepts
2. Create and configure Topics with trigger phrases
3. Use Entities for data extraction
4. Build conversation flows with conditions and branching
5. Test agents in Copilot Studio

---

## Prerequisites

- [ ] Copilot Studio Trial account (https://copilotstudio.microsoft.com)
- [ ] Modern web browser (Edge or Chrome recommended)
- [ ] Completed Module 1 presentation

---

## Part 1: Create the Agent (10 minutes)

### Step 1.1: Access Copilot Studio

1. Open your browser and navigate to: **https://copilotstudio.microsoft.com**
2. Sign in with your Microsoft account
3. If prompted, select your environment (use the default or trial environment)

### Step 1.2: Create New Agent

1. Click **+ Create** in the left navigation
2. Select **New agent**
3. Configure the agent:

| Field | Value |
|-------|-------|
| Name | `Contoso Repair Service` |
| Description | `AI assistant for device repair services - handles status checks, cost estimates, and appointment scheduling` |
| Language | English |
| Icon | Choose a tools/repair icon (optional) |

4. Click **Create**

### Step 1.3: Verify Creation

You should now see the agent overview page with:
- Agent name and description
- Topics section
- Test panel on the right

**CHECKPOINT 1:** Agent created successfully and overview page is visible.

---

## Part 2: Configure Agent Instructions (10 minutes)

### Step 2.1: Access Instructions

1. In your agent, click **Overview** in the left menu
2. Scroll down to find **Details** or **Instructions** section
3. Click **Edit** to modify the instructions

### Step 2.2: Add Comprehensive Instructions

Copy and paste the following instructions:

```markdown
You are the Contoso Repair Service assistant. Help customers with device repair inquiries.

## Your Capabilities

1. **Check Repair Status** - Look up status using ticket ID (format: REP-XXX)
2. **Cost Estimates** - Provide repair cost estimates by device and issue type
3. **General Questions** - Answer questions about our services

## Repair Status Database

Use this data to answer status inquiries:

| Ticket ID | Device | Issue | Status | Est. Cost | Customer |
|-----------|--------|-------|--------|-----------|----------|
| REP-001 | Laptop | Screen repair | In Progress | $150 | John |
| REP-002 | Phone | Battery replacement | Ready for Pickup | $49 | Sarah |
| REP-003 | Tablet | Charging port | Diagnosing | TBD | Mike |
| REP-004 | Laptop | Keyboard replacement | Completed | $125 | Lisa |
| REP-005 | Phone | Screen repair | Waiting for Parts | $89 | David |

## Cost Estimates Reference

| Device | Issue | Cost Range | Typical Time |
|--------|-------|------------|--------------|
| Laptop | Screen | $150-250 | 2-3 days |
| Laptop | Battery | $80-120 | 1 day |
| Laptop | Keyboard | $100-150 | 1-2 days |
| Phone | Screen | $80-150 | 1-2 hours |
| Phone | Battery | $40-70 | 1 hour |
| Tablet | Screen | $120-200 | 1 day |
| Tablet | Charging port | $60-90 | 2-3 hours |

## Response Guidelines

- Be professional and helpful
- Confirm details before providing information
- If ticket not found, offer to create a new request
- Always end with "Is there anything else I can help with?"
- Use emojis sparingly for status: 🔧 In Progress, ✅ Ready, ⏳ Waiting
```

3. Click **Save**

**CHECKPOINT 2:** Instructions saved successfully.

---

## Part 3: Create Check Status Topic (15 minutes)

### Step 3.1: Create New Topic

1. Click **Topics** in the left navigation
2. Click **+ Add topic** → **From blank**
3. Name the topic: `Check Repair Status`

### Step 3.2: Add Trigger Phrases

In the **Trigger phrases** section, add these phrases (press Enter after each):

```
Check my repair status
What's the status of my repair
Track my repair
Repair status for REP
Where is my repair
How's my repair going
Status update
Track order
```

### Step 3.3: Build the Conversation Flow

**Node 1: Ask for Ticket ID**

1. Click the **+** under the trigger to add a node
2. Select **Ask a question**
3. Configure:
   - **Ask**: `Please provide your repair ticket ID (format: REP-XXX)`
   - **Identify**: Select "User's entire response" or create a custom entity
   - **Save response as**: Create variable named `TicketID`

**Node 2: Add Condition**

1. Click **+** to add another node
2. Select **Add a condition**
3. Configure conditions for each known ticket:

**Condition Branch 1:**
- Variable: `TicketID`
- Operator: contains
- Value: `REP-001`

**Condition Branch 2:**
- Variable: `TicketID`
- Operator: contains
- Value: `REP-002`

**Condition Branch 3:**
- Variable: `TicketID`
- Operator: contains
- Value: `REP-003`

**Default Branch:** All other conditions

### Step 3.4: Add Response Messages

**For REP-001 branch, add Message node:**

```
📋 **Repair Status: REP-001**

| Detail | Information |
|--------|-------------|
| Device | Laptop |
| Issue | Screen repair |
| Status | 🔧 In Progress |
| Est. Cost | $150 |
| Est. Completion | 2 days |

Your laptop screen repair is currently being worked on by our technicians. We'll notify you when it's ready for pickup.

Is there anything else I can help with?
```

**For REP-002 branch:**

```
📋 **Repair Status: REP-002**

| Detail | Information |
|--------|-------------|
| Device | Phone |
| Issue | Battery replacement |
| Status | ✅ Ready for Pickup |
| Final Cost | $49 |

Great news! Your phone is ready for pickup. Our store hours are Monday-Saturday, 9 AM - 6 PM.

Please bring your receipt or ID when picking up.

Is there anything else I can help with?
```

**For REP-003 branch:**

```
📋 **Repair Status: REP-003**

| Detail | Information |
|--------|-------------|
| Device | Tablet |
| Issue | Charging port repair |
| Status | ⏳ Diagnosing |
| Est. Cost | TBD |

Your tablet is currently being diagnosed by our technicians. We'll contact you with a cost estimate within 24 hours.

Is there anything else I can help with?
```

**For Default (Not Found) branch:**

```
I couldn't find a repair ticket with ID "{TicketID}".

This could mean:
• The ticket ID may be incorrect
• The repair was completed and archived
• The ticket hasn't been created yet

Would you like me to help you:
1. Double-check your ticket ID
2. Create a new repair request
3. Speak with a customer service representative

How would you like to proceed?
```

### Step 3.5: Save the Topic

1. Click **Save** in the top right corner

**CHECKPOINT 3:** Check Status topic created with all branches.

---

## Part 4: Create Cost Estimate Topic (10 minutes)

### Step 4.1: Create New Topic

1. Click **Topics** → **+ Add topic** → **From blank**
2. Name: `Get Cost Estimate`

### Step 4.2: Add Trigger Phrases

```
How much to fix
Cost estimate
Repair price
What does it cost
Price for repair
How much for repair
Estimate for
```

### Step 4.3: Build Multi-Question Flow

**Node 1: Ask Device Type**

1. Add **Ask a question** node
2. Configure:
   - **Ask**: `What type of device needs repair?`
   - **Options**:
     - Laptop
     - Phone
     - Tablet
     - Other
   - **Save as**: `DeviceType`

**Node 2: Ask Issue Type**

1. Add another **Ask a question** node
2. Configure:
   - **Ask**: `What issue are you experiencing with your {DeviceType}?`
   - **Options**:
     - Screen damage
     - Battery issues
     - Charging problems
     - Keyboard/input issues
     - Other
   - **Save as**: `IssueType`

**Node 3: Provide Estimate**

1. Add **Send a message** node
2. Use this template (the AI will adapt based on variables):

```
💰 **Cost Estimate for {DeviceType} - {IssueType}**

Based on your {DeviceType} with {IssueType}:

| Detail | Estimate |
|--------|----------|
| Estimated Cost | $80 - $150 |
| Estimated Time | 1-2 days |
| Warranty | 90 days on parts & labor |

*Note: Final cost will be confirmed after diagnosis.*

Would you like to:
• Schedule a repair appointment
• Get more details about our repair process
• Ask another question

How can I help you further?
```

### Step 4.4: Save the Topic

Click **Save**

**CHECKPOINT 4:** Cost Estimate topic created with device and issue selection.

---

## Part 5: Configure Conversation Starters (5 minutes)

### Step 5.1: Add Starters

1. Go to **Overview** in the left menu
2. Find **Conversation starters** section
3. Add these starters:

```
Check my repair status
Get a repair cost estimate
Schedule a repair appointment
What services do you offer?
```

### Step 5.2: Save Changes

Click **Save** if prompted.

**CHECKPOINT 5:** Conversation starters appear in test panel.

---

## Part 6: Test Your Agent (10 minutes)

### Step 6.1: Open Test Panel

Click **Test** button (bottom right) to open the test chat panel.

### Step 6.2: Run Test Scenarios

**Test 1: Valid Status Check**
```
You: "Check status for REP-001"
Expected: Shows laptop screen repair in progress with $150 estimate
```

**Test 2: Another Valid Status**
```
You: "What's the status of REP-002?"
Expected: Shows phone battery ready for pickup at $49
```

**Test 3: Invalid Ticket**
```
You: "Track repair REP-999"
Expected: Not found message with options to help
```

**Test 4: Cost Estimate Flow**
```
You: "How much to fix my phone screen?"
Expected: Asks for device confirmation, then issue confirmation, then shows estimate
```

**Test 5: General Question**
```
You: "What services do you offer?"
Expected: Lists repair capabilities (may use instructions for response)
```

**Test 6: Conversation Starter**
```
Click "Check my repair status" starter
Expected: Triggers status check topic, asks for ticket ID
```

### Step 6.3: Document Results

| Test | Input | Result | Pass/Fail |
|------|-------|--------|-----------|
| Valid Status | REP-001 | | |
| Valid Status | REP-002 | | |
| Invalid Ticket | REP-999 | | |
| Cost Estimate | Phone screen | | |
| General Query | Services | | |
| Starter | Click starter | | |

**CHECKPOINT 6:** All tests pass successfully.

---

## Exit Criteria

Before completing this lab, verify:

| Criteria | Status |
|----------|--------|
| ✅ Agent created in Copilot Studio | |
| ✅ Comprehensive instructions configured | |
| ✅ Check Status topic works for REP-001, REP-002, REP-003 | |
| ✅ Check Status handles unknown tickets gracefully | |
| ✅ Cost Estimate topic collects device and issue type | |
| ✅ Cost Estimate provides appropriate estimates | |
| ✅ Conversation starters visible and functional | |
| ✅ Agent maintains professional, helpful tone | |

---

## Troubleshooting

### Topic Not Triggering
- Verify trigger phrases are saved
- Check for typos in trigger phrases
- Ensure topic is not disabled
- Try more exact phrases

### Variables Not Working
- Confirm variable names match exactly (case-sensitive)
- Check that "Save response as" is configured
- Verify variable is created before being used

### Condition Not Matching
- Use "contains" instead of "equals" for partial matches
- Check for extra spaces in values
- Test with exact ticket ID format

### Agent Not Responding
- Check that all nodes are connected
- Verify no infinite loops in flow
- Ensure all branches have end messages

---

## Extension Challenges (Optional)

If you complete early, try these enhancements:

1. **Add REP-004 and REP-005** to the status check topic
2. **Create an entity** for ticket ID format (REP-XXX pattern)
3. **Add a Schedule Appointment topic** that collects preferred date/time
4. **Improve error handling** with more specific guidance
5. **Add follow-up questions** after providing status

---

## Summary

In this lab, you learned:
- How to create agents in Copilot Studio
- The role of Instructions in guiding agent behavior
- How to build Topics with trigger phrases
- Using conditions to branch conversation flows
- Testing agents in the Copilot Studio test panel

These skills form the foundation for building more complex agents in later labs.

---

## Next Steps

Proceed to **Lab 2: Interactive Game Agent** to learn about instruction-only agent design and complex state management.

---

*Lab 1: Customer Service Agent | DW-104 Day 1 | January 2026*

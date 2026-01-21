# Lab 3: Job Application Bot
## Multi-Step Workflows with Topics

**Duration:** 60 minutes
**Difficulty:** Intermediate
**Environment:** Copilot Studio Trial

---

## Overview

In this lab, you'll build a job application assistant that guides candidates through a multi-step application process. This demonstrates how to orchestrate complex workflows using Topics, variables, and conditional logic.

### What You'll Build

A recruitment assistant that can:
- Display available job positions
- Collect candidate information across multiple steps
- Validate inputs and handle errors
- Summarize applications before submission
- Confirm successful submissions

### Learning Objectives

By completing this lab, you will:
1. Design multi-step conversation workflows
2. Pass variables between conversation nodes
3. Implement data validation with conditions
4. Create confirmation and summary flows
5. Handle conversation restarts and cancellations

---

## Prerequisites

- [ ] Completed Lab 1 and Lab 2
- [ ] Copilot Studio Trial access
- [ ] Understanding of Topics and Variables

---

## Part 1: Create the Agent (5 minutes)

### Step 1.1: Create New Agent

1. Go to **Copilot Studio** → **+ Create** → **New agent**
2. Configure:

| Field | Value |
|-------|-------|
| Name | `Contoso Careers` |
| Description | `Job application assistant for Contoso Corporation` |
| Language | English |

3. Click **Create**

### Step 1.2: Set Up Instructions

Go to **Overview** → **Details** and add these instructions:

```markdown
You are the Contoso Careers recruitment assistant.

## Your Role
Help candidates explore job opportunities and guide them through the application process.

## Available Positions

| Job ID | Title | Department | Location | Type |
|--------|-------|------------|----------|------|
| JOB-101 | Senior Software Engineer | Engineering | Seattle, WA | Full-time |
| JOB-102 | Product Manager | Product | Remote | Full-time |
| JOB-103 | UX Designer | Design | New York, NY | Full-time |
| JOB-104 | Data Analyst | Analytics | Austin, TX | Full-time |
| JOB-105 | Marketing Coordinator | Marketing | Chicago, IL | Full-time |

## Guidelines
- Be professional and welcoming
- Guide candidates step by step
- Confirm information before proceeding
- Provide clear next steps
- If candidate seems unsure, offer to explain the role
```

**CHECKPOINT 1:** Agent created with instructions.

---

## Part 2: Create Job Listing Topic (10 minutes)

### Step 2.1: Create Topic

1. Go to **Topics** → **+ Add topic** → **From blank**
2. Name: `View Open Positions`

### Step 2.2: Add Trigger Phrases

```
Show me open jobs
What positions are available
Job openings
Career opportunities
I'm looking for a job
Available positions
Current openings
```

### Step 2.3: Build the Flow

**Node 1: Display Jobs Message**

Add a **Send a message** node:

```
👋 Welcome to Contoso Careers! Here are our current openings:

**🔧 Engineering**
• **JOB-101: Senior Software Engineer** - Seattle, WA
  5+ years experience, full-stack development

**📦 Product**
• **JOB-102: Product Manager** - Remote
  3+ years PM experience, technical background preferred

**🎨 Design**
• **JOB-103: UX Designer** - New York, NY
  Portfolio required, Figma expertise

**📊 Analytics**
• **JOB-104: Data Analyst** - Austin, TX
  SQL, Python, data visualization skills

**📣 Marketing**
• **JOB-105: Marketing Coordinator** - Chicago, IL
  2+ years marketing experience

Would you like to:
• Learn more about a specific position
• Start an application
• Ask about our company culture
```

**Node 2: Question - Next Action**

Add **Ask a question** node:
- **Ask**: `What would you like to do?`
- **Options**:
  - Learn more about a position
  - Start an application
  - Ask a general question
- **Save as**: `NextAction`

**Node 3: Condition - Route Based on Choice**

Add **Condition** node:
- If `NextAction` equals "Start an application" → Go to redirect to Apply Topic
- If `NextAction` equals "Learn more about a position" → Go to Job Details flow
- Else → Use generative answers

**Node 4: Redirect to Apply**

Add **Redirect to another topic** node:
- Select: `Apply for Position` (you'll create this next)

### Step 2.4: Save Topic

Click **Save**

**CHECKPOINT 2:** Job listing topic created.

---

## Part 3: Create Application Topic (25 minutes)

This is the main multi-step workflow.

### Step 3.1: Create Topic

1. Go to **Topics** → **+ Add topic** → **From blank**
2. Name: `Apply for Position`

### Step 3.2: Add Trigger Phrases

```
Apply for a job
I want to apply
Submit application
Start application
Apply for JOB
I'd like to apply
```

### Step 3.3: Build Multi-Step Flow

#### Step 1: Select Position

**Question Node - Job Selection:**
- **Ask**: `Which position would you like to apply for?`
- **Options**:
  - JOB-101: Senior Software Engineer
  - JOB-102: Product Manager
  - JOB-103: UX Designer
  - JOB-104: Data Analyst
  - JOB-105: Marketing Coordinator
- **Save as**: `SelectedJob`

**Message Node - Confirmation:**
```
Great choice! Let's start your application for **{SelectedJob}**.

I'll need to collect some information. This takes about 3-5 minutes.

You can type "cancel" at any time to stop.

Let's begin! 📝
```

#### Step 2: Personal Information

**Question Node - Full Name:**
- **Ask**: `What is your full name?`
- **Identify**: Person name (if available) or User's entire response
- **Save as**: `CandidateName`

**Question Node - Email:**
- **Ask**: `What is your email address?`
- **Identify**: Email
- **Save as**: `CandidateEmail`

**Question Node - Phone:**
- **Ask**: `What is your phone number?`
- **Identify**: Phone number
- **Save as**: `CandidatePhone`

#### Step 3: Professional Background

**Question Node - Years of Experience:**
- **Ask**: `How many years of relevant work experience do you have?`
- **Options**:
  - 0-2 years
  - 3-5 years
  - 6-10 years
  - 10+ years
- **Save as**: `YearsExperience`

**Question Node - Current Role:**
- **Ask**: `What is your current job title? (Or most recent if not employed)`
- **Save as**: `CurrentRole`

**Question Node - Education:**
- **Ask**: `What is your highest level of education?`
- **Options**:
  - High School
  - Associate's Degree
  - Bachelor's Degree
  - Master's Degree
  - Doctorate
  - Other
- **Save as**: `Education`

#### Step 4: Additional Questions

**Question Node - Work Authorization:**
- **Ask**: `Are you authorized to work in the United States?`
- **Options**:
  - Yes
  - No
  - Need sponsorship
- **Save as**: `WorkAuth`

**Question Node - Start Date:**
- **Ask**: `When would you be available to start?`
- **Options**:
  - Immediately
  - 2 weeks notice
  - 1 month notice
  - Other (please specify)
- **Save as**: `StartDate`

**Question Node - How Did You Hear:**
- **Ask**: `How did you hear about this position?`
- **Options**:
  - LinkedIn
  - Company website
  - Employee referral
  - Job board
  - Other
- **Save as**: `ReferralSource`

#### Step 5: Application Summary

**Message Node - Summary:**

```
📋 **Application Summary**

**Position:** {SelectedJob}

**Personal Information:**
• Name: {CandidateName}
• Email: {CandidateEmail}
• Phone: {CandidatePhone}

**Professional Background:**
• Experience: {YearsExperience}
• Current Role: {CurrentRole}
• Education: {Education}

**Additional Details:**
• Work Authorization: {WorkAuth}
• Available Start: {StartDate}
• Referral Source: {ReferralSource}

---

Please review your information above.
```

**Question Node - Confirm Submission:**
- **Ask**: `Is all the information correct? Ready to submit?`
- **Options**:
  - Yes, submit my application
  - No, I need to make changes
  - Cancel application
- **Save as**: `ConfirmSubmit`

#### Step 6: Conditional Handling

**Condition Node:**
- If `ConfirmSubmit` equals "Yes, submit my application" → Submit flow
- If `ConfirmSubmit` equals "No, I need to make changes" → Edit flow
- If `ConfirmSubmit` equals "Cancel application" → Cancel flow

#### Step 7: Submit Flow

**Message Node - Success:**

```
🎉 **Application Submitted Successfully!**

Thank you, {CandidateName}!

**What happens next:**
1. ✉️ You'll receive a confirmation email at {CandidateEmail}
2. 📞 Our recruiting team will review your application within 5-7 business days
3. 📅 If selected, you'll be contacted to schedule an interview

**Your Reference Number:** APP-{System.DateAndTime}-001

Good luck with your application! 🍀

Is there anything else I can help you with?
```

#### Step 8: Edit Flow

**Message Node - Edit Options:**

```
No problem! What would you like to change?

Unfortunately, I can't edit individual fields right now. You'll need to restart the application.

Would you like to start over?
```

**Question Node:**
- Options: Yes, restart | No, submit as is
- Route accordingly

#### Step 9: Cancel Flow

**Message Node - Cancel Confirmation:**

```
I've cancelled your application. No information has been saved.

If you change your mind, just say "apply" to start again.

Is there anything else I can help you with today?
```

### Step 3.4: Save Topic

Click **Save**

**CHECKPOINT 3:** Complete application workflow created.

---

## Part 4: Add Conversation Starters (5 minutes)

### Step 4.1: Configure Starters

Go to **Overview** → **Conversation starters** and add:

```
🔍 View open positions
📝 Start a job application
❓ Ask about Contoso
📞 Contact recruiting team
```

### Step 4.2: Save

**CHECKPOINT 4:** Conversation starters configured.

---

## Part 5: Test the Complete Workflow (15 minutes)

### Step 5.1: Open Test Panel

Click **Test** (bottom right)

### Step 5.2: Test Complete Application Flow

**Test 1: Full Application Submission**

```
1. Click "View open positions" starter
2. Select "Start an application"
3. Choose "JOB-101: Senior Software Engineer"
4. Enter: "John Smith"
5. Enter: "john.smith@email.com"
6. Enter: "555-123-4567"
7. Select: "6-10 years"
8. Enter: "Tech Lead"
9. Select: "Master's Degree"
10. Select: "Yes"
11. Select: "2 weeks notice"
12. Select: "LinkedIn"
13. Review summary
14. Select: "Yes, submit my application"
```

**Expected Results:**
- [ ] Each step collects data correctly
- [ ] Variables display in summary
- [ ] Success message shows with reference number
- [ ] Offers further assistance

### Step 5.3: Test Cancel Flow

```
1. Say "I want to apply"
2. Select a position
3. Enter name
4. Type "cancel"
```

**Expected:** Application cancelled gracefully (if cancel handling is implemented in conditions)

### Step 5.4: Test Edit Flow

Complete most of the application, then choose "No, I need to make changes" at confirmation.

**Expected:** Offers to restart or submit as-is

### Step 5.5: Document Results

| Step | Action | Expected | Result | Pass/Fail |
|------|--------|----------|--------|-----------|
| 1 | View jobs | Shows 5 positions | | |
| 2 | Start apply | Asks for position | | |
| 3 | Enter name | Saves to variable | | |
| 4 | Enter email | Validates email | | |
| 5 | Summary | Shows all data | | |
| 6 | Submit | Success message | | |
| 7 | Cancel | Cancels cleanly | | |

**CHECKPOINT 5:** All test scenarios pass.

---

## Exit Criteria

Before completing this lab, verify:

| Criteria | Status |
|----------|--------|
| ✅ Job listing displays correctly | |
| ✅ Application collects all required fields | |
| ✅ Variables pass through entire workflow | |
| ✅ Summary shows all collected data | |
| ✅ Submit confirmation works | |
| ✅ Cancel option works | |
| ✅ Edit/restart option available | |
| ✅ Reference number generated | |

---

## Troubleshooting

### Variables Not Showing in Summary
- Verify variable names match exactly (case-sensitive)
- Check that variables are created in correct nodes
- Ensure no typos in {VariableName} references

### Flow Skips Questions
- Check that each question has "Save response as" configured
- Verify no conditions accidentally skip nodes

### Conversation Ends Unexpectedly
- Ensure all branches have ending nodes
- Check for disconnected nodes in flow
- Verify topic doesn't loop infinitely

### Options Not Displaying
- Check that options are properly formatted
- Verify option text isn't too long

---

## Extension Challenges (Optional)

1. **Add validation** - Check if email format is valid
2. **Add resume upload prompt** - Ask about resume submission
3. **Create Job Details topic** - Provide detailed info for each role
4. **Add salary expectations** - Collect compensation preferences
5. **Implement Power Automate** - Send actual email confirmation (if available)

---

## Key Concepts Learned

### Multi-Step Workflow Design

1. **Plan before building** - Map out all steps and data needed
2. **Use clear variable names** - Makes debugging easier
3. **Confirm before submitting** - Always review collected data
4. **Handle all paths** - Submit, edit, cancel should all work
5. **Provide feedback** - Acknowledge each completed step

### Variable Best Practices

| Practice | Example |
|----------|---------|
| Clear names | `CandidateName` not `var1` |
| Consistent casing | PascalCase throughout |
| Descriptive | `YearsExperience` not `Years` |
| Scoped correctly | Topic vs Global |

---

## Summary

In this lab, you learned:
- Designing multi-step conversation workflows
- Collecting and validating user inputs
- Using variables throughout a conversation
- Creating summary confirmations
- Handling different user paths (submit/edit/cancel)

These patterns apply to many real-world scenarios: onboarding flows, service requests, booking systems, and more.

---

## Next Steps

Continue to **Lab 4: Custom API Integration** to learn about connecting agents to external systems.

---

*Lab 3: Job Application Bot | DW-104 Day 2 | January 2026*

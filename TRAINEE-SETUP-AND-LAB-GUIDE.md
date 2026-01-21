# Trainee Setup & Lab Execution Guide
## DW-104: Microsoft 365 Agents Pro-Code Training

Welcome to the Microsoft 365 Agents Pro-Code Training! This guide will walk you through everything you need to set up your environment and successfully complete all five hands-on labs.

---

## Table of Contents

1. [Pre-Training Setup](#pre-training-setup)
2. [Lab 1: Customer Service Agent](#lab-1-customer-service-agent)
3. [Lab 2: Interactive Game Agent](#lab-2-interactive-game-agent)
4. [Lab 3: Multi-Step Workflow Agent](#lab-3-multi-step-workflow-agent)
5. [Lab 4: Custom API Connector](#lab-4-custom-api-connector)
6. [Lab 5: Knowledge-Powered Agent](#lab-5-knowledge-powered-agent)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Training Setup

### Required Accounts

#### 1. Microsoft Account
You need a Microsoft account to access Copilot Studio.

**If you don't have one:**
1. Go to https://account.microsoft.com
2. Click "Create a Microsoft account"
3. Follow the prompts to create your account

#### 2. Copilot Studio Trial
1. Go to https://copilotstudio.microsoft.com
2. Sign in with your Microsoft account
3. If prompted, start a free trial
4. Select or create an environment

**Verify Access:**
- You should see the Copilot Studio home page
- You should be able to click "Create" to start a new agent

#### 3. Replit Account (For Lab 4)
1. Go to https://replit.com
2. Click "Sign up"
3. Sign up with Google, GitHub, or email
4. Free tier is sufficient

#### 4. VS Code (Optional - For Demo)
1. Download from https://code.visualstudio.com
2. Install the M365 Agents Toolkit extension
   - Extensions → Search "M365 Agents Toolkit"
   - Install

### Pre-Training Checklist
- [ ] Microsoft account created/verified
- [ ] Can access https://copilotstudio.microsoft.com
- [ ] Can create a new agent (test then delete)
- [ ] Replit account created
- [ ] VS Code installed (optional)

---

## Lab 1: Customer Service Agent
**Duration:** 60 minutes
**Difficulty:** Beginner

### Learning Objectives
- Create an agent in Copilot Studio
- Design conversation Topics
- Use Entities to capture structured data
- Test agent responses

### Step-by-Step Instructions

#### Step 1: Create New Agent (5 min)
1. Go to https://copilotstudio.microsoft.com
2. Click **"Create"** → **"New agent"**
3. Configure:
   - **Name:** `Contoso Customer Service`
   - **Description:** `Helps customers with product inquiries and order status`
   - Click **"Create"**

#### Step 2: Add Instructions (5 min)
1. Click on your agent to open it
2. Go to **"Overview"**
3. In the **Instructions** section, add:

```
You are a helpful customer service agent for Contoso Electronics.

## Your Role
- Answer questions about our products
- Help customers check order status
- Provide accurate pricing and availability information

## Products You Know About
- ProBook Elite 15 laptop: $1,299.99 - Business laptop with 14-hour battery
- CreatorStudio 16 laptop: $2,199.99 - Creative workstation with RTX graphics
- Galaxy Pro Max phone: $1,099.99 - Flagship smartphone with AI camera
- SoundMax Pro headphones: $349.99 - Premium noise-canceling headphones

## Rules
- Always be professional and helpful
- If you don't know something, say so honestly
- Never make up product information
- For order status, ask for the order number first
```

4. Click **"Save"**

#### Step 3: Create ProductInquiry Topic (15 min)
1. Go to **"Topics"** in the left menu
2. Click **"+ Add a topic"** → **"From blank"**
3. Name it: `ProductInquiry`
4. Add trigger phrases:
   - "What products do you have?"
   - "Tell me about your laptops"
   - "What's your best laptop?"
   - "Show me headphones"
   - "What phones do you sell?"

5. Add a **Message** node:
```
I'd be happy to help you find the perfect product! Here are our main categories:

📱 **Smartphones**
- Galaxy Pro Max - $1,099.99

💻 **Laptops**
- ProBook Elite 15 - $1,299.99 (Business)
- CreatorStudio 16 - $2,199.99 (Creative)

🎧 **Audio**
- SoundMax Pro Headphones - $349.99

What category interests you?
```

6. Click **"Save"**

#### Step 4: Create OrderStatus Topic (15 min)
1. Click **"+ Add a topic"** → **"From blank"**
2. Name it: `OrderStatus`
3. Add trigger phrases:
   - "Where is my order?"
   - "Check order status"
   - "Track my order"
   - "Order tracking"

4. Add a **Question** node:
   - **Prompt:** "I'd be happy to help you track your order! Please provide your order number (e.g., ORD-12345):"
   - **Identify:** Text
   - **Save response as:** `OrderNumber`

5. Add a **Condition** node:
   - **If** `OrderNumber` contains "ORD"
   - **Then** → Add Message:
   ```
   📦 Order {OrderNumber} Status:

   ✅ Order Confirmed
   ✅ Payment Processed
   ✅ Shipped
   🚚 Out for Delivery

   Estimated delivery: Tomorrow by 5 PM

   Is there anything else I can help you with?
   ```
   - **Else** → Add Message:
   ```
   I couldn't find that order number. Order numbers start with "ORD-" followed by 5 digits (e.g., ORD-12345). Please check and try again.
   ```

6. Click **"Save"**

#### Step 5: Create Fallback Topic (10 min)
1. Go to **"Topics"** → Find **"Fallback"** (system topic)
2. Click to edit
3. Modify the message to:
```
I'm sorry, I didn't quite understand that. I can help you with:

• **Product information** - Ask about our laptops, phones, or headphones
• **Order tracking** - Provide your order number to check status
• **Pricing** - Ask about any product's price

How can I assist you today?
```
4. Click **"Save"**

#### Step 6: Test Your Agent (10 min)
1. Click **"Test"** button (bottom-left or top-right)
2. Try these conversations:

**Test 1 - Product Inquiry:**
```
You: What laptops do you have?
Agent: [Should show laptop options with prices]
```

**Test 2 - Order Status:**
```
You: Track my order
Agent: [Should ask for order number]
You: ORD-12345
Agent: [Should show order status]
```

**Test 3 - Invalid Order:**
```
You: Check order ABC123
Agent: [Should say couldn't find and ask for correct format]
```

**Test 4 - Unknown Query:**
```
You: What's the weather?
Agent: [Should show fallback with available options]
```

### Exit Criteria Checklist
- [ ] Agent named "Contoso Customer Service"
- [ ] ProductInquiry topic responds with product list
- [ ] OrderStatus topic asks for order number
- [ ] Valid order numbers show status
- [ ] Invalid formats get helpful error message
- [ ] Fallback topic guides users to available features

---

## Lab 2: Interactive Game Agent
**Duration:** 60 minutes
**Difficulty:** Beginner-Intermediate

### Learning Objectives
- Master instruction engineering (prompt design)
- Create state management through instructions
- Build engaging conversational experiences

### Step-by-Step Instructions

#### Step 1: Create New Agent (5 min)
1. In Copilot Studio, click **"Create"** → **"New agent"**
2. Configure:
   - **Name:** `Number Guessing Game`
   - **Description:** `A fun number guessing game - can you find the secret number?`
   - Click **"Create"**

#### Step 2: Add Game Instructions (20 min)
1. Go to **"Overview"**
2. In **Instructions**, add:

```
You are a fun and engaging Number Guessing Game host!

## Game Rules
1. When a user wants to play, think of a secret number between 1 and 100
2. The user tries to guess the number
3. After each guess, tell them if the secret number is HIGHER or LOWER
4. Count their guesses and celebrate when they win!

## How to Play

### Starting the Game
When someone wants to play:
1. Welcome them enthusiastically
2. Explain the rules briefly
3. Tell them you're thinking of a number between 1 and 100
4. Ask for their first guess

Example start:
"🎮 Welcome to the Number Guessing Game!

I'm thinking of a number between 1 and 100. Can you guess what it is?

You'll get hints after each guess - I'll tell you if my number is HIGHER or LOWER than your guess.

What's your first guess?"

### During the Game
For each guess:
1. Compare their guess to your secret number
2. If too low: "📈 My number is HIGHER than [guess]. Try again!"
3. If too high: "📉 My number is LOWER than [guess]. Try again!"
4. Keep track of how many guesses they've made

### Winning
When they guess correctly:
1. Celebrate with emojis! 🎉🏆
2. Tell them how many guesses it took
3. Rate their performance:
   - 1-5 guesses: "AMAZING! You're a mind reader!"
   - 6-10 guesses: "Great job! Very impressive!"
   - 11-15 guesses: "Well done! Solid guessing!"
   - 16+ guesses: "You got it! Never give up!"
4. Ask if they want to play again

## Important Rules
- ALWAYS keep the same secret number throughout one game
- NEVER reveal the number until they guess it
- ALWAYS be encouraging and fun
- Use emojis to make it engaging
- If they want to give up, reveal the number and offer a new game

## Non-Game Queries
If someone asks about something other than the game, politely redirect:
"I'm your Number Guessing Game host! I'd love to play a game with you. Just say 'play' or 'start game' to begin! 🎮"
```

3. Click **"Save"**

#### Step 3: Test Basic Gameplay (15 min)
1. Click **"Test"**
2. Play a complete game:

```
You: Let's play!
Agent: [Should welcome and explain rules, ask for first guess]

You: 50
Agent: [Should say HIGHER or LOWER]

You: 75
Agent: [Should continue with hints]

[Continue until you guess correctly]

Agent: [Should celebrate and tell you how many guesses]
```

#### Step 4: Test Edge Cases (10 min)

**Test - Invalid Input:**
```
You: banana
Agent: [Should ask for a number between 1-100]
```

**Test - Out of Range:**
```
You: 150
Agent: [Should remind about 1-100 range]
```

**Test - Giving Up:**
```
You: I give up
Agent: [Should reveal number and offer new game]
```

**Test - Non-Game Query:**
```
You: What's the capital of France?
Agent: [Should redirect to the game]
```

#### Step 5: Play Multiple Games (10 min)
1. Complete one full game
2. Say "Play again"
3. Verify a NEW secret number is chosen
4. Complete another game

### Exit Criteria Checklist
- [ ] Agent explains rules at game start
- [ ] Agent picks a secret number (1-100)
- [ ] HIGHER/LOWER hints work correctly
- [ ] Agent counts guesses accurately
- [ ] Win celebration includes guess count
- [ ] Performance rating matches guess count
- [ ] "Play again" starts a new game with new number
- [ ] Invalid inputs are handled gracefully

---

## Lab 3: Multi-Step Workflow Agent
**Duration:** 75 minutes
**Difficulty:** Intermediate

### Learning Objectives
- Design multi-step conversation flows
- Use variables for state management
- Create conditional branching
- Integrate with Power Automate (optional)

### Step-by-Step Instructions

#### Step 1: Create New Agent (5 min)
1. Click **"Create"** → **"New agent"**
2. Configure:
   - **Name:** `Contoso IT Helpdesk`
   - **Description:** `IT support agent for password resets, software requests, and hardware issues`
   - Click **"Create"**

#### Step 2: Add IT Helpdesk Instructions (10 min)
1. Go to **"Overview"**
2. Add Instructions:

```
You are the Contoso IT Helpdesk assistant.

## Your Capabilities
1. **Password Resets** - Help employees reset their passwords securely
2. **Software Requests** - Process software installation requests
3. **Hardware Issues** - Troubleshoot common hardware problems

## Security Requirements
- Always verify employee identity before password resets
- Require employee ID and last 4 of phone number
- Never share passwords directly - only reset links

## Available Software
- Microsoft Office 365 (Standard)
- Adobe Creative Suite (Requires manager approval)
- Visual Studio Code (Standard)
- Slack (Standard)
- Zoom (Standard)

## Ticket Priorities
- Password issues: HIGH (blocking work)
- Software requests: MEDIUM
- Hardware issues: Based on impact

## Response Style
- Be professional and helpful
- Acknowledge frustration with technical issues
- Provide clear step-by-step guidance
- Always offer ticket creation for tracking
```

3. Click **"Save"**

#### Step 3: Create PasswordReset Topic (20 min)
1. Go to **"Topics"** → **"+ Add a topic"** → **"From blank"**
2. Name: `PasswordReset`
3. Add triggers:
   - "Reset my password"
   - "Forgot password"
   - "Can't log in"
   - "Password expired"
   - "Locked out"

4. Build the flow:

**Node 1: Message**
```
I'll help you reset your password right away. For security, I need to verify your identity first.
```

**Node 2: Question**
- Prompt: "Please enter your Employee ID (format: EMP followed by 4 digits, e.g., EMP1234):"
- Identify: Text
- Save as: `EmployeeID`

**Node 3: Question**
- Prompt: "Now, please enter the last 4 digits of your phone number on file:"
- Identify: Text
- Save as: `PhoneDigits`

**Node 4: Condition**
- If `PhoneDigits` length equals 4
- Then → Continue to verification message
- Else → Message: "Please enter exactly 4 digits." → Loop back

**Node 5: Message**
```
✅ Identity Verified!

Employee: {EmployeeID}
Verification: Successful

I'm generating a password reset link now...

📧 A password reset link has been sent to your registered email address.

**Next Steps:**
1. Check your email (including spam folder)
2. Click the reset link within 15 minutes
3. Create a new password following our policy:
   - At least 12 characters
   - Mix of upper/lower case
   - At least one number and symbol
   - Cannot reuse last 5 passwords

🎫 **Ticket Created:** PWD-{EmployeeID}-001
Status: In Progress

Is there anything else I can help with?
```

5. Click **"Save"**

#### Step 4: Create SoftwareRequest Topic (20 min)
1. Create new topic: `SoftwareRequest`
2. Add triggers:
   - "Install software"
   - "I need software"
   - "Request application"
   - "Download program"

3. Build the flow:

**Node 1: Question**
- Prompt: "I can help you request software. What software do you need?"
- Provide options (Multiple choice):
  - Microsoft Office 365
  - Adobe Creative Suite
  - Visual Studio Code
  - Slack
  - Zoom
  - Other
- Save as: `SoftwareName`

**Node 2: Question**
- Prompt: "Please enter your Employee ID:"
- Save as: `EmployeeID`

**Node 3: Condition**
- If `SoftwareName` equals "Adobe Creative Suite"
- Then → Go to Approval Required message
- Else → Go to Standard Approval message

**Node 4a: Approval Required Message**
```
📋 Software Request Submitted

**Software:** {SoftwareName}
**Employee:** {EmployeeID}
**Status:** ⏳ Pending Manager Approval

Adobe Creative Suite requires manager approval due to licensing costs.

📧 An approval request has been sent to your manager.
🎫 **Ticket:** SFT-{EmployeeID}-001

You'll receive an email once approved (typically 1-2 business days).

Anything else I can help with?
```

**Node 4b: Standard Approval Message**
```
✅ Software Request Approved!

**Software:** {SoftwareName}
**Employee:** {EmployeeID}
**Status:** Auto-Approved

This software is available for immediate installation.

📥 **Installation Instructions:**
1. Open Software Center on your computer
2. Search for "{SoftwareName}"
3. Click "Install"
4. Wait for installation to complete (~5-10 minutes)

🎫 **Ticket:** SFT-{EmployeeID}-001

Need help with anything else?
```

5. Click **"Save"**

#### Step 5: Create HardwareIssue Topic (15 min)
1. Create new topic: `HardwareIssue`
2. Add triggers:
   - "Hardware problem"
   - "Computer not working"
   - "My laptop is slow"
   - "Monitor issue"
   - "Keyboard not working"

3. Build the flow:

**Node 1: Question**
- Prompt: "I'm sorry you're having hardware trouble. What type of issue are you experiencing?"
- Options:
  - Computer won't turn on
  - Computer is very slow
  - Monitor/Display issues
  - Keyboard/Mouse not working
  - Other hardware issue
- Save as: `IssueType`

**Node 2: Condition based on IssueType**

For "Computer won't turn on":
```
🔧 Let's troubleshoot your computer:

**Step 1:** Check that the power cable is securely connected
**Step 2:** Try a different power outlet
**Step 3:** If laptop, try removing battery and holding power button for 30 seconds
**Step 4:** Reconnect power and try turning on

Did this resolve your issue?
```

For "Computer is very slow":
```
🔧 Let's speed things up:

**Step 1:** Restart your computer (this clears memory)
**Step 2:** Close unused applications
**Step 3:** Check for Windows updates
**Step 4:** Clear temporary files (type %temp% in Run, delete contents)

If still slow after these steps, we may need to schedule a diagnostic.

Did this help?
```

For other issues, provide generic troubleshooting and offer ticket creation.

4. Click **"Save"**

#### Step 6: Test All Workflows (5 min)
Test each workflow completely:

1. **Password Reset:** Go through full verification flow
2. **Software Request:** Try both standard and approval-required software
3. **Hardware Issue:** Test different issue types

### Exit Criteria Checklist
- [ ] Password reset verifies employee ID
- [ ] Password reset verifies phone digits
- [ ] Reset confirmation shows ticket number
- [ ] Software request shows different flows for Adobe vs others
- [ ] Standard software shows auto-approval
- [ ] Adobe shows pending manager approval
- [ ] Hardware troubleshooting provides step-by-step guidance
- [ ] All workflows create ticket references

---

## Lab 4: Custom API Connector
**Duration:** 75 minutes
**Difficulty:** Intermediate-Advanced

### Learning Objectives
- Deploy an API to free cloud hosting
- Connect Copilot Studio to external APIs
- Create HTTP actions
- Handle API responses in conversations

### Step-by-Step Instructions

#### Step 1: Create Replit Account (5 min)
1. Go to https://replit.com
2. Sign up (Google, GitHub, or email)
3. Verify your email if required

#### Step 2: Create New Repl (5 min)
1. Click **"+ Create Repl"**
2. Select **"Node.js"** template
3. Name it: `contoso-api-server`
4. Click **"Create Repl"**

#### Step 3: Add API Code (15 min)
1. In your Repl, click on `index.js`
2. **Delete all existing content**
3. Copy the ENTIRE code from the training materials:
   - File: `day2/labs/code/lab4-restructured/replit-api-server/index.js`
4. Paste into your Replit `index.js`

5. Click on `package.json`
6. Replace with:
```json
{
  "name": "contoso-api-server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  }
}
```

#### Step 4: Run Your API (5 min)
1. Click the green **"Run"** button
2. Wait for packages to install
3. You should see:
```
╔════════════════════════════════════════════════════════════╗
║         Contoso API Server - Running!                      ║
╚════════════════════════════════════════════════════════════╝
```
4. **Copy your URL** from the webview panel (looks like `https://contoso-api-server.yourname.repl.co`)

#### Step 5: Test Your API (5 min)
Open these URLs in a new browser tab:

```
https://YOUR-REPL-URL/health
→ Should show: {"status":"healthy",...}

https://YOUR-REPL-URL/api/employees
→ Should show list of employees

https://YOUR-REPL-URL/api/inventory
→ Should show list of inventory items
```

#### Step 6: Create Copilot Studio Agent (5 min)
1. Go to Copilot Studio
2. Click **"Create"** → **"New agent"**
3. Configure:
   - **Name:** `Contoso Enterprise Assistant`
   - **Description:** `Connects to company API for employee and inventory data`
   - Click **"Create"**

#### Step 7: Add HTTP Action for Employees (15 min)
1. Go to **"Topics"** → **"+ Add a topic"** → **"From blank"**
2. Name: `SearchEmployees`
3. Add triggers:
   - "Find employee"
   - "Search employees"
   - "Who works in"
   - "Employee lookup"

4. Add a **Question** node:
   - Prompt: "What would you like to search for? (name, department, or skill)"
   - Save as: `SearchTerm`

5. Add **"Call an action"** → **"Create a new flow"** (Power Automate)

   OR if Power Automate isn't available:

   Add a **Message** node explaining you'd call the API:
   ```
   🔍 Searching for employees matching "{SearchTerm}"...

   [In production, this would call: GET https://YOUR-API/api/employees?search={SearchTerm}]

   **Sample Results:**
   - Alice Johnson (EMP001) - Engineering - Senior Developer
   - David Chen (EMP004) - Engineering - Engineering Director

   Would you like details on any of these employees?
   ```

6. Click **"Save"**

#### Step 8: Add Employee Details Topic (10 min)
1. Create topic: `GetEmployeeDetails`
2. Triggers:
   - "Tell me about"
   - "Employee details"
   - "Who is EMP"

3. Add **Question**:
   - Prompt: "Please enter the Employee ID (e.g., EMP001):"
   - Save as: `EmployeeID`

4. Add **Message**:
```
📋 **Employee Details**

Looking up {EmployeeID}...

[API Call: GET /api/employees/{EmployeeID}]

**Alice Johnson** (EMP001)
- 📧 alice.johnson@contoso.com
- 🏢 Department: Engineering
- 💼 Role: Senior Developer
- 📍 Location: Seattle
- 👤 Manager: David Chen
- 🗓️ Start Date: March 15, 2021
- 🛠️ Skills: JavaScript, Python, Azure, React

Need information on another employee?
```

5. Click **"Save"**

#### Step 9: Add Inventory Search Topic (10 min)
1. Create topic: `SearchInventory`
2. Triggers:
   - "Check inventory"
   - "Product stock"
   - "What's in stock"

3. Add **Question**:
   - Prompt: "What product or category are you looking for?"
   - Save as: `SearchTerm`

4. Add **Message**:
```
📦 **Inventory Search Results**

Searching for "{SearchTerm}"...

[API Call: GET /api/inventory?search={SearchTerm}]

**Results:**
| Product | SKU | Stock | Price |
|---------|-----|-------|-------|
| ProBook Elite 15 | LAP-PRO-001 | 45 | $1,299.99 |
| CreatorStudio 16 | LAP-CRT-002 | 23 | $2,199.99 |

Need to check something else?
```

5. Click **"Save"**

#### Step 10: Test Your Agent (5 min)
1. Click **"Test"**
2. Try these queries:
   - "Find employees in Engineering"
   - "Who is EMP001?"
   - "Check laptop inventory"
   - "What's in stock for audio?"

### Exit Criteria Checklist
- [ ] Replit API is running and accessible
- [ ] /health endpoint returns status
- [ ] /api/employees returns employee list
- [ ] /api/inventory returns inventory list
- [ ] Copilot Studio agent has employee search topic
- [ ] Agent has inventory search topic
- [ ] Topics reference API endpoints correctly

---

## Lab 5: Knowledge-Powered Agent
**Duration:** 60 minutes
**Difficulty:** Intermediate

### Learning Objectives
- Upload knowledge files to Copilot Studio
- Configure knowledge behavior
- Create grounded responses
- Handle edge cases (out of stock, not found)

### Step-by-Step Instructions

#### Step 1: Get the Product Catalog File (5 min)
1. Download or copy the file from training materials:
   - File: `day2/labs/code/lab5-restructured/products-catalog.txt`
2. Save to your computer

**If you don't have the file**, create a new text file with this content:

```
# Contoso Electronics Product Catalog

## Laptops

### ProBook Elite 15 - $1,299.99
- Category: Laptops
- Rating: 4.7/5 stars
- In Stock: Yes
- Description: High-performance business laptop with 14th Gen Intel Core i7
- Key Features: 16GB RAM, 512GB SSD, 14-hour battery life
- Best For: Business professionals, remote workers

### CreatorStudio 16 - $2,199.99
- Category: Laptops
- Rating: 4.9/5 stars
- In Stock: Yes
- Description: Ultimate creative workstation with NVIDIA RTX graphics
- Key Features: 32GB RAM, 1TB SSD, RTX 4070, 4K OLED Display
- Best For: Video editors, 3D designers, content creators

## Smartphones

### Galaxy Pro Max - $1,099.99
- Category: Smartphones
- Rating: 4.8/5 stars
- In Stock: Yes
- Description: Flagship smartphone with revolutionary AI camera system
- Key Features: 200MP camera, 5000mAh battery, Titanium frame
- Best For: Photography enthusiasts, power users

## Audio

### SoundMax Pro - $349.99
- Category: Audio / Headphones
- Rating: 4.8/5 stars
- In Stock: Yes
- Description: Premium wireless headphones with industry-leading noise cancellation
- Key Features: 40-hour battery, Active Noise Cancellation, Spatial Audio
- Best For: Travelers, audiophiles, remote workers

### SoundBuds Lite - $79.99
- Category: Audio / Earbuds
- Rating: 4.3/5 stars
- In Stock: Yes
- Description: Affordable wireless earbuds with great sound quality
- Key Features: 24-hour battery with case, IPX4 water resistant
- Best For: Budget-conscious buyers, gym-goers

## Wearables

### FitTrack Ultra - $449.99
- Category: Wearables / Smartwatch
- Rating: 4.7/5 stars
- In Stock: NO - Currently out of stock
- Description: Advanced smartwatch with comprehensive health monitoring
- Key Features: ECG monitor, Blood oxygen sensor, Built-in GPS
- Note: OUT OF STOCK - Expected restock: February 2026

## TVs

### CinemaView 65 OLED - $1,999.99
- Category: TVs
- Rating: 4.9/5 stars
- In Stock: Yes
- Description: Stunning 65-inch OLED TV with perfect blacks
- Key Features: OLED display, Dolby Vision IQ, 120Hz gaming mode
- Best For: Movie lovers, gamers, home theater enthusiasts

## Accessories

### PowerBank Ultra 20000 - $59.99
- Category: Accessories / Power
- Rating: 4.6/5 stars
- In Stock: Yes
- Description: High-capacity portable charger
- Key Features: 20000mAh, 65W fast charging, USB-C + USB-A

### USB-C Hub Pro - $89.99
- Category: Accessories / Connectivity
- Rating: 4.7/5 stars
- In Stock: Yes
- Description: All-in-one USB-C hub for laptops
- Key Features: 4K HDMI, 3x USB-A, SD card reader, Ethernet
```

#### Step 2: Create New Agent (5 min)
1. Go to Copilot Studio
2. Click **"Create"** → **"New agent"**
3. Configure:
   - **Name:** `Contoso Retail Assistant`
   - **Description:** `Product expert that helps customers find the perfect electronics`
   - Click **"Create"**

#### Step 3: Upload Knowledge Source (10 min)
1. In your agent, go to **"Knowledge"** in the left menu
2. Click **"+ Add knowledge"**
3. Select **"Files"**
4. Upload your `products-catalog.txt` file
5. Wait for processing to complete
6. Click **"Add"**

#### Step 4: Configure Knowledge Instructions (10 min)
1. Go to **"Overview"**
2. Add these Instructions:

```
You are a knowledgeable and helpful retail assistant for Contoso Electronics.

## Your Role
- Help customers find the perfect products
- Provide accurate pricing and availability
- Make personalized recommendations based on needs
- Be honest about stock status

## Knowledge Usage Rules
- ONLY recommend products from your knowledge base
- If a product is out of stock, clearly state this
- Never make up products or prices
- If asked about a product you don't have info on, say "I don't have that product in our catalog"

## Response Style
- Be friendly and helpful
- Use bullet points for features
- Always mention price and availability
- Suggest alternatives when appropriate

## Out of Stock Handling
When a product is out of stock:
1. Clearly state it's unavailable
2. Mention expected restock date if known
3. Suggest similar in-stock alternatives

## Unknown Products
If asked about something not in your knowledge:
"I don't see that product in our current catalog. Here's what we do have in that category: [list alternatives]"
```

3. Click **"Save"**

#### Step 5: Configure Knowledge Behavior (5 min)
1. Go to **"Generative AI"** settings
2. Enable **"Use knowledge in conversations"**
3. Set to search knowledge before responding
4. Click **"Save"**

#### Step 6: Test Knowledge Queries (15 min)

**Test 1 - General Product Query:**
```
You: What laptops do you have?
Agent: [Should list ProBook Elite 15 and CreatorStudio 16 with prices]
```

**Test 2 - Specific Product:**
```
You: Tell me about the SoundMax Pro headphones
Agent: [Should provide details: $349.99, 40-hour battery, ANC, etc.]
```

**Test 3 - Recommendation:**
```
You: What's your best laptop for video editing?
Agent: [Should recommend CreatorStudio 16 with RTX graphics]
```

**Test 4 - Out of Stock:**
```
You: I want to buy the FitTrack Ultra
Agent: [Should say it's out of stock, expected February 2026, suggest FitBand Basic as alternative]
```

**Test 5 - Budget Query:**
```
You: What do you have under $100?
Agent: [Should list SoundBuds Lite $79.99, PowerBank Ultra $59.99, USB-C Hub Pro $89.99]
```

**Test 6 - Unknown Product:**
```
You: Do you sell refrigerators?
Agent: [Should say it's not in the catalog and describe what categories are available]
```

#### Step 7: Refine and Test Edge Cases (10 min)
1. Test various price ranges
2. Test category browsing
3. Test comparison questions
4. Verify no hallucinations occur

### Exit Criteria Checklist
- [ ] Knowledge source uploaded and processed
- [ ] Agent answers product questions accurately
- [ ] Prices match the catalog exactly
- [ ] Out-of-stock items clearly identified
- [ ] FitTrack Ultra shows as unavailable with restock date
- [ ] Budget queries return correct products
- [ ] Unknown products get "not in catalog" response
- [ ] No hallucinated products or prices

---

## Troubleshooting

### Copilot Studio Issues

**Can't create an agent:**
- Verify your Copilot Studio trial is active
- Try a different browser or incognito mode
- Clear browser cache and cookies

**Topics not triggering:**
- Add more trigger phrase variations
- Check for typos in trigger phrases
- Test with exact trigger phrase first

**Knowledge not returning results:**
- Re-upload the knowledge file
- Check file format (plain text works best)
- Wait a few minutes after upload for indexing

### Replit Issues

**Server not starting:**
- Check for syntax errors in code
- Verify package.json is correct
- Click "Stop" then "Run" again

**Can't access API URL:**
- Make sure the Repl is running (green "Running" status)
- Copy the full URL including https://
- Try refreshing the webview

**CORS errors:**
- The provided code includes CORS headers
- If issues persist, check the browser console

### General Tips

**Agent giving wrong answers:**
- Review and improve instructions
- Be more specific about what NOT to do
- Add examples of good responses

**Slow responses:**
- This is normal for trial accounts
- Wait a few seconds between messages
- Complex Topics may take longer

**Need help?**
- Ask your trainer
- Check the troubleshooting guide
- Review the documentation

---

## Congratulations!

You've completed all five labs! You've learned to:

✅ Create agents with Topics and Entities (Lab 1)
✅ Master instruction engineering (Lab 2)
✅ Build multi-step workflows (Lab 3)
✅ Connect to external APIs (Lab 4)
✅ Implement knowledge-grounded responses (Lab 5)

These skills transfer directly to production agent development with M365 Agents Toolkit and full Azure resources.

---

*Trainee Setup & Lab Guide | DW-104 | Version 2.0 | January 2026*

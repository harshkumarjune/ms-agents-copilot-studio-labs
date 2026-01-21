# Lab 5: Knowledge-Powered Agent
## File Upload Knowledge + Generative AI

**Duration:** 45 minutes
**Difficulty:** Intermediate
**Environment:** Copilot Studio Trial

---

## Overview

In this lab, you'll build a product recommendation agent powered by uploaded knowledge documents. This demonstrates Retrieval-Augmented Generation (RAG) concepts using Copilot Studio's file upload feature.

### What You'll Build

A smart shopping assistant that can:
- Answer product questions from a knowledge document
- Provide accurate specifications and pricing
- Make recommendations based on customer needs
- Compare products side by side
- Acknowledge when information isn't available

### Learning Objectives

By completing this lab, you will:
1. Understand RAG (Retrieval-Augmented Generation) concepts
2. Upload and configure knowledge sources
3. Create knowledge-grounded agents
4. Optimize instructions for document-based responses
5. Handle queries outside the knowledge base

---

## Prerequisites

- [ ] Completed Labs 1-4
- [ ] Copilot Studio Trial access
- [ ] Product catalog file (provided in this lab)

---

## Understanding RAG

### What is RAG?

**Retrieval-Augmented Generation** combines:
1. **Retrieval** - Finding relevant information from documents
2. **Generation** - Using AI to create natural responses

```
User Query → Search Documents → Find Relevant Chunks → Generate Response
```

### Why RAG Matters

| Without RAG | With RAG |
|-------------|----------|
| AI makes up answers | AI uses your actual data |
| Inconsistent info | Consistent, accurate info |
| No source citations | Can reference sources |
| Generic responses | Domain-specific expertise |

### Copilot Studio RAG

Copilot Studio's file upload provides a simplified RAG implementation:
- Upload documents (PDF, Word, TXT, etc.)
- System indexes content automatically
- AI searches and retrieves relevant sections
- Responses are grounded in your content

---

## Part 1: Prepare the Knowledge Document (10 minutes)

### Step 1.1: Create Product Catalog

Create a new file called `products-catalog.txt` with the following content:

```
# Contoso Electronics Product Catalog
# Version: January 2026
# For Sales and Customer Service Use

=======================================================
LAPTOPS
=======================================================

## ProBook Elite 15
- SKU: LAPTOP-001
- Price: $1,299.99
- Category: Business Laptops
- Brand: Contoso
- Rating: 4.7/5 stars (324 reviews)
- Availability: In Stock

SPECIFICATIONS:
- Display: 15.6" Full HD IPS (1920x1080)
- Processor: Intel Core i7-14700H (14th Gen)
- Memory: 16GB DDR5 RAM
- Storage: 512GB NVMe SSD
- Graphics: Intel Iris Xe
- Battery: 14-hour battery life
- Weight: 3.8 lbs
- Ports: 2x USB-C Thunderbolt 4, 2x USB-A, HDMI 2.1, SD card reader
- Security: Fingerprint reader, IR camera for Windows Hello

KEY FEATURES:
- MIL-STD-810H military-grade durability
- Spill-resistant keyboard
- 90-day battery health guarantee
- Enterprise-grade TPM 2.0 security

BEST FOR: Business professionals, remote workers, productivity tasks
WARRANTY: 2 years parts and labor

---

## CreatorStudio 16
- SKU: LAPTOP-002
- Price: $2,199.99
- Category: Creative Laptops
- Brand: Contoso
- Rating: 4.9/5 stars (189 reviews)
- Availability: In Stock

SPECIFICATIONS:
- Display: 16" 4K OLED (3840x2400), 120Hz, HDR
- Processor: Intel Core i9-14900H (14th Gen)
- Memory: 32GB DDR5 RAM
- Storage: 1TB NVMe SSD
- Graphics: NVIDIA RTX 4070 (8GB)
- Battery: 8-hour battery life
- Weight: 5.2 lbs
- Ports: 2x USB-C Thunderbolt 4, USB-A, HDMI 2.1, SD card reader

KEY FEATURES:
- Pantone validated colors (100% DCI-P3)
- Per-key RGB keyboard
- Advanced thermal design with vapor chamber
- Included stylus support

BEST FOR: Video editors, 3D designers, content creators, gaming
WARRANTY: 2 years parts and labor

---

## StudentBook Air
- SKU: LAPTOP-003
- Price: $699.99
- Category: Budget Laptops
- Brand: Contoso
- Rating: 4.4/5 stars (567 reviews)
- Availability: In Stock

SPECIFICATIONS:
- Display: 14" Full HD IPS (1920x1080)
- Processor: Intel Core i5-1340P (13th Gen)
- Memory: 8GB DDR4 RAM
- Storage: 256GB NVMe SSD
- Graphics: Intel Iris Xe
- Battery: 10-hour battery life
- Weight: 3.0 lbs
- Ports: 2x USB-C, USB-A, HDMI

KEY FEATURES:
- Lightweight design for portability
- Fast charging (0-50% in 30 minutes)
- Affordable without sacrificing quality
- Included 1-year Microsoft 365

BEST FOR: Students, basic productivity, web browsing, light work
WARRANTY: 1 year parts and labor

=======================================================
SMARTPHONES
=======================================================

## Galaxy Pro Max
- SKU: PHONE-001
- Price: $1,099.99
- Category: Premium Smartphones
- Brand: Contoso
- Rating: 4.8/5 stars (892 reviews)
- Availability: In Stock

SPECIFICATIONS:
- Display: 6.8" Dynamic AMOLED 2X, 120Hz, 3088x1440
- Processor: Snapdragon 8 Gen 3
- Memory: 12GB RAM
- Storage: 256GB (expandable)
- Camera: 200MP main + 50MP ultra-wide + 10MP telephoto
- Battery: 5000mAh, 45W fast charging
- OS: Android 14

KEY FEATURES:
- AI-powered photo enhancement
- Satellite SOS capability
- Titanium frame construction
- IP68 water resistance (30 min at 1.5m)
- 8K video recording

BEST FOR: Photography enthusiasts, power users, professionals
WARRANTY: 1 year, AppleCare+ equivalent available

---

## Pixel Budget
- SKU: PHONE-002
- Price: $449.99
- Category: Mid-Range Smartphones
- Brand: Contoso
- Rating: 4.5/5 stars (1,234 reviews)
- Availability: In Stock

SPECIFICATIONS:
- Display: 6.4" OLED, 90Hz, 2400x1080
- Processor: Google Tensor G2
- Memory: 8GB RAM
- Storage: 128GB
- Camera: 64MP main + 12MP ultra-wide
- Battery: 4500mAh, 30W fast charging
- OS: Android 14

KEY FEATURES:
- 5 years of security updates
- Google AI features built-in
- Night Sight photography
- Call screening and spam protection

BEST FOR: Budget-conscious buyers, Google ecosystem users
WARRANTY: 1 year

=======================================================
AUDIO
=======================================================

## SoundMax Pro Headphones
- SKU: AUDIO-001
- Price: $349.99
- Category: Premium Headphones
- Brand: Contoso Audio
- Rating: 4.8/5 stars (456 reviews)
- Availability: In Stock

SPECIFICATIONS:
- Type: Over-ear wireless
- Driver: 40mm custom drivers
- Frequency Response: 4Hz - 40kHz
- Noise Cancellation: Adaptive ANC with 8 microphones
- Battery: 40 hours (30 with ANC)
- Codecs: LDAC, AAC, SBC
- Connectivity: Bluetooth 5.3, 3.5mm wired

KEY FEATURES:
- Spatial Audio support
- Multipoint (connect 2 devices)
- Speak-to-Chat auto-pause
- Hi-Res Audio certified
- Premium leather ear cushions
- Foldable design with carry case

BEST FOR: Audiophiles, travelers, remote workers, music lovers
WARRANTY: 2 years

---

## SoundPods Mini
- SKU: AUDIO-002
- Price: $129.99
- Category: True Wireless Earbuds
- Brand: Contoso Audio
- Rating: 4.6/5 stars (2,341 reviews)
- Availability: In Stock

SPECIFICATIONS:
- Type: True wireless earbuds
- Driver: 6mm dynamic
- Noise Cancellation: Active ANC
- Battery: 8 hours (24 with case)
- Water Resistance: IPX5
- Codecs: AAC, SBC

KEY FEATURES:
- Touch controls
- Transparency mode
- Wireless charging case
- Find My compatible
- Comfortable fit for all-day wear

BEST FOR: Everyday use, exercise, commuting
WARRANTY: 1 year

=======================================================
WEARABLES
=======================================================

## FitTrack Ultra Watch
- SKU: WATCH-001
- Price: $449.99
- Category: Premium Smartwatch
- Brand: Contoso Wearables
- Rating: 4.7/5 stars (678 reviews)
- Availability: OUT OF STOCK (Expected: February 2026)

SPECIFICATIONS:
- Display: 1.4" AMOLED, Always-on
- Processor: Exynos W930
- Storage: 16GB
- Battery: 40 hours typical use
- Water Resistance: 5ATM + IP68
- Connectivity: GPS, NFC, LTE (optional)

KEY FEATURES:
- ECG monitoring
- Blood oxygen sensor
- Body composition analysis
- Sleep tracking with stages
- 100+ workout modes
- Fall detection and emergency SOS

BEST FOR: Fitness enthusiasts, health-conscious users
WARRANTY: 2 years
NOTE: Currently out of stock due to high demand. Join waitlist.

=======================================================
TVs & DISPLAYS
=======================================================

## CinemaView 65 OLED
- SKU: TV-001
- Price: $1,999.99
- Category: Premium TVs
- Brand: Contoso Display
- Rating: 4.9/5 stars (234 reviews)
- Availability: In Stock

SPECIFICATIONS:
- Display: 65" 4K OLED
- Resolution: 3840 x 2160
- Refresh Rate: 120Hz
- HDR: Dolby Vision IQ, HDR10+
- Audio: Dolby Atmos, 40W speakers
- Smart Platform: webOS 24
- Ports: 4x HDMI 2.1, 3x USB, Optical

KEY FEATURES:
- Perfect blacks with OLED technology
- AI picture and sound optimization
- Gaming mode (VRR, ALLM, 1ms response)
- Magic Remote with voice control
- AirPlay 2 and HomeKit support

BEST FOR: Movie lovers, gamers, home theater enthusiasts
WARRANTY: 2 years panel, 1 year parts

=======================================================
RETURN POLICY & SUPPORT
=======================================================

RETURN POLICY:
- 30-day return window for all products
- Product must be in original packaging
- Free return shipping on defective items
- 15% restocking fee for opened non-defective items
- Electronics must be reset to factory settings

SUPPORT CONTACT:
- Phone: 1-800-CONTOSO (1-800-266-8676)
- Email: support@contoso-electronics.com
- Live Chat: Available 24/7 on website
- Store Hours: Mon-Sat 9AM-9PM, Sun 10AM-6PM

PRICE MATCH GUARANTEE:
- We match prices from authorized retailers
- Must be identical product and in stock
- Excludes marketplace sellers and flash sales

=======================================================
END OF CATALOG
=======================================================
```

### Step 1.2: Save the File

Save this as `products-catalog.txt` on your computer.

**Note:** You can also find this file in the training materials at:
`day2/labs/code/lab5-restructured/products-catalog.txt`

**CHECKPOINT 1:** Product catalog file created.

---

## Part 2: Create the Agent (5 minutes)

### Step 2.1: Create New Agent

1. Go to **Copilot Studio** → **+ Create** → **New agent**
2. Configure:

| Field | Value |
|-------|-------|
| Name | `Contoso Electronics` |
| Description | `Smart shopping assistant for Contoso Electronics products` |

3. Click **Create**

**CHECKPOINT 2:** Agent created.

---

## Part 3: Upload Knowledge Source (10 minutes)

### Step 3.1: Access Knowledge Settings

1. In your agent, click **Knowledge** in the left navigation
2. You should see "Add knowledge to your copilot"

### Step 3.2: Upload Document

1. Click **+ Add knowledge**
2. Select **Files**
3. Click **Upload** and select your `products-catalog.txt` file
4. Wait for the upload and processing to complete

### Step 3.3: Verify Upload

You should see:
- File name listed
- Status: "Ready" or "Indexed"
- If there's an error, check file format and size

### Step 3.4: Configure Knowledge Settings

If available, adjust these settings:
- **Enable generative answers**: ON
- **Show sources**: ON (if available)

**CHECKPOINT 3:** Knowledge source uploaded and indexed.

---

## Part 4: Configure Instructions (10 minutes)

### Step 4.1: Write Optimized Instructions

Go to **Overview** → **Details** and add these instructions:

```markdown
You are the Contoso Electronics shopping assistant. Help customers find the perfect products.

## Your Knowledge Base
You have access to our complete product catalog including:
- Laptops (3 models)
- Smartphones (2 models)
- Audio equipment (2 products)
- Wearables (1 smartwatch)
- TVs (1 model)

ALWAYS use your knowledge base to answer product questions. DO NOT make up specifications or prices.

## Response Guidelines

### Product Inquiries
When asked about a specific product:
1. Find it in your knowledge base
2. Present: Name, Price, Rating, Availability
3. Highlight key features relevant to the question
4. End with "Would you like more details or have other questions?"

### Recommendations
When asked "what should I buy" or for recommendations:
1. Ask clarifying questions:
   - "What will you primarily use it for?"
   - "What's your budget range?"
   - "Any must-have features?"
2. Search your knowledge for matches
3. Recommend 1-2 best options with reasons
4. Offer to compare if multiple options fit

### Comparisons
When asked to compare products:
Create a clear side-by-side format:

| Feature | Product A | Product B |
|---------|-----------|-----------|
| Price | $X | $Y |
| Key Spec | Value | Value |

Then provide a recommendation based on needs.

### Response Format
Use this format for product information:

📦 **[Product Name]** - $[Price]
⭐ [Rating] | [Availability Status]

[Brief 1-2 sentence description]

**Key Features:**
• [Most relevant feature 1]
• [Most relevant feature 2]
• [Most relevant feature 3]

**Best For:** [Target users]

### Important Rules
1. ONLY mention products in your knowledge base
2. If a product isn't found, say: "I don't have that product in our current catalog. Here's what we do have in that category..."
3. ALWAYS mention if something is OUT OF STOCK
4. Be honest about limitations - don't invent features
5. Reference the warranty and return policy when relevant

### Out of Scope
If asked about:
- Products not in catalog: "I can only help with products in our catalog"
- Competitor products: "I focus on Contoso products, but I can help you find what you need from our lineup"
- Technical repairs: "Please contact support at 1-800-CONTOSO for technical issues"
```

### Step 4.2: Save Instructions

Click **Save**

**CHECKPOINT 4:** Instructions optimized for knowledge-based responses.

---

## Part 5: Add Conversation Starters (5 minutes)

### Step 5.1: Configure Starters

Go to **Overview** → **Conversation starters** and add:

```
💻 Help me choose a laptop
📱 Compare your smartphones
🎧 What headphones do you recommend?
📺 Tell me about your TVs
🛒 What's on sale?
```

### Step 5.2: Save

**CHECKPOINT 5:** Conversation starters configured.

---

## Part 6: Test Knowledge Retrieval (10 minutes)

### Step 6.1: Open Test Panel

Click **Test** (bottom right)

### Step 6.2: Test Product Queries

**Test 1: Specific Product**
```
You: "Tell me about the CreatorStudio 16"

Expected: Returns accurate specs, price ($2,199.99), features (RTX 4070, 4K OLED)
```

**Test 2: Category Browse**
```
You: "What laptops do you have?"

Expected: Lists all 3 laptops with prices and brief descriptions
```

**Test 3: Recommendation**
```
You: "I need a laptop for video editing under $2500"

Expected: Recommends CreatorStudio 16, mentions RTX graphics and 4K display
```

**Test 4: Comparison**
```
You: "Compare the ProBook Elite and StudentBook Air"

Expected: Side-by-side comparison with prices, specs, recommendations
```

**Test 5: Stock Check**
```
You: "Is the FitTrack Ultra available?"

Expected: States OUT OF STOCK, mentions February 2026 expected date
```

**Test 6: Feature Search**
```
You: "What products have noise cancellation?"

Expected: Returns SoundMax Pro and SoundPods Mini
```

**Test 7: Budget Query**
```
You: "What can I get for under $500?"

Expected: Lists StudentBook Air ($699.99 - might suggest), Pixel Budget ($449.99), SoundPods Mini ($129.99)
```

**Test 8: Unknown Product**
```
You: "Do you have any tablets?"

Expected: Acknowledges no tablets in catalog, might suggest laptop alternatives
```

### Step 6.3: Document Results

| Test Case | Query | Expected | Actual | Accurate? |
|-----------|-------|----------|--------|-----------|
| Specific product | CreatorStudio 16 | Specs + price | | |
| Category list | Laptops | 3 products | | |
| Recommendation | Video editing laptop | CreatorStudio | | |
| Comparison | ProBook vs StudentBook | Table format | | |
| Stock check | FitTrack Ultra | Out of stock | | |
| Feature search | Noise cancellation | Audio products | | |
| Budget | Under $500 | Matching products | | |
| Unknown | Tablets | Not in catalog | | |

**CHECKPOINT 6:** All knowledge queries return accurate results.

---

## Exit Criteria

Before completing this lab, verify:

| Criteria | Status |
|----------|--------|
| ✅ Knowledge document uploaded | |
| ✅ Product queries return accurate data | |
| ✅ Prices match the catalog | |
| ✅ Specifications are correct | |
| ✅ Stock status (FitTrack) mentioned | |
| ✅ Recommendations make sense | |
| ✅ Comparisons are formatted | |
| ✅ Unknown products handled honestly | |
| ✅ Return policy referenced when relevant | |

---

## Troubleshooting

### Knowledge Not Being Used
- Verify document uploaded successfully
- Check "Use knowledge" is enabled
- Try more specific queries
- Rephrase instructions to emphasize knowledge use

### Inaccurate Information
- Check if document contains the correct data
- AI may paraphrase - verify core facts
- Add instruction: "Use EXACT prices and specs from knowledge"

### Too Much Information
- Add: "Keep responses concise - focus on most relevant details"
- Limit to 3-5 key features per product

### Not Finding Products
- Try different query phrasings
- Check document formatting
- Ensure product names are searchable

### Outdated Information
- Remember this is a static document
- In production, you'd connect to live data
- Explain limitations if asked about real-time stock

---

## Key Concepts Learned

### RAG Best Practices

1. **Document Structure Matters**
   - Use clear headings
   - Consistent formatting
   - Searchable keywords

2. **Instruction Engineering for RAG**
   - Tell the AI to use its knowledge
   - Specify when to acknowledge limits
   - Format expectations for responses

3. **Handling Edge Cases**
   - Unknown products
   - Out of stock items
   - Questions outside scope

### When to Use Knowledge vs Instructions

| Use Knowledge | Use Instructions |
|---------------|-----------------|
| Factual data (prices, specs) | Response style and tone |
| Product catalogs | Handling edge cases |
| Policies and procedures | Conversation flow |
| FAQs | Personality guidelines |

---

## Extension Challenges (Optional)

1. **Add more products** - Expand the catalog with tablets and accessories
2. **Create FAQ section** - Add common questions to knowledge
3. **Multi-language** - Create catalog in another language
4. **Seasonal content** - Add a "Sale Items" section
5. **Competitor comparison** - Add "vs competitor" responses

---

## Summary

In this lab, you learned:
- RAG (Retrieval-Augmented Generation) concepts
- Uploading and configuring knowledge sources
- Writing instructions optimized for knowledge retrieval
- Handling queries within and outside knowledge scope
- Building accurate, grounded product assistants

This pattern applies to many use cases: HR policy bots, IT support, product documentation, customer service, and more.

---

## Training Complete!

Congratulations on completing all 5 labs! You've learned:

| Lab | Skill |
|-----|-------|
| Lab 1 | Topics and Entities |
| Lab 2 | Instruction Engineering |
| Lab 3 | Multi-Step Workflows |
| Lab 4 | External API Integration |
| Lab 5 | Knowledge-Powered RAG |

### What's Next?

See the **Post-Training Materials** folder for:
- Advanced learning paths
- Certification preparation
- Azure services access roadmap
- Additional project ideas

---

*Lab 5: Knowledge-Powered Agent | DW-104 Day 2 | January 2026*

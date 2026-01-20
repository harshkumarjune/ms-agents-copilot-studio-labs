# Lab 5: Create a Retail Agent with Azure AI Search and Bring Your Own Model
## Advanced Copilot Studio Pro-Code

**Duration:** 45 minutes
**Difficulty:** High
**LOD Module:** PL-400-M02-L02

---

## 🎯 Lab Objectives

By the end of this lab, you will be able to:
1. Configure Azure AI Search for product knowledge
2. Integrate custom models from Azure AI Foundry
3. Build a retail agent in Copilot Studio
4. Implement RAG (Retrieval-Augmented Generation) patterns
5. Customize prompts for retail scenarios

---

## 📋 Scenario

**Contoso Electronics Retail Assistant** - Build an intelligent shopping assistant that:
- Answers questions about products using a searchable catalog
- Provides personalized recommendations
- Compares products based on specifications
- Uses a custom fine-tuned model for better retail responses
- Handles pricing and availability queries

This lab combines **Azure AI Search** for knowledge retrieval with **custom models** for specialized responses.

---

## 🔧 Prerequisites Checklist

Before starting, verify:
- [ ] Azure subscription with AI Search capability
- [ ] Access to Azure AI Foundry (ai.azure.com)
- [ ] Copilot Studio environment access
- [ ] Sample product data (provided)
- [ ] Completed Labs 1-4

---

## Part 1: Set Up Azure AI Search (15 minutes)

### Step 1.1: Create Azure AI Search Service

1. **Azure Portal:**
   - Navigate to https://portal.azure.com
   - Click **+ Create a resource**
   - Search for "Azure AI Search"
   - Click **Create**

2. **Configure:**

   | Setting | Value |
   |---------|-------|
   | Subscription | Your subscription |
   | Resource Group | rg-retail-agent |
   | Service Name | search-retail-contoso |
   | Location | East US (or nearest) |
   | Pricing Tier | Basic (for lab) |

3. **Create** and wait for deployment (2-3 minutes)

### Step 1.2: Get Connection Details

After deployment:
1. Go to **Keys** in the left menu
2. Copy:
   - **Admin Key**: For indexing
   - **Query Key**: For searching
3. Go to **Overview**
4. Copy the **URL**: `https://search-retail-contoso.search.windows.net`

### Step 1.3: Create Product Index

**Option A: Using Azure Portal**

1. Go to **Indexes** → **+ Add index**
2. Name: `products`
3. Add fields:

| Field Name | Type | Searchable | Filterable | Sortable | Facetable |
|------------|------|------------|------------|----------|-----------|
| id | Edm.String (Key) | - | - | - | - |
| name | Edm.String | ✓ | - | ✓ | - |
| description | Edm.String | ✓ | - | - | - |
| category | Edm.String | ✓ | ✓ | - | ✓ |
| brand | Edm.String | ✓ | ✓ | - | ✓ |
| price | Edm.Double | - | ✓ | ✓ | - |
| rating | Edm.Double | - | ✓ | ✓ | - |
| features | Collection(Edm.String) | ✓ | - | - | - |
| specs | Edm.String | ✓ | - | - | - |
| inStock | Edm.Boolean | - | ✓ | - | - |
| imageUrl | Edm.String | - | - | - | - |

**Option B: Using REST API**

Create `create-index.json`:

```json
{
  "name": "products",
  "fields": [
    {"name": "id", "type": "Edm.String", "key": true},
    {"name": "name", "type": "Edm.String", "searchable": true, "sortable": true},
    {"name": "description", "type": "Edm.String", "searchable": true},
    {"name": "category", "type": "Edm.String", "searchable": true, "filterable": true, "facetable": true},
    {"name": "brand", "type": "Edm.String", "searchable": true, "filterable": true, "facetable": true},
    {"name": "price", "type": "Edm.Double", "filterable": true, "sortable": true},
    {"name": "rating", "type": "Edm.Double", "filterable": true, "sortable": true},
    {"name": "features", "type": "Collection(Edm.String)", "searchable": true},
    {"name": "specs", "type": "Edm.String", "searchable": true},
    {"name": "inStock", "type": "Edm.Boolean", "filterable": true},
    {"name": "imageUrl", "type": "Edm.String"}
  ],
  "semantic": {
    "configurations": [
      {
        "name": "product-semantic",
        "prioritizedFields": {
          "titleField": {"fieldName": "name"},
          "contentFields": [
            {"fieldName": "description"},
            {"fieldName": "specs"}
          ],
          "keywordsFields": [
            {"fieldName": "features"},
            {"fieldName": "category"}
          ]
        }
      }
    ]
  }
}
```

Execute:
```bash
curl -X POST "https://search-retail-contoso.search.windows.net/indexes?api-version=2024-07-01" \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_ADMIN_KEY" \
  -d @create-index.json
```

### Step 1.4: Upload Sample Products

Create `products-data.json`:

```json
{
  "value": [
    {
      "@search.action": "upload",
      "id": "LAPTOP-001",
      "name": "ProBook Elite 15",
      "description": "High-performance business laptop with 14th Gen Intel Core i7, perfect for professionals who need power and portability.",
      "category": "Laptops",
      "brand": "Contoso",
      "price": 1299.99,
      "rating": 4.7,
      "features": ["16GB RAM", "512GB SSD", "14-hour battery", "Thunderbolt 4", "Fingerprint reader"],
      "specs": "Display: 15.6\" FHD IPS | Processor: Intel Core i7-14700H | Memory: 16GB DDR5 | Storage: 512GB NVMe SSD | Graphics: Intel Iris Xe | Battery: 72Wh | Weight: 1.8kg",
      "inStock": true,
      "imageUrl": "https://example.com/probook-elite.jpg"
    },
    {
      "@search.action": "upload",
      "id": "LAPTOP-002",
      "name": "CreatorStudio 16",
      "description": "Ultimate creative workstation laptop with NVIDIA RTX graphics and color-accurate display for designers and content creators.",
      "category": "Laptops",
      "brand": "Contoso",
      "price": 2199.99,
      "rating": 4.9,
      "features": ["32GB RAM", "1TB SSD", "RTX 4070", "4K OLED Display", "Pantone Validated"],
      "specs": "Display: 16\" 4K OLED | Processor: Intel Core i9-14900H | Memory: 32GB DDR5 | Storage: 1TB NVMe SSD | Graphics: NVIDIA RTX 4070 | Battery: 90Wh | Weight: 2.2kg",
      "inStock": true,
      "imageUrl": "https://example.com/creatorstudio.jpg"
    },
    {
      "@search.action": "upload",
      "id": "PHONE-001",
      "name": "Galaxy Pro Max",
      "description": "Flagship smartphone with revolutionary AI camera system and all-day battery life.",
      "category": "Smartphones",
      "brand": "Contoso",
      "price": 1099.99,
      "rating": 4.8,
      "features": ["200MP Camera", "5000mAh Battery", "Titanium Frame", "AI Photo Enhancement", "Satellite SOS"],
      "specs": "Display: 6.8\" Dynamic AMOLED 2X | Processor: Snapdragon 8 Gen 3 | Memory: 12GB | Storage: 256GB | Camera: 200MP + 12MP + 10MP | Battery: 5000mAh | 5G",
      "inStock": true,
      "imageUrl": "https://example.com/galaxy-pro.jpg"
    },
    {
      "@search.action": "upload",
      "id": "PHONE-002",
      "name": "Pixel Ultra",
      "description": "Pure Android experience with Google AI and exceptional computational photography.",
      "category": "Smartphones",
      "brand": "Google",
      "price": 899.99,
      "rating": 4.6,
      "features": ["50MP Triple Camera", "Google AI", "7 years updates", "Magic Eraser", "Call Screen"],
      "specs": "Display: 6.7\" LTPO OLED | Processor: Google Tensor G4 | Memory: 12GB | Storage: 128GB | Camera: 50MP + 48MP + 48MP | Battery: 5050mAh | 5G",
      "inStock": true,
      "imageUrl": "https://example.com/pixel-ultra.jpg"
    },
    {
      "@search.action": "upload",
      "id": "TABLET-001",
      "name": "ProPad Air",
      "description": "Versatile tablet for work and entertainment with desktop-class performance.",
      "category": "Tablets",
      "brand": "Contoso",
      "price": 799.99,
      "rating": 4.5,
      "features": ["M2 Chip", "10-hour battery", "Pencil support", "Face ID", "USB-C"],
      "specs": "Display: 11\" Liquid Retina | Processor: M2 | Memory: 8GB | Storage: 256GB | Connectivity: WiFi 6E | Battery: 10 hours | Weight: 461g",
      "inStock": true,
      "imageUrl": "https://example.com/propad-air.jpg"
    },
    {
      "@search.action": "upload",
      "id": "HEADPHONES-001",
      "name": "SoundMax Pro",
      "description": "Premium wireless headphones with industry-leading noise cancellation and spatial audio.",
      "category": "Audio",
      "brand": "Contoso",
      "price": 349.99,
      "rating": 4.8,
      "features": ["40hr Battery", "Active Noise Cancellation", "Spatial Audio", "Multipoint", "Hi-Res Audio"],
      "specs": "Driver: 40mm | Frequency: 4Hz-40kHz | ANC: Adaptive | Codec: LDAC, AAC, SBC | Battery: 40 hours (ANC on) | Weight: 250g",
      "inStock": true,
      "imageUrl": "https://example.com/soundmax-pro.jpg"
    },
    {
      "@search.action": "upload",
      "id": "WATCH-001",
      "name": "FitTrack Ultra",
      "description": "Advanced smartwatch with comprehensive health monitoring and fitness tracking.",
      "category": "Wearables",
      "brand": "Contoso",
      "price": 449.99,
      "rating": 4.7,
      "features": ["ECG Monitor", "Blood Oxygen", "GPS", "5ATM Water Resistant", "Sleep Tracking"],
      "specs": "Display: 1.4\" AMOLED | Processor: Exynos W930 | Storage: 16GB | Sensors: ECG, SpO2, HR, GPS | Battery: 40 hours | Water: 5ATM",
      "inStock": false,
      "imageUrl": "https://example.com/fittrack-ultra.jpg"
    },
    {
      "@search.action": "upload",
      "id": "TV-001",
      "name": "CinemaView 65 OLED",
      "description": "Stunning 65-inch OLED TV with perfect blacks, infinite contrast, and cinematic Dolby Vision.",
      "category": "TVs",
      "brand": "Contoso",
      "price": 1999.99,
      "rating": 4.9,
      "features": ["OLED Display", "Dolby Vision IQ", "120Hz Gaming", "HDMI 2.1", "webOS"],
      "specs": "Display: 65\" 4K OLED | Refresh: 120Hz | HDR: Dolby Vision, HDR10 | Audio: Dolby Atmos | Smart: webOS 24 | Ports: 4x HDMI 2.1",
      "inStock": true,
      "imageUrl": "https://example.com/cinemaview-65.jpg"
    }
  ]
}
```

Upload:
```bash
curl -X POST "https://search-retail-contoso.search.windows.net/indexes/products/docs/index?api-version=2024-07-01" \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_ADMIN_KEY" \
  -d @products-data.json
```

### Step 1.5: Test Search

```bash
# Basic search
curl "https://search-retail-contoso.search.windows.net/indexes/products/docs/search?api-version=2024-07-01" \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_QUERY_KEY" \
  -d '{"search": "laptop for content creators", "top": 3}'

# Filtered search
curl "https://search-retail-contoso.search.windows.net/indexes/products/docs/search?api-version=2024-07-01" \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_QUERY_KEY" \
  -d '{"search": "*", "filter": "category eq '\''Smartphones'\'' and price lt 1000", "top": 5}'
```

---

## Part 2: Configure Azure AI Foundry Model (10 minutes)

### Step 2.1: Access Azure AI Foundry

1. Navigate to https://ai.azure.com
2. Sign in with your Azure credentials
3. Create or select a project

### Step 2.2: Deploy a Model

1. Go to **Model catalog**
2. Search for "gpt-4" or select a model
3. Click **Deploy**
4. Configure:

   | Setting | Value |
   |---------|-------|
   | Deployment Name | retail-gpt4 |
   | Model Version | Latest |
   | Tokens Per Minute | 10K (adjust as needed) |

5. **Deploy** and wait for completion

### Step 2.3: Get Deployment Details

After deployment:
1. Go to **Deployments**
2. Select your deployment
3. Copy:
   - **Endpoint URL**
   - **API Key**
   - **Deployment Name**

### Step 2.4: Create Custom System Prompt

For retail optimization, prepare a custom prompt:

```
You are a knowledgeable retail assistant for Contoso Electronics.

## Your Expertise
- Deep knowledge of consumer electronics (laptops, phones, tablets, audio, wearables, TVs)
- Understanding of technical specifications and what they mean for users
- Ability to match products to customer needs
- Honest about product limitations

## Communication Style
- Friendly and helpful, not pushy
- Explain technical terms simply
- Ask clarifying questions to understand needs
- Provide balanced recommendations

## Response Format
When recommending products:
1. Start with the best match and why
2. Mention key features relevant to the user's needs
3. Note any potential drawbacks
4. Offer alternatives if budget is a concern

## Knowledge Integration
Use the product information provided by the search tool. Don't make up products or specs.
If a product isn't in the search results, say it's not in the current catalog.

## Pricing and Availability
Always mention current price and stock status. If out of stock, suggest alternatives or offer to notify when available.
```

---

## Part 3: Build Copilot Studio Agent (15 minutes)

### Step 3.1: Create New Agent

1. Open Copilot Studio (copilotstudio.microsoft.com)
2. Click **+ Create** → **New agent**
3. Configure:

   | Setting | Value |
   |---------|-------|
   | Name | Contoso Electronics Assistant |
   | Description | AI shopping assistant for electronics |

### Step 3.2: Configure Knowledge Source (Azure AI Search)

1. Go to **Knowledge** in the left panel
2. Click **+ Add knowledge**
3. Select **Azure AI Search**
4. Configure connection:

```
Service URL: https://search-retail-contoso.search.windows.net
API Key: YOUR_QUERY_KEY
Index Name: products
```

5. Configure search settings:
   - Enable semantic search
   - Set top results: 5
   - Configure field mappings

### Step 3.3: Configure Custom Model (BYOM)

1. Go to **AI Models** or **Settings** → **Generative AI**
2. Select **Use custom model**
3. Configure:

```
Endpoint: https://YOUR-ENDPOINT.openai.azure.com/
API Key: YOUR_API_KEY
Deployment: retail-gpt4
API Version: 2024-02-15-preview
```

### Step 3.4: Write Agent Instructions

Add comprehensive instructions:

```markdown
# Contoso Electronics Shopping Assistant

You are the official Contoso Electronics shopping assistant. Help customers find the perfect products.

## Core Capabilities

### 1. Product Search & Discovery
When customers ask about products:
- Search the product catalog using relevant keywords
- Filter by category, brand, price range as needed
- Present results with key specs and pricing

### 2. Product Comparison
When asked to compare:
- Retrieve both products from catalog
- Create side-by-side comparison
- Highlight key differences
- Recommend based on stated needs

### 3. Recommendations
For "what should I buy" questions:
- Ask clarifying questions first:
  - Budget range?
  - Primary use case?
  - Must-have features?
- Search for matching products
- Explain why recommendations fit

### 4. Technical Support
For specification questions:
- Explain what specs mean in practical terms
- Help customers understand trade-offs
- Don't overwhelm with technical jargon

## Search Patterns

Use these search strategies:

**Category Browse:**
- "Show me laptops" → search: category:Laptops
- "What phones do you have?" → search: category:Smartphones

**Feature Search:**
- "Laptop with long battery" → search: laptop battery
- "Phone with best camera" → search: smartphone camera

**Budget Filter:**
- "Laptops under $1500" → search: laptop, filter: price lt 1500
- "Premium headphones" → search: headphones, filter: price gt 200

**Comparison:**
- "Compare X and Y" → search both, present side-by-side

## Response Templates

### Product Presentation
📱 **[Product Name]** - $[Price]
⭐ [Rating]/5 | [In Stock/Out of Stock]

[2-sentence description focusing on user benefit]

**Key Features:**
• [Feature 1 - why it matters]
• [Feature 2 - why it matters]
• [Feature 3 - why it matters]

### Comparison Table
| Feature | Product A | Product B |
|---------|-----------|-----------|
| Price | $X | $Y |
| [Key Spec] | Value | Value |

**Recommendation:** [Which one and why]

## Conversation Guidelines

1. **Be Proactive:** Anticipate follow-up questions
2. **Stay Honest:** If something isn't great, say so
3. **Ask Questions:** Better to clarify than guess
4. **Handle "I don't know":** Offer to search or suggest alternatives

## Edge Cases

- **Out of Stock:** Mention it clearly, suggest alternatives
- **No Results:** Acknowledge and broaden search
- **Price Changes:** Always say "current price" as prices may vary
- **Competitor Products:** Focus on our catalog, don't disparage competitors
```

### Step 3.5: Add Conversation Starters

Configure welcome messages:

```
[Prompt 1]
"🛒 Looking for something specific?"
→ "Help me find a laptop for video editing"

[Prompt 2]
"📊 Need help comparing products?"
→ "Compare your best smartphones"

[Prompt 3]
"💡 Not sure what you need?"
→ "I want a gift for someone who loves music"

[Prompt 4]
"💰 Shopping on a budget?"
→ "Best electronics under $500"
```

### Step 3.6: Configure Topics (Optional Advanced)

Create custom topics for specific flows:

**Topic: Product Return/Exchange**
```
Trigger: "return", "exchange", "refund"
Response: "I can help with returns! For Contoso Electronics:
- Returns accepted within 30 days
- Original packaging required
- Receipt or order confirmation needed

Would you like me to:
1. Start a return request
2. Check return eligibility
3. Connect you with customer service"
```

**Topic: Store Locator**
```
Trigger: "store near me", "location", "physical store"
Response: "I can help you find a Contoso Electronics store!

Our flagship stores are in:
- New York - 5th Avenue
- Los Angeles - Beverly Hills
- Chicago - Magnificent Mile

Would you like directions or store hours?"
```

---

## Part 4: Test the Complete Agent (5 minutes)

### Step 4.1: Test in Copilot Studio

Use the test panel with these scenarios:

**Test 1: Product Discovery**
```
User: "I need a laptop for video editing"

Expected:
- Agent searches for creative/editing laptops
- Returns CreatorStudio 16 as top match
- Highlights RTX graphics, 32GB RAM, 4K display
- Mentions price and availability
```

**Test 2: Product Comparison**
```
User: "Compare the Galaxy Pro Max and Pixel Ultra"

Expected:
- Retrieves both phones from search
- Creates comparison table
- Highlights camera differences, price difference
- Makes recommendation based on priorities
```

**Test 3: Budget Shopping**
```
User: "What can I get for under $500?"

Expected:
- Searches with price filter
- Shows available options (likely headphones, accessories)
- Explains value proposition
```

**Test 4: Technical Question**
```
User: "What does 120Hz refresh rate mean?"

Expected:
- Explains in simple terms
- Relates to user experience (smoother video, gaming)
- Mentions which products have it
```

**Test 5: Out of Stock**
```
User: "I want to buy the FitTrack Ultra"

Expected:
- Finds product
- Notes it's out of stock
- Offers to notify or suggest alternatives
```

### Step 4.2: Verify Knowledge Integration

Check that:
- [ ] Search returns relevant products
- [ ] Product details are accurate
- [ ] Filters work (category, price)
- [ ] Custom model provides quality responses
- [ ] Instructions are followed

### Step 4.3: Publish Agent

1. Click **Publish** in top right
2. Configure channels:
   - Microsoft Teams
   - Web chat
   - Custom channels
3. Test in published channel

---

## ✅ Lab Completion Checklist

- [ ] Created Azure AI Search service
- [ ] Configured product index with semantic search
- [ ] Uploaded sample product data
- [ ] Deployed custom model in Azure AI Foundry
- [ ] Created Copilot Studio agent
- [ ] Connected Azure AI Search as knowledge
- [ ] Configured custom model (BYOM)
- [ ] Wrote comprehensive instructions
- [ ] Added conversation starters
- [ ] Tested all scenarios
- [ ] Agent provides accurate product info
- [ ] Published agent

---

## 🎓 Key Takeaways

1. **Azure AI Search** enables powerful product discovery with semantic understanding
2. **BYOM** allows specialized models for domain-specific responses
3. **RAG pattern** combines search results with LLM generation
4. **Comprehensive instructions** guide consistent agent behavior
5. **Testing is critical** for quality assurance

---

## 🚀 Extension Challenges

1. **Add Vector Search:**
   - Enable vector search on the index
   - Use embeddings for semantic similarity

2. **Implement Personalization:**
   - Track user preferences
   - Remember previous purchases

3. **Add Inventory Integration:**
   - Real-time stock checking
   - Reserve items for customers

4. **Multi-language Support:**
   - Configure for multiple languages
   - Translate product content

---

## 📚 Resources

- [Azure AI Search Documentation](https://learn.microsoft.com/azure/search/)
- [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-studio/)
- [Copilot Studio Knowledge Configuration](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-search)
- [RAG Pattern Best Practices](https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview)

---

*Lab 5 Complete! Congratulations on completing all Day 2 labs!*

---

## 🏆 Course Completion

You have successfully completed all 5 labs:
1. ✅ Repair Service Declarative Agent with TypeSpec
2. ✅ Geo Locator Game Agent (Instructions-based)
3. ✅ Custom Engine Agent with M365 SDK & Semantic Kernel
4. ✅ MCP Server Deployment in Copilot Studio
5. ✅ Retail Agent with Azure AI Search & BYOM

**Next Steps:**
- Review post-read materials
- Practice for PL-400 certification
- Build your own agents!

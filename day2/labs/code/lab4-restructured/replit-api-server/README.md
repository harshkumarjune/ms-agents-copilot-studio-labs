# Contoso API Server - Lab 4 Deployment Guide

## Quick Deploy to Replit (Recommended)

### Step 1: Create Replit Account
1. Go to [replit.com](https://replit.com)
2. Sign up with Google, GitHub, or email (free tier works)

### Step 2: Create New Repl
1. Click **+ Create Repl**
2. Select **Node.js** template
3. Name it: `contoso-api-server`
4. Click **Create Repl**

### Step 3: Add Files
1. **Replace** the contents of `index.js` with the code from this folder's `index.js`
2. **Replace** the contents of `package.json` with this folder's `package.json`

### Step 4: Run the Server
1. Click the green **Run** button
2. Wait for dependencies to install
3. You'll see the server start message
4. Copy the URL from the webview (e.g., `https://contoso-api-server.yourname.repl.co`)

### Step 5: Test Your API
In a browser or Postman, try these URLs:

```
https://your-repl-url/health
https://your-repl-url/api/employees
https://your-repl-url/api/employees?search=alice
https://your-repl-url/api/inventory
https://your-repl-url/api/inventory/low-stock
https://your-repl-url/openapi.json
```

---

## Alternative: Deploy to Render.com

### Step 1: Push to GitHub
1. Create a GitHub repo
2. Push `index.js` and `package.json`

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `contoso-api`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Create Web Service**
6. Wait for deployment (2-3 minutes)
7. Copy the URL (e.g., `https://contoso-api.onrender.com`)

---

## Alternative: Deploy to Railway.app

### Step 1: Create Account
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub

### Step 2: Deploy
1. Click **New Project** → **Deploy from GitHub repo**
2. Select your repo with the API code
3. Railway auto-detects Node.js and deploys
4. Click **Settings** → **Generate Domain**
5. Copy the URL

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info and all endpoints |
| GET | `/health` | Health check |
| GET | `/openapi.json` | OpenAPI spec (for Copilot Studio) |
| GET | `/api/employees` | List all employees |
| GET | `/api/employees?search=term` | Search employees |
| GET | `/api/employees/:id` | Get employee by ID |
| GET | `/api/inventory` | List all inventory |
| GET | `/api/inventory?search=term` | Search inventory |
| GET | `/api/inventory/:sku` | Get item by SKU |
| GET | `/api/inventory/low-stock` | Get low stock items |
| POST | `/api/tickets` | Create support ticket |
| GET | `/api/tickets` | List all tickets |

---

## Connecting to Copilot Studio

### Step 1: Add Custom Connector
1. In Copilot Studio, go to **Tools**
2. Click **+ Add a tool**
3. Select **Custom connector** or **Copilot connectors**

### Step 2: Configure OpenAPI
1. Choose **Add an OpenAPI action**
2. Enter your API URL: `https://your-server-url/openapi.json`
3. Click **Next**

### Step 3: Configure Operations
1. Select which operations to enable:
   - `searchEmployees` - Search for employees
   - `getEmployee` - Get employee by ID
   - `searchInventory` - Search inventory
   - `getInventoryItem` - Get item by SKU
   - `getLowStockItems` - Get low stock items
   - `createTicket` - Create support ticket

### Step 4: Test
1. Open the Test panel
2. Try: "Find employees in the Engineering department"
3. Verify the agent calls your API

---

## Sample Test Queries for Your Agent

```
"Who is Alice Johnson?"
"Show me employees in Sales"
"What laptops do we have in inventory?"
"Are there any items out of stock?"
"Check stock levels for audio products"
"Create a ticket for IT support"
```

---

## Troubleshooting

### Server Not Starting
- Check Node.js version is 18+
- Run `npm install` manually
- Check console for errors

### Copilot Studio Can't Connect
- Verify server is running (check /health endpoint)
- Ensure URL is HTTPS (Replit provides this automatically)
- Check CORS is enabled (it is in this code)
- Try the /openapi.json URL in browser first

### API Returns Empty Results
- Check search terms match data
- Review available data in the mock arrays
- Verify query parameter names

---

*DW-104 Training | Lab 4: Custom API Connector*

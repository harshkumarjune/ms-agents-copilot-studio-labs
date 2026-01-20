# Skillable (Learn on Demand) Lab Setup Instructions
## PL-400 Training Key Configuration

**Course:** DW-104 - Microsoft 365 Agents Pro-Code Training
**Platform:** Skillable (formerly Learn on Demand Systems)

---

## 📋 Pre-Training Setup for Trainees

### Step 1: Obtain Your Training Key

Your instructor will provide a **Training Key** in one of these formats:
- Individual key: `XXXX-XXXX-XXXX-XXXX`
- Class enrollment URL: `https://labondemand.com/class/XXXXX`

### Step 2: Create/Access Skillable Account

1. **Navigate to:** https://labondemand.com

2. **New Users:**
   - Click **Register**
   - Fill in your details:
     - First Name
     - Last Name
     - Email (use your work email)
     - Create Password
   - Verify your email

3. **Existing Users:**
   - Click **Sign In**
   - Enter credentials

### Step 3: Redeem Training Key

1. After signing in, click **Redeem Training Key**
2. Enter your training key: `____-____-____-____`
3. Click **Redeem**
4. You should see the course: **DW-104: M365 Agents Pro-Code**

### Step 4: Verify Lab Access

You should now see these labs available:

| Lab | Day | Estimated Time |
|-----|-----|----------------|
| Lab 1: Repair Service Declarative Agent | Day 1 | 45 min |
| Lab 2: Geo Locator Game Agent | Day 1 | 40 min |
| Lab 3: M365 Agents SDK & Semantic Kernel | Day 1 | 45 min |
| Lab 4: MCP Server Deployment | Day 2 | 45 min |
| Lab 5: Retail Agent with AI Search | Day 2 | 45 min |

---

## 🖥️ Lab Environment Overview

### What's Pre-Configured

Each lab environment includes:

```
┌─────────────────────────────────────────────────────────────────┐
│                    LAB VIRTUAL MACHINE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Operating System: Windows 11 Pro                               │
│                                                                 │
│  Pre-Installed Software:                                        │
│  ├── Visual Studio Code (latest)                               │
│  │   └── Extensions:                                            │
│  │       ├── Microsoft 365 Agents Toolkit                       │
│  │       ├── Teams Toolkit                                      │
│  │       ├── TypeSpec for VS Code                              │
│  │       ├── Azure Tools                                        │
│  │       └── ESLint + Prettier                                  │
│  ├── Node.js 18 LTS                                            │
│  ├── Git for Windows                                            │
│  ├── Microsoft Edge (with M365 signed in)                      │
│  ├── Teams Desktop App                                          │
│  └── Azure CLI                                                  │
│                                                                 │
│  Pre-Configured Accounts:                                       │
│  ├── M365 Developer Tenant (admin@LABXXXXX.onmicrosoft.com)    │
│  ├── Azure Subscription (connected to tenant)                   │
│  └── Copilot Studio Access                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Accessing Credentials

1. In the lab interface, look for the **Resources** tab
2. Credentials are listed:
   - **M365 Admin Username:** admin@LABXXXXX.onmicrosoft.com
   - **M365 Admin Password:** [Shown in Resources]
   - **Azure Username:** Same as M365
   - **Azure Password:** Same as M365

### Lab Interface Features

```
┌────────────────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────┐ ┌─────────────────────┐  │
│ │                                      │ │   INSTRUCTIONS      │  │
│ │         VIRTUAL MACHINE              │ │                     │  │
│ │                                      │ │   Step 1: Open VS   │  │
│ │     [Your lab environment]           │ │   Code and...       │  │
│ │                                      │ │                     │  │
│ │                                      │ │   Step 2: Create    │  │
│ │                                      │ │   new project...    │  │
│ │                                      │ │                     │  │
│ │                                      │ │   ☑ Checkpoint      │  │
│ │                                      │ │                     │  │
│ └──────────────────────────────────────┘ └─────────────────────┘  │
│                                                                    │
│ [Resources] [Content] [Help] [Commands]           [Extend Time]   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Launching Labs

### Starting a Lab

1. Click on the lab you want to start
2. Review the **Lab Profile** information
3. Click **Launch Lab**
4. Wait for provisioning (typically 2-5 minutes)
5. The VM will appear when ready

### Lab Duration

| Lab | Allocated Time | Can Extend |
|-----|----------------|------------|
| All labs | 4 hours | Yes, up to 8 hours |

### Extending Lab Time

If you need more time:
1. Click **Extend Time** in the lab interface
2. Select extension duration (30 min, 1 hr, 2 hr)
3. Extensions are limited per lab session

### Saving Progress

- Labs **auto-save** every few minutes
- **Checkpoints** mark completed sections
- You can resume labs from where you left off

---

## ⚠️ Important Lab Guidelines

### Do's

✅ **Read instructions carefully** before executing steps
✅ **Use provided credentials** - don't create new accounts
✅ **Copy/paste** code from instructions panel
✅ **Check credentials** in Resources tab if sign-in fails
✅ **Ask for help** via Teams channel if stuck

### Don'ts

❌ **Don't change passwords** for lab accounts
❌ **Don't delete** pre-configured resources
❌ **Don't install** unauthorized software
❌ **Don't share** lab credentials outside the session
❌ **Don't leave** sensitive data in the environment

---

## 🔧 Troubleshooting Common Issues

### Issue: "Cannot connect to VM"

**Solutions:**
1. Refresh the browser page
2. Click **Reconnect** if available
3. Wait 2-3 minutes and try again
4. Contact instructor if persists

### Issue: "M365 sign-in fails"

**Solutions:**
1. Check Resources tab for correct credentials
2. Use InPrivate/Incognito browser window
3. Clear browser cookies for microsoft.com
4. Try signing out and back in

### Issue: "Teams app won't load agent"

**Solutions:**
1. Clear Teams cache: `%APPDATA%\Microsoft\Teams\Cache`
2. Sign out and sign in to Teams
3. Use Teams web (teams.microsoft.com) instead
4. Check sideloading is enabled in admin center

### Issue: "Azure deployment fails"

**Solutions:**
1. Verify Azure subscription is active
2. Check region/location is supported
3. Review error message in Azure portal
4. Try a different resource name

### Issue: "VS Code extension not working"

**Solutions:**
1. Reload VS Code window (Ctrl+Shift+P → "Reload Window")
2. Check extension is enabled
3. Sign out and sign in to M365 in extension
4. Reinstall extension if needed

---

## 📊 Lab Completion Tracking

### How Completion is Measured

| Criterion | Weight |
|-----------|--------|
| Checkpoints passed | 60% |
| Final validation | 30% |
| Time efficiency | 10% |

### Minimum Requirements

To pass each lab:
- Complete all required checkpoints
- Final agent/solution must be functional
- No critical errors in output

### Certification Tracking

Your lab completion will be recorded for:
- Training attendance verification
- PL-400 certification preparation
- Applied Skills assessment eligibility

---

## 📞 Getting Help During Labs

### In-Session Support

| Issue Type | Where to Get Help |
|------------|-------------------|
| Technical (VM/access) | Skillable chat support |
| Content questions | Instructor via Teams |
| Lab instructions | Raise hand feature |
| Azure/M365 issues | Microsoft Learn support |

### Support Contacts

- **Skillable Support:** Available via chat in lab interface
- **Training Coordinator:** [Provided by instructor]
- **Emergency:** Contact your instructor directly

---

## ✅ Pre-Lab Checklist

Before starting labs, verify:

- [ ] Training key redeemed successfully
- [ ] All 5 labs visible in dashboard
- [ ] Read this setup guide completely
- [ ] Understand how to access credentials
- [ ] Know how to get help if stuck
- [ ] Stable internet connection (10+ Mbps recommended)
- [ ] Modern browser (Edge, Chrome, Firefox)
- [ ] Allow popups from labondemand.com

---

## 📅 Lab Schedule

### Day 1 Labs

| Time | Lab | Focus |
|------|-----|-------|
| 1:55-2:40 | Lab 1 | Declarative Agent, TypeSpec |
| 3:35-4:15 | Lab 2 | Instructions-based Agent |
| 4:45-5:30 | Lab 3 | M365 SDK, Semantic Kernel |

### Day 2 Labs

| Time | Lab | Focus |
|------|-----|-------|
| 1:30-2:15 | Lab 4 | MCP Server, Copilot Studio |
| 4:40-5:25 | Lab 5 | Azure AI Search, BYOM |

---

*Setup guide version 1.0 | Updated January 2026*

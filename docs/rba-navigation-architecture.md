🧩 ChainCron — Role-Based Access, Security & Navigation Architecture
Overview

ChainCron is a decentralized automation marketplace where users can build, subscribe, and earn from on-chain workflows.
This document defines the user roles, privilege structure, navigation layout, and security design — aligned with the current Vercel deployment and GitHub codebase.

🎭 User Roles
Role	Description	Example Use Case
Creator	Builds and publishes automation workflows. Can integrate APIs, smart contracts, oracles.	Developer, DeFi strategist
Subscriber	Subscribes to existing workflows. Executes or schedules automations.	Retail or institutional DeFi user
Admin	Manages users, content moderation, reports, analytics, and token economics.	ChainCron Core Team
🔐 Authentication & Security Strategy
1. Login Options

Web3 Wallet Login (SSO):

MetaMask, WalletConnect, Coinbase Wallet

Wallet address acts as the unique ID for creators and subscribers.

Social & Email Login:

Sign in via Google, GitHub, Twitter (X) using OAuth 2.0.

Admin Login:

Admins can log in via email + password, stored securely in Firebase/Auth0.

Whitelisted addresses for on-chain admin privileges.

2. Credential Storage
Data Type	Storage Location	Security Notes
Wallet Address	Smart Contract / Firestore	Non-custodial — user owns keys
User Profile	Firestore	Email, display name, preferences
Workflow Metadata	Firestore + IPFS	Immutable + decentralized
API Keys (for builders)	Encrypted in Vault / Edge Function	AES-256 encryption, limited scope
Access Tokens	Secure HTTP-only cookies	Rotation every 60 min
3. Multi-Factor Authentication (MFA)

Optional for creators and admins.

Supported methods:

Email + OTP

TOTP (Google Authenticator)

WebAuthn (hardware key)

🧱 Role-Based Privileges
Creator

Can:

Access /creator dashboard

Use Builder to create new workflows

Use Compose to combine workflows

Publish workflows to marketplace

View and manage subscribers

Access analytics of workflow usage

Cannot:

Manage global settings or users

Access admin dashboard

Subscriber

Can:

View marketplace workflows

Subscribe to or purchase workflows

Manage subscriptions and automation triggers

Run simulations (risk, transparency, audit)

Access /ai-zapier, /risk-analysis, /transparency

Cannot:

Build or compose workflows

Edit or publish workflows

Admin

Can:

View all creators/subscribers

Approve or remove workflows

Access /admin dashboard

Configure networks, tokens, or reward systems

Manage bug bounties and DAO governance proposals

🧭 Navigation Architecture
Global Menu (Visible to All)

Home

Marketplace

Docs

Login / Connect Wallet

Creator Dashboard

Path: /creator

Menu Item	Description
Builder	Drag-and-drop automation builder; create workflows using smart contracts, APIs, or triggers.
Compose	Combine multiple automations into chained workflows (e.g., trigger → action → payout).
My Workflows	Manage, update, or delete published automations.
Analytics	View usage metrics, subscribers, revenue, and token rewards.
Subscriber Dashboard

Path: /dashboard

Menu Item	Description
Explore Workflows	Browse marketplace automations.
My Subscriptions	View and manage active subscriptions.
AI-Zapier	Custom AI-based automation triggers.
Risk Analysis	Analyze safety, performance, and costs of workflows.
Transparency Reports	View smart contract audits, gas fees, and history.
Admin Dashboard

Path: /admin

Menu Item	Description
User Management	Approve or restrict users.
Workflow Moderation	Approve, suspend, or feature workflows.
Analytics & Reports	Platform-wide statistics.
Network Configurations	Add supported chains or APIs.
System Logs	Access audit trails and logs.
🌐 Supported Networks

Initially supports EVM-compatible testnets, with modular expansion.

Network	Status	Notes
Ethereum (Goerli/Sepolia)	✅ Active	Base network for deployment
Polygon (Amoy)	✅ Active	Low-cost automations
Avalanche Fuji	🔜 Planned	For high-speed DeFi
Flow Testnet	🔜 Integration in progress	Prize alignment
BNB Chain Testnet	🔜 Planned	Cross-chain workflows
⚙️ Deployment Overview
Layer	Technology	Notes
Frontend	Next.js + React (Vercel)	Deployed at chaincron.vercel.app

Auth	NextAuth / Auth0	Wallet + OAuth2 SSO
Backend	Firebase Functions / Node APIs	API + webhook triggers
Data	Firestore + IPFS	Decentralized + scalable
Smart Contracts	Solidity + Hardhat	Workflow registry + token logic
Edge Security	Cloudflare + Rate Limiting	Prevent spam, DDoS
Logs & Monitoring	Logtail + Firebase Console	Real-time metrics
🧠 Summary — Access Flow Diagram
flowchart TD
    A[User Visits Site] --> B{Login Type?}
    B -->|Wallet| C[Connect via MetaMask]
    B -->|Social| D[OAuth2 Sign-In]
    B -->|Admin| E[Email + Password + MFA]
    C --> F{Role Detected?}
    D --> F
    E --> F
    F -->|Creator| G[Redirect to /creator Dashboard]
    F -->|Subscriber| H[Redirect to /dashboard]
    F -->|Admin| I[Redirect to /admin]

🔒 Future Enhancements

Role-based JWT with expiring scopes

Decentralized identity (DID) support

Zero-knowledge proof login for privacy-focused users

AI-based fraud detection on workflows

📘 Version

Document Version: 1.2
Last Updated: October 2025
Maintainer: @new-world-coder
Deployment: chaincron.vercel.app
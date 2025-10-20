# Forte Cron - Decentralized Task Scheduler Marketplace

A marketplace where developers create automation workflows and users subscribe with one click. Built on Forte blockchain for decentralized task scheduling and DeFi automation.

## 🚀 Features

- **Marketplace UI**: Browse, search, and filter automation workflows
- **Web3 Integration**: Connect with wallets using RainbowKit and wagmi
- **Smart Contracts**: Deploy workflow registry, subscription management, and execution systems
- **Modern UI**: Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Web3**: wagmi, viem, @rainbow-me/rainbowkit
- **Blockchain**: Forte testnet
- **Smart Contracts**: Solidity with OpenZeppelin security features

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/new-world-coder/ChainCron.git
   cd ChainCron
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t forte-cron .

# Run the container
docker run -p 3000:3000 forte-cron
```

### Environment Variables for Docker

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
FORTE_RPC_URL=https://rpc.forte-chain.io
NEXT_PUBLIC_WORKFLOW_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_SUBSCRIPTION_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_WORKFLOW_EXECUTOR_ADDRESS=0x...
NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS=0x...
```

## ☁️ Vercel Deployment

### Automatic Deployment

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Deploy automatically

2. **Environment Variables**
   Set these in your Vercel dashboard:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
   FORTE_RPC_URL
   NEXT_PUBLIC_WORKFLOW_REGISTRY_ADDRESS
   NEXT_PUBLIC_SUBSCRIPTION_MANAGER_ADDRESS
   NEXT_PUBLIC_WORKFLOW_EXECUTOR_ADDRESS
   NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS
   ```

### Manual Deployment with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

## 🏗 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Smart Contract Development

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Forte testnet
npx hardhat run scripts/deploy.js --network forteTestnet
```

## 📁 Project Structure

```
├── app/                 # Next.js app router
│   ├── marketplace/    # Marketplace page
│   ├── dashboard/      # User dashboard
│   └── creator/        # Creator dashboard
├── components/         # React components
├── contracts/          # Solidity smart contracts
├── hooks/             # Custom Web3 hooks
├── lib/               # Utilities and mock data
└── types/             # TypeScript definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/new-world-coder/ChainCron)
- [Forte Blockchain](https://forte-chain.io)
- [Next.js Documentation](https://nextjs.org/docs)

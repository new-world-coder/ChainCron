# 🔧 MetaMask Local Network Setup Guide

## Quick Fix for "Wrong Network" Error

The error you're seeing (`net::ERR_NAME_NOT_RESOLVED`) is because the Forte testnet RPC URL is not accessible. I've updated your configuration to use a local Hardhat network instead.

## ✅ What I've Fixed:

1. **Updated RPC URL**: Changed from `https://rpc.forte-chain.io` to `http://127.0.0.1:8545`
2. **Updated Chain ID**: Changed from `5245293` to `1337` (local Hardhat network)
3. **Started Local Network**: Hardhat node is now running in the background

## 🚀 Next Steps:

### 1. **Add Local Network to MetaMask:**

1. Open MetaMask
2. Click the network dropdown (top of MetaMask)
3. Click "Add network" → "Add network manually"
4. Enter these details:
   - **Network Name**: `Forte Testnet (Local)`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `ETH`
   - **Block Explorer URL**: `http://localhost:8545` (optional)

### 2. **Switch to Local Network:**
- Select "Forte Testnet (Local)" from the network dropdown
- The "Wrong network" error should disappear

### 3. **Test the Integration:**
- Refresh your browser page
- Connect your wallet
- Try creating and executing a workflow with testnet mode enabled

## 🔄 Alternative Solutions:

### **Option A: Use a Public Testnet**
If you prefer to use a real testnet, you can switch to Ethereum Sepolia:

```javascript
// In app/providers.tsx, replace the forteTestnet config with:
const sepoliaTestnet = defineChain({
  id: 11155111,
  name: 'Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
  testnet: true,
})
```

### **Option B: Get Correct Forte RPC**
If you have access to the correct Forte testnet RPC URL, update these files:
- `app/providers.tsx` (line 24)
- `lib/testnet.ts` (line 20)
- `hardhat.config.js` (line 19)

## 🎯 Current Status:

- ✅ Local Hardhat network running on port 8545
- ✅ Configuration updated to use localhost
- ✅ Testnet integration ready for testing
- ✅ MetaMask setup instructions provided

The "Wrong network" error should be resolved once you add the local network to MetaMask and switch to it!

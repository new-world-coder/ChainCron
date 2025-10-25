# 🚨 Quick Fix: Stuck MetaMask Dialog

## Problem
MetaMask dialog showing "Connecting to Hardhat Local" and won't close.

## ✅ Solution (30 seconds)

### Step 1: Refresh MetaMask
1. **Right-click** the MetaMask icon in your browser toolbar
2. Click **"Inspect popup"** (Chrome/Edge) or **"Inspect"** (Firefox)
3. In the console that opens, type: `window.location.reload()`
4. Press **Enter**

Dialog will close immediately!

### Step 2: Add Sepolia Network
1. Click MetaMask icon → Click **"Network"** dropdown
2. Click **"Add network"** → **"Add network manually"**
3. Enter:
   ```
   Network Name: Sepolia
   RPC URL: https://rpc.sepolia.org
   Chain ID: 11155111
   Currency Symbol: ETH
   Block Explorer: https://sepolia.etherscan.io
   ```
4. Click **"Save"**
5. Switch to **Sepolia** network

### Step 3: Try Again
1. Go back to ChainCron
2. Click **"Connect Wallet"**
3. Approve the connection

---

## 🎯 Why This Happens

The app is configured for Sepolia, but MetaMask has cached a "Hardhat Local" connection. Refreshing MetaMask clears the cache.

---

## 📱 Alternative: Hard Refresh Page

If the above doesn't work:
- **Windows/Linux**: Press `Ctrl + Shift + R`
- **Mac**: Press `Cmd + Shift + R`

This clears the browser cache and forces a fresh load.

---

## 💡 Prevention

**Always add Sepolia network to MetaMask before connecting** to avoid this issue.

See full guide: `docs/WALLET_CONNECTION_FIX.md`

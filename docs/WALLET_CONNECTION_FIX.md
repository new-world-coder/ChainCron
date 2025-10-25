# 🔧 Wallet Connection Fix for Vercel Deployment

## 🚨 URGENT: Dialog Stuck on "Connecting to Hardhat Local"

**If your MetaMask dialog is stuck and won't close:**

1. **Right-click the MetaMask icon** in your browser toolbar
2. **Click "Inspect popup"** to open MetaMask's DevTools
3. **In the console**, type: `window.location.reload()` and press Enter
4. This will refresh MetaMask and close the stuck dialog

**Then follow the steps below to add Sepolia network.**

---

## ⚠️ Issue

When connecting MetaMask to the ChainCron Vercel deployment, you may see the error:

> **"We can't connect to Hardhat Local"**

This happens because your MetaMask is trying to connect to a local Hardhat network (chain ID 1337) that doesn't exist on Vercel.

---

## ✅ Solution

### **Add Sepolia Testnet to MetaMask:**

1. **Open MetaMask** in your browser

2. **Click the network dropdown** (shows current network at the top)

3. **Click "Add network"** → **"Add network manually"**

4. **Enter these Sepolia Testnet details:**
   ```
   Network Name: Sepolia
   RPC URL: https://rpc.sepolia.org
   Chain ID: 11155111
   Currency Symbol: ETH
   Block Explorer URL: https://sepolia.etherscan.io
   ```

5. **Click "Save"**

6. **Switch to Sepolia** network in MetaMask

7. **Refresh the ChainCron page** and try connecting again

---

## 🎯 Quick Setup Checklist

- [ ] Added Sepolia network to MetaMask
- [ ] Switched to Sepolia network
- [ ] Refreshed the ChainCron page
- [ ] Clicked "Connect Wallet" button
- [ ] Approved the connection in MetaMask

---

## 📊 Network Comparison

| Feature | Hardhat Local | Sepolia Testnet |
|---------|---------------|-----------------|
| **Chain ID** | 1337 | 11155111 |
| **RPC URL** | http://127.0.0.1:8545 | https://rpc.sepolia.org |
| **Available** | Local machine only | Public testnet |
| **ETH Source** | Auto-generated | Need faucet |
| **Explorer** | Local | https://sepolia.etherscan.io |

---

## 🚰 Get Test ETH for Sepolia

If you need Sepolia test ETH:

1. **Sepolia Faucet**: https://sepoliafaucet.com/
2. **Infura Faucet**: https://www.infura.io/faucet/sepolia
3. **Alchemy Faucet**: https://sepoliafaucet.com/

Just enter your wallet address and request test ETH!

---

## 🔄 If You Still Have Issues

### Option 1: Check Network in Console

Open browser console (F12) and look for:
```
🔗 ChainCron Network Configuration:
- Chain ID: 11155111
- Chain Name: Sepolia
```

### Option 2: Manual Network Switch

If MetaMask doesn't auto-switch:
1. Click the MetaMask extension
2. Click "Switch network" when prompted
3. Select "Sepolia"

### Option 3: Reset MetaMask Cache (If Dialog is Stuck)

If the "Connecting to Hardhat Local" dialog is stuck and won't close:

**Method A: Refresh MetaMask**
1. Right-click the MetaMask extension icon in your browser
2. Click "Inspect popup" (Chrome) or "Inspect" (Firefox)
3. In the DevTools console, type: `window.location.reload()`
4. Press Enter

**Method B: Reload the Page**
1. Close the stuck MetaMask dialog (if possible)
2. Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac) to hard refresh
3. Clear browser cache if needed

**Method C: Reset MetaMask Connection**
1. Click the MetaMask extension icon
2. Click the three dots (⋮) menu
3. Go to Settings → Advanced → Reset Account (this only resets your connection history)
4. Refresh the ChainCron page
5. Try connecting again

**Method D: Full Reset (Last Resort)**
1. Click MetaMask extension icon
2. Settings → Advanced → Reset Account
3. Go back to ChainCron
4. Click "Connect Wallet" again
5. Approve the connection when prompted

---

## 📝 Why This Happens

The ChainCron Vercel deployment is configured to use **Sepolia testnet**, which is a public testnet that anyone can connect to. However, if you've been testing locally with Hardhat, your MetaMask may still be configured for the local network.

**The fix**: Simply add the Sepolia network to MetaMask and switch to it before connecting.

---

## ✅ Current Configuration

ChainCron on Vercel is configured with:
- **Network**: Ethereum Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://rpc.sepolia.org
- **Explorer**: https://sepolia.etherscan.io

This is a stable, public testnet perfect for testing smart contract workflows!

---

## 🎉 Once Connected

After successfully connecting to Sepolia:
- ✅ Wallet balance will show (if you have Sepolia ETH)
- ✅ You can test workflow creation
- ✅ View execution logs
- ✅ Monitor transaction status on the Sepolia explorer

**Need help?** Check the MetaMask setup guide in the docs or open an issue on GitHub.

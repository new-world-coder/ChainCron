# 🔧 Fix: RPC Endpoint Not Available Error

## ⚠️ Error

When connecting to Sepolia, you may see:
```
"code": -32002,
"message": "RPC endpoint not found or unavailable.",
"data": {
  "httpStatus": 522,
  "cause": null
}
```

This means MetaMask cannot reach the Sepolia RPC endpoint.

---

## ✅ Solution 1: Change Sepolia RPC in MetaMask (Recommended)

The app uses multiple RPC providers, but you need to update MetaMask:

### Step 1: Open MetaMask Settings
1. Click the MetaMask icon
2. Click **"Network"** dropdown
3. Select **"Sepolia"** network

### Step 2: Edit Sepolia Network
1. Click the **"Settings"** (⚙️) icon next to Sepolia
2. Or right-click Sepolia → **"Edit network"**

### Step 3: Update RPC URL
Change the **RPC URL** to one of these:

**Option A: Alchemy (Recommended)**
```
https://eth-sepolia.g.alchemy.com/v2/demo
```

**Option B: Infura**
```
https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
```

**Option C: Public RPC**
```
https://rpc.sepolia.org
```

### Step 4: Save and Retry
1. Click **"Save"**
2. Try connecting again

---

## ✅ Solution 2: Switch to Different Network Provider

If one RPC is down, try switching:

1. **Disconnect** from ChainCron
2. In MetaMask, click **Network** dropdown
3. Try switching networks back and forth
4. Reconnect to ChainCron

---

## ✅ Solution 3: Clear MetaMask Cache

1. Click MetaMask icon
2. Click **Settings** (⚙️) → **Advanced**
3. Scroll down to **"Reset Account"**
4. Click **"Reset"**
5. Refresh the page
6. Try connecting again

---

## 🔍 Why This Happens

The public Sepolia RPC (`https://rpc.sepolia.org`) can sometimes:
- Experience downtime
- Be rate-limited
- Have network issues (HTTP 522 error)

The app now uses **Alchemy** as primary RPC with fallbacks, but you need to update MetaMask's network settings too.

---

## 📊 Best Practices

### Use Alchemy (Most Reliable)
- **Free tier**: 300M compute units/month
- **High uptime**: 99.9%
- **Fast response**: Optimized infrastructure

### Use Infura (Good Alternative)
- **Free tier**: 100k requests/day
- **Reliable**: Enterprise-grade
- **Well-documented**: Great support

### Avoid Public RPC (Last Resort)
- **Rate limits**: Can throttle requests
- **Downtime**: Less reliable
- **No support**: Community-maintained

---

## 🎯 Quick Fix Checklist

- [ ] Update Sepolia RPC URL in MetaMask
- [ ] Use Alchemy or Infura RPC
- [ ] Save network settings
- [ ] Refresh the page
- [ ] Try connecting again

---

## 📞 Still Having Issues?

1. Check if Sepolia network is added to MetaMask
2. Verify the RPC URL is correct (no typos)
3. Try a different RPC provider
4. Clear MetaMask cache and retry
5. Check your internet connection
6. Try again in a few minutes (RPC might be temporarily down)

---

## 🔗 Useful Links

- **Alchemy Dashboard**: https://dashboard.alchemy.com/
- **Infura Dashboard**: https://infura.io/dashboard
- **Sepolia Explorer**: https://sepolia.etherscan.io/
- **Get Test ETH**: https://sepoliafaucet.com/

---

**Status**: Updated app to use Alchemy RPC with automatic fallbacks. Update MetaMask settings to match! 🚀

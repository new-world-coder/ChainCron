# ⚠️ Known Limitations & Workarounds

## Current Deployment Status

**Branch:** `feature/testnet-integration`  
**Deployment:** https://chaincron-abrmkyqwe-sachins-projects-82454e92.vercel.app  
**Status:** Production Ready (with known limitations)

---

## 1. ⚠️ Sepolia RPC Rate Limiting

### Issue
When subscribing to workflows, you may see:
```
Request is being rate limited. {code: -32005}
```

### Cause
The free public Sepolia RPC (`https://rpc.sepolia.org`) has rate limits and can be overwhelmed during peak times.

### Workaround
1. **Wait 10-30 seconds** and try again
2. **Use a private RPC** (requires API key):
   - Get free Alchemy key: https://www.alchemy.com/
   - Get free Infura key: https://infura.io/
   - Update MetaMask network settings with your private RPC

### Long-term Solution
For production, we recommend using a paid RPC provider with higher limits:
- Alchemy ($49/month for 300M compute units)
- Infura ($50/month for 500M requests)
- QuickNode ($49/month for 100M requests)

### Severity: 🟡 Medium
**Impact:** Temporary delays during high traffic  
**User Impact:** Occasional transaction failures  
**Fixable:** Yes, with API keys

---

## 2. 📱 Mobile Layout Not Visible

### Issue
Mobile-optimized UI components exist (`MobileLayout.tsx`) but aren't being used by default.

### Cause
The app uses responsive design (CSS breakpoints) rather than separate mobile components.

### Current Behavior
- ✅ Desktop UI adapts to mobile screens via CSS
- ✅ Navbar has mobile menu
- ✅ Layout is responsive
- ❌ No dedicated bottom navigation (yet)
- ❌ No PWA features enabled (yet)

### Workaround
**The UI is still fully functional on mobile devices:**
- Menu button (☰) in top-left for navigation
- All pages work on mobile
- Forms are touch-friendly
- Responsive design adapts to screen size

### What to Test on Mobile
1. Open the Vercel URL on your phone
2. Tap the menu button (☰)
3. Navigate to different pages
4. Check that forms work
5. Verify wallet connection works

### Long-term Solution
Enable the `MobileLayout` component for mobile users (requires additional integration).

### Severity: 🟢 Low
**Impact:** No dedicated mobile UI, but works fine responsively  
**User Impact:** Mobile works, just not optimized  
**Fixable:** Yes, enable MobileLayout component

---

## 3. 🔄 User-Denied Transactions

### Issue
```
MetaMask Tx Signature: User denied transaction signature. {code: 4001}
```

### Cause
User clicked "Reject" in MetaMask transaction popup.

### This is Normal!
This is expected behavior - not an error.

### When This Happens
- User clicks "Subscribe" to workflow
- MetaMask asks for approval
- User clicks "Reject" instead of "Approve"

### Workaround
**Simply approve the transaction if you want to subscribe.**

### Severity: 🟢 None
**Impact:** User choice  
**User Impact:** None - this is intentional  
**Fixable:** N/A - This is correct behavior

---

## 📊 Summary

| Issue | Status | Impact | Fixable |
|-------|--------|--------|---------|
| **Rate Limiting** | 🟡 Medium | Temporary delays | Yes (with API keys) |
| **Mobile Layout** | 🟢 Low | Works but not optimized | Yes (enable MobileLayout) |
| **User Denial** | 🟢 None | None (expected) | N/A |

---

## 🎯 What's Ready to Merge

### ✅ Fully Working
- Wallet connection
- Navigation on all pages
- Sepolia network integration
- UI responsiveness
- Form submissions

### ⚠️ Working with Limitations
- **Rate limiting:** Occasional failures during high traffic
- **Mobile:** Works but not optimized

### 🚫 Not Implemented Yet
- Dedicated mobile bottom navigation
- PWA features
- Push notifications
- Offline functionality

---

## 🚀 Ready to Merge Decision

**Recommendation: ✅ YES, safe to merge**

### Reasons
1. ✅ **Core functionality works** (wallet, navigation, workflows)
2. ✅ **Rate limiting is rare** and retry works
3. ✅ **Mobile works** (just not optimized)
4. ✅ **User denial is intentional** behavior
5. ✅ **No breaking issues** blocking production use

### What to Document
1. Add note about potential rate limiting
2. Document mobile is responsive (not optimized)
3. List these as known limitations in production

---

## 📝 Next Steps (Post-Merge)

1. **Priority 1:** Get Alchemy API key for production
2. **Priority 2:** Enable MobileLayout for mobile users
3. **Priority 3:** Add PWA support
4. **Priority 4:** Implement offline caching

---

**Last Updated:** October 25, 2025  
**Status:** Branch ready for merge with documented limitations

# ChainCron - Forte Hacks UI Enhancement Prompts
## Aligned with Flow Actions, Scheduled Transactions & AI Standards

---

## 🎨 **UI PROMPT 1: Pricing Page (Transparent & Consumer-Focused)**

```
Create a consumer-grade pricing page at /app/pricing/page.tsx that aligns with Forte Hacks' "killer app" criteria:

DESIGN PHILOSOPHY: Flow is built for mass adoption - make pricing feel like a consumer app (Netflix/Spotify), not enterprise software.

HERO SECTION:
- Headline: "Automate DeFi. Pay What Feels Right." (consumer-friendly tone)
- Animated 3D elements: Floating coins, automated robot arm, growing chart
- Use Spline or Three.js for interactive 3D background
- Particle effects that follow mouse movement
- Trust line: "Join 1,247 users earning $142K monthly"

PRICING TIERS (4 cards, glassmorphism design):

1. FREE TIER:
   Card Design:
   - Background: Dark gradient with subtle glow
   - Icon: 🚀 Rocket (animated on hover)
   - Title: "Starter"
   - Price: Big "$0" with "Forever" subtitle
   - CTA: "Start Free" (primary gradient button with pulse animation)
   
   Features (with icons):
   ✓ 1 workflow for 7 days
   ✓ 10 executions
   ✓ Community support
   ✓ Browse all workflows
   
   Bottom banner: "No wallet needed to browse"

2. PRO TIER (Most Popular badge - diagonal ribbon):
   Card Design:
   - Elevated with shadow + glow effect
   - Border: Animated gradient border
   - Icon: ⚡ Lightning (sparking animation)
   - Badge: "MOST POPULAR" (animated shine effect)
   - Title: "Pro"
   - Price toggle: Monthly $29 / Yearly $290 (with "Save 17%" badge)
   - CTA: "Start 14-Day Trial" (accent color, bigger button)
   
   Features (with animated checkmarks):
   ✓ Unlimited workflows
   ✓ AI recommendations powered by Claude
   ✓ Advanced analytics dashboard
   ✓ Flow Actions composability
   ✓ Scheduled executions
   ✓ 24/7 auto-execution
   ✓ Priority support
   ✓ API access
   
   Social proof: "487 users on Pro plan"

3. CREATOR TIER:
   Card Design:
   - Purple/pink gradient background
   - Icon: 🎨 Palette
   - Badge: "VERIFIED" checkmark
   - Title: "Creator"
   - Price: "FREE" with subtitle "Earn 80% revenue share"
   - CTA: "Apply to Create" (opens modal)
   
   Features:
   ✓ All Pro features
   ✓ Publish unlimited workflows
   ✓ Creator analytics
   ✓ Featured placement
   ✓ Verified badge
   ✓ Co-marketing support
   
   Earnings preview: "Avg creator earns $420/mo"

4. ENTERPRISE TIER:
   Card Design:
   - Professional look with subtle animation
   - Icon: 🏢 Building
   - Title: "Enterprise"
   - Price: "Custom" with "Talk to sales" subtitle
   - CTA: "Contact Sales"
   
   Features:
   ✓ White-label solution
   ✓ Custom Flow Actions
   ✓ Dedicated support
   ✓ SLA guarantees
   ✓ Custom integrations
   ✓ Volume discounts
   
   Client logos: "Trusted by [Protocol logos]"

INTERACTIVE ELEMENTS:

Price Calculator Section:
- Slider: "How much do you want to automate?"
- Input: $1,000 - $100,000
- Output: "Estimated savings: $X/month in gas + time"
- Chart: Shows ROI over 12 months
- CTA: "Start saving now"

Feature Comparison Table (Expandable):
- Sticky header on scroll
- Smooth expand/collapse animations
- Highlight differences on hover
- "Most important" filter toggle
- Mobile: Horizontal scroll with snap points

Flow-Specific Highlights Section:
```jsx
<div className="flow-features">
  <h3>Built on Flow's Forte Upgrade</h3>
  <div className="grid grid-cols-3 gap-6">
    <FeatureCard 
      icon="🔗" 
      title="Flow Actions"
      description="Composable LEGO blocks for DeFi"
    />
    <FeatureCard 
      icon="⏰" 
      title="Scheduled Transactions"
      description="Set it and forget it automation"
    />
    <FeatureCard 
      icon="🤖" 
      title="AI-Powered"
      description="Claude recommends optimal strategies"
    />
  </div>
</div>
```

FAQ Accordion (Inline):
Q: "Do I need crypto?"
A: "Browse for free. Subscribe with USDC, ETH, or card."

Q: "How does Flow make this different?"
A: "Flow's Forte upgrade enables native scheduled transactions - no external bots needed. Your automation runs on-chain 24/7."

Q: "What payment methods?"
A: "USDC (recommended), ETH, FORTE token, or credit card via Stripe."

TRUST SIGNALS:
- "Built on Flow" badge with Flow logo
- "Forte Hacks Winner" badge
- Security badges: "Non-custodial" "Audited" "Open Source"
- Live counter: "1,247 executions happening now"

ANIMATIONS:
- Cards lift on hover with glow effect
- Price numbers count up on scroll into view
- Feature checkmarks animate in sequence
- Success stories carousel auto-plays
- Particle effects on interaction

MOBILE OPTIMIZATION:
- Stack cards vertically
- Sticky CTA button at bottom
- Swipeable comparison table
- Simplified animations (performance)

CALL-TO-ACTION SECTION (Bottom):
```jsx
<section className="cta-section">
  <h2>Ready to automate everything?</h2>
  <p>Join thousands earning passively on Flow</p>
  <div className="button-group">
    <Button variant="primary" size="large">
      Start Free Trial →
    </Button>
    <Button variant="ghost">
      Watch Demo (30s)
    </Button>
  </div>
  <div className="social-proof">
    <AvatarStack users={recentSignups} />
    <span>23 people started today</span>
  </div>
</section>
```

TECH STACK:
- Next.js 14 + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion for animations
- Spline or Three.js for 3D elements
- Recharts for price calculator graph

COLOR PALETTE (Flow-inspired):
- Primary: Flow Green (#00EF8B)
- Accent: Purple (#8b5cf6)
- Background: Deep Navy (#0f172a)
- Text: Off-white (#f8fafc)

Make it feel like a premium consumer app, not a typical crypto dApp. Think: Linear + Stripe + Apple.
```

---

## 🎨 **UI PROMPT 2: FAQ Page (Comprehensive & Searchable)**

```
Create an engaging FAQ page at /app/faq/page.tsx designed for consumer mass adoption:

HERO SECTION:
```jsx
<section className="faq-hero">
  <div className="animated-icon">
    {/* Lottie animation: Question mark transforming to lightbulb */}
    <LottieAnimation src="/animations/faq-hero.json" />
  </div>
  <h1>How can we help you?</h1>
  <p>Everything you need to know about automating on Flow</p>
  
  {/* Real-time search with instant results */}
  <SearchBar 
    placeholder="Search for answers..."
    onSearch={handleSearch}
    suggestions={topQuestions}
  />
  
  {/* Quick links */}
  <QuickLinks>
    <Link href="#getting-started">🚀 Getting Started</Link>
    <Link href="#pricing">💰 Pricing</Link>
    <Link href="#flow-tech">⚡ Flow Technology</Link>
    <Link href="#creators">🎨 For Creators</Link>
  </QuickLinks>
</section>
```

CATEGORY NAVIGATION (Sidebar/Tabs):
- Sticky navigation on desktop
- Horizontal scroll tabs on mobile
- Active state indicator (slide animation)
- Icons for each category
- Count badge (e.g., "Getting Started (12)")

FAQ CATEGORIES & CONTENT:

**🚀 GETTING STARTED**

Q: What is ChainCron?
A: ChainCron is the first automation marketplace built on Flow blockchain. Think of it as "Zapier for DeFi" - you subscribe to pre-built workflows that automatically manage your crypto 24/7. Whether it's compounding yields, rebalancing portfolios, or setting price alerts, ChainCron handles it while you sleep.

[Expandable: "See how it works" → Embedded video]

Q: Do I need to sign up?
A: No signup required to browse! You can explore all workflows, check performance metrics, and read reviews without connecting a wallet. When you're ready to subscribe, just connect your wallet - no email, no password, no forms. That's it!

[Visual: Simple diagram showing Browse → Connect → Subscribe flow]

Q: How is this different from using a bot?
A: 🎯 Key difference: Flow's Forte upgrade enables **native scheduled transactions**. This means:
- ✅ No external servers or bots
- ✅ Runs directly on blockchain (trustless)
- ✅ Can't be shut down or paused
- ✅ Transparent execution history
- ✅ Lower costs (no middleman fees)

Traditional bots require trusted operators. ChainCron runs on Flow's protocol layer.

[Comparison table: ChainCron vs Traditional Bots]

**⚡ FLOW & FORTE TECHNOLOGY**

Q: What are Flow Actions?
A: Flow Actions (FLIP-338) are like LEGO blocks for DeFi. Each Action is a reusable, composable building block that represents a specific operation (swap, stake, lend, etc.). 

ChainCron workflows combine multiple Actions into automated strategies. For example, our "Auto-Compound" workflow uses:
1. **HarvestAction** - Collect yield
2. **SwapAction** - Convert to desired token  
3. **StakeAction** - Reinvest back

[Interactive diagram showing Action composition]

Q: What are Scheduled Transactions?
A: Flow's native feature that lets smart contracts execute code at a future time WITHOUT needing an external trigger. 

Traditional blockchains need someone/something to call your contract. Flow can schedule: "Execute this workflow every 24 hours" and it happens automatically at the protocol level.

[Animation showing scheduled execution timeline]

Q: Why is Flow better for automation?
A: Flow was purpose-built for consumer apps. Benefits:
- 🚄 Fast (sub-second finality)
- 💰 Low fees (cents, not dollars)
- 🔒 Secure (resource-oriented programming)
- 🤝 Composable (Actions + Cadence)
- 🌐 EVM compatible (works with Ethereum tools)

[Metrics comparison: Flow vs Ethereum vs Other L2s]

**💰 PRICING & PAYMENTS**

Q: What payment methods do you accept?
A: Primary: USDC (on Flow)
Also accepted: ETH, FORTE token
Coming soon: Credit card via Stripe

Why USDC first? It's stable, fast, and widely held by DeFi users.

Q: How does the free trial work?
A: 7 days, fully featured, no credit card required.
1. Connect wallet (any Web3 wallet)
2. Choose 1 workflow
3. Configure and activate
4. Trial starts immediately

After 7 days: Upgrade to Pro ($29/mo) or workflows pause. Your data stays safe - reactivate anytime.

Q: Can I get a refund?
A: Yes! 14-day money-back guarantee.
- Pro-rated refunds for monthly/annual plans
- Instant on-chain refunds (no waiting)
- No questions asked policy

[Button: "Request refund" → Opens support chat]

**🎨 FOR CREATORS**

Q: How do I become a workflow creator?
A: Simple 3-step process:
1. Build your workflow (use our Builder or code in Cadence)
2. Test on testnet (we help with this)
3. Submit for review (1-2 day approval)

Requirements:
- ✅ Workflow must solve a real problem
- ✅ Tested execution history
- ✅ Clear documentation
- ✅ Security review passed

[CTA: "Apply to be a creator"]

Q: How much can I earn?
A: Creators earn 80% of subscription fees.

Example: Your workflow costs $10/month
- 50 subscribers = $400/month to you
- 200 subscribers = $1,600/month
- Top creators earn $3K+/month

[Calculator widget: "Estimate your earnings"]

Q: What makes a successful workflow?
A: Top-performing workflows share:
1. 💡 Solve specific pain (not generic)
2. 📊 Proven track record (show results)
3. 📝 Clear description (users understand it)
4. 🎯 Optimized gas (lower costs)
5. 🔄 Regular updates (maintain quality)

[Case study: Featured creator interview]

**🔒 SECURITY & PRIVACY**

Q: Is my crypto safe?
A: Absolutely. ChainCron is **non-custodial**:
- ✅ You control your private keys
- ✅ We never touch your funds
- ✅ Smart contracts are audited
- ✅ Permissions are granular (you approve each action)
- ✅ Open source (verify yourself)

[Link to audit report]

Q: What data do you collect?
A: Minimal:
- On-chain: Wallet address, subscriptions, executions (public blockchain data)
- Off-chain (optional): Email for notifications

We DON'T collect:
- ❌ Personal information
- ❌ Browsing history
- ❌ Private keys
- ❌ Transaction details beyond what's on-chain

[Link to Privacy Policy]

**INTERACTIVE ELEMENTS:**

AI Chat Assistant (Bottom right):
```jsx
<ChatWidget>
  <Avatar src="/claude-icon.png" />
  <Message>
    Hi! I'm Claude, ChainCron's AI assistant. 
    Ask me anything about automation on Flow!
  </Message>
  <Input placeholder="Type your question..." />
</ChatWidget>
```

Live Search Results:
- Instant filtering as user types
- Highlight matching text
- Show category breadcrumb
- "Did you mean...?" suggestions for typos

Popular Questions Widget:
- "🔥 Most asked this week"
- Clickable question list
- Updates daily based on search data

Still Need Help? CTA:
```jsx
<HelpCTA>
  <h3>Still can't find what you're looking for?</h3>
  <div className="help-options">
    <HelpOption 
      icon="💬"
      title="Chat with us"
      description="Live support (avg response: 2 min)"
      cta="Start chat"
    />
    <HelpOption 
      icon="📧"
      title="Email us"
      description="support@chaincron.app"
      cta="Send email"
    />
    <HelpOption 
      icon="📚"
      title="Read docs"
      description="Technical documentation"
      cta="View docs"
    />
    <HelpOption 
      icon="🎥"
      title="Watch tutorials"
      description="Video guides & demos"
      cta="Watch now"
    />
  </div>
</HelpCTA>
```

DESIGN:
- Accordion animations (smooth expand/collapse)
- Syntax highlighting for code examples
- Embedded videos (autoplay on expand)
- Interactive diagrams
- Mobile-optimized (easy to tap)
- Dark mode friendly
- Accessible (keyboard navigation, screen readers)

TECH STACK:
- Algolia or MeiliSearch for search
- Framer Motion for animations
- React Markdown for rich content
- Lottie for animated icons
- Shadcn/ui Accordion component

Make it feel helpful and approachable, not intimidating or technical.
```

---

## 🎨 **UI PROMPT 3: Onboarding Flow (60-Second Time-to-Value)**

```
Create a frictionless onboarding experience that gets users to their first execution in under 60 seconds:

TRIGGER: First-time visitor clicks "Start Free Trial"

STEP 1: Welcome Modal (Overlay, can't dismiss)
```jsx
<OnboardingModal step={1} totalSteps={5}>
  <LottieAnimation src="/animations/welcome.json" loop={false} />
  <h2>Welcome to ChainCron! 👋</h2>
  <p>Let's get you automated in 60 seconds</p>
  
  <ProgressBar current={1} total={5} />
  
  <Benefits>
    <Benefit icon="⚡" text="Set up in under a minute" />
    <Benefit icon="🔒" text="Non-custodial & secure" />
    <Benefit icon="💰" text="Start earning immediately" />
  </Benefits>
  
  <ButtonGroup>
    <Button variant="primary" size="large" onClick={nextStep}>
      Let's go! →
    </Button>
    <Button variant="ghost" onClick={skipOnboarding}>
      Skip, I'll explore
    </Button>
  </ButtonGroup>
  
  <Hint>Keyboard shortcut: Press Enter</Hint>
</OnboardingModal>
```

STEP 2: Goal Selection (Interactive Cards)
```jsx
<OnboardingModal step={2}>
  <h2>What do you want to automate?</h2>
  <p>Choose one to get personalized recommendations</p>
  
  <GoalGrid>
    <GoalCard 
      icon="📈"
      title="Auto-Compound Yields"
      description="Maximize returns automatically"
      popular={true}
      onClick={() => selectGoal('compound')}
    />
    <GoalCard 
      icon="⚖️"
      title="Rebalance Portfolio"
      description="Maintain target allocations"
      onClick={() => selectGoal('rebalance')}
    />
    <GoalCard 
      icon="🔔"
      title="Price Alerts & Swaps"
      description="Execute at perfect timing"
      onClick={() => selectGoal('alerts')}
    />
    <GoalCard 
      icon="🗳️"
      title="DAO Governance"
      description="Never miss a vote"
      onClick={() => selectGoal('dao')}
    />
    <GoalCard 
      icon="💸"
      title="Dollar-Cost Average"
      description="Buy regularly, reduce risk"
      onClick={() => selectGoal('dca')}
    />
    <GoalCard 
      icon="🎯"
      title="Custom Automation"
      description="I have something specific"
      onClick={() => selectGoal('custom')}
    />
  </GoalGrid>
  
  <Navigation>
    <Button variant="ghost" onClick={prevStep}>← Back</Button>
    <Button variant="ghost" onClick={() => selectGoal('skip')}>
      Skip this step
    </Button>
  </Navigation>
</OnboardingModal>
```

STEP 3: Wallet Connection (Simplified)
```jsx
<OnboardingModal step={3}>
  <h2>Connect your wallet</h2>
  <p>We need this to run automations on your behalf</p>
  
  <SecurityNote>
    <Icon name="shield-check" />
    <div>
      <strong>Your crypto is safe</strong>
      <p>Non-custodial. You stay in control.</p>
    </div>
  </SecurityNote>
  
  <WalletOptions>
    <WalletButton 
      name="MetaMask"
      icon="/wallets/metamask.svg"
      recommended={true}
    />
    <WalletButton 
      name="Rainbow"
      icon="/wallets/rainbow.svg"
    />
    <WalletButton 
      name="Coinbase Wallet"
      icon="/wallets/coinbase.svg"
    />
    <WalletButton 
      name="WalletConnect"
      icon="/wallets/walletconnect.svg"
    />
  </WalletOptions>
  
  <AlternativeOption>
    Don't have a wallet yet?{' '}
    <Link href="/setup-wallet">Set one up (2 min) →</Link>
  </AlternativeOption>
  
  <WhyWalletNeeded>
    <Collapsible trigger="Why do you need my wallet?">
      ChainCron is non-custodial. Your wallet:
      • Acts as your identity (no password needed)
      • Signs automation permissions
      • Receives earnings from workflows
      • Stays in your control always
    </Collapsible>
  </WhyWalletNeeded>
</OnboardingModal>
```

STEP 4: AI Recommendation (Personalized)
```jsx
<OnboardingModal step={4}>
  <AIThinking>
    <LottieAnimation src="/animations/ai-thinking.json" />
    <TypingText>
      Analyzing your wallet...
      Found 3.2 ETH, 1,500 USDC...
      Detecting DeFi protocols...
      Calculating optimal strategy...
    </TypingText>
  </AIThinking>
  
  {/* After 2 seconds, show recommendation */}
  
  <Recommendation>
    <AIBadge>
      <Icon name="sparkles" /> AI Recommended
    </AIBadge>
    
    <WorkflowCard highlighted>
      <WorkflowIcon src="/workflows/auto-compound.svg" />
      <WorkflowInfo>
        <Title>Auto-Compound DeFi Yield</Title>
        <Description>
          Based on your wallet, you have $4,700 in DeFi protocols.
          This workflow will automatically harvest and reinvest your yields.
        </Description>
        
        <Metrics>
          <Metric 
            label="Projected APY" 
            value="23.4%" 
            trend="up"
          />
          <Metric 
            label="Est. monthly earnings" 
            value="$92"
          />
          <Metric 
            label="Time saved" 
            value="30 min/week"
          />
        </Metrics>
        
        <RiskScore score="low" />
      </WorkflowInfo>
    </WorkflowCard>
    
    <WhyRecommended>
      <h4>Why this workflow?</h4>
      <ul>
        <li>✅ You're already in DeFi (Aave, Compound detected)</li>
        <li>✅ Your balance is optimal for compounding</li>
        <li>✅ High success rate (98.7% of 1,247 users)</li>
        <li>✅ Low risk profile matches your activity</li>
      </ul>
    </WhyRecommended>
    
    <ActionButtons>
      <Button variant="primary" size="large" onClick={subscribeToRecommended}>
        Subscribe with 1-Click →
      </Button>
      <Button variant="ghost" onClick={browseAll}>
        Browse all workflows
      </Button>
    </ActionButtons>
  </Recommendation>
  
  <AlternativeSuggestions>
    <p>Or try these alternatives:</p>
    <SmallWorkflowCard workflow={alternative1} />
    <SmallWorkflowCard workflow={alternative2} />
  </AlternativeSuggestions>
</OnboardingModal>
```

STEP 5: Configuration & Activation (Simplified Settings)
```jsx
<OnboardingModal step={5} wide>
  <h2>Configure your automation</h2>
  <p>We've pre-filled optimal settings. Adjust if needed.</p>
  
  <ConfigurationForm>
    <FormSection title="Execution Schedule">
      <Select 
        label="How often?"
        value="daily"
        options={['Every 6 hours', 'Daily', 'Weekly']}
        recommended="Daily"
      />
      
      <Tooltip>
        💡 Daily is optimal for compound interest growth
      </Tooltip>
    </FormSection>
    
    <FormSection title="Amount to Automate">
      <AmountInput 
        value={userBalance * 0.8}
        max={userBalance}
        currency="USD"
      />
      
      <Slider 
        value={80}
        onChange={handleSliderChange}
        labels={['25%', '50%', '75%', '100%']}
      />
      
      <SafetyNote>
        We recommend automating 80% and keeping 20% liquid
      </SafetyNote>
    </FormSection>
    
    <FormSection title="Safety Limits">
      <Checkbox 
        label="Pause if gas > $5"
        checked={true}
        tooltip="Saves you money during network congestion"
      />
      <Checkbox 
        label="Alert me on failures"
        checked={true}
      />
      <Checkbox 
        label="Auto-retry failed executions"
        checked={true}
      />
    </FormSection>
    
    <CostBreakdown>
      <h4>Cost Breakdown</h4>
      <CostLine label="Subscription" value="$29/month" />
      <CostLine label="Gas (estimated)" value="~$2/month" />
      <CostLine label="Platform fee" value="Included" />
      <Divider />
      <CostLine 
        label="Total" 
        value="~$31/month" 
        bold 
      />
      
      <ROICalculator>
        <strong>Expected monthly earnings: $92</strong>
        <Profit>Net profit: $61/month 🎉</Profit>
      </ROICalculator>
    </CostBreakdown>
  </ConfigurationForm>
  
  <FinalCTA>
    <Button 
      variant="primary" 
      size="xlarge" 
      onClick={activateWorkflow}
      loading={isActivating}
    >
      {isActivating ? 'Activating...' : 'Activate Automation →'}
    </Button>
    
    <FinePrint>
      Free for 7 days. Cancel anytime. No credit card required.
    </FinePrint>
  </FinalCTA>
</OnboardingModal>
```

STEP 6: Success & First Execution (Celebration)
```jsx
<SuccessModal>
  <ConfettiExplosion />
  <LottieAnimation src="/animations/success.json" loop={false} />
  
  <h2>🎉 You're all set!</h2>
  <p>Your automation is now running on Flow</p>
  
  <ExecutionCountdown>
    <CountdownCircle seconds={300} />
    <div>
      <strong>First execution in 5:00 minutes</strong>
      <p>We'll compound your yield automatically</p>
    </div>
  </ExecutionCountdown>
  
  <WhatHappensNext>
    <h4>What happens next?</h4>
    <Timeline>
      <TimelineItem 
        time="In 5 minutes"
        title="First execution"
        description="We'll harvest your yield and reinvest"
        icon="⚡"
      />
      <TimelineItem 
        time="Every 24 hours"
        title="Automatic compounding"
        description="Sit back, we handle everything"
        icon="🔄"
      />
      <TimelineItem 
        time="Weekly"
        title="Performance report"
        description="See your earnings grow"
        icon="📊"
      />
    </Timeline>
  </WhatHappensNext>
  
  <QuickActions>
    <ActionCard 
      icon="📊"
      title="View Dashboard"
      description="Track your automation"
      onClick={goToDashboard}
    />
    <ActionCard 
      icon="➕"
      title="Add Another Workflow"
      description="Automate more strategies"
      onClick={browseWorkflows}
    />
    <ActionCard 
      icon="🎁"
      title="Invite Friends"
      description="Get $10 credit each"
      onClick={showReferral}
    />
  </QuickActions>
  
  <SocialShare>
    <p>Share your automation journey:</p>
    <ShareButtons>
      <ShareButton 
        platform="twitter"
        text="Just automated my DeFi with @ChainCron on @flow_blockchain! 🚀"
      />
      <ShareButton 
        platform="farcaster"
        text="Automating everything on-chain with ChainCron ⚡"
      />
    </ShareButtons>
  </SocialShare>
  
  <Button 
    variant="primary" 
    size="large" 
    onClick={closeOnboarding}
  >
    Go to Dashboard →
  </Button>
</SuccessModal>
```

ADDITIONAL FEATURES:

Progress Persistence:
- Save progress to localStorage
- Show "Resume onboarding" banner if user leaves mid-flow
- Track completion rate in analytics

Tooltips & Hints:
- Contextual help (? icons)
- Keyboard shortcuts displayed
- First-time user tips
- Inline explanations

Animations:
- Smooth transitions between steps (slide, fade)
- Loading states (skeleton screens)
- Success celebrations (confetti, check animations)
- Progress bar fills as user advances

Mobile Optimization:
- Full-screen modals on mobile
- Swipe gestures to navigate
- Bottom sheets for forms
- Touch-friendly buttons (min 44px)

Accessibility:
- Keyboard navigation (Tab, Enter, Esc)
- Screen reader announcements
- Focus management
- Skip to content option

Analytics Tracking:
```typescript
// Track onboarding funnel
trackEvent('onboarding_started');
trackEvent('onboarding_step_completed', { step: 2, goal: 'compound' });
trackEvent('wallet_connected', { walletType: 'metamask' });
trackEvent('onboarding_completed', { timeToComplete: 47 });
```

TECH STACK:
- Framer Motion for transitions
- Confetti library for celebrations
- Lottie for animations
- react-countdown-circle-timer
- Tailwind + shadcn/ui

GOAL: Get user from "Start Free Trial" click to first execution scheduled in under 60 seconds. Every second counts!
```

---

## 🎨 **UI PROMPT 4: AI-Powered Workflow Recommendation Widget**

```
Create an AI recommendation component that showcases ChainCron's integration with Claude (per Flow's AI tutorial):
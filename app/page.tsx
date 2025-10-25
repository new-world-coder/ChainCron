export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="text-center space-y-8">
        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
          Welcome to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            ChainCron
          </span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          The decentralized DeFi automation platform that lets you create, share, and monetize workflows.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Get Started
          </button>
          <button className="px-8 py-3 border border-border rounded-lg hover:bg-muted transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

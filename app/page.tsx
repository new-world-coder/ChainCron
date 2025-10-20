export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Forte Cron
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Decentralized Task Scheduler Marketplace
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            A marketplace where developers create automation workflows and users subscribe with one click.
            Automate your DeFi strategies, portfolio management, and more.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/marketplace"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Browse Workflows
            </a>
            <a
              href="/creator"
              className="px-8 py-3 border border-border rounded-lg font-semibold hover:bg-accent transition-colors"
            >
              Create Workflow
            </a>
          </div>
        </div>
        
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="glass rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Marketplace</h3>
            <p className="text-muted-foreground">
              Discover and subscribe to automation workflows created by developers. 
              One-click setup for complex DeFi strategies.
            </p>
          </div>
          
          <div className="glass rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Automation</h3>
            <p className="text-muted-foreground">
              Set it and forget it. Our workflows run automatically based on 
              price triggers, time schedules, and on-chain events.
            </p>
          </div>
          
          <div className="glass rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Creator Economy</h3>
            <p className="text-muted-foreground">
              Developers can monetize their automation expertise by creating 
              and selling workflows to users who need them.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

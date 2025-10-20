export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Your Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Manage your active workflows and view execution history
        </p>
      </div>
      
      {/* Placeholder for dashboard content */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold text-primary">5</h3>
          <p className="text-muted-foreground">Active Workflows</p>
        </div>
        <div className="glass rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold text-primary">$127</h3>
          <p className="text-muted-foreground">Earned This Month</p>
        </div>
        <div className="glass rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold text-primary">23</h3>
          <p className="text-muted-foreground">Executions This Week</p>
        </div>
        <div className="glass rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold text-primary">$45</h3>
          <p className="text-muted-foreground">Gas Saved</p>
        </div>
      </div>
      
      <div className="glass rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Active Workflows</h3>
        <p className="text-muted-foreground">Workflow management table will be implemented here.</p>
      </div>
    </div>
  )
}

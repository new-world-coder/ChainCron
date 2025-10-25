export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Test Page</h1>
        <p className="text-muted-foreground">This is a test page to verify routing is working.</p>
        <div className="mt-8 space-y-4">
          <a href="/auth/signin" className="block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Go to Sign In
          </a>
          <a href="/admin" className="block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
            Go to Admin
          </a>
          <a href="/dashboard" className="block px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

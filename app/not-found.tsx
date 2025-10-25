'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Popular Pages</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/dashboard" className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors">
              Dashboard
            </Link>
            <Link href="/marketplace" className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors">
              Marketplace
            </Link>
            <Link href="/builder" className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors">
              Builder
            </Link>
            <Link href="/analytics" className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors">
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

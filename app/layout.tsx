import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/Navbar'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChainCron - Decentralized DeFi Automation Marketplace',
  description: 'Automate DeFi workflows with AI-powered recommendations. Developers monetize automation scripts, users earn while they sleep.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <div className="min-h-screen bg-background">
              <Navbar />
              {children}
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}

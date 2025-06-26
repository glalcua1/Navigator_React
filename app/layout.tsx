import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/navigator/header"
import { FilterSidebar } from "@/components/filter-sidebar"
import { LayoutContent } from "@/components/layout-content"
import { ThemeProvider } from "@/components/theme-provider"
import { DateProvider } from "@/components/date-context"
import SimpleErrorBoundary from "@/components/simple-error-boundary"

/**
 * Root Layout Metadata
 * Enhanced with proper SEO and branding
 */
export const metadata: Metadata = {
  title: "Navigator - Hotel Rate Parity Dashboard",
  description: "Professional hotel rate monitoring and competitive analysis platform",
  generator: "Navigator Dashboard v2.0",
  keywords: "hotel rates, rate parity, competitive analysis, revenue management",
  authors: [{ name: "Navigator Team" }],
}

/**
 * Viewport Configuration
 * Separated from metadata as per Next.js 15 requirements
 */
export const viewport = {
  width: "device-width",
  initialScale: 1,
}

/**
 * Root Layout Component
 * 
 * Enhanced with comprehensive error handling and clean, professional layout structure:
 * - Simple error boundary for graceful error handling
 * - Theme provider for dark/light mode switching
 * - Navigation drawer integration
 * - Proper header integration
 * - Global sidebar management
 * - Responsive design foundation
 * - Optimized font loading
 * - Professional spacing system
 * - Production-ready error recovery
 * 
 * @component
 * @version 2.2.0
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Optimized font loading for professional typography */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased font-sans bg-background text-foreground">
        <SimpleErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <DateProvider>
              <SimpleErrorBoundary>
                {/* Fixed Header - Appears on all pages */}
                <Header />
              </SimpleErrorBoundary>
              <SimpleErrorBoundary>
                <LayoutContent>{children}</LayoutContent>
              </SimpleErrorBoundary>
            </DateProvider>
          </ThemeProvider>
        </SimpleErrorBoundary>
      </body>
    </html>
  )
}

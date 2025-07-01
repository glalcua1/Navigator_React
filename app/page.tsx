"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FilterBar } from "@/components/navigator/filter-bar"
import { OverviewKpiCards } from "@/components/navigator/overview-kpi-cards"
import { RateTrendsChart } from "@/components/navigator/rate-trends-chart"
import { MarketDemandWidget } from "@/components/navigator/market-demand-widget"
import { PropertyHealthScoreWidget } from "@/components/navigator/property-health-score-widget"
import { FilterSidebar } from "@/components/filter-sidebar"
import { CoachMarkTrigger } from "@/components/navigator/coach-mark-system"
import { WeeklyPricingDrawer } from "@/components/weekly-pricing-drawer"
import { CSATRatingCard } from "@/components/csat-rating-card"
import { useScrollDetection } from "@/hooks/use-scroll-detection"
import { 
  Activity, 
  TrendingUp, 
  MapPin, 
  Clock,
  BarChart3,
  ArrowRight,
  Zap,
  Target,
  Bell,
  ChevronRight,
  DollarSign
} from "lucide-react"

/**
 * Modern Quick Actions Configuration
 * Streamlined with better visual hierarchy and reduced clutter
 */
const quickActions = [
  {
    id: 'rate-optimization',
    title: 'Rate Optimization',
    subtitle: 'AI-powered pricing strategy',
    icon: TrendingUp,
    color: 'primary',
    href: '/rate-optimization',
    badge: 'Hot',
    urgent: true,
    action: () => {
      console.log('🎯 Navigating to Rate Optimization')
      if (typeof window !== 'undefined') {
        window.location.href = '/rate-optimization'
      }
    }
  },
  {
    id: 'competitor-analysis',
    title: 'Market Intelligence',
    subtitle: 'Real-time competitor insights',
    icon: BarChart3,
    color: 'secondary',
    href: '/competitive-analysis',
    badge: null,
    urgent: false,
    action: () => {
      console.log('📊 Navigating to Competitor Analysis')
      if (typeof window !== 'undefined') {
        window.location.href = '/competitive-analysis'
      }
    }
  },
  {
    id: 'location-insights',
    title: 'Location Performance',
    subtitle: 'Geographic revenue analysis',
    icon: MapPin,
    color: 'accent',
    href: '/location-insights',
    badge: 'New',
    urgent: false,
    action: () => {
      console.log('📍 Navigating to Location Insights')
      if (typeof window !== 'undefined') {
        window.location.href = '/location-insights'
      }
    }
  },
  {
    id: 'real-time-alerts',
    title: 'Smart Alerts',
    subtitle: 'Critical change monitoring',
    icon: Bell,
    color: 'warning',
    href: '/alerts',
    badge: '3',
    urgent: true,
    action: () => {
      console.log('🔔 Navigating to Real-time Alerts')
      if (typeof window !== 'undefined') {
        window.location.href = '/alerts'
      }
    }
  },
]

/**
 * Streamlined Insights Configuration
 * Focused on revenue-critical insights with better categorization
 */
const insights = [
  {
    id: 'rate-parity-alert',
    type: 'critical',
    title: 'Rate Parity Violation',
    description: 'Booking.com rates 8% below direct - immediate action required',
    action: 'Fix Now',
    impact: 'High Revenue Impact',
    value: '-$2,400/day',
    urgency: 'immediate',
  },
  {
    id: 'demand-surge',
    type: 'opportunity',
    title: 'Demand Surge Detected',
    description: 'Dubai Shopping Festival driving 35% demand increase next week',
    action: 'Optimize Pricing',
    impact: 'Revenue Opportunity',
    value: '+$8,500/week',
    urgency: 'high',
  },
  {
    id: 'competitor-movement',
    type: 'market',
    title: 'Market Shift Alert',
    description: '3 key competitors reduced rates by 12% - market repositioning needed',
    action: 'Analyze Strategy',
    impact: 'Competitive Position',
    value: 'Market Share Risk',
    urgency: 'medium',
  },
]

/**
 * Enhanced Color System for Modern Design
 */
function getActionColorClasses(color: string, urgent: boolean = false) {
  const baseClasses = "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
  
  const colorMap = {
    primary: {
      bg: urgent ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
      text: urgent ? 'text-white' : 'text-blue-700 dark:text-blue-300',
      icon: urgent ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      hover: 'hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900 dark:hover:to-blue-800',
    },
    secondary: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900',
      text: 'text-purple-700 dark:text-purple-300',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
      hover: 'hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900 dark:hover:to-purple-800',
    },
    accent: {
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900',
      text: 'text-emerald-700 dark:text-emerald-300',
      icon: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
      hover: 'hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-900 dark:hover:to-emerald-800',
    },
    warning: {
      bg: urgent ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900',
      text: urgent ? 'text-white' : 'text-amber-700 dark:text-amber-300',
      icon: urgent ? 'text-amber-100' : 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      hover: 'hover:from-amber-100 hover:to-amber-200 dark:hover:from-amber-900 dark:hover:to-amber-800',
    },
  }
  
  return colorMap[color as keyof typeof colorMap] || colorMap.primary
}

/**
 * Modern Insight Styling
 */
function getInsightStyling(type: string) {
  const styleMap = {
    critical: {
      bg: 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900',
      accent: 'bg-red-500',
      text: 'text-red-700 dark:text-red-300',
      icon: 'text-red-600 dark:text-red-400',
      badge: 'bg-red-500 text-white',
    },
    opportunity: {
      bg: 'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900',
      accent: 'bg-emerald-500',
      text: 'text-emerald-700 dark:text-emerald-300',
      icon: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-500 text-white',
    },
    market: {
      bg: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
      accent: 'bg-blue-500',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-500 text-white',
    },
  }
  return styleMap[type as keyof typeof styleMap] || styleMap.market
}

/**
 * Modern Dashboard Home Page
 * Optimized for revenue managers with clean, professional design
 */
export default function Home() {
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)
  const [showCSATCard, setShowCSATCard] = useState(false)
  const [csatClosed, setCSATClosed] = useState(false)

  // Scroll detection for CSAT card
  const { hasTriggered, resetTrigger } = useScrollDetection({
    threshold: 0.9, // Show when 90% scrolled (very close to bottom)
    minScrollDistance: 1200, // After scrolling at least 1200px
    oncePerSession: true // Only show once per session
  })

  // Show CSAT card when triggered
  useEffect(() => {
    if (hasTriggered && !showCSATCard && !csatClosed) {
      console.log('🎯 Showing CSAT card after scroll trigger')
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        setShowCSATCard(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [hasTriggered, showCSATCard, csatClosed])

  const handleMoreFiltersClick = () => {
    setIsFilterSidebarOpen(true)
    console.log("🔍 Opening filter sidebar")
  }

  const handleCSATClose = () => {
    setShowCSATCard(false)
    setCSATClosed(true)
    console.log('🎯 CSAT card closed by user')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Enhanced Filter Bar with Sticky Positioning */}
      <div className="sticky top-0 z-40 filter-bar-minimal bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-border/50 shadow-sm transition-shadow duration-200">
        <FilterBar onMoreFiltersClick={handleMoreFiltersClick} />
      </div>

      {/* Main Dashboard Content */}
      <main className="relative">
        <div className="px-6 sm:px-8 lg:px-10 xl:px-12 py-6 space-minimal-lg">
          <div className="max-w-none mx-auto space-minimal-lg">
            
            {/* Dashboard Header with Enhanced Typography */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-minimal-md mb-8">
              <div className="space-y-2">
                <h1 className="text-minimal-title text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                  Revenue Dashboard
                </h1>
                <p className="text-minimal-body text-lg text-muted-foreground">
                  Real-time insights for optimal pricing and revenue performance
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div data-coach-mark="weekly-pricing">
                  <WeeklyPricingDrawer>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600 dark:text-slate-200 dark:hover:text-slate-100"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      View Weekly Pricing Strategy
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </WeeklyPricingDrawer>
                </div>
                
                {/* Separator Line */}
                <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>
                
                <Badge className="badge-minimal bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">
                  <Activity className="w-3 h-3 mr-1" />
                  Live Property
                </Badge>
                <CoachMarkTrigger />
              </div>
            </div>

            {/* Revenue Insights - Enhanced with MUI styling */}
            <Card className="card-elevated animate-fade-in mb-8">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-minimal-subtitle text-foreground">
                      Revenue Insights
                    </h3>
                  </div>
                  <Badge className="badge-minimal bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Real-time
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-minimal-md">
                  {insights.map((insight) => {
                    const styling = getInsightStyling(insight.type)
                    
                    return (
                      <div
                        key={insight.id}
                        className={`card-interactive p-6 ${styling.bg}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-1.5 h-16 rounded-full ${styling.accent} flex-shrink-0`} />
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-minimal-subtitle font-semibold ${styling.text}`}>
                                {insight.title}
                              </h4>
                              <Badge className={`badge-minimal ${styling.badge} text-xs`}>
                                {insight.urgency}
                              </Badge>
                            </div>
                            <p className={`text-minimal-body ${styling.text} opacity-90`}>
                              {insight.description}
                            </p>
                            <div className="flex items-center justify-between pt-2">
                              <div className={`text-sm font-bold ${styling.text}`}>
                                {insight.value}
                              </div>
                              <div className={`text-xs font-medium ${styling.text} opacity-75 italic`}>
                                Guidance: {insight.action}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* KPI Cards - Enhanced with proper spacing */}
            <div className="w-full animate-slide-up" data-coach-mark="kpi-cards">
              <OverviewKpiCards />
            </div>

            {/* Main Content Grid - Enhanced with consistent spacing */}
            <div className="space-minimal-xl mt-8">
              
              {/* Rate Trends Chart - Full width with enhanced styling */}
              <div className="animate-fade-in mb-12" data-coach-mark="rate-trends">
                <RateTrendsChart />
              </div>

              {/* Property Health Score and Market Demand Cards - Grouped with consistent spacing */}
              <div className="space-minimal-xl">
                {/* Property Health Score - Enhanced card */}
                <div className="animate-slide-up" data-coach-mark="property-health" style={{ animationDelay: '0.1s' }}>
                  <PropertyHealthScoreWidget />
                </div>

                {/* Market Demand Widget - Enhanced card */}
                <div className="animate-slide-up mt-8" data-coach-mark="market-demand" style={{ animationDelay: '0.2s' }}>
                  <MarketDemandWidget />
                </div>
              </div>
            </div>

            {/* Footer spacing */}
            <div className="h-8"></div>
          </div>
        </div>

        {/* Enhanced Filter Sidebar */}
        <FilterSidebar
          isOpen={isFilterSidebarOpen}
          onClose={() => setIsFilterSidebarOpen(false)}
        />

        {/* CSAT Rating Card - appears when user scrolls near bottom */}
        {showCSATCard && (
          <CSATRatingCard onClose={handleCSATClose} />
        )}
      </main>
    </div>
  )
}

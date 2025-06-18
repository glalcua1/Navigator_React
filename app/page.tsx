"use client"

import React, { useState } from "react"
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
import { 
  Info, 
  Activity, 
  Compass, 
  ChevronRight, 
  Shield, 
  TrendingUp, 
  MapPin, 
  Clock,
  BarChart3
} from "lucide-react"

/**
 * Quick Actions Configuration
 * Centralized action items for the dashboard
 */
const quickActions = [
  {
    id: 'rate-optimization',
    title: 'Rate Optimization',
    subtitle: 'Optimize your pricing strategy',
    icon: TrendingUp,
    color: 'blue',
    href: '/rate-optimization',
    badge: 'Hot',
    action: () => {
      console.log('🎯 Navigating to Rate Optimization')
      // In a real app, you would use Next.js router
      window.location.href = '/rate-optimization'
    }
  },
  {
    id: 'competitor-analysis',
    title: 'Competitor Analysis',
    subtitle: 'Compare with market leaders',
    icon: Shield,
    color: 'purple',
    href: '/competitive-analysis',
    badge: null,
    action: () => {
      console.log('📊 Navigating to Competitor Analysis')
      window.location.href = '/competitive-analysis'
    }
  },
  {
    id: 'location-insights',
    title: 'Location Insights',
    subtitle: 'Area performance metrics',
    icon: MapPin,
    color: 'green',
    href: '/location-insights',
    badge: 'New',
    action: () => {
      console.log('📍 Navigating to Location Insights')
      window.location.href = '/location-insights'
    }
  },
  {
    id: 'real-time-alerts',
    title: 'Real-time Alerts',
    subtitle: 'Monitor critical changes',
    icon: Clock,
    color: 'amber',
    href: '/alerts',
    badge: '3',
    action: () => {
      console.log('🔔 Navigating to Real-time Alerts')
      window.location.href = '/alerts'
    }
  },
]

/**
 * Insight Items Configuration
 * Key insights and recommendations for the dashboard
 */
const insights = [
  {
    id: 'rate-parity-alert',
    type: 'warning',
    title: 'Rate Parity Issue Detected',
    description: 'Booking.com is showing rates 8% lower than your direct channel.',
    action: 'Review Rates',
    importance: 'high',
  },
  {
    id: 'demand-surge',
    type: 'success',
    title: 'Demand Surge Expected',
    description: 'Tech conference next week will increase demand by 35%.',
    action: 'Adjust Pricing',
    importance: 'medium',
  },
  {
    id: 'competitor-price-drop',
    type: 'info',
    title: 'Competitor Price Movement',
    description: '3 competitors reduced rates by avg 12% for next month.',
    action: 'Analyze Impact',
    importance: 'medium',
  },
  {
    id: 'performance-milestone',
    type: 'success',
    title: 'Revenue Milestone Achieved',
    description: 'You\'ve exceeded Q1 revenue target by 8%.',
    action: 'View Report',
    importance: 'low',
  },
]

/**
 * Get Color Classes for Quick Actions
 * Returns appropriate styling for different color themes
 */
function getActionColorClasses(color: string) {
  const colorMap = {
    blue: {
      icon: 'text-brand-600 dark:text-brand-400',
      bg: 'bg-brand-50 dark:bg-brand-950',
      border: 'border-brand-200 dark:border-brand-800',
      hover: 'hover:bg-brand-100 dark:hover:bg-brand-900',
    },
    purple: {
      icon: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950',
      border: 'border-purple-200 dark:border-purple-800',
      hover: 'hover:bg-purple-100 dark:hover:bg-purple-900',
    },
    green: {
      icon: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950',
      border: 'border-emerald-200 dark:border-emerald-800',
      hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900',
    },
    amber: {
      icon: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950',
      border: 'border-amber-200 dark:border-amber-800',
      hover: 'hover:bg-amber-100 dark:hover:bg-amber-900',
    },
  }
  return colorMap[color as keyof typeof colorMap] || colorMap.blue
}

/**
 * Get Insight Styling
 * Returns appropriate styling for different insight types
 */
function getInsightStyling(type: string) {
  const styleMap = {
    success: {
      border: 'border-l-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    warning: {
      border: 'border-l-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950',
      icon: 'text-amber-600 dark:text-amber-400',
    },
    info: {
      border: 'border-l-brand-500',
      bg: 'bg-brand-50 dark:bg-brand-950',
      icon: 'text-brand-600 dark:text-brand-400',
    },
    error: {
      border: 'border-l-red-500',
      bg: 'bg-red-50 dark:bg-red-950',
      icon: 'text-red-600 dark:text-red-400',
    },
  }
  return styleMap[type as keyof typeof styleMap] || styleMap.info
}

/**
 * Main Dashboard Home Page
 * Enhanced for large screens with better responsive design
 */
export default function Home() {
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)

  const handleMoreFiltersClick = () => {
    setIsFilterSidebarOpen(true)
    console.log("🔍 Opening filter sidebar")
  }

  const handleQuickActionClick = (action: typeof quickActions[0]) => {
    console.log(`🚀 Quick action clicked: ${action.title}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      
      {/* Filter Bar - Edge to Edge */}
      <FilterBar onMoreFiltersClick={handleMoreFiltersClick} />

      {/* Main Content Container */}
      <div className="w-full">

        {/* Welcome Section */}
        <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm dashboard-header">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 lg:py-6">
            <div className="max-w-7xl xl:max-w-none mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight">
                    Welcome back, Hotel Manager
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-muted-foreground max-w-4xl leading-relaxed">
                    Monitor your property performance, optimize rates, and stay ahead of the competition with real-time insights and data-driven recommendations.
                  </p>
                </div>
                <div className="flex items-center gap-3 lg:flex-col lg:items-end lg:text-right">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Live</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="w-full space-y-0">

          {/* Recent Insights Section */}
          <section className="w-full bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50 py-3 lg:py-4 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
              <div className="max-w-7xl xl:max-w-none mx-auto">
                <Card className="card-enhanced bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80">
                  <CardContent className="p-4 lg:p-6 xl:p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-foreground flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800">
                          <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        Recent Insights
                      </h2>
                      <Button variant="ghost" size="sm" className="text-xs lg:text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                        View All
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                      {insights.slice(0, 3).map((insight, index) => {
                        const styling = getInsightStyling(insight.type)
                        
                        return (
                          <div 
                            key={insight.id} 
                            className={`p-3 lg:p-4 rounded-lg border-l-4 ${styling.border} ${styling.bg} transition-all duration-200 hover:shadow-sm`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground text-sm lg:text-base mb-1">
                                  {insight.title}
                                </h3>
                                <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                                  {insight.description}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs h-6 px-2 font-medium hover:bg-white/50 dark:hover:bg-slate-800/50 shrink-0"
                              >
                                {insight.action}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Key Performance Indicators Section */}
          <section className="w-full bg-white dark:bg-slate-900 py-4 lg:py-6 xl:py-8 kpi-section">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
              <div className="max-w-7xl xl:max-w-none mx-auto space-y-6 lg:space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-1">Key Performance Indicators</h2>
                    <p className="text-muted-foreground text-sm lg:text-base">Monitor your property's essential metrics and performance trends</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 font-medium">
                    <Clock className="w-4 h-4" />
                    Last 30 Days
                  </Button>
                </div>
                <OverviewKpiCards />
              </div>
            </div>
          </section>

          {/* Main Analytics Section */}
          <section className="w-full bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-slate-800/30 dark:to-slate-900/30 py-6 lg:py-8 xl:py-10">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
              <div className="max-w-7xl xl:max-w-none mx-auto space-y-6 lg:space-y-8">
                
                {/* Rate Trends Chart */}
                <div className="w-full rate-trends-chart">
                  <RateTrendsChart />
                </div>

                {/* Widgets Layout - Vertical Stack */}
                <div className="space-y-6 lg:space-y-8">
                  
                  {/* Market Demand Widget */}
                  <div className="market-demand-section">
                    <MarketDemandWidget />
                  </div>
                  
                  {/* Property Health Score Widget - Positioned Below Market Demand */}
                  <div className="property-health-section">
                    <PropertyHealthScoreWidget />
                  </div>
                </div>
              </div>
            </div>
          </section>


        </div>
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        onApply={(filters) => {
          console.log("🔍 Filters applied:", filters)
          setIsFilterSidebarOpen(false)
        }}
      />

      {/* Coach Mark System */}
      <CoachMarkTrigger />
    </div>
  )
}

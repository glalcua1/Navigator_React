"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Users, Target, AlertTriangle, Eye, Minus, Shield, Calendar } from "lucide-react"
import { useDateContext } from "@/components/date-context"
import { format, differenceInDays } from "date-fns"

/**
 * KPI Data Configuration
 * Centralized metrics for maintainability and consistency
 */
interface KPIMetric {
  id: string
  title: string
  value: string | number
  previousValue: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ElementType
  description: string
  format: 'currency' | 'percentage' | 'number' | 'decimal'
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple'
  isImportant?: boolean
}

/**
 * Generate KPI data based on date range
 * Creates realistic metrics that vary based on the selected time period
 * 
 * @param {Date} startDate - Start date of the selected range
 * @param {Date} endDate - End date of the selected range
 * @returns {KPIMetric[]} Array of KPI metrics (3 or 4 items based on date range)
 * 
 * Business Logic:
 * - Past dates only: Show 3 KPIs (no event card)
 * - Future dates only: Show 4 KPIs with "Upcoming Events" card
 * - Current/mixed dates: Show 4 KPIs with "Event Impact" card
 */
function generateKPIData(startDate: Date, endDate: Date): KPIMetric[] {
  const days = differenceInDays(endDate, startDate) + 1
  const today = new Date()
  
  // Normalize dates to start of day for accurate comparison
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startDateStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  const endDateStart = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
  
  // Enhanced date range detection logic
  const isFutureRange = startDateStart > todayStart // Entire range is in the future
  const isPastRange = endDateStart < todayStart // Entire range is in the past
  const isCurrentRange = startDateStart <= todayStart && endDateStart >= todayStart // Range includes today
  
  // Comprehensive debug logging for troubleshooting
  console.group('📅 KPI Date Analysis')
  console.log(`Today (normalized): ${format(todayStart, 'yyyy-MM-dd')}`)
  console.log(`Start Date: ${format(startDateStart, 'yyyy-MM-dd')}`)
  console.log(`End Date: ${format(endDateStart, 'yyyy-MM-dd')}`)
  console.log(`Days in range: ${days}`)
  console.log(`Range Classification:`)
  console.log(`  - Is Future Only: ${isFutureRange}`)
  console.log(`  - Is Past Only: ${isPastRange}`)
  console.log(`  - Includes Current: ${isCurrentRange}`)
  console.groupEnd()
  
  // Base values that change based on date range
  const baseRate = 280 + (days * 0.5) + (Math.random() * 40)
  const parityBase = 90 + (days * 0.1) + (Math.random() * 8)
  const marketPos = Math.max(1, Math.min(5, Math.round(3 - (days * 0.02))))
  
  // Previous period values (simulate comparison)
  const prevRate = baseRate * (0.95 + Math.random() * 0.1)
  const prevParity = parityBase * (0.92 + Math.random() * 0.15)
  const prevMarketPos = Math.max(1, Math.min(5, marketPos + (Math.random() > 0.5 ? 1 : -1)))
  
  const baseKPIs = [
    {
      id: 'average-rate',
      title: 'Average Rate',
      value: baseRate,
      previousValue: prevRate,
      change: ((baseRate - prevRate) / prevRate) * 100,
      changeType: baseRate > prevRate ? 'increase' : 'decrease',
      icon: DollarSign,
      description: `Average room rate for ${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd')}`,
      format: 'currency',
      color: 'blue',
      isImportant: true,
    },
    {
      id: 'parity-status',
      title: 'Parity Status',
      value: parityBase,
      previousValue: prevParity,
      change: ((parityBase - prevParity) / prevParity) * 100,
      changeType: parityBase > prevParity ? 'increase' : 'decrease',
      icon: Shield,
      description: `Rate parity compliance over ${days} day${days > 1 ? 's' : ''}`,
      format: 'percentage',
      color: 'green',
      isImportant: true,
    },
    {
      id: 'market-position',
      title: 'Market Position',
      value: marketPos,
      previousValue: prevMarketPos,
      change: ((prevMarketPos - marketPos) / prevMarketPos) * 100, // Inverted for ranking
      changeType: marketPos < prevMarketPos ? 'increase' : 'decrease',
      icon: Target,
      description: `Ranking position in competitive set (out of 15)`,
      format: 'number',
      color: 'purple',
      isImportant: true,
    },
  ]

  /**
   * Event KPI Logic - Conditional based on date range type
   * 
   * Business Rules:
   * 1. Past dates only → No event card (3 KPIs total)
   * 2. Future dates only → "Upcoming Events" card with single event name
   * 3. Current/mixed dates → "Event Impact" percentage card
   */
  console.group('🎯 Event KPI Decision Logic')
  
  if (isPastRange) {
    // Rule 1: Past dates only - Hide event card completely
    console.log('✅ RULE 1: Past dates only - Hiding event KPI card')
    console.log(`   Reason: End date (${format(endDateStart, 'yyyy-MM-dd')}) < Today (${format(todayStart, 'yyyy-MM-dd')})`)
    // No event KPI added - baseKPIs remains with 3 items
    
  } else if (isFutureRange) {
    // Rule 2: Future dates only - Show "Upcoming Events" with single event
    console.log('✅ RULE 2: Future dates only - Adding "Upcoming Events" KPI')
    console.log(`   Reason: Start date (${format(startDateStart, 'yyyy-MM-dd')}) > Today (${format(todayStart, 'yyyy-MM-dd')})`)
    
    // Predefined list of realistic future events
    const futureEventNames = [
      'Tech Innovation Summit',
      'Annual Business Conference', 
      'Wedding Season Peak',
      'Holiday Travel Rush',
      'Sports Championship',
      'Music & Arts Festival',
      'Corporate Retreat Season',
      'International Trade Show',
      'Food & Wine Experience',
      'Cultural Heritage Festival'
    ]
    
    // Select exactly one event for simplicity as requested
    const selectedEventIndex = Math.floor(Math.random() * futureEventNames.length)
    const selectedEvent = futureEventNames[selectedEventIndex]
    const expectedImpact = 25 + Math.floor(Math.random() * 40) // 25-65% expected impact
    
    console.log(`   Selected Event: "${selectedEvent}"`)
    console.log(`   Expected Impact: ${expectedImpact}%`)
    
    baseKPIs.push({
      id: 'upcoming-events',
      title: 'Upcoming Events',
      value: 1, // Always 1 event as requested
      previousValue: 0, // No previous events for comparison
      change: expectedImpact,
      changeType: 'increase' as const,
      icon: Calendar,
      description: `Next major event: ${selectedEvent}`,
      format: 'number' as const,
      color: 'amber' as const,
      isImportant: true,
    })
    
  } else if (isCurrentRange) {
    // Rule 3: Current/mixed period - Show "Event Impact" percentage
    console.log('✅ RULE 3: Current/mixed period - Adding "Event Impact" KPI')
    console.log(`   Reason: Range spans across today (${format(todayStart, 'yyyy-MM-dd')})`)
    
    const currentEventImpact = 85 + Math.floor(Math.random() * 30) // 85-115% impact
    const previousEventImpact = currentEventImpact * (0.85 + Math.random() * 0.3)
    const impactChange = ((currentEventImpact - previousEventImpact) / previousEventImpact) * 100
    
    console.log(`   Current Impact: ${currentEventImpact.toFixed(1)}%`)
    console.log(`   Previous Impact: ${previousEventImpact.toFixed(1)}%`)
    console.log(`   Change: ${impactChange.toFixed(1)}%`)
    
    baseKPIs.push({
      id: 'event-impact',
      title: 'Event Impact',
      value: currentEventImpact,
      previousValue: previousEventImpact,
      change: impactChange,
      changeType: currentEventImpact > previousEventImpact ? 'increase' as const : 'decrease' as const,
      icon: Calendar,
      description: `Revenue impact from events during selected period`,
      format: 'percentage' as const,
      color: 'amber' as const,
      isImportant: true,
    })
  }
  
  console.log(`📊 Final KPI Count: ${baseKPIs.length} cards`)
  console.groupEnd()
  
  return baseKPIs as KPIMetric[]
}

/**
 * Animated Counter Hook
 * Provides smooth counting animation for metric values
 * 
 * @param {number} targetValue - Final value to count to
 * @param {number} duration - Animation duration in milliseconds
 * @returns {number} Current animated value
 */
function useAnimatedCounter(targetValue: number, duration: number = 2000): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationId: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentCount = targetValue * easeOut

      setCount(currentCount)

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [targetValue, duration])

  return count
}

/**
 * Format Value Utility
 * Handles different value formatting based on type
 * 
 * @param {number} value - Value to format
 * @param {string} format - Format type
 * @returns {string} Formatted value string
 */
function formatValue(value: number, format: KPIMetric['format']): string {
  try {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(value)
      case 'percentage':
        return `${value.toFixed(1)}%`
      case 'decimal':
        return value.toFixed(2)
      case 'number':
      default:
        return Math.round(value).toLocaleString()
    }
  } catch (error) {
    console.error('❌ Error formatting value:', error)
    return value.toString()
  }
}

/**
 * Get Color Classes
 * Returns appropriate Tailwind classes for each color theme
 * 
 * @param {string} color - Color theme identifier
 * @returns {object} Object containing color classes
 */
function getColorClasses(color: KPIMetric['color']) {
  const colorMap = {
    blue: {
      icon: 'text-brand-600 dark:text-brand-400',
      bg: 'bg-brand-50 dark:bg-brand-950',
      accent: 'border-brand-200 dark:border-brand-800',
      gradient: 'from-brand-500 to-blue-600',
    },
    green: {
      icon: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950',
      accent: 'border-emerald-200 dark:border-emerald-800',
      gradient: 'from-emerald-500 to-green-600',
    },
    purple: {
      icon: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950',
      accent: 'border-purple-200 dark:border-purple-800',
      gradient: 'from-purple-500 to-purple-700',
    },
    amber: {
      icon: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950',
      accent: 'border-amber-200 dark:border-amber-800',
      gradient: 'from-amber-500 to-orange-600',
    },
    red: {
      icon: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950',
      accent: 'border-red-200 dark:border-red-800',
      gradient: 'from-red-500 to-red-600',
    },
  }
  return colorMap[color]
}

/**
 * Individual KPI Card Component
 * Displays a single metric with animations and trend indicators
 * 
 * @param {KPIMetric} metric - Metric data to display
 */
function KPICard({ metric }: { metric: KPIMetric }) {
  const animatedValue = useAnimatedCounter(typeof metric.value === 'number' ? metric.value : parseFloat(metric.value.toString()))
  const colorClasses = getColorClasses(metric.color)
  const Icon = metric.icon

  const getTrendIcon = () => {
    if (metric.changeType === 'increase') return <TrendingUp className="w-3 h-3" />
    if (metric.changeType === 'decrease') return <TrendingDown className="w-3 h-3" />
    return <Minus className="w-3 h-3" />
  }

  const getTrendColor = () => {
    if (metric.changeType === 'increase') return 'text-emerald-600 dark:text-emerald-400'
    if (metric.changeType === 'decrease') return 'text-red-600 dark:text-red-400'
    return 'text-slate-500 dark:text-slate-400'
  }

  return (
    <Card 
      className={`card-enhanced relative overflow-hidden group ${metric.isImportant ? 'ring-2 ring-brand-200 dark:ring-brand-800' : ''}`}
      data-component-name={`KPI-${metric.id}`}
    >
      {/* Gradient Accent Border */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorClasses.gradient}`} />
      
      <CardContent className="p-5 lg:p-6">
        <div className="space-y-4">
          {/* Header with Icon and Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${colorClasses.bg} ${colorClasses.accent} border`}>
                <Icon className={`w-4 h-4 ${colorClasses.icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground truncate">
                  {metric.title}
                </p>
              </div>
            </div>
            
            {/* Trend Indicator */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-xs">{Math.abs(metric.change).toFixed(1)}%</span>
            </div>
          </div>

          {/* Value Display */}
          <div className="space-y-3">
            <div className="text-2xl font-bold text-foreground tabular-nums">
              {formatValue(animatedValue, metric.format)}
            </div>
            

          </div>

          {/* Description - Enhanced Spacing */}
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 pt-1">
            {metric.description}
          </p>
        </div>

        {/* Important Indicator */}
        {metric.isImportant && (
          <div className="absolute top-3 right-3 w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
        )}

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-brand-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </CardContent>
    </Card>
  )
}

/**
 * Overview KPI Cards Component
 * 
 * Main container component that displays all KPI metrics
 * with responsive grid layout and enhanced visual design
 * 
 * Features:
 * - Single row layout (4 columns on desktop)
 * - Animated metric counters
 * - Trend indicators with color coding
 * - Hover effects and interactions
 * - Important metrics highlighting
 * - Professional color scheme
 * 
 * @component
 * @version 2.0.0
 */
/**
 * Verification function to validate KPI logic implementation
 * Helps with debugging and testing the event card logic
 * 
 * @param {KPIMetric[]} metrics - Generated KPI metrics array
 * @param {Date} startDate - Start date of the range
 * @param {Date} endDate - End date of the range
 */
function verifyKPIImplementation(metrics: KPIMetric[], startDate: Date, endDate: Date): void {
  console.group('🔍 KPI Implementation Verification')
  
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startDateStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  const endDateStart = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
  
  const hasEventCard = metrics.some(m => m.id === 'upcoming-events' || m.id === 'event-impact')
  const eventCard = metrics.find(m => m.id === 'upcoming-events' || m.id === 'event-impact')
  
  console.log('📋 Verification Results:')
  console.log(`   Total KPIs: ${metrics.length}`)
  console.log(`   Has Event Card: ${hasEventCard}`)
  console.log(`   Event Card Type: ${eventCard?.id || 'None'}`)
  console.log(`   Event Card Title: ${eventCard?.title || 'N/A'}`)
  
  // Validation checks
  const isPast = endDateStart < todayStart
  const isFuture = startDateStart > todayStart
  
  if (isPast && hasEventCard) {
    console.error('❌ ERROR: Past date range should not have event card')
  } else if (isFuture && eventCard?.id !== 'upcoming-events') {
    console.error('❌ ERROR: Future date range should have "upcoming-events" card')
  } else if (!isPast && !isFuture && eventCard?.id !== 'event-impact') {
    console.error('❌ ERROR: Current/mixed range should have "event-impact" card')
  } else {
    console.log('✅ SUCCESS: Event card logic is working correctly')
  }
  
  console.groupEnd()
}

export function OverviewKpiCards() {
  // Use date context for dynamic data generation
  const { startDate, endDate, isLoading } = useDateContext()
  
  // Generate KPI data based on selected date range
  const kpiMetrics = useMemo(() => {
    const metrics = generateKPIData(startDate, endDate)
    
    // Verify implementation in development
    if (process.env.NODE_ENV === 'development') {
      verifyKPIImplementation(metrics, startDate, endDate)
    }
    
    return metrics
  }, [startDate, endDate])

  // Calculate summary statistics for debugging
  const summaryStats = useMemo(() => {
    const totalMetrics = kpiMetrics.length
    const importantMetrics = kpiMetrics.filter(m => m.isImportant).length
    const positiveChanges = kpiMetrics.filter(m => m.changeType === 'increase').length
    const negativeChanges = kpiMetrics.filter(m => m.changeType === 'decrease').length

    console.log(`📊 KPI Summary: ${totalMetrics} total, ${importantMetrics} important, ${positiveChanges} up, ${negativeChanges} down`)
    
    return {
      totalMetrics,
      importantMetrics,
      positiveChanges,
      negativeChanges,
    }
  }, [kpiMetrics])

  return (
    <div 
      className="space-y-8 animate-fade-in"
      data-component-name="OverviewKpiCards"
    >
      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-sm text-muted-foreground">Updating metrics...</span>
        </div>
      )}

      {/* KPI Grid - Dynamic Layout Based on Number of Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${kpiMetrics.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 lg:gap-8 ${isLoading ? 'opacity-50 transition-opacity' : ''}`}>
        {kpiMetrics.map((metric) => (
          <KPICard key={metric.id} metric={metric} />
        ))}
      </div>


    </div>
  )
}

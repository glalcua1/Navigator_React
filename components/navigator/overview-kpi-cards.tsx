"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Users, Target, AlertTriangle, Eye, Minus, Shield, Calendar } from "lucide-react"

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

const kpiMetrics: KPIMetric[] = [
  {
    id: 'average-rate',
    title: 'Average Rate',
    value: 295.50,
    previousValue: 278.25,
    change: 6.2,
    changeType: 'increase',
    icon: DollarSign,
    description: 'Current average room rate across all channels',
    format: 'currency',
    color: 'blue',
    isImportant: true,
  },
  {
    id: 'parity-status',
    title: 'Parity Status',
    value: 94.2,
    previousValue: 89.7,
    change: 5.0,
    changeType: 'increase',
    icon: Shield,
    description: 'Rate parity compliance across OTA channels',
    format: 'percentage',
    color: 'green',
    isImportant: true,
  },
  {
    id: 'market-position',
    title: 'Market Position',
    value: 2,
    previousValue: 3,
    change: -33.3,
    changeType: 'increase',
    icon: Target,
    description: 'Ranking position in competitive set (out of 15)',
    format: 'number',
    color: 'purple',
    isImportant: true,
  },
  {
    id: 'event-impact',
    title: 'Event Impact',
    value: 127.5,
    previousValue: 98.2,
    change: 29.9,
    changeType: 'increase',
    icon: Calendar,
    description: 'Revenue impact from local events and conferences',
    format: 'percentage',
    color: 'amber',
    isImportant: true,
  },
]

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
export function OverviewKpiCards() {
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
  }, [])

  return (
    <div 
      className="space-y-8 animate-fade-in"
      data-component-name="OverviewKpiCards"
    >
      {/* KPI Grid - Enhanced Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {kpiMetrics.map((metric) => (
          <KPICard key={metric.id} metric={metric} />
        ))}
      </div>


    </div>
  )
}

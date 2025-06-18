"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts"
import { Calendar, TrendingUp, Filter, Download, Maximize2, ChevronDown, Eye, EyeOff } from "lucide-react"
import { useDateContext } from "@/components/date-context"
import { format, eachDayOfInterval, differenceInDays } from "date-fns"

/**
 * Chart Data Configuration
 * Professional rate trends data with multiple channels and time periods
 */
interface RateData {
  date: string
  timestamp: number
  direct: number
  booking: number
  expedia: number
  agoda: number
  hotelscom: number
  competitor1: number
  competitor2: number
  competitor3: number
  occupancy: number
  events?: string[]
}

const generateRateData = (startDate: Date, endDate: Date): RateData[] => {
  const baseData: RateData[] = []
  const days = eachDayOfInterval({ start: startDate, end: endDate })
  
  // Generate daily data for the selected date range
  days.forEach((d, index) => {
    const date = format(d, 'yyyy-MM-dd')
    const dayOfWeek = d.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    // Base rates with realistic variations and seasonal trends
    const baseRate = 280 + (Math.random() - 0.5) * 40
    const weekendMultiplier = isWeekend ? 1.15 : 1.0
    const seasonalFactor = 1 + 0.2 * Math.sin((index / days.length) * Math.PI * 2)
    
    // Add special events (simulate events every 10-15 days)
    const events: string[] = []
    const dayOfMonth = d.getDate()
    if (dayOfMonth >= 15 && dayOfMonth <= 17 && d.getMonth() % 2 === 0) {
      events.push("Tech Conference")
    }
    if (dayOfMonth >= 25 && dayOfMonth <= 27 && d.getMonth() % 3 === 0) {
      events.push("Music Festival") 
    }
    if (dayOfMonth >= 5 && dayOfMonth <= 7 && d.getMonth() % 4 === 0) {
      events.push("Trade Show")
    }
    
    const eventMultiplier = events.length > 0 ? 1.25 : 1.0
    
    // Add market trends based on date range length
    const trendFactor = days.length > 30 ? 1 + (index / days.length) * 0.1 : 1.0
    
    baseData.push({
      date,
      timestamp: d.getTime(),
      direct: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor),
      booking: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * 0.95),
      expedia: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * 0.92),
      agoda: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * 0.88),
      hotelscom: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * 0.90),
      competitor1: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * 1.05),
      competitor2: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * 0.98),
      competitor3: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * 1.08),
      occupancy: Math.round(75 + (Math.random() - 0.5) * 30 + (events.length * 10)),
      events: events.length > 0 ? events : undefined,
    })
  })
  
  return baseData
}

/**
 * Channel Configuration
 * Defines display properties for each rate channel
 */
interface ChannelConfig {
  key: keyof RateData
  name: string
  color: string
  strokeWidth: number
  type: 'ota' | 'direct' | 'competitor'
  description: string
  isVisible: boolean
}

const channelConfigs: ChannelConfig[] = [
  {
    key: 'direct',
    name: 'Direct Bookings',
    color: '#008FFF',
    strokeWidth: 3,
    type: 'direct',
    description: 'Your property direct booking rates',
    isVisible: true,
  },
  {
    key: 'booking',
    name: 'Booking.com',
    color: '#4F46E5',
    strokeWidth: 2,
    type: 'ota',
    description: 'Booking.com published rates',
    isVisible: true,
  },
  {
    key: 'expedia',
    name: 'Expedia',
    color: '#1800FF',
    strokeWidth: 2,
    type: 'ota',
    description: 'Expedia group published rates',
    isVisible: true,
  },
  {
    key: 'agoda',
    name: 'Agoda',
    color: '#10B981',
    strokeWidth: 2,
    type: 'ota',
    description: 'Agoda published rates',
    isVisible: true,
  },
  {
    key: 'hotelscom',
    name: 'Hotels.com',
    color: '#F59E0B',
    strokeWidth: 2,
    type: 'ota',
    description: 'Hotels.com published rates',
    isVisible: true,
  },
  {
    key: 'competitor1',
    name: 'Competitor A',
    color: '#EF4444',
    strokeWidth: 2,
    type: 'competitor',
    description: 'Primary competitor rates',
    isVisible: false,
  },
  {
    key: 'competitor2',
    name: 'Competitor B',
    color: '#8B5CF6',
    strokeWidth: 2,
    type: 'competitor',
    description: 'Secondary competitor rates',
    isVisible: false,
  },
  {
    key: 'competitor3',
    name: 'Competitor C',
    color: '#06B6D4',
    strokeWidth: 2,
    type: 'competitor',
    description: 'Tertiary competitor rates',
    isVisible: false,
  },
]

/**
 * Custom Tooltip Component
 * Enhanced tooltip with comprehensive data display
 */
interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0]?.payload
  if (!data) return null

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-brand-lg p-4 min-w-[280px]">
      <div className="font-semibold text-foreground mb-2">{new Date(label || '').toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</div>
      
      {/* Rate Information */}
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">{entry.name}</span>
            </div>
            <span className="font-semibold text-foreground tabular-nums">
              ${entry.value}
            </span>
          </div>
        ))}
      </div>

      {/* Occupancy Information */}
      {data.occupancy && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Occupancy</span>
            <span className="font-semibold text-foreground">{data.occupancy}%</span>
          </div>
        </div>
      )}

      {/* Events Information */}
      {data.events && data.events.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="text-sm text-muted-foreground mb-1">Events</div>
          <div className="flex flex-wrap gap-1">
            {data.events.map((event: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {event}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Rate Trends Chart Component
 * 
 * Advanced chart component with:
 * - Multiple visualization types (Line, Area, Bar)
 * - Interactive channel visibility controls
 * - Real-time data filtering
 * - Professional styling with brand colors
 * - Comprehensive tooltips and legends
 * - Event markers and annotations
 * - Performance optimization
 * 
 * @component
 * @version 2.0.0
 */
export function RateTrendsChart() {
  // Date context for global date filtering
  const { startDate, endDate, isLoading } = useDateContext()
  
  // State management
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line')
  const [showOccupancy, setShowOccupancy] = useState(false)
  const [visibleChannels, setVisibleChannels] = useState<Set<string>>(
    new Set(channelConfigs.filter(c => c.isVisible).map(c => c.key))
  )

  // Generate data based on selected date range from context
  const chartData = useMemo(() => {
    return generateRateData(startDate, endDate)
  }, [startDate, endDate])

  // Calculate date range info for display
  const dateRangeInfo = useMemo(() => {
    const days = differenceInDays(endDate, startDate) + 1
    return {
      days,
      label: days <= 7 ? `${days} Days` : days <= 30 ? `${days} Days` : `${days} Days`,
      startLabel: format(startDate, 'MMM dd'),
      endLabel: format(endDate, 'MMM dd, yyyy')
    }
  }, [startDate, endDate])

  // Calculate statistics for debugging
  const statistics = useMemo(() => {
    if (!chartData.length) return null
    
    const avgDirect = chartData.reduce((sum, d) => sum + d.direct, 0) / chartData.length
    const avgBooking = chartData.reduce((sum, d) => sum + d.booking, 0) / chartData.length
    const avgOccupancy = chartData.reduce((sum, d) => sum + d.occupancy, 0) / chartData.length
    
    console.log(`📊 Chart Stats: Direct avg $${avgDirect.toFixed(2)}, Booking avg $${avgBooking.toFixed(2)}, Occupancy ${avgOccupancy.toFixed(1)}%`)
    
    return {
      avgDirect: avgDirect.toFixed(2),
      avgBooking: avgBooking.toFixed(2),
      avgOccupancy: avgOccupancy.toFixed(1),
      dataPoints: chartData.length,
    }
  }, [chartData])

  /**
   * Toggle channel visibility
   * @param {string} channelKey - Channel key to toggle
   */
  const toggleChannel = useCallback((channelKey: string) => {
    setVisibleChannels(prev => {
      const newSet = new Set(prev)
      if (newSet.has(channelKey)) {
        newSet.delete(channelKey)
      } else {
        newSet.add(channelKey)
      }
      console.log(`🔄 Channel ${channelKey} ${newSet.has(channelKey) ? 'enabled' : 'disabled'}`)
      return newSet
    })
  }, [])

  /**
   * Get visible channel configs
   */
  const visibleChannelConfigs = useMemo(() => 
    channelConfigs.filter(config => visibleChannels.has(config.key))
  , [visibleChannels])

  /**
   * Render chart based on selected type
   */
  const renderChart = useCallback(() => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 60 },
    }

    const xAxisProps = {
      dataKey: 'date',
      tick: { fontSize: 12, fill: 'currentColor' },
      tickFormatter: (value: string) => new Date(value).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
    }

    const yAxisProps = {
      tick: { fontSize: 12, fill: 'currentColor' },
      tickFormatter: (value: number) => `$${value}`,
    }

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {visibleChannelConfigs.map((config) => (
              <Area
                key={config.key}
                type="monotone"
                dataKey={config.key}
                name={config.name}
                stroke={config.color}
                fill={config.color}
                fillOpacity={0.1}
                strokeWidth={config.strokeWidth}
              />
            ))}
          </AreaChart>
        )
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {visibleChannelConfigs.map((config) => (
              <Bar
                key={config.key}
                dataKey={config.key}
                name={config.name}
                fill={config.color}
                opacity={0.8}
              />
            ))}
          </BarChart>
        )
      
      default: // line chart
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {visibleChannelConfigs.map((config) => (
              <Line
                key={config.key}
                type="monotone"
                dataKey={config.key}
                name={config.name}
                stroke={config.color}
                strokeWidth={config.strokeWidth}
                dot={false}
                activeDot={{ r: 6, fill: config.color }}
              />
            ))}
            {/* Reference lines for important events */}
            {chartData.some(d => d.events) && (
              <ReferenceLine 
                x={chartData.find(d => d.events)?.date} 
                stroke="#F59E0B" 
                strokeDasharray="5 5"
                label={{ value: "Events", position: "top" }}
              />
            )}
          </LineChart>
        )
    }
  }, [chartType, chartData, visibleChannelConfigs])

  return (
    <Card 
      className="card-enhanced"
      data-component-name="RateTrendsChart"
    >
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-600" />
              Rate Trends Analysis
              {isLoading && (
                <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {dateRangeInfo.startLabel} - {dateRangeInfo.endLabel} • {dateRangeInfo.days} days • {chartData.length} data points
            </p>
          </div>
          
          {/* Chart Controls */}
          <div className="flex items-center gap-2 flex-wrap">

            {/* Chart Type Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  {chartType === 'line' ? 'Line' : chartType === 'area' ? 'Area' : 'Bar'}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setChartType('line')}>
                  Line Chart
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('area')}>
                  Area Chart
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('bar')}>
                  Bar Chart
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Channel Visibility Controls */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Channels
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="p-2 space-y-1">
                  {channelConfigs.map((config) => (
                    <DropdownMenuCheckboxItem
                      key={config.key}
                      checked={visibleChannels.has(config.key)}
                      onCheckedChange={() => toggleChannel(config.key)}
                      className="flex items-center gap-3"
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{config.name}</div>
                        <div className="text-xs text-muted-foreground">{config.description}</div>
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export Button */}
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Channel Status Indicators */}
        <div className="flex flex-wrap gap-2 mt-4">
          {visibleChannelConfigs.map((config) => (
            <Badge 
              key={config.key}
              variant="outline"
              className="gap-2 cursor-pointer hover:bg-secondary"
              onClick={() => toggleChannel(config.key)}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span>{config.name}</span>
              <Eye className="w-3 h-3" />
            </Badge>
          ))}
          
          {channelConfigs.filter(c => !visibleChannels.has(c.key)).length > 0 && (
            <Badge variant="secondary" className="text-muted-foreground">
              <EyeOff className="w-3 h-3 mr-1" />
              {channelConfigs.filter(c => !visibleChannels.has(c.key)).length} hidden
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Chart Container */}
        <div className="chart-container h-96 relative">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Statistics Summary */}
        {statistics && (
          <div className="mt-6 p-4 bg-gradient-brand-subtle rounded-lg border border-brand-200/30 dark:border-brand-800/30">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-foreground">${statistics.avgDirect}</div>
                <div className="text-xs text-muted-foreground">Avg Direct Rate</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">${statistics.avgBooking}</div>
                <div className="text-xs text-muted-foreground">Avg OTA Rate</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{statistics.avgOccupancy}%</div>
                <div className="text-xs text-muted-foreground">Avg Occupancy</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{statistics.dataPoints}</div>
                <div className="text-xs text-muted-foreground">Data Points</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

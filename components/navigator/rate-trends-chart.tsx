"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts"
import { TrendingUp, Filter, Download, ChevronDown, Eye, EyeOff, ArrowUp, ArrowDown, Minus, BarChart3, Star, Settings, Maximize2, RefreshCw } from "lucide-react"
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
  competitor1: number
  competitor2: number
  competitor3: number
  competitor4: number
  competitor5: number
  competitor6: number
  competitor7: number
  competitor8: number
  competitor9: number
  competitor10: number
  occupancy: number
  events?: string[]
}

/**
 * Channel Trends Data Configuration
 * Channel comparison data for table view
 */
interface ChannelTrendData {
  id: string
  channel: string
  myRate: number
  bookings: number
  competitor: number
  variance: number
  variancePercent: number
  trend: 'stable' | 'up' | 'down'
  share: number
  isFeatured?: boolean
  icon?: string
}

const generateRateData = (startDate: Date, endDate: Date): RateData[] => {
  const baseData: RateData[] = []
  const days = eachDayOfInterval({ start: startDate, end: endDate })
  
  console.log('🏨 Generating realistic rate data with dynamic pricing variations')
  
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
    
    // Dynamic pricing with realistic market variations
    const dayVariation = Math.sin(index * 0.3) * 0.15 // Daily market fluctuations
    const randomFactor = (Math.random() - 0.5) * 0.1 // Random market noise
    const competitionFactor = index % 7 === 0 ? 0.9 : 1.0 // Weekly promotional cycles
    
    // Base multipliers for each hotel with daily variations
    const hotelMultipliers = {
      direct: 1.0 + dayVariation + randomFactor, // My Hotel - competitive positioning
      competitor1: 1.12 + (Math.sin(index * 0.2) * 0.08) + randomFactor, // Grand Plaza - variable premium
      competitor2: 1.25 + (Math.sin(index * 0.4) * 0.1) + randomFactor, // Emirates Palace - luxury fluctuations
      competitor3: 1.18 + (Math.sin(index * 0.15) * 0.12) + randomFactor, // Atlantis - resort seasonality
      competitor4: 1.45 + (Math.sin(index * 0.1) * 0.05) + randomFactor, // Burj Al Arab - stable ultra-luxury
      competitor5: 1.22 + (Math.sin(index * 0.25) * 0.09) + randomFactor, // Four Seasons - luxury variations
      competitor6: 1.35 + (Math.sin(index * 0.35) * 0.07) + randomFactor, // Armani - designer premium
      competitor7: 1.08 + (Math.sin(index * 0.45) * 0.15) + randomFactor * competitionFactor, // JW Marriott - business competitive
      competitor8: 1.28 + (Math.sin(index * 0.3) * 0.11) + randomFactor, // Palazzo Versace - Italian luxury
      competitor9: 1.15 + (Math.sin(index * 0.5) * 0.13) + randomFactor, // Madinat Jumeirah - resort variations
      competitor10: 1.20 + (Math.sin(index * 0.2) * 0.1) + randomFactor, // Ritz-Carlton - consistent luxury
    }
    
    baseData.push({
      date,
      timestamp: d.getTime(),
      direct: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * hotelMultipliers.direct),
      competitor1: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * hotelMultipliers.competitor1),
      competitor2: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * hotelMultipliers.competitor2),
      competitor3: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * hotelMultipliers.competitor3),
      competitor4: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * hotelMultipliers.competitor4),
      competitor5: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * hotelMultipliers.competitor5),
      competitor6: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * hotelMultipliers.competitor6),
      competitor7: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * hotelMultipliers.competitor7),
      competitor8: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * hotelMultipliers.competitor8),
      competitor9: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * hotelMultipliers.competitor9),
      competitor10: Math.round(baseRate * weekendMultiplier * seasonalFactor * eventMultiplier * trendFactor * hotelMultipliers.competitor10),
      occupancy: Math.round(75 + (Math.random() - 0.5) * 30 + (events.length * 10)),
      events: events.length > 0 ? events : undefined,
    })
  })
  
  // Log sample positioning data for verification
  if (baseData.length > 0) {
    const sampleDay = baseData[Math.floor(baseData.length / 2)]
    const rates = [
      { name: 'My Hotel', rate: sampleDay.direct },
      { name: 'Grand Plaza', rate: sampleDay.competitor1 },
      { name: 'JW Marriott', rate: sampleDay.competitor7 }
    ].sort((a, b) => a.rate - b.rate)
    
    console.log('📊 Sample day pricing positions:', rates.map((h, i) => `#${i + 1}: ${h.name} ($${h.rate})`).join(', '))
  }
  
  return baseData
}

/**
 * Channel Trends Data
 * Static data based on the provided channel trends information
 */
const channelTrendsData: ChannelTrendData[] = [
  {
    id: 'direct-website',
    channel: 'Direct Website',
    myRate: 1950,
    bookings: 94,
    competitor: 1580,
    variance: 370,
    variancePercent: 23.4,
    trend: 'stable',
    share: 18,
    isFeatured: true,
    icon: '🏢'
  },
  {
    id: 'booking-com',
    channel: 'Booking.com',
    myRate: 2100,
    bookings: 132,
    competitor: 1580,
    variance: 520,
    variancePercent: 32.9,
    trend: 'down',
    share: 24,
    icon: '🔵'
  },
  {
    id: 'expedia',
    channel: 'Expedia',
    myRate: 2100,
    bookings: 87,
    competitor: 1580,
    variance: 520,
    variancePercent: 32.9,
    trend: 'down',
    share: 19,
    icon: '✈️'
  },
  {
    id: 'agoda',
    channel: 'Agoda',
    myRate: 2100,
    bookings: 68,
    competitor: 1580,
    variance: 520,
    variancePercent: 32.9,
    trend: 'down',
    share: 16,
    icon: '🔴'
  },
  {
    id: 'hotels-com',
    channel: 'Hotels.com',
    myRate: 2100,
    bookings: 45,
    competitor: 1580,
    variance: 520,
    variancePercent: 32.9,
    trend: 'down',
    share: 12,
    icon: '🏨'
  },
  {
    id: 'kayak',
    channel: 'Kayak',
    myRate: 2100,
    bookings: 28,
    competitor: 1580,
    variance: 520,
    variancePercent: 32.9,
    trend: 'down',
    share: 6,
    icon: '🛶'
  },
  {
    id: 'priceline',
    channel: 'Priceline',
    myRate: 2100,
    bookings: 18,
    competitor: 1580,
    variance: 520,
    variancePercent: 32.9,
    trend: 'stable',
    share: 3,
    icon: '💰'
  },
  {
    id: 'orbitz',
    channel: 'Orbitz',
    myRate: 2100,
    bookings: 12,
    competitor: 1580,
    variance: 520,
    variancePercent: 32.9,
    trend: 'stable',
    share: 2,
    icon: '🌐'
  }
]

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

/**
 * Enhanced Channel Configuration with modern color palette
 * Now focused on My Hotel line + up to 10 competitors (3 selected by default)
 */
const channelConfigs: ChannelConfig[] = [
  {
    key: 'direct',
    name: 'My Hotel',
    color: '#2563eb',
    strokeWidth: 4,
    type: 'direct',
    description: 'My hotel rates',
    isVisible: true,
  },
  {
    key: 'competitor1',
    name: 'Grand Plaza Dubai',
    color: '#10b981',
    strokeWidth: 2,
    type: 'competitor',
    description: 'Luxury competitor in DIFC',
    isVisible: true,
  },
  {
    key: 'competitor2',
    name: 'Emirates Palace',
    color: '#f97316',
    strokeWidth: 2,
    type: 'competitor',
    description: 'Premium beachfront resort',
    isVisible: true,
  },
  {
    key: 'competitor3',
    name: 'Atlantis The Palm',
    color: '#8b5cf6',
    strokeWidth: 2,
    type: 'competitor',
    description: 'Iconic Palm Jumeirah resort',
    isVisible: true,
  },
  {
    key: 'competitor4',
    name: 'Burj Al Arab',
    color: '#ef4444',
    strokeWidth: 2,
    type: 'competitor',
    description: 'Ultra-luxury sail-shaped hotel',
    isVisible: false,
  },
  {
    key: 'competitor5',
    name: 'Four Seasons Resort',
    color: '#f59e0b',
    strokeWidth: 2,
    type: 'competitor',
    description: 'Luxury resort at Jumeirah Beach',
    isVisible: false,
  },
  {
    key: 'competitor6',
    name: 'Armani Hotel Dubai',
    color: '#06b6d4',
    strokeWidth: 2,
    type: 'competitor',
    description: 'Designer hotel in Burj Khalifa',
    isVisible: false,
  },
  {
    key: 'competitor7',
    name: 'JW Marriott Marquis',
    color: '#84cc16',
    strokeWidth: 2,
    type: 'competitor',
    description: 'Twin-tower business hotel',
    isVisible: false,
  },
  {
    key: 'competitor8',
    name: 'Palazzo Versace',
    color: '#ec4899',
    strokeWidth: 2,
    type: 'competitor',
    description: 'Italian luxury on Dubai Creek',
    isVisible: false,
  },
  {
    key: 'competitor9',
    name: 'Madinat Jumeirah',
    color: '#6366f1',
    strokeWidth: 2,
    type: 'competitor',
    description: 'Arabian resort complex',
    isVisible: false,
  },
  {
    key: 'competitor10',
    name: 'The Ritz-Carlton',
    color: '#8b5cf6',
    strokeWidth: 2,
    type: 'competitor',
    description: 'Beachfront luxury resort',
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

/**
 * Enhanced Custom Tooltip with price positioning analysis
 */
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload
    const date = new Date(label || '')
    
    // Calculate price positioning
    const myHotelRate = data?.direct || 0
    const allRates = payload.map(entry => entry.value).filter(rate => rate > 0)
    const competitorRates = allRates.filter(rate => rate !== myHotelRate)
    
    // Price positioning analysis
    const avgCompetitorRate = competitorRates.length > 0 ? 
      competitorRates.reduce((sum, rate) => sum + rate, 0) / competitorRates.length : 0
    const priceDifference = myHotelRate - avgCompetitorRate
    const priceDifferencePercent = avgCompetitorRate > 0 ? 
      ((priceDifference / avgCompetitorRate) * 100) : 0
    
         // Market position (sorted by price - cheapest to most expensive)
     const sortedRates = allRates.sort((a, b) => a - b)
     const myPosition = sortedRates.indexOf(myHotelRate) + 1
     const totalHotels = sortedRates.length
     
     // Position category based on price ranking (1 = cheapest)
     const getPositionCategory = (position: number, total: number) => {
       const percentile = (position / total) * 100
       if (percentile <= 25) return { label: 'Most Affordable', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' }
       if (percentile <= 50) return { label: 'Competitive', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' }
       if (percentile <= 75) return { label: 'Premium', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' }
       return { label: 'Luxury Premium', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' }
     }
    
    const positionInfo = getPositionCategory(myPosition, totalHotels)
    
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-0 shadow-lg rounded-xl p-4 min-w-[280px]">
        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {format(date, 'MMM dd, yyyy')}
        </div>
        
                 {/* Price Position Summary - Revenue Manager Focus */}
         <div className={`mb-3 p-3 rounded-lg ${positionInfo.bg} border border-opacity-20`}>
           <div className="flex items-center justify-between mb-1">
             <div className="flex items-center gap-2">
               <span className={`text-lg font-bold ${positionInfo.color}`}>
                 #{myPosition}
               </span>
               {myPosition === 1 && (
                 <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white rounded-full">
                   <span className="text-xs font-bold">🏆 WINNING</span>
                 </div>
               )}
               {myPosition > 1 && myPosition <= 3 && (
                 <div className="flex items-center gap-1 px-2 py-1 bg-orange-500 text-white rounded-full">
                   <span className="text-xs font-bold">⚠️ MONITOR</span>
                 </div>
               )}
               {myPosition > 3 && (
                 <div className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-full">
                   <span className="text-xs font-bold">🚨 ACTION</span>
                 </div>
               )}
             </div>
             <span className={`text-xs font-medium ${positionInfo.color} px-2 py-1 rounded-full bg-white/50 dark:bg-black/20`}>
               {positionInfo.label}
             </span>
           </div>
           <div className="text-xs text-gray-600 dark:text-gray-400">
             {myPosition === 1 
               ? '✅ Market leader - maintain competitive edge' 
               : myPosition === totalHotels 
               ? '🔴 Highest priced - consider rate adjustment' 
               : `📊 ${myPosition}${myPosition === 2 ? 'nd' : myPosition === 3 ? 'rd' : 'th'} cheapest of ${totalHotels} - ${myPosition <= 3 ? 'competitive position' : 'room for optimization'}`}
           </div>
         </div>
        
                 {/* Rate Details - Optimized for Revenue Managers */}
         <div className="space-y-1.5">
           {payload
             .sort((a, b) => a.value - b.value) // Sort by price (cheapest first)
             .map((entry, index) => {
             const isMyHotel = entry.name === 'My Hotel'
             const isCheapest = index === 0
             const priceDiff = !isMyHotel ? ((entry.value - myHotelRate) / myHotelRate * 100) : 0
             const isCompetitiveThreat = !isMyHotel && entry.value < myHotelRate
             
             return (
               <div key={entry.name} className={`flex items-center justify-between gap-3 p-2 rounded transition-all ${
                 isMyHotel 
                   ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                   : isCompetitiveThreat 
                   ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                   : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
               }`}>
                 <div className="flex items-center gap-2 flex-1 min-w-0">
                   <div className="flex items-center gap-1.5">
                     <div
                       className="w-3 h-3 rounded-full flex-shrink-0"
                       style={{ backgroundColor: entry.color }}
                     />
                     {isCheapest && (
                       <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">CHEAPEST</span>
                       </div>
                     )}
                     {isCompetitiveThreat && !isCheapest && (
                       <div className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                         <span className="text-xs font-medium text-orange-700 dark:text-orange-300">THREAT</span>
                       </div>
                     )}
                   </div>
                   <span className={`text-xs truncate ${
                     isMyHotel 
                       ? 'font-semibold text-blue-700 dark:text-blue-300' 
                       : isCompetitiveThreat 
                       ? 'font-medium text-red-700 dark:text-red-300'
                       : 'text-gray-700 dark:text-gray-300'
                   }`}>
                     {entry.name}
                   </span>
                 </div>
                 <div className="text-right flex-shrink-0">
                   <div className={`text-sm font-bold ${
                     isMyHotel 
                       ? 'text-blue-900 dark:text-blue-100' 
                       : isCheapest 
                       ? 'text-emerald-700 dark:text-emerald-300'
                       : isCompetitiveThreat 
                       ? 'text-red-700 dark:text-red-300'
                       : 'text-gray-900 dark:text-white'
                   }`}>
                     ${entry.value?.toLocaleString()}
                   </div>
                   {!isMyHotel && (
                     <div className={`text-xs font-medium ${
                       priceDiff > 0 
                         ? 'text-gray-500 dark:text-gray-400' 
                         : 'text-red-600 dark:text-red-400 font-bold'
                     }`}>
                       {priceDiff > 0 ? '+' : ''}{priceDiff.toFixed(0)}%
                       {isCompetitiveThreat && ' 🚨'}
                     </div>
                   )}
                   {isMyHotel && !isCheapest && (
                     <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                       #{index + 1} position
                     </div>
                   )}
                   {isMyHotel && isCheapest && (
                     <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                       🏆 Leading
                     </div>
                   )}
                 </div>
               </div>
             )
           })}
         </div>
        
                 {/* Market Insights - Simplified */}
         <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
           <div className="flex items-center justify-between text-xs">
             <div className="text-center">
               <div className="text-gray-500 dark:text-gray-400 mb-1">Market Avg</div>
               <div className="font-bold text-gray-900 dark:text-white">
                 ${avgCompetitorRate.toLocaleString()}
               </div>
             </div>
             <div className="text-center">
               <div className="text-gray-500 dark:text-gray-400 mb-1">Difference</div>
               <div className={`font-bold ${priceDifference > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                 {priceDifference > 0 ? '+' : ''}${Math.abs(priceDifference).toLocaleString()}
               </div>
             </div>
             <div className="text-center">
               <div className="text-gray-500 dark:text-gray-400 mb-1">vs Market</div>
               <div className={`font-bold ${priceDifferencePercent > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                 {priceDifferencePercent > 0 ? '+' : ''}{priceDifferencePercent.toFixed(0)}%
               </div>
             </div>
           </div>
         </div>
        
        {data?.events && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3 text-amber-500" />
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                {data.events.join(', ')}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }
  return null
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
  const { startDate, endDate } = useDateContext()
  
  // State management
  const [activeTab, setActiveTab] = useState('chart')
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line')
  const [channelVisibility, setChannelVisibility] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    channelConfigs.forEach(config => {
      initial[config.key] = config.isVisible
    })
    return initial
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Generate data - only if dates are available
  const data = useMemo(() => {
    if (!startDate || !endDate) return []
    return generateRateData(startDate, endDate)
  }, [startDate, endDate])

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }, [])

  // Toggle channel visibility
  const toggleChannelVisibility = useCallback((channelKey: string) => {
    setChannelVisibility(prev => ({
      ...prev,
      [channelKey]: !prev[channelKey]
    }))
  }, [])
  
  const isLoading = !startDate || !endDate
  
  // Filter visible channels
  const visibleChannels = channelConfigs.filter(config => channelVisibility[config.key])
  
  // Filter competitor channels only for the dropdown (exclude My Hotel)
  const competitorChannels = channelConfigs.filter(config => config.type === 'competitor')
  const visibleCompetitors = competitorChannels.filter(config => channelVisibility[config.key])
  
  // Always include My Hotel line + visible competitors for chart rendering
  const myHotelChannel = channelConfigs.find(config => config.type === 'direct')
  const chartChannels = myHotelChannel ? [myHotelChannel, ...visibleCompetitors] : visibleCompetitors

  const getTrendIcon = (trend: 'stable' | 'up' | 'down') => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-emerald-600" />
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />
      default: return <Minus className="w-4 h-4 text-slate-600" />
    }
  }

  const getTrendBadge = (trend: 'stable' | 'up' | 'down') => {
    const badgeClasses = {
      up: 'badge-minimal bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      down: 'badge-minimal bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      stable: 'badge-minimal bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
    }
    return badgeClasses[trend]
  }

  return (
    <Card className="chart-container-minimal animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-minimal-title flex items-center gap-2">
              Rate Trends Analysis
            </CardTitle>
            <p className="text-minimal-body">
              {isLoading ? 'Loading chart data...' : 'Comprehensive rate comparison across all channels with market insights'}
            </p>
          </div>
          
          {/* General Action Controls - Only Export and Refresh */}
          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-minimal gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            {/* Download Button */}
            <Button variant="outline" size="sm" className="btn-minimal gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="tabs-minimal">
          <TabsList className="tabs-list-minimal">
            <TabsTrigger value="chart" className="tabs-trigger-minimal gap-2">
              <BarChart3 className="w-4 h-4" />
              Rate Chart
            </TabsTrigger>
            <TabsTrigger value="table" className="tabs-trigger-minimal gap-2">
              <Settings className="w-4 h-4" />
              Channel Analysis
            </TabsTrigger>
          </TabsList>

          {/* Chart Tab */}
          <TabsContent value="chart" className="space-y-4 mt-6">
            {/* Chart-specific Controls - Only shown for Rate Chart tab */}
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/30">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Chart Controls:</span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Chart Type Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="btn-minimal gap-2">
                      <BarChart3 className="w-4 h-4" />
                      {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="dropdown-minimal" align="end">
                    <DropdownMenuItem onClick={() => setChartType('line')} className="gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <div className="w-3 h-0.5 bg-current rounded" />
                      </div>
                      Line Chart
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setChartType('area')} className="gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <div className="w-3 h-2 bg-current/30 rounded-sm" />
                      </div>
                      Area Chart
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setChartType('bar')} className="gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <div className="flex gap-0.5">
                          <div className="w-1 h-3 bg-current rounded-sm" />
                          <div className="w-1 h-2 bg-current rounded-sm" />
                          <div className="w-1 h-4 bg-current rounded-sm" />
                        </div>
                      </div>
                      Bar Chart
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Enhanced Competitor Selection Control */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="btn-minimal gap-2 relative">
                      <Eye className="w-4 h-4" />
                      Competitors ({visibleCompetitors.length}/{competitorChannels.length})
                      <ChevronDown className="w-4 h-4" />
                      {visibleCompetitors.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="dropdown-minimal w-80" align="end">
                    <div className="p-3">
                      {/* Header with selection info */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/30">
                        <div>
                          <p className="text-sm font-semibold text-foreground">Select Competitors</p>
                          <p className="text-xs text-muted-foreground">
                            {visibleCompetitors.length} of {competitorChannels.length} competitors selected
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              const newVisibility = { ...channelVisibility }
                              competitorChannels.forEach(config => {
                                newVisibility[config.key] = true
                              })
                              setChannelVisibility(newVisibility)
                            }}
                          >
                            All
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              const newVisibility = { ...channelVisibility }
                              competitorChannels.forEach(config => {
                                newVisibility[config.key] = false
                              })
                              setChannelVisibility(newVisibility)
                            }}
                          >
                            None
                          </Button>
                        </div>
                      </div>
                      
                      {/* Selection status line */}
                      <div className="mb-3 p-2 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-0.5 bg-blue-600 rounded"></div>
                            <span className="font-medium">My Hotel</span>
                            <span className="text-muted-foreground">(Always visible)</span>
                          </div>
                          <span className="text-muted-foreground">+</span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-emerald-600">{visibleCompetitors.length}</span>
                            <span className="text-muted-foreground">competitors</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Competitor list */}
                      <div className="space-y-1 max-h-64 overflow-y-auto">
                        {competitorChannels.map((config) => (
                          <DropdownMenuCheckboxItem
                            key={config.key}
                            checked={channelVisibility[config.key]}
                            onCheckedChange={() => toggleChannelVisibility(config.key)}
                            className="gap-3 p-3 rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div 
                                className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-sm" 
                                style={{ backgroundColor: config.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{config.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{config.description}</div>
                              </div>
                              {channelVisibility[config.key] && (
                                <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                  Active
                                </Badge>
                              )}
                            </div>
                          </DropdownMenuCheckboxItem>
                        ))}
                      </div>
                      
                      {/* Footer info */}
                      <div className="mt-3 pt-2 border-t border-border/30">
                        <p className="text-xs text-muted-foreground text-center">
                          💡 Tip: Select 3-5 competitors for optimal chart readability
                        </p>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Chart Container */}
            <div className="h-80 w-full">
              {isLoading ? (
                <div className="h-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
                  <div className="text-gray-500 dark:text-gray-400">Loading chart data...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' && (
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                        className="text-xs"
                      />
                      <YAxis className="text-xs" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      {chartChannels.map((config) => (
                        <Line
                          key={config.key}
                          type="monotone"
                          dataKey={config.key}
                          stroke={config.color}
                          strokeWidth={config.strokeWidth}
                          name={config.name}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5, stroke: config.color, strokeWidth: 2 }}
                        />
                      ))}
                    </LineChart>
                  )}
                  
                  {chartType === 'area' && (
                    <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                        className="text-xs"
                      />
                      <YAxis className="text-xs" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      {chartChannels.map((config) => (
                        <Area
                          key={config.key}
                          type="monotone"
                          dataKey={config.key}
                          stroke={config.color}
                          fill={config.color}
                          fillOpacity={0.1}
                          strokeWidth={config.strokeWidth}
                          name={config.name}
                        />
                      ))}
                    </AreaChart>
                  )}
                  
                  {chartType === 'bar' && (
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                        className="text-xs"
                      />
                      <YAxis className="text-xs" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      {chartChannels.slice(0, 4).map((config) => ( // Show My Hotel + up to 3 competitors
                        <Bar
                          key={config.key}
                          dataKey={config.key}
                          fill={config.color}
                          name={config.name}
                          opacity={0.8}
                        />
                      ))}
                    </BarChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>

          {/* Enhanced Table Tab */}
          <TabsContent value="table" className="mt-6">
            {/* Table-specific info */}
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/30 mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Channel Performance Analysis</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {format(new Date(), 'MMM dd, HH:mm')}
              </div>
            </div>

            <div className="rounded-xl border border-border/30 overflow-hidden">
              <Table className="table-minimal">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Channel</TableHead>
                    <TableHead className="text-right">My Rate</TableHead>
                    <TableHead className="text-right">Bookings</TableHead>
                    <TableHead className="text-right">Competitor</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead className="text-right">Market Share</TableHead>
                    <TableHead className="text-center">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channelTrendsData.map((channel) => (
                    <TableRow key={channel.id} className="group">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{channel.icon}</span>
                          <div>
                            <div className="font-semibold">{channel.channel}</div>
                            {channel.isFeatured && (
                              <Badge className="badge-minimal bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-1">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        ${channel.myRate.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {channel.bookings}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${channel.competitor.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`font-semibold ${
                            channel.variance > 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {channel.variance > 0 ? '+' : ''}${channel.variance}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({channel.variancePercent > 0 ? '+' : ''}{channel.variancePercent}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold">{channel.share}%</span>
                          <div className="w-12 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, channel.share * 4)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getTrendIcon(channel.trend)}
                          <Badge className={getTrendBadge(channel.trend)}>
                            {channel.trend}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

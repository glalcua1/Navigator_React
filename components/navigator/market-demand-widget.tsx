"use client"

import { useState } from "react"
import { ArrowRight, TrendingUp, DollarSign, BarChart3, MapPin, Map, List, Users, Percent } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MyEventsHolidaysTable } from "./my-events-holidays-table"
import { WorldMapVisualization } from "./world-map-visualization"

// Source market data with their events/holidays
const sourceMarketsData = [
  {
    name: "United States",
    flag: "🇺🇸",
    percent: 30,
    value: "$2.1M",
    color: "#3b82f6",
    events: [
      {
        name: "🇺🇸 Independence Day",
        dates: "Thu 4 Jul",
        distance: "N/A",
        visitors: "N/A",
        impact: { percentage: "+25%", level: "high", calculation: "Major US holiday driving travel demand to Dubai" }
      },
      {
        name: "🇺🇸 Labor Day Weekend",
        dates: "30 Aug - 2 Sep",
        distance: "N/A", 
        visitors: "N/A",
        impact: { percentage: "+15%", level: "medium", calculation: "Extended weekend driving leisure travel" }
      }
    ]
  },
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    percent: 20,
    value: "$1.4M",
    color: "#10b981",
    events: [
      {
        name: "🇬🇧 Battle of the Boyne (in lieu) (Regional Holiday)",
        dates: "Mon 14 Jul",
        distance: "N/A",
        visitors: "N/A",
        impact: { percentage: "+12%", level: "medium", calculation: "UK regional holiday driving travel demand" }
      },
      {
        name: "🇬🇧 Summer Bank Holiday",
        dates: "Mon 25 Aug",
        distance: "N/A",
        visitors: "N/A", 
        impact: { percentage: "+18%", level: "high", calculation: "UK bank holiday driving premium travel demand" }
      }
    ]
  },
  {
    name: "Germany",
    flag: "🇩🇪",
    percent: 10,
    value: "$700K",
    color: "#8b5cf6",
    events: [
      {
        name: "🇩🇪 Assumption of Mary",
        dates: "Thu 15 Aug",
        distance: "N/A",
        visitors: "N/A",
        impact: { percentage: "+8%", level: "medium", calculation: "German religious holiday driving travel" }
      }
    ]
  },
  {
    name: "France",
    flag: "🇫🇷",
    percent: 5,
    value: "$350K",
    color: "#f59e0b",
    events: [
      {
        name: "🇫🇷 Assumption of Mary",
        dates: "Thu 15 Aug",
        distance: "N/A",
        visitors: "N/A",
        impact: { percentage: "+6%", level: "medium", calculation: "French national holiday driving travel demand" }
      }
    ]
  },
  {
    name: "Canada",
    flag: "🇨🇦",
    percent: 5,
    value: "$350K",
    color: "#ef4444",
    events: [
      {
        name: "🇨🇦 Civic Holiday",
        dates: "Mon 5 Aug",
        distance: "N/A",
        visitors: "N/A",
        impact: { percentage: "+7%", level: "medium", calculation: "Canadian civic holiday driving leisure travel" }
      }
    ]
  }
]

// Local Dubai events
const localEvents = [
  {
    name: "🇦🇪 Dubai Shopping Festival",
    dates: "15 Jul - 30 Aug",
    distance: "1.1 km",
    visitors: "120,000",
    impact: {
      percentage: "+35%",
      level: "critical",
      calculation: "Based on historical data: 120,000 visitors × 2.1% hotel booking rate × average stay 3.2 nights = +35% occupancy increase"
    }
  },
  {
    name: "🎵 Dubai Jazz Festival",
    dates: "Fri 18 Jul - Sun 20 Jul",
    distance: "3.7 km",
    visitors: "25,000",
    impact: {
      percentage: "+18%",
      level: "high",
      calculation: "Based on historical data: 25,000 visitors × 1.2% hotel booking rate × average stay 2.5 nights = +18% occupancy increase"
    }
  }
]

type ViewMode = 'map' | 'list'

export function MarketDemandWidget() {
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('map')

  const handleMarketClick = (marketName: string) => {
    if (selectedMarket === marketName) {
      setSelectedMarket(null)
    } else {
      setSelectedMarket(marketName)
    }
  }

  const getEventsToShow = () => {
    if (selectedMarket) {
      const market = sourceMarketsData.find(m => m.name === selectedMarket)
      return market ? market.events : []
    }
    return localEvents
  }

  const getEventsTitle = () => {
    if (selectedMarket) {
      const market = sourceMarketsData.find(m => m.name === selectedMarket)
      return `${market?.flag} ${market?.name} Events & Holidays`
    }
    return "Local Dubai Events & Holidays"
  }

  const getEventsSubtitle = () => {
    if (selectedMarket) {
      return "Events and holidays from this source market that impact demand"
    }
    return "Local events and holidays affecting your hotel"
  }

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 elevation-1">
              <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="space-y-0.5">
              <CardTitle className="text-minimal-title text-foreground">Market Demand</CardTitle>
              <p className="text-minimal-body text-muted-foreground">Current market performance indicators</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Jul 2024
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Real-time
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        
        {/* Key Metrics Row - Optimized for 1440px */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
          {/* Demand Index */}
          <div className="card-minimal p-4 xl:p-6 space-y-3 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/40 transition-colors">
                  <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="text-sm font-semibold text-muted-foreground">Demand Index</span>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                Last 24h
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl xl:text-4xl font-black text-foreground tracking-tight">70</div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                  +5%
                </span>
                <span className="text-xs text-muted-foreground">vs. Yesterday</span>
              </div>
            </div>
          </div>

          {/* Market ADR */}
          <div className="card-minimal p-4 xl:p-6 space-y-3 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-semibold text-muted-foreground">Market ADR</span>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                Dubai
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl xl:text-4xl font-black text-foreground tracking-tight">$250</div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                  +2.1%
                </span>
                <span className="text-xs text-muted-foreground">vs. Yesterday</span>
              </div>
            </div>
          </div>

          {/* Market RevPAR */}
          <div className="card-minimal p-4 xl:p-6 space-y-3 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-semibold text-muted-foreground">Market RevPAR</span>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                Market
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl xl:text-4xl font-black text-foreground tracking-tight">$180</div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                  +3.5%
                </span>
                <span className="text-xs text-muted-foreground">vs. Yesterday</span>
              </div>
            </div>
          </div>

          {/* Market Occupancy - New 4th KPI */}
          <div className="card-minimal p-4 xl:p-6 space-y-3 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40 transition-colors">
                  <Percent className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-semibold text-muted-foreground">Market Occupancy</span>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                Current
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl xl:text-4xl font-black text-foreground tracking-tight">72%</div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                  +4.2%
                </span>
                <span className="text-xs text-muted-foreground">vs. Yesterday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Source Markets Section */}
        <div className="card-minimal overflow-hidden">
          {/* Header with Hotel Location and View Toggle */}
          <div className="px-4 py-3 bg-muted/20 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Hotel Badge - Clickable to show Dubai events */}
                <button
                  onClick={() => setSelectedMarket(null)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                    selectedMarket === null 
                      ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 shadow-sm'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-semibold text-red-700 dark:text-red-300">🇦🇪 Your Hotel - Dubai UAE</span>
                </button>
                <span className="text-sm text-muted-foreground">•</span>
                <h4 className="text-minimal-subtitle font-semibold text-foreground">Top Source Markets</h4>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-background border border-border rounded-lg">
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="h-7 px-2 text-xs"
                >
                  <Map className="w-3 h-3 mr-1" />
                  Map
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-7 px-2 text-xs"
                >
                  <List className="w-3 h-3 mr-1" />
                  List
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4">
            {viewMode === 'map' ? (
              /* Map View */
              <WorldMapVisualization />
            ) : (
              /* List View - Source Markets Grid */
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sourceMarketsData.map((market) => (
                    <button
                      key={market.name}
                      onClick={() => handleMarketClick(market.name)}
                      className={`p-4 text-left rounded-lg border transition-all duration-200 hover:shadow-sm ${
                        selectedMarket === market.name
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm'
                          : 'bg-card hover:bg-muted/30 border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{market.flag}</span>
                          <span className="font-semibold text-foreground text-sm">{market.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {market.percent}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Revenue</span>
                        <span className="font-semibold text-foreground">{market.value}</span>
                      </div>
                      {selectedMarket === market.name && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            {market.events.length} event{market.events.length !== 1 ? 's' : ''} affecting demand
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                {selectedMarket && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      💡 <strong>Tip:</strong> Click any market to see their specific events and holidays that might impact demand from that region.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Events & Holidays Section */}
        <div className="card-minimal overflow-hidden">
          <div className="px-4 py-3 bg-muted/20 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-minimal-subtitle font-semibold text-foreground">{getEventsTitle()}</h4>
                <p className="text-xs text-muted-foreground">{getEventsSubtitle()}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Always show Dubai Events button */}
                <Button
                  variant={selectedMarket === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMarket(null)}
                  className="text-xs"
                >
                  🇦🇪 Dubai Events
                </Button>
                {selectedMarket && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">|</span>
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs">
                      <span>Viewing:</span>
                      <span className="font-semibold text-blue-700 dark:text-blue-300">
                        {sourceMarketsData.find(m => m.name === selectedMarket)?.flag} {selectedMarket}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-4">
            <MyEventsHolidaysTable events={getEventsToShow()} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

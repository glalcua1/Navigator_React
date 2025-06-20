"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, MapPin, Users, TrendingUp } from "lucide-react"

interface EventData {
  name: string
  dates: string
  distance: string
  visitors: string
  impact: {
    percentage: string
    level: string
    calculation: string
  }
}

interface MyEventsHolidaysTableProps {
  events?: EventData[]
}

export function MyEventsHolidaysTable({ events }: MyEventsHolidaysTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  // Default events data if none provided
  const defaultData = [
    {
      name: "🇬🇧 Battle of the Boyne (in lieu) (Regional Holiday)",
      dates: "Mon 14 Jul",
      distance: "2.3 km",
      visitors: "15,000",
      impact: {
        percentage: "+12%",
        level: "high",
        calculation: "Based on historical data: 15,000 visitors × 0.8% hotel booking rate × average stay 2.1 nights = +12% occupancy increase"
      }
    },
    { 
      name: "🇮🇳 Behdiekhlam (Regional Holiday)", 
      dates: "Mon 14 Jul", 
      distance: "45.2 km", 
      visitors: "8,500",
      impact: {
        percentage: "+5%",
        level: "medium",
        calculation: "Based on historical data: 8,500 visitors × 0.6% hotel booking rate × average stay 1.8 nights = +5% occupancy increase"
      }
    },
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

  const data = events || defaultData

  const getImpactColor = (level: string) => {
    switch (level) {
      case "critical": return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
      case "high": return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20"
      case "medium": return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20"
      case "low": return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
      default: return "text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-900/20"
    }
  }

  const getImpactIcon = (level: string) => {
    switch (level) {
      case "critical": return "🔴"
      case "high": return "🟠"
      case "medium": return "🟡"
      case "low": return "🟢"
      default: return "⚪"
    }
  }

  // Calculate total expected impact
  const totalImpact = data.reduce((sum, event) => {
    const impactValue = parseInt(event.impact.percentage.replace('+', '').replace('%', ''))
    return sum + impactValue
  }, 0)

  return (
    <TooltipProvider>
      <div className="space-y-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/50">
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Event / Holiday
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Dates
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Distance
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Visitors
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Impact
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                key={index}
                className="hover:bg-muted/30 transition-colors cursor-pointer border-b border-border/30"
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="py-3">
                  <div className="flex items-start gap-2">
                    <div className="text-sm font-medium text-foreground leading-tight">
                      {row.name}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="py-3">
                  <div className="text-sm text-muted-foreground font-medium">
                    {row.dates}
                  </div>
                </TableCell>
                
                <TableCell className="py-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {row.distance}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell className="py-3">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">
                      {row.visitors}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105 ${getImpactColor(row.impact.level)}`}>
                          <span className="text-xs">{getImpactIcon(row.impact.level)}</span>
                          {row.impact.percentage}
                          <Info className="w-3 h-3 opacity-60" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="space-y-2">
                          <div className="font-semibold text-xs">Impact Calculation:</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            {row.impact.calculation}
                          </div>
                          <div className="text-xs text-muted-foreground border-t pt-2">
                            <strong>Factors considered:</strong> Historical booking patterns, event proximity, visitor demographics, seasonal trends
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Summary Bar */}
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-b-lg border-t border-border/30">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Total Events: <strong className="text-foreground">{data.length}</strong></span>
            <span>Expected Impact: <strong className="text-emerald-600 dark:text-emerald-400">+{totalImpact}% avg occupancy</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {data.length} active
            </Badge>
            <button className="text-xs font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">
              See suggested events
            </button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

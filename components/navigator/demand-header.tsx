"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ChevronDown, Settings, Download, CalendarIcon, Star, Filter, RefreshCw } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as React from "react"

export function DemandHeader() {
  const [dateRange, setDateRange] = React.useState<'7d' | '14d' | '30d' | '90d'>('7d') // Default to 7 days
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Calculate date ranges with past and future values
  const getDateRangeLabel = (range: string) => {
    const today = new Date()
    const days = range === '7d' ? 7 : range === '14d' ? 14 : range === '30d' ? 30 : 90
    const pastDays = Math.floor(days / 2)
    const futureDays = days - pastDays
    
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - pastDays)
    
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + futureDays)
    
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
      
      {/* Left Section - Title & Description */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Demand Analysis</h1>
        <p className="text-sm text-muted-foreground">
          Market demand insights with competitive intelligence and forecasting
        </p>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        
        {/* Date Range Selector */}
        <Tabs value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
          <TabsList className="grid grid-cols-4 w-64">
            <TabsTrigger value="7d" className="text-xs">7 Days</TabsTrigger>
            <TabsTrigger value="14d" className="text-xs">14 Days</TabsTrigger>
            <TabsTrigger value="30d" className="text-xs">30 Days</TabsTrigger>
            <TabsTrigger value="90d" className="text-xs">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Date Range Display */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {getDateRangeLabel(dateRange)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          
          {/* Refresh Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Updating...' : 'Refresh'}
          </Button>

          {/* Filters */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Market Segments</DropdownMenuItem>
              <DropdownMenuItem>Booking Channels</DropdownMenuItem>
              <DropdownMenuItem>Guest Types</DropdownMenuItem>
              <DropdownMenuItem>Rate Categories</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export Chart as PNG</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Dashboard Settings</DropdownMenuItem>
              <DropdownMenuItem>Chart Preferences</DropdownMenuItem>
              <DropdownMenuItem>Notification Settings</DropdownMenuItem>
              <DropdownMenuItem>Data Sources</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

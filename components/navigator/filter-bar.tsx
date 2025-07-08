"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Filter, X, Calendar, Users, Bed } from "lucide-react"
import { EnhancedDatePicker } from "@/components/enhanced-date-picker"
import { useDateContext } from "@/components/date-context"

/**
 * Filter Configuration
 * Professional filter options with proper categorization
 */
const visibleFiltersList = [
  {
    name: "Channel",
    defaultOption: "All Channels",
    options: ["All Channels", "Booking.com", "Expedia", "Direct", "Agoda", "Hotels.com"],
    isEditable: true,
    icon: Filter,
  },
  {
    name: "Comparison",
    defaultOption: "Primary Compset",
    options: ["Primary Compset", "Secondary Compset", "Custom Compset", "Market Average"],
    isEditable: true,
    icon: Users,
  },
]

const moreFiltersList = [
  {
    name: "Length of Stay",
    defaultOption: "1 night",
    options: ["1 night", "2 nights", "3 nights", "4+ nights", "Weekly", "Monthly"],
    isEditable: true,
    icon: Calendar,
  },
  {
    name: "Guests",
    defaultOption: "2 guests",
    options: ["1 guest", "2 guests", "3 guests", "4+ guests", "Family (5+)"],
    isEditable: true,
    icon: Users,
  },
  {
    name: "Room Type",
    defaultOption: "All Rooms",
    options: ["All Rooms", "Standard", "Deluxe", "Suite", "Family Room", "Premium"],
    isEditable: true,
    icon: Bed,
  },
  {
    name: "Rate Type",
    defaultOption: "All Rates",
    options: ["All Rates", "BAR", "Package Rates", "Promotional", "Last Minute"],
    isEditable: true,
    icon: Filter,
  },
]

const allFiltersList = [...visibleFiltersList, ...moreFiltersList]

interface FilterBarProps {
  onMoreFiltersClick?: () => void
}

/**
 * Enhanced Filter Bar Component
 * 
 * Professional filter interface with:
 * - Perfect vertical alignment and consistent heights
 * - Responsive design with proper spacing and hierarchy
 * - Icon integration for visual clarity
 * - Clean typography and visual balance
 * - Interactive filter management with clear actions
 * - Active filter visualization with mobile-friendly layout
 * - Proper container width matching page layout
 * 
 * @component
 * @version 3.0.0
 */
export function FilterBar({ onMoreFiltersClick }: FilterBarProps) {
  const { startDate, endDate, setDateRange } = useDateContext()
  const [selectedFilters, setSelectedFilters] = React.useState(() =>
    allFiltersList.reduce(
      (acc, group) => {
        acc[group.name] = group.defaultOption
        return acc
      },
      {} as Record<string, string>,
    ),
  )

  /**
   * Handle filter selection changes
   */
  const handleFilterChange = React.useCallback((groupName: string, option: string) => {
    setSelectedFilters((prev) => ({ ...prev, [groupName]: option }))
    console.log(`🔄 Filter changed: ${groupName} = ${option}`)
  }, [])

  /**
   * Handle date range updates
   */
  const handleDateRangeChange = React.useCallback((newStartDate?: Date, newEndDate?: Date) => {
    if (newStartDate && newEndDate) {
      setDateRange(newStartDate, newEndDate)
      console.log(`📅 Date range changed: ${newStartDate.toLocaleDateString()} - ${newEndDate.toLocaleDateString()}`)
    }
  }, [setDateRange])

  /**
   * Reset individual filter to default
   */
  const handleResetFilter = React.useCallback((groupName: string) => {
    const filter = allFiltersList.find((f) => f.name === groupName)
    if (filter) {
      setSelectedFilters((prev) => ({ ...prev, [groupName]: filter.defaultOption }))
      console.log(`🔄 Filter reset: ${groupName}`)
    }
  }, [])

  /**
   * Get currently active (non-default) filters
   */
  const getActiveFilters = React.useMemo(() => {
    return moreFiltersList.filter((filter) => selectedFilters[filter.name] !== filter.defaultOption)
  }, [selectedFilters])

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = React.useMemo(() => {
    return allFiltersList.some((filter) => selectedFilters[filter.name] !== filter.defaultOption)
  }, [selectedFilters])

  return (
    <div 
      className="bg-background border-b border-border shadow-sm"
      data-component-name="FilterBar"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="max-w-7xl xl:max-w-none mx-auto">
          <div className="flex items-center justify-between py-4 gap-4">
            
            {/* Left Section - Primary Filters */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              
              {/* Date Range Picker - Removed extra calendar icon */}
              <div className="shrink-0">
                <EnhancedDatePicker
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateRangeChange}
                />
              </div>

              {/* Compare with Date Dropdown */}
              <div className="shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 gap-2 px-4 font-medium transition-all duration-200 shrink-0 shadow-sm hover:shadow-md hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
                    >
                      <Calendar className="w-4 h-4" />
                      <span className="truncate max-w-[140px] font-semibold">
                        Compare with Date
                      </span>
                      <ChevronDown className="w-4 h-4 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 shadow-xl border-slate-200 dark:border-slate-700">
                    <DropdownMenuItem
                      onSelect={() => console.log("Last Report selected")}
                      className="cursor-pointer py-3 px-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Calendar className="w-4 h-4 mr-3 opacity-70" />
                      <span className="font-medium">Last Report</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => console.log("MoM selected")}
                      className="cursor-pointer py-3 px-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Calendar className="w-4 h-4 mr-3 opacity-70" />
                      <span className="font-medium">MoM</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => console.log("YoY selected")}
                      className="cursor-pointer py-3 px-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Calendar className="w-4 h-4 mr-3 opacity-70" />
                      <span className="font-medium">YoY</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-6 bg-border shrink-0" />

              {/* Visible Filters */}
              <div className="flex items-center gap-3 flex-wrap min-w-0">
                {visibleFiltersList.map((group) => {
                  const Icon = group.icon
                  const isActive = selectedFilters[group.name] !== group.defaultOption
                  
                  return (
                    <DropdownMenu key={group.name}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          className={`h-10 gap-2 px-4 font-medium transition-all duration-200 shrink-0 shadow-sm hover:shadow-md ${
                            isActive 
                              ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-blue-200/50" 
                              : "hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="truncate max-w-[140px] font-semibold">
                            {selectedFilters[group.name]}
                          </span>
                          <ChevronDown className="w-4 h-4 opacity-70" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-64 shadow-xl border-slate-200 dark:border-slate-700">
                        {group.options?.map((option) => (
                          <DropdownMenuItem
                            key={option}
                            onSelect={() => handleFilterChange(group.name, option)}
                            className={`cursor-pointer py-3 px-4 transition-colors ${
                              selectedFilters[group.name] === option 
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold" 
                                : "hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <Icon className="w-4 h-4 mr-3 opacity-70" />
                            <span className="font-medium">{option}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                })}

                {/* More Filters Button - Moved next to Primary Compset */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 gap-2 px-4 font-medium hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 transition-all duration-200 relative shadow-sm hover:shadow-md border-slate-200 dark:border-slate-700"
                  onClick={onMoreFiltersClick}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline font-semibold">More Filters</span>
                  <span className="sm:hidden font-semibold">Filters</span>
                  {getActiveFilters.length > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      {getActiveFilters.length}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Active More Filters Display */}
              {getActiveFilters.length > 0 && (
                <>
                  <div className="hidden lg:block w-px h-6 bg-border shrink-0" />
                  <div className="hidden lg:flex items-center gap-2 flex-wrap">
                    {getActiveFilters.slice(0, 2).map((filter) => (
                      <Badge
                        key={filter.name}
                        variant="secondary"
                        className="h-9 px-3 gap-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 flex items-center shrink-0 shadow-sm"
                      >
                        <span className="text-xs font-medium whitespace-nowrap">
                          {filter.name}: {selectedFilters[filter.name]}
                        </span>
                        <button
                          onClick={() => handleResetFilter(filter.name)}
                          className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {getActiveFilters.length > 2 && (
                      <Badge variant="outline" className="h-9 px-3 text-xs flex items-center shrink-0 shadow-sm">
                        +{getActiveFilters.length - 2} more
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-4 text-muted-foreground hover:text-foreground font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => {
                    // Reset all filters to default
                    setSelectedFilters(
                      allFiltersList.reduce(
                        (acc, group) => {
                          acc[group.name] = group.defaultOption
                          return acc
                        },
                        {} as Record<string, string>,
                      )
                    )
                    // Date range is managed by context
                    console.log("🔄 All filters reset")
                  }}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Active Filters Row */}
          {getActiveFilters.length > 0 && (
            <div className="lg:hidden pb-4 border-t border-border/50 pt-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground shrink-0">Active:</span>
                {getActiveFilters.slice(0, 4).map((filter) => (
                  <Badge
                    key={filter.name}
                    variant="secondary"
                    className="h-8 px-2 gap-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 flex items-center"
                  >
                    <span className="text-xs font-medium">
                      {filter.name}: {selectedFilters[filter.name]}
                    </span>
                    <button
                      onClick={() => handleResetFilter(filter.name)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {getActiveFilters.length > 4 && (
                  <Badge variant="outline" className="h-8 px-2 text-xs flex items-center">
                    +{getActiveFilters.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

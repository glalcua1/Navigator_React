"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Filter, X, Calendar, Users, Bed } from "lucide-react"
import { EnhancedDatePicker } from "@/components/enhanced-date-picker"

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
 * - Responsive design with proper spacing
 * - Icon integration for visual clarity
 * - Clean alignment and typography
 * - Interactive filter management
 * - Active filter visualization
 * 
 * @component
 * @version 2.0.0
 */
export function FilterBar({ onMoreFiltersClick }: FilterBarProps) {
  const [selectedFilters, setSelectedFilters] = React.useState(() =>
    allFiltersList.reduce(
      (acc, group) => {
        acc[group.name] = group.defaultOption
        return acc
      },
      {} as Record<string, string>,
    ),
  )
  
  const [dateRange, setDateRange] = React.useState<{ startDate?: Date; endDate?: Date }>({})

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
  const handleDateRangeChange = React.useCallback((startDate?: Date, endDate?: Date) => {
    setDateRange({ startDate, endDate })
    console.log(`📅 Date range changed: ${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`)
  }, [])

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 py-4">
          
          {/* Date Range Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <EnhancedDatePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={handleDateRangeChange}
            />
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-border" />

          {/* Visible Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {visibleFiltersList.map((group) => {
              const Icon = group.icon
              const isActive = selectedFilters[group.name] !== group.defaultOption
              
              return (
                <DropdownMenu key={group.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={`h-9 gap-2 font-medium transition-all duration-200 ${
                        isActive 
                          ? "bg-brand-600 hover:bg-brand-700 text-white border-brand-600" 
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="truncate max-w-[120px]">
                        {selectedFilters[group.name]}
                      </span>
                      <ChevronDown className="w-3 h-3 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {group.options?.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onSelect={() => handleFilterChange(group.name, option)}
                        className={`cursor-pointer ${
                          selectedFilters[group.name] === option 
                            ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300" 
                            : ""
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2 opacity-70" />
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })}
          </div>

          {/* Active More Filters Display */}
          {getActiveFilters.length > 0 && (
            <>
              <div className="hidden sm:block w-px h-6 bg-border" />
              <div className="flex flex-wrap items-center gap-2">
                {getActiveFilters.slice(0, 3).map((filter) => (
                  <Badge
                    key={filter.name}
                    variant="secondary"
                    className="h-7 px-3 gap-2 bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950 dark:text-brand-300 dark:border-brand-800"
                  >
                    <span className="text-xs font-medium">
                      {filter.name}: {selectedFilters[filter.name]}
                    </span>
                    <button
                      onClick={() => handleResetFilter(filter.name)}
                      className="hover:bg-brand-200 dark:hover:bg-brand-800 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {getActiveFilters.length > 3 && (
                  <Badge variant="outline" className="h-7 px-2 text-xs">
                    +{getActiveFilters.length - 3} more
                  </Badge>
                )}
              </div>
            </>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* More Filters Button */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-muted-foreground hover:text-foreground"
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
                  setDateRange({})
                  console.log("🔄 All filters reset")
                }}
              >
                Clear All
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              onClick={onMoreFiltersClick}
            >
              <Filter className="w-4 h-4" />
              More Filters
              {getActiveFilters.length > 0 && (
                <Badge 
                  className="ml-1 h-5 w-5 p-0 text-xs bg-brand-600 text-white rounded-full flex items-center justify-center"
                >
                  {getActiveFilters.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

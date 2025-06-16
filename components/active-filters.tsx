"use client"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { FilterValue } from "@/components/filter-sidebar"

interface ActiveFiltersProps {
  filters: FilterValue
  onRemove: (category: keyof FilterValue, value: string) => void
  onClearAll: () => void
}

export function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) return true
    if (key === "rateTypes" && Array.isArray(value) && value.length > 0) return true
    if (key === "roomTypes" && Array.isArray(value) && value.length > 0) return true
    if (key === "lossRange" && (value[0] > 0 || value[1] < 100)) return true
    if (key === "savedFilter" && value !== "") return true
    if (key === "viewBy" && value !== "cheapest") return true
    return false
  })

  if (!hasActiveFilters) return null

  const getLabelForId = (category: string, id: string) => {
    const mappings: Record<string, Record<string, string>> = {
      severity: {
        critical: "Critical",
        major: "Major",
        trivial: "Trivial",
      },
      channels: {
        booking: "Booking.com",
        expedia: "Expedia",
        agoda: "Agoda",
        makemytrip: "MakeMyTrip",
        tripadvisor: "Tripadvisor",
        google: "Google Hotel Finder",
      },
      violationTypes: {
        rate: "Rate Violations",
        availability: "Availability Violations",
      },
      regions: {
        europe: "Europe",
        asia: "Asia",
        namerica: "North America",
        samerica: "South America",
        oceania: "Oceania",
        africa: "Africa",
      },
      savedFilter: {
        "critical-violations": "Critical Violations",
        "booking-issues": "Booking.com Issues",
        "high-loss-properties": "High Loss Properties",
        "availability-problems": "Availability Problems",
      },
      rateTypes: {
        low: "Lowest (LOW)",
        bar: "Best Available Rate (BAR)",
        qlf: "Qualified (QLF)",
        rst: "Restricted (RST)",
        prm: "Promotional (PRM)",
        uql: "Un-Qualified (UQL)",
      },
      roomTypes: {
        any: "Any",
        apt: "Apartment (APT)",
        dlx: "Deluxe Room (DLX)",
        std: "Standard Room (STD)",
        stu: "Studio (STU)",
        ste: "Suite (STE)",
        sup: "Superior Room (SUP)",
        vll: "Villa (VLL)",
      },
      viewBy: {
        cheapest: "By Cheapest",
        split: "By Split",
        product: "By Product",
      },
    }

    return mappings[category]?.[id] || id
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Active filters:</span>

      {filters.savedFilter && (
        <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 border-blue-200">
          <span className="text-xs font-medium text-blue-700">
            Saved: {getLabelForId("savedFilter", filters.savedFilter)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-blue-100"
            onClick={() => onRemove("savedFilter", filters.savedFilter)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {filters.viewBy !== "cheapest" && (
        <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 border-blue-200">
          <span className="text-xs font-medium text-blue-700">View: {getLabelForId("viewBy", filters.viewBy)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-blue-100"
            onClick={() => onRemove("viewBy", filters.viewBy)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {(filters.lossRange[0] > 0 || filters.lossRange[1] < 100) && (
        <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 border-blue-200">
          <span className="text-xs font-medium text-blue-700">
            Loss: {filters.lossRange[0]}% - {filters.lossRange[1]}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-blue-100"
            onClick={() => onRemove("lossRange", "")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {filters.severity.map((value) => (
        <Badge key={`severity-${value}`} variant="outline" className="flex items-center gap-1 bg-red-50 border-red-200">
          <span className="text-xs font-medium text-red-700">Severity: {getLabelForId("severity", value)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-red-100"
            onClick={() => onRemove("severity", value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {filters.channels.map((value) => (
        <Badge
          key={`channel-${value}`}
          variant="outline"
          className="flex items-center gap-1 bg-blue-50 border-blue-200"
        >
          <span className="text-xs font-medium text-blue-700">Channel: {getLabelForId("channels", value)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-blue-100"
            onClick={() => onRemove("channels", value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {filters.violationTypes.map((value) => (
        <Badge
          key={`violation-${value}`}
          variant="outline"
          className="flex items-center gap-1 bg-amber-50 border-amber-200"
        >
          <span className="text-xs font-medium text-amber-700">
            Violation: {getLabelForId("violationTypes", value)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-amber-100"
            onClick={() => onRemove("violationTypes", value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {filters.regions.map((value) => (
        <Badge key={`region-${value}`} variant="outline" className="flex items-center gap-1 bg-cyan-50 border-cyan-200">
          <span className="text-xs font-medium text-cyan-700">Region: {getLabelForId("regions", value)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-cyan-100"
            onClick={() => onRemove("regions", value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {filters.rateTypes.map((value) => (
        <Badge
          key={`rate-type-${value}`}
          variant="outline"
          className="flex items-center gap-1 bg-indigo-50 border-indigo-200"
        >
          <span className="text-xs font-medium text-indigo-700">Rate Type: {getLabelForId("rateTypes", value)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-indigo-100"
            onClick={() => onRemove("rateTypes", value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {filters.roomTypes.map((value) => (
        <Badge
          key={`room-type-${value}`}
          variant="outline"
          className="flex items-center gap-1 bg-teal-50 border-teal-200"
        >
          <span className="text-xs font-medium text-teal-700">Room Type: {getLabelForId("roomTypes", value)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-teal-100"
            onClick={() => onRemove("roomTypes", value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-gray-600 hover:text-gray-900"
          onClick={onClearAll}
        >
          Clear all
        </Button>
      )}
    </div>
  )
}

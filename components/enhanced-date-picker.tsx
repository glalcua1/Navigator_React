"use client"

import * as React from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  addDays,
  subDays,
} from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DateMode = "last7days" | "last14days" | "last30days" | "currentMonth" | "next30days" | "next60days" | "next90days" | "customRange"

interface EnhancedDatePickerProps {
  startDate?: Date
  endDate?: Date
  onChange?: (startDate: Date | undefined, endDate: Date | undefined) => void
  className?: string
}

export function EnhancedDatePicker({ startDate, endDate, onChange, className }: EnhancedDatePickerProps) {
  const [selectedStartDate, setSelectedStartDate] = React.useState<Date | undefined>(startDate)
  const [selectedEndDate, setSelectedEndDate] = React.useState<Date | undefined>(endDate)
  const [currentMonth, setCurrentMonth] = React.useState<Date>(selectedStartDate || new Date())
  const [mode, setMode] = React.useState<DateMode>("last30days")
  const [isOpen, setIsOpen] = React.useState(false)

  // Initialize with last 30 days if no dates provided
  React.useEffect(() => {
    if (!startDate && !endDate) {
      const today = new Date()
      const thirtyDaysAgo = subDays(today, 29)
      setSelectedStartDate(thirtyDaysAgo)
      setSelectedEndDate(today)
      onChange?.(thirtyDaysAgo, today)
    } else {
      setSelectedStartDate(startDate)
      setSelectedEndDate(endDate)
    }
    if (startDate) {
      setCurrentMonth(startDate)
    }
  }, [startDate, endDate, onChange])

  const handleDateSelect = (date: Date) => {
    if (!selectedStartDate || selectedEndDate) {
      setSelectedStartDate(date)
      setSelectedEndDate(undefined)
    } else if (date < selectedStartDate) {
      setSelectedEndDate(selectedStartDate)
      setSelectedStartDate(date)
    } else {
      setSelectedEndDate(date)
    }
  }

  const handleModeChange = (newMode: DateMode) => {
    setMode(newMode)
    const today = new Date()
    let newStartDate: Date | undefined
    let newEndDate: Date | undefined

    switch (newMode) {
      case "last7days":
        newStartDate = subDays(today, 6) // 7 days including today
        newEndDate = today
        break
      case "last14days":
        newStartDate = subDays(today, 13) // 14 days including today
        newEndDate = today
        break
      case "last30days":
        newStartDate = subDays(today, 29) // 30 days including today
        newEndDate = today
        break
      case "currentMonth":
        newStartDate = startOfMonth(today)
        newEndDate = endOfMonth(today)
        break
      case "next30days":
        newStartDate = today
        newEndDate = addDays(today, 29) // 30 days including today
        break
      case "next60days":
        newStartDate = today
        newEndDate = addDays(today, 59) // 60 days including today
        break
      case "next90days":
        newStartDate = today
        newEndDate = addDays(today, 89) // 90 days including today
        break
      case "customRange":
      default:
        newStartDate = undefined
        newEndDate = undefined
        break
    }
    setSelectedStartDate(newStartDate)
    setSelectedEndDate(newEndDate)
    if (newStartDate) {
      setCurrentMonth(newStartDate)
    }
  }

  const handleApply = () => {
    onChange?.(selectedStartDate, selectedEndDate)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setSelectedStartDate(startDate)
    setSelectedEndDate(endDate)
    if (startDate) {
      setCurrentMonth(startDate)
    } else {
      setCurrentMonth(new Date())
    }
    setIsOpen(false)
  }

  const quickDateOptions = [
    { mode: "last7days" as DateMode, label: "Last 7 Days" },
    { mode: "last14days" as DateMode, label: "Last 14 Days" },
    { mode: "last30days" as DateMode, label: "Last 30 Days" },
    { mode: "currentMonth" as DateMode, label: "Current Month" },
    { mode: "next30days" as DateMode, label: "Next 30 Days" },
    { mode: "next60days" as DateMode, label: "Next 60 Days" },
    { mode: "next90days" as DateMode, label: "Next 90 Days" },
    { mode: "customRange" as DateMode, label: "Custom Range" },
  ]

  const renderCalendarMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const firstDayOfWeek = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1 // Adjust for Monday start
    const paddingDaysBefore = Array.from({ length: firstDayOfWeek }, (_, i) => {
      const paddingDate = new Date(monthStart)
      paddingDate.setDate(paddingDate.getDate() - (firstDayOfWeek - i))
      return paddingDate
    })

    const totalCells = 42 // 6 rows × 7 days
    const remainingCells = totalCells - (paddingDaysBefore.length + days.length)
    const paddingDaysAfter = Array.from({ length: remainingCells }, (_, i) => {
      const paddingDate = new Date(monthEnd)
      paddingDate.setDate(paddingDate.getDate() + i + 1)
      return paddingDate
    })

    const allDays = [...paddingDaysBefore, ...days, ...paddingDaysAfter]

    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold text-gray-700">{format(monthDate, "MMMM yyyy")}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {allDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, monthDate)
            const isSelected =
              (selectedStartDate && isSameDay(day, selectedStartDate)) ||
              (selectedEndDate && isSameDay(day, selectedEndDate))
            const isInRange =
              selectedStartDate &&
              selectedEndDate &&
              isWithinInterval(day, { start: selectedStartDate, end: selectedEndDate })
            const isToday = isSameDay(day, new Date())

            return (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "h-10 w-10 p-0 font-normal",
                  !isCurrentMonth && "text-gray-400 opacity-50",
                  (isSelected || isInRange) && "bg-blue-600 text-white hover:bg-blue-700",
                  isToday && !isSelected && !isInRange && "bg-gray-100 text-gray-900",
                  "hover:bg-gray-100 hover:text-gray-900",
                  (isSelected || isInRange) && "hover:bg-blue-700 hover:text-white",
                )}
                onClick={() => handleDateSelect(day)}
                disabled={!isCurrentMonth && mode === "customRange"}
              >
                {format(day, "d")}
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  const displayDateRange = React.useMemo(() => {
    if (selectedStartDate && selectedEndDate) {
      const dateRangeText = `${format(selectedStartDate, "dd MMM ''yy")} - ${format(selectedEndDate, "dd MMM ''yy")}`
      
      // Determine the label based on the current mode
      const today = new Date()
      const daysDiff = Math.round((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
      
      // Check if it matches common patterns
      if (isSameDay(selectedEndDate, today)) {
        if (daysDiff === 7) return `Last 7 Days • ${dateRangeText}`
        if (daysDiff === 14) return `Last 14 Days • ${dateRangeText}`
        if (daysDiff === 30) return `Last 30 Days • ${dateRangeText}`
      } else if (isSameDay(selectedStartDate, today)) {
        if (daysDiff === 30) return `Next 30 Days • ${dateRangeText}`
        if (daysDiff === 60) return `Next 60 Days • ${dateRangeText}`
        if (daysDiff === 90) return `Next 90 Days • ${dateRangeText}`
      }
      
      // Check for current month
      const monthStart = startOfMonth(today)
      const monthEnd = endOfMonth(today)
      if (isSameDay(selectedStartDate, monthStart) && isSameDay(selectedEndDate, monthEnd)) {
        return `Current Month • ${dateRangeText}`
      }
      
      // Default to just the date range for custom selections
      return dateRangeText
    } else if (selectedStartDate) {
      return `${format(selectedStartDate, "dd MMM ''yy")} - Select end date`
    } else {
      return "Select date range"
    }
  }, [selectedStartDate, selectedEndDate])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-semibold h-10 min-w-[280px] px-4 gap-2 shadow-sm hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800",
            !selectedStartDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          <span className="truncate">{displayDateRange}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Quick Date Options Sidebar */}
          <div className="w-48 border-r border-gray-200 p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Quick Select</h4>
            <div className="space-y-1">
              {quickDateOptions.map((option) => (
                <Button
                  key={option.mode}
                  variant={mode === option.mode ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => handleModeChange(option.mode)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Calendar */}
          {mode === "customRange" ? (
            <div className="p-4">
              {renderCalendarMonth(currentMonth)}
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleApply}
                  disabled={!selectedStartDate || !selectedEndDate}
                >
                  Apply
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 w-64">
              <div className="text-center">
                <h4 className="font-semibold text-gray-700 mb-2">Selected Range</h4>
                <p className="text-sm text-gray-600 mb-4">{displayDateRange}</p>
                <Button size="sm" onClick={handleApply} className="w-full">
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

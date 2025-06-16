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
} from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DateMode = "currentMonth" | "next30days" | "next60days" | "next90days" | "customRange"

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
  const [mode, setMode] = React.useState<DateMode>("customRange")
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setSelectedStartDate(startDate)
    setSelectedEndDate(endDate)
    if (startDate) {
      setCurrentMonth(startDate)
    }
  }, [startDate, endDate])

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
      return `${format(selectedStartDate, "dd MMM ''yy")} - ${format(selectedEndDate, "dd MMM ''yy")}`
    } else if (selectedStartDate) {
      return format(selectedStartDate, "dd MMM ''yy")
    }
    return "Select date range"
  }, [selectedStartDate, selectedEndDate])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-8 gap-1 font-normal min-w-[120px] justify-start bg-white border-gray-300", className)}
        >
          <CalendarIcon className="h-4 w-4" />
          {displayDateRange}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
          {/* Left sidebar with options */}
          <div className="w-48 border-r border-gray-200 bg-gray-50 p-4">
            <div className="space-y-2">
              <Button
                variant={mode === "currentMonth" ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  mode === "currentMonth"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => handleModeChange("currentMonth")}
              >
                Current month
              </Button>
              <Button
                variant={mode === "next30days" ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  mode === "next30days"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => handleModeChange("next30days")}
              >
                Next 30 days
              </Button>
              <Button
                variant={mode === "next60days" ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  mode === "next60days"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => handleModeChange("next60days")}
              >
                Next 60 days
              </Button>
              <Button
                variant={mode === "next90days" ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  mode === "next90days"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => handleModeChange("next90days")}
              >
                Next 90 days
              </Button>
              <Button
                variant={mode === "customRange" ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  mode === "customRange"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => handleModeChange("customRange")}
              >
                Custom
              </Button>
            </div>
          </div>

          {/* Calendar area */}
          <div className="p-4">
            <div className="flex gap-8">
              {renderCalendarMonth(currentMonth)}
              {renderCalendarMonth(addMonths(currentMonth, 1))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleApply}>Apply</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

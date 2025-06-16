"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { RateTrendGraph } from "./rate-trend-graph"
import { RateDetailModal } from "./rate-detail-modal" // Import the new modal
import { useState } from "react"

interface CalendarDay {
  date: number
  month: number // 0-indexed (0 for Jan, 11 for Dec)
  year: number
  price: string
  comparison: string
  hasFlag?: boolean
  flagCountry?: string
  hasIndicator?: boolean
  indicatorType?: "circle" | "square"
  indicatorColor?: string
}

// Updated calendarData to include month and year for Date object creation
const calendarData: CalendarDay[][] = [
  // Week 1 (May 26 - June 1, 2025) - Assuming current year is 2025 for example
  [
    { date: 26, month: 4, year: 2025, price: "$680", comparison: "-70% vs. Comp" },
    { date: 27, month: 4, year: 2025, price: "$680", comparison: "-70% vs. Comp" },
    { date: 28, month: 4, year: 2025, price: "$680", comparison: "-69% vs. Comp" },
    {
      date: 29,
      month: 4,
      year: 2025,
      price: "$680",
      comparison: "-69% vs. Comp",
      hasIndicator: true,
      indicatorType: "circle",
    },
    {
      date: 30,
      month: 4,
      year: 2025,
      price: "$680",
      comparison: "-69% vs. Comp",
      hasIndicator: true,
      indicatorType: "circle",
    },
    {
      date: 31,
      month: 4,
      year: 2025,
      price: "$680",
      comparison: "-69% vs. Comp",
      hasIndicator: true,
      indicatorType: "circle",
    },
    {
      date: 1,
      month: 5,
      year: 2025, // June 1st
      price: "$680",
      comparison: "-69% vs. Comp",
      hasIndicator: true,
      indicatorType: "square",
      indicatorColor: "bg-red-500",
    },
  ],
  // Week 2 (June 2-8, 2025)
  [
    {
      date: 2,
      month: 5,
      year: 2025,
      price: "$680",
      comparison: "-70% vs. Comp",
      hasIndicator: true,
      indicatorType: "circle",
    },
    { date: 3, month: 5, year: 2025, price: "$680", comparison: "-69% vs. Comp" },
    { date: 4, month: 5, year: 2025, price: "$680", comparison: "-69% vs. Comp" },
    { date: 5, month: 5, year: 2025, price: "$680", comparison: "-69% vs. Comp", hasFlag: true, flagCountry: "🇨🇦" },
    {
      date: 6,
      month: 5,
      year: 2025,
      price: "$680",
      comparison: "-69% vs. Comp",
      hasIndicator: true,
      indicatorType: "circle",
    },
    {
      date: 7,
      month: 5,
      year: 2025,
      price: "$680",
      comparison: "-70% vs. Comp",
      hasIndicator: true,
      indicatorType: "circle",
    },
    {
      date: 8,
      month: 5,
      year: 2025,
      price: "$680",
      comparison: "-71% vs. Comp",
      hasIndicator: true,
      indicatorType: "circle",
    },
  ],
  // Week 3 (June 9-15, 2025) - This is the week containing June 14th from the screenshot
  [
    {
      date: 9,
      month: 5,
      year: 2025,
      price: "$810",
      comparison: "-64% vs. Comp",
      hasIndicator: true,
      indicatorType: "circle",
      indicatorColor: "bg-orange-500",
    },
    { date: 10, month: 5, year: 2025, price: "$810", comparison: "-61% vs. Comp", hasFlag: true, flagCountry: "🇧🇪" },
    { date: 11, month: 5, year: 2025, price: "$810", comparison: "-61% vs. Comp", hasFlag: true, flagCountry: "🇮🇳" },
    { date: 12, month: 5, year: 2025, price: "$810", comparison: "-61% vs. Comp", hasFlag: true, flagCountry: "🇪🇸" },
    { date: 13, month: 5, year: 2025, price: "$810", comparison: "-61% vs. Comp" },
    { date: 14, month: 5, year: 2025, price: "$680", comparison: "-67% vs. Comp" }, // Saturday, June 14, 2025
    {
      date: 15,
      month: 5,
      year: 2025,
      price: "$680",
      comparison: "-67% vs. Comp",
      hasIndicator: true,
      indicatorType: "circle",
    },
  ],
  // Add more weeks as needed, ensuring month and year are correct
]

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

interface RateTrendCalendarProps {
  currentView: "calendar" | "chart" | "table"
}

export function RateTrendCalendar({ currentView }: RateTrendCalendarProps) {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(null)
  const [allDays, setAllDays] = useState<CalendarDay[]>([])

  // Flatten calendarData for easier navigation
  useState(() => {
    setAllDays(calendarData.flat())
  })

  const handleDateClick = (dayData: CalendarDay) => {
    setSelectedDateForModal(new Date(dayData.year, dayData.month, dayData.date))
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDateForModal(null)
  }

  const findDayIndex = (date: Date | null): number => {
    if (!date) return -1
    return allDays.findIndex(
      (d) => d.year === date.getFullYear() && d.month === date.getMonth() && d.date === date.getDate(),
    )
  }

  const navigateDay = (direction: "prev" | "next") => {
    if (!selectedDateForModal) return
    const currentIndex = findDayIndex(selectedDateForModal)

    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1

    if (newIndex >= 0 && newIndex < allDays.length) {
      const newDayData = allDays[newIndex]
      setSelectedDateForModal(new Date(newDayData.year, newDayData.month, newDayData.date))
    }
  }

  if (currentView === "chart") {
    return <RateTrendGraph />
  }

  if (currentView === "table") {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-500 py-8">Table view coming soon...</div>
      </div>
    )
  }

  const nextWeek = () => {
    setCurrentWeekIndex((prev) => Math.min(prev + 1, calendarData.length - 1))
  }

  const prevWeek = () => {
    setCurrentWeekIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Mobile View - Single Week with Navigation */}
        <div className="block lg:hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm" onClick={prevWeek} disabled={currentWeekIndex === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Week {currentWeekIndex + 1} of {calendarData.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextWeek}
                disabled={currentWeekIndex === calendarData.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Grid - 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              {calendarData[currentWeekIndex]?.map((day, dayIndex) => (
                <Card key={`mobile-${dayIndex}`} className="p-3 cursor-pointer" onClick={() => handleDateClick(day)}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {weekDays[dayIndex % 7]} {day.date} {/* Ensure weekday is correct */}
                      </span>
                      {day.hasFlag && <span className="text-lg">{day.flagCountry}</span>}
                      {day.hasIndicator && (
                        <div
                          className={`w-2 h-2 rounded-full ${day.indicatorColor || "bg-gray-400"} ${day.indicatorType === "square" ? "rounded-none" : ""}`}
                        />
                      )}
                    </div>
                    <div className="bg-green-100 rounded-md p-2 text-center">
                      <div className="text-lg font-bold text-gray-800">{day.price}</div>
                      <div className="text-xs text-green-700">{day.comparison}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop View - Full Calendar Grid */}
        <div className="hidden lg:block p-6">
          {/* Header */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-sm font-medium text-gray-600 text-center">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="space-y-4">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-4">
                {week.map((day, dayIndex) => (
                  <Card
                    key={`desktop-${weekIndex}-${dayIndex}`}
                    className="p-3 hover:shadow-md transition-shadow relative cursor-pointer"
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="space-y-2">
                      {/* Date and Flag */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">{day.date}</span>
                        {day.hasFlag && <span className="text-lg">{day.flagCountry}</span>}
                        {day.hasIndicator && (
                          <div
                            className={`w-2 h-2 rounded-full ${day.indicatorColor || "bg-gray-400"} ${day.indicatorType === "square" ? "rounded-none" : ""}`}
                          />
                        )}
                      </div>

                      {/* Price Card */}
                      <div className="bg-green-100 rounded-md p-2 text-center">
                        <div className="text-lg font-bold text-gray-800">{day.price}</div>
                        <div className="text-xs text-green-700">{day.comparison}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <RateDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedDate={selectedDateForModal}
        onPrevDay={() => navigateDay("prev")}
        onNextDay={() => navigateDay("next")}
      />
    </>
  )
}

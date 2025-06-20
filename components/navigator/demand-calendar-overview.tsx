"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Star,
  MapPin,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Calendar Event Interface
 * Simple structure for calendar events
 */
interface CalendarEvent {
  date: Date
  title: string
  type: "conference" | "festival" | "exhibition" | "sports" | "cultural" | "business"
  impact: "low" | "medium" | "high"
  location?: string
}

/**
 * Calendar Day Interface
 * Simplified structure for calendar days
 */
interface CalendarDay {
  date: Date
  dayNumber: number
  dayName: string
  isToday: boolean
  isCurrentMonth: boolean
  events: CalendarEvent[]
  hasEvents: boolean
}

/**
 * Get Event Type Styling
 * Returns styling based on event type and impact
 */
const getEventStyling = (events: CalendarEvent[]) => {
  if (!events.length) return {
    bg: "bg-slate-50 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
    indicator: ""
  }
  
  // Get highest impact event
  const highImpact = events.find(e => e.impact === "high")
  const mediumImpact = events.find(e => e.impact === "medium")
  
  if (highImpact) {
    return {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/40",
      text: "text-purple-900 dark:text-purple-100",
      border: "border-purple-300 dark:border-purple-700",
      indicator: "bg-purple-500",
      hover: "hover:from-purple-100 hover:to-purple-150 dark:hover:from-purple-900/40 dark:hover:to-purple-800/50"
    }
  } else if (mediumImpact) {
    return {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/40",
      text: "text-blue-900 dark:text-blue-100", 
      border: "border-blue-300 dark:border-blue-700",
      indicator: "bg-blue-500",
      hover: "hover:from-blue-100 hover:to-blue-150 dark:hover:from-blue-900/40 dark:hover:to-blue-800/50"
    }
  } else {
    return {
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/40",
      text: "text-emerald-900 dark:text-emerald-100",
      border: "border-emerald-300 dark:border-emerald-700", 
      indicator: "bg-emerald-500",
      hover: "hover:from-emerald-100 hover:to-emerald-150 dark:hover:from-emerald-900/40 dark:hover:to-emerald-800/50"
    }
  }
}

/**
 * Generate Calendar Events Data
 * Creates realistic events for the next 2 months in Dubai
 */
const generateCalendarEvents = (): CalendarEvent[] => {
  try {
    console.log('📅 Generating calendar events for Dubai market (2 months)')
    
    const today = new Date()
    const events: CalendarEvent[] = []
    
    // Dubai-specific events with realistic dates
    const eventTemplates = [
      { title: "GITEX Technology Week", type: "conference" as const, impact: "high" as const, location: "Dubai World Trade Centre" },
      { title: "Dubai Shopping Festival", type: "festival" as const, impact: "high" as const, location: "Dubai Mall" },
      { title: "Arab Health Exhibition", type: "exhibition" as const, impact: "medium" as const, location: "DWTC" },
      { title: "Dubai International Film Festival", type: "cultural" as const, impact: "medium" as const, location: "Madinat Jumeirah" },
      { title: "Business Leadership Summit", type: "business" as const, impact: "medium" as const, location: "Burj Al Arab" },
      { title: "Dubai Marathon", type: "sports" as const, impact: "high" as const, location: "Dubai Marina" },
      { title: "Middle East Energy Conference", type: "conference" as const, impact: "medium" as const, location: "DWTC" },
      { title: "Dubai Food Festival", type: "festival" as const, impact: "medium" as const, location: "Various Locations" },
      { title: "Gulfood Exhibition", type: "exhibition" as const, impact: "high" as const, location: "Dubai World Trade Centre" },
      { title: "Dubai Airshow", type: "exhibition" as const, impact: "high" as const, location: "Al Maktoum Airport" },
      { title: "Art Dubai Fair", type: "cultural" as const, impact: "medium" as const, location: "Madinat Jumeirah" },
      { title: "Dubai Fitness Challenge", type: "sports" as const, impact: "low" as const, location: "City Wide" },
      { title: "Global Education Summit", type: "conference" as const, impact: "low" as const, location: "Emirates Towers" },
      { title: "Dubai Design Week", type: "cultural" as const, impact: "medium" as const, location: "Design District" },
      { title: "FinTech Summit Middle East", type: "business" as const, impact: "medium" as const, location: "DIFC" }
    ]
    
    // Generate events for next 60 days
    for (let i = 1; i <= 60; i++) {
      const eventDate = new Date(today)
      eventDate.setDate(today.getDate() + i)
      
      // Add events with realistic frequency (about 25% of days have events)
      if (Math.random() > 0.75) {
        const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)]
        events.push({
          date: eventDate,
          ...template
        })
      }
    }
    
    console.log('✅ Calendar events generated:', events.length, 'events over 2 months')
    return events
    
  } catch (error) {
    console.error('❌ Error generating calendar events:', error)
    return []
  }
}

/**
 * Generate Calendar Days for Month
 * Creates calendar grid for a specific month
 */
const generateMonthDays = (year: number, month: number, events: CalendarEvent[], today: Date): CalendarDay[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const startPadding = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 // Monday = 0
  
  const days: CalendarDay[] = []
  
  // Add padding days from previous month
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
  
  for (let i = startPadding - 1; i >= 0; i--) {
    const dayNumber = daysInPrevMonth - i
    const date = new Date(prevYear, prevMonth, dayNumber)
    const dayEvents = events.filter(e => 
      e.date.getFullYear() === date.getFullYear() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getDate() === date.getDate()
    )
    
    days.push({
      date,
      dayNumber,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: date.toDateString() === today.toDateString(),
      isCurrentMonth: false,
      events: dayEvents,
      hasEvents: dayEvents.length > 0
    })
  }
  
  // Add current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dayEvents = events.filter(e => 
      e.date.getFullYear() === date.getFullYear() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getDate() === date.getDate()
    )
    
    days.push({
      date,
      dayNumber: day,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: date.toDateString() === today.toDateString(),
      isCurrentMonth: true,
      events: dayEvents,
      hasEvents: dayEvents.length > 0
    })
  }
  
  // Add padding days from next month
  const totalCells = Math.ceil(days.length / 7) * 7
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  
  for (let day = 1; days.length < totalCells; day++) {
    const date = new Date(nextYear, nextMonth, day)
    const dayEvents = events.filter(e => 
      e.date.getFullYear() === date.getFullYear() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getDate() === date.getDate()
    )
    
    days.push({
      date,
      dayNumber: day,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: date.toDateString() === today.toDateString(),
      isCurrentMonth: false,
      events: dayEvents,
      hasEvents: dayEvents.length > 0
    })
  }
  
  return days
}

/**
 * Enhanced 2-Month Calendar Overview Component
 * 
 * Clean, simple calendar view showing upcoming events over 2 months.
 * Focused on event visibility and professional presentation.
 * 
 * Features:
 * - 2-month calendar grid view
 * - Event highlighting with color coding
 * - Professional responsive design
 * - Event details on hover/click
 * - Dubai market focus
 * 
 * @returns Simple calendar overview component
 */
export function DemandCalendarOverview() {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isClient, setIsClient] = useState(false)
  
  const events = useMemo(() => generateCalendarEvents(), [])
  
  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  /**
   * Handle day selection
   */
  const handleDayClick = (day: CalendarDay) => {
    if (day.events.length > 0) {
      console.log('📅 Selected day with events:', {
        date: day.date.toLocaleDateString(),
        events: day.events.map(e => e.title)
      })
      setSelectedDay(day.date)
    }
  }
  
  /**
   * Navigate months
   */
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }
  
  // Generate calendar data for current and next month
  const today = new Date()
  const currentMonth = generateMonthDays(currentDate.getFullYear(), currentDate.getMonth(), events, today)
  const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
  const nextMonth = generateMonthDays(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), events, today)
  
  // Calculate statistics
  const totalEvents = events.length
  const upcomingEvents = events.filter(e => e.date >= today).length
  const highImpactEvents = events.filter(e => e.impact === 'high').length
  
  console.log('📊 Calendar statistics:', { totalEvents, upcomingEvents, highImpactEvents })
  
  // Loading state
  if (!isClient) {
    return (
      <section className="w-full bg-gradient-to-r from-slate-50/80 to-blue-50/60 dark:from-slate-900/80 dark:to-slate-800/60 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3"></div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  return (
    <section className="w-full bg-gradient-to-r from-slate-50/80 to-blue-50/60 dark:from-slate-900/80 dark:to-slate-800/60 border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 lg:py-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4 mb-4 lg:mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 shadow-sm">
                <Calendar className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-foreground leading-tight">
                  Event Calendar Overview
                </h2>
                <p className="text-sm lg:text-base text-muted-foreground mt-1">
                  Upcoming events and conferences in Dubai
                </p>
              </div>
            </div>
            
            {/* Event Statistics */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center lg:text-left">
                <div className="text-xl lg:text-2xl font-bold text-foreground">{upcomingEvents}</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Upcoming</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400">{highImpactEvents}</div>
                <div className="text-xs lg:text-sm text-muted-foreground">High Impact</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">{totalEvents}</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Total Events</div>
              </div>
            </div>
          </div>
          
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="text-center">
              <h3 className="text-lg lg:text-xl font-semibold text-foreground">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} & {nextMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateMonth('next')}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Two Month Calendar Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Current Month */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h4>
              
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs lg:text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {currentMonth.map((day, index) => {
                  const styling = getEventStyling(day.events)
                  const isSelected = selectedDay && day.date.toDateString() === selectedDay.toDateString()
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "relative h-12 lg:h-16 flex items-center justify-center text-sm lg:text-base font-medium rounded-lg transition-all duration-200 cursor-pointer",
                        styling.bg,
                        styling.text,
                        styling.border,
                        styling.hover,
                        day.isToday ? "ring-2 ring-blue-500 ring-offset-1" : "",
                        isSelected ? "ring-2 ring-purple-500 ring-offset-1" : "",
                        !day.isCurrentMonth ? "opacity-40" : "",
                        day.hasEvents ? "shadow-sm border" : "border border-transparent",
                        day.hasEvents ? "hover:scale-105" : ""
                      )}
                      onClick={() => handleDayClick(day)}
                    >
                      <span>{day.dayNumber}</span>
                      
                      {/* Event Indicators */}
                      {day.hasEvents && (
                        <div className="absolute top-1 right-1">
                          <div className={cn("w-2 h-2 rounded-full", styling.indicator)} />
                        </div>
                      )}
                      
                      {/* Multiple Events Indicator */}
                      {day.events.length > 1 && (
                        <div className="absolute bottom-1 left-1">
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            {day.events.length}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Next Month */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground text-center">
                {nextMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h4>
              
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs lg:text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {nextMonth.map((day, index) => {
                  const styling = getEventStyling(day.events)
                  const isSelected = selectedDay && day.date.toDateString() === selectedDay.toDateString()
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "relative h-12 lg:h-16 flex items-center justify-center text-sm lg:text-base font-medium rounded-lg transition-all duration-200 cursor-pointer",
                        styling.bg,
                        styling.text,
                        styling.border,
                        styling.hover,
                        day.isToday ? "ring-2 ring-blue-500 ring-offset-1" : "",
                        isSelected ? "ring-2 ring-purple-500 ring-offset-1" : "",
                        !day.isCurrentMonth ? "opacity-40" : "",
                        day.hasEvents ? "shadow-sm border" : "border border-transparent",
                        day.hasEvents ? "hover:scale-105" : ""
                      )}
                      onClick={() => handleDayClick(day)}
                    >
                      <span>{day.dayNumber}</span>
                      
                      {/* Event Indicators */}
                      {day.hasEvents && (
                        <div className="absolute top-1 right-1">
                          <div className={cn("w-2 h-2 rounded-full", styling.indicator)} />
                        </div>
                      )}
                      
                      {/* Multiple Events Indicator */}
                      {day.events.length > 1 && (
                        <div className="absolute bottom-1 left-1">
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            {day.events.length}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* Event Legend */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Low Impact Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Medium Impact Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-muted-foreground">High Impact Events</span>
            </div>
          </div>
          
          {/* Selected Day Events */}
          {selectedDay && (
            <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Events on {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h4>
              <div className="space-y-3">
                {events
                  .filter(e => e.date.toDateString() === selectedDay.toDateString())
                  .map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        event.impact === 'high' ? 'bg-purple-500' : 
                        event.impact === 'medium' ? 'bg-blue-500' : 'bg-emerald-500'
                      )} />
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground">{event.title}</h5>
                        {event.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {event.impact} Impact
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 
"use client"

import React, { createContext, useContext, useState } from 'react'
import { subDays } from 'date-fns'

interface DateContextType {
  startDate: Date
  endDate: Date
  setDateRange: (startDate: Date, endDate: Date) => void
  isLoading: boolean
}

const DateContext = createContext<DateContextType | undefined>(undefined)

export function DateProvider({ children }: { children: React.ReactNode }) {
  // Provide default values immediately to prevent hydration issues
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 29))
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const setDateRange = (newStartDate: Date, newEndDate: Date) => {
    setIsLoading(true)
    setStartDate(newStartDate)
    setEndDate(newEndDate)
    
    // Simulate data loading delay
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const value = {
    startDate,
    endDate,
    setDateRange,
    isLoading,
  }

  return (
    <DateContext.Provider value={value}>
      {children}
    </DateContext.Provider>
  )
}

export function useDateContext() {
  const context = useContext(DateContext)
  if (context === undefined) {
    throw new Error('useDateContext must be used within a DateProvider')
  }
  return context
} 
"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { subDays } from 'date-fns'

interface DateContextType {
  startDate: Date | null
  endDate: Date | null
  setDateRange: (startDate: Date, endDate: Date) => void
  isLoading: boolean
}

const DateContext = createContext<DateContextType | undefined>(undefined)

export function DateProvider({ children }: { children: React.ReactNode }) {
  // Initialize with null to prevent hydration mismatch
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize dates on client side only
  useEffect(() => {
    if (typeof window !== 'undefined' && !startDate && !endDate) {
      const now = new Date()
      setEndDate(now)
      setStartDate(subDays(now, 29))
    }
  }, [])

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
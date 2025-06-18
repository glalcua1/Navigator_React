"use client"
import { useState } from "react"
import { RateTrendCalendar } from "@/components/navigator/rate-trend-calendar"
import { RateTrendFilters } from "@/components/navigator/rate-trend-filters"
import { RateTrendHeader } from "@/components/navigator/rate-trend-header"

export default function RateTrendPage() {
  const [currentView, setCurrentView] = useState<"calendar" | "chart" | "table">("calendar")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
      
      {/* Professional Header Section */}
      <section className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl xl:max-w-none mx-auto">
            <RateTrendHeader currentView={currentView} onViewChange={setCurrentView} />
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="w-full bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl xl:max-w-none mx-auto">
            <RateTrendFilters />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 lg:py-8 xl:py-10">
        <div className="max-w-7xl xl:max-w-none mx-auto">
          <RateTrendCalendar currentView={currentView} />
        </div>
      </div>
    </div>
  )
}

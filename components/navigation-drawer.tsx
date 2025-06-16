"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Settings, 
  Bell, 
  MapPin, 
  Calendar, 
  FileText, 
  Shield, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  DollarSign,
  Target,
  Activity,
  Star
} from "lucide-react"

interface NavigationItem {
  id: string
  title: string
  href: string
  icon: React.ElementType
  badge?: string
  description?: string
}

// Main navigation items
const mainNavigationItems: NavigationItem[] = [
  {
    id: "overview",
    title: "Overview",
    href: "/",
    icon: Home,
    description: "Dashboard overview and key metrics"
  },
  {
    id: "rate-trends",
    title: "Rate Trends",
    href: "/rate-trend",
    icon: TrendingUp,
    description: "Rate trends and analysis"
  },
  {
    id: "ota-rankings",
    title: "OTA Rankings",
    href: "/ota-rankings",
    icon: Star,
    description: "Online travel agent rankings"
  },
  {
    id: "parity-monitor",
    title: "Parity Monitor",
    href: "/parity-monitoring",
    icon: Shield,
    description: "Rate parity tracking and alerts"
  },
  {
    id: "demand-forecast",
    title: "Demand Forecast",
    href: "/demand",
    icon: BarChart3,
    description: "Market demand forecasting"
  },
  {
    id: "events",
    title: "Events",
    href: "/events-calendar",
    icon: Calendar,
    description: "Event impact and calendar management"
  }
]

// Bottom navigation items
const bottomNavigationItems: NavigationItem[] = [
  {
    id: "settings",
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Application settings and preferences"
  },
  {
    id: "help",
    title: "Help & Support",
    href: "/help",
    icon: HelpCircle,
    description: "Documentation and support resources"
  }
]

interface NavigationDrawerProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function NavigationDrawer({ 
  isCollapsed = false, 
  onToggleCollapse 
}: NavigationDrawerProps) {
  const pathname = usePathname()

  // Debug logging
  useEffect(() => {
    console.log('🎯 NavigationDrawer mounted', { isCollapsed, pathname })
  }, [isCollapsed, pathname])

  const renderNavigationItems = (items: NavigationItem[]) => {
    return items.map((item) => {
      const Icon = item.icon
      const isActive = pathname === item.href
      
      return (
        <Link key={item.id} href={item.href}>
          <div
            className={cn(
              "nav-drawer-item group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative z-10",
              "hover:bg-muted/50 hover:text-foreground hover:shadow-sm",
              isActive 
                ? "bg-brand-50 text-brand-700 border border-brand-200 shadow-sm dark:bg-brand-950 dark:text-brand-300 dark:border-brand-800 active" 
                : "text-muted-foreground hover:text-foreground"
            )}
            title={isCollapsed ? item.title : undefined}
            onClick={() => console.log(`🔗 Navigation clicked: ${item.title}`)}
            data-nav-item={item.id}
          >
            <Icon className={cn(
              "h-4 w-4 shrink-0 transition-colors",
              isActive ? "text-brand-600 dark:text-brand-400" : ""
            )} />
            
            {!isCollapsed && (
              <>
                <span className="flex-1 truncate">{item.title}</span>
                {item.badge && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full shadow-sm dark:bg-red-900 dark:text-red-200">
                    {item.badge}
                  </span>
                )}
              </>
            )}
            
            {isCollapsed && item.badge && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full shadow-sm" />
            )}
          </div>
        </Link>
      )
    })
  }

  return (
    <div className={cn(
      "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] bg-white/95 dark:bg-slate-900/95 border-r border-border shadow-lg transition-all duration-300 ease-in-out nav-drawer backdrop-blur-md",
      isCollapsed ? "w-16" : "w-64"
    )}>
      
      {/* Header - Simplified without text */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="flex justify-center w-full">
          <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950 shadow-sm border border-brand-200 dark:border-brand-800">
            <Activity className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
        </div>
        
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('🔄 Toggle navigation drawer clicked')
              onToggleCollapse()
            }}
            className="h-8 w-8 p-0 hover:bg-muted transition-colors nav-toggle absolute right-4 dark:hover:bg-slate-800"
            data-nav-item="toggle"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
            )}
            <span className="sr-only">
              {isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            </span>
          </Button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-2 nav-drawer flex flex-col">
        {/* Main Navigation Items */}
        <div className="space-y-1 flex-1">
          {renderNavigationItems(mainNavigationItems)}
        </div>
        
        {/* Separator */}
        <div className="my-4 border-t border-border" />
        
        {/* Bottom Navigation Items */}
        <div className="space-y-1">
          {renderNavigationItems(bottomNavigationItems)}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="text-xs text-muted-foreground text-center">
            <p className="font-medium">Rate Parity Dashboard v2.0</p>
            <p className="mt-1 opacity-75">© 2024 Navigator Team</p>
          </div>
        </div>
      )}
    </div>
  )
} 
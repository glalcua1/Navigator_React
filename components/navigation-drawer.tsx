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

// Main navigation items - Core revenue management tools
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
    id: "demand-forecast",
    title: "Demand Forecast",
    href: "/demand",
    icon: BarChart3,
    description: "Market demand forecasting"
  },
  {
    id: "parity-monitor",
    title: "Parity Monitor",
    href: "/parity-monitoring",
    icon: Shield,
    description: "Rate parity tracking and alerts"
  },
  {
    id: "ota-rankings",
    title: "OTA Rankings",
    href: "/ota-rankings",
    icon: Star,
    description: "Online travel agent rankings"
  },
  {
    id: "events",
    title: "Events Calendar",
    href: "/events-calendar",
    icon: Calendar,
    description: "Event impact and calendar management"
  }
]

// Support and configuration items - Bottom section
const supportNavigationItems: NavigationItem[] = [
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
              "nav-drawer-item group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
              "hover:bg-muted/60 hover:text-foreground",
              isActive 
                ? "bg-brand-50 text-brand-700 border border-brand-200/50 shadow-sm dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-800/50" 
                : "text-muted-foreground hover:text-foreground"
            )}
            title={isCollapsed ? `${item.title}\n${item.description}` : undefined}
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
      
      {/* Header - Clean and Functional */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">Navigation</h2>
          </div>
        )}
        
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('🔄 Toggle navigation drawer clicked')
              onToggleCollapse()
            }}
            className={cn(
              "h-8 w-8 p-0 hover:bg-muted transition-colors nav-toggle dark:hover:bg-slate-800",
              isCollapsed ? "mx-auto" : "ml-auto"
            )}
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
      <nav className="flex-1 overflow-y-auto p-3 nav-drawer flex flex-col navigation-menu">
        {/* Main Navigation Section */}
        <div className="flex-1">
          {!isCollapsed && (
            <div className="mb-3">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                Revenue Management
              </h3>
            </div>
          )}
          <div className="space-y-1">
            {renderNavigationItems(mainNavigationItems)}
          </div>
        </div>
        
        {/* Support Section */}
        <div className="mt-auto">
          {!isCollapsed && (
            <div className="mb-3 pt-4 border-t border-border">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                Support
              </h3>
            </div>
          )}
          {isCollapsed && (
            <div className="mb-3 pt-4 border-t border-border" />
          )}
          <div className="space-y-1">
            {renderNavigationItems(supportNavigationItems)}
          </div>
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-border/50 bg-muted/20">
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span className="font-medium">Navigator v2.1</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">●</span>
            </div>
            <p className="mt-1 opacity-75">Revenue Management</p>
          </div>
        </div>
      )}
    </div>
  )
} 
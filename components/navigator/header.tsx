"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ChevronDown, Settings, UserCircle, Search, Bell, Menu, X, Activity } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

/**
 * Navigation Configuration
 * Centralized navigation structure for maintainability
 */
const navItems = [
  // Navigation items removed as requested
]

/**
 * Hotel Options with Enhanced Metadata
 * Professional hotel listing with detailed information
 */
const hotelOptions = [
  {
    id: "dubai-5star",
    name: "Dubai Hotel - 5 Star",
    location: "Dubai, UAE",
    category: "Luxury",
    rooms: 450,
  },
  {
    id: "newyork-grand",
    name: "New York Grand - 4 Star", 
    location: "New York, USA",
    category: "Premium",
    rooms: 320,
  },
  {
    id: "london-boutique",
    name: "London Boutique - 3 Star",
    location: "London, UK", 
    category: "Boutique",
    rooms: 180,
  },
  {
    id: "vakkaru-maldives",
    name: "Vakkaru Maldives - 30% off seaplane transfers",
    location: "Maldives",
    category: "Resort",
    rooms: 125,
  },
  {
    id: "four-seasons-landaa",
    name: "Four Seasons Resort Maldives at Landaa Giraavaru",
    location: "Maldives",
    category: "Ultra Luxury",
    rooms: 102,
  },
  {
    id: "oneonly-reethi",
    name: "One&Only Reethi Rah",
    location: "Maldives", 
    category: "Ultra Luxury",
    rooms: 130,
  },
  {
    id: "six-senses-laamu",
    name: "Six Senses Laamu",
    location: "Maldives",
    category: "Eco Luxury",
    rooms: 97,
  },
]

/**
 * Enhanced Header Component
 * 
 * A professional navigation header with:
 * - Brand gradient design system
 * - Responsive navigation with dropdowns
 * - Advanced hotel search functionality
 * - User notifications and settings
 * - Dark/light mode toggle
 * - Mobile-optimized responsive design
 * 
 * @component
 * @version 2.0.0
 */
export function Header() {
  // Hooks for navigation and state management
  const pathname = usePathname()
  const [selectedHotel, setSelectedHotel] = useState(hotelOptions[0])
  const [hotelSearch, setHotelSearch] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notificationCount] = useState(3) // Mock notification count

  /**
   * Determine active navigation tab based on current route
   * @returns {string} Active tab name
   */
  const getActiveTab = useCallback(() => {
    if (pathname === "/") return "Overview"
    if (pathname.startsWith("/rate-trend") || pathname.startsWith("/demand")) return "Analytics"
    return "Overview"
  }, [pathname])

  const activeTab = getActiveTab()

  /**
   * Filter hotels based on search query
   * Memoized for performance optimization
   */
  const filteredHotels = useMemo(() => {
    if (!hotelSearch.trim()) return hotelOptions
    
    const searchLower = hotelSearch.toLowerCase()
    return hotelOptions.filter(hotel => 
      hotel.name.toLowerCase().includes(searchLower) ||
      hotel.location.toLowerCase().includes(searchLower) ||
      hotel.category.toLowerCase().includes(searchLower)
    )
  }, [hotelSearch])

  /**
   * Handle hotel selection with debugging
   * @param {Object} hotel - Selected hotel object
   */
  const handleHotelSelect = useCallback((hotel) => {
    try {
      setSelectedHotel(hotel)
      setHotelSearch("")
      console.log(`🏨 Hotel selected: ${hotel.name} (ID: ${hotel.id})`)
    } catch (error) {
      console.error("❌ Error selecting hotel:", error)
    }
  }, [])

  /**
   * Toggle mobile menu visibility
   */
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[100] w-full bg-gradient-brand text-white border-b border-white/10 shadow-brand-lg"
      data-component-name="Header"
    >
      {/* Main Navigation Container */}
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side - Application Branding */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-white">Navigator</h1>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-1 flex-grow justify-center">
          {navItems.map((item) =>
            item.dropdown ? (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 hover:bg-white/10 ${
                      activeTab === item.name
                        ? "text-white bg-white/20 shadow-sm"
                        : "text-blue-100 hover:text-white"
                    }`}
                  >
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-brand-lg min-w-[280px]"
                  align="center"
                >
                  {item.items?.map((subItem, index) => (
                    <div key={subItem.name}>
                      <DropdownMenuItem asChild>
                        <Link
                          href={subItem.href}
                          className={`block px-4 py-3 text-sm hover:bg-gradient-brand-subtle transition-colors ${
                            pathname === subItem.href
                              ? "font-semibold text-brand-600 dark:text-brand-400 bg-gradient-brand-subtle"
                              : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{subItem.name}</span>
                            {subItem.description && (
                              <span className="text-xs text-muted-foreground">{subItem.description}</span>
                            )}
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      {index < item.items.length - 1 && <DropdownMenuSeparator />}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button key={item.name} variant="ghost" asChild>
                <Link
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium relative transition-all duration-200 hover:bg-white/10 ${
                    activeTab === item.name
                      ? "text-white bg-white/20 shadow-sm"
                      : "text-blue-100 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              </Button>
            )
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          
          {/* Hotel Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm text-blue-100 hover:text-white hover:bg-white/10 max-w-[200px] sm:max-w-[280px] flex items-center text-left transition-all duration-200"
              >
                <div className="flex flex-col items-start max-w-full">
                  <span className="truncate text-white font-medium">{selectedHotel.name}</span>
                  <span className="truncate text-xs text-blue-200">{selectedHotel.location}</span>
                </div>
                <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-white dark:bg-slate-900 w-80 sm:w-96 shadow-brand-lg" 
              align="end"
            >
              {/* Search Header */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search hotels, locations, categories..."
                    value={hotelSearch}
                    onChange={(e) => setHotelSearch(e.target.value)}
                    className="pl-10 w-full text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>
              
              {/* Hotel List */}
              <div className="max-h-72 overflow-y-auto">
                {filteredHotels.length > 0 ? (
                  filteredHotels.map((hotel) => (
                    <DropdownMenuItem
                      key={hotel.id}
                      onSelect={() => handleHotelSelect(hotel)}
                      className={`cursor-pointer px-4 py-3 transition-colors ${
                        selectedHotel.id === hotel.id
                          ? "bg-gradient-brand-subtle text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">{hotel.name}</span>
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                            {hotel.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{hotel.location}</span>
                          <span>{hotel.rooms} rooms</span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center">
                    <div className="text-sm text-slate-500 dark:text-slate-400">No hotels found.</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Try adjusting your search criteria
                    </div>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-blue-100 hover:text-white hover:bg-white/10 relative transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse-glow">
                {notificationCount}
              </span>
            )}
            <span className="sr-only">Notifications ({notificationCount})</span>
          </Button>

          {/* Theme Toggle */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>

          {/* User Profile */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <UserCircle className="h-5 w-5" />
            <span className="sr-only">User Profile</span>
          </Button>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-gradient-brand">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-blue-100 px-3 py-2">
                      {item.name}
                    </div>
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`block px-6 py-2 text-sm transition-colors ${
                          pathname === subItem.href
                            ? "text-white bg-white/20 rounded-lg font-medium"
                            : "text-blue-100 hover:text-white hover:bg-white/10 rounded-lg"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeTab === item.name
                        ? "text-white bg-white/20 font-medium"
                        : "text-blue-100 hover:text-white hover:bg-white/10"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

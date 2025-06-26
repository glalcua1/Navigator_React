"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  HelpCircle, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  RotateCcw,
  CheckCircle,
  Lightbulb,
  Target,
  Eye,
  MousePointer
} from "lucide-react"

interface CoachMark {
  id: string
  title: string
  description: string
  target: string
  position: "top" | "bottom" | "left" | "right"
  category: "navigation" | "data" | "actions" | "insights" | "revenue"
  priority: number
  action?: {
    type: "click" | "hover" | "scroll"
    description: string
  }
}

const coachMarks: CoachMark[] = [
  {
    id: "welcome",
    title: "🏨 Welcome to Revenue Management Central",
    description: "As a revenue manager, this dashboard is your command center for maximizing profitability. You'll monitor competitor pricing, identify revenue opportunities, and make data-driven pricing decisions. Let's explore the key tools that will drive your success.",
    target: "[data-coach-mark='dashboard-overview']",
    position: "bottom",
    category: "navigation",
    priority: 1
  },
  {
    id: "weekly-pricing",
    title: "📊 Weekly Pricing Strategy",
    description: "Start here every Monday! This shows your optimized pricing strategy for the week ahead, including weekend premiums, event-driven rates, and competitive positioning. Essential for weekly rate planning.",
    target: "[data-coach-mark='weekly-pricing']",
    position: "bottom",
    category: "actions",
    priority: 2,
    action: {
      type: "click",
      description: "Click to view this week's pricing strategy"
    }
  },
  {
    id: "revenue-kpis",
    title: "💰 Revenue Performance KPIs",
    description: "Your daily revenue health check. Monitor ADR trends, rate parity violations, and market position. Red indicators need immediate attention - they're costing you revenue right now.",
    target: "[data-coach-mark='kpi-cards']",
    position: "top",
    category: "data",
    priority: 3
  },
  {
    id: "competitor-analysis",
    title: "🎯 Competitor Rate Intelligence",
    description: "Your competitive advantage tool! See who's cheapest each day, identify pricing threats, and spot revenue opportunities. The tooltip shows market positioning and action recommendations.",
    target: "[data-coach-mark='rate-trends']",
    position: "top",
    category: "insights",
    priority: 4,
    action: {
      type: "hover",
      description: "Hover over chart points to see competitive threats and opportunities"
    }
  },
  {
    id: "market-demand-intelligence",
    title: "🌍 Market Demand Intelligence",
    description: "Understand where your guests come from and what events drive demand. Use the map to identify source market trends and the event calendar to anticipate demand spikes for strategic pricing.",
    target: "[data-coach-mark='market-demand']",
    position: "top",
    category: "insights",
    priority: 5,
    action: {
      type: "click",
      description: "Explore source markets and events affecting demand"
    }
  },
  {
    id: "property-health",
    title: "⚡ Revenue Health Diagnostics",
    description: "Your channel performance scorecard. Identify parity violations, ranking issues, and review problems that impact conversion. Focus on 'Critical' and 'High Priority' items first.",
    target: "[data-coach-mark='property-health']",
    position: "top",
    category: "actions",
    priority: 6
  },
  {
    id: "navigation-pages",
    title: "📈 Advanced Analytics Pages",
    description: "Access specialized tools: Demand forecasting for capacity planning, Rate Trends for historical analysis, and Help center for revenue management best practices and training materials.",
    target: ".navigation-menu",
    position: "right",
    category: "navigation",
    priority: 7,
    action: {
      type: "click",
      description: "Explore demand forecasting and rate trend analysis"
    }
  },
  {
    id: "daily-workflow",
    title: "🚀 Your Daily Revenue Workflow",
    description: "Success tip: Start each day by checking KPIs → Review competitor rates → Identify pricing opportunities → Adjust rates based on demand intelligence. This dashboard gives you everything needed for optimal revenue decisions.",
    target: "[data-coach-mark='dashboard-overview']",
    position: "bottom",
    category: "insights",
    priority: 8
  }
]

interface CoachMarkSystemProps {
  isVisible: boolean
  onClose: () => void
}

export function CoachMarkSystem({ isVisible, onClose }: CoachMarkSystemProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const currentCoachMark = coachMarks[currentStep]

  useEffect(() => {
    if (!isVisible || !currentCoachMark) return

    const findTarget = () => {
      if (typeof window === 'undefined') return null
      const element = document.querySelector(currentCoachMark.target) as HTMLElement
      if (element) {
        setTargetElement(element)
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Add highlight class
        element.classList.add('coach-mark-highlight')
      }
    }

    // Try to find target immediately
    findTarget()

    // If not found, try again after a short delay
    const timeout = setTimeout(findTarget, 100)

    return () => {
      clearTimeout(timeout)
      // Remove highlight from all elements
      if (typeof window !== 'undefined') {
        document.querySelectorAll('.coach-mark-highlight').forEach(el => {
          el.classList.remove('coach-mark-highlight')
        })
      }
    }
  }, [currentStep, isVisible, currentCoachMark])

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      if (currentStep < coachMarks.length - 1) {
        handleNext()
      } else {
        setIsPlaying(false)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [isPlaying, currentStep])

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]))
    if (currentStep < coachMarks.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkipToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const handleClose = () => {
    setIsPlaying(false)
    if (typeof window !== 'undefined') {
      document.querySelectorAll('.coach-mark-highlight').forEach(el => {
        el.classList.remove('coach-mark-highlight')
      })
    }
    onClose()
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setCompletedSteps(new Set())
    setIsPlaying(false)
  }

  const getPositionStyles = () => {
    if (!targetElement) return {}

    const rect = targetElement.getBoundingClientRect()
    const scrollTop = (typeof window !== 'undefined') ? (window.pageYOffset || document.documentElement.scrollTop) : 0
    const scrollLeft = (typeof window !== 'undefined') ? (window.pageXOffset || document.documentElement.scrollLeft) : 0

    const styles: React.CSSProperties = {
      position: 'absolute',
      zIndex: 1000
    }

    switch (currentCoachMark.position) {
      case 'top':
        styles.top = rect.top + scrollTop - 20
        styles.left = rect.left + scrollLeft + rect.width / 2
        styles.transform = 'translate(-50%, -100%)'
        break
      case 'bottom':
        styles.top = rect.bottom + scrollTop + 20
        styles.left = rect.left + scrollLeft + rect.width / 2
        styles.transform = 'translateX(-50%)'
        break
      case 'left':
        styles.top = rect.top + scrollTop + rect.height / 2
        styles.left = rect.left + scrollLeft - 20
        styles.transform = 'translate(-100%, -50%)'
        break
      case 'right':
        styles.top = rect.top + scrollTop + rect.height / 2
        styles.left = rect.right + scrollLeft + 20
        styles.transform = 'translateY(-50%)'
        break
    }

    return styles
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return <Target className="h-4 w-4" />
      case 'data': return <Eye className="h-4 w-4" />
      case 'actions': return <MousePointer className="h-4 w-4" />
      case 'insights': return <Lightbulb className="h-4 w-4" />
      case 'revenue': return <Target className="h-4 w-4" />
      default: return <HelpCircle className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'data': return 'bg-green-50 text-green-700 border-green-200'
      case 'actions': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'insights': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'revenue': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  if (!isVisible || !currentCoachMark) return null

  return (
    <>
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-[999] pointer-events-auto"
        onClick={handleClose}
      />

      {/* Coach Mark Card */}
      <Card 
        className="coach-mark-card max-w-sm shadow-2xl border-2 border-brand-200 dark:border-brand-700 z-[1001] pointer-events-auto relative"
        style={getPositionStyles()}
      >
        <CardContent className="p-4 pointer-events-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getCategoryColor(currentCoachMark.category)}`}>
                {getCategoryIcon(currentCoachMark.category)}
                {currentCoachMark.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {currentStep + 1} of {coachMarks.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 pointer-events-auto z-[1002]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground text-sm">
              {currentCoachMark.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentCoachMark.description}
            </p>

            {/* Action Hint */}
            {currentCoachMark.action && (
              <div className="bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-lg p-2">
                <p className="text-xs text-brand-700 dark:text-brand-300 flex items-center gap-1">
                  <MousePointer className="h-3 w-3" />
                  {currentCoachMark.action.description}
                </p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 mb-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{Math.round(((currentStep + 1) / coachMarks.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
              <div 
                className="bg-brand-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / coachMarks.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="h-7 px-2 pointer-events-auto z-[1002]"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-7 px-2 pointer-events-auto z-[1002]"
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRestart}
                className="h-7 px-2 pointer-events-auto z-[1002]"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="h-7 px-3 text-xs pointer-events-auto z-[1002]"
              >
                Skip Tour
              </Button>
              <Button
                size="sm"
                onClick={handleNext}
                className="h-7 px-3 text-xs pointer-events-auto z-[1002] bg-brand-600 hover:bg-brand-700"
              >
                {currentStep === coachMarks.length - 1 ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Indicators */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[1001] pointer-events-auto">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-full px-4 py-2 shadow-lg border pointer-events-auto">
          {coachMarks.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSkipToStep(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 pointer-events-auto hover:scale-110 ${
                index === currentStep
                  ? 'bg-brand-600 scale-125'
                  : completedSteps.has(index)
                  ? 'bg-emerald-500'
                  : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
              }`}
              title={`Step ${index + 1}: ${coachMarks[index].title}`}
            />
          ))}
        </div>
      </div>
    </>
  )
}

// Global Coach Mark Trigger Button
export function CoachMarkTrigger() {
  const [showCoachMarks, setShowCoachMarks] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(false)

  useEffect(() => {
    // Only run on client side to avoid SSR issues
    if (typeof window === 'undefined') return
    
    // Check if user has seen the tour before (for UI indication only)
    const hasSeenTour = localStorage.getItem('revenue-dashboard-tour-completed')
    const lastTourVersion = localStorage.getItem('revenue-dashboard-tour-version')
    const currentTourVersion = '2.1' // Updated version for revenue managers
    
    if (!hasSeenTour || lastTourVersion !== currentTourVersion) {
      setIsFirstVisit(true)
      // Note: Removed auto-start functionality - users must manually click the tour button
    }
  }, [])

  const handleCloseTour = () => {
    setShowCoachMarks(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('revenue-dashboard-tour-completed', 'true')
      localStorage.setItem('revenue-dashboard-tour-version', '2.1')
    }
    setIsFirstVisit(false)
  }

  return (
    <>
      {/* Revenue Manager Tour Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <Button
            onClick={() => setShowCoachMarks(true)}
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 hover:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-600 dark:hover:border-slate-500"
            size="sm"
            title="Start Revenue Manager Tour"
          >
            <HelpCircle className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          </Button>
          
          {/* Tooltip for first-time users */}
          {isFirstVisit && (
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
              🚀 New to revenue management? Take the tour!
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
            </div>
          )}
          
          {/* First Visit Pulse Animation */}
          {isFirstVisit && (
            <>
              <div className="absolute inset-0 rounded-full bg-emerald-600 animate-ping opacity-75" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-bounce flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Coach Mark System */}
      <CoachMarkSystem 
        isVisible={showCoachMarks} 
        onClose={handleCloseTour}
      />
    </>
  )
} 
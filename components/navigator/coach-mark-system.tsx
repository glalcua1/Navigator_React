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
  category: "navigation" | "data" | "actions" | "insights"
  priority: number
  action?: {
    type: "click" | "hover" | "scroll"
    description: string
  }
}

const coachMarks: CoachMark[] = [
  {
    id: "welcome",
    title: "Welcome to Your Revenue Dashboard",
    description: "This is your central hub for monitoring rates, analyzing competition, and optimizing revenue. Let's take a quick tour of the key features.",
    target: ".dashboard-header",
    position: "bottom",
    category: "navigation",
    priority: 1
  },
  {
    id: "navigation",
    title: "Navigation Menu",
    description: "Access all dashboard sections from here. Click the menu icon to expand or collapse the navigation panel.",
    target: ".nav-toggle",
    position: "right",
    category: "navigation",
    priority: 2,
    action: {
      type: "click",
      description: "Try clicking to expand the menu"
    }
  },
  {
    id: "kpis",
    title: "Key Performance Indicators",
    description: "Monitor your hotel's core metrics at a glance. These update in real-time and show trends compared to previous periods.",
    target: ".kpi-section",
    position: "top",
    category: "data",
    priority: 3
  },
  {
    id: "rate-trends",
    title: "Rate Trends Analysis",
    description: "Track your pricing performance over time. Use the filters to analyze different date ranges and compare with competitors.",
    target: ".rate-trends-chart",
    position: "top",
    category: "data",
    priority: 4,
    action: {
      type: "hover",
      description: "Hover over data points for detailed information"
    }
  },
  {
    id: "market-demand",
    title: "Market Demand Insights",
    description: "Understand market conditions and demand patterns. This helps you make informed pricing decisions.",
    target: ".market-demand-section",
    position: "top",
    category: "insights",
    priority: 5
  },
  {
    id: "alerts",
    title: "Smart Alerts",
    description: "Stay informed about important rate changes and market movements. Click the bell icon to view all alerts.",
    target: ".alerts-section",
    position: "left",
    category: "actions",
    priority: 6,
    action: {
      type: "click",
      description: "Click to view your alerts"
    }
  },
  {
    id: "help-support",
    title: "Help & Support",
    description: "Access our knowledge center, video tutorials, and submit support tickets. We're here to help you succeed!",
    target: "[data-nav-item='help']",
    position: "right",
    category: "navigation",
    priority: 7
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
      document.querySelectorAll('.coach-mark-highlight').forEach(el => {
        el.classList.remove('coach-mark-highlight')
      })
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
    document.querySelectorAll('.coach-mark-highlight').forEach(el => {
      el.classList.remove('coach-mark-highlight')
    })
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
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

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
      default: return <HelpCircle className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'data': return 'bg-green-50 text-green-700 border-green-200'
      case 'actions': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'insights': return 'bg-amber-50 text-amber-700 border-amber-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  if (!isVisible || !currentCoachMark) return null

  return (
    <>
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-[999]"
        onClick={handleClose}
      />

      {/* Coach Mark Card */}
      <Card 
        className="coach-mark-card max-w-sm shadow-2xl border-2 border-brand-200 dark:border-brand-700"
        style={getPositionStyles()}
      >
        <CardContent className="p-4">
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
              className="h-6 w-6 p-0"
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="h-7 px-2"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-7 px-2"
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRestart}
                className="h-7 px-2"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="h-7 px-3 text-xs"
              >
                Skip Tour
              </Button>
              <Button
                size="sm"
                onClick={handleNext}
                className="h-7 px-3 text-xs"
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
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-full px-4 py-2 shadow-lg border">
          {coachMarks.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSkipToStep(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentStep
                  ? 'bg-brand-600 scale-125'
                  : completedSteps.has(index)
                  ? 'bg-emerald-500'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
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
    // Check if user has seen the tour before
    const hasSeenTour = localStorage.getItem('revenue-dashboard-tour-completed')
    if (!hasSeenTour) {
      setIsFirstVisit(true)
      // Auto-start tour for first-time users after a short delay
      const timeout = setTimeout(() => {
        setShowCoachMarks(true)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [])

  const handleCloseTour = () => {
    setShowCoachMarks(false)
    localStorage.setItem('revenue-dashboard-tour-completed', 'true')
    setIsFirstVisit(false)
  }

  return (
    <>
      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowCoachMarks(true)}
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-brand-600 hover:bg-brand-700"
          size="sm"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        {/* First Visit Pulse Animation */}
        {isFirstVisit && (
          <div className="absolute inset-0 rounded-full bg-brand-600 animate-ping opacity-75" />
        )}
      </div>

      {/* Coach Mark System */}
      <CoachMarkSystem 
        isVisible={showCoachMarks} 
        onClose={handleCloseTour}
      />
    </>
  )
} 
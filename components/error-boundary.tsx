"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

/**
 * Error Boundary Props Interface
 * Defines the structure for error boundary component props
 */
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

/**
 * Error Boundary State Interface
 * Manages the error state and error information
 */
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  errorId: string
}

/**
 * Comprehensive React Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 * 
 * Features:
 * - Comprehensive error logging with stack traces
 * - User-friendly error display with recovery options
 * - Automatic error reporting for debugging
 * - Graceful degradation with fallback UI
 * - Error ID generation for tracking
 * 
 * @class ErrorBoundary
 * @extends {Component<ErrorBoundaryProps, ErrorBoundaryState>}
 * @author Revenue Management System
 * @version 2.0.0
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    
    // Initialize state
    this.state = {
      hasError: false,
      errorId: this.generateErrorId()
    }
  }

  /**
   * Generates a unique error ID for tracking purposes
   * @returns {string} Unique error identifier
   */
  private generateErrorId(): string {
    return `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Static method to derive state from error
   * Called when an error is thrown during rendering
   * 
   * @param {Error} error - The error that was thrown
   * @returns {Partial<ErrorBoundaryState>} New state object
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    console.error('🚨 Error Boundary: Error caught during rendering:', error)
    
    return {
      hasError: true,
      error,
      errorId: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
  }

  /**
   * Lifecycle method called when an error is caught
   * Used for error logging and reporting
   * 
   * @param {Error} error - The error that was thrown
   * @param {ErrorInfo} errorInfo - Additional error information
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.group('🚨 Error Boundary: Detailed Error Report')
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
    console.error('Component Stack:', errorInfo.componentStack)
    console.error('Error ID:', this.state.errorId)
    console.error('Timestamp:', new Date().toISOString())
    console.groupEnd()

    // Store error info in state
    this.setState({
      errorInfo
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo)
      } catch (handlerError) {
        console.error('🚨 Error in custom error handler:', handlerError)
      }
    }

    // Report error to external service (if needed)
    this.reportError(error, errorInfo)
  }

  /**
   * Reports error to external monitoring service
   * Can be extended to integrate with services like Sentry, LogRocket, etc.
   * 
   * @param {Error} error - The error that occurred
   * @param {ErrorInfo} errorInfo - Additional error context
   */
  private reportError(error: Error, errorInfo: ErrorInfo) {
    try {
      // Example: Send to analytics or error reporting service
      const errorReport = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
      }

      console.log('📊 Error Report Generated:', errorReport)
      
      // TODO: Send to external service
      // analytics.track('Error Boundary Triggered', errorReport)
      
    } catch (reportError) {
      console.error('🚨 Failed to report error:', reportError)
    }
  }

  /**
   * Handles retry functionality
   * Attempts to recover from the error by resetting state
   */
  private handleRetry = () => {
    console.log('🔄 Error Boundary: Attempting to retry...')
    
    // Clear any existing timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }

    // Reset error state
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: this.generateErrorId()
    })

    // Set a timeout to re-enable retry if error persists
    this.retryTimeoutId = setTimeout(() => {
      console.log('🔄 Error Boundary: Retry timeout completed')
    }, 1000)
  }

  /**
   * Handles navigation to home page
   */
  private handleGoHome = () => {
    console.log('🏠 Error Boundary: Navigating to home page')
    
    try {
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (navError) {
      console.error('🚨 Failed to navigate to home:', navError)
      // Fallback: reload the page
      window.location.reload()
    }
  }

  /**
   * Handles page reload
   */
  private handleReload = () => {
    console.log('🔄 Error Boundary: Reloading page')
    
    try {
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    } catch (reloadError) {
      console.error('🚨 Failed to reload page:', reloadError)
    }
  }

  /**
   * Cleanup method
   */
  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  /**
   * Renders the component
   * Shows error UI if error occurred, otherwise renders children
   */
  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-16 w-16 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-red-800 dark:text-red-200 text-2xl">
                Application Error
              </CardTitle>
              <p className="text-red-600 dark:text-red-300 mt-2">
                A client-side exception has occurred while loading the application.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error Details */}
              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Error Details
                </h3>
                <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <p><strong>Error ID:</strong> {this.state.errorId}</p>
                  <p><strong>Message:</strong> {this.state.error?.message || 'Unknown error'}</p>
                  <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
                </div>
              </div>

              {/* Recovery Actions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-red-800 dark:text-red-200">
                  Recovery Options
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    onClick={this.handleRetry}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                  
                  <Button
                    onClick={this.handleReload}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </Button>
                </div>
              </div>

              {/* Developer Information */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <summary className="font-semibold text-red-800 dark:text-red-200 cursor-pointer">
                    Developer Information (Development Only)
                  </summary>
                  <div className="mt-3 text-xs font-mono text-red-700 dark:text-red-300 whitespace-pre-wrap overflow-auto max-h-40">
                    {this.state.error.stack}
                  </div>
                  {this.state.errorInfo && (
                    <div className="mt-3 text-xs font-mono text-red-700 dark:text-red-300 whitespace-pre-wrap overflow-auto max-h-40">
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </details>
              )}

              {/* User Guidance */}
              <div className="text-center text-sm text-red-600 dark:text-red-300">
                <p>If the problem persists, please contact support with Error ID: <strong>{this.state.errorId}</strong></p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    // No error, render children normally
    return this.props.children
  }
}

/**
 * Higher-Order Component for wrapping components with error boundary
 * 
 * @param {React.ComponentType<any>} WrappedComponent - Component to wrap
 * @returns {React.ComponentType<any>} Component wrapped with error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> {
  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`

  return ComponentWithErrorBoundary
}

export default ErrorBoundary 
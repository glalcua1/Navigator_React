"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowDown, ArrowUp, Star, Hotel, Plane, Search, Shield, ExternalLink } from "lucide-react"

interface ChannelData {
  name: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  ranking?: {
    value: string
    change?: number
    total: string
    compset: string
  }
  reviewScore?: {
    value: string
    compset: string
  }
  parityIssues?: {
    count: number
    avgLoss: number
  }
}

const channelData: ChannelData[] = [
  {
    name: "Booking.com",
    icon: Hotel,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-950",
    ranking: {
      value: "6",
      change: -2,
      total: "19",
      compset: "1st"
    },
    reviewScore: {
      value: "0/10",
      compset: "--"
    },
    parityIssues: {
      count: 0,
      avgLoss: 0
    }
  },
  {
    name: "Expedia",
    icon: Plane,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-950",
    ranking: {
      value: "10",
      change: 2,
      total: "476",
      compset: "1st"
    },
    reviewScore: {
      value: "9.8/10",
      compset: "3rd"
    },
    parityIssues: {
      count: 28,
      avgLoss: -25
    }
  },
  {
    name: "Tripadvisor",
    icon: Star,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950",
    ranking: {
      value: "1",
      change: 0,
      total: "1",
      compset: "1st"
    },
    reviewScore: {
      value: "5/5",
      compset: "1st"
    },
    parityIssues: {
      count: 0,
      avgLoss: 0
    }
  },
  {
    name: "Agoda",
    icon: Search,
    iconColor: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-orange-50 dark:bg-orange-950",
    parityIssues: {
      count: 61,
      avgLoss: -22
    }
  }
]

export function PropertyHealthScoreWidget() {
  return (
    <Card className="card-enhanced">
      <CardHeader className="p-6 lg:p-7 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <CardTitle className="text-lg lg:text-xl font-bold text-foreground">Property Health Score</CardTitle>
            <p className="text-sm text-muted-foreground">Channel performance and parity monitoring</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 lg:p-7 pt-0 space-y-8">
        {channelData.map((channel, index) => {
          const Icon = channel.icon
          
          return (
            <div key={channel.name} className="space-y-5">
              {/* Channel Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${channel.iconBg} border border-current/20`}>
                    <Icon className={`w-4 h-4 ${channel.iconColor}`} />
                  </div>
                  <h4 className="text-base font-semibold text-foreground">{channel.name}</h4>
                </div>
                <a
                  href="#"
                  className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Details
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>

              {/* Channel Metrics - Fixed Grid Layout */}
              <div className="grid grid-cols-3 gap-6">
                
                {/* Ranking Column */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ranking</div>
                  {channel.ranking ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">{channel.ranking.value}</span>
                        {channel.ranking.change !== 0 && (
                          <span className={`text-sm font-medium flex items-center gap-1 ${
                            channel.ranking.change > 0 
                              ? "text-emerald-600 dark:text-emerald-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {channel.ranking.change > 0 ? "+" : ""}{channel.ranking.change}
                            {channel.ranking.change > 0 ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Out of {channel.ranking.total}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Compset: {channel.ranking.compset}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">--</div>
                  )}
                </div>

                {/* Review Score Column */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Review Score</div>
                  {channel.reviewScore ? (
                    <>
                      <div className="text-2xl font-bold text-foreground">{channel.reviewScore.value}</div>
                      <div className="text-xs text-muted-foreground">Own hotel</div>
                      <div className="text-xs text-muted-foreground">
                        Compset: {channel.reviewScore.compset}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">--</div>
                  )}
                </div>

                {/* Parity Issues Column */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Parity Issues</div>
                  {channel.parityIssues && (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">{channel.parityIssues.count}</span>
                        {channel.parityIssues.avgLoss !== 0 && (
                          <span className={`text-sm font-medium ${
                            channel.parityIssues.avgLoss < 0 
                              ? "text-red-600 dark:text-red-400" 
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}>
                            {channel.parityIssues.avgLoss < 0 ? "-" : "+"}${Math.abs(channel.parityIssues.avgLoss)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">90 days</div>
                      <div className="text-xs text-muted-foreground">
                        {channel.parityIssues.count === 0 ? "No issues" : "Issues detected"}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Separator */}
              {index < channelData.length - 1 && (
                <Separator className="mt-2" />
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

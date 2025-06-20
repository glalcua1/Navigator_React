"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Star, Hotel, Plane, Search, Shield, ExternalLink, AlertCircle, CheckCircle, Lightbulb, TrendingUp, DollarSign } from "lucide-react"

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

// Helper function to determine channel health status
const getChannelHealthStatus = (channel: ChannelData) => {
  const hasParityIssues = channel.parityIssues && channel.parityIssues.count > 0
  const hasGoodReviews = channel.reviewScore && parseFloat(channel.reviewScore.value) >= 4.0
  const hasGoodRanking = channel.ranking && parseInt(channel.ranking.value) <= 5

  if (hasParityIssues) return { status: 'warning', color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-950' }
  if (hasGoodReviews || hasGoodRanking) return { status: 'good', color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-950' }
  return { status: 'neutral', color: 'text-slate-600', bgColor: 'bg-slate-50 dark:bg-slate-950' }
}

// Generate revenue manager insights based on channel data
const generateRevenueManagerInsights = (channels: ChannelData[]) => {
  const insights = []
  
  // Check for parity issues
  const channelsWithIssues = channels.filter(c => c.parityIssues && c.parityIssues.count > 0)
  if (channelsWithIssues.length > 0) {
    const worstChannel = channelsWithIssues.reduce((worst, current) => 
      (current.parityIssues?.count || 0) > (worst.parityIssues?.count || 0) ? current : worst
    )
    insights.push({
      type: 'critical',
      icon: AlertCircle,
      title: 'Immediate Action Required',
      description: `${worstChannel.name} has ${worstChannel.parityIssues?.count} parity issues causing ${worstChannel.parityIssues?.avgLoss}% revenue loss`,
      action: 'Fix rate parity issues',
      priority: 'high'
    })
  }

  // Check for ranking opportunities
  const channelsWithRanking = channels.filter(c => c.ranking)
  const improvableRankings = channelsWithRanking.filter(c => parseInt(c.ranking!.value) > 5)
  if (improvableRankings.length > 0) {
    insights.push({
      type: 'opportunity',
      icon: TrendingUp,
      title: 'Ranking Optimization',
      description: `Improve visibility on ${improvableRankings.map(c => c.name).join(', ')} to increase bookings`,
      action: 'Optimize channel presence',
      priority: 'medium'
    })
  }

  // Check for review score issues
  const reviewIssues = channels.filter(c => c.reviewScore && parseFloat(c.reviewScore.value) < 4.0)
  if (reviewIssues.length > 0) {
    insights.push({
      type: 'warning',
      icon: Star,
      title: 'Review Score Alert',
      description: `${reviewIssues[0].name} has low review scores affecting conversion rates`,
      action: 'Improve guest experience',
      priority: 'medium'
    })
  }

  // Revenue opportunity insight
  const totalPotentialLoss = channels.reduce((sum, c) => sum + Math.abs(c.parityIssues?.avgLoss || 0), 0)
  if (totalPotentialLoss > 0) {
    insights.push({
      type: 'revenue',
      icon: DollarSign,
      title: 'Revenue Recovery Opportunity',
      description: `Fixing parity issues could recover up to ${Math.round(totalPotentialLoss / channels.length)}% average revenue`,
      action: 'Prioritize high-impact fixes',
      priority: 'high'
    })
  }

  return insights.slice(0, 3) // Return top 3 insights
}

export function PropertyHealthScoreWidget() {
  // Calculate overall summary stats
  const totalChannels = channelData.length
  const channelsWithIssues = channelData.filter(c => c.parityIssues && c.parityIssues.count > 0).length
  const totalParityIssues = channelData.reduce((sum, c) => sum + (c.parityIssues?.count || 0), 0)
  
  // Generate insights for revenue manager
  const insights = generateRevenueManagerInsights(channelData)

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 elevation-1">
              <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-minimal-title text-foreground">Property Health Score</CardTitle>
              <p className="text-minimal-body text-muted-foreground">Channel performance and parity monitoring</p>
            </div>
          </div>
          
          {/* Enhanced Summary Stats */}
          <div className="flex items-center gap-minimal-md">
            <div className="card-minimal p-3 text-center">
              <div className="text-2xl font-black text-foreground tracking-tight">{totalChannels}</div>
              <div className="text-minimal-caption text-muted-foreground">Channels</div>
            </div>
            <div className="card-minimal p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className={`text-2xl font-black tracking-tight ${channelsWithIssues > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {totalParityIssues}
                </span>
                {channelsWithIssues > 0 ? (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <div className="text-minimal-caption text-muted-foreground">Total Issues</div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-minimal-lg">
        {/* Revenue Manager Insights - New Section */}
        <div className="card-minimal p-5 space-y-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-l-4 border-blue-500">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-minimal-subtitle font-semibold text-foreground">Revenue Manager Focus Areas</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div key={index} className="flex flex-col gap-3 p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-white/80 dark:border-slate-700/80 h-full">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'critical' ? 'bg-red-100 dark:bg-red-900/30' :
                      insight.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
                      insight.type === 'opportunity' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                      'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        insight.type === 'critical' ? 'text-red-600 dark:text-red-400' :
                        insight.type === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                        insight.type === 'opportunity' ? 'text-emerald-600 dark:text-emerald-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`} />
                    </div>
                    <Badge className={`badge-minimal text-xs ${
                      insight.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h5 className="text-sm font-semibold text-foreground leading-tight">{insight.title}</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">→ {insight.action}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Channel Cards Grid - Enhanced with MUI styling and better spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {channelData.map((channel) => {
            const Icon = channel.icon
            const healthStatus = getChannelHealthStatus(channel)
            
            return (
              <Card key={channel.name} className="card-interactive">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-foreground">{channel.name}</h4>
                      <Badge className={`badge-minimal text-xs ${healthStatus.color} ${healthStatus.bgColor} border-current/20`}>
                        {healthStatus.status === 'warning' ? 'Issues' : 
                         healthStatus.status === 'good' ? 'Good' : 'OK'}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="btn-minimal h-6 w-6 p-0">
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 px-4 pb-4">
                  <div className="grid grid-cols-3 gap-4">
                    
                    {/* Ranking Metric - Optimized */}
                    <div className="text-center space-y-2">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ranking</div>
                      {channel.ranking ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xl font-black text-foreground">{channel.ranking.value}</span>
                            {channel.ranking.change !== 0 && (
                              <span className={`text-xs font-semibold flex items-center ${
                                channel.ranking.change > 0 
                                  ? "text-emerald-600 dark:text-emerald-400" 
                                  : "text-red-600 dark:text-red-400"
                              }`}>
                                {channel.ranking.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                {Math.abs(channel.ranking.change)}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            of {channel.ranking.total}
                          </div>
                        </div>
                      ) : (
                        <div className="text-lg text-muted-foreground">--</div>
                      )}
                    </div>

                    {/* Review Score - Optimized */}
                    <div className="text-center space-y-2">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reviews</div>
                      {channel.reviewScore ? (
                        <div className="space-y-1">
                          <div className="text-xl font-black text-foreground">{channel.reviewScore.value}</div>
                          <div className="text-xs text-muted-foreground">{channel.reviewScore.compset}</div>
                        </div>
                      ) : (
                        <div className="text-lg text-muted-foreground">--</div>
                      )}
                    </div>

                    {/* Parity Issues - Optimized */}
                    <div className="text-center space-y-2">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Parity</div>
                      {channel.parityIssues ? (
                        <div className="space-y-1">
                          <div className={`text-xl font-black ${
                            channel.parityIssues.count > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {channel.parityIssues.count}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {channel.parityIssues.count > 0 
                              ? `${channel.parityIssues.avgLoss}%` 
                              : 'Clean'
                            }
                          </div>
                        </div>
                      ) : (
                        <div className="text-lg text-muted-foreground">--</div>
                      )}
                    </div>
                  </div>


                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

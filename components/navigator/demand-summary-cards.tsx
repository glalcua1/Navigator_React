"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, TrendingUp, TrendingDown, Users, BarChart3, DollarSign, Percent } from "lucide-react"
import Link from "next/link"

interface SummaryCardProps {
  title: string
  value: string
  description?: string
  trend?: string
  trendDirection?: "up" | "down"
  linkText?: string
  linkHref?: string
  icon: React.ElementType
  iconColorClass: string
  bgColorClass: string
}

function SummaryCard({
  title,
  value,
  description,
  trend,
  trendDirection,
  linkText,
  linkHref,
  icon: Icon,
  iconColorClass,
  bgColorClass,
}: SummaryCardProps) {
  return (
    <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={`p-2 rounded-lg ${bgColorClass} border ${iconColorClass.replace('text-', 'border-').replace('-500', '-200')} dark:${iconColorClass.replace('text-', 'border-').replace('-500', '-800')}`}>
            <Icon className={`h-4 w-4 ${iconColorClass}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{description}</p>
        )}
        {trend && (
          <div className={`text-xs flex items-center gap-1 ${
            trendDirection === "up" 
              ? "text-emerald-600 dark:text-emerald-400" 
              : "text-red-600 dark:text-red-400"
          }`}>
            {trendDirection === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="font-medium">{trend}</span>
          </div>
        )}
        {linkText && linkHref && (
          <Link
            href={linkHref}
            className="inline-flex items-center text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 text-xs mt-3 font-medium transition-colors duration-200 group"
          >
            {linkText} 
            <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

export function DemandSummaryCards() {
  const summaryData: SummaryCardProps[] = [
    {
      title: "Avg. Market ADR",
      value: "$250",
      description: "Average Daily Rate in market",
      trend: "+2.1% vs. Yesterday",
      trendDirection: "up",
      linkText: "See in Demand AI",
      linkHref: "#",
      icon: DollarSign,
      iconColorClass: "text-emerald-600 dark:text-emerald-400",
      bgColorClass: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Avg. Market RevPAR",
      value: "$180",
      description: "Revenue Per Available Room",
      trend: "+3.5% vs. Yesterday",
      trendDirection: "up",
      linkText: "See in Demand AI",
      linkHref: "#",
      icon: BarChart3,
      iconColorClass: "text-brand-600 dark:text-brand-400",
      bgColorClass: "bg-brand-50 dark:bg-brand-950",
    },
    {
      title: "Price Difference",
      value: "+$15",
      description: "Avg. vs. comp set",
      trend: "Improved from +$12",
      trendDirection: "up",
      linkText: "See in Rate Trends",
      linkHref: "#",
      icon: Percent,
      iconColorClass: "text-purple-600 dark:text-purple-400",
      bgColorClass: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Top Source Market",
      value: "USA",
      description: "30% of total demand",
      linkText: "View all sources",
      linkHref: "#",
      icon: Users,
      iconColorClass: "text-amber-600 dark:text-amber-400",
      bgColorClass: "bg-amber-50 dark:bg-amber-950",
    },
  ]

  return (
    <section className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground mb-1">Market Summary</h2>
        <p className="text-sm text-muted-foreground">Key performance indicators and market positioning</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {summaryData.map((data) => (
          <SummaryCard key={data.title} {...data} />
        ))}
      </div>
    </section>
  )
}

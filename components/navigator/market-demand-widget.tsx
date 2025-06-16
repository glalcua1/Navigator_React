"use client"

import { ArrowRight, TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PriceDifferenceTable } from "./price-difference-table"
import { MyEventsHolidaysTable } from "./my-events-holidays-table"

export function MarketDemandWidget() {
  return (
    <Card className="card-enhanced">
      <CardHeader className="p-6 lg:p-7 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800">
            <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <CardTitle className="text-lg lg:text-xl font-bold text-foreground">Market Demand</CardTitle>
            <p className="text-sm text-muted-foreground">Current market performance indicators</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 lg:p-7 pt-0 space-y-8">
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 lg:gap-6">
          
          {/* Demand Index */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-muted-foreground">Demand Index</span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl lg:text-3xl font-bold text-foreground">70</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+5%</span> vs. Yesterday
              </p>
            </div>
          </div>

          {/* Market ADR */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-muted-foreground">Market ADR</span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl lg:text-3xl font-bold text-foreground">$250</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+2.1%</span> vs. Yesterday
              </p>
            </div>
          </div>

          {/* Market RevPAR */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-muted-foreground">Market RevPAR</span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl lg:text-3xl font-bold text-foreground">$180</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+3.5%</span> vs. Yesterday
              </p>
            </div>
          </div>

          {/* Price Difference */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-muted-foreground">Price Difference</span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl lg:text-3xl font-bold text-foreground">--</div>
              <p className="text-xs text-muted-foreground">Avg vs. comp set</p>
            </div>
          </div>
        </div>

        {/* Top Source Markets */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-foreground">Top Source Markets</h4>
            <a
              href="#"
              className="inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
            >
              View All
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
          
          <div className="space-y-3">
            {[
              { name: "United States", percent: 30 },
              { name: "United Kingdom", percent: 20 },
              { name: "Germany", percent: 10 },
              { name: "France", percent: 5 },
              { name: "Canada", percent: 5 },
            ].map((market) => (
              <div key={market.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{market.name}</span>
                  <span className="text-muted-foreground">{market.percent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-1000" 
                    style={{ width: `${market.percent}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Tables */}
        <div className="space-y-6">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-4 bg-muted/30">
              <h4 className="text-sm font-semibold text-foreground">Price Comparison</h4>
            </div>
            <div className="p-4">
              <PriceDifferenceTable />
            </div>
          </div>
          
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-4 bg-muted/30">
              <h4 className="text-sm font-semibold text-foreground">Events & Holidays</h4>
            </div>
            <div className="p-4">
              <MyEventsHolidaysTable />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

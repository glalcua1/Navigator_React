"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, AlertTriangle, DollarSign } from "lucide-react"

export function KPICards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Parity Score - Primary KPI */}
      <Card className="border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Parity Score</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-gray-800">20.2%</span>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+0.7%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">vs last period</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>

          {/* Meet and Win Progress Bars */}
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span>Meet</span>
                <span className="font-medium text-gray-700">20.2%</span>
              </div>
              <Progress value={20.2} className="h-2" indicatorClassName="bg-green-500" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span>Win</span>
                <span className="font-medium text-gray-700">0%</span>
              </div>
              <Progress value={0} className="h-2" indicatorClassName="bg-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loss Rate - Critical KPI */}
      <Card className="border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Loss Rate</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-red-600">79.8%</span>
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+1.3%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">vs last period</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>

          {/* Rate and Availability Violations */}
          <div className="mt-4 grid grid-cols-2 gap-4 pt-3 border-t">
            <div>
              <div className="text-xs text-gray-500">Rate Violations</div>
              <div className="text-lg font-bold text-gray-700">64.4%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Availability Violations</div>
              <div className="text-lg font-bold text-gray-700">15.4%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Loss - Financial KPI */}
      <Card className="border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Revenue Loss</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-red-600">$1.06M</span>
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+$127K</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">vs last period</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
          </div>

          {/* Breakdown */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Availability Issues</span>
              <span className="font-medium text-gray-700">81.5% ($865K)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Rate Violations</span>
              <span className="font-medium text-gray-700">18.5% ($197K)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

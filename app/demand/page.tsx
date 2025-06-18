import { CardDescription } from "@/components/ui/card"
import { DemandCalendar } from "@/components/navigator/demand-calendar"
import { DemandForecastChart } from "@/components/navigator/demand-forecast-chart"
import { DemandHeader } from "@/components/navigator/demand-header"
import { DemandSummaryCards } from "@/components/navigator/demand-summary-cards"
import { MyEventsHolidaysTable } from "@/components/navigator/my-events-holidays-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Calendar, BarChart3, Activity } from "lucide-react"

export default function DemandPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
      {/* Professional Header Section */}
      <section className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl xl:max-w-none mx-auto">
            <DemandHeader />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 lg:py-8 xl:py-10">
        <div className="max-w-7xl xl:max-w-none mx-auto space-y-6 lg:space-y-8">
          
          {/* Main Demand Forecast Chart - Enhanced */}
          <section className="w-full">
            <Card className="card-enhanced">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl lg:text-2xl xl:text-3xl font-bold text-foreground flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950">
                        <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-brand-600 dark:text-brand-400" />
                      </div>
                      Demand Forecast & Trends
                    </CardTitle>
                    <CardDescription className="text-sm lg:text-base text-muted-foreground">
                      Market demand analysis with pricing insights and competitive positioning
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 xl:p-8">
                <DemandForecastChart />
              </CardContent>
            </Card>
          </section>

          {/* Summary Cards Section */}
          <section className="w-full">
            <DemandSummaryCards />
          </section>

          {/* Events & Insights Section */}
          <section className="w-full">
            <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-7 gap-6 lg:gap-8">
              
              {/* Events & Holidays Table */}
              <div className="xl:col-span-2 2xl:col-span-4">
                <Card className="card-enhanced h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
                        <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg lg:text-xl xl:text-2xl font-bold text-foreground">Events & Holidays</CardTitle>
                        <CardDescription className="text-sm lg:text-base text-muted-foreground">
                          Upcoming events affecting demand patterns
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 xl:p-8">
                    <MyEventsHolidaysTable />
                  </CardContent>
                </Card>
              </div>

              {/* AI Insights Panel */}
              <div className="xl:col-span-1 2xl:col-span-3">
                <Card className="card-enhanced h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                        <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg lg:text-xl xl:text-2xl font-bold text-foreground">AI Insights</CardTitle>
                        <CardDescription className="text-sm lg:text-base text-muted-foreground">
                          Smart recommendations
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 xl:p-8">
                    <div className="space-y-4 lg:space-y-6">
                      
                      {/* High Priority Insight */}
                      <div className="p-4 lg:p-5 rounded-lg border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 animate-pulse" />
                          <div>
                            <h4 className="font-semibold text-foreground text-sm lg:text-base mb-1">High Demand Alert</h4>
                            <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                              July 4th weekend shows 85% higher demand. Consider rate optimization.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Market Opportunity */}
                      <div className="p-4 lg:p-5 rounded-lg border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                          <div>
                            <h4 className="font-semibold text-foreground text-sm lg:text-base mb-1">Market Opportunity</h4>
                            <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                              UK market showing 23% booking increase. Expand targeting.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Competitive Intelligence */}
                      <div className="p-4 lg:p-5 rounded-lg border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                          <div>
                            <h4 className="font-semibold text-foreground text-sm lg:text-base mb-1">Competitive Edge</h4>
                            <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                              Competitor rates 15% higher mid-week. Capture market share.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metric */}
                      <div className="pt-4 lg:pt-6 mt-4 lg:mt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-xs lg:text-sm font-medium text-muted-foreground">Forecast Accuracy</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 lg:w-20 h-2 lg:h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className="w-[92%] h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                            </div>
                            <span className="text-xs lg:text-sm font-bold text-emerald-600 dark:text-emerald-400">92%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

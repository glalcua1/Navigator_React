"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  MessageCircle, 
  HelpCircle,
  TrendingUp,
  BarChart3,
  Calendar,
  Shield,
  Users,
  Settings,
  ChevronRight,
  Clock,
  Star,
  Download,
  ExternalLink,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Play,
  Bookmark
} from "lucide-react"
import Link from "next/link"
import { SupportTicketForm } from "@/components/navigator/support-ticket-form"

interface KnowledgeArticle {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  tags: string[]
  type: "article" | "video" | "guide" | "faq"
  popular?: boolean
  new?: boolean
}

interface VideoTutorial {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}

const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "1",
    title: "Getting Started with Rate Parity Dashboard",
    description: "Complete guide to understanding your dashboard and key metrics",
    category: "Getting Started",
    readTime: "5 min",
    difficulty: "Beginner",
    tags: ["dashboard", "overview", "basics"],
    type: "guide",
    popular: true,
    new: true
  },
  {
    id: "2",
    title: "Understanding Rate Spread Analysis",
    description: "Learn how to interpret rate spread charts and competitive positioning",
    category: "Rate Management",
    readTime: "8 min",
    difficulty: "Intermediate",
    tags: ["rates", "competition", "analysis"],
    type: "article",
    popular: true
  },
  {
    id: "3",
    title: "Demand Forecasting Best Practices",
    description: "Strategies for accurate demand prediction and revenue optimization",
    category: "Demand Management",
    readTime: "12 min",
    difficulty: "Advanced",
    tags: ["forecasting", "demand", "strategy"],
    type: "guide"
  },
  {
    id: "4",
    title: "Setting Up Rate Alerts",
    description: "Configure automated alerts for rate changes and market movements",
    category: "Alerts & Notifications",
    readTime: "6 min",
    difficulty: "Beginner",
    tags: ["alerts", "automation", "monitoring"],
    type: "article"
  },
  {
    id: "5",
    title: "Competitor Analysis Deep Dive",
    description: "Advanced techniques for competitive intelligence and positioning",
    category: "Competitive Intelligence",
    readTime: "15 min",
    difficulty: "Advanced",
    tags: ["competition", "intelligence", "strategy"],
    type: "guide",
    popular: true
  },
  {
    id: "6",
    title: "Export and Reporting Features",
    description: "How to generate and customize reports for stakeholders",
    category: "Reporting",
    readTime: "7 min",
    difficulty: "Intermediate",
    tags: ["reports", "export", "data"],
    type: "article"
  }
]

const videoTutorials: VideoTutorial[] = [
  {
    id: "v1",
    title: "Dashboard Overview - 5 Minute Tour",
    description: "Quick walkthrough of all dashboard features and navigation",
    duration: "5:23",
    thumbnail: "/api/placeholder/320/180",
    category: "Getting Started",
    difficulty: "Beginner"
  },
  {
    id: "v2",
    title: "Rate Trends Analysis Masterclass",
    description: "Deep dive into rate trend analysis and interpretation",
    duration: "18:45",
    thumbnail: "/api/placeholder/320/180",
    category: "Rate Management",
    difficulty: "Advanced"
  },
  {
    id: "v3",
    title: "Setting Up Your First Rate Alert",
    description: "Step-by-step guide to configuring rate monitoring alerts",
    duration: "8:12",
    thumbnail: "/api/placeholder/320/180",
    category: "Alerts & Notifications",
    difficulty: "Beginner"
  }
]

const faqItems = [
  {
    question: "How often is rate data updated?",
    answer: "Rate data is updated every 4 hours during business hours and every 8 hours during off-peak times. You can see the last update time in the header of each page."
  },
  {
    question: "What does 'rate parity' mean?",
    answer: "Rate parity means maintaining consistent pricing across all distribution channels. Our dashboard helps you monitor and maintain parity by tracking rate differences across OTAs and direct booking channels."
  },
  {
    question: "How do I interpret the demand forecast accuracy?",
    answer: "Demand forecast accuracy is calculated by comparing predicted vs. actual demand over the past 30 days. An accuracy above 85% is considered excellent for revenue management purposes."
  },
  {
    question: "Can I customize the dashboard layout?",
    answer: "Yes, you can customize widget positions, hide/show sections, and set default date ranges in the Settings menu. Your preferences are saved automatically."
  },
  {
    question: "What's the difference between ADR and RevPAR?",
    answer: "ADR (Average Daily Rate) is the average price of occupied rooms, while RevPAR (Revenue Per Available Room) factors in occupancy by dividing total room revenue by total available rooms."
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showSupportForm, setShowSupportForm] = useState(false)

  const categories = [
    "all",
    "Getting Started",
    "Rate Management", 
    "Demand Management",
    "Competitive Intelligence",
    "Alerts & Notifications",
    "Reporting"
  ]

  const filteredArticles = knowledgeArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
      case "Intermediate": return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
      case "Advanced": return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />
      case "guide": return <BookOpen className="h-4 w-4" />
      case "faq": return <HelpCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
      
      {/* Header Section */}
      <section className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl xl:max-w-none mx-auto py-6 lg:py-8 xl:py-10">
            <div className="text-center space-y-4 lg:space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="p-3 lg:p-4 rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950">
                  <BookOpen className="w-8 h-8 lg:w-10 lg:h-10 text-brand-600 dark:text-brand-400" />
                </div>
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground">Knowledge Center</h1>
              </div>
              <p className="text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-4xl mx-auto">
                Everything you need to master revenue management and maximize your hotel's performance
              </p>
              
              {/* Search Bar */}
              <div className="max-w-3xl mx-auto mt-6 lg:mt-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 lg:h-6 lg:w-6 text-muted-foreground" />
                  <Input
                    placeholder="Search articles, guides, and tutorials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 lg:pl-12 pr-4 py-3 lg:py-4 text-base lg:text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 lg:py-10 xl:py-12">
        <div className="max-w-7xl xl:max-w-none mx-auto">
          
          <Tabs defaultValue="knowledge" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="knowledge" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Knowledge Base
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <Video className="h-4 w-4" />
                Video Tutorials
              </TabsTrigger>
              <TabsTrigger value="faq" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="support" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Get Support
              </TabsTrigger>
            </TabsList>

            {/* Knowledge Base Tab */}
            <TabsContent value="knowledge" className="space-y-6">
              
              {/* Quick Start Section */}
              <section>
                <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-4 lg:mb-6">Quick Start Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
                  {knowledgeArticles.filter(article => article.category === "Getting Started").map((article) => (
                    <Card key={article.id} className="card-enhanced hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(article.type)}
                            <CardTitle className="text-base font-semibold group-hover:text-brand-600 transition-colors">
                              {article.title}
                            </CardTitle>
                          </div>
                          {article.new && <Badge variant="secondary" className="text-xs">New</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{article.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getDifficultyColor(article.difficulty)}`}>
                              {article.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.readTime}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Category Filter */}
              <section>
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">All Articles</h2>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="text-xs"
                      >
                        {category === "all" ? "All Categories" : category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="card-enhanced hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(article.type)}
                            <CardTitle className="text-lg font-semibold group-hover:text-brand-600 transition-colors">
                              {article.title}
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            {article.popular && <Star className="h-4 w-4 text-amber-500" />}
                            {article.new && <Badge variant="secondary" className="text-xs">New</Badge>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{article.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className={`text-xs ${getDifficultyColor(article.difficulty)}`}>
                              {article.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.readTime}
                            </span>
                            <span className="text-xs text-muted-foreground">{article.category}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-600 transition-colors" />
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </TabsContent>

            {/* Video Tutorials Tab */}
            <TabsContent value="videos" className="space-y-6 lg:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
                {videoTutorials.map((video) => (
                  <Card key={video.id} className="card-enhanced hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <div className="relative">
                      <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-t-lg flex items-center justify-center">
                        <Play className="h-12 w-12 text-brand-600" />
                      </div>
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold group-hover:text-brand-600 transition-colors">
                        {video.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs ${getDifficultyColor(video.difficulty)}`}>
                          {video.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{video.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {faqItems.map((faq, index) => (
                  <Card key={index} className="card-enhanced">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-brand-600" />
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support" className="space-y-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Support Options */}
                  <div className="lg:col-span-1 space-y-4">
                    <Card className="card-enhanced">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">Contact Support</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                          <div>
                            <div className="font-medium text-sm">Live Chat</div>
                            <div className="text-xs text-muted-foreground">Available 24/7</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <MessageCircle className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-sm">Email Support</div>
                            <div className="text-xs text-muted-foreground">Response within 2 hours</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                          <div>
                            <div className="font-medium text-sm">Priority Support</div>
                            <div className="text-xs text-muted-foreground">For urgent issues</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Support Form */}
                  <div className="lg:col-span-2">
                    <SupportTicketForm />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/tabs"
import { Github, GitCommit, GitPullRequest, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/app/components/button"
import { useTranslation } from "@/hooks/use-translation"
import { GitStatsData, getGitContributions } from "@/app/api/git-contributions"

export default function GitStats() {
  const [stats, setStats] = useState<GitStatsData>({
    totalCommits: 0,
    yearlyCommits: {},
    monthlyCommits: {},
    topLanguages: [],
    totalPullRequests: 0,
    contributionData: {},
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("contributions")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const { t } = useTranslation()
  const [availableYears, setAvailableYears] = useState<Array<string>>([])

  useEffect(() => {
    // Generate available years from 2016 to current year
    const generateAvailableYears = () => {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let year = 2016; year <= currentYear; year++) {
        years.push(year.toString());
      }
      return years;
    };

    // Fetch git contributions
    const fetchGitContributions = async () => {
      try {
        setLoading(true);
        setError(null);
        const years = generateAvailableYears();
        setAvailableYears(years);
        
        const gitContributions = await getGitContributions(years);
        setStats(gitContributions);
      } catch (error) {
        console.error('Error fetching git contributions:', error);
        setError('Failed to load git contributions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGitContributions();
  }, []);

  const maxCommits = Math.max(...Object.values(stats.yearlyCommits), ...Object.values(stats.monthlyCommits))

  // Get month labels for the contribution graph
  const getMonthLabels = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months
  }

  const handlePrevYear = async () => {
    const currentIndex = availableYears.indexOf(selectedYear)
    if (currentIndex > 0) {
      setSelectedYear(availableYears[currentIndex - 1])
    }
  }

  const handleNextYear = async () => {
    const currentIndex = availableYears.indexOf(selectedYear)
    if (currentIndex < availableYears.length - 1) {
      setSelectedYear(availableYears[currentIndex + 1])
    }
  }

  return (
    <Card className="w-full mt-12 border-cool-200 dark:border-cool-800 bg-white/80 dark:bg-cool-950/30 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="p-2 rounded-full bg-cool-100 dark:bg-cool-900/30">
          <Github className="h-6 w-6 text-cool-700 dark:text-cool-300" />
        </div>
        <div>
          <CardTitle className="text-xl text-cool-700 dark:text-cool-300">
            {t("gitStats.title")}
          </CardTitle>
          <CardDescription>
            {t("gitStats.description")}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center p-4 bg-cool-50 dark:bg-cool-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <GitCommit className="h-5 w-5 text-indigo-500" />
              <span className="text-lg font-medium text-cool-700 dark:text-cool-300">Total Commits</span>
            </div>
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.totalCommits.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-cool-50 dark:bg-cool-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <GitPullRequest className="h-5 w-5 text-teal-500" />
              <span className="text-lg font-medium text-cool-700 dark:text-cool-300">Pull Requests</span>
            </div>
            <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">
              {stats.totalPullRequests.toLocaleString()}
            </span>
          </div>
        </motion.div>

        <Tabs defaultValue="contributions" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white/50 dark:bg-cool-900/50 backdrop-blur-sm">
            <TabsTrigger
              value="contributions"
              className="max-sm:hidden data-[state=active]:bg-gradient-to-r data-[state=active]:from-cool-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
            >
              Contribution Graph
            </TabsTrigger>
            <TabsTrigger
              value="yearly"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cool-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
            >
              Yearly Commits
            </TabsTrigger>
            <TabsTrigger
              value="languages"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cool-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
            >
              Top Languages
            </TabsTrigger>
          </TabsList>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-cool-200 border-t-cool-600 animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Loading Git stats...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-red-500 dark:text-red-400">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <TabsContent value="contributions" className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-cool-700 dark:text-cool-300">
                      {stats.contributionData[selectedYear]?.total.toLocaleString()} contributions in {selectedYear}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-muted-foreground">Less</span>
                      <div className="w-3 h-3 rounded-sm bg-cool-100 dark:bg-cool-900"></div>
                      <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900"></div>
                      <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700"></div>
                      <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-500"></div>
                      <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-300"></div>
                      <span className="text-muted-foreground">More</span>
                    </div>
                  </div>

                  {/* Year selector */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrevYear()}
                      disabled={selectedYear === availableYears[0]}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Prev
                    </Button>

                    <motion.div
                      key={selectedYear}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-lg font-bold text-cool-700 dark:text-cool-300"
                    >
                      {selectedYear}
                    </motion.div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNextYear()}
                      disabled={selectedYear === availableYears[availableYears.length - 1]}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedYear}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative">
                        {/* Month labels - positioned at 5-column intervals */}
                        <div className="relative mb-1 px-6 h-5">
                          {getMonthLabels().map((month, i) => (
                            <div 
                              key={i} 
                              className="absolute text-xs text-muted-foreground text-center"
                              style={{ 
                                left: `${i * 5 * (100 / 63)}%`, 
                                width: '4rem' 
                              }}
                            >
                              {month}
                            </div>
                          ))}
                        </div>

                        {/* Contribution grid */}
                        <div className="pl-6">
                          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' }}>
                            {stats.contributionData[selectedYear]?.weeks.map((week, weekIndex) => (
                              <div key={weekIndex} className="flex flex-col gap-1">
                                {week.contributionDays.map((day, dayIndex) => {
                                  // Determine color based on intensity
                                  let bgColor = "bg-cool-100 dark:bg-cool-900"
                                  if (day.intensity === 1) bgColor = "bg-green-200 dark:bg-green-900"
                                  if (day.intensity === 2) bgColor = "bg-green-300 dark:bg-green-700"
                                  if (day.intensity === 3) bgColor = "bg-green-400 dark:bg-green-500"
                                  if (day.intensity === 4) bgColor = "bg-green-500 dark:bg-green-300"

                                  return (
                                    <motion.div
                                      key={dayIndex}
                                      className={`w-2.5 h-2.5 rounded-sm ${bgColor} hover:ring-1 hover:ring-green-400 dark:hover:ring-cool-600 transition-all`}
                                      title={`${day.contributionCount} contributions on ${day.date}`}
                                      initial={{ opacity: 0, scale: 0.5 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{
                                        duration: 0.2,
                                        delay: weekIndex * 0.01 + dayIndex * 0.005,
                                      }}
                                    ></motion.div>
                                  )
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </TabsContent>

              <TabsContent value="yearly" className="mt-0">
                <div className="space-y-4">
                  {/* Header with legend and year selector */}
                  <div className="flex flex-col gap-4">
                    {/* Legend - moved to top right */}
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <span className="text-muted-foreground">Less</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-md bg-cool-100 dark:bg-cool-900"></div>
                        <div className="w-3 h-3 rounded-md bg-indigo-200 dark:bg-indigo-900"></div>
                        <div className="w-3 h-3 rounded-md bg-indigo-300 dark:bg-indigo-700"></div>
                        <div className="w-3 h-3 rounded-md bg-indigo-400 dark:bg-indigo-500"></div>
                        <div className="w-3 h-3 rounded-md bg-indigo-500 dark:bg-indigo-300"></div>
                      </div>
                      <span className="text-muted-foreground">More</span>
                    </div>

                    {/* Year selector - centered */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrevYear()}
                        disabled={selectedYear === availableYears[0]}
                        className="h-8 px-3 text-xs"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Prev
                      </Button>

                      <motion.div
                        key={selectedYear}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-base font-bold text-cool-700 dark:text-cool-300"
                      >
                        {selectedYear}
                      </motion.div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNextYear()}
                        disabled={selectedYear === availableYears[availableYears.length - 1]}
                        className="h-8 px-3 text-xs"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="relative mb-0 px-6 h-1 pt-4">
                      {getMonthLabels().map((month, i) => (
                        <div 
                          key={i} 
                          className="absolute text-xs text-muted-foreground text-center"
                          style={{ 
                            left: `${i * 5 * (100 / 64)}%`, 
                            width: '4rem' 
                          }}
                        >
                          {month}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Weekly grid - improved sizing and alignment */}
                  <div className="px-5 -mt-1">
                    <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' }}>
                      {stats.contributionData[selectedYear]?.weeks.map((week, weekIndex) => {
                        // Calculate total commits for this week
                        const weeklyTotal = week.contributionDays.reduce(
                          (sum, day) => sum + day.contributionCount, 
                          0
                        );
                        
                        // Determine intensity based on weekly total
                        let intensity = 0;
                        if (weeklyTotal > 0) intensity = 1;
                        if (weeklyTotal >= 5) intensity = 2;
                        if (weeklyTotal >= 10) intensity = 3;
                        if (weeklyTotal >= 20) intensity = 4;
                        
                        // Determine color based on intensity
                        let bgColor = "bg-cool-100 dark:bg-cool-900";
                        if (intensity === 1) bgColor = "bg-indigo-200 dark:bg-indigo-900";
                        if (intensity === 2) bgColor = "bg-indigo-300 dark:bg-indigo-700";
                        if (intensity === 3) bgColor = "bg-indigo-400 dark:bg-indigo-500";
                        if (intensity === 4) bgColor = "bg-indigo-500 dark:bg-indigo-300";
                        
                        return (
                          <motion.div
                            key={weekIndex}
                            className="group relative"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.2,
                              delay: weekIndex * 0.005,
                            }}
                          >
                            <div className={`h-4 rounded-md ${bgColor} transition-all duration-200 group-hover:scale-105 group-hover:shadow-md`}>
                              {weeklyTotal > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-[12px] font-medium text-indigo-900 dark:text-cool-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {weeklyTotal}
                                  </span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Yearly totals section */}
                  <div className="mt-4 flex flex-wrap gap-2 justify-center pt-4">
                    {Object.entries(stats.yearlyCommits)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([year, count]) => (
                        <motion.div 
                          key={year}
                          className={`px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all duration-200 ${
                            year === selectedYear 
                              ? 'bg-indigo-100 dark:bg-indigo-900 border border-indigo-300 dark:border-indigo-700 shadow-sm' 
                              : 'bg-cool-50 dark:bg-cool-900 hover:bg-cool-100 dark:hover:bg-cool-800'
                          }`}
                          onClick={() => setSelectedYear(year)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-[12px] font-bold text-cool-700 dark:text-cool-300">{year}: </span>
                          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{count}</span>
                        </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="languages" className="mt-0">
                <div className="space-y-4">
                  {stats.topLanguages.map((language, index) => (
                    <div key={language.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-cool-700 dark:text-cool-300">{language.name}</span>
                        <span className="text-muted-foreground">{language.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-cool-100 dark:bg-cool-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: language.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${language.percentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}


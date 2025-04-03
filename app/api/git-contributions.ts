import { GitLabContributions } from "@/app/api/gitlab-api"
import { GitHubContributions } from "@/app/api/github-api"
import privateContributions from "./git-private-contributions.json"

export interface GitStatsData {
  totalCommits: number
  yearlyCommits: Record<string, number>
  monthlyCommits: Record<string, number>
  topLanguages: Array<{ name: string; percentage: number; color: string }>
  totalPullRequests: number
  contributionData: Record<
    string,
    {
      total: number
      weeks: Array<{
        contributionDays: Array<{
          date: string
          contributionCount: number
          intensity: number // 0-4 for color intensity
        }>
      }>
    }
  >
}

// Helper function to fetch GitLab contributions from the API route
async function fetchGitLabContributions(): Promise<GitLabContributions | string> {
  try {
    const response = await fetch('/api/gitlab-contributions');
    if (!response.ok) {
      const errorData = await response.json();
      return errorData.error || 'Failed to fetch GitLab contributions';
    }
    return await response.json();
  } catch (error: any) {
    console.error('Error fetching GitLab contributions:', error);
    return error.message || 'Unknown error fetching GitLab contributions';
  }
}

// Helper function to fetch GitHub contributions from the API route
async function fetchGitHubContributions(availableYears: string[]): Promise<GitHubContributions> {
  try {
    const yearsParam = availableYears.join(',');
    const response = await fetch(`/api/github-contributions?years=${yearsParam}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch GitHub contributions');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error fetching GitHub contributions:', error);
    throw error;
  }
}

export async function getGitContributions(availableYears: string[]): Promise<GitStatsData> {
  try {
    // Create a skeleton covering 2016..2025
    const skeleton = createSkeletonData();

    const gitStatsData: GitStatsData = {
      totalCommits: 0,
      yearlyCommits: {},
      monthlyCommits: {},
      topLanguages: [
        { name: "Python", percentage: 37, color: "#f7df1e" },
        { name: "TypeScript", percentage: 29, color: "#3178c6" },
        { name: "Go", percentage: 17, color: "#e34c26" },
        { name: "C#", percentage: 8, color: "#3572A5" },
        { name: "Other", percentage: 9, color: "#8e8e8e" },
      ],
      totalPullRequests: 0,
      contributionData: skeleton, // Use the skeleton as a starting point
    };

    // Fetch GitHub and GitLab data with error handling
    try {
      const [gitHubContributions, gitLabContributions] = await Promise.all([
        fetchGitHubContributions(availableYears).catch(error => {
          console.error("Error fetching GitHub contributions:", error);
          // Return empty data structure on error
          return {
            commits: availableYears.map(year => ({ 
              year, 
              contributionCalendar: { 
                totalContributions: 0, 
                weeks: [], 
                colors: [] 
              } 
            })),
            pullRequests: availableYears.map(year => ({ year, totalPullRequests: 0 }))
          };
        }),
        fetchGitLabContributions().catch(error => {
          console.error("Error fetching GitLab contributions:", error);
          return "Error fetching GitLab contributions";
        })
      ]);

      // Process GitHub data if available
      if (typeof gitHubContributions !== "string" && !('error' in gitHubContributions)) {
        // Process commits - Safely check for errors in each commit object
        gitHubContributions.commits.forEach(({ year, contributionCalendar }) => {
          // Skip processing if this commit has an error
          if ('error' in contributionCalendar) {
            console.warn(`Skipping GitHub commits for ${year} due to error: ${contributionCalendar.error}`);
            return;
          }

          gitStatsData.yearlyCommits[year] = (gitStatsData.yearlyCommits[year] || 0) + contributionCalendar.totalContributions;
          gitStatsData.totalCommits += contributionCalendar.totalContributions;

          // Process contribution calendar data
          contributionCalendar.weeks.forEach(week => {
            week.contributionDays.forEach(day => {
              const dateStr = day.date;
              const yearStr = dateStr.substring(0, 4);
              if (gitStatsData.contributionData[yearStr]) {
                // Find the matching day in our skeleton and update it
                gitStatsData.contributionData[yearStr].weeks.forEach(skeletonWeek => {
                  skeletonWeek.contributionDays.forEach(skeletonDay => {
                    if (skeletonDay.date === dateStr) {
                      skeletonDay.contributionCount += day.contributionCount;
                      skeletonDay.intensity = Math.max(skeletonDay.intensity, getIntensityFromColor(day.color));
                    }
                  });
                });
              }
            });
          });
        });

        // Process pull requests - Safely check for errors in each PR object
        gitHubContributions.pullRequests.forEach((prData) => {
          if ('error' in prData) {
            console.warn(`Skipping GitHub PRs for ${prData.year} due to error: ${prData.error}`);
            return;
          }
          gitStatsData.totalPullRequests += prData.totalPullRequests;
        });
      } else {
        console.warn("GitHub contributions data is not available or has errors. Using private contributions only.");
      }

      // Process GitLab data
      if (typeof gitLabContributions !== 'string') {
        // Process commits
        gitLabContributions.commits.forEach(({ year, totalCommits }) => {
          gitStatsData.yearlyCommits[year] = (gitStatsData.yearlyCommits[year] || 0) + totalCommits;
          gitStatsData.totalCommits += totalCommits;
        });

        // Process merge requests
        gitLabContributions.mergeRequests.forEach(({ year, totalMergeRequests }) => {
          gitStatsData.totalPullRequests += totalMergeRequests;
        });
      } else {
        console.warn("GitLab contributions data is not available. Using GitHub and private contributions only.");
      }
    } catch (error) {
      console.error("Error processing GitHub/GitLab data:", error);
      // Continue with private contributions only
    }

    // Process private contributions data - This should always work as it's local data
    try {
      Object.entries(privateContributions.contributionData).forEach(([year, data]) => {
        // Add to yearly commits
        gitStatsData.yearlyCommits[year] = (gitStatsData.yearlyCommits[year] || 0) + data.total;
        gitStatsData.totalCommits += data.total;

        // Add to specific days in the skeleton
        data.weeks.forEach(week => {
          week.contributionDays.forEach(day => {
            const dateStr = day.date;
            if (gitStatsData.contributionData[year]) {
              // Find the matching day in our skeleton and update it
              gitStatsData.contributionData[year].weeks.forEach(skeletonWeek => {
                skeletonWeek.contributionDays.forEach(skeletonDay => {
                  if (skeletonDay.date === dateStr) {
                    skeletonDay.contributionCount += day.contributionCount;
                    skeletonDay.intensity = Math.max(skeletonDay.intensity, day.intensity);
                  }
                });
              });
            }
          });
        });
      });

      // Process private merge requests
      privateContributions.mergeRequests.forEach(({ year, totalMergeRequests }) => {
        gitStatsData.totalPullRequests += totalMergeRequests;
      });
    } catch (error) {
      console.error("Error processing private contributions:", error);
    }

    // Recalculate totals after merging all data sources
    Object.entries(gitStatsData.contributionData).forEach(([year, yearData]) => {
      // Reset the total to recalculate
      yearData.total = 0;
      
      // Sum up contributions from all days
      yearData.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
          if (day.date) {
            // Add to year total
            yearData.total += day.contributionCount;
            
            // Add to monthly totals
            const month = day.date.substring(0, 7); // Get YYYY-MM format
            gitStatsData.monthlyCommits[month] = (gitStatsData.monthlyCommits[month] || 0) + day.contributionCount;
          }
        });
      });
    });

    return gitStatsData;
  } catch (error) {
    console.error("Error in getGitContributions:", error);
    
    // Return minimal data structure to prevent UI crashes
    const skeleton = createSkeletonData();
    return {
      totalCommits: 0,
      yearlyCommits: {},
      monthlyCommits: {},
      topLanguages: [
        { name: "Python", percentage: 37, color: "#f7df1e" },
        { name: "TypeScript", percentage: 29, color: "#3178c6" },
        { name: "Go", percentage: 17, color: "#e34c26" },
        { name: "C#", percentage: 8, color: "#3572A5" },
        { name: "Other", percentage: 9, color: "#8e8e8e" },
      ],
      totalPullRequests: 0,
      contributionData: skeleton,
    };
  }
}

// Helper function to convert GitHub contribution color to intensity (0-4)
function getIntensityFromColor(color: string): number {
  const intensityMap: { [key: string]: number } = {
    '#ebedf0': 0, // No contributions
    '#9be9a8': 1, // Low
    '#40c463': 2, // Medium
    '#30a14e': 3, // High
    '#216e39': 4  // Very high
  };
  return intensityMap[color] || 0;
}

interface ContributionDay {
  date: string;
  contributionCount: number;
  intensity: number;
}

interface Week {
  contributionDays: ContributionDay[];
}

interface YearData {
  total: number;
  weeks: Week[];
}

function createSkeletonData(): Record<string, YearData> {
  const startYear = 2016;
  const endYear = 2025;

  // Helper: format date as "YYYY-MM-DD"
  function fmt(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  // This will hold data for all years from 2016..2025
  const skeleton: Record<string, YearData> = {};

  // Initialize each year
  for (let y = startYear; y <= endYear; y++) {
    skeleton[y] = { total: 0, weeks: [] };
  }

  // Use dates to ensure we capture all weeks
  for (let y = startYear; y <= endYear; y++) {
    // Start from first Sunday of the year
    const firstDayOfYear = new Date(y, 0, 1);
    const firstSunday = new Date(firstDayOfYear);
    firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());
    
    // End at the last day of the year (December 31st)
    const lastDayOfYear = new Date(y, 11, 31);
    const lastSunday = new Date(lastDayOfYear);
    lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());
    
    // Create weeks from first Sunday to last Sunday
    let currentDate = new Date(firstSunday);
    
    while (currentDate <= lastSunday) {
      const week: ContributionDay[] = [];
      
      // Create exactly 7 days for this week
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(currentDate);
        currentDay.setDate(currentDay.getDate() + i);
        
        // Add the day regardless of year - this ensures we capture the last week properly
        week.push({
          date: fmt(currentDay),
          contributionCount: 0,
          intensity: 0,
        });
      }
      
      // Only add the week if it contains at least one day from the current year
      const hasDaysInCurrentYear = week.some(day => {
        const dayYear = parseInt(day.date.substring(0, 4));
        return dayYear === y;
      });
      
      if (hasDaysInCurrentYear) {
        skeleton[y].weeks.push({
          contributionDays: week,
        });
      }
      
      // Move to the next Sunday
      currentDate.setDate(currentDate.getDate() + 7);
    }
  }

  return skeleton;
}
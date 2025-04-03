import { NextResponse } from 'next/server'
import { getGitHubContributions } from '@/app/api/github-api'

export async function GET(request: Request) {
  try {
    // Extract the years from the query params
    const { searchParams } = new URL(request.url)
    const yearsParam = searchParams.get('years')
    
    // Default to current year if no years are provided
    const availableYears = yearsParam 
      ? yearsParam.split(',') 
      : [new Date().getFullYear().toString()];
    
    try {
      const contributions = await getGitHubContributions(availableYears)
      
      // Check if there's an error in the response structure
      const hasCommitErrors = contributions.commits.some(commit => 
        'error' in commit.contributionCalendar
      );
      
      const hasPRErrors = contributions.pullRequests.some(pr => 
        'error' in pr
      );
      
      // Handle partial success but with errors in the results
      if (hasCommitErrors || hasPRErrors) {
        // Client will handle partial data display
      }
      
      // Always return the contributions data even if it contains errors
      // The client will handle partial data
      return NextResponse.json(contributions)
    } catch (error: any) {
      // Return specific error message
      if (error.message?.includes('Failed to fetch GitHub contributions')) {
        return NextResponse.json({ 
          error: error.message || "Failed to fetch GitHub contributions" 
        }, { 
          status: 503,
          statusText: "GitHub API unavailable" 
        });
      }
      
      // Return a fallback structure instead of an error
      // This lets the client continue rather than crashing
      const fallbackData = {
        pullRequests: availableYears.map(year => ({ year, totalPullRequests: 0 })),
        commits: availableYears.map(year => ({
          year,
          contributionCalendar: {
            colors: [],
            totalContributions: 0,
            weeks: [],
            error: error.message || 'Error fetching GitHub data'
          }
        }))
      };
      
      return NextResponse.json(fallbackData);
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 
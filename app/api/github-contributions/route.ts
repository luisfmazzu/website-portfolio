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
    
    console.log('GitHub contributions API route called with years:', availableYears);
    
    try {
      const contributions = await getGitHubContributions(availableYears)
      
      // Check if there's an error in the response structure
      const hasCommitErrors = contributions.commits.some(commit => 
        'error' in commit.contributionCalendar
      );
      
      const hasPRErrors = contributions.pullRequests.some(pr => 
        'error' in pr
      );
      
      // Log the error status but still return the data with errors
      if (hasCommitErrors || hasPRErrors) {
        console.warn('GitHub contributions API found errors but returning data:', 
          hasCommitErrors ? 'Commit errors present' : '',
          hasPRErrors ? 'PR errors present' : ''
        );
      }
      
      // Always return the contributions data even if it contains errors
      // The client will handle partial data
      return NextResponse.json(contributions)
    } catch (error: any) {
      console.error('Error fetching GitHub contributions in route handler:', error);
      
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
    console.error('Critical error in GitHub contributions API route:', error);
    
    // Return an error response that includes details but isn't a 500
    return NextResponse.json({ 
      error: 'Error processing GitHub contributions request',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 200 }); // Use 200 instead of 500 to avoid client-side fetch errors
  }
} 
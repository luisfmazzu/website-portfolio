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
    
    const contributions = await getGitHubContributions(availableYears)
    
    // Check if there's an error in the response
    if (contributions.commits.some(commit => 'error' in commit.contributionCalendar) || 
        contributions.pullRequests.some(pr => 'error' in pr)) {
      console.error('Error fetching GitHub contributions:', JSON.stringify(contributions))
      return NextResponse.json({ error: 'Failed to fetch GitHub contributions' }, { status: 500 })
    }
    
    return NextResponse.json(contributions)
  } catch (error: any) {
    console.error('Error in GitHub contributions API route:', error.message)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 
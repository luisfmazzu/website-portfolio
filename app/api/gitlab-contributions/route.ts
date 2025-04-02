import { NextResponse } from 'next/server'
import { getGitLabContributions } from '@/app/api/gitlab-api'

export async function GET() {
  try {
    const contributions = await getGitLabContributions()
    
    if (typeof contributions === 'string') {
      console.error('Error fetching GitLab contributions:', contributions)
      return NextResponse.json({ error: contributions }, { status: 500 })
    }
    
    return NextResponse.json(contributions)
  } catch (error: any) {
    console.error('Error in GitLab contributions API route:', error.message)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 
import { NextResponse } from 'next/server'
import { getGitLabContributions } from '@/app/api/gitlab-api'

export async function GET() {
  try {
    const contributions = await getGitLabContributions()
    
    if (typeof contributions === 'string') {
      return NextResponse.json({ error: contributions }, { status: 400 })
    }
    
    return NextResponse.json(contributions)
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
} 
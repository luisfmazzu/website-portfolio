import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { GitLabContributions } from '@/app/api/gitlab-api'

export async function GET() {
    try {
        const jsonPath = path.join(process.cwd(), 'app/api/git-private-contributions.json');
        const jsonData = await fs.readFile(jsonPath, 'utf-8');
        const data: GitLabContributions = JSON.parse(jsonData);
        return NextResponse.json(data);
    } catch (error) {
        console.warn('Could not load private contributions data:', error);
        return NextResponse.json({ commits: [], mergeRequests: [] });
    }
} 
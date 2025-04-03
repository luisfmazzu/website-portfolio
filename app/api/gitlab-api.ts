import axios from "axios"

const GITLAB_API_BASE_URL = "https://gitlab.com/api/v4"

// Get GitLab credentials from environment variables
function getCredentials() {
  // Access environment variables inside a function to ensure they are retrieved at runtime
  const token = process.env.GITLAB_TOKEN;
  const username = process.env.GITLAB_USERNAME;
  
  return { token, username };
}

export interface GitLabContributions {
  commits: {
    year: string;
    totalCommits: number;
  }[];
  mergeRequests: {
    year: string;
    totalMergeRequests: number;
  }[];
}

const fetchUserId = async (token: string, username: string) => {
  try {
    const response = await axios.get(`${GITLAB_API_BASE_URL}/users`, {
      params: { username: username },
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (response.data && response.data.length > 0) {
      const userId = response.data[0]?.id;
      return userId;
    } else {
      return null;
    }
  } catch (error: any) {
    if (error.response) {
      // Log response error details for debugging but handle gracefully
    }
    return null;
  }
}

const fetchUserContributions = async (token: string, userId: number, start?: string, end?: string) => {
  let gitLabContributions: any[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
      // Fetch commit events (pushed commits)
      const commitsResponse = await fetchCommits(token, userId, page, start, end)
      
      gitLabContributions = gitLabContributions.concat(commitsResponse.data);
      hasMore = commitsResponse.data.length === 100; // If the response has 100 items, there are more pages
      page += 1;
  }

  // Fetch merge requests (pull requests)
  let allMergeRequests: any[] = [];
  page = 1;
  hasMore = true;

  while (hasMore) {
      const mergeRequestsResponse = await fetchMergeRequests(token, userId, page)
      allMergeRequests = allMergeRequests.concat(mergeRequestsResponse);
      hasMore = mergeRequestsResponse.length === 100;
      page += 1;
  }

  // Combine both commits and merge requests in a single response
  return {
      commits: gitLabContributions,
      mergeRequests: allMergeRequests,
  };
};

const fetchCommits = async (token: string, userId: number, page : number, start?: string, end?: string) => {
  const params: any = { action: "pushed", page, per_page: 100 };
      if (start) params.after = start;
      if (end) params.before = end;

      const response = await axios.get(
        `${GITLAB_API_BASE_URL}/users/${userId}/events`,
        {
            params,
            headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response
}

const fetchMergeRequests = async (token: string, userId: number, page : number) => {
  const response = await axios.get(
    `${GITLAB_API_BASE_URL}/merge_requests`,
    {
      params: { author_id: userId, page, per_page: 100},
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.data
}

export async function getGitLabContributions(): Promise<GitLabContributions | string> {
  try {
    const { token, username } = getCredentials();
    if (!token || !username) {
      return "Missing GitLab credentials"
    }
    
    const userId = await fetchUserId(token, username);
    if (!userId) {
      return "User not found"
    }

    const start = new Date(2016, 0, 1).toISOString().split("T")[0]
    const currentYear = new Date().getFullYear()
    const end = new Date(currentYear, 11, 31).toISOString().split("T")[0]
    
    // Get commits data
    const commitsData = await fetchUserContributions(token, userId, start, end)
    
    // Get merge requests data
    let allMergeRequests: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const mergeRequestsResponse = await fetchMergeRequests(token, userId, page)
      allMergeRequests = allMergeRequests.concat(mergeRequestsResponse);
      hasMore = mergeRequestsResponse.length === 100;
      page += 1;
    }

    // Process commits by year
    const commitsByYear = commitsData.commits.reduce((acc: { [key: string]: number }, commit: any) => {
      const year = new Date(commit.created_at).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year]++;
      return acc;
    }, {});

    // Process merge requests by year
    const mergeRequestsByYear = allMergeRequests.reduce((acc: { [key: string]: number }, mr: any) => {
      const year = new Date(mr.created_at).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year]++;
      return acc;
    }, {});

    // Convert to array format
    const commits = Object.entries(commitsByYear).map(([year, count]) => ({
      year,
      totalCommits: count as number
    }));

    const mergeRequests = Object.entries(mergeRequestsByYear).map(([year, count]) => ({
      year,
      totalMergeRequests: count as number
    }));

    return {
      commits,
      mergeRequests
    };
  } catch (error: any) {
    return error.message
  }
}

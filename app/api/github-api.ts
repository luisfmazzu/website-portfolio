const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

// Function to get GitHub credentials from environment variables with better error handling
function getCredentials() {
  // Access environment variables inside a function to ensure they are retrieved at runtime
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  
  return { token, username };
}

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionCalendar {
  colors: string[];
  totalContributions: number;
  weeks: {
    contributionDays: {
      color: string;
      contributionCount: number;
      date: string;
      weekday: number;
    }[];
    firstDay: string;
  }[];
}

interface PullRequestContributions {
  totalCount: number;
}

interface GitHubResponse {
  data: {
    user: {
      contributionsCollection: {
        pullRequestContributions: PullRequestContributions;
        contributionCalendar: ContributionCalendar;
      };
    };
  };
}

export interface GitHubContributions {
  pullRequests: {
    year: string;
    totalPullRequests: number;
  }[];
  commits: {
    year: string;
    contributionCalendar: ContributionCalendar;
  }[];
}

export async function getGitHubContributions(availableYears : Array<string>): Promise<GitHubContributions> {
  try {
    const { token, username } = getCredentials();
    
    // Check for credentials immediately to avoid unnecessary API calls
    if (!username || !token) {
      console.error("Missing GitHub credentials. Please check environment variables.");
      return {
        pullRequests: availableYears.map(year => ({ 
          year, 
          totalPullRequests: 0,
          error: "Missing GitHub credentials" 
        })),
        commits: availableYears.map(year => ({
          year,
          contributionCalendar: {
            colors: [],
            totalContributions: 0,
            weeks: [],
            error: "Missing GitHub credentials"
          }
        }))
      };
    }
    
    const pullRequests = await getGitHubPullRequest(availableYears);
    
    const commitPromises = availableYears.map(async (year) => {
      try {
        const contributionCalendar = await getGitHubCommits(parseInt(year));
        return {
          year,
          contributionCalendar
        };
      } catch (error) {
        console.error(`Error fetching GitHub commits for ${year}:`, error);
        return {
          year,
          contributionCalendar: {
            colors: [],
            totalContributions: 0,
            weeks: [],
            error: `Failed to fetch commits for ${year}: ${error}`
          }
        };
      }
    });
    
    const commits = await Promise.all(commitPromises);

    return {
      pullRequests,
      commits
    };
  } catch (error) {
    console.error("Error in getGitHubContributions:", error);
    return {
      pullRequests: [],
      commits: [],
      error: `GitHub API error: ${error}`
    };
  }
}

async function getGitHubCommits(yearInt : number) {
  const { token, username } = getCredentials();

  if (!username || !token) {
    return { 
      colors: [],
      totalContributions: 0,
      weeks: [],
      error: "Missing GitHub credentials" 
    };
  }

  const query = {
    "query": `query {
            user(login: "${username}") {
              contributionsCollection(from: "${yearInt}-01-01T00:00:00Z", to: "${yearInt}-12-31T23:59:59Z") {
                contributionCalendar {
                  colors
                  totalContributions
                  weeks {
                    contributionDays {
                      color
                      contributionCount
                      date
                      weekday
                    }
                    firstDay
                  }
                }
              }
            }
          }`
  };

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(query),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API error (${response.status}): ${errorText}`);
      return {
        colors: [],
        totalContributions: 0,
        weeks: [],
        error: `GitHub API error: ${response.status} ${response.statusText}`
      };
    }

    const json: GitHubResponse = await response.json();
    
    // Check if the response contains the expected data structure
    if (!json.data?.user?.contributionsCollection?.contributionCalendar) {
      console.error("Unexpected GitHub API response structure:", JSON.stringify(json));
      return {
        colors: [],
        totalContributions: 0,
        weeks: [],
        error: "Invalid GitHub API response structure"
      };
    }

    return json.data.user.contributionsCollection.contributionCalendar;
  } catch (error: any) {
    console.error(`GitHub API error fetching commits for ${yearInt}:`, error);
    return {
      colors: [],
      totalContributions: 0,
      weeks: [],
      error: error.message || "Unknown error fetching GitHub contributions"
    };
  }
}

export async function getGitHubPullRequest(availableYears : Array<string>) {
  const { token, username } = getCredentials();

  if (!username || !token) {
    return availableYears.map(year => ({ 
      year, 
      totalPullRequests: 0,
      error: "Missing GitHub credentials" 
    }));
  }

  // Fetch pull requests for all years in parallel
  const pullRequestPromises = availableYears.map(async (year : string) => {
    const yearInt = parseInt(year);

    const query = {
      query: `
        query {
          user(login: "${username}") {
            contributionsCollection(from: "${yearInt}-01-01T00:00:00Z", to: "${yearInt}-12-31T23:59:59Z") {
              pullRequestContributions {
                totalCount
              }
            }
          }
        }
      `
    };

    try {
      const response = await fetch(GITHUB_GRAPHQL_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(query),
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`GitHub API error (${response.status}) for PR in ${year}: ${errorText}`);
        return {
          year,
          totalPullRequests: 0,
          error: `GitHub API error: ${response.status} ${response.statusText}`
        };
      }

      const json: GitHubResponse = await response.json();
      
      // Check if the response contains the expected data structure
      if (!json.data?.user?.contributionsCollection?.pullRequestContributions) {
        console.error("Unexpected GitHub API response structure for PRs:", JSON.stringify(json));
        return {
          year,
          totalPullRequests: 0,
          error: "Invalid GitHub API response structure"
        };
      }
      
      const totalCount = json.data.user.contributionsCollection.pullRequestContributions.totalCount;

      return {
        year,
        totalPullRequests: totalCount
      };
    } catch (error: any) {
      console.error(`GitHub API error fetching PRs for ${year}:`, error);
      return {
        year,
        totalPullRequests: 0,
        error: error.message || "Unknown error fetching GitHub pull requests"
      };
    }
  });

  const pullRequests = await Promise.all(pullRequestPromises);

  return pullRequests;
}
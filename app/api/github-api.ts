const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

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
  const pullRequests = await getGitHubPullRequest(availableYears)
  
  const commitPromises = availableYears.map(async (year) => {
    const contributionCalendar = await getGitHubCommits(parseInt(year))
    return {
      year,
      contributionCalendar
    }
  })
  
  const commits = await Promise.all(commitPromises);

  return {
    pullRequests,
    commits
  };
}

async function getGitHubCommits(yearInt : number) {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME
  const github_token = process.env.NEXT_PUBLIC_GITHUB_TOKEN

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

  let errorResponse : any = {}

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${github_token}`,
      },
      body: JSON.stringify(query),
    })

    if (!response.ok) {
      errorResponse['error'] = `GitHub API error: ${response.statusText}`
      return errorResponse
    }

    const json: GitHubResponse = await response.json()

    return json.data.user.contributionsCollection.contributionCalendar;
  } catch (error: any) {
    errorResponse['error'] = error
    return errorResponse
  }
}

export async function getGitHubPullRequest(availableYears : Array<string>) {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME
  const github_token = process.env.NEXT_PUBLIC_GITHUB_TOKEN

  // Fetch pull requests for all years in parallel
  const pullRequestPromises = availableYears.map(async (year : string) => {
    const yearInt = parseInt(year)
    let errorResponse : any = {}

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

    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${github_token}`,
      },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      errorResponse['error'] = `GitHub API error: ${response.statusText}`
      return errorResponse
    }

    const json: GitHubResponse = await response.json();
    const totalCount = json.data.user.contributionsCollection.pullRequestContributions.totalCount;

    return {
      year,
      totalPullRequests: totalCount
    };
  });

  const pullRequests = await Promise.all(pullRequestPromises);

  return pullRequests;
}
/**
 * GitHub API Wrapper
 * Handles all GitHub API interactions
 */

interface GitHubRepository {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  watchers_count: number
  updated_at: string
}

interface GitHubUser {
  id: number
  login: string
  avatar_url: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export class GitHubAPI {
  private baseUrl = 'https://api.github.com'
  private token: string

  constructor(token: string) {
    this.token = token
  }

  /**
   * Get authenticated user info
   */
  async getUser(): Promise<GitHubUser> {
    const response = await fetch(`${this.baseUrl}/user`, {
      headers: {
        Authorization: `token ${this.token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    return (await response.json()) as GitHubUser
  }

  /**
   * Get user's public repositories
   */
  async getRepositories(page = 1, perPage = 30): Promise<GitHubRepository[]> {
    const response = await fetch(
      `${this.baseUrl}/user/repos?page=${page}&per_page=${perPage}&sort=stars&direction=desc`,
      {
        headers: {
          Authorization: `token ${this.token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    return (await response.json()) as GitHubRepository[]
  }

  /**
   * Get repository details
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `token ${this.token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    return (await response.json()) as GitHubRepository
  }

  /**
   * Get repository languages
   */
  async getRepositoryLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/languages`, {
      headers: {
        Authorization: `token ${this.token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    return (await response.json()) as Record<string, number>
  }

  /**
   * Get user's contribution stats
   */
  async getContributions(username: string): Promise<Record<string, unknown>> {
    // Note: Contributions require GraphQL or scraping, this is a placeholder
    const response = await fetch(`${this.baseUrl}/users/${username}`, {
      headers: {
        Authorization: `token ${this.token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = (await response.json()) as {
      public_repos?: number
      followers?: number
      following?: number
      created_at?: string
    }
    return {
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      created_at: data.created_at
    }
  }

  /**
   * Get all repositories (paginated)
   */
  async getAllRepositories(): Promise<GitHubRepository[]> {
    const repos: GitHubRepository[] = []
    let page = 1
    let hasMore = true

    while (hasMore && repos.length < 100) {
      const pageRepos = await this.getRepositories(page, 30)
      if (pageRepos.length === 0) {
        hasMore = false
      } else {
        repos.push(...pageRepos)
        page++
      }
    }

    return repos
  }

  /**
   * Format repositories for frontend
   */
  formatRepositories(repos: GitHubRepository[]) {
    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      lastUpdated: repo.updated_at
    }))
  }

  /**
   * Format user for frontend
   */
  formatUser(user: GitHubUser) {
    return {
      id: user.id,
      login: user.login,
      avatarUrl: user.avatar_url,
      name: user.name,
      bio: user.bio,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at
    }
  }
}

/**
 * Validate GitHub OAuth token
 */
export async function validateGitHubToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Exchange GitHub authorization code for access token
 */
export async function exchangeGitHubCode(
  code: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code
    })
  })

  if (!response.ok) {
    throw new Error('Failed to exchange GitHub code')
  }

  const data = (await response.json()) as {
    error?: string
    error_description?: string
    access_token?: string
  }

  if (data.error) {
    throw new Error(`GitHub OAuth error: ${data.error_description}`)
  }

  if (!data.access_token) {
    throw new Error('No access token returned from GitHub')
  }

  return data.access_token
}

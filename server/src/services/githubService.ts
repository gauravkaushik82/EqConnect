import { getSupabase } from '../lib/supabase.js'
import { GitHubAPI, exchangeGitHubCode, validateGitHubToken } from '../lib/github.js'

/**
 * Link GitHub account to user
 */
export async function linkGitHubAccount(userId: string, githubToken: string) {
  try {
    // Validate token
    const isValid = await validateGitHubToken(githubToken)
    if (!isValid) {
      throw new Error('Invalid GitHub token')
    }

    // Get GitHub user info
    const github = new GitHubAPI(githubToken)
    const user = await github.getUser()

    // Update user in database
    const supabase = getSupabase()
    const { error } = await supabase
      .from('users')
      .update({
        github_id: user.id.toString(),
        github_username: user.login,
        github_token: githubToken,
        github_avatar_url: user.avatar_url,
        github_connected_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) throw error

    return {
      success: true,
      user: {
        github_username: user.login,
        github_avatar_url: user.avatar_url
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to link GitHub account'
    }
  }
}

/**
 * Disconnect GitHub account
 */
export async function disconnectGitHubAccount(userId: string) {
  try {
    const supabase = getSupabase()

    // Delete repositories
    await supabase.from('github_repositories').delete().eq('user_id', userId)

    // Update user
    const { error } = await supabase
      .from('users')
      .update({
        github_id: null,
        github_username: null,
        github_token: null,
        github_avatar_url: null,
        github_connected_at: null
      })
      .eq('id', userId)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to disconnect GitHub account'
    }
  }
}

/**
 * Sync GitHub repositories for user
 */
export async function syncGitHubRepositories(userId: string) {
  try {
    const supabase = getSupabase()

    // Get user with GitHub token
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('github_token, github_username')
      .eq('id', userId)
      .single()

    if (userError || !user?.github_token) {
      throw new Error('GitHub not connected')
    }

    // Fetch repositories from GitHub
    const github = new GitHubAPI(user.github_token)
    const repos = await github.getAllRepositories()

    // Delete old repositories
    await supabase.from('github_repositories').delete().eq('user_id', userId)

    // Insert new repositories
    const reposToInsert = repos.map(repo => ({
      user_id: userId,
      repo_id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      last_updated: repo.updated_at,
      synced_at: new Date().toISOString()
    }))

    if (reposToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('github_repositories')
        .insert(reposToInsert)

      if (insertError) throw insertError
    }

    // Log sync
    await supabase.from('github_sync_logs').insert({
      user_id: userId,
      status: 'success',
      message: `Synced ${reposToInsert.length} repositories`
    })

    return {
      success: true,
      repositoryCount: reposToInsert.length
    }
  } catch (error: any) {
    // Log error
    const supabase = getSupabase()
    await supabase.from('github_sync_logs').insert({
      user_id: userId,
      status: 'failed',
      message: error.message
    })

    return {
      success: false,
      error: error.message || 'Failed to sync repositories'
    }
  }
}

/**
 * Get GitHub repositories for user
 */
export async function getGitHubRepositories(userId: string) {
  try {
    const supabase = getSupabase()

    const { data: repos, error } = await supabase
      .from('github_repositories')
      .select('*')
      .eq('user_id', userId)
      .order('stars', { ascending: false })

    if (error) throw error

    return {
      success: true,
      repositories: repos || []
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get repositories'
    }
  }
}

/**
 * Get GitHub user stats
 */
export async function getGitHubStats(userId: string) {
  try {
    const supabase = getSupabase()

    // Get user GitHub info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('github_token, github_username')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    if (!user?.github_token || !user?.github_username) {
      throw new Error('GitHub not connected')
    }

    // Get stats from GitHub API
    const github = new GitHubAPI(user.github_token)
    const stats = await github.getContributions(user.github_username)

    // Get repository count from database
    const { data: repos, error: reposError } = await supabase
      .from('github_repositories')
      .select('id')
      .eq('user_id', userId)

    if (reposError) throw reposError

    return {
      success: true,
      stats: {
        ...stats,
        syncedRepositories: repos?.length || 0
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get stats'
    }
  }
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const GITHUB_PAT = Deno.env.get('GITHUB_PAT')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GitHubRepo {
  stargazers_count: number;
  language: string | null;
  name: string;
  updated_at: string;
}

interface GitHubUser {
  login: string;
  avatar_url: string;
  created_at: string;
  public_repos: number;
  followers: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[DEBUG] sync-github started');
    console.log('[DEBUG] GITHUB_PAT exists:', !!GITHUB_PAT);

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Get GitHub username from settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('social_links')
      .single()

    if (settingsError) {
      console.error('[DEBUG] Settings Fetch Error:', settingsError);
      throw settingsError;
    }
    
    const socialLinks = settings.social_links as Record<string, string> | null;
    const githubUsername = socialLinks?.github;
    console.log('[DEBUG] settings.social_links.github:', githubUsername);

    if (!githubUsername) {
      throw new Error('GitHub username not configured in settings.')
    }

    // Extract username from URL if necessary
    const username = githubUsername.includes('github.com/') 
      ? githubUsername.split('github.com/').pop()?.split('/')[0] 
      : githubUsername;
    
    console.log('[DEBUG] Extracted username:', username);

    const headers = {
      'Authorization': `Bearer ${GITHUB_PAT}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'V-Portfolio-Sync', // Required by GitHub API
    }

    // 2. Fetch User Profile
    console.log(`[DEBUG] Fetching GitHub profile for ${username}...`);
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers })
    
    if (!userRes.ok) {
      const errorBody = await userRes.text();
      console.error('GitHub User Fetch Failed', {
        status: userRes.status,
        statusText: userRes.statusText,
        body: errorBody,
      });
      throw new Error(`GitHub Profile Fetch Failed: ${userRes.statusText} - ${errorBody}`);
    }
    
    const user = await userRes.json() as GitHubUser

    // 3. Fetch Repositories (paginated - first 100 for MVP)
    console.log(`[DEBUG] Fetching GitHub repos for ${username}...`);
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers })
    
    if (!reposRes.ok) {
      const errorBody = await reposRes.text();
      console.error('GitHub Repos Fetch Failed', {
        status: reposRes.status,
        statusText: reposRes.statusText,
        body: errorBody,
      });
      throw new Error(`GitHub Repos Fetch Failed: ${reposRes.statusText} - ${errorBody}`);
    }
    
    const repos = await reposRes.json() as GitHubRepo[]

    // 4. Aggregate Data
    console.log(`[DEBUG] Aggregating data for ${repos.length} repos...`);
    let totalStars = 0
    const languagesMap: Record<string, number> = {}
    
    repos.forEach((repo) => {
      totalStars += repo.stargazers_count
      if (repo.language) {
        languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1
      }
    })

    const topLanguages = Object.entries(languagesMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    const totalReposForCalc = repos.length
    const languageStats = topLanguages.map(lang => ({
      name: lang.name,
      percent: Math.round((lang.count / totalReposForCalc) * 100),
      color: getLanguageColor(lang.name)
    }))

    const yearsActive = new Date().getFullYear() - new Date(user.created_at).getFullYear()

    const payload = {
      schema_version: 1,
      metadata: {
        platform: 'github',
        last_synced_at: new Date().toISOString(),
        sync_status: 'success'
      },
      profile: {
        username: user.login,
        avatar_url: user.avatar_url,
        member_since: user.created_at,
        years_active: yearsActive > 0 ? yearsActive : 1
      },
      stats: {
        total_stars: totalStars,
        total_repos: user.public_repos,
        followers: user.followers,
        contributions_last_year: 0
      },
      languages: languageStats,
      activity: {
        latest_interaction: {
          repo_name: repos[0]?.name || 'N/A',
          type: 'Update',
          occurred_at: repos[0]?.updated_at || new Date().toISOString()
        }
      }
    }

    // 5. Upsert into coding_cache
    console.log('[DEBUG] Upserting into coding_cache...');
    const { error: upsertError } = await supabase
      .from('coding_cache')
      .upsert({
        platform: 'github',
        cache_key: 'profile',
        data: payload,
        fetch_status: 'success',
        fetched_at: new Date().toISOString()
      }, { onConflict: 'platform, cache_key' })

    if (upsertError) {
      console.error('[DEBUG] Cache Upsert Error:', upsertError);
      throw upsertError;
    }

    console.log('[DEBUG] Sync successful');
    return new Response(JSON.stringify({ success: true, data: payload }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error(error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})

function getLanguageColor(lang: string): string {
  const colors: Record<string, string> = {
    'TypeScript': '#3178c6',
    'JavaScript': '#f7df1e',
    'React': '#61dafb',
    'Python': '#3776ab',
    'Go': '#00add8',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Rust': '#dea584'
  }
  return colors[lang] || '#8b949e'
}

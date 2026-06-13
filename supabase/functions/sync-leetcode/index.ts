import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Browser-like headers to avoid Cloudflare blocking
const leetcodeHeaders = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Referer': 'https://leetcode.com',
  'Origin': 'https://leetcode.com',
}

// ---------------------------------------------------------------------------
// GraphQL Queries
// ---------------------------------------------------------------------------

const USER_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        userAvatar
        ranking
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`

const USER_CONTEST_QUERY = `
  query getUserContestInfo($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      topPercentage
    }
  }
`

// ---------------------------------------------------------------------------
// TypeScript Interfaces
// ---------------------------------------------------------------------------

interface LCSubmissionStat {
  difficulty: string;
  count: number;
}

interface LCProfileResponse {
  data: {
    matchedUser: {
      username: string;
      profile: {
        realName: string;
        userAvatar: string;
        ranking: number;
      };
      submitStatsGlobal: {
        acSubmissionNum: LCSubmissionStat[];
      };
    } | null;
  };
}

interface LCContestResponse {
  data: {
    userContestRanking: {
      attendedContestsCount: number;
      rating: number;
      globalRanking: number;
      topPercentage: number;
    } | null;
  };
}

// ---------------------------------------------------------------------------
// Helper: Execute a GraphQL query against LeetCode
// ---------------------------------------------------------------------------

async function queryLeetCode<T>(query: string, variables: Record<string, string>): Promise<T> {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: leetcodeHeaders,
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('[DEBUG] LeetCode GraphQL error response:', {
      status: res.status,
      statusText: res.statusText,
      body: body.substring(0, 500),
    })
    throw new Error(`LeetCode GraphQL request failed: ${res.status} ${res.statusText}`)
  }

  return await res.json() as T
}

// ---------------------------------------------------------------------------
// Main Handler
// ---------------------------------------------------------------------------

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[DEBUG] sync-leetcode started')

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Get LeetCode username from settings
    console.log('[DEBUG] Fetching LeetCode username from settings...')
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('social_links')
      .single()

    if (settingsError) {
      console.error('[DEBUG] Settings Fetch Error:', settingsError)
      throw settingsError
    }

    const socialLinks = settings.social_links as Record<string, string> | null
    const leetcodeUsername = socialLinks?.leetcode
    console.log('[DEBUG] settings.social_links.leetcode:', leetcodeUsername)

    if (!leetcodeUsername) {
      throw new Error('LeetCode username not configured in settings.')
    }

    // 2. Fetch User Profile + Solve Stats
    console.log(`[DEBUG] Fetching LeetCode profile for "${leetcodeUsername}"...`)
    const profileRes = await queryLeetCode<LCProfileResponse>(
      USER_PROFILE_QUERY,
      { username: leetcodeUsername }
    )

    const matchedUser = profileRes.data?.matchedUser
    if (!matchedUser) {
      throw new Error(`LeetCode user "${leetcodeUsername}" not found. Verify the username is correct.`)
    }

    console.log('[DEBUG] Profile fetched successfully:', {
      username: matchedUser.username,
      ranking: matchedUser.profile.ranking,
      solveStats: matchedUser.submitStatsGlobal.acSubmissionNum,
    })

    // 3. Fetch Contest Ranking (may be null if user has never competed)
    console.log(`[DEBUG] Fetching LeetCode contest info for "${leetcodeUsername}"...`)
    const contestRes = await queryLeetCode<LCContestResponse>(
      USER_CONTEST_QUERY,
      { username: leetcodeUsername }
    )

    const contestRanking = contestRes.data?.userContestRanking
    console.log('[DEBUG] Contest data:', contestRanking ?? 'No contest history (null)')

    // 4. Parse solve stats
    const solveStats = matchedUser.submitStatsGlobal.acSubmissionNum
    const getSolveCount = (difficulty: string): number => {
      return solveStats.find(s => s.difficulty === difficulty)?.count ?? 0
    }

    const totalSolved = getSolveCount('All')
    const easySolved = getSolveCount('Easy')
    const mediumSolved = getSolveCount('Medium')
    const hardSolved = getSolveCount('Hard')

    console.log('[DEBUG] Solve breakdown:', { totalSolved, easySolved, mediumSolved, hardSolved })

    // 5. Construct Payload
    const payload = {
      schema_version: '1.0',
      metadata: {
        platform: 'leetcode',
        last_synced_at: new Date().toISOString(),
        sync_status: 'success',
      },
      profile: {
        username: matchedUser.username,
        avatar_url: matchedUser.profile.userAvatar,
        ranking: matchedUser.profile.ranking ?? 0,
      },
      stats: {
        total_solved: totalSolved,
        easy_solved: easySolved,
        medium_solved: mediumSolved,
        hard_solved: hardSolved,
      },
      contest: {
        rating: Math.round(contestRanking?.rating ?? 0),
        attended_count: contestRanking?.attendedContestsCount ?? 0,
        global_ranking: contestRanking?.globalRanking ?? 0,
        top_percentage: contestRanking?.topPercentage
          ? Math.round(contestRanking.topPercentage * 10) / 10
          : 0,
      },
    }

    console.log('[DEBUG] Final payload constructed:', JSON.stringify(payload, null, 2))

    // 6. Upsert into coding_cache
    console.log('[DEBUG] Upserting into coding_cache...')
    const { error: upsertError } = await supabase
      .from('coding_cache')
      .upsert({
        platform: 'leetcode',
        cache_key: 'profile',
        data: payload,
        fetch_status: 'success',
        fetched_at: new Date().toISOString(),
      }, { onConflict: 'platform, cache_key' })

    if (upsertError) {
      console.error('[DEBUG] Cache Upsert Error:', upsertError)
      throw upsertError
    }

    console.log('[DEBUG] sync-leetcode completed successfully')
    return new Response(JSON.stringify({ success: true, data: payload }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('[DEBUG] sync-leetcode FAILED:', error)
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

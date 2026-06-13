import { useCodingCache } from '@/hooks/queries/useCodingCache'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { GitBranch, Star, Book, Users, Calendar, Activity, Trophy, TrendingUp, Hash, Code2, Target } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface GitHubData {
  profile: {
    username: string;
    avatar_url: string;
    member_since: string;
    years_active: number;
  };
  stats: {
    total_stars: number;
    total_repos: number;
    followers: number;
    contributions_last_year: number;
  };
  languages: Array<{
    name: string;
    percent: number;
    color: string;
  }>;
  metadata: {
    last_synced_at: string;
  };
  activity: {
    latest_interaction: {
      repo_name: string;
      type: string;
      occurred_at: string;
    };
  };
}

interface CodeforcesData {
  profile: {
    handle: string;
    avatar: string;
    rank: string;
    max_rank: string;
  };
  stats: {
    rating: number;
    max_rating: number;
    contest_count: number;
  };
  activity: {
    last_contest_name: string;
    last_rating_change: number;
    last_contest_date: string;
  };
  metadata: {
    last_synced_at: string;
  };
}

interface LeetCodeData {
  profile: {
    username: string;
    avatar_url: string;
    ranking: number;
  };
  stats: {
    total_solved: number;
    easy_solved: number;
    medium_solved: number;
    hard_solved: number;
  };
  contest: {
    rating: number;
    attended_count: number;
    global_ranking: number;
    top_percentage: number;
  };
  metadata: {
    last_synced_at: string;
  };
}

export function CodingProfiles() {
  const { data: cacheEntries, isLoading } = useCodingCache()

  const githubEntry = cacheEntries?.find(entry => entry.platform === 'github')
  const githubData = githubEntry?.data as unknown as GitHubData

  const cfEntry = cacheEntries?.find(entry => entry.platform === 'codeforces')
  const cfData = cfEntry?.data as unknown as CodeforcesData

  const lcEntry = cacheEntries?.find(entry => entry.platform === 'leetcode')
  const lcData = lcEntry?.data as unknown as LeetCodeData

  if (isLoading || (!githubData && !cfData && !lcData)) return null

  return (
    <AnimatedSection id="engineering-footprint" className="section-container py-24" aria-labelledby="footprint-title">
      <div className="flex flex-col gap-4 mb-12">
        <h2 id="footprint-title" className="section-title">Engineering Footprint</h2>
        <p className="section-subtitle">
          A real-time snapshot of my open-source impact and competitive programming status.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {githubData && <GitHubCard data={githubData} />}
        {lcData && <LeetCodeCard data={lcData} />}
        {cfData && <CodeforcesCard data={cfData} />}
      </div>
    </AnimatedSection>
  )
}

function GitHubCard({ data }: { data: GitHubData }) {
  const { profile, stats, languages, metadata, activity } = data

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Profile & Stats Bento Card */}
      <div className="lg:col-span-2 glass-card rounded-2xl p-8 relative overflow-hidden group border-l-4 border-l-emerald-500/50">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <GitBranch className="w-24 h-24" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-8">
          <div className="relative">
            <img 
              src={profile.avatar_url} 
              alt={profile.username} 
              className="w-20 h-20 rounded-xl border-2 border-emerald-500/20 shadow-lg object-cover"
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-md shadow-lg">
              <GitBranch className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-display font-bold">github.com/{profile.username}</h3>
              <span className="bg-emerald-500/10 text-emerald-500 text-xs font-medium px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Active {profile.years_active}+ Years
              </span>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Member since {new Date(profile.member_since).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCell label="Stars" value={stats.total_stars} icon={<Star className="w-4 h-4" />} />
          <StatCell label="Repos" value={stats.total_repos} icon={<Book className="w-4 h-4" />} />
          <StatCell label="Impact" value={stats.contributions_last_year || '500+'} icon={<Activity className="w-4 h-4" />} />
          <StatCell label="Followers" value={stats.followers} icon={<Users className="w-4 h-4" />} />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Top Technologies</span>
            <span className="text-muted-foreground text-xs">Based on public repos</span>
          </div>
          <div className="h-3 w-full bg-surface rounded-full overflow-hidden flex border border-border/50">
            {languages.map((lang, i) => (
              <div 
                key={lang.name}
                className="h-full transition-all hover:scale-y-110"
                style={{ 
                  width: `${lang.percent}%`, 
                  backgroundColor: lang.color,
                  opacity: 1 - (i * 0.1)
                }}
                title={`${lang.name}: ${lang.percent}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                <span className="text-xs text-muted-foreground">{lang.name} ({lang.percent}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Snippet Bento Card */}
      <div className="glass-card rounded-2xl p-8 flex flex-col justify-between border-t-4 border-t-emerald-500/50">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl">Recent Activity</h3>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          
          <div className="space-y-6">
            <div className="relative pl-6 border-l border-border/50 py-1">
              <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
              <p className="text-sm font-medium mb-1">
                {activity.latest_interaction.type} in {activity.latest_interaction.repo_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(activity.latest_interaction.occurred_at).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-xs text-emerald-500 font-medium mb-2 uppercase tracking-wider">Engineering Persona</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Focusing on <strong>{languages[0]?.name}</strong> and building scalable <strong>{languages[1]?.name || 'Web'}</strong> solutions.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <a 
            href={`https://github.com/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors font-medium inline-flex items-center gap-2"
            onClick={() => trackEvent('platform_click', { platform: 'github' })}
          >
            View Full Footprint
            <GitBranch className="w-4 h-4" />
          </a>
          <p className="text-[10px] text-muted-foreground mt-4 font-mono uppercase">
            Last Synced: {new Date(metadata.last_synced_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

function CodeforcesCard({ data }: { data: CodeforcesData }) {
  const { profile, stats, activity, metadata } = data

  // Codeforces color mapping
  const getRankColor = (rank: string) => {
    const r = rank.toLowerCase()
    if (r.includes('legendary') || r.includes('international grandmaster') || r.includes('grandmaster')) return 'text-[#ff0000]'
    if (r.includes('international master') || r.includes('master')) return 'text-[#ff8c00]'
    if (r.includes('candidate master')) return 'text-[#aa00aa]'
    if (r.includes('expert')) return 'text-[#0000ff]'
    if (r.includes('specialist')) return 'text-[#03a89e]'
    if (r.includes('pupil')) return 'text-[#008000]'
    if (r.includes('newbie')) return 'text-[#808080]'
    return 'text-muted-foreground'
  }

  const rankColorClass = getRankColor(profile.rank)
  const accentColor = rankColorClass.match(/\[(.*?)\]/)?.[1] || '#3b82f6'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-card rounded-2xl p-8 relative overflow-hidden group border-l-4" style={{ borderLeftColor: accentColor }}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Trophy className="w-24 h-24" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-8">
          <div className="relative">
            <img 
              src={profile.avatar} 
              alt={profile.handle} 
              className="w-20 h-20 rounded-xl border-2 border-border shadow-lg object-cover"
            />
            <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-md shadow-lg">
              <Trophy className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-display font-bold">codeforces.com/profile/{profile.handle}</h3>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border bg-surface/50 ${rankColorClass}`}>
                {profile.rank.toUpperCase()}
              </span>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Peak Rating: <span className="font-bold text-foreground">{stats.max_rating}</span> ({profile.max_rank})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCell label="Current Rating" value={stats.rating} icon={<Trophy className="w-4 h-4" />} />
          <StatCell label="Max Rating" value={stats.max_rating} icon={<Star className="w-4 h-4" />} />
          <StatCell label="Contests" value={stats.contest_count} icon={<Hash className="w-4 h-4" />} />
          <StatCell 
            label="Last Change" 
            value={(activity.last_rating_change >= 0 ? '+' : '') + activity.last_rating_change} 
            icon={<Activity className="w-4 h-4" />} 
            valueClass={activity.last_rating_change >= 0 ? 'text-success' : 'text-destructive'}
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8 flex flex-col justify-between border-t-4" style={{ borderTopColor: accentColor }}>
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl">Latest Contest</h3>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          
          <div className="space-y-6">
            <div className="relative pl-6 border-l border-border/50 py-1">
              <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/50" />
              <p className="text-sm font-medium mb-1 line-clamp-2">
                {activity.last_contest_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(activity.last_contest_date).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-xs text-blue-500 font-medium mb-2 uppercase tracking-wider">Performance Signal</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Currently competing as an <strong>{profile.rank}</strong>. Max career level reached was <strong>{profile.max_rank}</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <a 
            href={`https://codeforces.com/profile/${profile.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-400 transition-colors font-medium inline-flex items-center gap-2"
            onClick={() => trackEvent('platform_click', { platform: 'codeforces' })}
          >
            View Codeforces Profile
            <Trophy className="w-4 h-4" />
          </a>
          <p className="text-[10px] text-muted-foreground mt-4 font-mono uppercase">
            Last Synced: {new Date(metadata.last_synced_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

function LeetCodeCard({ data }: { data: LeetCodeData }) {
  const { profile, stats, contest, metadata } = data
  const accentColor = '#ffa116' // LeetCode Amber

  const hasContestData = contest.attended_count > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Profile & Stats Bento Card */}
      <div className="lg:col-span-2 glass-card rounded-2xl p-8 relative overflow-hidden group border-l-4" style={{ borderLeftColor: accentColor }}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Code2 className="w-24 h-24" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-8">
          <div className="relative">
            <img 
              src={profile.avatar_url} 
              alt={profile.username} 
              className="w-20 h-20 rounded-xl border-2 border-border shadow-lg object-cover"
            />
            <div className="absolute -bottom-2 -right-2 text-white p-1 rounded-md shadow-lg" style={{ backgroundColor: accentColor }}>
              <Code2 className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-display font-bold">leetcode.com/u/{profile.username}</h3>
              {profile.ranking > 0 && (
                <span className="bg-amber-500/10 text-amber-500 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  RANK {profile.ranking.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Solved: <span className="font-bold text-foreground">{stats.total_solved}</span> Problems
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCell label="Solved" value={stats.total_solved} icon={<Code2 className="w-4 h-4" />} />
          <StatCell label="Easy" value={stats.easy_solved} icon={<div className="w-2 h-2 rounded-full bg-emerald-500" />} />
          <StatCell label="Medium" value={stats.medium_solved} icon={<div className="w-2 h-2 rounded-full bg-amber-500" />} />
          <StatCell label="Hard" value={stats.hard_solved} icon={<div className="w-2 h-2 rounded-full bg-rose-500" />} />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8 flex flex-col justify-between border-t-4" style={{ borderTopColor: accentColor }}>
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl">Contest Stats</h3>
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          
          {hasContestData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Rating</p>
                  <p className="text-xl font-bold">{contest.rating}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Top %</p>
                  <p className="text-xl font-bold">{contest.top_percentage}%</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-xs text-amber-600 font-medium mb-2 uppercase tracking-wider">Performance Signal</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Attended <strong>{contest.attended_count}</strong> contests with a global ranking of <strong>{contest.global_ranking.toLocaleString()}</strong>.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Trophy className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground italic">No contest participation yet.</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <a 
            href={`https://leetcode.com/u/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-amber-600 hover:text-amber-500 transition-colors font-medium inline-flex items-center gap-2"
            onClick={() => trackEvent('platform_click', { platform: 'leetcode' })}
          >
            View LeetCode Profile
            <Code2 className="w-4 h-4" />
          </a>
          <p className="text-[10px] text-muted-foreground mt-4 font-mono uppercase">
            Last Synced: {new Date(metadata.last_synced_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

function StatCell({ label, value, icon, valueClass }: { label: string, value: string | number, icon: React.ReactNode, valueClass?: string }) {
  return (
    <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
      <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <span className={`text-2xl font-display font-bold ${valueClass || ''}`}>{value}</span>
    </div>
  )
}

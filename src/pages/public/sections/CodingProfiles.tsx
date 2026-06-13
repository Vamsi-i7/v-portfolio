import { useCodingCache } from '@/hooks/queries/useCodingCache'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { GitBranch, Star, Book, Users, Calendar, Activity } from 'lucide-react'

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

export function CodingProfiles() {
  const { data: cacheEntries, isLoading } = useCodingCache()

  const githubEntry = cacheEntries?.find(entry => entry.platform === 'github')
  const githubData = githubEntry?.data as unknown as GitHubData

  if (isLoading || !githubData) return null

  const { profile, stats, languages, metadata, activity } = githubData

  return (
    <AnimatedSection id="engineering-footprint" className="section-container py-24">
      <div className="flex flex-col gap-4 mb-12">
        <h2 className="section-title">Engineering Footprint</h2>
        <p className="section-subtitle">
          A real-time snapshot of my open-source impact and developer activity.
        </p>
      </div>

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
                className="w-20 h-20 rounded-xl border-2 border-emerald-500/20 shadow-lg"
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
            <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm">
                <Star className="w-4 h-4" />
                <span>Stars</span>
              </div>
              <span className="text-2xl font-display font-bold">{stats.total_stars}</span>
            </div>
            
            <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm">
                <Book className="w-4 h-4" />
                <span>Repos</span>
              </div>
              <span className="text-2xl font-display font-bold">{stats.total_repos}</span>
            </div>

            <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm">
                <Activity className="w-4 h-4" />
                <span>Impact</span>
              </div>
              <span className="text-2xl font-display font-bold">{stats.contributions_last_year || '500+'}</span>
            </div>

            <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm">
                <Users className="w-4 h-4" />
                <span>Followers</span>
              </div>
              <span className="text-2xl font-display font-bold">{stats.followers}</span>
            </div>
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
            >
              View Full Footprint
              <GitBranch className="w-4 h-4" />
            </a>
            <p className="text-[10px] text-muted-foreground mt-4 font-mono">
              LAST SYNCED: {new Date(metadata.last_synced_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

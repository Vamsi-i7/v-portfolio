import { useSkills } from '@/hooks/queries/useSkills'
import { useCodingCache } from '@/hooks/queries/useCodingCache'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { GitBranch, Code2, Trophy, ExternalLink } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { motion } from 'framer-motion'

// Category display order — most important first
const CATEGORY_ORDER = ['Languages', 'Language', 'Frontend', 'AI/ML', 'Backend', 'Database', 'Databases', 'DevOps', 'Cloud', 'Mobile', 'Tools', 'Security']

// Map category names to single canonical display names
const CATEGORY_LABEL: Record<string, string> = {
  Language: 'Primary',
  Languages: 'Primary',
  Frontend: 'Frontend',
  'AI/ML': 'AI / ML',
  Backend: 'Backend',
  Database: 'Database',
  Databases: 'Database',
  DevOps: 'DevOps',
  Cloud: 'Cloud',
  Mobile: 'Mobile',
  Tools: 'Tools',
  Security: 'Security',
}

export function Skills() {
  const { data: skills, isLoading: skillsLoading } = useSkills()
  const { data: cacheEntries, isLoading: cacheLoading } = useCodingCache()

  const githubData = cacheEntries?.find(e => e.platform === 'github')?.data as any
  const lcData = cacheEntries?.find(e => e.platform === 'leetcode')?.data as any
  const cfData = cacheEntries?.find(e => e.platform === 'codeforces')?.data as any

  if (skillsLoading || cacheLoading || !skills?.length) return null

  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Tools'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  // Sort categories by CATEGORY_ORDER, unknown cats go at end
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a)
    const bi = CATEGORY_ORDER.indexOf(b)
    if (ai === -1 && bi === -1) return a.localeCompare(b)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  // Deduplicate canonical labels
  const seenLabels = new Set<string>()
  const rows: { label: string; skills: typeof skills; isPrimary: boolean }[] = []
  for (const cat of sortedCategories) {
    const label = CATEGORY_LABEL[cat] || cat
    if (seenLabels.has(label)) {
      const existing = rows.find(r => r.label === label)
      if (existing) {
        existing.skills = [...existing.skills, ...grouped[cat]]
      }
    } else {
      seenLabels.add(label)
      rows.push({
        label,
        skills: grouped[cat],
        isPrimary: label === 'Primary',
      })
    }
  }

  // Get icon class from identifier or name fallback
  const getIconClass = (skill: typeof skills[0]) => {
    if (skill.icon_identifier) {
      return `devicon-${skill.icon_identifier}-plain`
    }
    // Fallback: simple lowercase mapping
    const fallback = skill.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const mappings: Record<string, string> = {
      'nodejs': 'nodejs-plain',
      'node': 'nodejs-plain',
      'reactjs': 'react-original',
      'react': 'react-original',
      'aws': 'amazonwebservices-plain-wordmark',
      'gcp': 'googlecloud-plain',
      'java': 'java-plain',
      'python': 'python-plain',
      'javascript': 'javascript-plain',
      'js': 'javascript-plain',
      'typescript': 'typescript-plain',
      'ts': 'typescript-plain',
      'tailwind': 'tailwindcss-original',
      'tailwindcss': 'tailwindcss-original',
      'supabase': 'supabase-plain',
      'git': 'git-plain',
      'postgres': 'postgresql-plain',
      'postgresql': 'postgresql-plain',
      'docker': 'docker-plain',
      'kubernetes': 'kubernetes-plain',
      'csharp': 'csharp-plain',
      'cpp': 'cplusplus-plain',
      'go': 'go-original-wordmark',
      'rust': 'rust-plain',
      'html': 'html5-plain',
      'css': 'css3-plain'
    }

    const mapped = mappings[fallback] || `${fallback}-plain`
    return `devicon-${mapped}`
  }

  return (
    <AnimatedSection id="engineering" className="section-container relative" aria-labelledby="dna-title">
      <div className="mb-12">
        <span className="section-label">Engineering</span>
        <h2 id="dna-title" className="text-section font-display font-bold tracking-tight mt-2">
          Technical DNA
        </h2>
      </div>

      <div className="space-y-12 mb-16">
        {rows.map(({ label, skills: rowSkills }, rowIndex) => (
          <div key={label} className="space-y-4">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-[0.15em] border-b border-bg-border pb-2">
              {label}
            </h3>
            <div className="flex flex-wrap gap-3">
              {rowSkills
                .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
                .map((skill, idx) => (
                  <motion.div 
                    key={skill.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.3, delay: (rowIndex * 0.1) + (idx * 0.05) }}
                    className="flex items-center gap-2.5 px-4 py-2 bg-bg-surface border border-bg-border rounded-xl hover:bg-bg-elevated hover:border-accent-primary/50 hover:shadow-glow-accent transition-all cursor-default group"
                  >
                    <i className={`${getIconClass(skill)} text-lg text-text-muted group-hover:text-accent-primary transition-colors`} />
                    <span className="text-sm font-medium text-text-primary">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="dna-metrics">
        {githubData && (
          <a
            href={`https://github.com/${githubData.profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="dna-card group"
            onClick={() => trackEvent('platform_click', { platform: 'github' })}
          >
            <div className="dna-header">
              <span className="flex items-center gap-2 text-accent-primary">
                <GitBranch className="w-4 h-4" />
                GitHub
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="dna-value">{githubData.stats.contributions_last_year || '500+'}</div>
            <div className="dna-label">Contributions / yr</div>
            <div className="dna-meta">{githubData.stats.total_stars} stars · {githubData.stats.total_repos} repos</div>
          </a>
        )}

        {lcData && (
          <a
            href={`https://leetcode.com/u/${lcData.profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="dna-card group"
            onClick={() => trackEvent('platform_click', { platform: 'leetcode' })}
          >
            <div className="dna-header">
              <span className="flex items-center gap-2 text-amber-500">
                <Code2 className="w-4 h-4" />
                LeetCode
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="dna-value">{lcData.stats.total_solved}</div>
            <div className="dna-label">Problems Solved</div>
            <div className="dna-meta">Top {lcData.contest.top_percentage}% · Rating {lcData.contest.rating}</div>
          </a>
        )}

        {cfData && (
          <a
            href={`https://codeforces.com/profile/${cfData.profile.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="dna-card group"
            onClick={() => trackEvent('platform_click', { platform: 'codeforces' })}
          >
            <div className="dna-header">
              <span className="flex items-center gap-2 text-blue-400">
                <Trophy className="w-4 h-4" />
                Codeforces
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="dna-value">{cfData.stats.rating}</div>
            <div className="dna-label">Current Rating</div>
            <div className="dna-meta">{cfData.profile.rank} · Peak {cfData.stats.max_rating}</div>
          </a>
        )}
      </div>
    </AnimatedSection>
  )
}

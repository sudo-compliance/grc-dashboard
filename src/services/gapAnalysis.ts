import type { Control, FrameworkId, GapNarrative } from '../types'

export function generateGapNarrative(
  frameworkId: FrameworkId,
  controls: Control[]
): GapNarrative {
  const total        = controls.length
  const implemented  = controls.filter(c => c.status === 'implemented').length
  const inProgress   = controls.filter(c => c.status === 'in-progress').length
  const notApplicable = controls.filter(c => c.status === 'not-applicable').length
  const notStarted   = total - implemented - inProgress - notApplicable
  const applicable   = total - notApplicable
  const percentComplete = applicable > 0 ? Math.round((implemented / applicable) * 100) : 0

  // Momentum
  const momentum: GapNarrative['momentum'] =
    inProgress === 0 ? 'none'
    : inProgress < total * 0.1 ? 'slow'
    : 'good'

  // Top gap domain (most not-started controls)
  const domainNotStarted = new Map<string, number>()
  for (const c of controls) {
    if (c.status === 'not-started') {
      domainNotStarted.set(c.domain, (domainNotStarted.get(c.domain) ?? 0) + 1)
    }
  }

  let topGapDomain = ''
  let topGapDomainNotStarted = 0
  for (const [domain, count] of domainNotStarted.entries()) {
    if (count > topGapDomainNotStarted) {
      topGapDomainNotStarted = count
      topGapDomain = domain
    }
  }

  // Concentration insight
  let concentrationInsight = ''
  if (notStarted === 0) {
    concentrationInsight = 'All controls are either implemented or in progress — no gaps remain.'
  } else if (topGapDomain) {
    const pct = Math.round((topGapDomainNotStarted / notStarted) * 100)
    concentrationInsight = `${topGapDomainNotStarted} of your ${notStarted} not-started control${notStarted !== 1 ? 's' : ''} ${notStarted !== 1 ? 'are' : 'is'} in ${topGapDomain} — that's ${pct}% of your remaining gap concentrated in one area.`
  } else {
    concentrationInsight = `${notStarted} control${notStarted !== 1 ? 's' : ''} not yet started across all domains.`
  }

  // Critical gaps — top 3 not-started controls by position in list (most foundational first)
  const criticalGaps = controls
    .filter(c => c.status === 'not-started')
    .slice(0, 3)
    .map(c => c.id)

  // Priority action
  const firstGap = criticalGaps[0]
  let priorityAction = ''
  if (!firstGap) {
    priorityAction = 'All controls are implemented or in progress — focus on completing any in-progress work.'
  } else if (topGapDomain) {
    priorityAction = `Start with ${firstGap} in ${topGapDomain}, which has the highest concentration of gaps and is likely foundational for other controls in this domain.`
  } else {
    priorityAction = `Start with ${firstGap}, the first not-started control in this framework.`
  }

  return {
    frameworkId,
    totalControls: total,
    implemented,
    inProgress,
    notStarted,
    percentComplete,
    topGapDomain,
    topGapDomainNotStarted,
    concentrationInsight,
    criticalGaps,
    priorityAction,
    momentum,
  }
}


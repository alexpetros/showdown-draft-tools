import ps from 'pokemon-showdown'
import * as stats from '../dex/stats.js'
import * as spreads from '../dex/spreads.js'

const { MIN_SPEED, DEFAULT_SPEED, MAX_NETURAL_SPEED, MAX_POSITIVE_SPEED } = spreads

export function getFormattedTiers (mons) {
  return getTiers(mons)
    .map(tier => `${tier.spe} - ${tier.mon} (${tier.name})`)
    .join('\n')
}

/**
 * Get the relevant speed tiers for a team.
 * @param mons - a list of pokemon names
 */
export function getTiers (mons) {
  const speedTiers = mons.flatMap(mon => {
    return [
      getTier(mon, spreads.MIN_SPEED, 'Min'),
      getTier(mon, spreads.DEFAULT_SPEED, 'Default'),
      getTier(mon, spreads.MAX_NETURAL_SPEED, 'Max Neutral'),
      getTier(mon, spreads.MAX_POSITIVE_SPEED, 'Max Positive'),
      getTier(mon, spreads.MAX_NETURAL_SPEED, 'Max Positive +1', 1.5),
      getTier(mon, spreads.MAX_POSITIVE_SPEED, 'Max Positive +1', 1.5),
    ]
  })

  speedTiers.sort((a, b) => b.spe - a.spe)
  return speedTiers
}

function getTier (mon, set, name, modifier = 1) {
  const spe = ps.Dex.trunc(stats.getStats(mon, set).spe * modifier)
  return { mon, spe, name }
}

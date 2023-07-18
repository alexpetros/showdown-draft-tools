import ps from 'pokemon-showdown'
import * as stats from '../dex/stats.js'
import * as spreads from '../dex/spreads.js'

export function getFormattedTiers (teams) {
  const tiers = teams.flatMap(team => getTiers(team.mons, team.name))
  return tiers
    .sort((a,b) => b.spe - a.spe)
    .map(tier => `${tier.spe}:${tier.mon}:${tier.name}:${tier.teamName}`)
    .join('\n')
}

/**
 * Get the relevant speed tiers for a team.
 * @param mons - a list of pokemon names
 */
export function getTiers (mons, teamName) {
  const speedTiers = mons.flatMap(mon => {
    return [
      getTier(mon, spreads.MIN_SPEED, 'Min'),
      getTier(mon, spreads.DEFAULT_SPEED, 'Default'),
      getTier(mon, spreads.MAX_NETURAL_SPEED, 'Max Neutral'),
      getTier(mon, spreads.MAX_POSITIVE_SPEED, 'Max Positive'),
      getTier(mon, spreads.MAX_NETURAL_SPEED, 'Max Neutral +1', 1.5),
      getTier(mon, spreads.MAX_POSITIVE_SPEED, 'Max Positive +1', 1.5),
    ]
  })

  return speedTiers.map(tier => ({ ...tier, teamName }))
}

function getTier (mon, set, name, modifier = 1) {
  const spe = ps.Dex.trunc(stats.getStats(mon, set).spe * modifier)
  return { mon, spe, name }
}

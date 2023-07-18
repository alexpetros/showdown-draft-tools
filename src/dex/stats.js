// Adapted from: https://github.com/smogon/pokemon-showdown/blob/9d2339db653e05d07df7b49872067d4349a8942e/sim/battle.ts
import ps from 'pokemon-showdown'

const tr = ps.Dex.trunc

/**
 * getStats - return the game stats of a mon based on the set
 * @param mon - the name of the pokmeon
 * @param set - the JSON-formatted set (only "evs" and "nature" are required fields)
 */
export function getStats (mon, set) {
  const baseStats = ps.Dex.species.get(mon).baseStats
  const subset = {
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 }, // Assume max IVs if not provided
    ...set
  }

  return spreadModify(baseStats, subset)
}

/** Given a table of base stats and a pokemon set, return the actual stats. */
function spreadModify (baseStats, set) {
  const level = 100
  const modStats = { atk: 10, def: 10, spa: 10, spd: 10, spe: 10 }
  let statName
  for (statName in modStats) {
    const stat = baseStats[statName]
    modStats[statName] = tr(tr(2 * stat + set.ivs[statName] + tr(set.evs[statName] / 4)) * level / 100 + 5)
  }
  if ('hp' in baseStats) {
    const stat = baseStats.hp
    modStats.hp = tr(tr(2 * stat + set.ivs.hp + tr(set.evs.hp / 4) + 100) * level / 100 + 10)
  }
  return natureModify(modStats, set)
}

function natureModify (stats, set) {
  const nature = ps.Dex.natures.get(set.nature)
  let s
  if (nature.plus) {
    s = nature.plus
    stats[s] = tr(tr(stats[s] * 110, 16) / 100)
  }
  if (nature.minus) {
    s = nature.minus
    stats[s] = tr(tr(stats[s] * 90, 16) / 100)
  }
  return stats
}

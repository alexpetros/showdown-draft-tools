import { describe, it } from 'node:test'
import * as assert from 'node:assert'

import * as stats from '../src/dex/stats.js'

const MAX_POSITIVE_SPEED = {
  evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
  nature: 'Timid'
}

const MAX_NETURAL_SPEED = {
  evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
  nature: 'Modest'
}

describe('speed tiers', () => {
  it('correctly calculates the max positive speed', () => {
    const val = stats.getStats('Iron Valiant', MAX_POSITIVE_SPEED)
    assert.equal(val.spe, 364)
  })

  it('correctly calculates the max neutral speed', () => {
    const val = stats.getStats('Iron Valiant', MAX_NETURAL_SPEED)
    assert.equal(val.spe, 331)
  })
})

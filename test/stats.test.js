import { describe, it } from 'node:test'
import * as assert from 'node:assert'

import * as stats from '../src/dex/stats.js'
import * as spreads from '../src/dex/spreads.js'


describe('speed tiers', () => {
  it('correctly calculates the max positive speed', () => {
    const val = stats.getStats('Iron Valiant', spreads.MAX_POSITIVE_SPEED)
    assert.equal(val.spe, 364)
  })

  it('correctly calculates the max neutral speed', () => {
    const val = stats.getStats('Iron Valiant', spreads.MAX_NETURAL_SPEED)
    assert.equal(val.spe, 331)
  })
})

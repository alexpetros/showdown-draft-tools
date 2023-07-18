#!/usr/bin/env node

import * as teams from './src/teams.js'
import * as speedTiers from './src/analysis/speed-tiers.js'

const args = process.argv.slice(2)

const options = args.filter(arg => arg.startsWith('--'))
const teamNames = args.filter(arg => !arg.startsWith('--'))

if (teamNames.length < 1) usage()

const teamsToAnalyze = teamNames.map(teamName => {
  const name = teamName.toLowerCase()
  const mons = teams.fileTeams[name]
  if (!mons) exit(`"${teamName}" is not a valid team. Please try again.`)
  return { name, mons }
})

if (options.includes('--speed')) {
  const allTiers = speedTiers.getFormattedTiers(teamsToAnalyze)
  console.log(allTiers)
}

function exit (message) {
  console.error(message)
  process.exit(1)
}

function usage () {
  const message = `battle tools
USAGE: ./cli.js [TEAM1] [...TEAM2]

Add flags to modify the analysis:
  --all
      the default, prints all the analyses

  --speed
      print out the speed tiers
`
  console.error(message)
  exit(2)
}

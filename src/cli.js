import * as teams from './teams.js'
import * as analysis from './weakness-analysis.js'

const args = process.argv.slice(2)
if (args.length !== 2) usage()

const firstTeamName = args[0].toLowerCase()
const secondTeamName = args[1].toLowerCase()

const firstTeam = teams.fileTeams[firstTeamName]
const secondTeam = teams.fileTeams[secondTeamName]

if (!firstTeam) exit(`"${firstTeamName}" is not a valid team. Please try again.`)
if (!secondTeam) exit(`"${secondTeamName}" is not a valid team. Please try again.`)

analysis.compareTeams(firstTeam, secondTeam)

function exit(message) {
  console.error(message)
  process.exit(1)
}

function usage () {
  exit('USAGE: npm start [TEAM1] [TEAM2]')
}

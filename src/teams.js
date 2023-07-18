import fs from 'node:fs'

const teams = {}

fs.readdirSync('./teams').forEach(teamName => {
  const team = fs.readFileSync(`./teams/${teamName}`)
    .toString()
    .split('\n')
    .filter(mon => /\S/.test(mon))
  teams[teamName] = team
})

export const fileTeams = teams

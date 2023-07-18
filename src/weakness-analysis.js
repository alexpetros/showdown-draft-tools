import ps from 'pokemon-showdown'
import typeChart from './stats/typechart.js'

const { Dex } = ps

const createTeamObjArr = (team) => {
  const monObjs = []

  team.forEach(mon => {
    const pokemon = Dex.species.get(mon)
    monObjs.push(pokemon)
  })

  return monObjs
}

const printStats = (team, whoseTeam = 'mine', chosenStat = 'hp') => {
  const monObjs = []

  team.forEach(mon => {
    const pokemon = Dex.species.get(mon)
    monObjs.push(pokemon)
  })

  monObjs.sort((a, b) => {
    return b.baseStats[chosenStat] - a.baseStats[chosenStat]
  })

  console.log(whoseTeam)
  monObjs.forEach(mon => console.log(mon.baseStats, mon.name))
  // monObjs.forEach(mon => console.table(mon.baseStats))
  // console.table(mon.baseStats)
}

function weaknessAndStrengths (types) {
  // 1. Make one big list of all the weaknesses of the pokemon's typings
  let tempWeaknesses = []
  // 2. Make one big list of all the resistances of the pokemon's typings
  let tempResistances = []
  // 4. Make a list of all of the immunities of the pokemon's typings
  const tempImmunities = []

  const result = {
    weaknesses: {},
    doubleWeaknesses: {},
    resistances: {},
    doubleResistances: {},
    immunities: {},
    superEffectiveSTAB: {}
  }

  types.forEach((type) => {
    const typeMatchups = typeChart[type]

    Object.entries(typeMatchups).forEach(([key, value]) => {
      if (value === 2) {
        tempWeaknesses.push(key)
      } else if (value === 0.5) {
        tempResistances.push(key)
      } else if (value === 0) {
        tempImmunities.push(key)
      }
    })
  })

  // 3. Compare the two lists, remove any element that appears in both lists
  const tempWeaknessesCopy = [...tempWeaknesses]
  tempWeaknesses = tempWeaknesses.filter(type => !tempResistances.includes(type))
  tempResistances = tempResistances.filter(type => !tempWeaknessesCopy.includes(type))

  // 5. Remove from the weaknesses list any element that appears in the list of immunities.
  tempWeaknesses = tempWeaknesses.filter(type => !tempImmunities.includes(type))

  // 6. Once all that is done and the lists have been properly edited, the logic for what goes in what list is this:
  tempWeaknesses.forEach(type => {
    if (tempWeaknesses.filter(x => x === type).length === 2) { // C. any type that appears twice in the weaknesses is a double resistance.
      result.doubleWeaknesses[type] = true
    } else { // D. any type that appears once in the weaknesses is a normal weakness
      result.weaknesses[type] = true
    }
  })

  tempResistances.forEach(type => {
    if (tempResistances.filter(x => x === type).length === 2) { // A. any type that appears twice in resistances is a double resistance
      result.doubleResistances[type] = true
    } else { // B. any type that appears once in resistances is a normal resits
      result.resistances[type] = true
    }
  })

  tempImmunities.forEach(type => { // E. any type that appears in immunities is an immunity
    result.immunities[type] = true
  })

  // Calculate superEffectiveSTAB
  Object.keys(typeChart).forEach((type) => {
    types.forEach((pokemonType) => {
      if (typeChart[type][pokemonType] === 2) {
        result.superEffectiveSTAB[pokemonType] = result.superEffectiveSTAB[pokemonType] || []
        result.superEffectiveSTAB[pokemonType].push(type)
      }
    })
  })

  result.weaknesses = Object.keys(result.weaknesses)
  result.doubleWeaknesses = Object.keys(result.doubleWeaknesses)
  result.resistances = Object.keys(result.resistances)
  result.doubleResistances = Object.keys(result.doubleResistances)
  result.immunities = Object.keys(result.immunities)
  return result
}

const findSwitchIn = (oppMon, team) => {
  // console.log(oppMon)
  // console.log(oppMon.types)
  let switchIns = []
  const oppMonTyping = oppMon.types
  // console.log(oppMon.name)
  const oppMonTypeUse = weaknessAndStrengths(oppMon.types)
  // console.log(oppMonTyping)
  team.forEach(mon => {
    // console.log(mon.name)
    // for each of their types
    // console.log(mon.types)
    mon.types.forEach(monType => {
      // if that type is inlcuded in the oppMon weaknesses or double weaknesses
      if (oppMonTypeUse.weaknesses.includes(monType) || oppMonTypeUse.doubleWeaknesses.includes(monType)) {
        // add it to switchIns
        switchIns.push(mon)
      }
    })
  })

  // edit list to take out any mon that has a weakness to the oppMon
  // filter switch ins

  switchIns = switchIns.filter(switchIn => {
    // get switch in typing
    let noWeaknessToOpp = true
    const switchInTyping = weaknessAndStrengths(switchIn.types)
    // for each oppMon type
    oppMonTyping.forEach(oppMonType => {
      if (switchInTyping.weaknesses.includes(oppMonType) || switchInTyping.doubleWeaknesses.includes(oppMonType)) {
        noWeaknessToOpp = false
      }
    })
    return noWeaknessToOpp
    // if switchInTyping.weaknesses.includes(oppMonTyoe)
    // return false
    // else return true
  })

  switchIns = switchIns.map(switchIn => switchIn.name)

  return switchIns
}

const analyzeResistances = (team) => {
  // Create a mapping of type resistances and immunities for each Pokemon
  const resistances = {}
  team.forEach(pokemon => {
    const pokemonResistances = [...weaknessAndStrengths(pokemon.types).resistances, ...weaknessAndStrengths(pokemon.types).doubleResistances, ...weaknessAndStrengths(pokemon.types).immunities]
    pokemonResistances.forEach(resistance => {
      if (!resistances[resistance]) {
        resistances[resistance] = []
      }
      resistances[resistance].push(pokemon.name)
    })
  })

  // Create the totalResistances table
  const totalResistances = Object.entries(resistances).map(([type, pokemons]) => {
    return {
      type,
      number: pokemons.length,
      pokemons: pokemons.join(', ')
    }
  })
  totalResistances.sort((a, b) => b.number - a.number)

  console.log('Total Resistances:')
  console.table(totalResistances)
}

const analyzeWeaknesses = (team) => {
  // Create a mapping of type weaknesses for each Pokemon
  const weaknesses = {}
  team.forEach(pokemon => {
    // console.log(weaknessAndStrengths(pokemon.types))
    const pokemonWeaknesses = [...weaknessAndStrengths(pokemon.types).weaknesses, ...weaknessAndStrengths(pokemon.types).doubleWeaknesses]
    // console.log(pokemonWeaknesses)
    pokemonWeaknesses.forEach(weakness => {
      if (!weaknesses[weakness]) {
        weaknesses[weakness] = []
      }
      weaknesses[weakness].push(pokemon.name)
    })
  })

  // Create the totalWeaknesses table
  const totalWeaknesses = Object.entries(weaknesses).map(([type, pokemons]) => {
    return {
      type,
      number: pokemons.length,
      pokemons: pokemons.join(', ')
    }
  })
  totalWeaknesses.sort((a, b) => b.number - a.number)

  console.log('Total Weaknesses:')
  console.table(totalWeaknesses)
}

const analyzeSTABs = (team) => {
  // Create a mapping of type weaknesses for each Pokemon
  const weaknesses = {}
  team.forEach(pokemon => {
    console.log(weaknessAndStrengths(pokemon.types))
    // const pokemonWeaknesses = [...weaknessAndStrengths(pokemon.types).weaknesses, ...weaknessAndStrengths(pokemon.types).doubleWeaknesses];
    // // console.log(pokemonWeaknesses)
    // pokemonWeaknesses.forEach(weakness => {
    //     if (!weaknesses[weakness]) {
    //         weaknesses[weakness] = [];
    //     }
    //     weaknesses[weakness].push(pokemon.name);
    // });
  })

  // Create the totalWeaknesses table
  // const totalWeaknesses = Object.entries(weaknesses).map(([type, pokemons]) => {
  //     return {
  //         type,
  //         number : pokemons.length,
  //         pokemons: pokemons.join(', ')
  //     };
  // });
  // totalWeaknesses.sort((a, b) => b.number - a.number);

  // console.log("Total Weaknesses:");
  // console.table(totalWeaknesses);
}

export function compareTeams (myTeam, theirTeam) {
  myTeam = createTeamObjArr(myTeam)
  theirTeam = createTeamObjArr(theirTeam)

  console.log('team analysis')

  console.log('Team 1:')
  analyzeTeam(myTeam, theirTeam, 'walled by', 'switches into')
  analyzeWeaknesses(myTeam) // analyze weaknesses for team 1
  analyzeResistances(myTeam)
  // analyzeSTABs(myTeam)

  console.log('\n\n Team 2')
  analyzeTeam(theirTeam, myTeam, 'walled by', 'switches into')
  analyzeWeaknesses(theirTeam) // analyze weaknesses for team 2
  analyzeResistances(theirTeam)
}

const analyzeTeam = (team1, team2, action1, action2) => {
  team1.forEach(mon => {
    // console.log(mon.name)
    const blastedBy = findSwitchIn(mon, team2)
    const blasts = team2.filter(theirMon => findSwitchIn(theirMon, [mon]).length > 0).map(theirMon => theirMon.name)

    // Create a mapping of type weaknesses for each Pokemon
    const weaknesses = {}
    team2.forEach(pokemon => {
      const pokemonWeaknesses = weaknessAndStrengths(pokemon.types).weaknesses
      pokemonWeaknesses.forEach(weakness => {
        if (!weaknesses[weakness]) {
          weaknesses[weakness] = []
        }
        weaknesses[weakness].push(pokemon.name)
      })
    })

    const table = [{ Action: 'Self', Pokemon: mon.name, ...mon.baseStats }].concat(
      blastedBy.map((name, index) => {
        const pokemon = team2.find(p => p.name === name)
        return { Action: action1, Pokemon: name, ...pokemon.baseStats }
      }),
      blasts.map(name => {
        const pokemon = team2.find(p => p.name === name)
        return { Action: action2, Pokemon: name, ...pokemon.baseStats }
      })
    )
    console.log(mon.name)
    console.table(table)
  })
}

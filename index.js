const util = require('util')
const combinations = require("./data/combinations-2.json")

function getAllCombinations(combinations) {
  return combinations.reduce((data, combination) => {
    Object.keys(combination).forEach((cType) => {
      const value = `${cType}:${combination[cType]}`
      if (!data.includes(value) && cType !== "seller") {
        data.push(value)
      }
    })

    return data
  }, [])
}

function getPossibleCombinations(allCombinations, combinations, typesVariation) {
  const possibleCombinations = {}

  allCombinations.forEach(combination => {
    const [key, value] = combination.split(":")
    const combinationEnabled = getCombinationsEnabled({ key, value, combinations })
    const typesVariationEnabled = typesVariation.filter(tVariation => tVariation !== key)

    possibleCombinations[value] = getPossibleCombination(combinationEnabled, typesVariationEnabled)
  })

  return possibleCombinations
}

function getCombinationsEnabled({ key, value, combinations }) {
  return combinations.filter(combination => combination[key] === value)
}

function getPossibleCombination(combinationEnabled, typesVariationEnabled) {
  return combinationEnabled.reduce((data, ceItem) => {
    typesVariationEnabled.forEach(tvItem => {
      if (!data[tvItem]) {
        data[tvItem] = []
      }

      if (!data[tvItem].includes(ceItem[tvItem])) {
        data[tvItem].push(ceItem[tvItem])
      }
    })

    return data
  }, {})
}

console.time('GET ALL COMBINATIONS')
const typesVariation = Object.keys(combinations[0])
const allCombinations = getAllCombinations(combinations)
const possibleCombinations = getPossibleCombinations(allCombinations, combinations, typesVariation)
console.timeEnd('GET ALL COMBINATIONS') // about 0.727ms

console.log(util.inspect(possibleCombinations, false, null, true /* enable colors */))

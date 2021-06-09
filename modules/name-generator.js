const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const randomstring = require('randomstring')

function generateRandomName(){
  const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, animals] })
  const randomNumber = randomstring.generate({ charset: 'numeric', length: 3 })
  return `${randomName}_${randomNumber}`
}

module.exports = {
  generateRandomName
}
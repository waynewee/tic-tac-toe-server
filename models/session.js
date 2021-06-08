const mongoose = require('mongoose')
const randomstring = require('randomstring')
const { PIECE } = require('../piece-types')

const sessionSchema = mongoose.Schema({
  id: String,
  board: Array,
  boardSize: Number,
  homePlayerName: String,
  awayPlayerName: String
})

class Session extends mongoose.Model {

  static async _new(boardSize, playerName){

    if (boardSize % 2 == 0){
      throw "Board size must be odd!"
    }

    const id = randomstring.generate({
      charset: 'numeric',
      length: 6
    })

    const newSession = new this({
      id: id.toString(),
      board: this.initBoard(boardSize),
      boardSize,
      homePlayerName: playerName
    })

    await newSession.save()

    return newSession
  }

  static initBoard(boardSize) {

    const board = []

    for (let i = 0; i < boardSize; i++) {
      if (!board[i]) { board[i] = []}
      for (let j = 0; j < boardSize; j++) {
        board[i].push(PIECE.EMPTY)
      }
    }

    return board
  }

}

sessionSchema.loadClass(Session)

const session = mongoose.model('session', sessionSchema)

module.exports = {
  session
}
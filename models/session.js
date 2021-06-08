const mongoose = require('mongoose')
const randomstring = require('randomstring')

const sessionSchema = mongoose.Schema({
  id: String,
  board: Array,
  boardSize: Number
})

const PIECE = {
  EMPTY: "EMPTY",
  CIRCLE: "CIRCLE",
  CROSS: "CROSS"
}

class Session extends mongoose.Model {

  static async _new(boardSize){

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
      boardSize
    })

    await newSession.save()

    return newSession.id
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
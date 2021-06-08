const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const { session } = require('./models/session')

const app = express();
const port = 8000;

let corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

app.use(cors(corsOptions))

app.get('/:boardSize', async (req, res, next) => {
  try {
    const sessionId = await session._new(req.params.boardSize)
    res.json({ sessionId })
  } catch (e) {next(e)}
});

app.get('/session/:sessionId', async (req, res, next) => {
  try {
    const _session = await session.findOne({ id: req.params.sessionId })
    res.json({ board: _session.board })
  } catch (e) {next(e)}

})

app.post('/:sessionId', async (req, res, next) => {
  try {
    const { 
      i, 
      j,
      piece
    } = req.query
    
    const _session = await session.findOne({ id: req.params.sessionId })
    const { board } = _session

    board[i][j] = piece

    await session.updateOne({
      id: req.params.sessionId
    }, {
      $set: {
        board
      }
    })

    console.log("HELOL")

    res.sendStatus(200)
  } catch(e) { next(e) }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

mongoose.connect(`mongodb://127.0.0.1/tic-tac-toe`)
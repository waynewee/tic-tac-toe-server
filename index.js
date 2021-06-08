const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const { session } = require('./models/session');
const { generateRandomName } = require('./modules/name-generator');
const { PIECE } = require('./piece-types')

const app = express();
const port = 8000;

const production = process.env.NODE_ENV === 'production'

let origin = `http://localhost:3000`

if (production) {
  origin = `http://ec2-18-219-147-206.us-east-2.compute.amazonaws.com`
}

let corsOptions = {
  origin,
  credentials: true
}

app.use(cors(corsOptions))

app.get('/new/:boardSize', async (req, res, next) => {
  try {
    const playerName = generateRandomName()
    const _session = await session._new(req.params.boardSize, playerName)
    res.json({ session: _session, playerName })
  } catch (e) {next(e)}
});

app.get('/:sessionId', async (req, res, next) => {
 
  try {
    let { playerName } = req.query

    let _session

    if (!playerName) {
      playerName = generateRandomName()
      _session = await session.findOneAndUpdate({
        id: req.params.sessionId
      }, {
        $set: {
          awayPlayerName: playerName
        }
      })
    } else {
      _session = await session.findOne({ id: req.params.sessionId })
    }
    res.json({ session: _session, playerName })
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

    res.sendStatus(200)
  } catch(e) { next(e) }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

mongoose.connect(`mongodb://127.0.0.1/tic-tac-toe`)
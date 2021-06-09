const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const { session } = require('./models/session');
const { generateRandomName } = require('./modules/name-generator');

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

    let _session = await session.findOne({ id: req.params.sessionId })

    if (!_session) {
      return res.sendStatus(404)
    }

    if (
      _session.homePlayerName 
      && _session.awayPlayerName 
      && (playerName != _session.homePlayerName && playerName != _session.awayPlayerName)) {
        return res.sendStatus(403)
      }

    if (!playerName) {
      playerName = generateRandomName()
      await session.updateOne({
        id: req.params.sessionId
      }, {
        $set: {
          awayPlayerName: playerName
        }
      })
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
        board,
        latestMove: {
          i,
          j
        }
      }
    })

    res.sendStatus(200)
  } catch(e) { next(e) }
})

app.delete('/:sessionId', async (req, res, next) => {

  try {
    const _session = session.findOne({ _id: req.params.sessionId })
    if (_session) {
      await session.deleteOne({ id: req.params.sessionId })
    }
    res.sendStatus(200)

  } catch(e) {next(e)}

})

app.listen(port);

mongoose.connect(`mongodb://127.0.0.1/tic-tac-toe`)
// Imports
const express = require('express')
const cors = require('cors')

// Set Up Express
const app = express()
const port = 4000

// Convert and Accept JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Cors
app.use(cors())

// Route Controller
const gamesController = require('./controllers/games-controller.js')
app.use('/games', gamesController)

// Test Server
app.get('/', (req, res) => {
    res.json({ message: "Server is live" })
})

// Handle Unfound Routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" })
})

// Handle Errors
app.use((err, req, res, next) => {
    res.status(err.status).json(err)
})

// Listener Function
const listener = () => console.log(`Express app running on port: ${port}`)
app.listen(port, listener)
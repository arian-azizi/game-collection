const express = require('express')
const router = express.Router()
const config = require('../knexfile').development
const knex = require('knex')(config)


// READ all games
router.get('/', async (req, res, next) => {

    try {
        const games = await knex('games')
        return res.status(200).json(games)
    } catch (err) {
        next({
            status: 500, error: "Server Error. Cannot get list of games: => " + err
        })
    }

})

// CREATE a game
router.post('/', async (req, res, next) => {
    try {
        const { title, release_year, image } = req.body
        const existingGame = await knex("games")
            .where({ title, release_year, image }).first()
        if (existingGame) {
            return res.status(400).json({error: "Game already in account"})
        }
        await knex("games").insert({ title, release_year, image })
        return res.status(201).json({ title, release_year, image })
    } catch (err) {
        next({
            status: 500,
            error: "Server Error. Cannot post game => " + err
        })
    }
})

// UPDATE a game
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params
        const { title, release_year, image } = req.body
        const existingGame = await knex('games').where({ id }).first()
        if (!existingGame) {
            return res.status(404).json({ error: "Game not found" })
        }
        await knex("games").where({ id }).update({ title, release_year, image })
        return res.status(200).json({ title, release_year, image })
    } catch (err) {
        next({
            status: 500,
            error: "Server Error. Cannot update game => " + err
        })
    }
})

// DELETE a game
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params
        const existingGame = await knex('games').where({ id }).first()
        if (!existingGame) {
            return res.status(404).json({ error: "Game not found" })
        }
        await knex("games").where({ id }).del()
        return res.status(200).json({ message: "Game successfully deleted" })
    } catch (err) {
        next({
            status: 500,
            error: "Server Error. Cannot delete game => " + err
        })
    }
})

module.exports = router
import React, { useState, useEffect } from 'react';
import '../styles.css'

const rawg_api_key = "c481ca7cf9fb44eba6267ed004b4253d"
// const tmdb_api_key = "efacc718c0a19e69f9404f6bcb94aa5a"

const GameList = () => {
    const [query, setQuery] = useState("")
    const [searchedGames, setSearchedGames] = useState([])
    const [savedGames, setSavedGames] = useState([])
    const [editGame, setEditGame] = useState(null)

    useEffect(() => {
        fetchMyGames()
    }, [])

    const fetchMyGames = async () => {
        try {
            const response = await fetch("http://localhost:4000/games")
            const data = await response.json()
            setSavedGames(data)
        } catch (error) {
            console.error("Error fetching games from database", error)
        }
    }

    const searchGames = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`https://api.rawg.io/api/games?key=${rawg_api_key}&search=${query}`)
            // const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdb_api_key}&query=${query}`)
            const data = await response.json()
            setSearchedGames(data.results)
        } catch (error) {
            console.error('Error fetching games from API', error)
        }
    }

    const addGame = async (game) => {
        try {
            const response = await fetch(`http://localhost:4000/games`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: game.name,
                    release_year: game.released.split("-")[0],
                    image: game.background_image
                })
            })
            if (response.ok) {
                fetchMyGames()
            } else {
                console.error("Error adding game to account", await response.json())
            }
        } catch (error) {
            console.error("Error adding game to account", error)
        }
    }

    const updateGame = async (game) => {
        try {
            const response = await fetch(`http://localhost:4000/games/${game.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: game.title,
                    release_year: game.release_year,
                    image: game.image
                })
            })
            if (response.ok) {
                fetchMyGames()
            } else {
                console.error("Error updating game in account", await response.json())
            }
        } catch (error) {
            console.error("Error updating game in account", error)
        }
    }

    const deleteGame = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/games/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                fetchMyGames()
            } else {
                console.error("Error deleting game from account", await response.json())
            }
        } catch (error) {
            console.error("Error deleting game from account", error)
        }
    }

    return (
        <div className='container'>
            <form onSubmit={searchGames} className='form'>
                <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search for a game'
                className='input'/>
                <button type="submit" className='button'>Search</button>
            </form>
            { searchedGames.length > 0 ? ( 
                <div className='search-results'>       
                    <h2>Search Results</h2>
                    <ul>
                        {searchedGames.map((game) => (               
                            <li key={game.id}>
                                <img src={`${game.background_image}`} className='poster'/>
                                <div>
                                    {game.name} 
                                    ({game.released.split("-")[0]})
                                    <br/>
                                    <button onClick={() => addGame(game)} className='add-button'> Add Game</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : 
                <>
                </>
            }
            { savedGames.length > 0 ? ( 
                <div className='saved-movies'>    
                    <h2>My Games</h2>
                    <ul>
                        {savedGames.map((game) => (
                            <li key={game.id}>
                                <img src={`${game.image}`} className='poster'/>
                                <div>
                                    {game.title}
                                    ({game.release_year})
                                    <br/>
                                    <button onClick={() => setEditGame(game)} className='edit-button'>Edit</button>
                                    <button onClick={() => deleteGame(game.id)} className='delete-button'>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : 
                <>
                </>
            }
            {editGame && (
                <form onSubmit={(e) => {
                    e.preventDefault()
                    updateGame(editGame)
                    setEditGame(null)
                }} 
                className='edit-form'>
                    <h3>Edit Game</h3>
                    <input
                    type="text"
                    value={editGame.title}
                    onChange={(e) => setEditGame({...editGame, title: e.target.value})}
                    className='edit-input'/>
                    <input
                    type="text"
                    value={editGame.release_year}
                    onChange={(e) => setEditGame({...editGame, release_year: e.target.value})}
                    className='edit-year-input'/>
                    <button type="submit" className='button'>Update</button>
                </form>
            )}
        </div>
    )
}

export default GameList
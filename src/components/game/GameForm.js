import React, { useContext, useState, useEffect } from "react"
import { GameContext } from "./GameProvider.js"
import { useHistory } from 'react-router-dom'
import { useParams } from "react-router-dom/cjs/react-router-dom.min"


export const GameForm = () => {
    const history = useHistory()
    const { createGame, getGameTypes, gameTypes, getGame, updateGame } = useContext(GameContext)
    const { gameId } = useParams()
    const [game, setGame] = useState({})
    const [isEdit, setIsEdit] = useState(false)
    /*
        Since the input fields are bound to the values of
        the properties of this state variable, you need to
        provide some default values.
    */
    const [currentGame, setCurrentGame] = useState({
        skillLevel: 1,
        numberOfPlayers: 0,
        name: "",
        maker: "",
        gameTypeId: 0
    })

    /*
        Get game types on initialization so that the <select>
        element presents game type choices to the user.
    */
    useEffect(() => {
        getGameTypes()
    }, [])

    useEffect(() => {
        console.log('gameId', typeof gameId)
        if (gameId) {
            setIsEdit(true)
            getGame(gameId).then((data) => {
                console.log(data)
                setCurrentGame({
                    numberOfPlayers: data.number_of_players,
                    name: data.name,
                    gameTypeId: data.game_type,
                    maker: data.maker,
                    skillLevel: data.skill_level,
                    description: data.description
                })
            })
        }
    }, [gameId])

    /*
        REFACTOR CHALLENGE START

        Can you refactor this code so that all property
        state changes can be handled with a single function
        instead of five functions that all, largely, do
        the same thing?

        One hint: [event.target.name]
    */
    const changeGameTitleState = (event) => {
        const newGameState = { ...currentGame }
        newGameState.name = event.target.value
        setCurrentGame(newGameState)
    }

    const changeGameMakerState = (event) => {
        const newGameState = { ...currentGame }
        newGameState.maker = event.target.value
        setCurrentGame(newGameState)
    }

    const changeGamePlayersState = (event) => {
        const newGameState = { ...currentGame }
        newGameState.numberOfPlayers = event.target.value
        setCurrentGame(newGameState)
    }

    const changeGameSkillLevelState = (event) => {
        const newGameState = { ...currentGame }
        newGameState.skillLevel = event.target.value
        setCurrentGame(newGameState)
    }

    const changeGameTypeState = (event) => {
        const newGameState = { ...currentGame }
        newGameState.gameTypeId = event.target.value
        setCurrentGame(newGameState)
    }

    const changeDescriptionState = (event) => {
        const newGameState = { ...currentGame }
        newGameState.description = event.target.value
        setCurrentGame(newGameState)
    }
    /* REFACTOR CHALLENGE END */

    return (
        <form className="gameForm">
            <h2 className="gameForm__title">Register New Game</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="title">Title: </label>
                    <input type="text" name="title" required autoFocus className="form-control"
                        value={currentGame.name}
                        onChange={changeGameTitleState}
                    />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="description">description: </label>
                    <input type="text" name="description" required autoFocus className="form-control"
                        value={currentGame.description}
                        onChange={changeDescriptionState}
                    />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="maker">maker: </label>
                    <input type="text" name="maker" required autoFocus className="form-control"
                        value={currentGame.maker}
                        onChange={changeGameMakerState}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="numberOfPlayers">numberOfPlayers: </label>
                    <input type="text" name="numberOfPlayers" required autoFocus className="form-control"
                        value={currentGame.numberOfPlayers}
                        onChange={changeGamePlayersState}
                    />
                </div>
            </fieldset>a
            <fieldset>
                <div className="form-group">
                    <label htmlFor="skillLevel">skillLevel: </label>
                    <input type="text" name="skillLevel" required autoFocus className="form-control"
                        value={currentGame.skillLevel}
                        onChange={changeGameSkillLevelState}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label>Game Type</label>
                    <select onChange={changeGameTypeState} value={currentGame.gameTypeId}>
                        <option>Choose a game type</option>
                        {
                            gameTypes.map(gameType =>
                                (
                                    <option key={gameType.id} value={gameType.id}>{gameType.label}</option>
                                ))
                        }
                    </select>
                </div>
            </fieldset>


            {/* You create the rest of the input fields for each game property */}

            <button type="submit"
                onClick={evt => {
                    // Prevent form from being submitted
                    evt.preventDefault()

                    const game = {
                        maker: currentGame.maker,
                        name: currentGame.name,
                        numberOfPlayers: parseInt(currentGame.numberOfPlayers),
                        skillLevel: parseInt(currentGame.skillLevel),
                        gameTypeId: parseInt(currentGame.gameTypeId),
                        description: currentGame.description
                    }

                    // Send POST request to your API
                    if (isEdit) {
                        game.id = gameId
                        updateGame(game).then(() => history.push("/"))
                    } else {
                        createGame(game)
                            .then(() => history.push("/"))
                    }
                }}
                className="btn btn-primary">Create</button>
        </form>
    )
}

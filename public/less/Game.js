
const game = {
    currentPlayer: "blue",
    movesLeft: 3,
    selected: null,
    scores: { blue: 0, red: 0 },
    winner: null,
}

const RED_GOAL = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 1, y: 3 },
    { x: 3, y: 3 },
]
const BLUE_GOAL = [
    { x: 11, y: 11 },
    { x: 13, y: 11 },
    { x: 11, y: 13 },
    { x: 13, y: 13 },
]

const BLUE_START = RED_GOAL
const RED_START = BLUE_GOAL

function renderPiece(colorOfPiece, coasterX, coasterY) {
    let pieceImg = colorOfPiece === "red" ? "piecered.png" : "pieceblue.png"

    let piece = document.createElement("div")
    piece.classList.add("piece-token")
    piece.style.backgroundImage = `url(${pieceImg})`

    let spot = document.querySelector(
        `[data-spot-board-x='${coasterX}'][data-spot-board-y='${coasterY}']`
    )

    spot.append(piece)
    spot.classList.add("piece")
    spot.classList.add(colorOfPiece)
}

function placeStartingPieces() {
    for (const spot of BLUE_START) {
        renderPiece("blue", spot.x, spot.y)
    }
    for (const spot of RED_START) {
        renderPiece("red", spot.x, spot.y)
    }
}

function resetGameState() {
    game.currentPlayer = "blue"
    game.movesLeft = 3
    game.selected = null
    game.scores = { blue: 0, red: 0 }
    game.winner = null
}

function newGame() {
    mountBoard(document.getElementById("board-root"))
    resetGameState()
    placeStartingPieces()
    updateUI()
}

function updateUI() {
    const turnStatus = document.getElementById("turn-status")
    const scoreStatus = document.getElementById("score-status")
    const winnerStatus = document.getElementById("winner-status")
    const endTurnBtn = document.getElementById("end-turn")

    const label = game.currentPlayer === "blue" ? "Blue" : "Red"
    const moveWord = game.movesLeft === 1 ? "move" : "moves"
    turnStatus.textContent = `${label}'s turn — ${game.movesLeft} ${moveWord} left`
    scoreStatus.textContent = `Moves used — Blue: ${game.scores.blue} · Red: ${game.scores.red}`

    document.body.classList.remove(
        "turn-blue",
        "turn-red",
        "game-over-blue",
        "game-over-red"
    )

    if (game.winner) {
        const winnerLabel = game.winner === "blue" ? "Blue" : "Red"
        winnerStatus.classList.add("is-visible")
        winnerStatus.textContent = `${winnerLabel} wins!`
        turnStatus.textContent = "Game over"
        document.body.classList.add(
            game.winner === "blue" ? "game-over-blue" : "game-over-red"
        )
    } else {
        winnerStatus.classList.remove("is-visible")
        winnerStatus.textContent = ""
        document.body.classList.add(
            game.currentPlayer === "blue" ? "turn-blue" : "turn-red"
        )
    }

    endTurnBtn.disabled = Boolean(game.winner)
}

function selectPiece(x, y) {
    if (isPlayersPiece(x, y)) {
        game.selected = { x, y }
        return game.selected
    }
    game.selected = null
    return game.selected
}

function clearSelection() {
    clearHighlights()
    game.selected = null
}

function spendMoves(cost) {
    if (cost >= 1 && cost <= game.movesLeft) {
        game.movesLeft -= cost
        game.scores[game.currentPlayer] += cost
        updateUI()
    }
}

function endTurn() {
    if (game.winner) return

    clearSelection()
    if (game.currentPlayer === "red") {
        game.currentPlayer = "blue"
    } else {
        game.currentPlayer = "red"
    }
    game.movesLeft = 3
    updateUI()
}

function switchPlayer() {
    if (game.movesLeft === 0) {
        endTurn()
    }
}

function doesSpotContainPiece(x, y) {
    let spot = document.querySelector(
        `[data-spot-board-x='${x}'][data-spot-board-y='${y}']`
    )
    if (!spot) return false
    return spot.classList.contains("piece")
}

function getPieceColor(x, y) {
    let spot = document.querySelector(
        `[data-spot-board-x='${x}'][data-spot-board-y='${y}']`
    )
    if (!spot || !spot.classList.contains("piece")) {
        return null
    }
    if (spot.classList.contains("blue")) return "blue"
    if (spot.classList.contains("red")) return "red"
    return null
}

function isPlayersPiece(x, y) {
    return getPieceColor(x, y) === game.currentPlayer
}

function isThisASpace(x, y) {
    let spot = document.querySelector(
        `[data-spot-board-x='${x}'][data-spot-board-y='${y}']`
    )
    if (!spot) return false
    return spot.classList.contains("space")
}

function isThisAWall(x, y) {
    let spot = document.querySelector(
        `[data-spot-board-x='${x}'][data-spot-board-y='${y}']`
    )
    if (!spot) return false
    return spot.classList.contains("wall")
}

function isOnBoard(x, y) {
    let spot = document.querySelector(
        `[data-spot-board-x='${x}'][data-spot-board-y='${y}']`
    )
    return !!spot
}

function getSpot(x, y) {
    return document.querySelector(
        `[data-spot-board-x='${x}'][data-spot-board-y='${y}']`
    )
}

function* possibleMoves(x, y, dx, dy, moves) {
    let currentCost = 0
    let cx = x
    let cy = y
    let passedWall = false
    let passedPiece = false

    while (moves > currentCost) {
        cx += dx
        cy += dy

        if (!isOnBoard(cx, cy)) {
            break
        }

        let currentlyOnWall = isThisAWall(cx, cy)
        if (currentlyOnWall === true) {
            if (passedPiece === true) {
                break
            }
            currentCost += 1
            passedWall = true
        }
        let currentlyHasPiece = doesSpotContainPiece(cx, cy)
        if (currentlyHasPiece === true) {
            if (passedWall || passedPiece) {
                break
            }
            passedPiece = true
        } else if (isThisASpace(cx, cy)) {
            currentCost += 1
            passedPiece = false
            passedWall = false

            yield({
                x: cx,
                y: cy,
                cost: currentCost,
            })
        }
    }
}

function clearHighlights() {
    document
        .querySelectorAll(".highlight1, .highlight2, .highlight3")
        .forEach((el) => {
            el.classList.remove("highlight1", "highlight2", "highlight3")
        })
}

function* getMoves(x, y, moves) {
    yield* possibleMoves(x, y, 0, 1, moves)
    yield* possibleMoves(x, y, 0, -1, moves)
    yield* possibleMoves(x, y, 1, 0, moves)
    yield* possibleMoves(x, y, -1, 0, moves)
}

function movePiece(toX, toY) {
    const fromX = game.selected.x
    const fromY = game.selected.y
    const color = getPieceColor(fromX, fromY)
    const fromSpot = getSpot(fromX, fromY)
    fromSpot.classList.remove("piece", "blue", "red")
    fromSpot.replaceChildren()
    renderPiece(color, toX, toY)
}

function checkWinner() {
    let blueWon = true
    for (const spot of BLUE_GOAL) {
        if (getPieceColor(spot.x, spot.y) !== "blue") {
            blueWon = false
            break
        }
    }
    if (blueWon) {
        game.winner = "blue"
        updateUI()
        return
    }
    let redWon = true
    for (const spot of RED_GOAL) {
        if (getPieceColor(spot.x, spot.y) !== "red") {
            redWon = false
            break
        }
    }
    if (redWon) {
        game.winner = "red"
        updateUI()
    }
}

document.getElementById("board-root").addEventListener("click", function (event) {
    if (game.winner) return
    const spot = event.target.closest(".spot")
    if (!spot) return

    const x = Number(spot.dataset.spotBoardX)
    const y = Number(spot.dataset.spotBoardY)

    if (isPlayersPiece(x, y)) {
        clearHighlights()
        selectPiece(x, y)
        for (let move of getMoves(x, y, game.movesLeft)) {
            getSpot(move.x, move.y).classList.add(`highlight${move.cost}`)
        }
    } else if (game.selected) {
        for (let cost = 1; cost <= 3; cost++) {
            if (spot.classList.contains(`highlight${cost}`)) {
                movePiece(x, y)
                spendMoves(cost)
                clearSelection()
                checkWinner()
                if (!game.winner) {
                    switchPlayer()
                }
                break
            }
        }
    } else {
        clearSelection()
    }
})

document.getElementById("end-turn").addEventListener("click", function () {
    if (game.winner) return
    endTurn()
})

document.getElementById("new-game").addEventListener("click", function () {
    newGame()
})

newGame()

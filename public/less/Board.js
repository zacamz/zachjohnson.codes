// class Board {
//     constructor(numberOfPlayers){
//         this.numberOfPlayers = numberOfPlayers
//     }
//     buildCoaster(){
//        []
//     }
//     renderBoard(){

//     }

// }

const BOARD_LENGTH = 3

const BOARD_WIDTH = 3


let legend = {
    D: "dummy",
    U: "notWall",
    W: "wall",
    S: "space",
}

let coasters =
    [[["D", "U", "D", "U", "D"],
    ["W", "S", "U", "S", "U"],
    ["D", "U", "D", "U", "D"],
    ["W", "S", "U", "S", "U"],
    ["D", "U", "D", "U", "D"]],

    [["D", "U", "D", "U", "D"],
    ["U", "S", "U", "S", "U"],
    ["D", "U", "D", "W", "D"],
    ["U", "S", "W", "S", "U"],
    ["D", "U", "D", "U", "D"]],

    [["D", "U", "D", "U", "D"],
    ["U", "S", "U", "S", "U"],
    ["D", "U", "D", "U", "D"],
    ["U", "S", "W", "S", "U"],
    ["D", "W", "D", "U", "D"]],

    [["D", "U", "D", "U", "D"],
    ["U", "S", "U", "S", "U"],
    ["D", "U", "D", "U", "D"],
    ["U", "S", "W", "S", "U"],
    ["D", "U", "D", "W", "D"]],

    [["D", "U", "D", "U", "D"],
    ["U", "S", "W", "S", "U"],
    ["D", "U", "D", "W", "D"],
    ["U", "S", "U", "S", "W"],
    ["D", "U", "D", "U", "D"]],

    [["D", "U", "D", "U", "D"],
    ["W", "S", "U", "S", "U"],
    ["D", "W", "D", "U", "D"],
    ["W", "S", "U", "S", "U"],
    ["D", "U", "D", "U", "D"]],

    [["D", "U", "D", "U", "D"],
    ["W", "S", "U", "S", "U"],
    ["D", "U", "D", "U", "D"],
    ["U", "S", "U", "S", "U"],
    ["D", "U", "D", "U", "D"]],]


let buildCoaster = function (coaster, coasterX = 0, coasterY = 0) {

    let assembledCoaster = document.createElement("div")

    assembledCoaster.classList.add("coaster")

    let overallspaceIndex = 0

    for (const [rowIndex, row] of coaster.entries()) {

        let rowHTML = document.createElement("div")

        rowHTML.classList.add("row", (rowIndex % 2) ? "odd" : "even")


        for (const [spotIndex, spot] of row.entries()) {

            let spotHTML = document.createElement("div")



            spotHTML.dataset.spotBoardX = (coasterX * 5) + (overallspaceIndex % 5)
            spotHTML.dataset.spotBoardY = (coasterY * 5) + Math.floor(overallspaceIndex / 5)
            overallspaceIndex += 1

            spotHTML.classList.add(legend[spot], "spot", (spotIndex % 2) ? "odd" : "even")

            rowHTML.append(spotHTML)

        }

        assembledCoaster.append(rowHTML)
    }

    return assembledCoaster

}

function rotateCoaster(coaster) {

    let newcoaster = []

    for (let _ of coaster) {
        newcoaster.push(Array(coaster.length))
    }

    for (i = 0; i < coaster.length; i += 1) {

        for (j = 0; j < coaster.length; j += 1) {
            newcoaster[i][j] = coaster[(coaster.length - j) - 1][i]
        }

    }

    return newcoaster

}

let allCoasters = [
    0,
    1, 1,
    2, 2, 2,
    3, 3, 3, 3,
    4, 4, 4,
    5, 5,
    6
]

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;

    // https://stackoverflow.com/a/2450976
}

function randomInt(max) {
    return Math.floor(max * Math.random())
}

let shuffleCoasters = function (coastersArray) {

    let shuffledCoasters = shuffle(coastersArray)

    let selectedCoasters = shuffledCoasters.slice(0, BOARD_LENGTH * BOARD_WIDTH)

    let rotatedSelectedAndShuffledCoasters = []

    for (let coaster of selectedCoasters) {
        let rotatingCoaster = coasters[coaster]
        for (i = 0; i <= randomInt(4); i += 1) {
            rotatingCoaster = rotateCoaster(rotatingCoaster)
        }

        rotatedSelectedAndShuffledCoasters.push(rotatingCoaster)
    }

    return rotatedSelectedAndShuffledCoasters

}



let renderBoard = function (coastersArray) {



    let board = document.createElement("div")
    board.classList.add("board")


    if (coastersArray.length === BOARD_LENGTH * BOARD_WIDTH) {
        for (i = 0; i < BOARD_LENGTH; i += 1) {
            let boardRow = document.createElement("div")
            boardRow.classList.add("boardRow")


            for (j = 0; j < BOARD_WIDTH; j += 1) {
                let coasterElement = coastersArray[j * BOARD_LENGTH + i % BOARD_WIDTH]
                let renderedCoaster = buildCoaster(coasterElement, j, i)

                renderedCoaster.dataset.boardRow = i
                renderedCoaster.dataset.boardColumn = j
                boardRow.append(renderedCoaster)

            }

            board.append(boardRow)
        }
    }

    return board

}

function mountBoard(container) {
    if (!container) return
    container.replaceChildren()
    const jsboard = shuffleCoasters(allCoasters.slice())
    container.append(renderBoard(jsboard))
    return jsboard
}
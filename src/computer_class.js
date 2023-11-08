export default class Computer {
  constructor() {
    this.possibleMoves = this.#resetMoves()
  }

  getCoordinates() {
    return this.possibleMoves.splice((Math.floor(Math.random() * this.possibleMoves.length)), 1)[0]
  }

  placeShips(board, shipLengths) {
    shipLengths.forEach((length) => {
      const vertical = Math.random() > 0.5 ? true : false
      const coordinates = this.#getPlacementCoordinates(board, vertical, length)
      board.placeShip(coordinates[0], coordinates[1], length, vertical)
    })
    console.log(board)
  }

  #getPlacementCoordinates(board, vertical, length) {
    let possible = []
    let valid = null
    if (vertical) {
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10 - length + 1; y++) {
          valid = true
          for (let k = 0; k < length; k++) {
            if (board.notEmpty(x, y + k)) {
              valid = false
              break
            }
          }
          if (valid) {
            possible.push([x, y])
          }
        }
      }
    } else {
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10 - length + 1; x++) {
          valid = true
          for (let k = 0; k < length; k++) {
            if (board.notEmpty(x + k, y)) {
              valid = false
              break
            }
          }
          if (valid) {
            possible.push([x, y])
          }
        }
      }
    }
    return possible[Math.floor(Math.random()*possible.length)]
  }

  #resetMoves() {
    let possibleMoves = []
    for (let x = 0; x < 10; ++x) {
      for (let y = 0; y < 10; ++y) {
        possibleMoves.push([x, y])
      }
    }
    return possibleMoves
  }
}
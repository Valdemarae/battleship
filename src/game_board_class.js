const EMPTY = ''
const MISS = 'o'
const HIT = 'x'
const SHIP = 's'

export default class GameBoard {
  constructor() {
    this.array = this.clear()
  }

  clear() {
    return [...Array(10)].map(() => Array(10).fill(EMPTY))
  }

  placeShip(x, y, length, vertical) {
    for (let i = 0; i < length; ++i) {
      if (vertical)
        this.array[y + i][x] = SHIP
      else 
        this.array[y][x + i] = SHIP
    }
  }

  receiveAttack(x, y, ship) {
    const value = this.array[y][x]
    if (value == SHIP) {
      this.array[y][x] = HIT
      ship.hit()
    } else {
      this.array[y][x] = MISS
    }
  }

  allShipsSunk() {
    for (let i = 0; i < 10; ++i) {
      for (let j = 0; j < 10; ++j) {
        if (this.array[i][j] == SHIP)
          return true
      }
    }
    return false
  }
}
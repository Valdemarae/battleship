import GameBoard from '../src/game_board_class'
import Ship from '../src/ship_class'

let board = null
beforeAll(() => {
  board = new GameBoard()
})

describe('clear module', () => {
  test("sets every board unit to ''", () => {
    let isEmpty = true
    for (let i = 0; i < 10; i++){
      for (let j = 0; j < 10; j++){
        if (board.array[i][j] != ''){
          isEmpty = false
          break
        }
      }
    }
    expect(isEmpty).toBeTruthy()
  })
})

describe('placeShip module', () => {
  test('places a ship of length 1', () => {
    let ship = new Ship(1)
    board.placeShip(4, 4, 1, true, ship)
    expect(board.array[4][4]).toBe('s')
  })

  test('places a ship of length 3 vertically', () => {
    let ship = new Ship(3)
    board.placeShip(4, 4, 3, true, ship)
    let placed = false
    if (board.array[4][4] == 's' && board.array[5][4] == 's' && board.array[6][4] == 's')
      placed = true
    expect(placed).toBeTruthy()
  })

  test('places a ship of length 2 horizontally', () => {
    let ship = new Ship(2)
    board.placeShip(8, 7, 2, false, ship)
    let placed = false
    if (board.array[7][8] == 's' && board.array[7][9])
      placed = true
    expect(placed).toBeTruthy()
  })

  test('sets ship\'s coordinates', () => {
    let ship = new Ship(2)
    board.placeShip(8, 7, 2, false, ship)
    expect(ship.coordinates).toStrictEqual([[7, 8], [7, 9]])
  })
})

describe('receiveAttack module', () => {
  test('marks board unit as missed', () => {
    board.receiveAttack(3, 4)
    expect(board.array[4][3]).toBe('o')
  })

  test('marks board unit as hit', () => {
    board.receiveAttack(4, 4)
    expect(board.array[4][4]).toBe('x')
  })

  test('increases hit count of a ship', () => {
    let ship = new Ship(1)
    let hitCount1 = ship.hitCount
    board.placeShip(9, 9, 1, true, ship)
    board.receiveAttack(9, 9)
    let hitCount2 = ship.hitCount
    expect(hitCount2 > hitCount1).toBeTruthy()
  })
})

describe('allShipsSunk module', () => {
  beforeEach(() => {
    board = new GameBoard()
    let ship = new Ship(1)
    board.placeShip(0, 0, 1, true, ship)
  })

  test('returns false when not all sunk', () => {
    expect(board.allShipsSunk()).toBeFalsy()
  })

  test('returns true when all sunk', () => {
    board.receiveAttack(0, 0)
    expect(board.allShipsSunk()).toBeTruthy()
  })
})
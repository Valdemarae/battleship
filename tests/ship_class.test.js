import Ship from '../src/ship_class'

let ship = null
beforeAll(() => {
  ship = new Ship(4)
})

describe('hit module', () => {
  test('hit method increases hit count', () => {
    expect(ship.hitCount).toBe(0)
    ship.hit()
    expect(ship.hitCount).toBe(1)
    ship.hit()
    expect(ship.hitCount).toBe(2)
  })
})

describe('isSunk module', () => {
  test('isSunk method returns false when hitCount is less than length', () => {
    ship.hitCount = 0
    expect(ship.isSunk()).toBe(false)
  })

  test('isSunk method returns true when hitCount is the same as length', () => {
    ship.hitCount = ship.length
    expect(ship.isSunk()).toBe(true)
  })
})
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

describe('setCoordinates module', () => {
  test('sets coordinates', () => {
    ship.setCoordinates([[2, 3]])
    expect(ship.coordinates).toStrictEqual([[2, 3]])
  })
})

describe('find module', () => {
  test('finds a ship', () => {
    expect(Ship.find([2, 3])).toBe(ship)
  })

  const ship2 = new Ship(4)
  ship2.setCoordinates([[9,7], [9,8], [9,9]])
  expect(Ship.find([9, 8])).toBe(ship2)
})
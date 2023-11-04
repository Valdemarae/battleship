export default class Ship {
  constructor(length) {
    this.length = length
    this.hitCount = 0
  }

  hit() {
    this.hitCount++
  }

  isSunk() {
    if (this.length == this.hitCount)
      return true
    return false
  }

  setCoordinates(coordinates) {
    this.coordinates = coordinates
  }
}
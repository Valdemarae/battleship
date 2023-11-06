import GameBoard from './game_board_class'

export default class Player {
  constructor(name, enemyBoard) {
    this.name = name
    this.enemyBoard = enemyBoard
  }

  move(coordinates) {
    const x = coordinates[0]
    const y = coordinates[1]
    if (this.enemyBoard.validMove(x, y)) {
      this.enemyBoard.receiveAttack(x, y)
      return true
    } 
    return false
  }
}
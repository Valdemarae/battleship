import GameBoard from './game_board_class'
import Player from './player_class'
import Computer from './computer_class'
import Html from './html'

export default class Game {
  constructor() {
    this.board1 = new GameBoard()
    this.board2 = new GameBoard()

    this.player1 = new Player("Player", this.board2)
    this.player2 = new Player("Computer", this.board1)
    this.computer = new Computer()

    this.shipLengths = [5, 4, 3, 3, 2]
    this.#placeShips()
  }

  // Called from html.js when all the ships are placed
  play() {

  }
  
  #placeShips() {
    Html.dragShip(this.shipLengths, this, this.board1)
    this.computer.placeShips(this.board2, this.shipLengths)
  }
}
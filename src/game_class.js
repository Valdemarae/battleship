import GameBoard from './game_board_class'
import Player from './player_class'
import Computer from './computer_class'
import Html from './html'

export default class Game {
  constructor() {
    this.#newPlayersAndBoards()
    this.computer = new Computer()

    this.shipLengths = [5, 4, 3, 3, 2]
    this.#placeShips()
  }

  // Called from html.js when all the ships are placed
  play() {
    const computerBoard = document.querySelector('.computer_board')
    computerBoard.addEventListener('click', (e) => {
      if (e.target.classList.length > 1) {
        const y = e.target.classList[1][0]
        const x = e.target.classList[1][1]
        const yNum = Number(y)
        const xNum = Number(x)
        if (this.board2.validMove(xNum, yNum)) {
          this.#makeMoves(x, y)
        }
      }
    })
  }

  #makeMoves(x, y) {
    const playerHit = this.player1.move(x, y) // Returns true if hit
    if (!playerHit) {
      // Computer skips turn if user hits
      let hit = null
      do {
        const coordinates = this.computer.getCoordinates()
        hit = this.player2.move(coordinates[0], coordinates[1]) // True if hit
        if (hit) {
          if (this.board1.allShipsSunk()) {
            Game.over(this.player2.name)
            return
          }
        }
      } while (hit)
    } else { // if player hit
      if (this.board2.allShipsSunk()) {
        Game.over(this.player1.name)
      }
    }
  }
  
  #placeShips() {
    Html.dragShip(this.shipLengths, this, this.board1)
    this.computer.placeShips(this.board2, this.shipLengths)
  }

  static over(winnerName) {
    Html.over(winnerName)
  }

  static restart() {
    Html.repopulateBoards()
    new Game()
  }

  #newPlayersAndBoards() {
    this.board1 = new GameBoard()
    this.board2 = new GameBoard()

    this.player1 = new Player("Player", this.board2)
    this.player2 = new Player("Computer", this.board1)

    const names = document.querySelectorAll('.name')
    names[0].textContent = this.player1.name
    names[1].textContent = this.player2.name
  }
}
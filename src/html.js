import Game from "./game_class"

const EMPTY = ''
const MISS = 'o'
const HIT = 'x'
const SHIP = 's'

export default class Html {
  static populateBoards() {
    for (let i = 9; i >= 0; i--) {
      const line = document.createElement('div')
      const line2 = document.createElement('div')
      line.classList.add('line')
      line2.classList.add('line')
      for (let j = 0; j < 10; j++) {
        const square = document.createElement('div')
        const square2 = document.createElement('div')
        square.classList.add('square', i + '' + j)
        square2.classList.add('square', i + '' + j)
        line.appendChild(square)
        line2.appendChild(square2)
      }
      document.querySelector('.player_board').appendChild(line)
      document.querySelector('.computer_board').appendChild(line2)
    }
  }

  static repopulateBoards() {
    const container = document.querySelector('.container')
    container.style["pointer-events"] = "auto"
    container.removeChild(document.querySelector('.player_board'))
    container.removeChild(document.querySelector('.computer_board'))
    container.removeChild(document.querySelector('.winner'))
    const playerBoard = document.createElement('div')
    const computerBoard = document.createElement('div')
    playerBoard.classList.add('player_board')
    computerBoard.classList.add('computer_board')
    container.appendChild(playerBoard)
    container.appendChild(computerBoard)
    this.populateBoards()
  }

  static async dragShip(lengths, game, board) {
    let index = 0
    const maxIndex = lengths.length
    document.querySelector('.rotate').textContent = 'Press R to rotate'

    function buildShip() {
      length = lengths[index]
      index++

      ship = document.createElement('div')
      ship.classList.add('ship')
      ship.classList.add('vertical')
      ship.setAttribute('draggable', true)
      width = 3.5
      height = 5.7 * length
      ship.setAttribute('style', 'width: '+width+'vw; height: '+height+'vh;')
      document.querySelector('.ships').appendChild(ship)
    }
    let ship = null
    let length = null
    let width = null
    let height = null

    buildShip()
    rotateEvent()

    const playerBoard = document.querySelector(".player_board");
    
    ship.ondragstart = function(e){
      e.dataTransfer.clearData();
    }
    
    playerBoard.ondragover = function(e){
      e.preventDefault();
      if (e.target.classList[1]) {
        let y = e.target.classList[1][0]
        let x = e.target.classList[1][1]
        if (!ship.classList.contains('vertical')) {
          for (let i = 0; i < length; i++) {
            if ((document.getElementsByClassName(y+x)[0])) {
              (document.getElementsByClassName(y+x)[0]).classList.add('dragover');
            }
            x = (Number(x) + 1).toString()
          }
        } else {
          for (let i = 0; i < length; i++) {
            if (document.getElementsByClassName(y+x)[0]) {
              (document.getElementsByClassName(y+x)[0]).classList.add('dragover');
            }
            y = (Number(y) + 1).toString()
          }
        }
      }
    }
    
    playerBoard.ondragleave = function(e){
      e.preventDefault();
      if (e.target.classList[1]) {
        let y = e.target.classList[1][0]
        let x = e.target.classList[1][1]
        if (!ship.classList.contains('vertical')) {
          for (let i = 0; i < length; i++) {
            if (document.getElementsByClassName(y+x)[0]) {
              (document.getElementsByClassName(y+x)[0]).classList.remove('dragover');
            }
            x = (Number(x) + 1).toString()
          }
        } else {
          for (let i = 0; i < length; i++) {
            if (document.getElementsByClassName(y+x)[0]) {
              document.getElementsByClassName(y+x)[0].classList.remove('dragover');
            }
            y = (Number(y) + 1).toString()
          }
        }
      }
    }
    
    function rotateEvent() {
      document.addEventListener('keydown', (event) => {
        if (event.key == 'r') {
          const ship1 = document.querySelector('.ship')
          if (ship1) {
            if (ship1.classList.contains('vertical')) {
              width = 3.5 * length
              height = 5.7
              ship1.classList.remove('vertical')
            } else {
              width = 3.5
              height = 5.7 * length
              ship1.classList.add('vertical')
            }
            ship1.setAttribute('style', 'width: '+width+'vw; height: '+height+'vh;');
          }
        }
      }, false);
    }

    playerBoard.ondrop = function(e){
      e.preventDefault();
      const data = e.dataTransfer.getData("text");
      const element = document.querySelector('.ship')
      const ships = document.querySelector('.ships')
      if (validDrop(element, e.target, length)) {
        let y = e.target.classList[1][0]
        let x = e.target.classList[1][1]
        board.placeShip(Number(x), Number(y), length, ship.classList.contains('vertical'))
        ships.removeChild(element);
        if (!ship.classList.contains('vertical')) {
          for (let i = 0; i < length; i++) {
            (document.getElementsByClassName(y+x)[0]).classList.remove('dragover');
            (document.getElementsByClassName(y+x)[0]).classList.add('placed');
            x = (Number(x) + 1).toString()
          }
        } else {
          for (let i = 0; i < length; i++) {
            (document.getElementsByClassName(y+x)[0]).classList.remove('dragover');
            (document.getElementsByClassName(y+x)[0]).classList.add('placed');
            y = (Number(y) + 1).toString()
          }
        }
        if (index != maxIndex) {
          buildShip()
        } else {
          document.querySelector('.rotate').textContent = ''
          game.play()
        }
      } else {
        let y = e.target.classList[1][0]
        let x = e.target.classList[1][1]
        ships.appendChild(element)
        if (!ship.classList.contains('vertical')) {
          for (let i = 0; i < length; i++) {
            if (document.getElementsByClassName(y+x)[0]) {
              (document.getElementsByClassName(y+x)[0]).classList.remove('dragover');
            }
            x = (Number(x) + 1).toString()
          }
        } else {
          for (let i = 0; i < length; i++) {
            if (document.getElementsByClassName(y+x)[0]) {
              (document.getElementsByClassName(y+x)[0]).classList.remove('dragover');
            }
            y = (Number(y) + 1).toString()
          }
        }
      }
    }
    
    function validDrop(element, pelement, length) {
      let x = Number(pelement.classList[1][1])
      let y = Number(pelement.classList[1][0])
      for (let i = 0; i < length; i++) {
        if (element.classList.contains('vertical')) {
          if (y > 9 || document.getElementsByClassName('' + y + x)[0].classList.contains('placed')) {
            return false
          }
          y += 1
        } else {
          if (x > 9 || document.getElementsByClassName('' + y + x)[0].classList.contains('placed')) {
            return false
          }
          x += 1
        }
      }
      return true
    }
  }

  static hit(className, board) {
    const node = findNode(className, board)
    node.classList.add('hit')
  }

  static miss(className, board) {
    const node = findNode(className, board)
    node.classList.add('miss')
  }

  static over(winnerName) {
    const container = document.querySelector('.container')
    container.style["pointer-events"] = "none"
    const div = document.createElement('div')
    div.classList.add('winner')
    const h1 = document.createElement('h1')
    const restart = document.createElement('div')
    h1.textContent = winnerName + ' is the winner!'
    restart.textContent = 'Restart'
    restart.classList.add('restart')
    restart.style["pointer-events"] = "auto"
    div.appendChild(h1)
    div.appendChild(restart)
    container.appendChild(div)
    restart.addEventListener('click', () => {
      Game.restart()
    })
  }
}

function findNode(className, board) {
  for (let i = 0; i < board.childNodes.length; i++) {
    for (let j = 0; j < board.childNodes[i].childNodes.length; j++) {
      if (board.childNodes[i].childNodes[j].classList.contains(className)) {
        return board.childNodes[i].childNodes[j]
      }
    }
  }
}
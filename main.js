/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/computer_class.js":
/*!*******************************!*\
  !*** ./src/computer_class.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Computer)
/* harmony export */ });
class Computer {
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

/***/ }),

/***/ "./src/game_board_class.js":
/*!*********************************!*\
  !*** ./src/game_board_class.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameBoard)
/* harmony export */ });
/* harmony import */ var _ship_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship_class */ "./src/ship_class.js");
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./html */ "./src/html.js");



const EMPTY = ''
const MISS = 'o'
const HIT = 'x'
const SHIP = 's'

class GameBoard {
  constructor() {
    this.array = this.#clear()
  }

  #clear() {
    return [...Array(10)].map(() => Array(10).fill(EMPTY))
  }

  placeShip(x, y, length, vertical) {
    const ship = new _ship_class__WEBPACK_IMPORTED_MODULE_0__["default"](length)
    let coordinates = []
    for (let i = 0; i < length; ++i) {
      if (vertical){
        this.array[y + i][x] = SHIP
        coordinates.push([y + i, x])
      }
      else {
        this.array[y][x + i] = SHIP
        coordinates.push([y, x + i])
      }
    }
    ship.setCoordinates(coordinates)
  }

  receiveAttack(x, y, board) {
    let hit = false
    const value = this.array[y][x]
    if (value == SHIP) {
      this.array[y][x] = HIT
      _html__WEBPACK_IMPORTED_MODULE_1__["default"].hit(''+y + x, board)
      _ship_class__WEBPACK_IMPORTED_MODULE_0__["default"].find([y, x]).hit()
      hit = true
    } else {
      this.array[y][x] = MISS
      _html__WEBPACK_IMPORTED_MODULE_1__["default"].miss(''+y + x, board)
    }
    return hit
  }

  allShipsSunk() {
    for (let i = 0; i < 10; ++i) {
      for (let j = 0; j < 10; ++j) {
        if (this.array[i][j] == SHIP)
          return false
      }
    }
    return true
  }

  validMove(x, y) {
    const position = this.array[y][x]
    return (position == EMPTY || position == SHIP)
  }

  notEmpty(x, y) {
    return this.array[y][x] != EMPTY
  }
}

/***/ }),

/***/ "./src/game_class.js":
/*!***************************!*\
  !*** ./src/game_class.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var _game_board_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game_board_class */ "./src/game_board_class.js");
/* harmony import */ var _player_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player_class */ "./src/player_class.js");
/* harmony import */ var _computer_class__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computer_class */ "./src/computer_class.js");
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./html */ "./src/html.js");





class Game {
  constructor() {
    this.#newPlayersAndBoards()
    this.computer = new _computer_class__WEBPACK_IMPORTED_MODULE_2__["default"]()

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
    _html__WEBPACK_IMPORTED_MODULE_3__["default"].dragShip(this.shipLengths, this, this.board1)
    this.computer.placeShips(this.board2, this.shipLengths)
  }

  static over(winnerName) {
    _html__WEBPACK_IMPORTED_MODULE_3__["default"].over(winnerName)
  }

  static restart() {
    _html__WEBPACK_IMPORTED_MODULE_3__["default"].repopulateBoards()
    new Game()
  }

  #newPlayersAndBoards() {
    this.board1 = new _game_board_class__WEBPACK_IMPORTED_MODULE_0__["default"]()
    this.board2 = new _game_board_class__WEBPACK_IMPORTED_MODULE_0__["default"]()

    this.player1 = new _player_class__WEBPACK_IMPORTED_MODULE_1__["default"]("Player", this.board2)
    this.player2 = new _player_class__WEBPACK_IMPORTED_MODULE_1__["default"]("Computer", this.board1)

    const names = document.querySelectorAll('.name')
    names[0].textContent = this.player1.name
    names[1].textContent = this.player2.name
  }
}

/***/ }),

/***/ "./src/html.js":
/*!*********************!*\
  !*** ./src/html.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Html)
/* harmony export */ });
/* harmony import */ var _game_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game_class */ "./src/game_class.js");


let rotateCalled = false
let length = null

class Html {
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
    let width = null
    let height = null

    buildShip()
    if (!rotateCalled) {
      rotateEvent()
    }

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
      rotateCalled = true
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
      _game_class__WEBPACK_IMPORTED_MODULE_0__["default"].restart()
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

/***/ }),

/***/ "./src/player_class.js":
/*!*****************************!*\
  !*** ./src/player_class.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _game_board_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game_board_class */ "./src/game_board_class.js");


class Player {
  constructor(name, enemyBoard) {
    this.name = name
    this.enemyBoard = enemyBoard
  }

  move(x, y) {
    let board = null
    if (this.name == 'Player') {
      board = document.querySelector('.computer_board')
    } else {
      board = document.querySelector('.player_board')
    }
    return this.enemyBoard.receiveAttack(x, y, board)
  }
}

/***/ }),

/***/ "./src/ship_class.js":
/*!***************************!*\
  !*** ./src/ship_class.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
let ships = []

class Ship {
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
    ships.push(this)
  }

  static find(coordinates) {
    for (let i = 0; i < ships.length; i++){
      const ship = ships[i]
      for (let j = 0; j < ship.coordinates.length; j++){
        const coordinates2 = ship.coordinates[j]
        if (coordinates2[0] == coordinates[0] && coordinates2[1] == coordinates[1])
          return ship
      }
    }
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game_class */ "./src/game_class.js");
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./html */ "./src/html.js");



_html__WEBPACK_IMPORTED_MODULE_1__["default"].populateBoards()
new _game_class__WEBPACK_IMPORTED_MODULE_0__["default"]()
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0EsMEJBQTBCLFlBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDViwwQkFBMEIsWUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLDBCQUEwQixZQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELHFCQUFxQjtBQUNsRjtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDViwwQkFBMEIsWUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLDBCQUEwQixZQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixZQUFZO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sbURBQUk7QUFDVixLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQiw2QkFBNkI7QUFDL0Msb0JBQW9CLDJDQUEyQztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3pQMEM7O0FBRTNCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNqQkE7O0FBRWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLGtCQUFrQjtBQUN0QztBQUNBLHNCQUFzQiw2QkFBNkI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztVQ2pDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ04rQjtBQUNOOztBQUV6Qiw2Q0FBSTtBQUNKLElBQUksbURBQUksRSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY29tcHV0ZXJfY2xhc3MuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lX2JvYXJkX2NsYXNzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZV9jbGFzcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2h0bWwuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXJfY2xhc3MuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwX2NsYXNzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXB1dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wb3NzaWJsZU1vdmVzID0gdGhpcy4jcmVzZXRNb3ZlcygpXG4gIH1cblxuICBnZXRDb29yZGluYXRlcygpIHtcbiAgICByZXR1cm4gdGhpcy5wb3NzaWJsZU1vdmVzLnNwbGljZSgoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5wb3NzaWJsZU1vdmVzLmxlbmd0aCkpLCAxKVswXVxuICB9XG5cbiAgcGxhY2VTaGlwcyhib2FyZCwgc2hpcExlbmd0aHMpIHtcbiAgICBzaGlwTGVuZ3Rocy5mb3JFYWNoKChsZW5ndGgpID0+IHtcbiAgICAgIGNvbnN0IHZlcnRpY2FsID0gTWF0aC5yYW5kb20oKSA+IDAuNSA/IHRydWUgOiBmYWxzZVxuICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0aGlzLiNnZXRQbGFjZW1lbnRDb29yZGluYXRlcyhib2FyZCwgdmVydGljYWwsIGxlbmd0aClcbiAgICAgIGJvYXJkLnBsYWNlU2hpcChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0sIGxlbmd0aCwgdmVydGljYWwpXG4gICAgfSlcbiAgfVxuXG4gICNnZXRQbGFjZW1lbnRDb29yZGluYXRlcyhib2FyZCwgdmVydGljYWwsIGxlbmd0aCkge1xuICAgIGxldCBwb3NzaWJsZSA9IFtdXG4gICAgbGV0IHZhbGlkID0gbnVsbFxuICAgIGlmICh2ZXJ0aWNhbCkge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDsgeCsrKSB7XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTAgLSBsZW5ndGggKyAxOyB5KyspIHtcbiAgICAgICAgICB2YWxpZCA9IHRydWVcbiAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBpZiAoYm9hcmQubm90RW1wdHkoeCwgeSArIGspKSB7XG4gICAgICAgICAgICAgIHZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgICAgICBwb3NzaWJsZS5wdXNoKFt4LCB5XSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMDsgeSsrKSB7XG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTAgLSBsZW5ndGggKyAxOyB4KyspIHtcbiAgICAgICAgICB2YWxpZCA9IHRydWVcbiAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBpZiAoYm9hcmQubm90RW1wdHkoeCArIGssIHkpKSB7XG4gICAgICAgICAgICAgIHZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgICAgICBwb3NzaWJsZS5wdXNoKFt4LCB5XSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBvc3NpYmxlW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpwb3NzaWJsZS5sZW5ndGgpXVxuICB9XG5cbiAgI3Jlc2V0TW92ZXMoKSB7XG4gICAgbGV0IHBvc3NpYmxlTW92ZXMgPSBbXVxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTA7ICsreCkge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMDsgKyt5KSB7XG4gICAgICAgIHBvc3NpYmxlTW92ZXMucHVzaChbeCwgeV0pXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwb3NzaWJsZU1vdmVzXG4gIH1cbn0iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXBfY2xhc3MnXG5pbXBvcnQgSHRtbCBmcm9tICcuL2h0bWwnXG5cbmNvbnN0IEVNUFRZID0gJydcbmNvbnN0IE1JU1MgPSAnbydcbmNvbnN0IEhJVCA9ICd4J1xuY29uc3QgU0hJUCA9ICdzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFycmF5ID0gdGhpcy4jY2xlYXIoKVxuICB9XG5cbiAgI2NsZWFyKCkge1xuICAgIHJldHVybiBbLi4uQXJyYXkoMTApXS5tYXAoKCkgPT4gQXJyYXkoMTApLmZpbGwoRU1QVFkpKVxuICB9XG5cbiAgcGxhY2VTaGlwKHgsIHksIGxlbmd0aCwgdmVydGljYWwpIHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAobGVuZ3RoKVxuICAgIGxldCBjb29yZGluYXRlcyA9IFtdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKHZlcnRpY2FsKXtcbiAgICAgICAgdGhpcy5hcnJheVt5ICsgaV1beF0gPSBTSElQXG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW3kgKyBpLCB4XSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmFycmF5W3ldW3ggKyBpXSA9IFNISVBcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbeSwgeCArIGldKVxuICAgICAgfVxuICAgIH1cbiAgICBzaGlwLnNldENvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKVxuICB9XG5cbiAgcmVjZWl2ZUF0dGFjayh4LCB5LCBib2FyZCkge1xuICAgIGxldCBoaXQgPSBmYWxzZVxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5hcnJheVt5XVt4XVxuICAgIGlmICh2YWx1ZSA9PSBTSElQKSB7XG4gICAgICB0aGlzLmFycmF5W3ldW3hdID0gSElUXG4gICAgICBIdG1sLmhpdCgnJyt5ICsgeCwgYm9hcmQpXG4gICAgICBTaGlwLmZpbmQoW3ksIHhdKS5oaXQoKVxuICAgICAgaGl0ID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFycmF5W3ldW3hdID0gTUlTU1xuICAgICAgSHRtbC5taXNzKCcnK3kgKyB4LCBib2FyZClcbiAgICB9XG4gICAgcmV0dXJuIGhpdFxuICB9XG5cbiAgYWxsU2hpcHNTdW5rKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7ICsraSkge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgKytqKSB7XG4gICAgICAgIGlmICh0aGlzLmFycmF5W2ldW2pdID09IFNISVApXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB2YWxpZE1vdmUoeCwgeSkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5hcnJheVt5XVt4XVxuICAgIHJldHVybiAocG9zaXRpb24gPT0gRU1QVFkgfHwgcG9zaXRpb24gPT0gU0hJUClcbiAgfVxuXG4gIG5vdEVtcHR5KHgsIHkpIHtcbiAgICByZXR1cm4gdGhpcy5hcnJheVt5XVt4XSAhPSBFTVBUWVxuICB9XG59IiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tICcuL2dhbWVfYm9hcmRfY2xhc3MnXG5pbXBvcnQgUGxheWVyIGZyb20gJy4vcGxheWVyX2NsYXNzJ1xuaW1wb3J0IENvbXB1dGVyIGZyb20gJy4vY29tcHV0ZXJfY2xhc3MnXG5pbXBvcnQgSHRtbCBmcm9tICcuL2h0bWwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLiNuZXdQbGF5ZXJzQW5kQm9hcmRzKClcbiAgICB0aGlzLmNvbXB1dGVyID0gbmV3IENvbXB1dGVyKClcblxuICAgIHRoaXMuc2hpcExlbmd0aHMgPSBbNSwgNCwgMywgMywgMl1cbiAgICB0aGlzLiNwbGFjZVNoaXBzKClcbiAgfVxuXG4gIC8vIENhbGxlZCBmcm9tIGh0bWwuanMgd2hlbiBhbGwgdGhlIHNoaXBzIGFyZSBwbGFjZWRcbiAgcGxheSgpIHtcbiAgICBjb25zdCBjb21wdXRlckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbXB1dGVyX2JvYXJkJylcbiAgICBjb21wdXRlckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCB5ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzBdXG4gICAgICAgIGNvbnN0IHggPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMV1cbiAgICAgICAgY29uc3QgeU51bSA9IE51bWJlcih5KVxuICAgICAgICBjb25zdCB4TnVtID0gTnVtYmVyKHgpXG4gICAgICAgIGlmICh0aGlzLmJvYXJkMi52YWxpZE1vdmUoeE51bSwgeU51bSkpIHtcbiAgICAgICAgICB0aGlzLiNtYWtlTW92ZXMoeCwgeSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAjbWFrZU1vdmVzKHgsIHkpIHtcbiAgICBjb25zdCBwbGF5ZXJIaXQgPSB0aGlzLnBsYXllcjEubW92ZSh4LCB5KSAvLyBSZXR1cm5zIHRydWUgaWYgaGl0XG4gICAgaWYgKCFwbGF5ZXJIaXQpIHtcbiAgICAgIC8vIENvbXB1dGVyIHNraXBzIHR1cm4gaWYgdXNlciBoaXRzXG4gICAgICBsZXQgaGl0ID0gbnVsbFxuICAgICAgZG8ge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlcyA9IHRoaXMuY29tcHV0ZXIuZ2V0Q29vcmRpbmF0ZXMoKVxuICAgICAgICBoaXQgPSB0aGlzLnBsYXllcjIubW92ZShjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pIC8vIFRydWUgaWYgaGl0XG4gICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICBpZiAodGhpcy5ib2FyZDEuYWxsU2hpcHNTdW5rKCkpIHtcbiAgICAgICAgICAgIEdhbWUub3Zlcih0aGlzLnBsYXllcjIubmFtZSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSB3aGlsZSAoaGl0KVxuICAgIH0gZWxzZSB7IC8vIGlmIHBsYXllciBoaXRcbiAgICAgIGlmICh0aGlzLmJvYXJkMi5hbGxTaGlwc1N1bmsoKSkge1xuICAgICAgICBHYW1lLm92ZXIodGhpcy5wbGF5ZXIxLm5hbWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICAjcGxhY2VTaGlwcygpIHtcbiAgICBIdG1sLmRyYWdTaGlwKHRoaXMuc2hpcExlbmd0aHMsIHRoaXMsIHRoaXMuYm9hcmQxKVxuICAgIHRoaXMuY29tcHV0ZXIucGxhY2VTaGlwcyh0aGlzLmJvYXJkMiwgdGhpcy5zaGlwTGVuZ3RocylcbiAgfVxuXG4gIHN0YXRpYyBvdmVyKHdpbm5lck5hbWUpIHtcbiAgICBIdG1sLm92ZXIod2lubmVyTmFtZSlcbiAgfVxuXG4gIHN0YXRpYyByZXN0YXJ0KCkge1xuICAgIEh0bWwucmVwb3B1bGF0ZUJvYXJkcygpXG4gICAgbmV3IEdhbWUoKVxuICB9XG5cbiAgI25ld1BsYXllcnNBbmRCb2FyZHMoKSB7XG4gICAgdGhpcy5ib2FyZDEgPSBuZXcgR2FtZUJvYXJkKClcbiAgICB0aGlzLmJvYXJkMiA9IG5ldyBHYW1lQm9hcmQoKVxuXG4gICAgdGhpcy5wbGF5ZXIxID0gbmV3IFBsYXllcihcIlBsYXllclwiLCB0aGlzLmJvYXJkMilcbiAgICB0aGlzLnBsYXllcjIgPSBuZXcgUGxheWVyKFwiQ29tcHV0ZXJcIiwgdGhpcy5ib2FyZDEpXG5cbiAgICBjb25zdCBuYW1lcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYW1lJylcbiAgICBuYW1lc1swXS50ZXh0Q29udGVudCA9IHRoaXMucGxheWVyMS5uYW1lXG4gICAgbmFtZXNbMV0udGV4dENvbnRlbnQgPSB0aGlzLnBsYXllcjIubmFtZVxuICB9XG59IiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vZ2FtZV9jbGFzc1wiXG5cbmxldCByb3RhdGVDYWxsZWQgPSBmYWxzZVxubGV0IGxlbmd0aCA9IG51bGxcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHRtbCB7XG4gIHN0YXRpYyBwb3B1bGF0ZUJvYXJkcygpIHtcbiAgICBmb3IgKGxldCBpID0gOTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgY29uc3QgbGluZTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgbGluZS5jbGFzc0xpc3QuYWRkKCdsaW5lJylcbiAgICAgIGxpbmUyLmNsYXNzTGlzdC5hZGQoJ2xpbmUnKVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGNvbnN0IHNxdWFyZTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnc3F1YXJlJywgaSArICcnICsgailcbiAgICAgICAgc3F1YXJlMi5jbGFzc0xpc3QuYWRkKCdzcXVhcmUnLCBpICsgJycgKyBqKVxuICAgICAgICBsaW5lLmFwcGVuZENoaWxkKHNxdWFyZSlcbiAgICAgICAgbGluZTIuYXBwZW5kQ2hpbGQoc3F1YXJlMilcbiAgICAgIH1cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXJfYm9hcmQnKS5hcHBlbmRDaGlsZChsaW5lKVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbXB1dGVyX2JvYXJkJykuYXBwZW5kQ2hpbGQobGluZTIpXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHJlcG9wdWxhdGVCb2FyZHMoKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lcicpXG4gICAgY29udGFpbmVyLnN0eWxlW1wicG9pbnRlci1ldmVudHNcIl0gPSBcImF1dG9cIlxuICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyX2JvYXJkJykpXG4gICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21wdXRlcl9ib2FyZCcpKVxuICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2lubmVyJykpXG4gICAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHBsYXllckJvYXJkLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9ib2FyZCcpXG4gICAgY29tcHV0ZXJCb2FyZC5jbGFzc0xpc3QuYWRkKCdjb21wdXRlcl9ib2FyZCcpXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllckJvYXJkKVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb21wdXRlckJvYXJkKVxuICAgIHRoaXMucG9wdWxhdGVCb2FyZHMoKVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGRyYWdTaGlwKGxlbmd0aHMsIGdhbWUsIGJvYXJkKSB7XG4gICAgbGV0IGluZGV4ID0gMFxuICAgIGNvbnN0IG1heEluZGV4ID0gbGVuZ3Rocy5sZW5ndGhcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucm90YXRlJykudGV4dENvbnRlbnQgPSAnUHJlc3MgUiB0byByb3RhdGUnXG5cbiAgICBmdW5jdGlvbiBidWlsZFNoaXAoKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGhzW2luZGV4XVxuICAgICAgaW5kZXgrK1xuXG4gICAgICBzaGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZCgnc2hpcCcpXG4gICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsJylcbiAgICAgIHNoaXAuc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCB0cnVlKVxuICAgICAgd2lkdGggPSAzLjVcbiAgICAgIGhlaWdodCA9IDUuNyAqIGxlbmd0aFxuICAgICAgc2hpcC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAnK3dpZHRoKyd2dzsgaGVpZ2h0OiAnK2hlaWdodCsndmg7JylcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcycpLmFwcGVuZENoaWxkKHNoaXApXG4gICAgfVxuICAgIGxldCBzaGlwID0gbnVsbFxuICAgIGxldCB3aWR0aCA9IG51bGxcbiAgICBsZXQgaGVpZ2h0ID0gbnVsbFxuXG4gICAgYnVpbGRTaGlwKClcbiAgICBpZiAoIXJvdGF0ZUNhbGxlZCkge1xuICAgICAgcm90YXRlRXZlbnQoKVxuICAgIH1cblxuICAgIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXJfYm9hcmRcIik7XG4gICAgXG4gICAgc2hpcC5vbmRyYWdzdGFydCA9IGZ1bmN0aW9uKGUpe1xuICAgICAgZS5kYXRhVHJhbnNmZXIuY2xlYXJEYXRhKCk7XG4gICAgfVxuICAgIFxuICAgIHBsYXllckJvYXJkLm9uZHJhZ292ZXIgPSBmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3RbMV0pIHtcbiAgICAgICAgbGV0IHkgPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMF1cbiAgICAgICAgbGV0IHggPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMV1cbiAgICAgICAgaWYgKCFzaGlwLmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSkge1xuICAgICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QuYWRkKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeCA9IChOdW1iZXIoeCkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pIHtcbiAgICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LmFkZCgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHkgPSAoTnVtYmVyKHkpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwbGF5ZXJCb2FyZC5vbmRyYWdsZWF2ZSA9IGZ1bmN0aW9uKGUpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdFsxXSkge1xuICAgICAgICBsZXQgeSA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVswXVxuICAgICAgICBsZXQgeCA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVsxXVxuICAgICAgICBpZiAoIXNoaXAuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbCcpKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkge1xuICAgICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeCA9IChOdW1iZXIoeCkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pIHtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5ID0gKE51bWJlcih5KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gcm90YXRlRXZlbnQoKSB7XG4gICAgICByb3RhdGVDYWxsZWQgPSB0cnVlXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChldmVudC5rZXkgPT0gJ3InKSB7XG4gICAgICAgICAgY29uc3Qgc2hpcDEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcCcpXG4gICAgICAgICAgaWYgKHNoaXAxKSB7XG4gICAgICAgICAgICBpZiAoc2hpcDEuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbCcpKSB7XG4gICAgICAgICAgICAgIHdpZHRoID0gMy41ICogbGVuZ3RoXG4gICAgICAgICAgICAgIGhlaWdodCA9IDUuN1xuICAgICAgICAgICAgICBzaGlwMS5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbCcpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB3aWR0aCA9IDMuNVxuICAgICAgICAgICAgICBoZWlnaHQgPSA1LjcgKiBsZW5ndGhcbiAgICAgICAgICAgICAgc2hpcDEuY2xhc3NMaXN0LmFkZCgndmVydGljYWwnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hpcDEuc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogJyt3aWR0aCsndnc7IGhlaWdodDogJytoZWlnaHQrJ3ZoOycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIHBsYXllckJvYXJkLm9uZHJvcCA9IGZ1bmN0aW9uKGUpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgZGF0YSA9IGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ0ZXh0XCIpO1xuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwJylcbiAgICAgIGNvbnN0IHNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzJylcbiAgICAgIGlmICh2YWxpZERyb3AoZWxlbWVudCwgZS50YXJnZXQsIGxlbmd0aCkpIHtcbiAgICAgICAgbGV0IHkgPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMF1cbiAgICAgICAgbGV0IHggPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMV1cbiAgICAgICAgYm9hcmQucGxhY2VTaGlwKE51bWJlcih4KSwgTnVtYmVyKHkpLCBsZW5ndGgsIHNoaXAuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbCcpKVxuICAgICAgICBzaGlwcy5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICAgICAgaWYgKCFzaGlwLmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QuYWRkKCdwbGFjZWQnKTtcbiAgICAgICAgICAgIHggPSAoTnVtYmVyKHgpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LmFkZCgncGxhY2VkJyk7XG4gICAgICAgICAgICB5ID0gKE51bWJlcih5KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4ICE9IG1heEluZGV4KSB7XG4gICAgICAgICAgYnVpbGRTaGlwKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucm90YXRlJykudGV4dENvbnRlbnQgPSAnJ1xuICAgICAgICAgIGdhbWUucGxheSgpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB5ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzBdXG4gICAgICAgIGxldCB4ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzFdXG4gICAgICAgIHNoaXBzLmFwcGVuZENoaWxkKGVsZW1lbnQpXG4gICAgICAgIGlmICghc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSB7XG4gICAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB4ID0gKE51bWJlcih4KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkge1xuICAgICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeSA9IChOdW1iZXIoeSkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHZhbGlkRHJvcChlbGVtZW50LCBwZWxlbWVudCwgbGVuZ3RoKSB7XG4gICAgICBsZXQgeCA9IE51bWJlcihwZWxlbWVudC5jbGFzc0xpc3RbMV1bMV0pXG4gICAgICBsZXQgeSA9IE51bWJlcihwZWxlbWVudC5jbGFzc0xpc3RbMV1bMF0pXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSkge1xuICAgICAgICAgIGlmICh5ID4gOSB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCcnICsgeSArIHgpWzBdLmNsYXNzTGlzdC5jb250YWlucygncGxhY2VkJykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICB5ICs9IDFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoeCA+IDkgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnJyArIHkgKyB4KVswXS5jbGFzc0xpc3QuY29udGFpbnMoJ3BsYWNlZCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgeCArPSAxXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGhpdChjbGFzc05hbWUsIGJvYXJkKSB7XG4gICAgY29uc3Qgbm9kZSA9IGZpbmROb2RlKGNsYXNzTmFtZSwgYm9hcmQpXG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKCdoaXQnKVxuICB9XG5cbiAgc3RhdGljIG1pc3MoY2xhc3NOYW1lLCBib2FyZCkge1xuICAgIGNvbnN0IG5vZGUgPSBmaW5kTm9kZShjbGFzc05hbWUsIGJvYXJkKVxuICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgnbWlzcycpXG4gIH1cblxuICBzdGF0aWMgb3Zlcih3aW5uZXJOYW1lKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lcicpXG4gICAgY29udGFpbmVyLnN0eWxlW1wicG9pbnRlci1ldmVudHNcIl0gPSBcIm5vbmVcIlxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ3dpbm5lcicpXG4gICAgY29uc3QgaDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpXG4gICAgY29uc3QgcmVzdGFydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgaDEudGV4dENvbnRlbnQgPSB3aW5uZXJOYW1lICsgJyBpcyB0aGUgd2lubmVyISdcbiAgICByZXN0YXJ0LnRleHRDb250ZW50ID0gJ1Jlc3RhcnQnXG4gICAgcmVzdGFydC5jbGFzc0xpc3QuYWRkKCdyZXN0YXJ0JylcbiAgICByZXN0YXJ0LnN0eWxlW1wicG9pbnRlci1ldmVudHNcIl0gPSBcImF1dG9cIlxuICAgIGRpdi5hcHBlbmRDaGlsZChoMSlcbiAgICBkaXYuYXBwZW5kQ2hpbGQocmVzdGFydClcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KVxuICAgIHJlc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBHYW1lLnJlc3RhcnQoKVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZE5vZGUoY2xhc3NOYW1lLCBib2FyZCkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkLmNoaWxkTm9kZXNbaV0uY2hpbGROb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKGJvYXJkLmNoaWxkTm9kZXNbaV0uY2hpbGROb2Rlc1tqXS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xuICAgICAgICByZXR1cm4gYm9hcmQuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzW2pdXG4gICAgICB9XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tICcuL2dhbWVfYm9hcmRfY2xhc3MnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGVuZW15Qm9hcmQpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdGhpcy5lbmVteUJvYXJkID0gZW5lbXlCb2FyZFxuICB9XG5cbiAgbW92ZSh4LCB5KSB7XG4gICAgbGV0IGJvYXJkID0gbnVsbFxuICAgIGlmICh0aGlzLm5hbWUgPT0gJ1BsYXllcicpIHtcbiAgICAgIGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbXB1dGVyX2JvYXJkJylcbiAgICB9IGVsc2Uge1xuICAgICAgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyX2JvYXJkJylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKHgsIHksIGJvYXJkKVxuICB9XG59IiwibGV0IHNoaXBzID0gW11cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKGxlbmd0aCkge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoXG4gICAgdGhpcy5oaXRDb3VudCA9IDBcbiAgfVxuICBcbiAgaGl0KCkge1xuICAgIHRoaXMuaGl0Q291bnQrK1xuICB9XG4gIFxuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMubGVuZ3RoID09IHRoaXMuaGl0Q291bnQpXG4gICAgcmV0dXJuIHRydWVcbiAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBzZXRDb29yZGluYXRlcyhjb29yZGluYXRlcykge1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlc1xuICAgIHNoaXBzLnB1c2godGhpcylcbiAgfVxuXG4gIHN0YXRpYyBmaW5kKGNvb3JkaW5hdGVzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwcy5sZW5ndGg7IGkrKyl7XG4gICAgICBjb25zdCBzaGlwID0gc2hpcHNbaV1cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2hpcC5jb29yZGluYXRlcy5sZW5ndGg7IGorKyl7XG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGVzMiA9IHNoaXAuY29vcmRpbmF0ZXNbal1cbiAgICAgICAgaWYgKGNvb3JkaW5hdGVzMlswXSA9PSBjb29yZGluYXRlc1swXSAmJiBjb29yZGluYXRlczJbMV0gPT0gY29vcmRpbmF0ZXNbMV0pXG4gICAgICAgICAgcmV0dXJuIHNoaXBcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZV9jbGFzcydcbmltcG9ydCBIdG1sIGZyb20gJy4vaHRtbCdcblxuSHRtbC5wb3B1bGF0ZUJvYXJkcygpXG5uZXcgR2FtZSgpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
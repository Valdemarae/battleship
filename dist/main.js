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
    let x = null
    let y = null
    let valid = true
    do {
      if (vertical) {
        x = Math.floor(Math.random()*10)
        do {
          y = Math.floor(Math.random()*10) - length + 1
        } while(y < 0)
        for (let i = 0; i < length; i++) {
          if (board.notEmpty(x, y + i)) {
            valid = false
          }
        }
      } else {
        y = Math.floor(Math.random()*10)
        do {
          x = Math.floor(Math.random()*10) - length + 1
        } while (x < 0)
        for (let i = 0; i < length; i++) {
          if (board.notEmpty(x + i, y)) {
            valid = false
          }
        }
      }
      if (valid) {
        return [x, y]
      }
    } while(true)
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

    this.shipLengths = [5]
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
    console.log(this.board2)
  }

  static over(winnerName) {
    _html__WEBPACK_IMPORTED_MODULE_3__["default"].over(winnerName)
  }

  static restart() {
    _html__WEBPACK_IMPORTED_MODULE_3__["default"].repopulateBoards()
    document.querySelector('.container')
    new Game()
  }

  #newPlayersAndBoards() {
    this.board1 = new _game_board_class__WEBPACK_IMPORTED_MODULE_0__["default"]()
    this.board2 = new _game_board_class__WEBPACK_IMPORTED_MODULE_0__["default"]()

    this.player1 = new _player_class__WEBPACK_IMPORTED_MODULE_1__["default"]("Player", this.board2)
    this.player2 = new _player_class__WEBPACK_IMPORTED_MODULE_1__["default"]("Computer", this.board1)
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


const EMPTY = ''
const MISS = 'o'
const HIT = 'x'
const SHIP = 's'

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

    function buildShip() {
      length = lengths[index]
      index++

      ship = document.createElement('div')
      ship.classList.add('ship')
      ship.classList.add('vertical')
      ship.setAttribute('draggable', true)
      width = 4
      height = 6.7 * length
      ship.setAttribute('style', 'width: '+width+'vw; height: '+height+'vh;')
      document.querySelector('.ships').appendChild(ship)
    }
    let ship = null
    let length = null
    let width = null
    let height = null

    buildShip()

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
    
    document.addEventListener('keydown', (event) => {
      if (event.key == 'r') {
        const ship1 = document.querySelector('.ship')
        if (ship1) {
          if (ship1.classList.contains('vertical')) {
            width = 4 * length
            height = 6.7
            ship1.classList.remove('vertical')
          } else {
            width = 4
            height = 6.7 * length
            ship1.classList.add('vertical')
          }
          ship1.setAttribute('style', 'width: '+width+'vw; height: '+height+'vh;');
        }
      }
    }, false);
    
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLFlBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDViwwQkFBMEIsWUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELHFCQUFxQjtBQUNoRjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixZQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLDBCQUEwQixZQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLDBCQUEwQixZQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixZQUFZO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sbURBQUk7QUFDVixLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQiw2QkFBNkI7QUFDL0Msb0JBQW9CLDJDQUEyQztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3BQMEM7O0FBRTNCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNqQkE7O0FBRWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLGtCQUFrQjtBQUN0QztBQUNBLHNCQUFzQiw2QkFBNkI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztVQ2pDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ04rQjtBQUNOOztBQUV6Qiw2Q0FBSTtBQUNKLElBQUksbURBQUksRSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY29tcHV0ZXJfY2xhc3MuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lX2JvYXJkX2NsYXNzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZV9jbGFzcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2h0bWwuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXJfY2xhc3MuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwX2NsYXNzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXB1dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wb3NzaWJsZU1vdmVzID0gdGhpcy4jcmVzZXRNb3ZlcygpXG4gIH1cblxuICBnZXRDb29yZGluYXRlcygpIHtcbiAgICByZXR1cm4gdGhpcy5wb3NzaWJsZU1vdmVzLnNwbGljZSgoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5wb3NzaWJsZU1vdmVzLmxlbmd0aCkpLCAxKVswXVxuICB9XG5cbiAgcGxhY2VTaGlwcyhib2FyZCwgc2hpcExlbmd0aHMpIHtcbiAgICBzaGlwTGVuZ3Rocy5mb3JFYWNoKChsZW5ndGgpID0+IHtcbiAgICAgIGNvbnN0IHZlcnRpY2FsID0gTWF0aC5yYW5kb20oKSA+IDAuNSA/IHRydWUgOiBmYWxzZVxuICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0aGlzLiNnZXRQbGFjZW1lbnRDb29yZGluYXRlcyhib2FyZCwgdmVydGljYWwsIGxlbmd0aClcbiAgICAgIGJvYXJkLnBsYWNlU2hpcChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0sIGxlbmd0aCwgdmVydGljYWwpXG4gICAgfSlcbiAgfVxuXG4gICNnZXRQbGFjZW1lbnRDb29yZGluYXRlcyhib2FyZCwgdmVydGljYWwsIGxlbmd0aCkge1xuICAgIGxldCB4ID0gbnVsbFxuICAgIGxldCB5ID0gbnVsbFxuICAgIGxldCB2YWxpZCA9IHRydWVcbiAgICBkbyB7XG4gICAgICBpZiAodmVydGljYWwpIHtcbiAgICAgICAgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMClcbiAgICAgICAgZG8ge1xuICAgICAgICAgIHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTApIC0gbGVuZ3RoICsgMVxuICAgICAgICB9IHdoaWxlKHkgPCAwKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGJvYXJkLm5vdEVtcHR5KHgsIHkgKyBpKSkge1xuICAgICAgICAgICAgdmFsaWQgPSBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMClcbiAgICAgICAgZG8ge1xuICAgICAgICAgIHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTApIC0gbGVuZ3RoICsgMVxuICAgICAgICB9IHdoaWxlICh4IDwgMClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChib2FyZC5ub3RFbXB0eSh4ICsgaSwgeSkpIHtcbiAgICAgICAgICAgIHZhbGlkID0gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICByZXR1cm4gW3gsIHldXG4gICAgICB9XG4gICAgfSB3aGlsZSh0cnVlKVxuICB9XG5cbiAgI3Jlc2V0TW92ZXMoKSB7XG4gICAgbGV0IHBvc3NpYmxlTW92ZXMgPSBbXVxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTA7ICsreCkge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMDsgKyt5KSB7XG4gICAgICAgIHBvc3NpYmxlTW92ZXMucHVzaChbeCwgeV0pXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwb3NzaWJsZU1vdmVzXG4gIH1cbn0iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXBfY2xhc3MnXG5pbXBvcnQgSHRtbCBmcm9tICcuL2h0bWwnXG5cbmNvbnN0IEVNUFRZID0gJydcbmNvbnN0IE1JU1MgPSAnbydcbmNvbnN0IEhJVCA9ICd4J1xuY29uc3QgU0hJUCA9ICdzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFycmF5ID0gdGhpcy4jY2xlYXIoKVxuICB9XG5cbiAgI2NsZWFyKCkge1xuICAgIHJldHVybiBbLi4uQXJyYXkoMTApXS5tYXAoKCkgPT4gQXJyYXkoMTApLmZpbGwoRU1QVFkpKVxuICB9XG5cbiAgcGxhY2VTaGlwKHgsIHksIGxlbmd0aCwgdmVydGljYWwpIHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAobGVuZ3RoKVxuICAgIGxldCBjb29yZGluYXRlcyA9IFtdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKHZlcnRpY2FsKXtcbiAgICAgICAgdGhpcy5hcnJheVt5ICsgaV1beF0gPSBTSElQXG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW3kgKyBpLCB4XSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmFycmF5W3ldW3ggKyBpXSA9IFNISVBcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbeSwgeCArIGldKVxuICAgICAgfVxuICAgIH1cbiAgICBzaGlwLnNldENvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKVxuICB9XG5cbiAgcmVjZWl2ZUF0dGFjayh4LCB5LCBib2FyZCkge1xuICAgIGxldCBoaXQgPSBmYWxzZVxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5hcnJheVt5XVt4XVxuICAgIGlmICh2YWx1ZSA9PSBTSElQKSB7XG4gICAgICB0aGlzLmFycmF5W3ldW3hdID0gSElUXG4gICAgICBIdG1sLmhpdCgnJyt5ICsgeCwgYm9hcmQpXG4gICAgICBTaGlwLmZpbmQoW3ksIHhdKS5oaXQoKVxuICAgICAgaGl0ID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFycmF5W3ldW3hdID0gTUlTU1xuICAgICAgSHRtbC5taXNzKCcnK3kgKyB4LCBib2FyZClcbiAgICB9XG4gICAgcmV0dXJuIGhpdFxuICB9XG5cbiAgYWxsU2hpcHNTdW5rKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7ICsraSkge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgKytqKSB7XG4gICAgICAgIGlmICh0aGlzLmFycmF5W2ldW2pdID09IFNISVApXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB2YWxpZE1vdmUoeCwgeSkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5hcnJheVt5XVt4XVxuICAgIHJldHVybiAocG9zaXRpb24gPT0gRU1QVFkgfHwgcG9zaXRpb24gPT0gU0hJUClcbiAgfVxuXG4gIG5vdEVtcHR5KHgsIHkpIHtcbiAgICByZXR1cm4gdGhpcy5hcnJheVt5XVt4XSAhPSBFTVBUWVxuICB9XG59IiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tICcuL2dhbWVfYm9hcmRfY2xhc3MnXG5pbXBvcnQgUGxheWVyIGZyb20gJy4vcGxheWVyX2NsYXNzJ1xuaW1wb3J0IENvbXB1dGVyIGZyb20gJy4vY29tcHV0ZXJfY2xhc3MnXG5pbXBvcnQgSHRtbCBmcm9tICcuL2h0bWwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLiNuZXdQbGF5ZXJzQW5kQm9hcmRzKClcbiAgICB0aGlzLmNvbXB1dGVyID0gbmV3IENvbXB1dGVyKClcblxuICAgIHRoaXMuc2hpcExlbmd0aHMgPSBbNV1cbiAgICB0aGlzLiNwbGFjZVNoaXBzKClcbiAgfVxuXG4gIC8vIENhbGxlZCBmcm9tIGh0bWwuanMgd2hlbiBhbGwgdGhlIHNoaXBzIGFyZSBwbGFjZWRcbiAgcGxheSgpIHtcbiAgICBjb25zdCBjb21wdXRlckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbXB1dGVyX2JvYXJkJylcbiAgICBjb21wdXRlckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCB5ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzBdXG4gICAgICAgIGNvbnN0IHggPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMV1cbiAgICAgICAgY29uc3QgeU51bSA9IE51bWJlcih5KVxuICAgICAgICBjb25zdCB4TnVtID0gTnVtYmVyKHgpXG4gICAgICAgIGlmICh0aGlzLmJvYXJkMi52YWxpZE1vdmUoeE51bSwgeU51bSkpIHtcbiAgICAgICAgICB0aGlzLiNtYWtlTW92ZXMoeCwgeSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAjbWFrZU1vdmVzKHgsIHkpIHtcbiAgICBjb25zdCBwbGF5ZXJIaXQgPSB0aGlzLnBsYXllcjEubW92ZSh4LCB5KSAvLyBSZXR1cm5zIHRydWUgaWYgaGl0XG4gICAgaWYgKCFwbGF5ZXJIaXQpIHtcbiAgICAgIC8vIENvbXB1dGVyIHNraXBzIHR1cm4gaWYgdXNlciBoaXRzXG4gICAgICBsZXQgaGl0ID0gbnVsbFxuICAgICAgZG8ge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlcyA9IHRoaXMuY29tcHV0ZXIuZ2V0Q29vcmRpbmF0ZXMoKVxuICAgICAgICBoaXQgPSB0aGlzLnBsYXllcjIubW92ZShjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pIC8vIFRydWUgaWYgaGl0XG4gICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICBpZiAodGhpcy5ib2FyZDEuYWxsU2hpcHNTdW5rKCkpIHtcbiAgICAgICAgICAgIEdhbWUub3Zlcih0aGlzLnBsYXllcjIubmFtZSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSB3aGlsZSAoaGl0KVxuICAgIH0gZWxzZSB7IC8vIGlmIHBsYXllciBoaXRcbiAgICAgIGlmICh0aGlzLmJvYXJkMi5hbGxTaGlwc1N1bmsoKSkge1xuICAgICAgICBHYW1lLm92ZXIodGhpcy5wbGF5ZXIxLm5hbWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICAjcGxhY2VTaGlwcygpIHtcbiAgICBIdG1sLmRyYWdTaGlwKHRoaXMuc2hpcExlbmd0aHMsIHRoaXMsIHRoaXMuYm9hcmQxKVxuICAgIHRoaXMuY29tcHV0ZXIucGxhY2VTaGlwcyh0aGlzLmJvYXJkMiwgdGhpcy5zaGlwTGVuZ3RocylcbiAgICBjb25zb2xlLmxvZyh0aGlzLmJvYXJkMilcbiAgfVxuXG4gIHN0YXRpYyBvdmVyKHdpbm5lck5hbWUpIHtcbiAgICBIdG1sLm92ZXIod2lubmVyTmFtZSlcbiAgfVxuXG4gIHN0YXRpYyByZXN0YXJ0KCkge1xuICAgIEh0bWwucmVwb3B1bGF0ZUJvYXJkcygpXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lcicpXG4gICAgbmV3IEdhbWUoKVxuICB9XG5cbiAgI25ld1BsYXllcnNBbmRCb2FyZHMoKSB7XG4gICAgdGhpcy5ib2FyZDEgPSBuZXcgR2FtZUJvYXJkKClcbiAgICB0aGlzLmJvYXJkMiA9IG5ldyBHYW1lQm9hcmQoKVxuXG4gICAgdGhpcy5wbGF5ZXIxID0gbmV3IFBsYXllcihcIlBsYXllclwiLCB0aGlzLmJvYXJkMilcbiAgICB0aGlzLnBsYXllcjIgPSBuZXcgUGxheWVyKFwiQ29tcHV0ZXJcIiwgdGhpcy5ib2FyZDEpXG4gIH1cbn0iLCJpbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lX2NsYXNzXCJcblxuY29uc3QgRU1QVFkgPSAnJ1xuY29uc3QgTUlTUyA9ICdvJ1xuY29uc3QgSElUID0gJ3gnXG5jb25zdCBTSElQID0gJ3MnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh0bWwge1xuICBzdGF0aWMgcG9wdWxhdGVCb2FyZHMoKSB7XG4gICAgZm9yIChsZXQgaSA9IDk7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGNvbnN0IGxpbmUyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGxpbmUuY2xhc3NMaXN0LmFkZCgnbGluZScpXG4gICAgICBsaW5lMi5jbGFzc0xpc3QuYWRkKCdsaW5lJylcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBjb25zdCBzcXVhcmUyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ3NxdWFyZScsIGkgKyAnJyArIGopXG4gICAgICAgIHNxdWFyZTIuY2xhc3NMaXN0LmFkZCgnc3F1YXJlJywgaSArICcnICsgailcbiAgICAgICAgbGluZS5hcHBlbmRDaGlsZChzcXVhcmUpXG4gICAgICAgIGxpbmUyLmFwcGVuZENoaWxkKHNxdWFyZTIpXG4gICAgICB9XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyX2JvYXJkJykuYXBwZW5kQ2hpbGQobGluZSlcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21wdXRlcl9ib2FyZCcpLmFwcGVuZENoaWxkKGxpbmUyKVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyByZXBvcHVsYXRlQm9hcmRzKCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKVxuICAgIGNvbnRhaW5lci5zdHlsZVtcInBvaW50ZXItZXZlbnRzXCJdID0gXCJhdXRvXCJcbiAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllcl9ib2FyZCcpKVxuICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29tcHV0ZXJfYm9hcmQnKSlcbiAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lcicpKVxuICAgIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBjb21wdXRlckJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBwbGF5ZXJCb2FyZC5jbGFzc0xpc3QuYWRkKCdwbGF5ZXJfYm9hcmQnKVxuICAgIGNvbXB1dGVyQm9hcmQuY2xhc3NMaXN0LmFkZCgnY29tcHV0ZXJfYm9hcmQnKVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJCb2FyZClcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY29tcHV0ZXJCb2FyZClcbiAgICB0aGlzLnBvcHVsYXRlQm9hcmRzKClcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBkcmFnU2hpcChsZW5ndGhzLCBnYW1lLCBib2FyZCkge1xuICAgIGxldCBpbmRleCA9IDBcbiAgICBjb25zdCBtYXhJbmRleCA9IGxlbmd0aHMubGVuZ3RoXG5cbiAgICBmdW5jdGlvbiBidWlsZFNoaXAoKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGhzW2luZGV4XVxuICAgICAgaW5kZXgrK1xuXG4gICAgICBzaGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZCgnc2hpcCcpXG4gICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsJylcbiAgICAgIHNoaXAuc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCB0cnVlKVxuICAgICAgd2lkdGggPSA0XG4gICAgICBoZWlnaHQgPSA2LjcgKiBsZW5ndGhcbiAgICAgIHNoaXAuc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDogJyt3aWR0aCsndnc7IGhlaWdodDogJytoZWlnaHQrJ3ZoOycpXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcHMnKS5hcHBlbmRDaGlsZChzaGlwKVxuICAgIH1cbiAgICBsZXQgc2hpcCA9IG51bGxcbiAgICBsZXQgbGVuZ3RoID0gbnVsbFxuICAgIGxldCB3aWR0aCA9IG51bGxcbiAgICBsZXQgaGVpZ2h0ID0gbnVsbFxuXG4gICAgYnVpbGRTaGlwKClcblxuICAgIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXJfYm9hcmRcIik7XG4gICAgXG4gICAgc2hpcC5vbmRyYWdzdGFydCA9IGZ1bmN0aW9uKGUpe1xuICAgICAgZS5kYXRhVHJhbnNmZXIuY2xlYXJEYXRhKCk7XG4gICAgfVxuICAgIFxuICAgIHBsYXllckJvYXJkLm9uZHJhZ292ZXIgPSBmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3RbMV0pIHtcbiAgICAgICAgbGV0IHkgPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMF1cbiAgICAgICAgbGV0IHggPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMV1cbiAgICAgICAgaWYgKCFzaGlwLmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSkge1xuICAgICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QuYWRkKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeCA9IChOdW1iZXIoeCkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pIHtcbiAgICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LmFkZCgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHkgPSAoTnVtYmVyKHkpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwbGF5ZXJCb2FyZC5vbmRyYWdsZWF2ZSA9IGZ1bmN0aW9uKGUpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdFsxXSkge1xuICAgICAgICBsZXQgeSA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVswXVxuICAgICAgICBsZXQgeCA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVsxXVxuICAgICAgICBpZiAoIXNoaXAuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbCcpKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkge1xuICAgICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeCA9IChOdW1iZXIoeCkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pIHtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5ID0gKE51bWJlcih5KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PSAncicpIHtcbiAgICAgICAgY29uc3Qgc2hpcDEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcCcpXG4gICAgICAgIGlmIChzaGlwMSkge1xuICAgICAgICAgIGlmIChzaGlwMS5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpIHtcbiAgICAgICAgICAgIHdpZHRoID0gNCAqIGxlbmd0aFxuICAgICAgICAgICAgaGVpZ2h0ID0gNi43XG4gICAgICAgICAgICBzaGlwMS5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbCcpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpZHRoID0gNFxuICAgICAgICAgICAgaGVpZ2h0ID0gNi43ICogbGVuZ3RoXG4gICAgICAgICAgICBzaGlwMS5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpXG4gICAgICAgICAgfVxuICAgICAgICAgIHNoaXAxLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6ICcrd2lkdGgrJ3Z3OyBoZWlnaHQ6ICcraGVpZ2h0Kyd2aDsnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIGZhbHNlKTtcbiAgICBcbiAgICBwbGF5ZXJCb2FyZC5vbmRyb3AgPSBmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwidGV4dFwiKTtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcCcpXG4gICAgICBjb25zdCBzaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcycpXG4gICAgICBpZiAodmFsaWREcm9wKGVsZW1lbnQsIGUudGFyZ2V0LCBsZW5ndGgpKSB7XG4gICAgICAgIGxldCB5ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzBdXG4gICAgICAgIGxldCB4ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzFdXG4gICAgICAgIGJvYXJkLnBsYWNlU2hpcChOdW1iZXIoeCksIE51bWJlcih5KSwgbGVuZ3RoLCBzaGlwLmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSlcbiAgICAgICAgc2hpcHMucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIGlmICghc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LmFkZCgncGxhY2VkJyk7XG4gICAgICAgICAgICB4ID0gKE51bWJlcih4KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5hZGQoJ3BsYWNlZCcpO1xuICAgICAgICAgICAgeSA9IChOdW1iZXIoeSkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleCAhPSBtYXhJbmRleCkge1xuICAgICAgICAgIGJ1aWxkU2hpcCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ2FtZS5wbGF5KClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHkgPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMF1cbiAgICAgICAgbGV0IHggPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMV1cbiAgICAgICAgc2hpcHMuYXBwZW5kQ2hpbGQoZWxlbWVudClcbiAgICAgICAgaWYgKCFzaGlwLmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pIHtcbiAgICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHggPSAoTnVtYmVyKHgpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSB7XG4gICAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5ID0gKE51bWJlcih5KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gdmFsaWREcm9wKGVsZW1lbnQsIHBlbGVtZW50LCBsZW5ndGgpIHtcbiAgICAgIGxldCB4ID0gTnVtYmVyKHBlbGVtZW50LmNsYXNzTGlzdFsxXVsxXSlcbiAgICAgIGxldCB5ID0gTnVtYmVyKHBlbGVtZW50LmNsYXNzTGlzdFsxXVswXSlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbCcpKSB7XG4gICAgICAgICAgaWYgKHkgPiA5IHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJycgKyB5ICsgeClbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdwbGFjZWQnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHkgKz0gMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh4ID4gOSB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCcnICsgeSArIHgpWzBdLmNsYXNzTGlzdC5jb250YWlucygncGxhY2VkJykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICB4ICs9IDFcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaGl0KGNsYXNzTmFtZSwgYm9hcmQpIHtcbiAgICBjb25zdCBub2RlID0gZmluZE5vZGUoY2xhc3NOYW1lLCBib2FyZClcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoJ2hpdCcpXG4gIH1cblxuICBzdGF0aWMgbWlzcyhjbGFzc05hbWUsIGJvYXJkKSB7XG4gICAgY29uc3Qgbm9kZSA9IGZpbmROb2RlKGNsYXNzTmFtZSwgYm9hcmQpXG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKCdtaXNzJylcbiAgfVxuXG4gIHN0YXRpYyBvdmVyKHdpbm5lck5hbWUpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyJylcbiAgICBjb250YWluZXIuc3R5bGVbXCJwb2ludGVyLWV2ZW50c1wiXSA9IFwibm9uZVwiXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnd2lubmVyJylcbiAgICBjb25zdCBoMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJylcbiAgICBjb25zdCByZXN0YXJ0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBoMS50ZXh0Q29udGVudCA9IHdpbm5lck5hbWUgKyAnIGlzIHRoZSB3aW5uZXIhJ1xuICAgIHJlc3RhcnQudGV4dENvbnRlbnQgPSAnUmVzdGFydCdcbiAgICByZXN0YXJ0LmNsYXNzTGlzdC5hZGQoJ3Jlc3RhcnQnKVxuICAgIHJlc3RhcnQuc3R5bGVbXCJwb2ludGVyLWV2ZW50c1wiXSA9IFwiYXV0b1wiXG4gICAgZGl2LmFwcGVuZENoaWxkKGgxKVxuICAgIGRpdi5hcHBlbmRDaGlsZChyZXN0YXJ0KVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpXG4gICAgcmVzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIEdhbWUucmVzdGFydCgpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kTm9kZShjbGFzc05hbWUsIGJvYXJkKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmQuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAoYm9hcmQuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzW2pdLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSB7XG4gICAgICAgIHJldHVybiBib2FyZC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXNbal1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gJy4vZ2FtZV9ib2FyZF9jbGFzcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IobmFtZSwgZW5lbXlCb2FyZCkge1xuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB0aGlzLmVuZW15Qm9hcmQgPSBlbmVteUJvYXJkXG4gIH1cblxuICBtb3ZlKHgsIHkpIHtcbiAgICBsZXQgYm9hcmQgPSBudWxsXG4gICAgaWYgKHRoaXMubmFtZSA9PSAnUGxheWVyJykge1xuICAgICAgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29tcHV0ZXJfYm9hcmQnKVxuICAgIH0gZWxzZSB7XG4gICAgICBib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXJfYm9hcmQnKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbmVteUJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSwgYm9hcmQpXG4gIH1cbn0iLCJsZXQgc2hpcHMgPSBbXVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGhcbiAgICB0aGlzLmhpdENvdW50ID0gMFxuICB9XG4gIFxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRDb3VudCsrXG4gIH1cbiAgXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy5sZW5ndGggPT0gdGhpcy5oaXRDb3VudClcbiAgICByZXR1cm4gdHJ1ZVxuICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHNldENvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKSB7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzXG4gICAgc2hpcHMucHVzaCh0aGlzKVxuICB9XG5cbiAgc3RhdGljIGZpbmQoY29vcmRpbmF0ZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGNvbnN0IHNoaXAgPSBzaGlwc1tpXVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwLmNvb3JkaW5hdGVzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMyID0gc2hpcC5jb29yZGluYXRlc1tqXVxuICAgICAgICBpZiAoY29vcmRpbmF0ZXMyWzBdID09IGNvb3JkaW5hdGVzWzBdICYmIGNvb3JkaW5hdGVzMlsxXSA9PSBjb29yZGluYXRlc1sxXSlcbiAgICAgICAgICByZXR1cm4gc2hpcFxuICAgICAgfVxuICAgIH1cbiAgfVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lX2NsYXNzJ1xuaW1wb3J0IEh0bWwgZnJvbSAnLi9odG1sJ1xuXG5IdG1sLnBvcHVsYXRlQm9hcmRzKClcbm5ldyBHYW1lKCkiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
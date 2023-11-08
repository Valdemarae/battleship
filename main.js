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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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WUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLDBCQUEwQixZQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCxxQkFBcUI7QUFDbEY7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLFlBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsMEJBQTBCLFlBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLFlBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDViwwQkFBMEIsWUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsWUFBWTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLG1EQUFJO0FBQ1YsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0IsNkJBQTZCO0FBQy9DLG9CQUFvQiwyQ0FBMkM7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUN6UDBDOztBQUUzQjtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDakJBOztBQUVlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixrQkFBa0I7QUFDdEM7QUFDQSxzQkFBc0IsNkJBQTZCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUNqQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOK0I7QUFDTjs7QUFFekIsNkNBQUk7QUFDSixJQUFJLG1EQUFJLEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXB1dGVyX2NsYXNzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZV9ib2FyZF9jbGFzcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVfY2xhc3MuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9odG1sLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyX2NsYXNzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcF9jbGFzcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wdXRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zc2libGVNb3ZlcyA9IHRoaXMuI3Jlc2V0TW92ZXMoKVxuICB9XG5cbiAgZ2V0Q29vcmRpbmF0ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zc2libGVNb3Zlcy5zcGxpY2UoKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMucG9zc2libGVNb3Zlcy5sZW5ndGgpKSwgMSlbMF1cbiAgfVxuXG4gIHBsYWNlU2hpcHMoYm9hcmQsIHNoaXBMZW5ndGhzKSB7XG4gICAgc2hpcExlbmd0aHMuZm9yRWFjaCgobGVuZ3RoKSA9PiB7XG4gICAgICBjb25zdCB2ZXJ0aWNhbCA9IE1hdGgucmFuZG9tKCkgPiAwLjUgPyB0cnVlIDogZmFsc2VcbiAgICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gdGhpcy4jZ2V0UGxhY2VtZW50Q29vcmRpbmF0ZXMoYm9hcmQsIHZlcnRpY2FsLCBsZW5ndGgpXG4gICAgICBib2FyZC5wbGFjZVNoaXAoY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdLCBsZW5ndGgsIHZlcnRpY2FsKVxuICAgIH0pXG4gIH1cblxuICAjZ2V0UGxhY2VtZW50Q29vcmRpbmF0ZXMoYm9hcmQsIHZlcnRpY2FsLCBsZW5ndGgpIHtcbiAgICBsZXQgeCA9IG51bGxcbiAgICBsZXQgeSA9IG51bGxcbiAgICBsZXQgdmFsaWQgPSB0cnVlXG4gICAgZG8ge1xuICAgICAgaWYgKHZlcnRpY2FsKSB7XG4gICAgICAgIHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTApXG4gICAgICAgIGRvIHtcbiAgICAgICAgICB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjEwKSAtIGxlbmd0aCArIDFcbiAgICAgICAgfSB3aGlsZSh5IDwgMClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChib2FyZC5ub3RFbXB0eSh4LCB5ICsgaSkpIHtcbiAgICAgICAgICAgIHZhbGlkID0gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTApXG4gICAgICAgIGRvIHtcbiAgICAgICAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjEwKSAtIGxlbmd0aCArIDFcbiAgICAgICAgfSB3aGlsZSAoeCA8IDApXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoYm9hcmQubm90RW1wdHkoeCArIGksIHkpKSB7XG4gICAgICAgICAgICB2YWxpZCA9IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgcmV0dXJuIFt4LCB5XVxuICAgICAgfVxuICAgIH0gd2hpbGUodHJ1ZSlcbiAgfVxuXG4gICNyZXNldE1vdmVzKCkge1xuICAgIGxldCBwb3NzaWJsZU1vdmVzID0gW11cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwOyArK3gpIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTA7ICsreSkge1xuICAgICAgICBwb3NzaWJsZU1vdmVzLnB1c2goW3gsIHldKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcG9zc2libGVNb3Zlc1xuICB9XG59IiwiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwX2NsYXNzJ1xuaW1wb3J0IEh0bWwgZnJvbSAnLi9odG1sJ1xuXG5jb25zdCBFTVBUWSA9ICcnXG5jb25zdCBNSVNTID0gJ28nXG5jb25zdCBISVQgPSAneCdcbmNvbnN0IFNISVAgPSAncydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hcnJheSA9IHRoaXMuI2NsZWFyKClcbiAgfVxuXG4gICNjbGVhcigpIHtcbiAgICByZXR1cm4gWy4uLkFycmF5KDEwKV0ubWFwKCgpID0+IEFycmF5KDEwKS5maWxsKEVNUFRZKSlcbiAgfVxuXG4gIHBsYWNlU2hpcCh4LCB5LCBsZW5ndGgsIHZlcnRpY2FsKSB7XG4gICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKGxlbmd0aClcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSBbXVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmICh2ZXJ0aWNhbCl7XG4gICAgICAgIHRoaXMuYXJyYXlbeSArIGldW3hdID0gU0hJUFxuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFt5ICsgaSwgeF0pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5hcnJheVt5XVt4ICsgaV0gPSBTSElQXG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW3ksIHggKyBpXSlcbiAgICAgIH1cbiAgICB9XG4gICAgc2hpcC5zZXRDb29yZGluYXRlcyhjb29yZGluYXRlcylcbiAgfVxuXG4gIHJlY2VpdmVBdHRhY2soeCwgeSwgYm9hcmQpIHtcbiAgICBsZXQgaGl0ID0gZmFsc2VcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuYXJyYXlbeV1beF1cbiAgICBpZiAodmFsdWUgPT0gU0hJUCkge1xuICAgICAgdGhpcy5hcnJheVt5XVt4XSA9IEhJVFxuICAgICAgSHRtbC5oaXQoJycreSArIHgsIGJvYXJkKVxuICAgICAgU2hpcC5maW5kKFt5LCB4XSkuaGl0KClcbiAgICAgIGhpdCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hcnJheVt5XVt4XSA9IE1JU1NcbiAgICAgIEh0bWwubWlzcygnJyt5ICsgeCwgYm9hcmQpXG4gICAgfVxuICAgIHJldHVybiBoaXRcbiAgfVxuXG4gIGFsbFNoaXBzU3VuaygpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyArK2kpIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7ICsraikge1xuICAgICAgICBpZiAodGhpcy5hcnJheVtpXVtqXSA9PSBTSElQKVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgdmFsaWRNb3ZlKHgsIHkpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuYXJyYXlbeV1beF1cbiAgICByZXR1cm4gKHBvc2l0aW9uID09IEVNUFRZIHx8IHBvc2l0aW9uID09IFNISVApXG4gIH1cblxuICBub3RFbXB0eSh4LCB5KSB7XG4gICAgcmV0dXJuIHRoaXMuYXJyYXlbeV1beF0gIT0gRU1QVFlcbiAgfVxufSIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSAnLi9nYW1lX2JvYXJkX2NsYXNzJ1xuaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcl9jbGFzcydcbmltcG9ydCBDb21wdXRlciBmcm9tICcuL2NvbXB1dGVyX2NsYXNzJ1xuaW1wb3J0IEh0bWwgZnJvbSAnLi9odG1sJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy4jbmV3UGxheWVyc0FuZEJvYXJkcygpXG4gICAgdGhpcy5jb21wdXRlciA9IG5ldyBDb21wdXRlcigpXG5cbiAgICB0aGlzLnNoaXBMZW5ndGhzID0gWzUsIDQsIDMsIDMsIDJdXG4gICAgdGhpcy4jcGxhY2VTaGlwcygpXG4gIH1cblxuICAvLyBDYWxsZWQgZnJvbSBodG1sLmpzIHdoZW4gYWxsIHRoZSBzaGlwcyBhcmUgcGxhY2VkXG4gIHBsYXkoKSB7XG4gICAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21wdXRlcl9ib2FyZCcpXG4gICAgY29tcHV0ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3QgeSA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVswXVxuICAgICAgICBjb25zdCB4ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzFdXG4gICAgICAgIGNvbnN0IHlOdW0gPSBOdW1iZXIoeSlcbiAgICAgICAgY29uc3QgeE51bSA9IE51bWJlcih4KVxuICAgICAgICBpZiAodGhpcy5ib2FyZDIudmFsaWRNb3ZlKHhOdW0sIHlOdW0pKSB7XG4gICAgICAgICAgdGhpcy4jbWFrZU1vdmVzKHgsIHkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgI21ha2VNb3Zlcyh4LCB5KSB7XG4gICAgY29uc3QgcGxheWVySGl0ID0gdGhpcy5wbGF5ZXIxLm1vdmUoeCwgeSkgLy8gUmV0dXJucyB0cnVlIGlmIGhpdFxuICAgIGlmICghcGxheWVySGl0KSB7XG4gICAgICAvLyBDb21wdXRlciBza2lwcyB0dXJuIGlmIHVzZXIgaGl0c1xuICAgICAgbGV0IGhpdCA9IG51bGxcbiAgICAgIGRvIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0aGlzLmNvbXB1dGVyLmdldENvb3JkaW5hdGVzKClcbiAgICAgICAgaGl0ID0gdGhpcy5wbGF5ZXIyLm1vdmUoY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSAvLyBUcnVlIGlmIGhpdFxuICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgaWYgKHRoaXMuYm9hcmQxLmFsbFNoaXBzU3VuaygpKSB7XG4gICAgICAgICAgICBHYW1lLm92ZXIodGhpcy5wbGF5ZXIyLm5hbWUpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKGhpdClcbiAgICB9IGVsc2UgeyAvLyBpZiBwbGF5ZXIgaGl0XG4gICAgICBpZiAodGhpcy5ib2FyZDIuYWxsU2hpcHNTdW5rKCkpIHtcbiAgICAgICAgR2FtZS5vdmVyKHRoaXMucGxheWVyMS5uYW1lKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgI3BsYWNlU2hpcHMoKSB7XG4gICAgSHRtbC5kcmFnU2hpcCh0aGlzLnNoaXBMZW5ndGhzLCB0aGlzLCB0aGlzLmJvYXJkMSlcbiAgICB0aGlzLmNvbXB1dGVyLnBsYWNlU2hpcHModGhpcy5ib2FyZDIsIHRoaXMuc2hpcExlbmd0aHMpXG4gIH1cblxuICBzdGF0aWMgb3Zlcih3aW5uZXJOYW1lKSB7XG4gICAgSHRtbC5vdmVyKHdpbm5lck5hbWUpXG4gIH1cblxuICBzdGF0aWMgcmVzdGFydCgpIHtcbiAgICBIdG1sLnJlcG9wdWxhdGVCb2FyZHMoKVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKVxuICAgIG5ldyBHYW1lKClcbiAgfVxuXG4gICNuZXdQbGF5ZXJzQW5kQm9hcmRzKCkge1xuICAgIHRoaXMuYm9hcmQxID0gbmV3IEdhbWVCb2FyZCgpXG4gICAgdGhpcy5ib2FyZDIgPSBuZXcgR2FtZUJvYXJkKClcblxuICAgIHRoaXMucGxheWVyMSA9IG5ldyBQbGF5ZXIoXCJQbGF5ZXJcIiwgdGhpcy5ib2FyZDIpXG4gICAgdGhpcy5wbGF5ZXIyID0gbmV3IFBsYXllcihcIkNvbXB1dGVyXCIsIHRoaXMuYm9hcmQxKVxuICB9XG59IiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vZ2FtZV9jbGFzc1wiXG5cbmNvbnN0IEVNUFRZID0gJydcbmNvbnN0IE1JU1MgPSAnbydcbmNvbnN0IEhJVCA9ICd4J1xuY29uc3QgU0hJUCA9ICdzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdG1sIHtcbiAgc3RhdGljIHBvcHVsYXRlQm9hcmRzKCkge1xuICAgIGZvciAobGV0IGkgPSA5OyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBjb25zdCBsaW5lMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBsaW5lLmNsYXNzTGlzdC5hZGQoJ2xpbmUnKVxuICAgICAgbGluZTIuY2xhc3NMaXN0LmFkZCgnbGluZScpXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgY29uc3Qgc3F1YXJlMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdzcXVhcmUnLCBpICsgJycgKyBqKVxuICAgICAgICBzcXVhcmUyLmNsYXNzTGlzdC5hZGQoJ3NxdWFyZScsIGkgKyAnJyArIGopXG4gICAgICAgIGxpbmUuYXBwZW5kQ2hpbGQoc3F1YXJlKVxuICAgICAgICBsaW5lMi5hcHBlbmRDaGlsZChzcXVhcmUyKVxuICAgICAgfVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllcl9ib2FyZCcpLmFwcGVuZENoaWxkKGxpbmUpXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29tcHV0ZXJfYm9hcmQnKS5hcHBlbmRDaGlsZChsaW5lMilcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgcmVwb3B1bGF0ZUJvYXJkcygpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyJylcbiAgICBjb250YWluZXIuc3R5bGVbXCJwb2ludGVyLWV2ZW50c1wiXSA9IFwiYXV0b1wiXG4gICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXJfYm9hcmQnKSlcbiAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbXB1dGVyX2JvYXJkJykpXG4gICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5uZXInKSlcbiAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgcGxheWVyQm9hcmQuY2xhc3NMaXN0LmFkZCgncGxheWVyX2JvYXJkJylcbiAgICBjb21wdXRlckJvYXJkLmNsYXNzTGlzdC5hZGQoJ2NvbXB1dGVyX2JvYXJkJylcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyQm9hcmQpXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbXB1dGVyQm9hcmQpXG4gICAgdGhpcy5wb3B1bGF0ZUJvYXJkcygpXG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZHJhZ1NoaXAobGVuZ3RocywgZ2FtZSwgYm9hcmQpIHtcbiAgICBsZXQgaW5kZXggPSAwXG4gICAgY29uc3QgbWF4SW5kZXggPSBsZW5ndGhzLmxlbmd0aFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb3RhdGUnKS50ZXh0Q29udGVudCA9ICdQcmVzcyBSIHRvIHJvdGF0ZSdcblxuICAgIGZ1bmN0aW9uIGJ1aWxkU2hpcCgpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aHNbaW5kZXhdXG4gICAgICBpbmRleCsrXG5cbiAgICAgIHNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKCdzaGlwJylcbiAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZCgndmVydGljYWwnKVxuICAgICAgc2hpcC5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsIHRydWUpXG4gICAgICB3aWR0aCA9IDMuNVxuICAgICAgaGVpZ2h0ID0gNS43ICogbGVuZ3RoXG4gICAgICBzaGlwLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6ICcrd2lkdGgrJ3Z3OyBoZWlnaHQ6ICcraGVpZ2h0Kyd2aDsnKVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzJykuYXBwZW5kQ2hpbGQoc2hpcClcbiAgICB9XG4gICAgbGV0IHNoaXAgPSBudWxsXG4gICAgbGV0IGxlbmd0aCA9IG51bGxcbiAgICBsZXQgd2lkdGggPSBudWxsXG4gICAgbGV0IGhlaWdodCA9IG51bGxcblxuICAgIGJ1aWxkU2hpcCgpXG4gICAgcm90YXRlRXZlbnQoKVxuXG4gICAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllcl9ib2FyZFwiKTtcbiAgICBcbiAgICBzaGlwLm9uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24oZSl7XG4gICAgICBlLmRhdGFUcmFuc2Zlci5jbGVhckRhdGEoKTtcbiAgICB9XG4gICAgXG4gICAgcGxheWVyQm9hcmQub25kcmFnb3ZlciA9IGZ1bmN0aW9uKGUpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdFsxXSkge1xuICAgICAgICBsZXQgeSA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVswXVxuICAgICAgICBsZXQgeCA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVsxXVxuICAgICAgICBpZiAoIXNoaXAuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbCcpKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pKSB7XG4gICAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5hZGQoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB4ID0gKE51bWJlcih4KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkge1xuICAgICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QuYWRkKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeSA9IChOdW1iZXIoeSkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHBsYXllckJvYXJkLm9uZHJhZ2xlYXZlID0gZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0WzFdKSB7XG4gICAgICAgIGxldCB5ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzBdXG4gICAgICAgIGxldCB4ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzFdXG4gICAgICAgIGlmICghc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSB7XG4gICAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB4ID0gKE51bWJlcih4KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkge1xuICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0uY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHkgPSAoTnVtYmVyKHkpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiByb3RhdGVFdmVudCgpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PSAncicpIHtcbiAgICAgICAgICBjb25zdCBzaGlwMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwJylcbiAgICAgICAgICBpZiAoc2hpcDEpIHtcbiAgICAgICAgICAgIGlmIChzaGlwMS5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpIHtcbiAgICAgICAgICAgICAgd2lkdGggPSAzLjUgKiBsZW5ndGhcbiAgICAgICAgICAgICAgaGVpZ2h0ID0gNS43XG4gICAgICAgICAgICAgIHNoaXAxLmNsYXNzTGlzdC5yZW1vdmUoJ3ZlcnRpY2FsJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHdpZHRoID0gMy41XG4gICAgICAgICAgICAgIGhlaWdodCA9IDUuNyAqIGxlbmd0aFxuICAgICAgICAgICAgICBzaGlwMS5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaGlwMS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAnK3dpZHRoKyd2dzsgaGVpZ2h0OiAnK2hlaWdodCsndmg7Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgcGxheWVyQm9hcmQub25kcm9wID0gZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBkYXRhID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHRcIik7XG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAnKVxuICAgICAgY29uc3Qgc2hpcHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcHMnKVxuICAgICAgaWYgKHZhbGlkRHJvcChlbGVtZW50LCBlLnRhcmdldCwgbGVuZ3RoKSkge1xuICAgICAgICBsZXQgeSA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVswXVxuICAgICAgICBsZXQgeCA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVsxXVxuICAgICAgICBib2FyZC5wbGFjZVNoaXAoTnVtYmVyKHgpLCBOdW1iZXIoeSksIGxlbmd0aCwgc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpXG4gICAgICAgIHNoaXBzLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgICBpZiAoIXNoaXAuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbCcpKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5hZGQoJ3BsYWNlZCcpO1xuICAgICAgICAgICAgeCA9IChOdW1iZXIoeCkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QuYWRkKCdwbGFjZWQnKTtcbiAgICAgICAgICAgIHkgPSAoTnVtYmVyKHkpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXggIT0gbWF4SW5kZXgpIHtcbiAgICAgICAgICBidWlsZFNoaXAoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb3RhdGUnKS50ZXh0Q29udGVudCA9ICcnXG4gICAgICAgICAgZ2FtZS5wbGF5KClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHkgPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMF1cbiAgICAgICAgbGV0IHggPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMV1cbiAgICAgICAgc2hpcHMuYXBwZW5kQ2hpbGQoZWxlbWVudClcbiAgICAgICAgaWYgKCFzaGlwLmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pIHtcbiAgICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHggPSAoTnVtYmVyKHgpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSB7XG4gICAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5ID0gKE51bWJlcih5KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gdmFsaWREcm9wKGVsZW1lbnQsIHBlbGVtZW50LCBsZW5ndGgpIHtcbiAgICAgIGxldCB4ID0gTnVtYmVyKHBlbGVtZW50LmNsYXNzTGlzdFsxXVsxXSlcbiAgICAgIGxldCB5ID0gTnVtYmVyKHBlbGVtZW50LmNsYXNzTGlzdFsxXVswXSlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbCcpKSB7XG4gICAgICAgICAgaWYgKHkgPiA5IHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJycgKyB5ICsgeClbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdwbGFjZWQnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHkgKz0gMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh4ID4gOSB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCcnICsgeSArIHgpWzBdLmNsYXNzTGlzdC5jb250YWlucygncGxhY2VkJykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICB4ICs9IDFcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaGl0KGNsYXNzTmFtZSwgYm9hcmQpIHtcbiAgICBjb25zdCBub2RlID0gZmluZE5vZGUoY2xhc3NOYW1lLCBib2FyZClcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoJ2hpdCcpXG4gIH1cblxuICBzdGF0aWMgbWlzcyhjbGFzc05hbWUsIGJvYXJkKSB7XG4gICAgY29uc3Qgbm9kZSA9IGZpbmROb2RlKGNsYXNzTmFtZSwgYm9hcmQpXG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKCdtaXNzJylcbiAgfVxuXG4gIHN0YXRpYyBvdmVyKHdpbm5lck5hbWUpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyJylcbiAgICBjb250YWluZXIuc3R5bGVbXCJwb2ludGVyLWV2ZW50c1wiXSA9IFwibm9uZVwiXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnd2lubmVyJylcbiAgICBjb25zdCBoMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJylcbiAgICBjb25zdCByZXN0YXJ0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBoMS50ZXh0Q29udGVudCA9IHdpbm5lck5hbWUgKyAnIGlzIHRoZSB3aW5uZXIhJ1xuICAgIHJlc3RhcnQudGV4dENvbnRlbnQgPSAnUmVzdGFydCdcbiAgICByZXN0YXJ0LmNsYXNzTGlzdC5hZGQoJ3Jlc3RhcnQnKVxuICAgIHJlc3RhcnQuc3R5bGVbXCJwb2ludGVyLWV2ZW50c1wiXSA9IFwiYXV0b1wiXG4gICAgZGl2LmFwcGVuZENoaWxkKGgxKVxuICAgIGRpdi5hcHBlbmRDaGlsZChyZXN0YXJ0KVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpXG4gICAgcmVzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIEdhbWUucmVzdGFydCgpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kTm9kZShjbGFzc05hbWUsIGJvYXJkKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmQuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAoYm9hcmQuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzW2pdLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSB7XG4gICAgICAgIHJldHVybiBib2FyZC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXNbal1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gJy4vZ2FtZV9ib2FyZF9jbGFzcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IobmFtZSwgZW5lbXlCb2FyZCkge1xuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB0aGlzLmVuZW15Qm9hcmQgPSBlbmVteUJvYXJkXG4gIH1cblxuICBtb3ZlKHgsIHkpIHtcbiAgICBsZXQgYm9hcmQgPSBudWxsXG4gICAgaWYgKHRoaXMubmFtZSA9PSAnUGxheWVyJykge1xuICAgICAgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29tcHV0ZXJfYm9hcmQnKVxuICAgIH0gZWxzZSB7XG4gICAgICBib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXJfYm9hcmQnKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbmVteUJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSwgYm9hcmQpXG4gIH1cbn0iLCJsZXQgc2hpcHMgPSBbXVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGhcbiAgICB0aGlzLmhpdENvdW50ID0gMFxuICB9XG4gIFxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRDb3VudCsrXG4gIH1cbiAgXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy5sZW5ndGggPT0gdGhpcy5oaXRDb3VudClcbiAgICByZXR1cm4gdHJ1ZVxuICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHNldENvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKSB7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzXG4gICAgc2hpcHMucHVzaCh0aGlzKVxuICB9XG5cbiAgc3RhdGljIGZpbmQoY29vcmRpbmF0ZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGNvbnN0IHNoaXAgPSBzaGlwc1tpXVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwLmNvb3JkaW5hdGVzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMyID0gc2hpcC5jb29yZGluYXRlc1tqXVxuICAgICAgICBpZiAoY29vcmRpbmF0ZXMyWzBdID09IGNvb3JkaW5hdGVzWzBdICYmIGNvb3JkaW5hdGVzMlsxXSA9PSBjb29yZGluYXRlc1sxXSlcbiAgICAgICAgICByZXR1cm4gc2hpcFxuICAgICAgfVxuICAgIH1cbiAgfVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lX2NsYXNzJ1xuaW1wb3J0IEh0bWwgZnJvbSAnLi9odG1sJ1xuXG5IdG1sLnBvcHVsYXRlQm9hcmRzKClcbm5ldyBHYW1lKCkiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
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
    document.querySelector('.container')
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


const EMPTY = ''
const MISS = 'o'
const HIT = 'x'
const SHIP = 's'

let rotateCalled = false

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFFBQVE7QUFDOUIsd0JBQXdCLHFCQUFxQjtBQUM3QztBQUNBLDBCQUEwQixZQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLHNCQUFzQixRQUFRO0FBQzlCLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQSwwQkFBMEIsWUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLFFBQVE7QUFDNUIsc0JBQXNCLFFBQVE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDL0QrQjtBQUNOOztBQUV6QjtBQUNBO0FBQ0E7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsbURBQUk7QUFDekI7QUFDQSxvQkFBb0IsWUFBWTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDZDQUFJO0FBQ1YsTUFBTSxtREFBSTtBQUNWO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTSw2Q0FBSTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixRQUFRO0FBQzVCLHNCQUFzQixRQUFRO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEUwQztBQUNQO0FBQ0k7QUFDZDs7QUFFVjtBQUNmO0FBQ0E7QUFDQSx3QkFBd0IsdURBQVE7O0FBRWhDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSLE1BQU0sT0FBTztBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSw2Q0FBSTtBQUNSO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLDZDQUFJO0FBQ1I7O0FBRUE7QUFDQSxJQUFJLDZDQUFJO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLHlEQUFTO0FBQy9CLHNCQUFzQix5REFBUzs7QUFFL0IsdUJBQXVCLHFEQUFNO0FBQzdCLHVCQUF1QixxREFBTTs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDOUUrQjs7QUFFL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRWU7QUFDZjtBQUNBLG9CQUFvQixRQUFRO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFFBQVE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QscUJBQXFCO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLDBCQUEwQixZQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixZQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsMEJBQTBCLFlBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQscUJBQXFCO0FBQ2xGO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixZQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLDBCQUEwQixZQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixZQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsMEJBQTBCLFlBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFlBQVk7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxtREFBSTtBQUNWLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLDZCQUE2QjtBQUMvQyxvQkFBb0IsMkNBQTJDO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDOVAwQzs7QUFFM0I7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ2pCQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0Isa0JBQWtCO0FBQ3RDO0FBQ0Esc0JBQXNCLDZCQUE2QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDakNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTitCO0FBQ047O0FBRXpCLDZDQUFJO0FBQ0osSUFBSSxtREFBSSxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jb21wdXRlcl9jbGFzcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVfYm9hcmRfY2xhc3MuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lX2NsYXNzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaHRtbC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllcl9jbGFzcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBfY2xhc3MuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcHV0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBvc3NpYmxlTW92ZXMgPSB0aGlzLiNyZXNldE1vdmVzKClcbiAgfVxuXG4gIGdldENvb3JkaW5hdGVzKCkge1xuICAgIHJldHVybiB0aGlzLnBvc3NpYmxlTW92ZXMuc3BsaWNlKChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnBvc3NpYmxlTW92ZXMubGVuZ3RoKSksIDEpWzBdXG4gIH1cblxuICBwbGFjZVNoaXBzKGJvYXJkLCBzaGlwTGVuZ3Rocykge1xuICAgIHNoaXBMZW5ndGhzLmZvckVhY2goKGxlbmd0aCkgPT4ge1xuICAgICAgY29uc3QgdmVydGljYWwgPSBNYXRoLnJhbmRvbSgpID4gMC41ID8gdHJ1ZSA6IGZhbHNlXG4gICAgICBjb25zdCBjb29yZGluYXRlcyA9IHRoaXMuI2dldFBsYWNlbWVudENvb3JkaW5hdGVzKGJvYXJkLCB2ZXJ0aWNhbCwgbGVuZ3RoKVxuICAgICAgYm9hcmQucGxhY2VTaGlwKGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSwgbGVuZ3RoLCB2ZXJ0aWNhbClcbiAgICB9KVxuICB9XG5cbiAgI2dldFBsYWNlbWVudENvb3JkaW5hdGVzKGJvYXJkLCB2ZXJ0aWNhbCwgbGVuZ3RoKSB7XG4gICAgbGV0IHBvc3NpYmxlID0gW11cbiAgICBsZXQgdmFsaWQgPSBudWxsXG4gICAgaWYgKHZlcnRpY2FsKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwOyB4KyspIHtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMCAtIGxlbmd0aCArIDE7IHkrKykge1xuICAgICAgICAgIHZhbGlkID0gdHJ1ZVxuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGlmIChib2FyZC5ub3RFbXB0eSh4LCB5ICsgaykpIHtcbiAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlLnB1c2goW3gsIHldKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDEwOyB5KyspIHtcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMCAtIGxlbmd0aCArIDE7IHgrKykge1xuICAgICAgICAgIHZhbGlkID0gdHJ1ZVxuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGlmIChib2FyZC5ub3RFbXB0eSh4ICsgaywgeSkpIHtcbiAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlLnB1c2goW3gsIHldKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcG9zc2libGVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnBvc3NpYmxlLmxlbmd0aCldXG4gIH1cblxuICAjcmVzZXRNb3ZlcygpIHtcbiAgICBsZXQgcG9zc2libGVNb3ZlcyA9IFtdXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDsgKyt4KSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDEwOyArK3kpIHtcbiAgICAgICAgcG9zc2libGVNb3Zlcy5wdXNoKFt4LCB5XSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBvc3NpYmxlTW92ZXNcbiAgfVxufSIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcF9jbGFzcydcbmltcG9ydCBIdG1sIGZyb20gJy4vaHRtbCdcblxuY29uc3QgRU1QVFkgPSAnJ1xuY29uc3QgTUlTUyA9ICdvJ1xuY29uc3QgSElUID0gJ3gnXG5jb25zdCBTSElQID0gJ3MnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVCb2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYXJyYXkgPSB0aGlzLiNjbGVhcigpXG4gIH1cblxuICAjY2xlYXIoKSB7XG4gICAgcmV0dXJuIFsuLi5BcnJheSgxMCldLm1hcCgoKSA9PiBBcnJheSgxMCkuZmlsbChFTVBUWSkpXG4gIH1cblxuICBwbGFjZVNoaXAoeCwgeSwgbGVuZ3RoLCB2ZXJ0aWNhbCkge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChsZW5ndGgpXG4gICAgbGV0IGNvb3JkaW5hdGVzID0gW11cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAodmVydGljYWwpe1xuICAgICAgICB0aGlzLmFycmF5W3kgKyBpXVt4XSA9IFNISVBcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbeSArIGksIHhdKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuYXJyYXlbeV1beCArIGldID0gU0hJUFxuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFt5LCB4ICsgaV0pXG4gICAgICB9XG4gICAgfVxuICAgIHNoaXAuc2V0Q29vcmRpbmF0ZXMoY29vcmRpbmF0ZXMpXG4gIH1cblxuICByZWNlaXZlQXR0YWNrKHgsIHksIGJvYXJkKSB7XG4gICAgbGV0IGhpdCA9IGZhbHNlXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmFycmF5W3ldW3hdXG4gICAgaWYgKHZhbHVlID09IFNISVApIHtcbiAgICAgIHRoaXMuYXJyYXlbeV1beF0gPSBISVRcbiAgICAgIEh0bWwuaGl0KCcnK3kgKyB4LCBib2FyZClcbiAgICAgIFNoaXAuZmluZChbeSwgeF0pLmhpdCgpXG4gICAgICBoaXQgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXJyYXlbeV1beF0gPSBNSVNTXG4gICAgICBIdG1sLm1pc3MoJycreSArIHgsIGJvYXJkKVxuICAgIH1cbiAgICByZXR1cm4gaGl0XG4gIH1cblxuICBhbGxTaGlwc1N1bmsoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgKytpKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyArK2opIHtcbiAgICAgICAgaWYgKHRoaXMuYXJyYXlbaV1bal0gPT0gU0hJUClcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHZhbGlkTW92ZSh4LCB5KSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmFycmF5W3ldW3hdXG4gICAgcmV0dXJuIChwb3NpdGlvbiA9PSBFTVBUWSB8fCBwb3NpdGlvbiA9PSBTSElQKVxuICB9XG5cbiAgbm90RW1wdHkoeCwgeSkge1xuICAgIHJldHVybiB0aGlzLmFycmF5W3ldW3hdICE9IEVNUFRZXG4gIH1cbn0iLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gJy4vZ2FtZV9ib2FyZF9jbGFzcydcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9wbGF5ZXJfY2xhc3MnXG5pbXBvcnQgQ29tcHV0ZXIgZnJvbSAnLi9jb21wdXRlcl9jbGFzcydcbmltcG9ydCBIdG1sIGZyb20gJy4vaHRtbCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuI25ld1BsYXllcnNBbmRCb2FyZHMoKVxuICAgIHRoaXMuY29tcHV0ZXIgPSBuZXcgQ29tcHV0ZXIoKVxuXG4gICAgdGhpcy5zaGlwTGVuZ3RocyA9IFs1LCA0LCAzLCAzLCAyXVxuICAgIHRoaXMuI3BsYWNlU2hpcHMoKVxuICB9XG5cbiAgLy8gQ2FsbGVkIGZyb20gaHRtbC5qcyB3aGVuIGFsbCB0aGUgc2hpcHMgYXJlIHBsYWNlZFxuICBwbGF5KCkge1xuICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29tcHV0ZXJfYm9hcmQnKVxuICAgIGNvbXB1dGVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbnN0IHkgPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMF1cbiAgICAgICAgY29uc3QgeCA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVsxXVxuICAgICAgICBjb25zdCB5TnVtID0gTnVtYmVyKHkpXG4gICAgICAgIGNvbnN0IHhOdW0gPSBOdW1iZXIoeClcbiAgICAgICAgaWYgKHRoaXMuYm9hcmQyLnZhbGlkTW92ZSh4TnVtLCB5TnVtKSkge1xuICAgICAgICAgIHRoaXMuI21ha2VNb3Zlcyh4LCB5KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gICNtYWtlTW92ZXMoeCwgeSkge1xuICAgIGNvbnN0IHBsYXllckhpdCA9IHRoaXMucGxheWVyMS5tb3ZlKHgsIHkpIC8vIFJldHVybnMgdHJ1ZSBpZiBoaXRcbiAgICBpZiAoIXBsYXllckhpdCkge1xuICAgICAgLy8gQ29tcHV0ZXIgc2tpcHMgdHVybiBpZiB1c2VyIGhpdHNcbiAgICAgIGxldCBoaXQgPSBudWxsXG4gICAgICBkbyB7XG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gdGhpcy5jb21wdXRlci5nZXRDb29yZGluYXRlcygpXG4gICAgICAgIGhpdCA9IHRoaXMucGxheWVyMi5tb3ZlKGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSkgLy8gVHJ1ZSBpZiBoaXRcbiAgICAgICAgaWYgKGhpdCkge1xuICAgICAgICAgIGlmICh0aGlzLmJvYXJkMS5hbGxTaGlwc1N1bmsoKSkge1xuICAgICAgICAgICAgR2FtZS5vdmVyKHRoaXMucGxheWVyMi5uYW1lKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IHdoaWxlIChoaXQpXG4gICAgfSBlbHNlIHsgLy8gaWYgcGxheWVyIGhpdFxuICAgICAgaWYgKHRoaXMuYm9hcmQyLmFsbFNoaXBzU3VuaygpKSB7XG4gICAgICAgIEdhbWUub3Zlcih0aGlzLnBsYXllcjEubmFtZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gICNwbGFjZVNoaXBzKCkge1xuICAgIEh0bWwuZHJhZ1NoaXAodGhpcy5zaGlwTGVuZ3RocywgdGhpcywgdGhpcy5ib2FyZDEpXG4gICAgdGhpcy5jb21wdXRlci5wbGFjZVNoaXBzKHRoaXMuYm9hcmQyLCB0aGlzLnNoaXBMZW5ndGhzKVxuICB9XG5cbiAgc3RhdGljIG92ZXIod2lubmVyTmFtZSkge1xuICAgIEh0bWwub3Zlcih3aW5uZXJOYW1lKVxuICB9XG5cbiAgc3RhdGljIHJlc3RhcnQoKSB7XG4gICAgSHRtbC5yZXBvcHVsYXRlQm9hcmRzKClcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyJylcbiAgICBuZXcgR2FtZSgpXG4gIH1cblxuICAjbmV3UGxheWVyc0FuZEJvYXJkcygpIHtcbiAgICB0aGlzLmJvYXJkMSA9IG5ldyBHYW1lQm9hcmQoKVxuICAgIHRoaXMuYm9hcmQyID0gbmV3IEdhbWVCb2FyZCgpXG5cbiAgICB0aGlzLnBsYXllcjEgPSBuZXcgUGxheWVyKFwiUGxheWVyXCIsIHRoaXMuYm9hcmQyKVxuICAgIHRoaXMucGxheWVyMiA9IG5ldyBQbGF5ZXIoXCJDb21wdXRlclwiLCB0aGlzLmJvYXJkMSlcblxuICAgIGNvbnN0IG5hbWVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hbWUnKVxuICAgIG5hbWVzWzBdLnRleHRDb250ZW50ID0gdGhpcy5wbGF5ZXIxLm5hbWVcbiAgICBuYW1lc1sxXS50ZXh0Q29udGVudCA9IHRoaXMucGxheWVyMi5uYW1lXG4gIH1cbn0iLCJpbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lX2NsYXNzXCJcblxuY29uc3QgRU1QVFkgPSAnJ1xuY29uc3QgTUlTUyA9ICdvJ1xuY29uc3QgSElUID0gJ3gnXG5jb25zdCBTSElQID0gJ3MnXG5cbmxldCByb3RhdGVDYWxsZWQgPSBmYWxzZVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdG1sIHtcbiAgc3RhdGljIHBvcHVsYXRlQm9hcmRzKCkge1xuICAgIGZvciAobGV0IGkgPSA5OyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBjb25zdCBsaW5lMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBsaW5lLmNsYXNzTGlzdC5hZGQoJ2xpbmUnKVxuICAgICAgbGluZTIuY2xhc3NMaXN0LmFkZCgnbGluZScpXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgY29uc3Qgc3F1YXJlMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdzcXVhcmUnLCBpICsgJycgKyBqKVxuICAgICAgICBzcXVhcmUyLmNsYXNzTGlzdC5hZGQoJ3NxdWFyZScsIGkgKyAnJyArIGopXG4gICAgICAgIGxpbmUuYXBwZW5kQ2hpbGQoc3F1YXJlKVxuICAgICAgICBsaW5lMi5hcHBlbmRDaGlsZChzcXVhcmUyKVxuICAgICAgfVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllcl9ib2FyZCcpLmFwcGVuZENoaWxkKGxpbmUpXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29tcHV0ZXJfYm9hcmQnKS5hcHBlbmRDaGlsZChsaW5lMilcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgcmVwb3B1bGF0ZUJvYXJkcygpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyJylcbiAgICBjb250YWluZXIuc3R5bGVbXCJwb2ludGVyLWV2ZW50c1wiXSA9IFwiYXV0b1wiXG4gICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXJfYm9hcmQnKSlcbiAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbXB1dGVyX2JvYXJkJykpXG4gICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5uZXInKSlcbiAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgcGxheWVyQm9hcmQuY2xhc3NMaXN0LmFkZCgncGxheWVyX2JvYXJkJylcbiAgICBjb21wdXRlckJvYXJkLmNsYXNzTGlzdC5hZGQoJ2NvbXB1dGVyX2JvYXJkJylcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyQm9hcmQpXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbXB1dGVyQm9hcmQpXG4gICAgdGhpcy5wb3B1bGF0ZUJvYXJkcygpXG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZHJhZ1NoaXAobGVuZ3RocywgZ2FtZSwgYm9hcmQpIHtcbiAgICBsZXQgaW5kZXggPSAwXG4gICAgY29uc3QgbWF4SW5kZXggPSBsZW5ndGhzLmxlbmd0aFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb3RhdGUnKS50ZXh0Q29udGVudCA9ICdQcmVzcyBSIHRvIHJvdGF0ZSdcblxuICAgIGZ1bmN0aW9uIGJ1aWxkU2hpcCgpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aHNbaW5kZXhdXG4gICAgICBpbmRleCsrXG5cbiAgICAgIHNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKCdzaGlwJylcbiAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZCgndmVydGljYWwnKVxuICAgICAgc2hpcC5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsIHRydWUpXG4gICAgICB3aWR0aCA9IDMuNVxuICAgICAgaGVpZ2h0ID0gNS43ICogbGVuZ3RoXG4gICAgICBzaGlwLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6ICcrd2lkdGgrJ3Z3OyBoZWlnaHQ6ICcraGVpZ2h0Kyd2aDsnKVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzJykuYXBwZW5kQ2hpbGQoc2hpcClcbiAgICB9XG4gICAgbGV0IHNoaXAgPSBudWxsXG4gICAgbGV0IGxlbmd0aCA9IG51bGxcbiAgICBsZXQgd2lkdGggPSBudWxsXG4gICAgbGV0IGhlaWdodCA9IG51bGxcblxuICAgIGJ1aWxkU2hpcCgpXG4gICAgaWYgKCFyb3RhdGVDYWxsZWQpIHtcbiAgICAgIHJvdGF0ZUV2ZW50KClcbiAgICB9XG5cbiAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyX2JvYXJkXCIpO1xuICAgIFxuICAgIHNoaXAub25kcmFnc3RhcnQgPSBmdW5jdGlvbihlKXtcbiAgICAgIGUuZGF0YVRyYW5zZmVyLmNsZWFyRGF0YSgpO1xuICAgIH1cbiAgICBcbiAgICBwbGF5ZXJCb2FyZC5vbmRyYWdvdmVyID0gZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0WzFdKSB7XG4gICAgICAgIGxldCB5ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzBdXG4gICAgICAgIGxldCB4ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzFdXG4gICAgICAgIGlmICghc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkpIHtcbiAgICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LmFkZCgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHggPSAoTnVtYmVyKHgpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSB7XG4gICAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5hZGQoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5ID0gKE51bWJlcih5KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcGxheWVyQm9hcmQub25kcmFnbGVhdmUgPSBmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3RbMV0pIHtcbiAgICAgICAgbGV0IHkgPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMF1cbiAgICAgICAgbGV0IHggPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMV1cbiAgICAgICAgaWYgKCFzaGlwLmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pIHtcbiAgICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHggPSAoTnVtYmVyKHgpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSB7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeSA9IChOdW1iZXIoeSkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHJvdGF0ZUV2ZW50KCkge1xuICAgICAgcm90YXRlQ2FsbGVkID0gdHJ1ZVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQua2V5ID09ICdyJykge1xuICAgICAgICAgIGNvbnN0IHNoaXAxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAnKVxuICAgICAgICAgIGlmIChzaGlwMSkge1xuICAgICAgICAgICAgaWYgKHNoaXAxLmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSkge1xuICAgICAgICAgICAgICB3aWR0aCA9IDMuNSAqIGxlbmd0aFxuICAgICAgICAgICAgICBoZWlnaHQgPSA1LjdcbiAgICAgICAgICAgICAgc2hpcDEuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwnKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgd2lkdGggPSAzLjVcbiAgICAgICAgICAgICAgaGVpZ2h0ID0gNS43ICogbGVuZ3RoXG4gICAgICAgICAgICAgIHNoaXAxLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNoaXAxLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6ICcrd2lkdGgrJ3Z3OyBoZWlnaHQ6ICcraGVpZ2h0Kyd2aDsnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG5cbiAgICBwbGF5ZXJCb2FyZC5vbmRyb3AgPSBmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwidGV4dFwiKTtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcCcpXG4gICAgICBjb25zdCBzaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcycpXG4gICAgICBpZiAodmFsaWREcm9wKGVsZW1lbnQsIGUudGFyZ2V0LCBsZW5ndGgpKSB7XG4gICAgICAgIGxldCB5ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzBdXG4gICAgICAgIGxldCB4ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzFdXG4gICAgICAgIGJvYXJkLnBsYWNlU2hpcChOdW1iZXIoeCksIE51bWJlcih5KSwgbGVuZ3RoLCBzaGlwLmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSlcbiAgICAgICAgc2hpcHMucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIGlmICghc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LmFkZCgncGxhY2VkJyk7XG4gICAgICAgICAgICB4ID0gKE51bWJlcih4KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5hZGQoJ3BsYWNlZCcpO1xuICAgICAgICAgICAgeSA9IChOdW1iZXIoeSkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleCAhPSBtYXhJbmRleCkge1xuICAgICAgICAgIGJ1aWxkU2hpcCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJvdGF0ZScpLnRleHRDb250ZW50ID0gJydcbiAgICAgICAgICBnYW1lLnBsYXkoKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgeSA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVswXVxuICAgICAgICBsZXQgeCA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVsxXVxuICAgICAgICBzaGlwcy5hcHBlbmRDaGlsZChlbGVtZW50KVxuICAgICAgICBpZiAoIXNoaXAuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbCcpKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkge1xuICAgICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeCA9IChOdW1iZXIoeCkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pIHtcbiAgICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHkgPSAoTnVtYmVyKHkpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiB2YWxpZERyb3AoZWxlbWVudCwgcGVsZW1lbnQsIGxlbmd0aCkge1xuICAgICAgbGV0IHggPSBOdW1iZXIocGVsZW1lbnQuY2xhc3NMaXN0WzFdWzFdKVxuICAgICAgbGV0IHkgPSBOdW1iZXIocGVsZW1lbnQuY2xhc3NMaXN0WzFdWzBdKVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpIHtcbiAgICAgICAgICBpZiAoeSA+IDkgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnJyArIHkgKyB4KVswXS5jbGFzc0xpc3QuY29udGFpbnMoJ3BsYWNlZCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgeSArPSAxXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHggPiA5IHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJycgKyB5ICsgeClbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdwbGFjZWQnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHggKz0gMVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBoaXQoY2xhc3NOYW1lLCBib2FyZCkge1xuICAgIGNvbnN0IG5vZGUgPSBmaW5kTm9kZShjbGFzc05hbWUsIGJvYXJkKVxuICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgnaGl0JylcbiAgfVxuXG4gIHN0YXRpYyBtaXNzKGNsYXNzTmFtZSwgYm9hcmQpIHtcbiAgICBjb25zdCBub2RlID0gZmluZE5vZGUoY2xhc3NOYW1lLCBib2FyZClcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoJ21pc3MnKVxuICB9XG5cbiAgc3RhdGljIG92ZXIod2lubmVyTmFtZSkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKVxuICAgIGNvbnRhaW5lci5zdHlsZVtcInBvaW50ZXItZXZlbnRzXCJdID0gXCJub25lXCJcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGRpdi5jbGFzc0xpc3QuYWRkKCd3aW5uZXInKVxuICAgIGNvbnN0IGgxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKVxuICAgIGNvbnN0IHJlc3RhcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGgxLnRleHRDb250ZW50ID0gd2lubmVyTmFtZSArICcgaXMgdGhlIHdpbm5lciEnXG4gICAgcmVzdGFydC50ZXh0Q29udGVudCA9ICdSZXN0YXJ0J1xuICAgIHJlc3RhcnQuY2xhc3NMaXN0LmFkZCgncmVzdGFydCcpXG4gICAgcmVzdGFydC5zdHlsZVtcInBvaW50ZXItZXZlbnRzXCJdID0gXCJhdXRvXCJcbiAgICBkaXYuYXBwZW5kQ2hpbGQoaDEpXG4gICAgZGl2LmFwcGVuZENoaWxkKHJlc3RhcnQpXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdilcbiAgICByZXN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgR2FtZS5yZXN0YXJ0KClcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGZpbmROb2RlKGNsYXNzTmFtZSwgYm9hcmQpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBib2FyZC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChib2FyZC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXNbal0uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIGJvYXJkLmNoaWxkTm9kZXNbaV0uY2hpbGROb2Rlc1tqXVxuICAgICAgfVxuICAgIH1cbiAgfVxufSIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSAnLi9nYW1lX2JvYXJkX2NsYXNzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBlbmVteUJvYXJkKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHRoaXMuZW5lbXlCb2FyZCA9IGVuZW15Qm9hcmRcbiAgfVxuXG4gIG1vdmUoeCwgeSkge1xuICAgIGxldCBib2FyZCA9IG51bGxcbiAgICBpZiAodGhpcy5uYW1lID09ICdQbGF5ZXInKSB7XG4gICAgICBib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21wdXRlcl9ib2FyZCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllcl9ib2FyZCcpXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVuZW15Qm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5LCBib2FyZClcbiAgfVxufSIsImxldCBzaGlwcyA9IFtdXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aFxuICAgIHRoaXMuaGl0Q291bnQgPSAwXG4gIH1cbiAgXG4gIGhpdCgpIHtcbiAgICB0aGlzLmhpdENvdW50KytcbiAgfVxuICBcbiAgaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLmxlbmd0aCA9PSB0aGlzLmhpdENvdW50KVxuICAgIHJldHVybiB0cnVlXG4gIHJldHVybiBmYWxzZVxuICB9XG5cbiAgc2V0Q29vcmRpbmF0ZXMoY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXNcbiAgICBzaGlwcy5wdXNoKHRoaXMpXG4gIH1cblxuICBzdGF0aWMgZmluZChjb29yZGluYXRlcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspe1xuICAgICAgY29uc3Qgc2hpcCA9IHNoaXBzW2ldXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoOyBqKyspe1xuICAgICAgICBjb25zdCBjb29yZGluYXRlczIgPSBzaGlwLmNvb3JkaW5hdGVzW2pdXG4gICAgICAgIGlmIChjb29yZGluYXRlczJbMF0gPT0gY29vcmRpbmF0ZXNbMF0gJiYgY29vcmRpbmF0ZXMyWzFdID09IGNvb3JkaW5hdGVzWzFdKVxuICAgICAgICAgIHJldHVybiBzaGlwXG4gICAgICB9XG4gICAgfVxuICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZSBmcm9tICcuL2dhbWVfY2xhc3MnXG5pbXBvcnQgSHRtbCBmcm9tICcuL2h0bWwnXG5cbkh0bWwucG9wdWxhdGVCb2FyZHMoKVxubmV3IEdhbWUoKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
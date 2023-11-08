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
    this.board1 = new _game_board_class__WEBPACK_IMPORTED_MODULE_0__["default"]()
    this.board2 = new _game_board_class__WEBPACK_IMPORTED_MODULE_0__["default"]()

    this.player1 = new _player_class__WEBPACK_IMPORTED_MODULE_1__["default"]("Player", this.board2)
    this.player2 = new _player_class__WEBPACK_IMPORTED_MODULE_1__["default"]("Computer", this.board1)
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
const EMPTY = ''
const MISS = 'o'
const HIT = 'x'
const SHIP = 's'

const playerBoard = document.querySelector('.player_board')
const computerBoard = document.querySelector('.computer_board')
const container = document.querySelector('.container')
const ships = document.querySelector('.ships')

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
      playerBoard.appendChild(line)
      computerBoard.appendChild(line2)
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDakJBOztBQUVlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixrQkFBa0I7QUFDdEM7QUFDQSxzQkFBc0IsNkJBQTZCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUNqQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOK0I7QUFDTjs7QUFFekIsNkNBQUk7QUFDSixJQUFJLG1EQUFJLEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXB1dGVyX2NsYXNzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZV9ib2FyZF9jbGFzcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVfY2xhc3MuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9odG1sLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyX2NsYXNzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcF9jbGFzcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wdXRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zc2libGVNb3ZlcyA9IHRoaXMuI3Jlc2V0TW92ZXMoKVxuICB9XG5cbiAgZ2V0Q29vcmRpbmF0ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zc2libGVNb3Zlcy5zcGxpY2UoKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMucG9zc2libGVNb3Zlcy5sZW5ndGgpKSwgMSlbMF1cbiAgfVxuXG4gIHBsYWNlU2hpcHMoYm9hcmQsIHNoaXBMZW5ndGhzKSB7XG4gICAgc2hpcExlbmd0aHMuZm9yRWFjaCgobGVuZ3RoKSA9PiB7XG4gICAgICBjb25zdCB2ZXJ0aWNhbCA9IE1hdGgucmFuZG9tKCkgPiAwLjUgPyB0cnVlIDogZmFsc2VcbiAgICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gdGhpcy4jZ2V0UGxhY2VtZW50Q29vcmRpbmF0ZXMoYm9hcmQsIHZlcnRpY2FsLCBsZW5ndGgpXG4gICAgICBib2FyZC5wbGFjZVNoaXAoY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdLCBsZW5ndGgsIHZlcnRpY2FsKVxuICAgIH0pXG4gIH1cblxuICAjZ2V0UGxhY2VtZW50Q29vcmRpbmF0ZXMoYm9hcmQsIHZlcnRpY2FsLCBsZW5ndGgpIHtcbiAgICBsZXQgeCA9IG51bGxcbiAgICBsZXQgeSA9IG51bGxcbiAgICBsZXQgdmFsaWQgPSB0cnVlXG4gICAgZG8ge1xuICAgICAgaWYgKHZlcnRpY2FsKSB7XG4gICAgICAgIHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTApXG4gICAgICAgIGRvIHtcbiAgICAgICAgICB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjEwKSAtIGxlbmd0aCArIDFcbiAgICAgICAgfSB3aGlsZSh5IDwgMClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChib2FyZC5ub3RFbXB0eSh4LCB5ICsgaSkpIHtcbiAgICAgICAgICAgIHZhbGlkID0gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTApXG4gICAgICAgIGRvIHtcbiAgICAgICAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjEwKSAtIGxlbmd0aCArIDFcbiAgICAgICAgfSB3aGlsZSAoeCA8IDApXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoYm9hcmQubm90RW1wdHkoeCArIGksIHkpKSB7XG4gICAgICAgICAgICB2YWxpZCA9IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgcmV0dXJuIFt4LCB5XVxuICAgICAgfVxuICAgIH0gd2hpbGUodHJ1ZSlcbiAgfVxuXG4gICNyZXNldE1vdmVzKCkge1xuICAgIGxldCBwb3NzaWJsZU1vdmVzID0gW11cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwOyArK3gpIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTA7ICsreSkge1xuICAgICAgICBwb3NzaWJsZU1vdmVzLnB1c2goW3gsIHldKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcG9zc2libGVNb3Zlc1xuICB9XG59IiwiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwX2NsYXNzJ1xuaW1wb3J0IEh0bWwgZnJvbSAnLi9odG1sJ1xuXG5jb25zdCBFTVBUWSA9ICcnXG5jb25zdCBNSVNTID0gJ28nXG5jb25zdCBISVQgPSAneCdcbmNvbnN0IFNISVAgPSAncydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hcnJheSA9IHRoaXMuI2NsZWFyKClcbiAgfVxuXG4gICNjbGVhcigpIHtcbiAgICByZXR1cm4gWy4uLkFycmF5KDEwKV0ubWFwKCgpID0+IEFycmF5KDEwKS5maWxsKEVNUFRZKSlcbiAgfVxuXG4gIHBsYWNlU2hpcCh4LCB5LCBsZW5ndGgsIHZlcnRpY2FsKSB7XG4gICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKGxlbmd0aClcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSBbXVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmICh2ZXJ0aWNhbCl7XG4gICAgICAgIHRoaXMuYXJyYXlbeSArIGldW3hdID0gU0hJUFxuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFt5ICsgaSwgeF0pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5hcnJheVt5XVt4ICsgaV0gPSBTSElQXG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW3ksIHggKyBpXSlcbiAgICAgIH1cbiAgICB9XG4gICAgc2hpcC5zZXRDb29yZGluYXRlcyhjb29yZGluYXRlcylcbiAgfVxuXG4gIHJlY2VpdmVBdHRhY2soeCwgeSwgYm9hcmQpIHtcbiAgICBsZXQgaGl0ID0gZmFsc2VcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuYXJyYXlbeV1beF1cbiAgICBpZiAodmFsdWUgPT0gU0hJUCkge1xuICAgICAgdGhpcy5hcnJheVt5XVt4XSA9IEhJVFxuICAgICAgSHRtbC5oaXQoJycreSArIHgsIGJvYXJkKVxuICAgICAgU2hpcC5maW5kKFt5LCB4XSkuaGl0KClcbiAgICAgIGhpdCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hcnJheVt5XVt4XSA9IE1JU1NcbiAgICAgIEh0bWwubWlzcygnJyt5ICsgeCwgYm9hcmQpXG4gICAgfVxuICAgIHJldHVybiBoaXRcbiAgfVxuXG4gIGFsbFNoaXBzU3VuaygpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyArK2kpIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7ICsraikge1xuICAgICAgICBpZiAodGhpcy5hcnJheVtpXVtqXSA9PSBTSElQKVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgdmFsaWRNb3ZlKHgsIHkpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuYXJyYXlbeV1beF1cbiAgICByZXR1cm4gKHBvc2l0aW9uID09IEVNUFRZIHx8IHBvc2l0aW9uID09IFNISVApXG4gIH1cblxuICBub3RFbXB0eSh4LCB5KSB7XG4gICAgcmV0dXJuIHRoaXMuYXJyYXlbeV1beF0gIT0gRU1QVFlcbiAgfVxufSIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSAnLi9nYW1lX2JvYXJkX2NsYXNzJ1xuaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcl9jbGFzcydcbmltcG9ydCBDb21wdXRlciBmcm9tICcuL2NvbXB1dGVyX2NsYXNzJ1xuaW1wb3J0IEh0bWwgZnJvbSAnLi9odG1sJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ib2FyZDEgPSBuZXcgR2FtZUJvYXJkKClcbiAgICB0aGlzLmJvYXJkMiA9IG5ldyBHYW1lQm9hcmQoKVxuXG4gICAgdGhpcy5wbGF5ZXIxID0gbmV3IFBsYXllcihcIlBsYXllclwiLCB0aGlzLmJvYXJkMilcbiAgICB0aGlzLnBsYXllcjIgPSBuZXcgUGxheWVyKFwiQ29tcHV0ZXJcIiwgdGhpcy5ib2FyZDEpXG4gICAgdGhpcy5jb21wdXRlciA9IG5ldyBDb21wdXRlcigpXG5cbiAgICB0aGlzLnNoaXBMZW5ndGhzID0gWzVdXG4gICAgdGhpcy4jcGxhY2VTaGlwcygpXG4gIH1cblxuICAvLyBDYWxsZWQgZnJvbSBodG1sLmpzIHdoZW4gYWxsIHRoZSBzaGlwcyBhcmUgcGxhY2VkXG4gIHBsYXkoKSB7XG4gICAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21wdXRlcl9ib2FyZCcpXG4gICAgY29tcHV0ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3QgeSA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVswXVxuICAgICAgICBjb25zdCB4ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzFdXG4gICAgICAgIGNvbnN0IHlOdW0gPSBOdW1iZXIoeSlcbiAgICAgICAgY29uc3QgeE51bSA9IE51bWJlcih4KVxuICAgICAgICBpZiAodGhpcy5ib2FyZDIudmFsaWRNb3ZlKHhOdW0sIHlOdW0pKSB7XG4gICAgICAgICAgdGhpcy4jbWFrZU1vdmVzKHgsIHkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgI21ha2VNb3Zlcyh4LCB5KSB7XG4gICAgY29uc3QgcGxheWVySGl0ID0gdGhpcy5wbGF5ZXIxLm1vdmUoeCwgeSkgLy8gUmV0dXJucyB0cnVlIGlmIGhpdFxuICAgIGlmICghcGxheWVySGl0KSB7XG4gICAgICAvLyBDb21wdXRlciBza2lwcyB0dXJuIGlmIHVzZXIgaGl0c1xuICAgICAgbGV0IGhpdCA9IG51bGxcbiAgICAgIGRvIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0aGlzLmNvbXB1dGVyLmdldENvb3JkaW5hdGVzKClcbiAgICAgICAgaGl0ID0gdGhpcy5wbGF5ZXIyLm1vdmUoY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSAvLyBUcnVlIGlmIGhpdFxuICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgaWYgKHRoaXMuYm9hcmQxLmFsbFNoaXBzU3VuaygpKSB7XG4gICAgICAgICAgICBHYW1lLm92ZXIodGhpcy5wbGF5ZXIyLm5hbWUpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKGhpdClcbiAgICB9IGVsc2UgeyAvLyBpZiBwbGF5ZXIgaGl0XG4gICAgICBpZiAodGhpcy5ib2FyZDIuYWxsU2hpcHNTdW5rKCkpIHtcbiAgICAgICAgR2FtZS5vdmVyKHRoaXMucGxheWVyMS5uYW1lKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgI3BsYWNlU2hpcHMoKSB7XG4gICAgSHRtbC5kcmFnU2hpcCh0aGlzLnNoaXBMZW5ndGhzLCB0aGlzLCB0aGlzLmJvYXJkMSlcbiAgICB0aGlzLmNvbXB1dGVyLnBsYWNlU2hpcHModGhpcy5ib2FyZDIsIHRoaXMuc2hpcExlbmd0aHMpXG4gICAgY29uc29sZS5sb2codGhpcy5ib2FyZDIpXG4gIH1cblxuICBzdGF0aWMgb3Zlcih3aW5uZXJOYW1lKSB7XG4gICAgSHRtbC5vdmVyKHdpbm5lck5hbWUpXG4gIH1cbn0iLCJjb25zdCBFTVBUWSA9ICcnXG5jb25zdCBNSVNTID0gJ28nXG5jb25zdCBISVQgPSAneCdcbmNvbnN0IFNISVAgPSAncydcblxuY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyX2JvYXJkJylcbmNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29tcHV0ZXJfYm9hcmQnKVxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lcicpXG5jb25zdCBzaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcycpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh0bWwge1xuICBzdGF0aWMgcG9wdWxhdGVCb2FyZHMoKSB7XG4gICAgZm9yIChsZXQgaSA9IDk7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGNvbnN0IGxpbmUyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGxpbmUuY2xhc3NMaXN0LmFkZCgnbGluZScpXG4gICAgICBsaW5lMi5jbGFzc0xpc3QuYWRkKCdsaW5lJylcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBjb25zdCBzcXVhcmUyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ3NxdWFyZScsIGkgKyAnJyArIGopXG4gICAgICAgIHNxdWFyZTIuY2xhc3NMaXN0LmFkZCgnc3F1YXJlJywgaSArICcnICsgailcbiAgICAgICAgbGluZS5hcHBlbmRDaGlsZChzcXVhcmUpXG4gICAgICAgIGxpbmUyLmFwcGVuZENoaWxkKHNxdWFyZTIpXG4gICAgICB9XG4gICAgICBwbGF5ZXJCb2FyZC5hcHBlbmRDaGlsZChsaW5lKVxuICAgICAgY29tcHV0ZXJCb2FyZC5hcHBlbmRDaGlsZChsaW5lMilcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZHJhZ1NoaXAobGVuZ3RocywgZ2FtZSwgYm9hcmQpIHtcbiAgICBsZXQgaW5kZXggPSAwXG4gICAgY29uc3QgbWF4SW5kZXggPSBsZW5ndGhzLmxlbmd0aFxuXG4gICAgZnVuY3Rpb24gYnVpbGRTaGlwKCkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3Roc1tpbmRleF1cbiAgICAgIGluZGV4KytcblxuICAgICAgc2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKVxuICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpXG4gICAgICBzaGlwLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgdHJ1ZSlcbiAgICAgIHdpZHRoID0gNFxuICAgICAgaGVpZ2h0ID0gNi43ICogbGVuZ3RoXG4gICAgICBzaGlwLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6ICcrd2lkdGgrJ3Z3OyBoZWlnaHQ6ICcraGVpZ2h0Kyd2aDsnKVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzJykuYXBwZW5kQ2hpbGQoc2hpcClcbiAgICB9XG4gICAgbGV0IHNoaXAgPSBudWxsXG4gICAgbGV0IGxlbmd0aCA9IG51bGxcbiAgICBsZXQgd2lkdGggPSBudWxsXG4gICAgbGV0IGhlaWdodCA9IG51bGxcblxuICAgIGJ1aWxkU2hpcCgpXG5cbiAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyX2JvYXJkXCIpO1xuICAgIFxuICAgIHNoaXAub25kcmFnc3RhcnQgPSBmdW5jdGlvbihlKXtcbiAgICAgIGUuZGF0YVRyYW5zZmVyLmNsZWFyRGF0YSgpO1xuICAgIH1cbiAgICBcbiAgICBwbGF5ZXJCb2FyZC5vbmRyYWdvdmVyID0gZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0WzFdKSB7XG4gICAgICAgIGxldCB5ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzBdXG4gICAgICAgIGxldCB4ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzFdXG4gICAgICAgIGlmICghc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkpIHtcbiAgICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LmFkZCgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHggPSAoTnVtYmVyKHgpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSB7XG4gICAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5hZGQoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5ID0gKE51bWJlcih5KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcGxheWVyQm9hcmQub25kcmFnbGVhdmUgPSBmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3RbMV0pIHtcbiAgICAgICAgbGV0IHkgPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMF1cbiAgICAgICAgbGV0IHggPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMV1cbiAgICAgICAgaWYgKCFzaGlwLmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pIHtcbiAgICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHggPSAoTnVtYmVyKHgpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSB7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeSA9IChOdW1iZXIoeSkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT0gJ3InKSB7XG4gICAgICAgIGNvbnN0IHNoaXAxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAnKVxuICAgICAgICBpZiAoc2hpcDEpIHtcbiAgICAgICAgICBpZiAoc2hpcDEuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbCcpKSB7XG4gICAgICAgICAgICB3aWR0aCA9IDQgKiBsZW5ndGhcbiAgICAgICAgICAgIGhlaWdodCA9IDYuN1xuICAgICAgICAgICAgc2hpcDEuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwnKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aWR0aCA9IDRcbiAgICAgICAgICAgIGhlaWdodCA9IDYuNyAqIGxlbmd0aFxuICAgICAgICAgICAgc2hpcDEuY2xhc3NMaXN0LmFkZCgndmVydGljYWwnKVxuICAgICAgICAgIH1cbiAgICAgICAgICBzaGlwMS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAnK3dpZHRoKyd2dzsgaGVpZ2h0OiAnK2hlaWdodCsndmg7Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCBmYWxzZSk7XG4gICAgXG4gICAgcGxheWVyQm9hcmQub25kcm9wID0gZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBkYXRhID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHRcIik7XG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAnKVxuICAgICAgY29uc3Qgc2hpcHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcHMnKVxuICAgICAgaWYgKHZhbGlkRHJvcChlbGVtZW50LCBlLnRhcmdldCwgbGVuZ3RoKSkge1xuICAgICAgICBsZXQgeSA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVswXVxuICAgICAgICBsZXQgeCA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVsxXVxuICAgICAgICBib2FyZC5wbGFjZVNoaXAoTnVtYmVyKHgpLCBOdW1iZXIoeSksIGxlbmd0aCwgc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpXG4gICAgICAgIHNoaXBzLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgICBpZiAoIXNoaXAuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbCcpKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5hZGQoJ3BsYWNlZCcpO1xuICAgICAgICAgICAgeCA9IChOdW1iZXIoeCkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QuYWRkKCdwbGFjZWQnKTtcbiAgICAgICAgICAgIHkgPSAoTnVtYmVyKHkpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXggIT0gbWF4SW5kZXgpIHtcbiAgICAgICAgICBidWlsZFNoaXAoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdhbWUucGxheSgpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB5ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzBdXG4gICAgICAgIGxldCB4ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzFdXG4gICAgICAgIHNoaXBzLmFwcGVuZENoaWxkKGVsZW1lbnQpXG4gICAgICAgIGlmICghc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSB7XG4gICAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB4ID0gKE51bWJlcih4KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkge1xuICAgICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeSA9IChOdW1iZXIoeSkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHZhbGlkRHJvcChlbGVtZW50LCBwZWxlbWVudCwgbGVuZ3RoKSB7XG4gICAgICBsZXQgeCA9IE51bWJlcihwZWxlbWVudC5jbGFzc0xpc3RbMV1bMV0pXG4gICAgICBsZXQgeSA9IE51bWJlcihwZWxlbWVudC5jbGFzc0xpc3RbMV1bMF0pXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSkge1xuICAgICAgICAgIGlmICh5ID4gOSB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCcnICsgeSArIHgpWzBdLmNsYXNzTGlzdC5jb250YWlucygncGxhY2VkJykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICB5ICs9IDFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoeCA+IDkgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnJyArIHkgKyB4KVswXS5jbGFzc0xpc3QuY29udGFpbnMoJ3BsYWNlZCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgeCArPSAxXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGhpdChjbGFzc05hbWUsIGJvYXJkKSB7XG4gICAgY29uc3Qgbm9kZSA9IGZpbmROb2RlKGNsYXNzTmFtZSwgYm9hcmQpXG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKCdoaXQnKVxuICB9XG5cbiAgc3RhdGljIG1pc3MoY2xhc3NOYW1lLCBib2FyZCkge1xuICAgIGNvbnN0IG5vZGUgPSBmaW5kTm9kZShjbGFzc05hbWUsIGJvYXJkKVxuICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgnbWlzcycpXG4gIH1cblxuICBzdGF0aWMgb3Zlcih3aW5uZXJOYW1lKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lcicpXG4gICAgY29udGFpbmVyLnN0eWxlW1wicG9pbnRlci1ldmVudHNcIl0gPSBcIm5vbmVcIlxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ3dpbm5lcicpXG4gICAgY29uc3QgaDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpXG4gICAgY29uc3QgcmVzdGFydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgaDEudGV4dENvbnRlbnQgPSB3aW5uZXJOYW1lICsgJyBpcyB0aGUgd2lubmVyISdcbiAgICByZXN0YXJ0LnRleHRDb250ZW50ID0gJ1Jlc3RhcnQnXG4gICAgcmVzdGFydC5jbGFzc0xpc3QuYWRkKCdyZXN0YXJ0JylcbiAgICByZXN0YXJ0LnN0eWxlW1wicG9pbnRlci1ldmVudHNcIl0gPSBcImF1dG9cIlxuICAgIGRpdi5hcHBlbmRDaGlsZChoMSlcbiAgICBkaXYuYXBwZW5kQ2hpbGQocmVzdGFydClcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KVxuICB9XG59XG5cbmZ1bmN0aW9uIGZpbmROb2RlKGNsYXNzTmFtZSwgYm9hcmQpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBib2FyZC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChib2FyZC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXNbal0uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIGJvYXJkLmNoaWxkTm9kZXNbaV0uY2hpbGROb2Rlc1tqXVxuICAgICAgfVxuICAgIH1cbiAgfVxufSIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSAnLi9nYW1lX2JvYXJkX2NsYXNzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBlbmVteUJvYXJkKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHRoaXMuZW5lbXlCb2FyZCA9IGVuZW15Qm9hcmRcbiAgfVxuXG4gIG1vdmUoeCwgeSkge1xuICAgIGxldCBib2FyZCA9IG51bGxcbiAgICBpZiAodGhpcy5uYW1lID09ICdQbGF5ZXInKSB7XG4gICAgICBib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21wdXRlcl9ib2FyZCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllcl9ib2FyZCcpXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVuZW15Qm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5LCBib2FyZClcbiAgfVxufSIsImxldCBzaGlwcyA9IFtdXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aFxuICAgIHRoaXMuaGl0Q291bnQgPSAwXG4gIH1cbiAgXG4gIGhpdCgpIHtcbiAgICB0aGlzLmhpdENvdW50KytcbiAgfVxuICBcbiAgaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLmxlbmd0aCA9PSB0aGlzLmhpdENvdW50KVxuICAgIHJldHVybiB0cnVlXG4gIHJldHVybiBmYWxzZVxuICB9XG5cbiAgc2V0Q29vcmRpbmF0ZXMoY29vcmRpbmF0ZXMpIHtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXNcbiAgICBzaGlwcy5wdXNoKHRoaXMpXG4gIH1cblxuICBzdGF0aWMgZmluZChjb29yZGluYXRlcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspe1xuICAgICAgY29uc3Qgc2hpcCA9IHNoaXBzW2ldXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoOyBqKyspe1xuICAgICAgICBjb25zdCBjb29yZGluYXRlczIgPSBzaGlwLmNvb3JkaW5hdGVzW2pdXG4gICAgICAgIGlmIChjb29yZGluYXRlczJbMF0gPT0gY29vcmRpbmF0ZXNbMF0gJiYgY29vcmRpbmF0ZXMyWzFdID09IGNvb3JkaW5hdGVzWzFdKVxuICAgICAgICAgIHJldHVybiBzaGlwXG4gICAgICB9XG4gICAgfVxuICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZSBmcm9tICcuL2dhbWVfY2xhc3MnXG5pbXBvcnQgSHRtbCBmcm9tICcuL2h0bWwnXG5cbkh0bWwucG9wdWxhdGVCb2FyZHMoKVxubmV3IEdhbWUoKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
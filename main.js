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
    return this.possibleMoves.splice((Math.floor(Math.random() * 100)), 1)
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
    const value = this.array[y][x]
    if (value == SHIP) {
      this.array[y][x] = HIT
      _html__WEBPACK_IMPORTED_MODULE_1__["default"].hit(''+y + x, board)
      _ship_class__WEBPACK_IMPORTED_MODULE_0__["default"].find([y, x]).hit()
    } else {
      this.array[y][x] = MISS
      _html__WEBPACK_IMPORTED_MODULE_1__["default"].miss(''+y + x, board)
    }
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
          this.player1.move(x, y)
          console.log('good')
        }
      }
    })
  }
  
  #placeShips() {
    _html__WEBPACK_IMPORTED_MODULE_3__["default"].dragShip(this.shipLengths, this, this.board1)
    this.computer.placeShips(this.board2, this.shipLengths)
    console.log(this.board2)
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
    this.enemyBoard.receiveAttack(x, y, board)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7Ozs7VUNqQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOK0I7QUFDTjs7QUFFekIsNkNBQUk7QUFDSixJQUFJLG1EQUFJLEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXB1dGVyX2NsYXNzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZV9ib2FyZF9jbGFzcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVfY2xhc3MuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9odG1sLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyX2NsYXNzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcF9jbGFzcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wdXRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zc2libGVNb3ZlcyA9IHRoaXMuI3Jlc2V0TW92ZXMoKVxuICB9XG5cbiAgZ2V0Q29vcmRpbmF0ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zc2libGVNb3Zlcy5zcGxpY2UoKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkpLCAxKVxuICB9XG5cbiAgcGxhY2VTaGlwcyhib2FyZCwgc2hpcExlbmd0aHMpIHtcbiAgICBzaGlwTGVuZ3Rocy5mb3JFYWNoKChsZW5ndGgpID0+IHtcbiAgICAgIGNvbnN0IHZlcnRpY2FsID0gTWF0aC5yYW5kb20oKSA+IDAuNSA/IHRydWUgOiBmYWxzZVxuICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0aGlzLiNnZXRQbGFjZW1lbnRDb29yZGluYXRlcyhib2FyZCwgdmVydGljYWwsIGxlbmd0aClcbiAgICAgIGJvYXJkLnBsYWNlU2hpcChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0sIGxlbmd0aCwgdmVydGljYWwpXG4gICAgfSlcbiAgfVxuXG4gICNnZXRQbGFjZW1lbnRDb29yZGluYXRlcyhib2FyZCwgdmVydGljYWwsIGxlbmd0aCkge1xuICAgIGxldCB4ID0gbnVsbFxuICAgIGxldCB5ID0gbnVsbFxuICAgIGxldCB2YWxpZCA9IHRydWVcbiAgICBkbyB7XG4gICAgICBpZiAodmVydGljYWwpIHtcbiAgICAgICAgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMClcbiAgICAgICAgZG8ge1xuICAgICAgICAgIHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTApIC0gbGVuZ3RoICsgMVxuICAgICAgICB9IHdoaWxlKHkgPCAwKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGJvYXJkLm5vdEVtcHR5KHgsIHkgKyBpKSkge1xuICAgICAgICAgICAgdmFsaWQgPSBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMClcbiAgICAgICAgZG8ge1xuICAgICAgICAgIHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTApIC0gbGVuZ3RoICsgMVxuICAgICAgICB9IHdoaWxlICh4IDwgMClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChib2FyZC5ub3RFbXB0eSh4ICsgaSwgeSkpIHtcbiAgICAgICAgICAgIHZhbGlkID0gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICByZXR1cm4gW3gsIHldXG4gICAgICB9XG4gICAgfSB3aGlsZSh0cnVlKVxuICB9XG5cbiAgI3Jlc2V0TW92ZXMoKSB7XG4gICAgbGV0IHBvc3NpYmxlTW92ZXMgPSBbXVxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTA7ICsreCkge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMDsgKyt5KSB7XG4gICAgICAgIHBvc3NpYmxlTW92ZXMucHVzaChbeCwgeV0pXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwb3NzaWJsZU1vdmVzXG4gIH1cbn0iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXBfY2xhc3MnXG5pbXBvcnQgSHRtbCBmcm9tICcuL2h0bWwnXG5cbmNvbnN0IEVNUFRZID0gJydcbmNvbnN0IE1JU1MgPSAnbydcbmNvbnN0IEhJVCA9ICd4J1xuY29uc3QgU0hJUCA9ICdzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFycmF5ID0gdGhpcy4jY2xlYXIoKVxuICB9XG5cbiAgI2NsZWFyKCkge1xuICAgIHJldHVybiBbLi4uQXJyYXkoMTApXS5tYXAoKCkgPT4gQXJyYXkoMTApLmZpbGwoRU1QVFkpKVxuICB9XG5cbiAgcGxhY2VTaGlwKHgsIHksIGxlbmd0aCwgdmVydGljYWwpIHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAobGVuZ3RoKVxuICAgIGxldCBjb29yZGluYXRlcyA9IFtdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKHZlcnRpY2FsKXtcbiAgICAgICAgdGhpcy5hcnJheVt5ICsgaV1beF0gPSBTSElQXG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW3kgKyBpLCB4XSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmFycmF5W3ldW3ggKyBpXSA9IFNISVBcbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbeSwgeCArIGldKVxuICAgICAgfVxuICAgIH1cbiAgICBzaGlwLnNldENvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKVxuICB9XG5cbiAgcmVjZWl2ZUF0dGFjayh4LCB5LCBib2FyZCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5hcnJheVt5XVt4XVxuICAgIGlmICh2YWx1ZSA9PSBTSElQKSB7XG4gICAgICB0aGlzLmFycmF5W3ldW3hdID0gSElUXG4gICAgICBIdG1sLmhpdCgnJyt5ICsgeCwgYm9hcmQpXG4gICAgICBTaGlwLmZpbmQoW3ksIHhdKS5oaXQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFycmF5W3ldW3hdID0gTUlTU1xuICAgICAgSHRtbC5taXNzKCcnK3kgKyB4LCBib2FyZClcbiAgICB9XG4gIH1cblxuICBhbGxTaGlwc1N1bmsoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgKytpKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyArK2opIHtcbiAgICAgICAgaWYgKHRoaXMuYXJyYXlbaV1bal0gPT0gU0hJUClcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHZhbGlkTW92ZSh4LCB5KSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmFycmF5W3ldW3hdXG4gICAgcmV0dXJuIChwb3NpdGlvbiA9PSBFTVBUWSB8fCBwb3NpdGlvbiA9PSBTSElQKVxuICB9XG5cbiAgbm90RW1wdHkoeCwgeSkge1xuICAgIHJldHVybiB0aGlzLmFycmF5W3ldW3hdICE9IEVNUFRZXG4gIH1cbn0iLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gJy4vZ2FtZV9ib2FyZF9jbGFzcydcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9wbGF5ZXJfY2xhc3MnXG5pbXBvcnQgQ29tcHV0ZXIgZnJvbSAnLi9jb21wdXRlcl9jbGFzcydcbmltcG9ydCBIdG1sIGZyb20gJy4vaHRtbCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYm9hcmQxID0gbmV3IEdhbWVCb2FyZCgpXG4gICAgdGhpcy5ib2FyZDIgPSBuZXcgR2FtZUJvYXJkKClcblxuICAgIHRoaXMucGxheWVyMSA9IG5ldyBQbGF5ZXIoXCJQbGF5ZXJcIiwgdGhpcy5ib2FyZDIpXG4gICAgdGhpcy5wbGF5ZXIyID0gbmV3IFBsYXllcihcIkNvbXB1dGVyXCIsIHRoaXMuYm9hcmQxKVxuICAgIHRoaXMuY29tcHV0ZXIgPSBuZXcgQ29tcHV0ZXIoKVxuXG4gICAgdGhpcy5zaGlwTGVuZ3RocyA9IFs1XVxuICAgIHRoaXMuI3BsYWNlU2hpcHMoKVxuICB9XG5cbiAgLy8gQ2FsbGVkIGZyb20gaHRtbC5qcyB3aGVuIGFsbCB0aGUgc2hpcHMgYXJlIHBsYWNlZFxuICBwbGF5KCkge1xuICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29tcHV0ZXJfYm9hcmQnKVxuICAgIGNvbXB1dGVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbnN0IHkgPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMF1cbiAgICAgICAgY29uc3QgeCA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVsxXVxuICAgICAgICBjb25zdCB5TnVtID0gTnVtYmVyKHkpXG4gICAgICAgIGNvbnN0IHhOdW0gPSBOdW1iZXIoeClcbiAgICAgICAgaWYgKHRoaXMuYm9hcmQyLnZhbGlkTW92ZSh4TnVtLCB5TnVtKSkge1xuICAgICAgICAgIHRoaXMucGxheWVyMS5tb3ZlKHgsIHkpXG4gICAgICAgICAgY29uc29sZS5sb2coJ2dvb2QnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBcbiAgI3BsYWNlU2hpcHMoKSB7XG4gICAgSHRtbC5kcmFnU2hpcCh0aGlzLnNoaXBMZW5ndGhzLCB0aGlzLCB0aGlzLmJvYXJkMSlcbiAgICB0aGlzLmNvbXB1dGVyLnBsYWNlU2hpcHModGhpcy5ib2FyZDIsIHRoaXMuc2hpcExlbmd0aHMpXG4gICAgY29uc29sZS5sb2codGhpcy5ib2FyZDIpXG4gIH1cbn0iLCJjb25zdCBFTVBUWSA9ICcnXG5jb25zdCBNSVNTID0gJ28nXG5jb25zdCBISVQgPSAneCdcbmNvbnN0IFNISVAgPSAncydcblxuY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyX2JvYXJkJylcbmNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29tcHV0ZXJfYm9hcmQnKVxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lcicpXG5jb25zdCBzaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcycpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh0bWwge1xuICBzdGF0aWMgcG9wdWxhdGVCb2FyZHMoKSB7XG4gICAgZm9yIChsZXQgaSA9IDk7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGNvbnN0IGxpbmUyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGxpbmUuY2xhc3NMaXN0LmFkZCgnbGluZScpXG4gICAgICBsaW5lMi5jbGFzc0xpc3QuYWRkKCdsaW5lJylcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBjb25zdCBzcXVhcmUyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ3NxdWFyZScsIGkgKyAnJyArIGopXG4gICAgICAgIHNxdWFyZTIuY2xhc3NMaXN0LmFkZCgnc3F1YXJlJywgaSArICcnICsgailcbiAgICAgICAgbGluZS5hcHBlbmRDaGlsZChzcXVhcmUpXG4gICAgICAgIGxpbmUyLmFwcGVuZENoaWxkKHNxdWFyZTIpXG4gICAgICB9XG4gICAgICBwbGF5ZXJCb2FyZC5hcHBlbmRDaGlsZChsaW5lKVxuICAgICAgY29tcHV0ZXJCb2FyZC5hcHBlbmRDaGlsZChsaW5lMilcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZHJhZ1NoaXAobGVuZ3RocywgZ2FtZSwgYm9hcmQpIHtcbiAgICBsZXQgaW5kZXggPSAwXG4gICAgY29uc3QgbWF4SW5kZXggPSBsZW5ndGhzLmxlbmd0aFxuXG4gICAgZnVuY3Rpb24gYnVpbGRTaGlwKCkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3Roc1tpbmRleF1cbiAgICAgIGluZGV4KytcblxuICAgICAgc2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKVxuICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpXG4gICAgICBzaGlwLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgdHJ1ZSlcbiAgICAgIHdpZHRoID0gNFxuICAgICAgaGVpZ2h0ID0gNi43ICogbGVuZ3RoXG4gICAgICBzaGlwLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6ICcrd2lkdGgrJ3Z3OyBoZWlnaHQ6ICcraGVpZ2h0Kyd2aDsnKVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzJykuYXBwZW5kQ2hpbGQoc2hpcClcbiAgICB9XG4gICAgbGV0IHNoaXAgPSBudWxsXG4gICAgbGV0IGxlbmd0aCA9IG51bGxcbiAgICBsZXQgd2lkdGggPSBudWxsXG4gICAgbGV0IGhlaWdodCA9IG51bGxcblxuICAgIGJ1aWxkU2hpcCgpXG5cbiAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyX2JvYXJkXCIpO1xuICAgIFxuICAgIHNoaXAub25kcmFnc3RhcnQgPSBmdW5jdGlvbihlKXtcbiAgICAgIGUuZGF0YVRyYW5zZmVyLmNsZWFyRGF0YSgpO1xuICAgIH1cbiAgICBcbiAgICBwbGF5ZXJCb2FyZC5vbmRyYWdvdmVyID0gZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0WzFdKSB7XG4gICAgICAgIGxldCB5ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzBdXG4gICAgICAgIGxldCB4ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzFdXG4gICAgICAgIGlmICghc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkpIHtcbiAgICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LmFkZCgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHggPSAoTnVtYmVyKHgpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSB7XG4gICAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5hZGQoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5ID0gKE51bWJlcih5KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcGxheWVyQm9hcmQub25kcmFnbGVhdmUgPSBmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3RbMV0pIHtcbiAgICAgICAgbGV0IHkgPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMF1cbiAgICAgICAgbGV0IHggPSBlLnRhcmdldC5jbGFzc0xpc3RbMV1bMV1cbiAgICAgICAgaWYgKCFzaGlwLmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pIHtcbiAgICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHggPSAoTnVtYmVyKHgpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSB7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeSA9IChOdW1iZXIoeSkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT0gJ3InKSB7XG4gICAgICAgIGNvbnN0IHNoaXAxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAnKVxuICAgICAgICBpZiAoc2hpcDEpIHtcbiAgICAgICAgICBpZiAoc2hpcDEuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbCcpKSB7XG4gICAgICAgICAgICB3aWR0aCA9IDQgKiBsZW5ndGhcbiAgICAgICAgICAgIGhlaWdodCA9IDYuN1xuICAgICAgICAgICAgc2hpcDEuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwnKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aWR0aCA9IDRcbiAgICAgICAgICAgIGhlaWdodCA9IDYuNyAqIGxlbmd0aFxuICAgICAgICAgICAgc2hpcDEuY2xhc3NMaXN0LmFkZCgndmVydGljYWwnKVxuICAgICAgICAgIH1cbiAgICAgICAgICBzaGlwMS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOiAnK3dpZHRoKyd2dzsgaGVpZ2h0OiAnK2hlaWdodCsndmg7Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCBmYWxzZSk7XG4gICAgXG4gICAgcGxheWVyQm9hcmQub25kcm9wID0gZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBkYXRhID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHRcIik7XG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAnKVxuICAgICAgY29uc3Qgc2hpcHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcHMnKVxuICAgICAgaWYgKHZhbGlkRHJvcChlbGVtZW50LCBlLnRhcmdldCwgbGVuZ3RoKSkge1xuICAgICAgICBsZXQgeSA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVswXVxuICAgICAgICBsZXQgeCA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXVsxXVxuICAgICAgICBib2FyZC5wbGFjZVNoaXAoTnVtYmVyKHgpLCBOdW1iZXIoeSksIGxlbmd0aCwgc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpXG4gICAgICAgIHNoaXBzLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgICBpZiAoIXNoaXAuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbCcpKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5hZGQoJ3BsYWNlZCcpO1xuICAgICAgICAgICAgeCA9IChOdW1iZXIoeCkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QuYWRkKCdwbGFjZWQnKTtcbiAgICAgICAgICAgIHkgPSAoTnVtYmVyKHkpICsgMSkudG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXggIT0gbWF4SW5kZXgpIHtcbiAgICAgICAgICBidWlsZFNoaXAoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdhbWUucGxheSgpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB5ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzBdXG4gICAgICAgIGxldCB4ID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdWzFdXG4gICAgICAgIHNoaXBzLmFwcGVuZENoaWxkKGVsZW1lbnQpXG4gICAgICAgIGlmICghc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsJykpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKSB7XG4gICAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHkreClbMF0pLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB4ID0gKE51bWJlcih4KSArIDEpLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoeSt4KVswXSkge1xuICAgICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh5K3gpWzBdKS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeSA9IChOdW1iZXIoeSkgKyAxKS50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHZhbGlkRHJvcChlbGVtZW50LCBwZWxlbWVudCwgbGVuZ3RoKSB7XG4gICAgICBsZXQgeCA9IE51bWJlcihwZWxlbWVudC5jbGFzc0xpc3RbMV1bMV0pXG4gICAgICBsZXQgeSA9IE51bWJlcihwZWxlbWVudC5jbGFzc0xpc3RbMV1bMF0pXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwnKSkge1xuICAgICAgICAgIGlmICh5ID4gOSB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCcnICsgeSArIHgpWzBdLmNsYXNzTGlzdC5jb250YWlucygncGxhY2VkJykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICB5ICs9IDFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoeCA+IDkgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnJyArIHkgKyB4KVswXS5jbGFzc0xpc3QuY29udGFpbnMoJ3BsYWNlZCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgeCArPSAxXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGhpdChjbGFzc05hbWUsIGJvYXJkKSB7XG4gICAgY29uc3Qgbm9kZSA9IGZpbmROb2RlKGNsYXNzTmFtZSwgYm9hcmQpXG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKCdoaXQnKVxuICB9XG5cbiAgc3RhdGljIG1pc3MoY2xhc3NOYW1lLCBib2FyZCkge1xuICAgIGNvbnN0IG5vZGUgPSBmaW5kTm9kZShjbGFzc05hbWUsIGJvYXJkKVxuICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgnbWlzcycpXG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZE5vZGUoY2xhc3NOYW1lLCBib2FyZCkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkLmNoaWxkTm9kZXNbaV0uY2hpbGROb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKGJvYXJkLmNoaWxkTm9kZXNbaV0uY2hpbGROb2Rlc1tqXS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xuICAgICAgICByZXR1cm4gYm9hcmQuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzW2pdXG4gICAgICB9XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tICcuL2dhbWVfYm9hcmRfY2xhc3MnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGVuZW15Qm9hcmQpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdGhpcy5lbmVteUJvYXJkID0gZW5lbXlCb2FyZFxuICB9XG5cbiAgbW92ZSh4LCB5KSB7XG4gICAgbGV0IGJvYXJkID0gbnVsbFxuICAgIGlmICh0aGlzLm5hbWUgPT0gJ1BsYXllcicpIHtcbiAgICAgIGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbXB1dGVyX2JvYXJkJylcbiAgICB9IGVsc2Uge1xuICAgICAgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyX2JvYXJkJylcbiAgICB9XG4gICAgdGhpcy5lbmVteUJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSwgYm9hcmQpXG4gIH1cbn0iLCJsZXQgc2hpcHMgPSBbXVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGhcbiAgICB0aGlzLmhpdENvdW50ID0gMFxuICB9XG4gIFxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRDb3VudCsrXG4gIH1cbiAgXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy5sZW5ndGggPT0gdGhpcy5oaXRDb3VudClcbiAgICByZXR1cm4gdHJ1ZVxuICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHNldENvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKSB7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzXG4gICAgc2hpcHMucHVzaCh0aGlzKVxuICB9XG5cbiAgc3RhdGljIGZpbmQoY29vcmRpbmF0ZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGNvbnN0IHNoaXAgPSBzaGlwc1tpXVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwLmNvb3JkaW5hdGVzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMyID0gc2hpcC5jb29yZGluYXRlc1tqXVxuICAgICAgICBpZiAoY29vcmRpbmF0ZXMyWzBdID09IGNvb3JkaW5hdGVzWzBdICYmIGNvb3JkaW5hdGVzMlsxXSA9PSBjb29yZGluYXRlc1sxXSlcbiAgICAgICAgICByZXR1cm4gc2hpcFxuICAgICAgfVxuICAgIH1cbiAgfVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lX2NsYXNzJ1xuaW1wb3J0IEh0bWwgZnJvbSAnLi9odG1sJ1xuXG5IdG1sLnBvcHVsYXRlQm9hcmRzKClcbm5ldyBHYW1lKCkiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d")

var gameIsNotOver = true
var lastFrame = null
var redrawSpeed = 200
var endGameRedrawSpeed = 200

var speed = 1
var height = 10
var width = 10

var snake = null

var snakeFood = null

var newDirection = null

var arrowKeys = {
	37: "left",
	38: "up",
	39: "right",
	40: "down"
}

var oppositeDirection = {
	"up": "down",
	"down": "up",
	"left": "right",
	"right": "left"
}

var direction = "up";

var gameOverText = [[20, 20], [20, 30], [20, 40], [20, 50], [20, 60], [30, 20], [30, 60], [40, 20], [40, 50], [40, 60], [60, 20], [60, 30], [60, 40], [60, 50], [60, 60], [70, 20], [70, 40], [80, 20], [80, 30], [80, 40], [80, 50], [80, 60], [80, 80], [80, 90], [80, 100], [80, 110], [80, 120], [90, 80], [90, 120], [100, 20], [100, 30], [100, 40], [100, 50], [100, 60], [100, 80], [100, 90], [100, 100], [100, 110], [100, 120], [110, 30], [110, 170], [110, 180], [110, 210], [120, 40], [120, 80], [120, 90], [120, 100], [120, 110], [120, 200], [130, 30], [130, 120], [130, 200], [140, 20], [140, 30], [140, 40], [140, 50], [140, 60], [140, 80], [140, 90], [140, 100], [140, 110], [140, 170], [140, 180], [140, 210], [160, 20], [160, 30], [160, 40], [160, 50], [160, 60], [160, 80], [160, 90], [160, 100], [160, 110], [160, 120], [170, 20], [170, 40], [170, 60], [170, 80], [170, 100], [170, 120], [180, 20], [180, 60], [180, 80], [180, 120], [200, 80], [200, 90], [200, 100], [200, 110], [200, 120], [210, 80], [210, 100], [220, 80], [220, 90], [220, 110], [220, 120]].reverse()

function setupKeystrokeListeners(snakeHead) {
	window.addEventListener("keydown", function(event) {
		if(arrowKeys.hasOwnProperty(event.keyCode)) {
			newDirection = arrowKeys[event.keyCode]
		}
	})
}

var food = function() {

	var foodColour = "#ee2233"

	var rowsInGrid = canvas.height / height
	var columnsInGrid = canvas.width / width

	var getPosition = function(availablePositions, gridSpacing) {
		return Math.floor(Math.random() * availablePositions) * gridSpacing
	}

	var getX = function() {
		return getPosition(rowsInGrid, height)
	}

	var getY = function() {
		return getPosition(columnsInGrid, width)
	}

	var position = {
		x: getX(),
		y: getY()
	}

	this.isAtPosition = function(x, y) {
		return position.x === x && position.y === y
	}

	this.draw = function() {
		context.fillStyle = foodColour
		context.fillRect(position.x, position.y, width, height)
	}
}

function dropFoodAtRandomIntervals() {
	if(Math.random() < 0.05) {
		snakeFood = new food()
	}
}

var segment = function(x, y, direction = "up") {
	var position = {
		x: x,
		y: y
	}

	var liveSnakeColour = "#88bb77"
	var deadSnakeColour = "#222222"

	var nextSegment = null

	var direction = direction

	var updatePosition = function() {
		moveToNextSpace()
		loopPositionAtEdges()
	}

	var hasEatenFood = function() {
		if(snakeFood === null) {
			return false
		}

		if(snakeFood.isAtPosition(position.x, position.y)) {
			return true
		}

		return false
	}

	var moveToNextSpace = function() {
		if(direction === "up") {
			position.y -= height
		}

		if(direction === "down") {
			position.y += height
		}

		if(direction === "left") {
			position.x -= width
		}

		if(direction === "right") {
			position.x += width
		}	
	}

	var loopPositionAtEdges = function() {
		if(position.x < 0) {
			position.x = canvas.width - width
		}

		if(position.x >= canvas.width) {
			position.x = 0
		}

		if(position.y < 0) {
			position.y = canvas.height - height
		}

		if(position.y >= canvas.height) {
			position.y = 0
		}	
	}

	var drawSegment = function(isDead) {
		context.fillStyle = liveSnakeColour

		if(isDead) {
			context.fillStyle = deadSnakeColour
		}

		context.fillRect(position.x, position.y, width, height)
	}

	this.hasCollidedWithSelf = function(headX, headY) {
		if(typeof headX === "undefined" || typeof headY === "undefined") {
			return nextSegment.hasCollidedWithSelf(position.x, position.y)
		}

		if(position.x === headX && position.y === headY) {
			return true
		}

		if(nextSegment !== null) {
			return nextSegment.hasCollidedWithSelf(headX, headY)
		}

		return false
	}

	this.addSegment = function(x, y) {
		if(nextSegment !== null) {
			nextSegment.addSegment()
			return
		}

		if(typeof x === "undefined" || typeof y === "undefined") {
			nextSegment = new segment(position.x, position.y + height)
		}
		else {
			nextSegment = new segment(x, y)
		}
	}

	this.move = function(headX, headY, shouldGrowBody) {
		var shouldAddASegment = shouldGrowBody || hasEatenFood()

		if(nextSegment != null) {
			nextSegment.move(position.x, position.y, shouldAddASegment)
		}
		else if(shouldAddASegment === true) {
			this.addSegment(position.x, position.y)
			snakeFood = null
		}

		if(typeof headX === "undefined" || typeof headY === "undefined") {
			updatePosition()

			if(this.hasCollidedWithSelf()) {
				gameIsNotOver = false
			}
		}
		else {
			position.x = headX
			position.y = headY
		}

		drawSegment()
	}

	this.drawDeath = function() {
		drawSegment(true)

		if(nextSegment != null) {
			nextSegment.drawDeath()
		}
	}

	this.setDirection = function(newDirection) {
		if(oppositeDirection[newDirection] !== direction) {
			direction = newDirection
		}
	}
}

function drawLine(x0, y0, x1, y1) {
	context.beginPath()
	context.moveTo(x0, y0)
	context.lineTo(x1, y1)
	context.stroke()
}

function drawGrid() {
	for(var i = 0; i < canvas.width; i+= width) {
		drawLine(i, 0, i, canvas.height)
	}

	for(var j = 0; j < canvas.height; j += height) {
		drawLine(0, j, canvas.width, j)
	}
}

function drawGame() {
	context.clearRect(0, 0, canvas.width, canvas.height)

	drawGrid()

	if(snake === null) {
		var x = (canvas.width / 2)
		var y = (canvas.height / 2)

		snake = new segment(x, y)
		snake.addSegment()
		snake.addSegment()
		setupKeystrokeListeners(snake)
	}

	if(snakeFood === null) {
		dropFoodAtRandomIntervals()
	}

	if(snakeFood !== null) {
		snakeFood.draw()
	}

	if(newDirection !== null) {
		snake.setDirection(newDirection)
		newDirection = null
	}

	snake.move()
}

function readyForNextFrame(timestamp, isEndGame) {
	var currentRedrawSpeed = isEndGame ? endGameRedrawSpeed : redrawSpeed

	if(lastFrame === null || timestamp - lastFrame > currentRedrawSpeed) {
		lastFrame = timestamp
		return true
	}

	return false
}

function gameOver(timestamp) {
	if(gameOverText.length > 0) {
		if(readyForNextFrame(timestamp, true)) {
			context.fillStyle = "rebeccapurple"

			var pixel = gameOverText.pop()
			context.fillRect(pixel[0], pixel[1], width, height)
		}

		if(gameOverText.length % 2 === 0) {
			endGameRedrawSpeed -= 1
		}

		window.requestAnimationFrame(gameOver)
	}
}

(function gameLoop(timestamp) {
	if(readyForNextFrame(timestamp)) {
		drawGame()
	}

	if(gameIsNotOver) {
		window.requestAnimationFrame(gameLoop)
	}
	else {
		snake.drawDeath()
		window.requestAnimationFrame(gameOver)
	}
})(null)
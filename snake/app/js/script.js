var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d")

var gameIsNotOver = true
var lastFrame = null
var redrawSpeed = 100

var speed = 1
var height = 10
var width = 10

var snake = null

var snakeColour = "#aa33dd"

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

function setupKeystrokeListeners(snakeHead) {
	window.addEventListener("keydown", function(event) {
		if(arrowKeys.hasOwnProperty(event.keyCode)) {
			snakeHead.setDirection(arrowKeys[event.keyCode])
		}
	})
}

var segment = function(x, y, direction = "up") {
	var position = {
		x: x,
		y: y
	}

	var nextSegment = null

	var direction = direction

	var updatePosition = function() {
		moveToNextSpace()
		loopPositionAtEdges()
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

	var drawSegment = function() {
		context.fillStyle = snakeColour
		context.fillRect(position.x, position.y, width, height)
	}

	this.addSegment = function() {
		if(nextSegment !== null) {
			nextSegment.addSegment()
			return
		}

		nextSegment = new segment(position.x, position.y + height)
	}

	this.move = function(headX, headY) {
		if(nextSegment != null) {
			nextSegment.move(position.x, position.y)
		}

		if(typeof headX === "undefined" || typeof headY === "undefined") {
			updatePosition()
		}
		else {
			position.x = headX
			position.y = headY
		}

		drawSegment()
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

	snake.move()
}

function readyForNextFrame(timestamp) {
	if(lastFrame === null || timestamp - lastFrame > redrawSpeed) {
		lastFrame = timestamp
		return true
	}

	return false
}

(function gameLoop(timestamp) {
	if(readyForNextFrame(timestamp)) {
		drawGame()
	}

	if(gameIsNotOver) {
		window.requestAnimationFrame(gameLoop)
	}
})(null)
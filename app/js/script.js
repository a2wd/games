var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d")

var gameIsNotOver = true
var lastFrame = null
var redrawSpeed = 100

var speed = 1
var height = 10
var width = 10
var x = (canvas.width / 2)
var y = (canvas.height / 2)

var arrowKeys = {
	37: "left",
	38: "up",
	39: "right",
	40: "down"
}

var direction = "up";

function setupKeystrokeListeners() {
	window.addEventListener("keydown", function(event) {
		if(arrowKeys.hasOwnProperty(event.keyCode)) {
			direction = arrowKeys[event.keyCode]
		}
	})
}

function updateMovement() {
	if(direction === "up") {
		y -= height
	}

	if(direction === "down") {
		y += height
	}

	if(direction === "left") {
		x -= width
	}

	if(direction === "right") {
		x += width
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

	context.fillStyle = "#aa33dd"
	context.fillRect(x, y, width, height)

	drawGrid()

	updateMovement()

	if(x < 0) {
		x = canvas.width - width
	}

	if(x >= canvas.width) {
		x = 0
	}

	if(y < 0) {
		y = canvas.height - height
	}

	if(y >= canvas.height) {
		y = 0
	}
}

function readyForNextFrame(timestamp) {
	if(lastFrame === null || timestamp - lastFrame > redrawSpeed) {
		lastFrame = timestamp
		return true
	}

	return false
}

function gameLoop(timestamp) {
	if(readyForNextFrame(timestamp)) {
		drawGame()
	}

	if(gameIsNotOver) {
		window.requestAnimationFrame(gameLoop)
	}
}

setupKeystrokeListeners()
window.requestAnimationFrame(gameLoop)
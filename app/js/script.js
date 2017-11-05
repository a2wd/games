var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d")
var start = null

var height = 10
var width = 10
var x = (canvas.width / 2) - (width / 2)
var y = (canvas.height / 2) - (height / 2)

function drawGame() {
	context.fillStyle = "blue"
	context.fillRect(x, y, width, height)

	if(x < 0) {
		x = canvas.width
	}

	if(x > canvas.width) {
		x = 0
	}

	if(y < 0) {
		y = canvas.height
	}

	if(y > canvas.height) {
		y = 0
	}

	y--
}

function gameLoop(timestamp) {
	if(!start) {
		start = timestamp
	}

	var progress = timestamp - start
	context.clearRect(0, 0, canvas.width, canvas.height)
	drawGame()

	window.requestAnimationFrame(gameLoop)
}

window.requestAnimationFrame(gameLoop)
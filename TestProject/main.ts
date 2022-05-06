export {}

size(200)
noPixels()

const player = new Sprite("Player")
	.fromURL("./Assets/test.png")
	.setPos(20, 16)
	.setSize(256, 256)
	.setRect(0, 0, 16)

preLoad(() => {})

frame(() => {
	// player.setRect(0, 0, mouseX, mouseY)
	player.frame = mouseY / width
	colorf(map(mouseX, 0, width, 0, 255), map(mouseY, 0, height, 0, 255), 0)
	rect(mouseX - 32, mouseY - 32, 64, 64)
})
const config = {
	type: Phaser.AUTO,
	width: 700,
	height: 500,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

const game = new Phaser.Game(config);

let player;
let cursors;
let walls;
const square_size = 10;
const margin_between_squares = 2;
const draw_square_size = square_size + margin_between_squares;
const margin_from_left = 10;
const margin_from_up = 10;
const player_size = square_size;
let mazeData = [];
let path = [];
const mazeHeight = 30;
const mazeWidth = 30;

function preload() {

}

function create() {
	// Create the maze layout using a 2D array

	// Initialize the maze grid

	for (let row = 0; row < mazeHeight; row++) {
		mazeData[row] = [];
		for (let col = 0; col < mazeWidth; col++) {
			mazeData[row][col] = 1; // Fill the grid with walls (1)
		}
	}

	walls = this.physics.add.staticGroup();


	// Start the maze generation from the top-left corner
	generateMaze(1, 1);
	console.log(path)
	for (let row = 0; row < mazeData.length; row++) {
		for (let col = 0; col < mazeData[row].length; col++) {
			if (mazeData[row][col] === 1) {
				let wall = this.add.rectangle(draw_square_size * col + margin_from_left, draw_square_size * row + margin_from_up, square_size, square_size, 0x444444);
				this.physics.add.existing(wall, true); // true makes it immovable
				walls.add(wall);
			}
		}
	}
	console.log(walls.children.entries);

	// Draw the player as a blue square
	player = this.add.rectangle((walls.children.entries)[1].x, walls.children.entries[1 + mazeData.length].y, player_size, player_size, 0x0095DD);
	this.physics.add.existing(player);
	player.body.setCollideWorldBounds(true);

	this.physics.add.collider(player, walls);

	// Set up keyboard input
	cursors = this.input.keyboard.createCursorKeys();
}
let haveWin = false;
function update() {

	// Handle player movement
	player.body.setVelocity(0);

	if (cursors.left.isDown) {
		player.body.setVelocityX(-160);
	} else if (cursors.right.isDown) {
		player.body.setVelocityX(160);
	}

	if (cursors.up.isDown) {
		player.body.setVelocityY(-160);
	} else if (cursors.down.isDown) {
		player.body.setVelocityY(160);
	}
	//if (player.x >= walls.children.entries[walls.children.entries.length - 10].x) {
	if (0) {
		alert("You Win!!");
		haveWin = true;
		player.x = 20;
		location.reload();
	}
}

function generateMaze(x, y) {
	// Mark the current cell as a path (0)
	mazeData[y][x] = 0;

	// Define the possible directions to move
	const directions = shuffle([
		{ dx: 2, dy: 0 },  // Right
		{ dx: -2, dy: 0 }, // Left
		{ dx: 0, dy: 2 },  // Down
		{ dx: 0, dy: -2 }  // Up
	]);

	// Try each direction in random order
	for (const { dx, dy } of directions) {
		const nx = x + dx;
		const ny = y + dy;

		// Check if the new position is within bounds and not yet visited
		if (isInBounds(nx, ny) && mazeData[ny][nx] === 1) {
			// Remove the wall between the current cell and the next cell
			mazeData[y + dy / 2][x + dx / 2] = 0;
			path.push(mazeData[y + dy / 2][x + dx / 2])
			// Recursively generate the maze from the new position
			generateMaze(nx, ny);
		}
	}
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function isInBounds(x, y) {
	return x > 0 && x < mazeWidth - 1 && y > 0 && y < mazeHeight - 1;
}
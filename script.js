const config = {
	type: Phaser.AUTO,
	width: 700,
	height: 550,
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
const square_size = 15;
const margin_between_squares = 2;
const draw_square_size = square_size + margin_between_squares;
const margin_from_left = 10;
const margin_from_up = 10;
const player_size = square_size;
let mazeData = [];
let paths = [];
const mazeHeight = 31;   // beware of the plus one
const mazeWidth = 31;
let obj;
let backward_path = [];
function preload() {

}

function create() {
	// Create the maze layout using a 2D array

	// Initialize the maze grid
	obj = this;
	for (let row = 0; row < mazeHeight; row++) {
		mazeData[row] = [];
		for (let col = 0; col < mazeWidth; col++) {
			mazeData[row][col] = 1; // Fill the grid with walls (1)
		}
	}

	walls = this.physics.add.staticGroup();


	// Start the maze generation from the top-left corner
	generateMaze(1, 1, []);
	draw_maze.call(this);
	//draw_destination.call(this);
	//get_path();
	//console.log(walls.children.entries);

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
function generateMaze(x, y, path = [], prev_zero = null) {
	// Mark the current cell as a path (0)
	mazeData[y][x] = 0;
	// Add the current cell to the path
	if (prev_zero)
		path.push(prev_zero);
	path.push({ x, y });

	// Define the possible directions to move
	const directions = shuffle([
		{ dx: 2, dy: 0 },  // Right
		{ dx: -2, dy: 0 }, // Left
		{ dx: 0, dy: 2 },  // Down
		{ dx: 0, dy: -2 }  // Up
	]);

	// Track if any moves were made
	let moved = false;

	// Try each direction in random order
	for (const { dx, dy } of directions) {
		const nx = x + dx;
		const ny = y + dy;

		// Check if the new position is within bounds and not yet visited
		if (isInBounds(nx, ny) && mazeData[ny][nx] === 1) {
			// Remove the wall between the current cell and the next cell
			mazeData[y + dy / 2][x + dx / 2] = 0;
			//path.push({ x: x + dx / 2, y: y + dy / 2 });
			// Recursively generate the maze from the new position
			prev_zero = { x: x + dx / 2, y: y + dy / 2 };
			generateMaze(nx, ny, path.slice(), prev_zero); // Pass a copy of the path
			moved = true;
		}
	}

	// If no moves were made, it's a dead-end, so save the path
	if (!moved) {
		//path.pop();
		paths.push(path);
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


function draw_maze() {
	for (let row = 0; row < mazeData.length; row++) {
		for (let col = 0; col < mazeData[row].length; col++) {
			if (mazeData[row][col] === 1) {
				let wall = this.add.rectangle(draw_square_size * col + margin_from_left, draw_square_size * row + margin_from_up, square_size, square_size, 0x444444);
				this.physics.add.existing(wall, true); // true makes it immovable
				walls.add(wall);
			}
		}
	}
}




// function get_path() {

// 	// start from end and go to start
// 	let point = path.at(-2);
// 	console.log(point);
// 	let directions = [{ dx: -1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }]
// 	let count = 100;
// 	let prev_point = path.at(-1)
// 	while ((point.x != 1 && point.y != 1) && count--) {
// 		// look for neighbour 0
// 		for (dir of directions) {
// 			if (((point.x + dir.dx) === prev_point.x) && ((point.y + dir.dy) === prev_point.y))
// 				continue;
// 			if (mazeData[point.x + dir.dx][point.y + dir.dy] === 0) {
// 				break;
// 			}
// 		}
// 		// push point to backward_path
// 		backward_path.unshift(point);
// 		// update point to point to the 0 point
// 		prev_point = point;
// 		point = { x: point.x + dir.dx, y: point.y + dir.dy }
// 		console.log(point)
// 	}
// }




// function draw_destination() {
// 	let lastPoint = path.at(-1);
// 	//for (point of path) {
// 	//this.add.rectangle(draw_square_size * point.x + margin_from_left, draw_square_size * point.y + margin_from_up, square_size, square_size, 0x777777);
// 	//}
// 	this.add.rectangle(draw_square_size * lastPoint.x + margin_from_left, draw_square_size * lastPoint.y + margin_from_up, square_size, square_size, 0xFf0000);
// }

let count = 0;
let i_path = 0;
let col = getRandomHexColor();
function printOneOfPath() {
	if (count < paths[i_path].length) {
		let point = paths[i_path][count];
		obj.add.rectangle(draw_square_size * point.x + margin_from_left, draw_square_size * point.y + margin_from_up, square_size, square_size, col);
		count++;
	}
	else {
		count = 0;
		i_path++;
		col = getRandomHexColor();
		//console.log(col);
	}
}

//Set the interval
const intervalId = setInterval(printOneOfPath, 70);

function getRandomHexColor() {
	let color = '0x' + Math.floor(Math.random() * 16777215).toString(16);
	return color.padEnd(7, '0'); // Ensures the color is 7 characters long (including '#')
}
// load jwt  and user_name from local store to be used in further api requests
const jwt = localStorage.getItem('jwt');
const current_user_name = localStorage.getItem('current_user_name');

//HTML items
const level_value_item = document.querySelector('#level_value');
const score_value_item = document.querySelector('#score_value');
let current_score = 0;
let current_level = 0;

const TOP_PLAYERS_REFRESH_PERIOD = 60;
const top_players_ul = document.querySelector('#top_players_list');

// fetch top players and then  periodically update top_players list
const load_top_players = function () {
	console.log("updating top players list");
	const url = 'http://127.0.0.1:5600/top_players';
	fetch(url, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${jwt}`, // Include JWT token in Authorization header
			'Content-Type': 'application/json', // You can set additional headers as needed
		},
	}).then(response => {
		if (!response.ok)
			throw (new Error("Failed Fetching Top Players"));
		console.log(response);
		return response.json();
	}).then(data => {
		console.log(data);
		top_players_ul.innerHTML = ''; // Clear all previous list items
		for (let player of data.top) {
			// todo: add specail emoji for top player 🥇🔥
			const newListItem = document.createElement('li');
			newListItem.textContent = `${player.name}: ${player.score}`;
			top_players_ul.appendChild(newListItem);
		}
	}
	).catch(err => {
		console.error(err);
	})
}

const get_player_info = async function () {
	console.log("loading player info");
	let player_info;

	const url = `http://127.0.0.1:5600/players_data/${current_user_name}`;
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${jwt}`, // Include JWT token in Authorization header
				'Content-Type': 'application/json', // You can set additional headers as needed
			},
		});
		if (!response.ok)
			throw (new Error("Failed Fetching Top Players"));
		console.log(response);
		const data_1 = await response.json();
		console.log(data_1);
		return (data_1);
	} catch (err) {
		console.error(err);
	}
}


let current_maze_config = {
	player_velocity: 150,
	startup_delay: 200,
	chasing_time_frequency: 20,
	mazeHeight: 31,
	square_size: 27
};
// const square_size = 27;
const margin_between_squares = 2;
const margin_from_left = 20;
const margin_from_top = 20;
let player_size = current_maze_config.square_size;
let draw_square_size = current_maze_config.square_size + margin_between_squares;
const chasing_time_interval = 1000;
// const chasing_time_frequency = 20;
let intervalId;
let player;
let exit;
let cursors;
let walls;
let chase;
let scene_obj;
let start_button;
let mazeData = [];
let paths = [];

// let player_velocity = 150; // prev 160
let count = 0;
let chasing_counter = 0;
// let startup_delay = 200;
let startup_counter = 0;
let canvas_width = Math.ceil(current_maze_config.square_size * (current_maze_config.mazeHeight + margin_between_squares) + margin_from_left * 5);
let canvas_hight = Math.ceil(current_maze_config.square_size * (current_maze_config.mazeHeight + margin_between_squares) + margin_from_top * 5);

let game_running = false;
let score;
let level;
let game;
let mainGroup;
const phaser_config = {
	type: Phaser.canvas,
	width: canvas_width,
	height: canvas_hight,
	canvas: document.getElementById('canvas'), // Use an already existing canvas
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


load_top_players();
setInterval(() => {
	load_top_players();
}, 1000 * TOP_PLAYERS_REFRESH_PERIOD);

document.querySelector('#start_game_button').addEventListener('click', function () {
	console.log("Button is clicked");
	start_game();
});
document.querySelector('#next_game_button').addEventListener('click', function () {
	console.log("Button is clicked");
	start_next_game();
})
function start_game() {

	// create game object
	game = new Phaser.Game(phaser_config);
	// hide button 
	document.querySelector('#start_game_button').classList.add('hidden');
	document.querySelector('#canvas').classList.remove('hidden');
	// show canvas
	// document.querySelector('#canvas').classList.toggle('hidden');
	//setMainGroupVisible();
	// scene_obj.scene.resume();
}



const reload_player_info = async () => {

	try {
		let player_info = await get_player_info();
		// console.log("data----");
		console.log(player_info);
		// update score
		update_score(player_info.score);
		// update level
		update_level(player_info.level_id);
		// update level_config
		// todo:- should equals the fetched data config
		console.log(player_info.current_level_config)
		current_maze_config = player_info.current_level_config;
		/* current_maze_config = {
				player_velocity: 150,
				startup_delay: 200,
				chasing_time_frequency: 20,
				mazeHeight: 31,
				square_size: 27
			};*/
	}
	catch (err) {
		console.error(err);
	}
}
function preload() {
	// fetch player info + current local configuration
	reload_player_info();
	// new game reload
}

function create() {
	console.log("Debug:: called here");
	scene_obj = this;
	// Create the maze layout using a 2D array

	// Initialize the maze grid
	paths = [];
	mazeData = [];

	init_mazeData();
	walls = this.physics.add.staticGroup();
	chase = this.physics.add.staticGroup();

	generate_maze();
	render_game_scene_objects();

	// Set up keyboard input
	cursors = this.input.keyboard.createCursorKeys();

	// add all objects to main group

	mainGroup = this.add.group();
	mainGroup.addMultiple(walls.getChildren());
	mainGroup.addMultiple(chase.getChildren());
	mainGroup.add(player);
	mainGroup.add(exit);
	game_running = true;
	// setMainGroupInvisible();
	// this.scene.pause();
	count = 0;
	startup_counter = 0;

}

function update() {
	let player_velocity = current_maze_config.player_velocity
	//console.log(scene_obj.scene.visible);
	if (game_running) {

		// stop updating if game stopped, win or lose
		// Handle player movement
		//player.body.setVelocity(0);
		if (cursors.up.isDown && cursors.right.isDown) {
			player.body.setVelocityY(-player_velocity);
			player.body.setVelocityX(player_velocity);
		}
		else if (cursors.down.isDown && cursors.right.isDown) {
			player.body.setVelocityY(player_velocity);
			player.body.setVelocityX(player_velocity);
		}
		else if (cursors.up.isDown && cursors.left.isDown) {
			player.body.setVelocityY(-player_velocity);
			player.body.setVelocityX(-player_velocity);
		}
		else if (cursors.down.isDown && cursors.left.isDown) {
			player.body.setVelocityY(player_velocity);
			player.body.setVelocityX(-player_velocity);
		}
		else if (cursors.up.isDown) {
			player.body.setVelocityY(-player_velocity);
		}
		else if (cursors.down.isDown) {
			player.body.setVelocityY(player_velocity);
		}

		else if (cursors.left.isDown) {
			player.body.setVelocityX(-player_velocity);
		}
		else if (cursors.right.isDown) {
			player.body.setVelocityX(player_velocity);
		}

		release_chaser();
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
	let mazeWidth = current_maze_config.mazeHeight;
	return x > 0 && x < mazeWidth - 1 && y > 0 && y < current_maze_config.mazeHeight - 1;
}


function render_maze() {
	for (let row = 0; row < mazeData.length; row++) {
		for (let col = 0; col < mazeData[row].length; col++) {
			if (mazeData[row][col] === 1) {
				let wall = scene_obj.add.rectangle(draw_square_size * col + margin_from_left, draw_square_size * row + margin_from_top, current_maze_config.square_size, current_maze_config.square_size, 0x444444);
				scene_obj.physics.add.existing(wall, true); // true makes it immovable
				walls.add(wall);
			}
		}
	}
}

function render_exit() {
	let lastPoint = paths[0].at(-1);
	exit = scene_obj.add.rectangle(draw_square_size * lastPoint.x + margin_from_left, draw_square_size * lastPoint.y + margin_from_top, current_maze_config.square_size, current_maze_config.square_size, 0xFFFFFF);
	scene_obj.physics.add.existing(exit, true);
}


function init_mazeData() {

	for (let row = 0; row < current_maze_config.mazeHeight; row++) {
		mazeData[row] = [];
		for (let col = 0; col < current_maze_config.mazeHeight; col++) {
			mazeData[row][col] = 1; // Fill the grid with walls (1)
		}
	}

}



function release_chaser() {
	const selected_path = paths[0];
	if (startup_counter++ < current_maze_config.startup_delay)
		return;
	if (chasing_counter++ > current_maze_config.chasing_time_frequency) {
		if (count < selected_path.length) {
			let point = selected_path[count];
			let chase_block = scene_obj.add.rectangle(draw_square_size * point.x + margin_from_left, draw_square_size * point.y + margin_from_top, current_maze_config.square_size, current_maze_config.square_size, 0xff0000);
			scene_obj.physics.add.existing(chase_block, true); //immovable
			chase.add(chase_block);
			mainGroup.addMultiple(chase.getChildren());
			count++;
		}
		chasing_counter = 0;
	}
}

function playerReachsExitCallback() {
	game_running = false;
	pause_game();
	// display gameover
	display_win();
	// todo display win

	// update score and level
	current_level++;
	current_score = current_score + 10;
	update_score(current_score);
	update_level(current_level);

	// todo post player_info to server
	post_player_info().then(() => {
		document.querySelector('#next_game_button').classList.remove('hidden');
		load_top_players();
		//start_next_game();
	}).catch(err => {
		console.error(err);
	})
}


function chaserCatchPlayerCallback() {

	game_running = false;
	pause_game();
	// display gameover
	display_game_over();
	document.querySelector('#next_game_button').classList.remove('hidden');
}

const post_player_info = function () {

	// fetch post http request to post player info score and new level
	const url = `http://127.0.0.1:5600/players_data/${current_user_name}`;
	const data = {
		score: current_score,
		level_id: current_level,
	}
	return fetch(url, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${jwt}`, // Include JWT token in Authorization header
			'Content-Type': 'application/json', // You can set additional headers as needed
		},
		body: JSON.stringify(data) // Convert JS object to JSON string
	}).then(response => {
		if (!response.ok)
			throw (new Error("Failed Post player data to api"));
		console.log(response);
		return response.json();
	}).then(data => {
		console.log(data);
		return (data);
	}
	).catch(err => {
		console.error(err);
	})

}





const update_score = function (score) {
	score_value_item.textContent = score;
	current_score = score;
};
const update_level = function (level) {
	level_value_item.textContent = level;
	current_level = level;
};

function render_player() {
	// Draw the player as a blue square
	//player = this.add.rectangle((walls.children.entries)[1].x, walls.children.entries[1 + mazeData.length].y, player_size, player_size, 0x0095DD);
	player = scene_obj.add.circle(
		(walls.children.entries)[1].x,          // X position
		walls.children.entries[1 + mazeData.length].y, // Y position
		(player_size) / 2,                        // Radius (half the size of the player rectangle)
		0x0095DD                                // Fill color
	);
	player.setOrigin(0.5, 0.5);
	scene_obj.physics.add.existing(player);
}


function startGame() {
	start_button.destroy();
	render_game_scene_objects();
	game_running = true;
	// ball.body.velocity.set(150, -150);
	//playing = true;
}




function render_game_scene_objects() {
	render_maze();
	render_exit();
	render_player();
	// define collisions and collision events
	player.body.setCollideWorldBounds(true);
	scene_obj.physics.add.collider(player, walls);
	scene_obj.physics.add.collider(player, exit, playerReachsExitCallback, null);
	scene_obj.physics.add.collider(player, chase, chaserCatchPlayerCallback, null);
	scene_obj.physics.add.collider(exit, chase, chaserCatchPlayerCallback, null);


}

function generate_maze() {
	// Start the maze generation from the top-left corner
	generateMaze(1, 1, []);
	// sort paths by length from longest to shortest
	paths.sort((a, b) => b.length - a.length)

}


function display_win() {
	const centerX = scene_obj.scale.width / 6;
	const centerY = scene_obj.scale.height / 8;
	scene_obj.add.text(centerX, centerY, 'You Win!', {
		fontSize: '182px',
		fontFamily: 'Protest Guerrilla',
		fill: '#1e90ff'
	});
}

function display_game_over() {
	const centerX = scene_obj.scale.width / 15;
	const centerY = scene_obj.scale.height / 8;
	scene_obj.add.text(centerX, centerY, 'Game Over', {
		fontSize: '182px',
		fontFamily: 'Protest Guerrilla',
		fill: '#ff0000'
	});
}
function start_next_game() {
	//setMainGroupInvisible();

	// hide next game button
	document.querySelector('#next_game_button').classList.add('hidden');
	//setMainGroupInvisible();

	restart_game();
	// show button 
	// document.querySelector('#start_game_button').classList.remove('hidden');
	// hide canvas
	// document.querySelector('#canvas').classList.add('hidden');
}

function _start_game() {
	scene_obj.scene.start();
}

function restart_game() {
	scene_obj.scene.restart();
}

function pause_game() {
	scene_obj.scene.pause();
}


function stop_game() {
	scene_obj.scene.stop();
}


function setMainGroupInvisible() {

	mainGroup.children.iterate((child) => {
		child.setActive(false).setVisible(false); // Set all objects to active and visible when the event occurs
	});
}

function setMainGroupVisible() {
	console.log(mainGroup);
	console.log(mainGroup.children);
	mainGroup.children.iterate((child) => {
		child.setActive(true).setVisible(true); // Set all objects to active and visible when the event occurs
	});
}
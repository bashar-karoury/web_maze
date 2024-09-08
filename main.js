// Import specific functions by name
import { start_game } from './game.js';

document.querySelector('#start_game_button').addEventListener('click', function () {
	console.log("Button is clicked");
	start_game();
});
// Import specific functions by name
import { start_game } from './script.js';

document.querySelector('.start_button').addEventListener('click', function () {
	//console.log("Button is clicked");
	start_game();
});
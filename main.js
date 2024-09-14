// Import specific functions by name
import { start_game } from './game.js';

// load jwt from local store to be used in further api requests
const jwt = localStorage.getItem('jwt');
console.log(jwt);


// fetch load top_players from api 


// fetch user info from api and configure game with fetched settings

// what are the other times we need to fetch user info ????
// after finish levels to store current configs and get the updated once





document.querySelector('#start_game_button').addEventListener('click', function () {
	console.log("Button is clicked");
	start_game();
});
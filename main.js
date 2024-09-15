// Import specific functions by name
import { start_game } from './game.js';

// load jwt from local store to be used in further api requests
const jwt = localStorage.getItem('jwt');
// console.log(jwt);
const TOP_PLAYERS_PERIOD = 60;
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
load_top_players();
setInterval(() => {
	load_top_players
}, 1000 * TOP_PLAYERS_PERIOD);

// fetch load top_players from api 


// fetch user info from api and configure game with fetched settings

// what are the other times we need to fetch user info ????
// after finish levels to store current configs and get the updated once





document.querySelector('#start_game_button').addEventListener('click', function () {
	console.log("Button is clicked");
	start_game();
});
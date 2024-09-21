const game_url = 'game.html'
const server_ip = "54.226.5.216"
const login_item = document.querySelector('#login');
const register_item = document.querySelector('#register');

const authentication_buttons = document.querySelector('.authentication_buttons');
const login_container = document.querySelector('.login_container');
const register_container = document.querySelector('.register_container');

const submit_login = document.querySelector('.login_container .submit');
const submit_register = document.querySelector('.register_container .submit');

const login_username_input = document.querySelector('#login_username');
const login_password_input = document.querySelector('#login_password');

const register_username_input = document.querySelector('#register_username');
const register_password_input = document.querySelector('#register_password');

const login_username_validation_error = document.querySelector('#login_username_error');
const login_password_validation_error = document.querySelector('#login_password_error');
const register_username_validation_error = document.querySelector('#register_username_error');
const register_password_validation_error = document.querySelector('#register_password_error');

const login_error = document.querySelector('#login_error');
const register_error = document.querySelector('#register_error');

const show_login = function () {
	authentication_buttons.classList.add('hidden');
	register_container.classList.add('hidden');
	login_container.classList.remove('hidden');
}

const show_register = function () {
	authentication_buttons.classList.add('hidden');
	login_container.classList.add('hidden');
	register_container.classList.remove('hidden');

}

submit_login.addEventListener('click', function () {
	// sanitize inputs and add alert user if one of them is not accepted// todo
	const user_name = login_username_input.value;
	const password = login_password_input.value;
	let valid = true;

	if (!validate_username(user_name, login_username_validation_error)) {
		valid = false;
	}

	if (!validate_password(password, login_password_validation_error)) {
		valid = false;
	}
	if (valid) {
		// check if prev validation error needed to be hidden


		// send POST request to backend
		(async () => {


			try {
				const response = await login_to_backend({ 'username': user_name, 'password': password });
				console.log(response);

				if (response.ok) {
					const data = await response.json();
					// register the jwt and then should redirect to the game page
					const jwt = data.access_token;
					localStorage.setItem('jwt', jwt);
					console.log("current user_name ", user_name);
					localStorage.setItem('current_user_name', user_name);

					// method 1: 
					// store the jwt in a cooki and use window.location.href = '/game.html';
					window.location.href = game_url;
					// in the backend add new route to /game.html and send the file from server
					// is there any security implications??? may be remove cooki after loading the new page?
					// I think it is associated with the auth.html page and will not get set in game.html
					// INVESTIGATE 
					//console.log(data.access_token);
					//show_login();
					console.log("Logged in Successfully");
					// load the game page
				}
				else {
					console.error("Failed to login");
					login_error.textContent = "Either username or password is incorrect"
					login_error.classList.remove('hidden');

					// todo: display error of failed to register
				}
			}
			catch (err) {
				console.log("Errrrrrrrrrrrrror");
			}
		})();
	}

});

// add listener to login button
submit_register.addEventListener('click', function () {
	console.log("register submit is clicked");
	const user_name = register_username_input.value;
	const password = register_password_input.value;
	let valid = true;

	if (!validate_username(user_name, register_username_validation_error)) {
		valid = false;
	}

	if (!validate_password(password, register_password_validation_error)) {
		valid = false;
	}
	if (valid) {
		// check if prev validation error needed to be hidden
		// send POST request to backend
		// alert the user of result of register
		(async () => {
			const response = await register_to_backend({ 'username': user_name, 'password': password });
			if (response.ok) {
				show_login();
			}
			else {
				console.error("Failed to register");
				// todo: display error of failed to register
				register_error.textContent = "Either username or password is incorrect"
				register_error.classList.remove('hidden');
				// may be used validation errors items or create new item
			}
		})();
	}
});
const validate_username = function (username, errorElementId) {
	if (username.length <= 0 || username > 20) {
		console.log("login username Invalidated");
		// show error underneth the input
		errorElementId.textContent = "username length error"
		errorElementId.classList.remove('hidden');
		return false;
	}
	else {
		console.log("login username validated");
		return true;
	}
}

const validate_password = function (password, errorElementId) {
	if (password.length <= 0 || password > 20) {
		console.log("login password Invalidated");
		// show error underneth the input
		errorElementId.textContent = "password length error"
		errorElementId.classList.remove('hidden');
		return false;
	}
	else {
		console.log("login password validated");
		return true;
	}
}

const login_to_backend = async function (data_) {
	try {

		const url = `http://${server_ip}/api/login`;
		const response = await fetch(url, {
			method: 'POST', // Specify the method as POST
			headers: {
				'Content-Type': 'application/json', // Indicate that we are sending JSON
			},
			body: JSON.stringify(data_) // Convert the JavaScript object to JSON string
		});
		console.log("Promise has been fulfilled");
		console.log("response", response);
		return (response);
	}
	catch (error) {
		console.error(`Login ERROR ${error}`)
	}
}

const register_to_backend = async function (data) {
	try {

		const url = `http://${server_ip}/api/register`;
		const response = await fetch(url, {
			method: 'POST', // Specify the method as POST
			headers: {
				'Content-Type': 'application/json', // Indicate that we are sending JSON
			},
			body: JSON.stringify(data) // Convert the JavaScript object to JSON string
		});
		console.log("response", response);
		return response;
	}
	catch (error) {
		console.error(`ERROR ${error}`)
		return false;
	}
}
login_item.addEventListener('click', function () {
	show_login();
	// add listener to login button

	/* add event listener to click on register_now that gets you to rigester form */

});

register_item.addEventListener('click', function () {
	show_register();

});




const login_item = document.querySelector('#login');
const buttons_container = document.querySelector('.buttons_container');
const login_container = document.querySelector('.login_container');
const submit_button = document.querySelector('.login_container .submit');


document.querySelector('#login').addEventListener('click', function () {
	console.log("login is clicked");
	// hide athentication buttons
	document.querySelector('.buttons_container').classList.toggle('hidden');
	// show login panel
	document.querySelector('.login_container').classList.toggle('hidden');
	// add listener to login button
	document.querySelector('.login_container .submit').addEventListener('click', function () {
		console.log("login submit is clicked");
		// sanitize inputs and add alert user if one of them is not accepted// todo
		// send POST request to backend
		// alert the user of result of login
	});
	/* add event listener to click on register_now that gets you to rigester form */

});

document.querySelector('#register').addEventListener('click', function () {
	console.log("register is clicked");
	// hide athentication buttons
	document.querySelector('.buttons_container').classList.toggle('hidden');
	// show login panel
	document.querySelector('.register_container').classList.toggle('hidden');
	// add listener to login button
	document.querySelector('.register_container .submit').addEventListener('click', function () {
		console.log("register submit is clicked");
		// sanitize inputs // todo
		// send POST request to backend
		// alert result pop up ?
		// show login container
		document.querySelector('.register_container').classList.toggle('hidden');
		document.querySelector('.login_container').classList.toggle('hidden');

	});
});



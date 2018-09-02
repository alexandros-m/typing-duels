var socket = io();
var mainRunning = false;
var refreshIntervalId = null;

//tells the server that a player has connected
socket.emit('user_connected', 1);

function focusOnTextBox() {
	document.getElementById('textarea').focus();
}

function main(desiredString) {
	var cps;
	document.getElementById('textarea').value = '';
	document.getElementById('typedString').value = '';
	document.getElementById('desiredString').innerHTML = desiredString;
	var timer = 0
	var time = document.getElementById('timer');
	var textInput = document.getElementById('textarea').value;
	var counter = 0;
	function checkIfCorrect() {
		if (counter % 20 == 0) {
			timer++;
			time.innerHTML = String(timer);
		}
		counter++;
		textInput = document.getElementById('textarea').value;
		typedLetters = textInput.length;
		if (textInput == desiredString.slice(0, typedLetters)) {
			cps = Math.floor(typedLetters / timer);
			document.getElementById('cps').innerHTML = "Characters per second: " + String(cps);
			document.getElementById('typedString').innerHTML = textInput;
		}
		if (desiredString == textInput) {
			clearInterval(refreshIntervalId);
			socket.emit('user_finished', 1);
			socket.on('win_or_lose', function(win_or_lose) {
				time.innerHTML = "You " + win_or_lose;
				time.innerHTML += '<br>CPS: ' + String(cps);
				document.getElementById('cps').innerHTML = "";

			});
		}

		document.getElementById('desiredString').innerHTML = desiredString;
	}
	refreshIntervalId = setInterval(checkIfCorrect, 50);
}

//when the server tells to, it starts a game
socket.on('sentence', function (sentence) {
	focusOnTextBox();
	document.getElementById('user_status').innerHTML = '';
	main(sentence);
});
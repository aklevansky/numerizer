import welcomeScreen from '../../resources/templates/welcome.html';

let welcomeElem = document.createElement('div');

welcomeElem.innerHTML = welcomeScreen;

document.getElementById('js-displayResult').appendChild(welcomeElem);

document.getElementById('js-playBtn').addEventListener('click', removeWelcomeScreen);
document.addEventListener('keypress', removeWelcomeScreen);

function removeWelcomeScreen(e) {

	if (e.type === 'keypress' && e.key.toUpperCase() !== 'ENTER') {
		return
	}

	welcomeElem.parentNode.removeChild(welcomeElem);

	document.getElementById('js-playBtn').removeEventListener('click', removeWelcomeScreen);
	document.removeEventListener('keypress', removeWelcomeScreen);
}
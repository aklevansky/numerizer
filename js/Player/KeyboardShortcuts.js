import {speak, currentSession, createSession} from './Player';
import {
	getSessionElement
} from './NumberSetsController';

let sessionNumber = '';
let typingSessionNumber = false;

document.addEventListener('keydown', e => {

	switch (e.key.toUpperCase()) {
		case 'ENTER':

			if (!currentSession) {
				createSession();				
			} else {
				stopErrorMessage();
			}

			break;
		case 'S':
			speak(currentSession, 'stop');
			break;
		case 'P':
			if (currentSession && currentSession.status === 'play') {
				speak(currentSession, 'pause')
			} else if (currentSession && currentSession.status === 'pause') {
				speak(currentSession, 'play')
			}
			break;
		case 'ESCAPE':
			clear();
			break
	}
});

document.addEventListener('keypress', e => {
	let key = +e.key;

	if (!isNaN(key)) {
		sessionNumber = sessionNumber + key;
	}

	if (!typingSessionNumber) {
		setTimeout( () => {
			let session = getSessionElement(+sessionNumber);
			sessionNumber = '';

			if (!session) {
				return;
			}

			let playBtn = session.getElementsByClassName('js-playBtn')[0];

			if (!playBtn) {
				return;
			}

			if (!currentSession) {
				playBtn.dispatchEvent( new Event('click', {bubbles: true}) );
			} else {
				stopErrorMessage();
			}

		}, 500)
	}

})

function stopErrorMessage() {
	let container = document.getElementById('errorMessage');
	container.innerHTML = 'Please press STOP button first (or press S key on your keyboard)';
	container.classList.remove('js-hidden');
	setTimeout( () =>{ container.classList.add('js-hidden'); }, 1000 );
}

function clear() {
	document.getElementById('js-clearBtn').dispatchEvent( new Event('click', {bubbles: true}) );
}
import {
	getUserInput
} from '../Form/Form';
import {
	createSessionElement
} from './NumberSetsController';
import Speaker from './SpeechEngine';
import {
	toggleWrap,
	setView,
	deleteSession
} from './ViewController';

const playBtn = document.getElementById('js-playBtn');
const pauseBtn = document.getElementById('js-pauseBtn');
const stopBtn = document.getElementById('js-stopBtn');
const clearBtn = document.getElementById('js-clearBtn');

let currentSession = null;

if (playBtn) {
	playBtn.addEventListener('click', e => createSession());
}

if (stopBtn) {
	stopBtn.addEventListener('click', e => speak(currentSession, 'stop'));
}

if (pauseBtn) {
	pauseBtn.addEventListener('click', e => speak(currentSession, 'pause'));
}

if (clearBtn) {
	clearBtn.addEventListener('click', e => {
		if (currentSession) {
			speak(currentSession, 'stop').then(() => { document.getElementById('js-displayResult').innerHTML = ''; } );
		} else {
			document.getElementById('js-displayResult').innerHTML = '';
		}
		document.getElementById('setInfo').classList.add('js-inactive');
		document.getElementById('js-clearBtn').classList.add('js-hidden');
	});
}


function createSession() {

	return new Promise(resolve => {

		if (currentSession) {
			speak(currentSession, 'stop')
				.then(() => createNumberSet())
				.then((session) => resolve(session));
		} else {
			resolve(createNumberSet());
		}

	}).then(session => speak(session, 'play'));

	function createNumberSet() {
		let data = getUserInput();
		let newSession = createSessionElement(data);
		newSession.element.numberSet.addEventListener('click', numberSetCtrls.bind(newSession));
		newSession.element.numberSet.getElementsByClassName('session-rate')[0].addEventListener('change', (e) => {
			newSession.rate = e.target.value
		});
		return newSession;
	}
}

// action = 'play', 'stop', 'pause'
function speak(session, action) {

	if (!session) {
		return;
	}

	if (action === 'play') {
		currentSession = session;
	}

	session.status = action;
	setView(session);

	return Speaker[action](session)
		.then((session => {
			if (session.status === 'stop') {
				currentSession = null;
			}
			return session;
		}))
		.then(session => setView(session))
		.then(() => session);
}

function numberSetCtrls(e) {

	let numberSet = this.element.numberSet;

	let btn = e.target.closest('.js-controlPlay') || e.target.closest('.js-controlWindow');

	// if no utterances are playing = you may click into any session, otherwise only active session buttons are functioning
	if (btn && (numberSet.classList.contains('js-currentSession') || currentSession === null || e.target.closest('.js-controlWindow'))) {

		switch (btn.dataset.action) {
			case 'stop':
				speak(this, 'stop');
				break;
			case 'play':
				speak(this, 'play');
				break;
			case 'pause':
				speak(this, btn.dataset.action);
				break;
			case 'wrap':
				toggleWrap(this);
				break;
			case 'close':
				closeSession(this);
				break;
		}
	}
}

function closeSession(session) {
	if (session.status === 'play' || session.status === 'pause') {
		speak(session, 'stop').then(session => deleteSession(session.element.numberSet));
	} else {
		deleteSession(session.element.numberSet);

	}
}
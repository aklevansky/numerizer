import {
	dataStore
} from './NumberSetsController';
import Timer from './Timer';

import {LANGS} from '../Form/FormConstants.js';

export {
	setView,
	updateCurrentSession,
	toggleWrap,
	deleteSession
};

let timer = null;
let timerElem = document.getElementById('timer');

const mainControls = {
	play: document.getElementById('js-playBtn'),
	pause: document.getElementById('js-pauseBtn'),
	stop: document.getElementById('js-stopBtn'),
	clearAll: document.getElementById('js-clearBtn')
}

const sessionInfo = {
	lang: document.getElementById('js-lang-info'),
	voice: document.getElementById('js-voice-info'),
	number: document.getElementById('js-number-info'),
	rate: document.getElementById('js-rate-info'),
	pause: document.getElementById('js-pause-info')
}

const app = document.getElementById('js-numTrainer');
const display = document.getElementById('js-displayResult');

function setView( session ) {
	switch (session.status) {
		case 'stop':
		stoppedView(session);
		break;
		case 'play':
		playingView(session);
		break;
		case 'pause':
		pausedView(session);
		break;
	}
}

function updateCurrentSession(span, info) {
	if (!info) {
		deactivateSpan(span);
	} else {
		activateSpan(span);
	}

	updateSessionInfo(info);
} 

function updateSessionInfo( {lang = '', voice = '', number = '', pause = '', rate = '' } = {} ) {

		lang = (lang === '' ) ? '' : LANGS[lang].name;
		sessionInfo.lang.innerHTML = lang;

		sessionInfo.voice.innerHTML =  voice;
		sessionInfo.number.innerHTML = number;

		rate = (rate === '') ? '' : rate.toFixed(2);

		sessionInfo.rate.innerHTML = rate;

		pause = (pause === '') ? '' : pause + ' sec.';
		sessionInfo.pause.innerHTML = pause;
}

function activateSpan(span) {
	span.classList.add('js-currentSpan');
}

function deactivateSpan(span) {
	span.classList.remove('js-currentSpan');
}

function playingView(session) {

	session.element.numberSet.classList.add('js-currentSession');
	display.classList.remove('js-paused');
	display.classList.add('js-playing');
	mainControls.play.disabled = true;
	if (!timer) {
		timer = new Timer(timerElem);
	}

	if (timer.paused) {
		timer.resume();
	}
	timerElem.classList.remove('paused');
	mainControls.clearAll.classList.remove('js-hidden');

}

function stoppedView(session) {

	session.element.numberSet.classList.remove('js-currentSession');

	display.classList.remove('js-playing');
	display.classList.remove('js-paused');
	mainControls.play.disabled = false;
	if (timer) {
		timer.stop();
		timer = null;
	}
	timerElem.classList.remove('paused');
}


function pausedView(session) {
	display.classList.remove('js-playing');
	display.classList.add('js-paused');
	mainControls.play.disabled = true;
	if (timer) {
		timer.pause();
	}
	timerElem.classList.add('paused');
}

function switchPlayToPauseBtn(session) {
	session.element.playBtn.classList.add('js-hidden');
	session.element.pauseBtn.classList.remove('js-hidden');

	// main buttons
	mainControls.play.classList.add('js-hidden');
	mainControls.pause.classList.remove('js-hidden');
}

function switchPauseToPlayBtn(session) {
	session.element.playBtn.classList.remove('js-hidden');
	session.element.pauseBtn.classList.add('js-hidden');

	mainControls.play.classList.remove('js-hidden');
	mainControls.pause.classList.add('js-hidden');
}

function toggleWrap(session) {
	for (let btn of session.element.numberSet.querySelectorAll('.wrapBtn') ) {
		btn.classList.toggle('js-hidden');
	}

	session.element.numberSet.classList.toggle('js-wrapped');
}

function deleteSession(sessionElem) {
	sessionElem.parentElement.removeChild(sessionElem);

	if ( !display.children.length ) {
		mainControls.clearAll.classList.add('js-hidden');
		document.getElementById('setInfo').classList.add('js-inactive');
	}
}
//import {formatInputAll, SEPARATOR} from './rangeSettings';
import {
	getData as dataRange
} from './RangeSettings';
import {
	getData as dataVoice
} from './VoiceSettings';
import {
	getData as dataDisplay
} from './DisplaySettings';

let form = document.forms['appForm'];

export {
	getUserInput,
	enableForm,
	disableForm
};

/* Form fields:
min
max
quantity
lang
voice
rate
digitSep
digitGroup
displayCurrent
*/


// wrap - unwrap fieldset when clicked on it's legend
form.addEventListener('click', (e) => {
	if (e.target.tagName === 'LEGEND') {
		e.target.parentElement.classList.toggle('js-invisible');
	}
});

// block form while numbers are playing, unblock otherwise
document.addEventListener('playerEvent', (e) => {
	switch (e.detail.event) {
		case 'playing':
		case 'supportError':
			disableForm();
			break;
		case 'stopped':
			enableForm();
			break;
	}
});


function getUserInput() {
	let voice = dataVoice();
	let display = dataDisplay();

	let numbers = generateNumberList(dataRange());

	if (voice.random) {
		voice.voice = createRandomVoiceList(voice.voice, numbers.length);
	}
	return Object.assign({
		numbers
	}, voice, display);
}

function disableForm() {
	for (let fieldset of form.getElementsByTagName('FIELDSET')) {
		fieldset.disabled = true;
	}
}


function enableForm() {
	for (let fieldset of form.getElementsByTagName('FIELDSET')) {
		fieldset.disabled = false;
	}
}

function generateNumberList({
	min = 1000,
	max = 1000000,
	quantity = 100
}) {

	let numbers = [];

	for (let i = 0; i < quantity; i++) {
		numbers.push(randomInteger(min, max));
	}

	return numbers;

}

function createRandomVoiceList(voices, length) {
	let tempVoices = [];

	for (let i = 0; i < length; i++) {
		tempVoices[i] = voices[randomInteger(0, voices.length - 1)];
	}

	return tempVoices;
}


// helper function

function randomInteger(min, max) {
	var rand = min - 0.5 + Math.random() * (max - min + 1)
	rand = Math.round(rand);
	return rand;
}
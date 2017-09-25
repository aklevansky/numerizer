import * as consts from './FormConstants.js';
import {
	toggleSpacingField
} from './DisplaySettings';
// import {
// 	randomVoiceList,
// 	createRandomModeWindow
// } from './RandomMode';

export {
	getData
};

const form = document.forms['appForm'];

// when the language is changed - updated voice list
// toggle "Spacing" field if needed
form.elements['lang'].addEventListener("change", (e) => {
	let lang = e.target.value;
	voiceDropList(lang);
	toggleSpacingField(lang);
});

form.elements['randomMode'].addEventListener("change", switchRandomMode);

let supportedVoices = [];
let randomMode = false;


function populateVoiceList() {
	let voices = speechSynthesis.getVoices();

	if (!voices.length) {
		return;
	}

	supportedVoices = voices;
	langDropList(voices);
	voiceDropList(form.elements['lang'].value);
}


populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
	speechSynthesis.onvoiceschanged = populateVoiceList;
}


function getData() {
	let lang = form.elements['lang'].value;

	let voiceName = form.elements['voice'].value;
	let voice = null;

	if (!randomMode) {

		for (let i = 0; i < supportedVoices.length; i++) {
			if (supportedVoices[i].name === voiceName) {
				voice = supportedVoices[i];
				break;
			}
		}

	} else {

		voice = randomModeList();
		lang = '';
	}


	let rate = form.elements['rate'].value;
	let pause = +form.elements['pause'].value
	let random = randomMode;
	return {
		lang,
		voice,
		rate,
		pause,
		random
	}
}

function langDropList(voices) {

	let dropElem = form.elements['lang'];
	let random = form.elements['random'];

	let list = Object.assign({}, consts.LANGS);
	let elemString = '';

	voices.forEach(voice => {
		if (list[voice.lang]) {
			elemString += `<option value="${voice.lang}" `;

			if (voice.lang === consts.LANG_DEFAULT) {
				elemString += 'selected';
			}

			elemString += `>${list[voice.lang].name}</option>`;
			delete list[voice.lang];
		}
	});

	dropElem.innerHTML = elemString;
	random.innerHTML = elemString;

	if (voices.length < 2) {
		list.disabled = true;
		form.elements['randomMode'].disabled = true;
	}
}

/* 	voices for a selected language
	if there is only one voice, input is blocked
*/
function voiceDropList(lang = 'en-US') {
	let list = form.elements['voice'];

	if (!supportedVoices.length) {
		return;
	}

	let elemString = '';
	let counter = 0;
	supportedVoices.forEach(voice => {
		if (voice.lang === lang) {
			elemString += `<option value="${voice.name}">${voice.name}</option>`;
			counter++;
		}
	});

	list.innerHTML = elemString;

	if (counter <= 1) {
		list.disabled = true;
	} else {
		list.disabled = false;
	}
}



function switchRandomMode(e) {
	// disabled language and voice input fields
	if (e.target.checked) {
		form.elements['lang'].disabled = true;
		form.elements['voice'].disabled = true;
		randomMode = true;
		document.getElementById('js-multiple').classList.remove('js-invisible');
	} else {
		form.elements['lang'].disabled = false;
		form.elements['voice'].disabled = false;
		randomMode = false;
		document.getElementById('js-multiple').classList.add('js-invisible');
	}
}

function randomModeList() {
	let elem = form.elements['random'];

	// let langs = [];
	let voices = [];

	for (let child of elem.children) {
		if (child.selected) {

			for (let i = 0; i < supportedVoices.length; i++) {
				if (supportedVoices[i].lang === child.value) {
					voices.push(supportedVoices[i]);
				}
			}

		}
	}

	if (!voices.length) {
		voices.push(supportedVoices[0]);
	}
	
	return voices;
}
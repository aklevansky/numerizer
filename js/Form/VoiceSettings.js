import lodashTemplate from 'lodash.template';
import langSelectTemplate from '../../resources/templates/languageSelectTemplate.html';
import voicesSelectTemplate from '../../resources/templates/voicesSelectTemplate.html';
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

/* 
getData()						returns an object with selected language, voice, rate;
checkSupportedLangs(LANGS)		returns a promise which resolves in an object with supported languages 
								{'en-US': {name: 'English US', voices: [array of voices names if any]}}
								'default' property holds the default language
langDropList(form, selected)	handler for SUPPORTED_LANG promise, creates a drop list with supported langages
								if only one language is supported, selects it and desables the input field
voiceDropList(form, lang)		handler for SUPPORTED_LANG promise, creates a drop list with avaialable voices
*/

// when the language is changed - updated voice list
// toggle "Spacing" field if needed
form.elements['lang'].addEventListener("change", (e) => {
	let lang = e.target.value;
	voiceDropList(lang);
	toggleSpacingField(lang);
});

form.elements['randomMode'].addEventListener("change", switchRandomMode);

const SUPPORTED_LANGS = checkSupportedLangs(consts.LANGS); // promise
let supportedVoices = [];
let randomMode = false;

/* ------------------ */
langDropList();
voiceDropList();
/* -----------------  */

function getData() {
	let lang = form.elements['lang'].value;

	let voiceName = form.elements['voice'].value;
	let voice = null;

	if (!randomMode) {

		for (let i = 0; i < supportedVoices[lang].voices.length; i++) {
			if (supportedVoices[lang].voices[i].name === voiceName) {
				voice = supportedVoices[lang].voices[i];
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

function langDropList() {

	let list = form.elements['lang'];
	let random = form.elements['random'];
	SUPPORTED_LANGS.then(langObj => {

		let langsCleared = Object.assign({}, langObj);
		delete langsCleared.default; // so that we can sort the keys unhidered

		// create a lang Array and sort it alphabetically
		let langArr = Object.keys(langsCleared).sort((langOne, langTwo) => {
			return (langObj[langOne].name > langObj[langTwo].name) ? 1 : -1;
		});

		let optionsList = lodashTemplate(langSelectTemplate)({
			order: langArr,
			langs: langObj,
			selected: langObj.default
		});

		list.innerHTML = optionsList;
		random.innerHTML = optionsList;

		if (langArr.length < 2) {
			list.disabled = true;
			form.elements['randomMode'].disabled = true;
		}
	});
}

/* 	voices for a selected language
	if there is only one voice, input is blocked
*/
function voiceDropList(selected) {
	let list = form.elements['voice'];

	SUPPORTED_LANGS.then(langObj => {

		// for the first call, if the second argument is not specified
		if (!selected) {
			selected = langObj.default || Object.keys(langObj)[0];
		}
		let voiceList = lodashTemplate(voicesSelectTemplate)({
			voices: langObj[selected].voices.map(voice => voice.name)
		});

		list.innerHTML = voiceList;

		if (langObj[selected].voices.length <= 1) {
			list.disabled = true;
		} else {
			list.disabled = false;
		}

	});
}

// returns a promise which resolves in an object with supported languages 
// {'en-US': {name: 'English US', voices: [array of voices names if any]}}
function checkSupportedLangs(LANGS) {
	// adding a droplist of languages
	// a two-stop procedure is necessary to reconcile Chrome and Firefox
	return new Promise((resolve) => {
		let voices = speechSynthesis.getVoices();
		if (Array.isArray(voices) && voices.length) {
			resolve(voices);
		} else {
			speechSynthesis.onvoiceschanged = (e) => {
				resolve(speechSynthesis.getVoices());
			}
		}
	}).then(voices => {
		let supported = {};

		voices.forEach(instance => {
			if (LANGS.hasOwnProperty(instance.lang)) {

				if (!supported.hasOwnProperty(instance.lang)) {
					supported[instance.lang] = LANGS[instance.lang];
					supported[instance.lang].voices = [];
				}

				// set default language
				if (instance.default) {
					supported.default = instance.lang;
				}

				supported[instance.lang].voices.push(instance);

			}
		});
		supportedVoices = supported;
		return supported;

	}).catch(e => {
		console.log(supported);
		return {
			en: 'English'
		};
	});
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

	let langs = [];
	let voices = [];

	for (let child of elem.children) {
		if (child.selected) {
			langs = langs.concat(supportedVoices[child.value].voices);
		}
	}

	return langs;
}
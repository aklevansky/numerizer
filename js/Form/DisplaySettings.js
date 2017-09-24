import {formatInputAll} from './RangeSettings';

const form = document.forms['appForm'];
const SPACING = form.getElementsByClassName('js-digitGroup')[0];

export {toggleSpacingField, getData};

form.addEventListener('change', (e) => {
	if (e.target.closest('.js-separ')) {
		formatInputAll();
	}
});

function getData() {
	let value = form.querySelector('input[name="digitGroup"]:checked').value;
	let japStyle = ( value === '4' ) ? true : false;

	let separator = form.querySelector('input[name="digitSep"]:checked').value;

	let wrapped = !form.elements.displayCurrent.checked;

	let status = 'stop';

	return { japStyle, separator, wrapped, status }
}

// shows "spacing" field (digitGroup) for Japanese, hides for other languages
function toggleSpacingField(lang) {
	

	if (lang === 'ja-JP') {
		SPACING.disabled = false;
		SPACING.classList.remove('js-invisible');

	} else {
		SPACING.disabled = true;
		SPACING.classList.add('js-invisible');
	}
}
import {
	formatNumber
} from '../Commons/helperFunctions';
import * as consts from './FormConstants.js';

let form = document.forms['appForm'];
let SEPARATOR = '';
// holds previous input of a current input field (fixed on keydown event), 
// is used to restore input field after an inappropriate key is pressed
let PREVIOUS_INPUT = ''

let MAX_INPUT = false;
let MIN_INPUT = false;

// flat indicating that data are correct (currently not used, to be implemented)
let ERROR = false;

export {formatInputAll, getData};

// forbid pasting into input fields
form.addEventListener('paste', (e) => {
	if (e.target.classList.contains('js-numbers')) {
		e.preventDefault();
	}
});

form.addEventListener('keydown', (e) => {
	if (e.target.classList.contains('js-numbers')) {
		if (e.key === '-') {
			e.preventDefault();
			changeSign(e.target);
		} else if (Number.isInteger(+e.key) || e.key.toUpperCase() === 'BACKSPACE' || e.key.toUpperCase() === 'DELETE') {
			PREVIOUS_INPUT = +e.target.value.split(SEPARATOR).join('');

		} else if (e.key.toUpperCase() === 'TAB' || e.key.toUpperCase().indexOf('ARROW') !== -1) {
			return;

		} else {
			e.preventDefault();
		}
	}
});


form.addEventListener('input', (e) => {
	if (e.target.classList.contains('js-numbers')) {
		let value = e.target.value.split(SEPARATOR).join('');

		if (value === '' || value === '-') {
			return;
		}

		let valueInt = +value;

		if (isNaN(valueInt)) {
			formatInput(e.target, PREVIOUS_INPUT);
			return;
		}

		if (!checkRange(valueInt, e.target)) {
			formatInput(e.target, PREVIOUS_INPUT);
		} else {
			formatInput(e.target, valueInt);
		}

	}
});

// onblur events for every input field
for (let input of form.querySelectorAll('.js-numbers')) {

	input.addEventListener('blur', (e) => {
		console.log(e);

		if (e.target.value === '' || e.target.value === '-') {
			let value = 0;

			// onblur, put the 0 or first allowed positive integer in the input field
			while (!checkRange(value, e.target)) {
				value++;
			}

			formatInput(e.target, value);
		}
	});

}

/*---------------*/
formatInputAll();
/*---------------*/

function getData() {
	let min = +form.elements.min.value.split(SEPARATOR).join('');
	let max = +form.elements.max.value.split(SEPARATOR).join('');
	let quantity = +form.elements.quantity.value.split(SEPARATOR).join('');
	let error = ERROR;

	return {
		min, max, quantity, error
	}
}

// set SEPARATOR variable and updates input fields
function formatInputAll() {

	let oldSeparator = SEPARATOR;
	SEPARATOR = form.querySelector('input[name="digitSep"]:checked').value;

	for (let input of form.getElementsByClassName('js-numbers')) {
		let valueInt = +input.value.split(oldSeparator).join('');
		formatInput(input, valueInt);
	}
}

// formats number in input field with a right separator
function formatInput(input, value) {
	//(form.querySelector('input[name="digitGroup"]:checked').value === '3') ? false : true;
	//let japStyle = false; // always group numbers in the input field by 3

	input.value = formatNumber(value, SEPARATOR, false);
}

function changeSign(field) {

	let value = field.value;
	let newValue = '';
	// empty value
	if (!value.length) {
		newValue = '-';
	} else if (value[0] === '-') {
		newValue = value.slice(1);
	} else {
		newValue = '-' + value;
	}

	if (newValue === '-' || checkRange(+newValue.split(SEPARATOR).join(''), field)) {
		field.value = newValue;
	}
};

// returns true if value is within allowed range ()
function checkRange(valueInt, field) {

	let max = +field.dataset.max;
	let min = +field.dataset.min;

	return (valueInt >= min && valueInt <= max);
}
import lodashTemplate from 'lodash.template';
import numberSetTemplate from '../../resources/templates/numberSetTemplate.html';
import {
	formatNumber
} from '../Commons/helperFunctions';
import {
	toggleWrap
} from './ViewController';

export {
	createSessionElement,
	getSessionElement
};

const display = document.getElementById('js-displayResult');
const clearAll = document.getElementById('js-clearBtn');

let numberSetsCounter = 0;

function createSessionElement(data) {

	numberSetsCounter++

	let numbers = data.numbers.map(num => formatNumber(num, data.separator, data.japStyle, data.decimal));

	let sessionHTML = lodashTemplate(numberSetTemplate)({
		numberSetsCounter,
		numbers,
		rate: data.rate,
		wrapped: data.wrapped
	});

	let session = document.createElement('div');
	session.classList.add('js-session');
	session.innerHTML = sessionHTML;

	data.element = {};
	data.element.numberSet = session;
	data.element.spans = Array.from(session.getElementsByClassName('js-numberSet')[0].children); // without converting collection to array won't work in Edge
	if (data.wrapped) {
		toggleWrap(data);
	}

	display.insertBefore(session, display.firstChild);
	session.classList.add('slideDown');

	document.getElementById('setInfo').classList.remove('js-inactive');

	return data;
}

function getSessionElement(num) {

		let numbers = display.getElementsByClassName('js-number');

		for (let number of numbers) {
			if (+number.innerHTML === num) {
				return number.closest('.js-session');
			}
		}

	return null;
}
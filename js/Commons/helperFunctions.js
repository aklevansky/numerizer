import writtenNumber from 'written-number';
export {
	formatNumber,
	localizeNum
};


function localizeNum(num, lang = 'en-US') {
	if (num >= 1000000 && lang.startsWith('en-')) {
		return writtenNumber(num);
	}

	if (lang.startsWith('es') && !Number.isInteger(num)) {
		let decimalPart = getDecimal(num);
		decimalPart = getSpanishDecimal(decimalPart);
		let intPart = writtenNumber(Math.floor(num), { lang: 'es' });
		let numStr = intPart + ' coma ' + decimalPart;
	
		return numStr;
}

return num.toLocaleString(lang);
}

function getSpanishDecimal(numStr) {

	if (numStr[0] === '0') {
		let next = getSpanishDecimal(numStr.slice(1));
		return 'cero ' + next;
	} else {
		return writtenNumber(numStr, { lang: 'es' });
	}
}



function formatInteger(num, separator = ' ', japStyle = false) {

	let negative = (num < 0) ? true : false
	let numStr = Math.abs(num).toString();

	let group = (japStyle === false) ? 3 : 4;
	// https://stackoverflow.com/questions/33792279/how-to-split-a-number-into-groups-of-n-digits

	var re = new RegExp("(\\d+?)(?=(\\d{" + group + "})+(?!\\d)|$)", "g");
	let arr = numStr.match(re);

	if (negative) {
		arr[0] = '-' + arr[0];
	}

	return arr.join(separator);

}

function formatNumber(num, separator = ' ', japStyle = false, decimal = ',') {
	decimal = (separator === ',') ? '.' : ',';
	let decimalPart = getDecimal(num);

	let int = formatInteger(Math.floor(num), separator, japStyle)

	if (+decimalPart === 0) {
		return int;
	}

	return int + decimal + decimalPart
}


function getDecimal(num) {
	let str = "" + num;
	let zeroPos = str.indexOf(".");
	if (zeroPos == -1) return 0;
	str = str.slice(zeroPos + 1); // cut what is after '.';
	return str;
}
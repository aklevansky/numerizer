function formatNumber(num, separator = ' ', japStyle = false) {

	let negative =  ( num < 0 ) ? true : false 
	let numStr = Math.abs(num).toString();

	let group = ( japStyle === false ) ? 3 : 4;
	// https://stackoverflow.com/questions/33792279/how-to-split-a-number-into-groups-of-n-digits

	var re = new RegExp("(\\d+?)(?=(\\d{" + group + "})+(?!\\d)|$)", "g");
	let arr = numStr.match(re);

	if (negative) {
		arr[0] = '-' + arr[0];
	}

	return arr.join(separator);

}

export {formatNumber};
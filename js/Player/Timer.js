'use strict';

export default class Timer {
	constructor(elem) {
		if (!elem) {
			elem = document.createElement('span');
		}

		this._elem = elem;
		this._count = 1;
		this._elem.innerHTML = '00:00';
		this._seconds = 0;
		this._minutes = 0;
		this.paused = false;

		this.timer = setInterval(() => {

			this._elem.innerHTML = this._setTime(this._count);

			this._count = this.paused === true ? this._count : this._count + 1;

			if (this._count === 3600) {
				this._count = 0;
			}
		}, 1000);
	}

	resume() {
		this.paused = false;
	}

	stop() {
		clearInterval(this.timer);
		this._elem.innerHTML = '00:00';
		this.paused = false;
	}

	pause() {
		this.paused = true;
	}

	_setTime(count) {
		// if (count % 60) {
		// 	this._seconds++;
		// } else {
		// 	this._minutes++;
		// }
		let min = Math.floor(count / 60);
		let sec = count % 60;

		return createTimeString(sec, min);

	}
}

function createTimeString(sec, min) {
	sec = (sec < 10) ? '0' + sec : sec;
	min = (min < 10) ? '0' + min : min;

	return min + ':' + sec;
}
import {
	updateCurrentSession,
} from './ViewController';
//import writtenNumber from 'written-number';
import {localizeNum} from '../Commons/helperFunctions';

let Speaker = {
	play,
	pause,
	stop
}
export default Speaker;
let currentSession = null;
Speaker.resume = null;

function play(session) {
	if (Speaker.resume) {
		return Speaker.resume(session);
	}
	// if paused
	if (currentSession === session) {
		session.status = 'play';
		speechSynthesis.resume();
		return Promise.resolve(session);
	}
	speechSynthesis.cancel();
	session.status = 'play';
	currentSession = session;
	session.utterances = createUtterances(session);
	let gen = utterancesGenerator(session);
	return new Promise(resolve => {
		speak(gen);

		function speak(generator) {
			let nextUtterance = generator.next();
			if (!nextUtterance.done) {
				nextUtterance.value
					.then(result => pauseNext(result))
					.then(result => waitIfPaused(result))
					.then(result => {
						if (result.status === 'stop') {
							resolve(result);
							return;
						}
						speak(generator);
					})
					.catch(e => {
						console.log(e)
					});
			} else {
				stop(session);
				resolve(session);
			}
		}
	});
}

function waitIfPaused(session) {
	if (session.status !== 'pause') {
		return session;
	}
	return new Promise(resolve => {
		Speaker.resume = resume;

		function resume(session) {
			session.status = 'play';
			speechSynthesis.cancel();
			resolve(session);
			// so that the promise chain in the Player module can continue
			Speaker.resume = null;
			return Promise.resolve(session);
		}
	})
}

function pauseNext(session) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(session)
		}, session.pause * 1000);
	});
}

function pause(session) {
	if (!session) {
		return;
	}
	session.status = 'pause';
	speechSynthesis.pause();
	return Promise.resolve(session);
}

function stop(session) {
	if (!session) {
		return;
	}
	session.status = 'stop';
	speechSynthesis.cancel();
	Speaker.resume = null;
	currentSession = null;
	return Promise.resolve(session);
}

function* utterancesGenerator(session) {
	let {
		utterances
	} = session;
	let counter = 0;
	while (counter < utterances.length) {
		let msg = utterances[counter];
		msg.rate = +session.rate;
		let span = session.element.spans[counter];
		if (session.status === 'stop') {
			return null;
		}
		yield new Promise(resolve => {
			msg.addEventListener('start', e => {
				updateCurrentSession(span, {
					number: span.innerHTML,
					voice: msg.voice.name,
					lang: msg.voice.lang,
					rate: msg.rate,
					pause: session.pause
				});
			});
			msg.addEventListener('end', e => {
				updateCurrentSession(span);
				resolve(Promise.resolve(session));
			});

			speechSynthesis.cancel();
			console.log(msg); // in google chrome for some reason onend event may not fire without this line
			speechSynthesis.speak(msg);
		});
		counter++
	}
	return null;
}

function createUtterances({
	numbers,
	voice,
	rate,
	random
} = session) {

	if (random) {
		return createUtterancesRandom(numbers, voice, rate);
	}

	let utterances = [];
	numbers.forEach(number => {
		let msg = null;
		msg = new SpeechSynthesisUtterance(localizeNum(number, voice.lang));
		msg.voice = voice;
		msg.lang = voice.lang;
		msg.rate = +rate;
		utterances.push(msg);
	});

	return utterances;
}

function createUtterancesRandom(numbers, voice, rate) {

	let utterances = [];
	numbers.forEach((number, i) => {
		let msg = null;
		msg = new SpeechSynthesisUtterance(localizeNum(number, voice[i].lang));
		msg.voice = voice[i];
		msg.lang = voice[i].lang;
		msg.rate = +rate;
		utterances.push(msg);

	});

	return utterances;
}
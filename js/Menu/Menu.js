import menuList from '../../resources/templates/menuList.html';
import {
	switchToItem,
	closeItem
} from './MenuItem';

export {closeMenu};

let menuBtn = document.getElementById('menu-toggle');

let menuWrapper = document.createElement('div');
menuWrapper.classList.add('menuWrapperList');
menuWrapper.innerHTML = menuList;
document.body.appendChild(menuWrapper);
menuWrapper.addEventListener('click', selectMenuItem);

let activeItem = null; // currentlySelectedItem

if (menuBtn) {
	menuBtn.addEventListener('click', toggleMenu);
}

function toggleMenu(e) {
	document.getElementById('js-numTrainer').classList.toggle('js-menuOn');
	let open = null; // menu open / closed flag

	// menuBtn.classList.toggle('js-rotate');
	menuBtn.classList.toggle('active');
	if (!document.getElementById('js-menu-screen')) {

		createBlockScreen();
		menuWrapper.classList.add('active');
		open = true;

	} else {

		menuWrapper.classList.remove('active');
		if (activeItem) {
			activeItem.classList.remove('active');
			activeItem = null;
		}
		closeItem();
		removeBlockScreen();
		open = false;
	}

	// inform the app
	let event = new CustomEvent('menuToggle', {
		detail: {
			open
		}
	});
	document.dispatchEvent(event);
}

function closeMenu() {
	let screen = document.getElementById('js-menu-screen');

	if (screen) {

		if (activeItem) {
			activeItem.classList.remove('active');
			activeItem = null;
			closeItem();
		} else {
			screen.removeEventListener('click', closeMenu);
			toggleMenu();
		}

	}
}

function createBlockScreen() {
	let screen = document.createElement('div');
	screen.id = 'js-menu-screen';
	screen.classList.add('screen');
	screen.innerHTML = '<div class="bottom"></div>';
	document.body.appendChild(screen);
	screen.addEventListener('click', closeMenu);
}

function removeBlockScreen() {
	let screen = document.getElementById('js-menu-screen');
	if (screen) {
		screen.parentNode.removeChild(screen);
	}
}

function selectMenuItem(e) {
	let item = e.target.closest('.js-menuItem');

	if (item) {
		activeItem = toggleActiveItem(item);
		switchToItem(item.dataset.item);
	}
}


function toggleActiveItem(item) {
	if (activeItem) {
		activeItem.classList.remove('active');
	}
	item.classList.add('active');
	return item;
}
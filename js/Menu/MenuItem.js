import menuItemHtml from '../../resources/templates/menuItem.html';
import myself from '../../resources/templates/myself.html';
import {closeMenu} from './Menu';

export {switchToItem, closeItem};


let itemContainer = document.createElement('div');
itemContainer.id = 'js-menuItem';
itemContainer.classList.add('menuWrapperItem')
document.body.appendChild(itemContainer);

let current = null;

function switchToItem(itemName) {

	if (!current) {

		let item = document.createElement('div');
		item.classList.add('itemDetails');

		let text = '';
		switch (itemName) {
			case 'myself':
			text = myself;
			break;
		}

		item.innerHTML = text;
		itemContainer.appendChild(item);
		current = item;
		itemContainer.classList.add('active');
		document.getElementById('js-itemBackBtn').addEventListener('click', closeMenu);

	} else {
		current.innerHTML = menuItemHtml;

	}

}

function closeItem() {
	if (!current) {
		return;
	} else {
		itemContainer.classList.remove('active');
		itemContainer.innerHTML = '';
		current = null;
	}
}
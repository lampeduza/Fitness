const buyButton = document.querySelector('.header__buy');
const subscriptionsSection = document.querySelector('#subscriptions');

buyButton.addEventListener('click', (evt) => {
	evt.preventDefault();

	const subscriptionsPosition = subscriptionsSection.getBoundingClientRect().top;

	window.scrollBy({
		top: subscriptionsPosition,
		behavior: "smooth",
	});
});



const subscriptionsSlider = subscriptionsSection.querySelector('.subscriptions__slider');

subscriptionsSlider.addEventListener('click', (evt) => {

});


const reviewsCarousel = document.querySelector('.reviews__carousel');
reviewsControlsList = reviewsCarousel.querySelector('.reviews__controls');

/*
for (const control of reviewsControlsList.children) {
	control.style.backgroundColor = 'purple';
}
*/

// reviewsControlsList[1].addEventListener('click', (evt) => {

// });



const coachesSection = document.querySelector('.coaches');
const coachesList = coachesSection.querySelector('.coaches__slider');
const coachesControlsList = coachesSection.querySelector('.coaches__controls');
const coachesControls = coachesControlsList.children;
const coaches = coachesList.children;
let coachesItemsOffset = 0;
const COACHES_VISIBLE_COUNT = 4;

/*
for (const control of coachesControlsList.children) {
	control.style.backgroundColor = 'purple';
}

for (const coach of coaches) {
	coach.style.transition = 'all 500ms ease-in-out';
	coach.style.webkitTransition = 'all 500ms ease-in-out';
}
*/

coachesControls[1].addEventListener('click', (evt) => {
	const coachesCount = coaches.length;

	const transition = coaches[1].getBoundingClientRect().left - coaches[0].getBoundingClientRect().left;

	if (coachesItemsOffset < transition * (coachesCount - COACHES_VISIBLE_COUNT)) {
		coachesItemsOffset += transition;
		for (const coach of coaches) {
			coach.style.left = `-${coachesItemsOffset}px`;
		}
	}
});

coachesControls[0].addEventListener('click', (evt) => {
	const coachesCount = coaches.length;

	const transition = coaches[1].getBoundingClientRect().left - coaches[0].getBoundingClientRect().left;

	if (coachesItemsOffset > 0) {
		coachesItemsOffset -= transition;
		for (const coach of coaches) {
			coach.style.left = `-${coachesItemsOffset}px`;
		}
	}
});

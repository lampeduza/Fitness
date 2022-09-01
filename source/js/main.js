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

// const subscriptionsSlider = subscriptionsSection.querySelector('.subscriptions__slider');

//// slider & carousel;
const reviewsCarousel = document.querySelector('.reviews__carousel');
const reviewsContainer = reviewsCarousel.querySelector('.reviews__slider');
const reviews = reviewsContainer.children;
const reviewsControls = reviewsCarousel.querySelector('.reviews__controls').children;

const coachesSection = document.querySelector('.coaches');
const coachesList = coachesSection.querySelector('.coaches__slider');
const coachesControlsList = coachesSection.querySelector('.coaches__controls');
const coachesControls = coachesControlsList.children;
const coaches = coachesList.children;

class ControlsClick {
	constructor({
		slideList,
		slideListContainer,
		slidesVisibleCount = 1, 
		controls, 
		clickTimeout = 250,
	} = {}) {
		this._slideList = slideList;
		this._slideListContainer = slideListContainer;
		this._clickTimeout = clickTimeout;
		this._slidesVisibleCount = slidesVisibleCount;
		this._slidesCount = this._slideList.length;
		// this._slidesOffset = 0;
		// this._transition = Math.round(
		// 	this._slideList[1].getBoundingClientRect().left - this._slideList[0].getBoundingClientRect().left
		// );
		this._leftControl = controls[0];
		this._rightControl = controls[1];
		this._firstSlide = slideList[0];

		this._step = 0;

		this._leftControl.addEventListener(
			'click',
			this._debounceLeft(this._onLeftClick, this._clickTimeout),
		);

		this._rightControl.addEventListener(
			'click',
			this._debounceRight(this._onRightClick, this._clickTimeout),
		);
	}

	_debounceRight = (cb, timeout) => {
  	let timeoutId;

  	this._debouncedRightHandler = () => {
  		if (timeoutId) {
  			clearTimeout(timeoutId);
  	  	timeoutId = setTimeout(cb, timeout);
  	  	return;
  		}

  		cb();
  		timeoutId = setTimeout(() => {}, 0);
  	};

  	return this._debouncedRightHandler;
	};

	_debounceLeft = (cb, timeout) => {
  	let timeoutId;

  	 this._debouncedLeftHandler = () => {
  		clearTimeout(timeoutId);
  	  timeoutId = setTimeout(cb, timeout);
  	};

  	return this._debouncedLeftHandler;
	};

	_onRightClick = () => {
		this._rightControl.removeEventListener(
			'click',
			this._debouncedRightHandler,
		);

		this._transition = Math.round(
			this._slideList[1].getBoundingClientRect().left - this._slideList[0].getBoundingClientRect().left
		);

		for (const slide of this._slideList) {
			slide.style.transition = 'all 0.5s ease-in-out';
			slide.style.left = '0px';

			setTimeout(() => {
				slide.style.left = `-${this._transition}px`;
			}, 0);
		}

		setTimeout(() => {
			this._firstSlide.remove();
			this._slideListContainer.append(this._firstSlide);
			this._firstSlide = this._slideList[0];

			for (const slide of this._slideList) {
				slide.style.transition = 'initial';
				slide.style.left = '0px';
			}

			this._rightControl.addEventListener(
				'click',
				this._debouncedRightHandler,
			);
		}, 500);
	};

	_onLeftClick = () => {
		this._leftControl.removeEventListener(
			'click',
			this._debouncedLeftHandler,
		);

		this._transition = Math.round(
			this._slideList[1].getBoundingClientRect().left - this._slideList[0].getBoundingClientRect().left
		);

		this._firstSlide = this._slideListContainer.insertBefore(
			this._slideList[this._slidesCount - 1],
			this._slideList[0]
		);

		for (const slide of this._slideList) {
			slide.style.transition = 'initial';
			slide.style.left = `-${this._transition}px`;

			setTimeout(() => {
				slide.style.transition = 'all 0.5s ease-in-out';
				slide.style.left = `0px`;

				setTimeout(() => {
					this._leftControl.addEventListener(
						'click',
						this._debouncedLeftHandler,
					);
				}, 550);
			}, 50);
		}
	};
};

new ControlsClick({
	slideList: coaches, 
	slideListContainer: coachesList,
	slidesVisibleCount: 4, 
	controls: coachesControls, 
	clickTimeout: 250,
});

new ControlsClick({
	slideList: reviews,
	slideListContainer: reviewsContainer, 
	slidesVisibleCount: 1, 
	controls: reviewsControls, 
	clickTimeout: 250,
});



//// telephone input
class TelephoneInputValidation {
	constructor(telephoneField) {
		this._telephoneField = telephoneField;

		this._telephoneField.addEventListener('input', this._onTelephoneInput);
	}

	_onTelephoneInput = (evt) => {
		const input = evt.target;
		const currentCursorPosition = input.selectionStart;

		const validValue = input.value.split('').filter(this._isValidChar).join('');
		let invalidCharsCount = input.value.length - validValue.length;

		if (input.value.indexOf("+") > -1 && validValue.indexOf("+") === -1) {
			invalidCharsCount--;
		}

		const cursorPosition = currentCursorPosition - invalidCharsCount;

		input.value = validValue;
		input.setSelectionRange(cursorPosition, cursorPosition);
	};

	_isValidChar = (char, currentIndex) => {
		return Number.isInteger(+char) && char !== ' ' || 
			(currentIndex === 0 && char === "+");
	};
}

new TelephoneInputValidation(
	document.querySelector('#number-field')
);


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

class AbstractSlider {
	constructor({
		slideList,
		slideListContainer,
		controls, 
		clickTimeout = 250,
	} = {}) {
		this._slideList = slideList;
		this._slideListContainer = slideListContainer;
		this._clickTimeout = clickTimeout;
		this._slidesCount = this._slideList.length;
		this._transition = Math.round(
			this._slideList[1].getBoundingClientRect().left - this._slideList[0].getBoundingClientRect().left
		);
		this._leftControl = controls[0];
		this._rightControl = controls[1];
		this._firstSlide = slideList[0];
		this._rightButton = this._rightControl.querySelector('button');
		this._leftButton = this._leftControl.querySelector('button');

		setTimeout(() => {
			this._leftControl.addEventListener(
				'click',
				this._debounceLeft(this._onLeftClick, this._clickTimeout),
			);

			this._rightControl.addEventListener(
				'click',
			this._debounceRight(this._onRightClick, this._clickTimeout),
			);
		}, 0);
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

	_onLeftClick = () => {
		throw new Error('Abstract method not implemented: _onLeftClick');
	};

	_onRightClick = () => {
		throw new Error('Abstract method not implemented: _onRightClick');
	};
};

class Slider extends AbstractSlider {
	constructor({
		slideList,
		slideListContainer,
		controls, 
		clickTimeout = 250,
	} = {}) {
		super(
			{slideList,
			slideListContainer,
			controls, 
			clickTimeout}
		);
	}

	_onRightClick = () => {
		if (this._areAllSlidesVisible()) {
			return;
		}

		this._rightControl.removeEventListener(
			'click',
			this._debouncedRightHandler,
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
		if (this._areAllSlidesVisible()) {
			return;
		}

		this._leftControl.removeEventListener(
			'click',
			this._debouncedLeftHandler,
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

	_areAllSlidesVisible = () => {
		this._slidesCount = this._slideList.length;
		this._transition = Math.round(
			this._slideList[1].getBoundingClientRect().left - this._slideList[0].getBoundingClientRect().left
		);
		const slideListContainerWidth =  Math.round(
			this._slideListContainer.getBoundingClientRect().right - this._slideListContainer.getBoundingClientRect().left
		);

		return this._slidesCount * this._transition <= slideListContainerWidth;
	};
};

class Carousel extends AbstractSlider{
	constructor({
		slideList,
		slideListContainer,
		slidesVisibleCount = 1, 
		controls, 
		clickTimeout = 250,
	} = {}) {
		super({
			slideList,
			slideListContainer,
			slidesVisibleCount, 
			controls, 
			clickTimeout,
		});

		this._slidesVisibleCount = slidesVisibleCount;
		this._slidesOffset = 0;

		this._checkControlsAccessibility();
	}

	_onRightClick = () => {
		this._transition = Math.round(
			this._slideList[1].getBoundingClientRect().left - this._slideList[0].getBoundingClientRect().left
		);
		this._slidesCount = this._slideList.length;

		if (this._slidesOffset < this._transition * (this._slidesCount - this._slidesVisibleCount)) {
			this._slidesOffset += this._transition;

			for (const slide of this._slideList) {
				slide.style.transition = 'all 0.5s ease-in-out';
				slide.style.left = `-${this._slidesOffset - this._transition}px`;
				setTimeout(() => {slide.style.left = `-${this._slidesOffset}px`;}, 50);
			}
		}

		this._checkControlsAccessibility();
	};

	_onLeftClick = () => {
		this._transition = Math.round(
			this._slideList[1].getBoundingClientRect().left - this._slideList[0].getBoundingClientRect().left
		);
		this._slidesCount = this._slideList.length;

		if (this._slidesOffset > 0) {
			this._slidesOffset -= this._transition;

			for (const slide of this._slideList) {
				slide.style.transition = 'all 0.5s ease-in-out';
				slide.style.left = `-${this._slidesOffset + this._transition}px`;
				setTimeout(() => {slide.style.left = `-${this._slidesOffset}px`;}, 50);
			}
		}

		this._checkControlsAccessibility();
	};

	_checkControlsAccessibility = () => {
		if (this._slidesOffset === 0) {
			this._leftButton.style.opacity = '0.5';
			this._leftButton.style.cursor = 'default';
			this._leftButton.disabled = true;
		} else {
			this._leftButton.style.opacity = '1';
			this._leftButton.style.cursor = 'pointer'
			this._leftButton.disabled = false;
		}

		if (this._slidesOffset >= this._transition * (this._slidesCount - this._slidesVisibleCount)) {
			this._rightButton.style.opacity = '0.5';
			this._rightButton.style.cursor = 'default';
			this._rightButton.disabled = true;
		} else {
			this._rightButton.style.opacity = '1';
			this._rightButton.style.cursor = 'pointer';
			this._rightButton.disabled = false;
		}
	};
};

new Slider({
	slideList: coaches, 
	slideListContainer: coachesList,
	controls: coachesControls, 
	clickTimeout: 250,
});

new Carousel({
	slideList: reviews,
	slideListContainer: reviewsContainer,  
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

// local storage
if (window.localStorage) {
  const fields = document.querySelectorAll('input');

  for (let field of fields) {
    const name = field.getAttribute('name');
    field.value = localStorage.getItem(name) || field.value;

    field.onkeyup = function() {
      localStorage.setItem(name, field.value);
    };
  }
}

// tabs
const controls = document.querySelectorAll('.subscriptions__control');
const contents = document.querySelectorAll('.subscriptions__card');

controls.forEach((control, index) => {
	control.addEventListener('click', () => {
		contents.forEach(content => content.classList.remove('subscriptions__card--visible'));
		controls.forEach(control => control.classList.remove('subscriptions__control--current'));
		contents[index].classList.add('subscriptions__card--visible');
		controls[index].classList.add('subscriptions__control--current');
	});
});

// video
const generateURL = (id) => {
    let query = '?rel=0&showinfo=0&autoplay=1';

    return 'https://www.youtube.com/embed/' + id + query;
};

const createIframe = (id) => {
    const iframe = document.createElement('iframe');

    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'autoplay');
    iframe.setAttribute('src', generateURL(id));
    // iframe.classList.add('represent__action');

    return iframe;
};

const parseMediaURL = (href) => {
    const regexp = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/;
    const match = href.match(regexp);

    return match[1];
};

const setupVideo = (video) => {
    const link = video.querySelector('.represent__video-link');
		const href = link.getAttribute('href');
		const button = video.querySelector('.represent__video-play');
		const id = parseMediaURL(href);

    video.addEventListener('click', () => {
        const iframe = createIframe(id);

        link.remove();
        button.remove();
        video.append(iframe);
    });

    link.removeAttribute('href');
    video.classList.add('represent__video');
};

setupVideo(
	document.querySelector('.represent__video')
);
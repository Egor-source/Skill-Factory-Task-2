export default class Slider {
    constructor(slider, options = {navigation: true}) {
        this.slider = slider;
        this.wrapper = this.slider.querySelector('.slider-wrapper');
        this.index = 1;
        let i = 1;
        this.slids = Array.from(this.slider.querySelectorAll('.slide')).reduce((acc, slide) => {
            acc[i] = slide;
            i++;
            return acc;
        }, {})
        let cloneLast = this.slids[Object.keys(this.slids).length].cloneNode(true);
        let cloneFirst = this.slids[1].cloneNode(true);
        cloneLast.classList.add('duplicate-last');
        cloneFirst.classList.add('duplicate-first');
        this.slids[0] = cloneLast;
        this.slids[Object.keys(this.slids).length] = cloneFirst;
        this.wrapper.prepend(cloneLast);
        this.wrapper.append(cloneFirst);
        this.wrapper.addEventListener('transitionend', () => {
            if (this.slids[this.currentSlideIndex].classList.contains('duplicate-last')) {
                this.currentSlideIndex = Object.keys(this.slids).length - 2;
                this.changeSlide('none');
            }
            if (this.slids[this.currentSlideIndex].classList.contains('duplicate-first')) {
                this.currentSlideIndex = 1;
                this.changeSlide('none');
            }
        })
        this.wrapper.setAttribute('style', `transform:translateX(-${this.slids[1].offsetLeft}px)`);

        let resizeObserver = new ResizeObserver(() => {
            this.changeSlide('none');
        })
        resizeObserver.observe(this.slider);

        if (options.navigation) {
            this.initNavigation();
        }
        if (options.pagination?.bullet) {
            this.initBullet();
        }
        if (options.pagination?.tabs) {
            this.initTabs(options.pagination.tabs);
        }
    }

    set currentSlideIndex(value) {
        if (value != this.index) {
            this.bullets[this.index]?.classList.remove('active');
            this.bullets[value]?.classList.add('active');
            this.tabs[this.index]?.classList.remove('active');
            this.tabs[value]?.classList.add('active');
            this.index = value
            this.changeSlide('.3s');
        }
    }

    get currentSlideIndex() {
        return this.index;
    }

    initNavigation() {
        this.prevBtn = this.slider.querySelector('.slider-navigation_prev');
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn = this.slider.querySelector('.slider-navigation_next');
        this.nextBtn.addEventListener('click', () => this.next());
    }

    initBullet() {
        let bulletsContainer = this.slider.querySelector('.slider-pagination_bullet');
        let keys = Object.keys(this.slids);
        this.bullets = {};
        for (let i = 1; i < keys.length - 1; i++) {
            let bullet = document.createElement('div')
            bullet.classList.add('pagination-bullet');
            if (i == 1) {
                bullet.classList.add('active');
            }
            bullet.addEventListener('click', () => {
                this.currentSlideIndex = parseInt(keys[i]);
            })
            this.bullets[keys[i]] = bullet;
            bulletsContainer.append(bullet);
        }
    }

    initTabs(tabArray) {
        let tabsContainer = this.slider.querySelector('.slider-navigation_tabs');
        this.tabs = {};

        tabArray.forEach(({text, classList}, index) => {
            let tab = document.createElement('div');
            classList.forEach(tabClass => {
                tab.classList.add(tabClass);
            })
            if (index == 0) {
                tab.classList.add('active');
            }
            tab.textContent = text;
            tab.addEventListener('click', () => {
                this.currentSlideIndex = index + 1;
            })
            this.tabs[index + 1] = tab;
            tabsContainer.append(tab);
        })

    }

    changeSlide(transition) {
        let slide = this.slids[this.currentSlideIndex];
        this.wrapper.setAttribute('style', `transform:translateX(-${slide.offsetLeft}px);transition:${transition};`);
    }

    prev() {
        this.currentSlideIndex = this.currentSlideIndex == 0 ? Object.keys(this.slids).length - 1 : this.currentSlideIndex - 1;
    }

    next() {
        this.currentSlideIndex = this.currentSlideIndex == Object.keys(this.slids).length - 1 ? 0 : this.currentSlideIndex + 1;
    }
}
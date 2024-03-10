class Slider {
    constructor(elements) {
        this.elements = elements;
        this.currentValue = 0;
        this.initializeHover();
    }

    initializeHover() {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].addEventListener("mouseenter", () => this.handleMouseEnter(i));
            this.elements[i].addEventListener("mouseleave", () => this.handleMouseLeave());
            this.elements[i].addEventListener("click", () => this.handleClick(i + 1));
        }
    }

    handleMouseEnter(index) {
        if (this.currentValue === 0) {
            for (let j = 0; j <= index; j++) 
                this.elements[j].classList.add("colored");
        }
    }

    handleMouseLeave() {
        if (this.currentValue === 0) {
            this.removeAllColors();
        } else {
            Array.from(this.elements).slice(0, this.currentValue).forEach(element => element.classList.add("colored"));
        }
    }

    handleClick(value) {
        this.currentValue = value;
        this.removeAllColors();
        Array.from(this.elements).slice(0, value).forEach(element => element.classList.add("colored"));
        // window.location.href = window.location.href + "/" + value
    }

    removeAllColors() {
        Array.from(this.elements).forEach(element => element.classList.remove("colored"));
    }

    reset () {
        this.removeAllColors();
        this.currentValue = 0;
    }
}


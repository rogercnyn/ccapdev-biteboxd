let isLogged = getUrlParameter('isLogged');



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
    }

    removeAllColors() {
        Array.from(this.elements).forEach(element => element.classList.remove("colored"));
    }
}


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function adjustNavBar (){

    if (isLogged != 'true') {
        document.getElementById('account-icon').style.display = 'none';
    } else {
        document.getElementById('person-icon').style.opacity = '0%';
        document.getElementById('person-icon').style.pointerEvents = 'none';
    }
    
}

function transferSession(link) {
    if(isLogged === 'true'){
        link += '?isLogged=true'
    } 
    window.location.href = link
}



function adjustResult() {
    let query = getUrlParameter('query');

    if (query != '') {
        document.getElementById('empty').style.display = 'none';
    } else {
        document.getElementById('results').style.display = 'none';
        document.getElementById('search-settings').style.display = 'none';
        document.getElementById('content').style.marginLeft = "15%"   
    }
}


function search() {
    let query = document.querySelector('.search-bar').value;
    let dest = 'search.html?query=' + encodeURIComponent(query);
    appendLogin(dest)
}

function appendLogin(dest) {
    if(isLogged === 'true'){
        dest += '&isLogged=true'
    }
    window.location.href = dest;
}


const stars = new Slider(document.getElementsByClassName("slider-star-rating"));
const cashEmos = new Slider(document.getElementsByClassName("slider-price-rating"));


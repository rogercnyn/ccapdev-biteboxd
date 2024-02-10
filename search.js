

let isLogged = getUrlParameter('isLogged');
let stars = document.getElementsByClassName("slider-star-rating");
let currentRating = 0;


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


// Function to update rating
function addRating(n) {
    currentRating = n;
    removeRating();
    Array.from(stars).slice(0, n).forEach(star => star.classList.add("colored"));
}

function removeRating() {
    Array.from(stars).forEach(star => star.classList.remove("colored"));
}


for (let i = 0; i < stars.length; i++) {
    stars[i].addEventListener("mouseenter", function() {
        if (currentRating === 0) {
            for (let j = 0; j <= i; j++) 
                stars[j].classList.add("colored");
        }
    });

    stars[i].addEventListener("mouseleave", function() {
        if (currentRating === 0) {
            removeRating();
        } else {
            Array.from(stars).slice(0, currentRating).forEach(star => star.classList.add("colored"));
        }
    });

    stars[i].addEventListener("click", function() {
        addRating(i + 1); // Add 1 to i because ratings start from 1, not 0
    });
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
        if(isLogged === 'true') {
            dest += '&isLogged=true';
        } 
        window.location.href = dest;
    }

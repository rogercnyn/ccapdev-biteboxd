function search() {
    let query = document.querySelector('.search-bar').value;
    let dest = 'search.html?query=' + encodeURIComponent(query);
    appendLogin(dest)
}

function appendLogin(dest) {
    if(isLogged === 'true'){
        dest += '?isLogged=true'
    }
    window.location.href = dest;
}


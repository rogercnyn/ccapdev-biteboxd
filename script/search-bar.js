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

function clearSearchBar() {
    document.querySelector('.search-bar').value = ''
}

function addClear() {
    let clearIcon = document.getElementById('clear-icon') 
    let searchBar = document.querySelector('.search-bar')

    searchBar.addEventListener('input', function() {
        if(searchBar.value != "")
            clearIcon.style.opacity = "100%";
    });

    searchBar.addEventListener('focus', function() {
        if(searchBar.value != "")
            clearIcon.style.opacity = "100%";
    });
    
    searchBar.addEventListener('blur', function() {
        clearIcon.style.opacity = "0%";
    });
}
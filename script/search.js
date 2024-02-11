
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



function initializeSearchString() {
    let query = getUrlParameter('query');
    let searchString = document.getElementById('search-string');
    let searchBar = document.querySelector('.search-bar');

    searchString.textContent =  " '" + query + "'";
    searchBar.value = query;

    console.log('query' + searchString.textContent);
}


function clickTrafficLight(element) {
    
    let siblings = element.parentElement.children
    Array.from(siblings).forEach(sibling => sibling.style.border = "none")
    element.style.border = "2px solid black";
}

function initSearchPage() {
    adjustResult();
    initializeSearchString();
}


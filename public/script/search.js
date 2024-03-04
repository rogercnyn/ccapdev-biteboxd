
function adjustResult() {
    let emptyElement = document.getElementById('empty')

    if(emptyElement !== undefined) {
        document.getElementById('content').style.marginLeft = "10%"           
    }

}

// function initializeSearchString() {
//     let query = getUrlParameter('query');
//     let searchString = document.getElementById('search-string');
//     let searchBar = document.querySelector('.search-bar');

//     searchString.textContent =  " '" + query + "'";
//     searchBar.value = query;

// }


function clickTrafficLight(element) {
    
    let siblings = element.parentElement.children
    Array.from(siblings).forEach(sibling => sibling.style.border = "none")
    element.style.border = "2px solid black";
}

function initSearchPage() {
    adjustResult();
}

/*
window.addEventListener('DOMContentLoaded', function() {
    var peekReview = document.querySelector('.peek-review');
    var peekReviewPara = document.querySelector('.peek-review-para');
    var more = peekReviewPara.querySelector('#more');

    // Calculate the height of the peek-review-para
    var paraHeight = peekReviewPara.scrollHeight;

    // Calculate 80% of the peek-review-para height
    var eightyPercentHeight = paraHeight * 0.8;

    // Check if the scroll height of peek-review is greater than or equal to 80% of peek-review-para height
    if (peekReview.offsetHeight >= eightyPercentHeight) {
        more.style.display = 'block'; // Display 'more' div
    }
});
*/

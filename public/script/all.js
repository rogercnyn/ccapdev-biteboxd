
const categoryDictionary = {
    'fil': 'Filipino',
    'cof': 'Coffee',
    'jap': 'Japanese',
    'chi': 'Chinese',
    'ame': 'American',
    'ita': 'Italian',
    'kor': 'Korean',
    'all': 'All Restaurants'
};

function resetCategory() {
    removeClickedButtons();
    showAllContainers();
    changeCategoryTitle('all')
}


function changeCategory(category) {
    clickButtonCategory(category)
    changeCategoryTitle(category)
    let containers = document.getElementsByClassName('resto-container')
    showAllContainers();
    Array.from(containers).forEach(container => {
        if(!container.classList.contains(category)) {
            $(container).hide();
        } 
    })
}

function showAllContainers(){
    let containers = document.getElementsByClassName('resto-container')
    Array.from(containers).forEach(container => $(container).show())
}

function removeClickedButtons() {
    let buttons = document.getElementsByClassName('category-button')
    Array.from(buttons).forEach(button => button.classList.remove('clicked-category'))
}

function clickButtonCategory(category) {
    let element = document.getElementById(category);
    removeClickedButtons();
    element.classList.add('clicked-category')
}


function changeCategoryTitle(category) {
    let categoryTitle = document.getElementById('category-title')
    categoryTitle.textContent = categoryDictionary[category]

}



$(document).ready(function() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const sorting = params.get('sorting')

    
    if(sorting && sorting.length != 0) {
        $('#sorting').val(sorting);
    }
    $('#sorting').change(function() {
        let sorting = $('#sorting').val()
        let url = `${window.location.href.split('?')[0]}?sorting=${sorting}`;
    
        window.location.href = url
    });
})

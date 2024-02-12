
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

function resetCategory(category) {
    removeClickedButtons();
    showAllContainers();
    changeCategoryTitle(category);
}


function changeCategory(category) {
    clickButtonCategory(category)
    changeCategoryTitle(category)
    let containers = document.getElementsByClassName('store-profile')
    showAllContainers();
    Array.from(containers).forEach(container => {
        if(!container.classList.contains(category)) {
            $(container).hide();
        } 
    })
}

function showAllContainers(){
    let containers = document.getElementsByClassName('store-profile')
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
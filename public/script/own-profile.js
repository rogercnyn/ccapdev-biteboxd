document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tab-btn');
    const all_content = document.querySelectorAll('.content');
    const line = document.querySelector('.line');

    document.getElementById('bio').innerText = document.getElementById('bio').getAttribute('value');

    function activateTab(tabIndex) {
        tabs.forEach(tab => { tab.classList.remove('active'); });
        all_content.forEach(content => { content.classList.remove('active'); });

        tabs[tabIndex].classList.add('active');
        all_content[tabIndex].classList.add('active');

        //line size indicator (OC haha)
        line.style.width = tabs[tabIndex].offsetWidth + "px";
        line.style.left = tabs[tabIndex].offsetLeft + "px";
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activateTab(index));
    });

    const defaultTabIndex = 0; 
    activateTab(defaultTabIndex);
});


function toggleSeeMore(reviewId) {
    var truncateText = document.getElementById(reviewId);
    var fullText = truncateText.querySelector('.full-text');
    var seeMoreButton = truncateText.querySelector('.see-more');

    var computedDisplayStyle = window.getComputedStyle(fullText).display;

    if (computedDisplayStyle === 'none') {
        truncateText.style.maxHeight = 'none'; 
        fullText.style.display = 'inline'; 
        seeMoreButton.innerHTML = '<b>...see less</b>';
    } else {
        truncateText.style.maxHeight = '60px'; 
        fullText.style.display = 'none'; 
        seeMoreButton.innerHTML = '<b>...see more</b>';
    }
}

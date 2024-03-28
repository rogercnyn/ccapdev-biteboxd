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


$(document).ready(function() {
    $(".reviewbody").hide();

    $(".review").click(function() {
        var url = "/resto-reviewpage/" + $(this).data('restaurant') + "#" + $(this).attr('id');
        window.location.href = url;
    });
    
});
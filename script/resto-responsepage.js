let starsContainers = document.querySelectorAll(".star-sorting");
let currentRatings = {
    food: 0,
    service: 0,
    price: 0,
};
let maxPhotos = 4;
let quillEditor;
let photoContainer;

function injectQuill(element) {
    const reviewPanel = element.closest('.review-panel');
    const replyPanel = reviewPanel.parentElement.nextElementSibling;
    toggleReplyPanel(replyPanel)


   
}

function toggleReplyPanel(replyPanel){
    
    if ($(replyPanel).is(':hidden')) {
        $(replyPanel).show();
    } else {
        $(replyPanel).hide();
    }
}


function toggleReplyEditor(button) {
    const replyEditor = button.nextElementSibling;
    replyEditor.style.display = replyEditor.style.display === 'none' ? 'block' : 'none';
}

function handleReply(button) {
    var responsePanel = button.parentElement.nextElementSibling;
    var resPanels = document.getElementsByClassName('responsepanel')


    var nthNumber = 0;

    for (var i = 0; i < resPanels.length; i++) {
        if (resPanels[i] === responsePanel) {
            break;
        }
        if (resPanels[i].nodeType === 1) {
            nthNumber++;
        }
    }
    console.log(nthNumber)


    var quill = quills[nthNumber]

    if(quill.getText().trim().length){
        $(responsePanel).show();     
        var html = quills[nthNumber].root.innerHTML;    
        responsePanel.querySelector("#replytext").innerHTML = html;
    }
    
    toggleReplyPanel(responsePanel.previousElementSibling)

    
    
}




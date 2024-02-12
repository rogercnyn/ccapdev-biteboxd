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

    
       // Check if the element is currently hidden
    if ($(replyPanel).is(':hidden')) {
        // If hidden, show the element
        $(replyPanel).show();
    } else {
        // If visible, hide the element
        $(replyPanel).hide();
    }
   
}


function toggleReplyEditor(button) {
    const replyEditor = button.nextElementSibling;
    replyEditor.style.display = replyEditor.style.display === 'none' ? 'block' : 'none';
}

function handleReply() {
    const replyEditorContent = quillEditor.root.innerHTML.trim();

    if (replyEditorContent === '') {
        alert('Please type your reply.');
    } 
    
    else {
        alert('Reply Published!');
        
        quillEditor.root.innerHTML = '';
    }
}




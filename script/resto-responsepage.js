let starsContainers = document.querySelectorAll(".star-sorting");
let currentRatings = {
    food: 0,
    service: 0,
    price: 0,
};
let maxPhotos = 4;
let quillEditor;
let photoContainer;

document.addEventListener("DOMContentLoaded", function () {
    quillEditor = new Quill('#reply-editor', {
        theme: 'snow',
        height: 120,
        placeholder: 'Type here your reply!'
    });
    document.querySelector('.publish-button').addEventListener('click', handleUpload);
});


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


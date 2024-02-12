function createQuill(className){
    quillEditor = new Quill(className, {
        theme: 'snow',
        height: 120,
        placeholder: 'Type your reply here',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'align': [] }],
                [{ 'color': [] }],
                ['link'],
                ['clean']
            ], 
        }
    });

    return quillEditor

}
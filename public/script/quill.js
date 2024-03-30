class QuillEditor {
    constructor(tag, height, placeholder) {
        this.quill = new Quill(tag, {
            theme: 'snow',
            height: height,
            placeholder: placeholder,
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
    }

    getHtml() {
        if(this.quill.getText(0, 10000).trim() === '') {
            return '';
        }
        return this.quill.getSemanticHTML(0, 10000)
    }

    clear() {
        this.quill.root.innerHTML = '';
    }

    setInnerHTMl(value) {
        this.quill.root.innerHTML = value;
    }
}
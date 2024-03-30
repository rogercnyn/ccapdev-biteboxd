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
        const delta = this.quill.getContents()
        const ops = delta.ops;
        return JSON.stringify(ops)
    }

    clear() {
        this.quill.root.innerHTML = '';
    }

    setInnerHTMl(value) {
        const delta = JSON.parse(value)
        this.quill.setContents(delta);
    }
}
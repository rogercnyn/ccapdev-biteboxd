class QuillEditor {
    constructor(tag, height, placeholder) {
        this.quill = new Quill(tag, {
            theme: 'snow',
            height: height,
            placeholder: placeholder
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
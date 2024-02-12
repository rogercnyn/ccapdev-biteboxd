class Like {

    constructor(likeButton, dislikeButton) {
        this.likeButton = likeButton
        this.dislikeButton = dislikeButton
    }

    initializeClick() {
        this.likeButton.addEventListener("click", () => this.toggleColor('like')); 
        this.dislikeButton.addEventListener("click", () => this.toggleColor('dislike')); 
    }



    toggleColor(type) {
        if (type === 'like') {
          this.likeButton.classList.add('colored');
          this.dislikeButton.classList.remove('colored');
        } else {
          this.dislikeButton.classList.add('colored');
          this.likeButton.classList.remove('colored');
        }
    }
    
}
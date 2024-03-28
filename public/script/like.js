class Like {

    constructor(likeButton, dislikeButton, likeCount, dislikeCount, reviewId) {
        this.likeButton = likeButton
        this.dislikeButton = dislikeButton
        this.reviewId = reviewId
        this.likeCount = likeCount
        this.dislikeCount = dislikeCount
    }

    initializeClick() {
        this.likeButton.addEventListener("click", () => { 
          this.toggleColor('like')
        }); 
        this.dislikeButton.addEventListener("click", () => this.toggleColor('dislike')); 
    }

    changeFeedback(like, dislike) {
      this.likeCount.innerText = parseInt(this.likeCount.innerText) + like
      this.dislikeCount.innerText = parseInt(this.dislikeCount.innerText) + dislike
    }

    sendLikeRequest(like, dislike) {
        let likeLink = "/review/" + this.reviewId + "/like"

        console.log(likeLink)
        // console.log(like, dislike)
        $.ajax({
          url: likeLink,
          type: 'GET',
          data: {like: like, dislike: dislike},          
          success: (response) => { 
            console.log("success")
            this.changeFeedback(like, dislike)
        },
          error: function(error) {
            console.log(error)
          }
        });

    }

    dislike(){
        this.dislikeButton.classList.add('colored');
    }

    removeDislike(){
        this.dislikeButton.classList.remove('colored');
    }

    like(){
        this.likeButton.classList.add('colored');
    }

    removeLike(){
        this.likeButton.classList.remove('colored');
    }



    toggleColor(type) {
        let alreadyLiked = this.likeButton.classList.contains('colored') ? 1 : 0;
        let alreadyDisliked = this.dislikeButton.classList.contains('colored') ? 1 : 0;

        
        if (type === 'like') {
            if(!alreadyLiked){
                this.like()
                this.removeDislike()    
            } else {
                this.removeLike()
            }
        } else {

            if(!alreadyDisliked){
                this.dislike()
                this.removeLike()
            } else {
                this.removeDislike()
            }
        }

        let nowLiked = this.likeButton.classList.contains('colored') ? 1 : 0;
        let nowDisliked = this.dislikeButton.classList.contains('colored') ? 1 : 0;
    
        this.sendLikeRequest(nowLiked-alreadyLiked, nowDisliked-alreadyDisliked)


        // if (!alreadyDisliked && !alreadyLiked){
        //     this.sendLikeRequest(nowLiked, nowDisliked)
        // } else if (alreadyLiked && !nowLiked)  {
        //     // remove like
        //     this.sendLikeRequest(-1, 0)
        // } else if (alreadyDisliked && nowLiked)  {
        //     // remove dislike and then like
        //     this.sendLikeRequest(1, -1)
        // } else if (alreadyDisliked && !nowDisliked) {
        //     // remove dislike
        //     this.sendLikeRequest(0, -1)
        // } else if (alreadyLiked && nowDisliked) {
        //     // remove like and then dislike
        //     this.sendLikeRequest(-1, 1)
        // }

        
    }
    
}
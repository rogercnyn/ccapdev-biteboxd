// Initializing an object named currentRatings with properties for food, service, and price, all initialized to 0.
let currentRatings = {
    food: 0,
    service: 0,
    price: 0,
};

// Initializing a variable named maxPhotos with a value of 4, indicating the maximum number of photos allowed.
let maxPhotos = 4;

// Declaring variables named quillEditor and photoContainer, presumably to be used later in the code.
let quillEditor;
let photoContainer;

// document.querySelector('form').onsubmit = function(event) {
//     event.preventDefault();

//     // Get values from form fields
//     const restaurantName = document.querySelector('#restoName').value;
//     const address = document.querySelector('#address').value;
//     const tags = document.querySelector('#tags').value;
//     const priceStart = document.querySelector('#pricestart').value;
//     const priceEnd = document.querySelector('#priceend').value;
//     const daysOpenStart = document.querySelector('#daysopenstart').value;
//     const daysOpenEnd = document.querySelector('#daysopenend').value;
//     const operatingHourStart = document.querySelector('#operatinghourstart').value;
//     const operatingHourEnd = document.querySelector('#operatinghourend').value;
//     const shortDesc = document.querySelector('#shortdesc').value;
//     const desc = document.querySelector('#desc').value;
    
//     document.querySelector('.resto-title').innerText = restaurantName;
//     document.querySelector('.location').innerText = address;
//     document.querySelector('#tag1').innerHTML = `💵 💵 <span>(P${priceStart}-${priceEnd})</span>`;
//     document.querySelector('#tag2').innerText = tags.split(', ')[0]; 
//     document.querySelector('#tag3').innerText = tags.split(', ')[1]; 
//     document.querySelector('#tag4').innerText = `Open during: ${daysOpenStart}-${daysOpenEnd} (${operatingHourStart} - ${operatingHourEnd})`;
//     document.querySelector('#description').innerText = desc;

//     const deliveryCheckbox = document.getElementById('deliveryCheckbox');
//     const outdoorDiningCheckbox = document.getElementById('outdoorDiningCheckbox');
//     const indoorDiningCheckbox = document.getElementById('indoorDiningCheckbox');
//     const groupsCheckbox = document.getElementById('groupsCheckbox');

//     const musicTvCheckbox = document.getElementById('musicTvCheckbox');
//     const driveThruCheckbox = document.getElementById('driveThruCheckbox');
//     const takeoutCheckbox = document.getElementById('takeoutCheckbox');
//     const creditCardsCheckbox = document.getElementById('creditCardsCheckbox');

//     const eWalletCheckbox = document.getElementById('eWalletCheckbox');
//     const kidsCheckbox = document.getElementById('kidsCheckbox');
//     const petsCheckbox = document.getElementById('petsCheckbox');
//     const veganCheckbox = document.getElementById('veganCheckbox');

//     updateCheckboxStatus('deliveryCheckbox', deliveryCheckbox.checked);
//     updateCheckboxStatus('outdoorDiningCheckbox', outdoorDiningCheckbox.checked);
//     updateCheckboxStatus('indoorDiningCheckbox', indoorDiningCheckbox.checked);
//     updateCheckboxStatus('groupsCheckbox', groupsCheckbox.checked);

//     updateCheckboxStatus('musicTvCheckbox', musicTvCheckbox.checked);
//     updateCheckboxStatus('driveThruCheckbox', driveThruCheckbox.checked);
//     updateCheckboxStatus('takeoutCheckbox', takeoutCheckbox.checked);
//     updateCheckboxStatus('creditCardsCheckbox', creditCardsCheckbox.checked);

//     updateCheckboxStatus('eWalletCheckbox', eWalletCheckbox.checked);
//     updateCheckboxStatus('kidsCheckbox', kidsCheckbox.checked);
//     updateCheckboxStatus('petsCheckbox', petsCheckbox.checked);
//     updateCheckboxStatus('veganCheckbox', veganCheckbox.checked);

//     // Close modal
//     const modal = document.getElementById('editModal');
//     modal.style.display = 'none';

//     const modaloverlay = document.getElementById('overlay');
//     modaloverlay.style.display = 'none';
// };

function updateCheckboxStatus(checkboxId, isChecked) {
    // Selecting the checkbox element using its ID
    const checkboxElement = document.querySelector(`#${checkboxId}`);

    // Checking if the checkbox should be checked
    if (isChecked) {
        // If the checkbox should be checked, ensure it has the 'checkmark' class and remove 'cross' if present
        checkboxElement.classList.remove('&#10008;'); //remove cross
        checkboxElement.classList.add('&#10004;'); //add checkmark
        
    } else {
        // If the checkbox should be unchecked, ensure it has the 'cross' class and remove 'checkmark' if present
        checkboxElement.classList.remove('&#10004;'); //remove checkmark
        checkboxElement.classList.add('&#10008;'); //add cross
        
    }
}


function injectQuill(element) {
    // Finding the closest ancestor of the element with the class 'review-panel'
    const reviewPanel = element.closest('.review-panel');

    // Accessing the next sibling of the parent element of the review panel,
    // which presumably is the reply panel
    const replyPanel = reviewPanel.parentElement.nextElementSibling;

    // Calling a function named toggleReplyPanel, presumably to toggle the visibility of the reply panel
    toggleReplyPanel(replyPanel)

}

function openFileInput(restaurantId) {
    // Creating a new input element of type 'file'
    var input = document.createElement('input');
    input.type = 'file';

    // Setting the 'accept' attribute to limit file selection to image files
    input.accept = 'image/*';

    // Attaching an onchange event listener to the input element
    input.onchange = function () {
        // When a file is selected, call the updatePicture function and pass the input element
        updatePicture(input);
        // Update the restopicture with the selected filename
        updateRestoPicture(input, restaurantId);
    };

    // Programmatically clicking the input element to trigger the file selection dialog
    input.click();
}

function updateRestoPicture(input, restaurantId) {
    const restopicture = document.getElementById('restopicture');
    const file = input.files[0];
    console.log(file.name);
    if (file) {
        restopicture.src = URL.createObjectURL(file); // Set the src attribute of restopicture to the file URL
        restopicture.alt = file.name; // Set the alt attribute to the filename
        const formData = new FormData();
        formData.append('file', file);
        formData.append('restaurantId', restaurantId); // Assuming restaurantId is provided as a parameter
        $.ajax({
            url: `/resto-responsepage/${restaurantId}/updatepicture`,
            type: 'POST',
            data: formData, // Send the FormData object containing the file and restaurantId
            processData: false,
            contentType: false,
            success: function(response) {
                window.location.reload(); // Reload the page after successful update
            },
            error: function(error) {
                console.error('Error updating restaurant picture:', error);
            }
        });
    }
}

function closeCredentialsPopup() {
    document.getElementById('credentialsModal').style.display = 'none';
    document.getElementById('credentialsOverlay').style.display = 'none';
}

function changePassword(){
    document.getElementById('credentialsModal').style.display = 'block';
    document.getElementById('credentialsOverlay').style.display = 'block';
}



function updatePicture(input) {
    // Getting a reference to the image element where the selected picture will be displayed
    var output = document.getElementById('restopicture');

    // Checking if files are selected and if the first file exists
    if (input.files && input.files[0]) {
        // Creating a new FileReader object
        var reader = new FileReader();

        // Setting up an onload event handler for when the reader finishes reading the file
        reader.onload = function (e) {

            // Setting the src attribute of the image element to the result of the FileReader, which is the selected image
            output.src = e.target.result;
        };

        // Reading the selected file as a data URL
        reader.readAsDataURL(input.files[0]);
    }

    else {
        // If no file is selected, or the first file doesn't exist, exit the function
        return;
    }
}

function toggleReplyPanel(replyPanelId) {
    // Getting a reference to the reply panel element based on its ID
    var replyPanel = document.getElementById(replyPanelId);

    // Finding the reply editor element within the reply panel
    var replyEditor = replyPanel.querySelector('.reply-editor');

    // Checking the current display status of the reply panel
    if (replyPanel.style.display === 'none' || replyPanel.style.display === '') {
        // If the reply panel is hidden or has no explicit display style, show it
        replyPanel.style.display = 'block';

        // Call a function named toggleReplyEditor passing the reply panel as an argument
        toggleReplyEditor(replyPanel);
    } else {
        // If the reply panel is visible, hide it
        replyPanel.style.display = 'none';

        // Also hide the reply editor to ensure consistency
        replyEditor.style.display = 'none'; // Ensure reply editor is hidden when reply panel is hidden
    }
}


function toggleReplyEditor(replyPanel) {
    // Finding the reply editor element within the reply panel
    const replyEditor = replyPanel.querySelector('.reply-editor');

    // Toggling the display property of the reply editor
    // If it's currently hidden or has no explicit display style, set it to 'block', otherwise set it to 'none'
    replyEditor.style.display = (replyEditor.style.display === 'none' || replyEditor.style.display === '') ? 'block' : 'none';
}

function handleReply(publishButton, replyPanelId) {
    // Getting a reference to the reply panel element based on its ID
    var responsePanel = document.getElementById(replyPanelId);

    // Getting all elements with the class 'responsepanel'
    var resPanels = document.getElementsByClassName('responsepanel')

    // Finding the index of the reply panel in the list of response panels
    var nthNumber = 0;

    // Looping through the response panels to find the index of the current reply panel
    for (var i = 0; i < resPanels.length; i++) {
        // If the current response panel is the same as the reply panel, break out of the loop
        if (resPanels[i] === responsePanel) {
            break;
        }
        // If the current response panel is an element node, increment the nthNumber
        if (resPanels[i].nodeType === 1) {
            nthNumber++;
        } 
    }
    // Logging the index of the reply panel
    console.log(nthNumber)

    // Finding the quill editor element within the reply panel
    var quill = quills[nthNumber]

    // Checking if the Quill editor has non-whitespace content
    if(quill.getText().trim().length){
        // If the Quill editor has content, show the response panel
        $(responsePanel).show();

        // Get the HTML content of the Quill editor and assign it to the reply text area in the response panel
        var html = quills[nthNumber].root.innerHTML;    
        responsePanel.querySelector("#replytext").innerHTML = html;
    }

    // Toggle the visibility of the reply panel's previous sibling, presumably the main discussion panel
    toggleReplyPanel(responsePanel.previousElementSibling);
}

// function saveData(event) {
//     event.preventDefault();
//     const restaurantName = document.querySelector('#restoName').value;
//     const address = document.querySelector('#address').value;
//     const tags = document.querySelector('#tags').value;
//     const priceStart = document.querySelector('#pricestart').value;
//     const priceEnd = document.querySelector('#priceend').value;
//     const daysOpenStart = document.querySelector('#daysopenstart').value;
//     const daysOpenEnd = document.querySelector('#daysopenend').value;
//     const operatingHourStart = document.querySelector('#operatinghourstart').value;
//     const operatingHourEnd = document.querySelector('#operatinghourend').value;
//     const shortDesc = document.querySelector('#shortdesc').value;
//     const desc = document.querySelector('#desc').value;

//     document.querySelector('.resto-title').innerText = restaurantName;
//     document.querySelector('.location').innerText = address;

//     const priceTag = document.querySelector('#tag1');
//     priceTag.innerHTML = `💵 💵 <span>(P${priceStart}-${priceEnd})</span>`;

//     document.querySelector('#tag2').innerText = tags.split(', ')[0]; 
//     document.querySelector('#tag3').innerText = tags.split(', ')[1]; 

//     document.querySelector('#tag4').innerText = `Open during: ${daysOpenStart}-${daysOpenEnd} (${operatingHourStart} - ${operatingHourEnd})`;

//     document.querySelector('#description').innerText = desc;

//     const deliveryCheckbox = document.getElementById('deliveryCheckbox');
//     const outdoorDiningCheckbox = document.getElementById('outdoorDiningCheckbox');
//     const indoorDiningCheckbox = document.getElementById('indoorDiningCheckbox');
//     const groupsCheckbox = document.getElementById('groupsCheckbox');

//     const musicTvCheckbox = document.getElementById('musicTvCheckbox');
//     const driveThruCheckbox = document.getElementById('driveThruCheckbox');
//     const takeoutCheckbox = document.getElementById('takeoutCheckbox');
//     const creditCardsCheckbox = document.getElementById('creditCardsCheckbox');

//     const eWalletCheckbox = document.getElementById('eWalletCheckbox');
//     const kidsCheckbox = document.getElementById('kidsCheckbox');
//     const petsCheckbox = document.getElementById('petsCheckbox');
//     const veganCheckbox = document.getElementById('veganCheckbox');

//     updateCheckboxStatus('deliveryCheckbox', deliveryCheckbox.checked);
//     updateCheckboxStatus('outdoorDiningCheckbox', outdoorDiningCheckbox.checked);
//     updateCheckboxStatus('indoorDiningCheckbox', indoorDiningCheckbox.checked);
//     updateCheckboxStatus('groupsCheckbox', groupsCheckbox.checked);

//     updateCheckboxStatus('musicTvCheckbox', musicTvCheckbox.checked);
//     updateCheckboxStatus('driveThruCheckbox', driveThruCheckbox.checked);
//     updateCheckboxStatus('takeoutCheckbox', takeoutCheckbox.checked);
//     updateCheckboxStatus('creditCardsCheckbox', creditCardsCheckbox.checked);

//     updateCheckboxStatus('eWalletCheckbox', eWalletCheckbox.checked);
//     updateCheckboxStatus('kidsCheckbox', kidsCheckbox.checked);
//     updateCheckboxStatus('petsCheckbox', petsCheckbox.checked);
//     updateCheckboxStatus('veganCheckbox', veganCheckbox.checked);

// }

function updateCheckboxStatus(checkboxId, isChecked) {
    // Selecting the checkbox element using its ID
    const checkboxElement = document.querySelector(`#${checkboxId}`);

    // Setting the innerHTML of the checkbox element based on the isChecked parameter
    // If isChecked is true, set the innerHTML to '&#10004;' (checkmark), otherwise set it to '&#10008;' (cross)
    checkboxElement.innerHTML = isChecked ? '&#10004;' : '&#10008;';
}

function loadData() {
    // const restaurantName = document.querySelector('.resto-title').textContent;
    // const address = document.querySelector('.location').textContent;
    // const tags = "Filipino, Fastfood";

    // // for price
    // const priceRangeText = document.getElementById('tag1').textContent;
    // const prices = priceRangeText.replace(/[^\d-]/g, '').split('-');

    // const priceStart = prices[0];
    // const priceEnd = prices[1];

    // const daysOpenStart = "Monday";
    // const daysOpenEnd = "Saturday";
    // const operatingHourStart = "08:00";
    // const operatingHourEnd = "17:00";
    // const shortDesc = "Your new go-to bacsilogan in Taft.";
    // const desc = "Ate Rica's Bacsilog offers different type of silog meals at an affordable price. The best sellers are bacsilog, tapsilog, and hotsilog.";

    // document.getElementById('restoName').value = restaurantName;
    // document.getElementById('address').value = address;
    // document.getElementById('tags').value = tags;
    // document.getElementById('pricestart').value = priceStart;
    // document.getElementById('priceend').value = priceEnd;
    // document.getElementById('daysopenstart').value = daysOpenStart;
    // document.getElementById('daysopenend').value = daysOpenEnd;
    // document.getElementById('operatinghourstart').value = operatingHourStart;
    // document.getElementById('operatinghourend').value = operatingHourEnd;
    // document.getElementById('shortdesc').value = shortDesc;
    // document.getElementById('desc').value = desc;

    // document.getElementById('deliveryCheckbox').checked = true;
    // document.getElementById('outdoorDiningCheckbox').checked = true;
    // document.getElementById('indoorDiningCheckbox').checked = true;
    // document.getElementById('groupsCheckbox').checked = true;

    // document.getElementById('musicTvCheckbox').checked = true;
    // document.getElementById('driveThruCheckbox').checked = false;
    // document.getElementById('takeoutCheckbox').checked = true;
    // document.getElementById('creditCardsCheckbox').checked = true;

    // document.getElementById('eWalletCheckbox').checked = true;
    // document.getElementById('kidsCheckbox').checked = true;
    // document.getElementById('petsCheckbox').checked = false;
    // document.getElementById('veganCheckbox').checked = true;
}

function editRestaurant(){
    // Assuming loadData() is a function that loads data necessary for editing the restaurant
    loadData();
    // Displaying the edit modal by setting its style display property to 'block'
    document.getElementById('editModal').style.display = 'block';

    // Displaying an overlay to prevent interactions outside of the edit modal
    document.getElementById('overlay').style.display = 'block';
}

function closeEditPopup() {
    // Hiding the edit modal by setting its display property to 'none'
    document.getElementById('editModal').style.display = 'none';

    // Hiding the overlay by setting its display property to 'none'
    document.getElementById('overlay').style.display = 'none';
}

function deleteRestaurant(restaurantId){
     // Displaying the first confirmation dialog using SweetAlert
    Swal.fire({
        title: 'Delete Restaurant',
        text: 'Are you sure you want to delete the restaurant?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
        customClass: {
            container: 'swal-custom-font', // Adding a custom class to the SweetAlert container for styling
        }
    }).then((result) => { // Handling the user's response
        if (result.isConfirmed) { // If the user confirms the deletion

            // Displaying a second confirmation dialog to ensure the deletion
            Swal.fire({
                title: 'Confirm Deletion',
                text: 'To confirm deletion, type \'Confirm\':',
                input: 'text',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Submit',
                inputValidator: (value) => { // Validating the input value
                    if (value !== "Confirm") {
                        return 'You need to enter the correct confirmation text!';
                    }
                },
                customClass: {
                    container: 'swal-custom-font', // Adding a custom class to the SweetAlert container for styling
                }
            }).then((result) => { // Handling the user's response
                if (result.isConfirmed) { // If the user confirms the deletion
                    // Displaying a third confirmation dialog for final confirmation
                    Swal.fire({
                        title: 'Final Confirmation',
                        text: `Are you sure you want to delete? This action cannot be undone.`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, delete it!',
                        cancelButtonText: 'No, cancel!',
                        reverseButtons: true,
                        customClass: {
                            container: 'swal-custom-font', // Adding a custom class to the SweetAlert container for styling
                        }
                    }).then((result) => { // Handling the user's response
                        // Displaying a success message after successful deletion
                        Swal.fire({
                            title: 'Success!',
                            text: 'The restaurant has been successfully deleted.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            timer: 3000, // Auto-close the success message after 3 seconds
                            timerProgressBar: true // Display a progress bar for the auto-close timer
                        }).then(() => {
                            $.ajax({
                                url: `/resto-responsepage/${restaurantId}/delete`,
                                type: 'POST',
                                success: function(response) {
                                    window.location.href = '/logout';
                                },
                                error: function(error) {
                                    console.error('Error deleting restaurant:', error);
                                }
                            });
                        });
                    });
                    
                }
                
            });
        }
    });
}

function openModal(mediaSrc) {
    // Getting references to the modal and its media container
    const modal = document.getElementById('modal');
    const modalMediaContainer = document.getElementById('modal-media-container');

    // Clearing the media container to remove any existing media
    modalMediaContainer.innerHTML = '';

    // Checking if the media source is a video file based on the file extension
    const isVideoMedia = /\.(mp4|webm|ogg)$/i.test(mediaSrc);

    // Creating a new media element based on the file type
    if (isVideoMedia) {
        const video = document.createElement('video');
        video.id = 'modal';
        video.src = mediaSrc;
        video.controls = true; // Adding controls for video playback
        video.style.width = '100%'; // Setting the width of the video to fit the modal
        video.style.height = 'auto'; // Ensuring aspect ratio is maintained
        modalMediaContainer.appendChild(video); // Appending the video element to the media container
    } else {
        const img = document.createElement('img');
        img.src = mediaSrc;
        img.style.width = '100%'; // Setting the width of the image to fit the modal
        img.style.height = 'auto'; // Ensuring aspect ratio is maintained
        modalMediaContainer.appendChild(img); // Appending the image element to the media container
    }

    // Displaying the modal by setting its display property to 'flex'
    modal.style.display = 'flex';

    // Adding a class to the body to prevent scrolling while the modal is open
    document.body.classList.add('modal-open');
    
}


function closeModal() {
    // Getting a reference to the modal element
    const modal = document.getElementById('modal');
    // Hiding the modal by setting its display property to 'none'
    modal.style.display = 'none';
    // Removing the class from the body to allow scrolling
    document.body.classList.remove('modal-open');
}

function initializeMap() {
    let x = $("#xcoord").val()
    let y = $("#ycoord").val()
    let title = $(".resto-title").text()
    
    let map = L.map('map').setView([ x, y ], 16);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([ x, y]).addTo(map)
      .bindPopup(title)
      .openPopup();
}

function validateForm() {
    let restoName = document.getElementById("restoName").value;
    let address = document.getElementById("address").value;
    let tags = document.getElementById("tags").value;
    let pricestart = document.getElementById("pricestart").value;
    let priceend = document.getElementById("priceend").value;
    let xcoord = document.getElementById("xcoord").value;
    let ycoord = document.getElementById("ycoord").value;
    let shortdescription = document.getElementById("shortdesc").value;
    let description = document.getElementById("desc").value;

    let operatinghourstart = document.getElementById("operatinghourstart").value;
    let operatinghourend = document.getElementById("operatinghourend").value;

    if (restoName === "" || address === "" || tags === "" || pricestart === "" || priceend === "" ||
        xcoord === "" || ycoord === "" || shortdescription === "" || description === "" || operatinghourstart === "" || operatinghourend === "") {
        return false;
    }

    if (parseFloat(pricestart) >= parseFloat(priceend)) {
        return false;
    }

    if (parseFloat(pricestart) <= 0 || parseFloat(priceend) <= 0) {
        return false;
    }

    return true; 
}

$(document).ready(function() {
    initializeMap()
    $('#editRestoForm').parsley();
    $('#editPassword').parsley();

    document.getElementById('saveeditbutton').addEventListener('click', function(event) {
        event.preventDefault();

        if (!validateForm()){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please make sure all fields are filled out correctly!',
                customClass: {
                    container: 'swal-custom-font',
                }
            });
            return;
        }

        else {
            Swal.fire({
                title: 'Publish Edited Details',
                text: 'Are the details entered correct?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
                customClass: {
                    container: 'swal-custom-font',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Confirm Upload',
                        text: 'To confirm, type \'Confirm\':',
                        input: 'text',
                        showCancelButton: true,
                        cancelButtonText: 'Cancel',
                        confirmButtonText: 'Submit',
                        inputValidator: (value) => {
                            if (value !== "Confirm") {
                                return 'You need to enter the correct confirmation text!';
                            }
                        },
                        customClass: {
                            container: 'swal-custom-font',
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                title: 'Success!',
                                text: 'The updated details are successfully saved.',
                                icon: 'success',
                                confirmButtonText: 'OK',
                                timer: 3000,
                                timerProgressBar: true
                            }).then(() => { 
                                document.getElementById('editRestoForm').submit();
                            });
                        }
                    });
                }
            });
        }
    });
    
    // Retrieving query parameters from the URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const minStar = params.get('minStar');
    const minPrice = params.get('minPrice');
    const minFood = params.get('minFood');
    const minService = params.get('minService');
    const searchTextValue = params.get('searchText');
    const sortingVal = params.get('sorting');

    // Initializing sliders and setting their initial values based on query parameters
    const filterStarSlider = new Slider(document.getElementsByClassName('slider-star-rating'));
    const filterPriceSlider = new Slider(document.getElementsByClassName('filter-price-rating'));
    const filterFoodSlider = new Slider(document.getElementsByClassName('filter-food-rating'));
    const filterServiceSlider = new Slider(document.getElementsByClassName('filter-service-rating'));

    filterStarSlider.initializeHover();
    filterPriceSlider.initializeHover();
    filterFoodSlider.initializeHover();
    filterServiceSlider.initializeHover();

    if(minStar) {
        filterStarSlider.handleClick(minStar)
    } 

    if(minPrice) {
        filterPriceSlider.handleClick(minPrice)  
    }

    if(minFood) {
        filterFoodSlider.handleClick(minFood)
    }

    if(minService) {
        filterServiceSlider.handleClick(minService)
    }

    // Setting the initial value of the search text input based on the query parameter
    $('#search-rev-input').val(searchTextValue)

    if(sortingVal) {
        $('#criteria').val(sortingVal)
    }

    // Function to handle searching and updating URL with search text
    function searchText() {
        let searchText = $('#search-rev-input').val();
        let url = `${window.location.href.split('?')[0]}?searchText=${searchText}`;
        window.location.href = url;
    }

    // Event handler for applying filters
    $("#applyFilter").click(function() {

        let minStar = filterStarSlider.getValue()
        let minPrice = filterPriceSlider.getValue()
        let minFood = filterFoodSlider.getValue()
        let minService = filterServiceSlider.getValue()
        let searchText = $('#search-rev-input').val();
        var sorting = $('#criteria').val();

        let url = `${window.location.href.split('?')[0]}?minStar=${minStar}&minPrice=${minPrice}&minFood=${minFood}&minService=${minService}&searchText=${searchText}&sorting=${sorting}`;

        window.location.href = url;
    })

    // Event handler for searching
    $(".search-rev-but").click(function() {
       searchText()    
    })

    // Event handler for clearing filters
    $("#noFilter").click(function () {
        window.location.href = window.location.href.split('?')[0];

    })

    $("#clearFilter").click(function () {

        filterStarSlider.reset();
        filterPriceSlider.reset();
        filterFoodSlider.reset();
        filterServiceSlider.reset();
        $('#search-rev-input').val('');
        $('#criteria').val('recommended');
    })

    // Event handler for searching on pressing Enter key
    $('#search-rev-input').keypress(function(e) {
        if (e.key === 'Enter') {
            searchText()            
        }
    });


});

function searchReview(){
    // Get all elements with the class name "review"
    let reviews = document.getElementsByClassName("review")

    // Convert the HTMLCollection to an array and hide all reviews except the last one
    Array.from(reviews).slice(0, reviews.length - 1).forEach(review => $(review).hide())
}

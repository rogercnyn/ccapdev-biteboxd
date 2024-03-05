let starsContainers = document.querySelectorAll(".star-sorting");
let currentRatings = {
    food: 0,
    service: 0,
    price: 0,
};
let maxPhotos = 4;
let quillEditor;
let photoContainer;

document.querySelector('form').onsubmit = function(event) {
    event.preventDefault();

    // Get values from form fields
    const restaurantName = document.querySelector('#restoName').value;
    const address = document.querySelector('#address').value;
    const tags = document.querySelector('#tags').value;
    const priceStart = document.querySelector('#pricestart').value;
    const priceEnd = document.querySelector('#priceend').value;
    const daysOpenStart = document.querySelector('#daysopenstart').value;
    const daysOpenEnd = document.querySelector('#daysopenend').value;
    const operatingHourStart = document.querySelector('#operatinghourstart').value;
    const operatingHourEnd = document.querySelector('#operatinghourend').value;
    const shortDesc = document.querySelector('#shortdesc').value;
    const desc = document.querySelector('#desc').value;

    // Populate data in the HTML
    document.querySelector('.resto-title').innerText = restaurantName;
    document.querySelector('.location').innerText = address;
    document.querySelector('#tag1').innerHTML = `💵 💵 <span>(P${priceStart}-${priceEnd})</span>`;
    document.querySelector('#tag2').innerText = tags.split(', ')[0]; 
    document.querySelector('#tag3').innerText = tags.split(', ')[1]; 
    document.querySelector('#tag4').innerText = `Open during: ${daysOpenStart}-${daysOpenEnd} (${operatingHourStart} - ${operatingHourEnd})`;
    document.querySelector('#description').innerText = desc;

    const deliveryCheckbox = document.getElementById('deliveryCheckbox');
    const outdoorDiningCheckbox = document.getElementById('outdoorDiningCheckbox');
    const indoorDiningCheckbox = document.getElementById('indoorDiningCheckbox');
    const groupsCheckbox = document.getElementById('groupsCheckbox');

    const musicTvCheckbox = document.getElementById('musicTvCheckbox');
    const driveThruCheckbox = document.getElementById('driveThruCheckbox');
    const takeoutCheckbox = document.getElementById('takeoutCheckbox');
    const creditCardsCheckbox = document.getElementById('creditCardsCheckbox');

    const eWalletCheckbox = document.getElementById('eWalletCheckbox');
    const kidsCheckbox = document.getElementById('kidsCheckbox');
    const petsCheckbox = document.getElementById('petsCheckbox');
    const veganCheckbox = document.getElementById('veganCheckbox');

    updateCheckboxStatus('deliveryCheckbox', deliveryCheckbox.checked);
    updateCheckboxStatus('outdoorDiningCheckbox', outdoorDiningCheckbox.checked);
    updateCheckboxStatus('indoorDiningCheckbox', indoorDiningCheckbox.checked);
    updateCheckboxStatus('groupsCheckbox', groupsCheckbox.checked);

    updateCheckboxStatus('musicTvCheckbox', musicTvCheckbox.checked);
    updateCheckboxStatus('driveThruCheckbox', driveThruCheckbox.checked);
    updateCheckboxStatus('takeoutCheckbox', takeoutCheckbox.checked);
    updateCheckboxStatus('creditCardsCheckbox', creditCardsCheckbox.checked);

    updateCheckboxStatus('eWalletCheckbox', eWalletCheckbox.checked);
    updateCheckboxStatus('kidsCheckbox', kidsCheckbox.checked);
    updateCheckboxStatus('petsCheckbox', petsCheckbox.checked);
    updateCheckboxStatus('veganCheckbox', veganCheckbox.checked);

    // Close modal
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';

    const modaloverlay = document.getElementById('overlay');
    modaloverlay.style.display = 'none';
};

function updateCheckboxStatus(checkboxId, isChecked) {
    const checkboxElement = document.querySelector(`#${checkboxId}`);
    if (isChecked) {
        // If the checkbox should be checked, ensure it has the 'checkmark' class and remove 'cross' if present
        checkboxElement.classList.remove('&#10008;');
        checkboxElement.classList.add('&#10004;');
        
    } else {
        // If the checkbox should be unchecked, ensure it has the 'cross' class and remove 'checkmark' if present
        checkboxElement.classList.remove('&#10004;');
        checkboxElement.classList.add('&#10008;');
        
    }
}



function injectQuill(element) {
    const reviewPanel = element.closest('.review-panel');
    const replyPanel = reviewPanel.parentElement.nextElementSibling;
    toggleReplyPanel(replyPanel)



}

function openFileInput() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = function () {
        updatePicture(input);
    };

    input.click();
}

function updatePicture(input) {
    var output = document.getElementById('restopicture');

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            output.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }

    else {
        return;
    }
}

function toggleReplyPanel(replyPanel){
    
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
    const checkboxElement = document.querySelector(`#${checkboxId}`);
    checkboxElement.innerHTML = isChecked ? '&#10004;' : '&#10008;';
}

function loadData() {
    const restaurantName = document.querySelector('.resto-title').innerText;
    const address = document.querySelector('.location').innerText;
    const tags = "Filipino, Fastfood";

    // for price
    const priceRangeText = document.getElementById('tag1').textContent;
    const prices = priceRangeText.replace(/[^\d-]/g, '').split('-');

    const priceStart = prices[0];
    const priceEnd = prices[1];

    const daysOpenStart = "Monday";
    const daysOpenEnd = "Saturday";
    const operatingHourStart = "08:00";
    const operatingHourEnd = "17:00";
    const shortDesc = "Your new go-to bacsilogan in Taft.";
    const desc = "Ate Rica's Bacsilog offers different type of silog meals at an affordable price. The best sellers are bacsilog, tapsilog, and hotsilog."; 

    document.querySelector('#restoName').value = restaurantName;
    document.querySelector('#address').value = address;
    document.querySelector('#tags').value = tags;
    document.querySelector('#pricestart').value = priceStart;
    document.querySelector('#priceend').value = priceEnd;
    document.querySelector('#daysopenstart').value = daysOpenStart;
    document.querySelector('#daysopenend').value = daysOpenEnd;
    document.querySelector('#operatinghourstart').value = operatingHourStart;
    document.querySelector('#operatinghourend').value = operatingHourEnd;
    document.querySelector('#shortdesc').value = shortDesc;
    document.querySelector('#desc').value = desc;

    const deliveryCheckbox = document.getElementById('deliveryCheckbox');
    const outdoorDiningCheckbox = document.getElementById('outdoorDiningCheckbox');
    const indoorDiningCheckbox = document.getElementById('indoorDiningCheckbox');
    const groupsCheckbox = document.getElementById('groupsCheckbox');

    const musicTvCheckbox = document.getElementById('musicTvCheckbox');
    const driveThruCheckbox = document.getElementById('driveThruCheckbox');
    const takeoutCheckbox = document.getElementById('takeoutCheckbox');
    const creditCardsCheckbox = document.getElementById('creditCardsCheckbox');

    const eWalletCheckbox = document.getElementById('eWalletCheckbox');
    const kidsCheckbox = document.getElementById('kidsCheckbox');
    const petsCheckbox = document.getElementById('petsCheckbox');
    const veganCheckbox = document.getElementById('veganCheckbox');

    document.querySelector('#deliveryCheckbox').checked = true; 
    document.querySelector('#outdoorDiningCheckbox').checked = true;
    document.querySelector('#indoorDiningCheckbox').checked = true;
    document.querySelector('#groupsCheckbox').checked = true;

    document.querySelector('#musicTvCheckbox').checked = true; 
    document.querySelector('#driveThruCheckbox').checked = false;
    document.querySelector('#takeoutCheckbox').checked = true;
    document.querySelector('#creditCardsCheckbox').checked = true;

    document.querySelector('#eWalletCheckbox').checked = true; 
    document.querySelector('#kidsCheckbox').checked = true;
    document.querySelector('#petsCheckbox').checked = false;
    document.querySelector('#veganCheckbox').checked = true;
}

function editRestaurant(){
    loadData();
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeEditPopup() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function deleteRestaurant(){
    Swal.fire({
        title: 'Delete Restaurant',
        text: 'Are you sure you want to delete the restaurant?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
        customClass: {
            container: 'swal-custom-font', 
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Confirm Deletion',
                text: 'To confirm deletion, type \'Confirm\':',
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
                        title: 'Final Confirmation',
                        text: `Are you sure you want to delete? This action cannot be undone.`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, delete it!',
                        cancelButtonText: 'No, cancel!',
                        reverseButtons: true,
                        customClass: {
                            container: 'swal-custom-font', 
                        }
                    }).then((result) => {
                        Swal.fire({
                            title: 'Success!',
                            text: 'The restaurant has been successfully deleted.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            timer: 3000, 
                            timerProgressBar: true 
                        }).then(() => {
                            window.location.href = 'index.html';
                        });
                    });
                    
                }
                
            });
        }
    });
}


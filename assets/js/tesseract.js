// Import necessary elements and functions
import { video, initializeCamera } from './camera-script.js';

const resultDiv = document.getElementById("result");
const scanButton = document.getElementById("start-camera-scan");
let shouldRecognize = false; // Variable to control recognition
let biggestNumber = null; // Variable to store the biggest number
let totalExpenses = 0; // Variable to store the running total of expenses
const homeButton = document.getElementById("homeButton");
const insightsButton = document.getElementById("nav-link-insights");
const trackerButton = document.getElementById("nav-link-tracker");
const closeActionScreen = document.getElementById('close-action-shopping-list-button')
const updateStartShoppingListScreen = document.getElementById("update-start-shoping-shopping-list-screen");

//initializeCamera();

// Wait for the video to be ready
video.addEventListener("canplay", function () {
    // Initialize camera
    initializeCamera();

    // Set up click event for the "Scan" button
    scanButton.addEventListener("click", function () {
        shouldRecognize = true;
        captureFrameAndRecognize();
    });
});

// Check if the camera is already initialized
if (!initializeCamera.isInitialized) {
    // Wait for the video to be ready
    video.addEventListener("canplay", function () {
        // Initialize camera with the main camera
        initializeCamera({ video: { facingMode: 'environment' } });

        // Set up click event for the "Scan" button
        scanButton.addEventListener("click", function () {
            shouldRecognize = true;
            captureFrameAndRecognize();
        });
    });

    initializeCamera.isInitialized = true; // Mark as initialized
}
initializeCamera();

function captureFrameAndRecognize() {
    if (!shouldRecognize) {
        return; // Stop recognition if shouldRecognize is false
    }

    const canvas = document.createElement("canvas"); // Create a new canvas element
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    Tesseract.recognize(
        canvas,
        'eng',
        { logger: info => console.log(info) } // Optional logger for debugging
    ).then(({ data: { text } }) => {
        resultDiv.textContent = `Recognized text: ${text}`;

        // Find all numbers (including decimals) in the recognized text
        const foundNumbers = findAllNumbers(text, /[a-zA-Z]*\d+\.*\d*[a-zA-Z]*/g);

        if (foundNumbers.length > 0) {
            // Find the biggest number in terms of size (ignoring decimals)
            const currentBiggest = findBiggestNumber(foundNumbers);

            // Update the biggest number if a larger one is found
            if (biggestNumber === null || currentBiggest.length > biggestNumber.length) {
                biggestNumber = currentBiggest;

                // Display a popup window with the found number and an "Add" button
                showPopup(biggestNumber);

                // Automatically stop recognition when the biggest number is found
                stopRecognition();
            }
        }

        // Continue capturing frames and recognizing text
        requestAnimationFrame(captureFrameAndRecognize);
    });
}

// Function to stop recognition
function stopRecognition() {
    shouldRecognize = false;
}

// Function to find all numbers (including decimals) in a given text
function findAllNumbers(text, suggestedOption = null) {
    let numberRegex;

    if (suggestedOption) {
        // Use the suggested option if provided
        numberRegex = new RegExp(suggestedOption, 'g');
    } else {
        // Use the default number regex if no suggested option is provided
        numberRegex = /[-+]?\d*\.?\d+/g;
    }

    return text.match(numberRegex) || [];
}


// Function to find the biggest number in terms of size (ignoring decimals)
function findBiggestNumber(numbers) {
    return numbers.reduce((biggest, current) => {
        return current.length > biggest.length ? current : biggest;
    }, '');
}

// Function to display a popup window with the found number and an "Add" button
function showPopup(foundNumber) {
    // Create a modal overlay
    const modalOverlay = document.createElement("div");
    modalOverlay.classList.add("modal-overlay");

    // Create the popup content
    const popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");
    popupContent.style.display = "flex";
    popupContent.style.flexDirection = "column";
    popupContent.style.alignItems = "center";

    // Display the found number in the popup
    const numberDisplay = document.createElement("p");
    numberDisplay.textContent = `Number Found: ${foundNumber}`;
    numberDisplay.style.color = 'white';
    numberDisplay.style.textAlign = 'center';
    numberDisplay.style.backgroundColor = 'black';
    popupContent.appendChild(numberDisplay);
    numberDisplay.style.fontSize = '1.2rem';

    // Create the "Add" button
    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    addButton.style.border = "1px solid black";
    addButton.style.borderRadius = "15px";
    addButton.style.margin = "auto";
    addButton.style.padding = "5px";
    addButton.style.fontSize = '1.2rem';

    addButton.addEventListener("click", function () {
        // Update the value in the cost-number-tracker element
        updateCostNumberTracker(foundNumber);
        // Close the popup
        closeModal();

        // Reset variables (do not resume recognition automatically)
        biggestNumber = null;
        stopRecognition();
        shouldRecognize = false; // Set shouldRecognize to false to prevent automatic recognition

        // Optionally, you can display a message or UI element to indicate that the user needs to click "Scan" to start scanning again.
    });
    popupContent.appendChild(addButton);

    // Append the popup content to the modal overlay
    modalOverlay.appendChild(popupContent);

    // Append the modal overlay to the body
    document.body.appendChild(modalOverlay);
}

// Function to update the value in the cost-number-tracker element
function updateCostNumberTracker(value) {
    const costNumberTracker = document.getElementById("cost-number-tracker");
    totalExpenses += parseFloat(value); // Add the current value to the total
    costNumberTracker.style.color = 'white'
    costNumberTracker.style.textAlign = 'center'
    costNumberTracker.textContent = `€ ${totalExpenses.toFixed(2)}`;
}

// Function to close the modal overlay
function closeModal() {
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.parentNode.removeChild(modalOverlay);
}



// Event listeners for buttons
insightsButton.addEventListener("click", function () {
    window.location.href = 'insights.html';
});

homeButton.addEventListener("click", function () {
    window.location.href = 'index.html';
});

trackerButton.addEventListener("click", function () {
    window.location.href = 'tesseract.html';
});

document.addEventListener("DOMContentLoaded", function () {
    const createShoppingBtn = document.getElementById("createShoppingBtn");
    const shoppingListPopup = document.getElementById("shopping-list-popup");
    const addToShoppingListButton = document.getElementById("add-to-shopping-list-button");
    const shoppingList = document.getElementById("shopping-list");
    const newItemInput = document.getElementById("new-item-input");
    const saveShoppingListButton = document.getElementById("save-shopping-list-button");

    // Load the shopping list from local storage
    const savedShoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];

    // Function to save the shopping list to local storage
    function saveToLocalStorage(list) {
        localStorage.setItem("shoppingList", JSON.stringify(list));
    }

    // Function to update the display of the latest shopping lists
    function updateLatestShoppingListDisplay() {
        const displayLatestShoppingList = document.getElementById("display-latest-shopping-list");
        const actionShoppingList = document.getElementById("action-shopping-list");
        // Function to update the displayed shopping list
        function updateDisplayedShoppingList() {
            displayLatestShoppingList.innerHTML = savedShoppingList.map(item =>
                `<li>${item.listName} <button class="delete-list-button" data-listname="${item.listName}">Delete</button></li>`
            ).join('');

            // Add click event listener to each delete button in the displayed shopping list
            const deleteListButtons = document.querySelectorAll('.delete-list-button');
        
            deleteListButtons.forEach(deleteButton => {
                deleteButton.addEventListener('click', function () {
                    const listNameToDelete = this.dataset.listname;

                    // Show the delete confirmation pop-up before deleting
                    const confirmDelete = confirm(`Are you sure you want to delete the list "${listNameToDelete}"?`);
                    if (confirmDelete) {
                        // Perform the delete operation here
                        const index = savedShoppingList.findIndex(list => list.listName === listNameToDelete);
                        if (index !== -1) {
                            savedShoppingList.splice(index, 1);

                            // Update the saved shopping list in local storage
                            saveToLocalStorage(savedShoppingList);

                            // Update both displayed and action shopping lists
                            updateDisplayedShoppingList();
                            updateActionShoppingList(savedShoppingList[0]); // Update the action shopping list based on the current state

                            console.log("List deleted!");
                        }
                    }
                });
            });
        }

        // Function to update the action shopping list
        function updateActionShoppingList(listName) {
            // Clear existing items in action shopping list
            actionShoppingList.innerHTML = "";

            // Find the clicked shopping list item in the savedShoppingList array
            const clickedListItemIndex = savedShoppingList.findIndex(item => item.listName === listName);

            // Log details of items saved under the clicked shopping list item
            if (clickedListItemIndex !== -1) {
                const clickedListItem = savedShoppingList[clickedListItemIndex];

                // Display items in the action shopping list
                clickedListItem.items.forEach((item, itemIndex) => {
                    const listItem = document.createElement("li");
                    listItem.textContent = item.itemName;

                    // Add a delete button to each item in action shopping list
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.addEventListener("click", function () {
                        // Show the delete confirmation pop-up before deleting
                        const confirmDelete = confirm("Are you sure you want to delete this item?");
                        if (confirmDelete) {
                            // Perform the delete operation here
                            clickedListItem.items.splice(itemIndex, 1); // Remove the item from the array

                            // Update the saved shopping list in local storage
                            saveToLocalStorage(savedShoppingList);

                            // Update both displayed and action shopping lists
                            updateDisplayedShoppingList();
                            updateActionShoppingList(listName);

                            console.log("Item deleted!");
                        }
                    });

                    listItem.appendChild(deleteButton);
                    actionShoppingList.appendChild(listItem);
                });
            }
        }

        // Add click event listener to the <ul> element
        displayLatestShoppingList.addEventListener("click", function (event) {
            // Check if a <li> element is clicked
            if (event.target.tagName === "LI") {
                // Log the clicked item's text content
                const clickedListName = event.target.textContent.trim();

                // Update both displayed and action shopping lists
                updateDisplayedShoppingList();
                updateActionShoppingList(clickedListName);

                // Make the "update-start-shoping-shopping-list-screen" element visible
                updateStartShoppingListScreen.style.display = "block";
            }
        });

        // Initial update of the displayed shopping list and action shopping list
        updateDisplayedShoppingList();
        updateActionShoppingList(savedShoppingList[0] ? savedShoppingList[0].listName : ''); // Adjust this based on your initial state

        // Add click event listener to the <ul> element
        displayLatestShoppingList.addEventListener("click", function (event) {
            // Check if a <li> element is clicked
            if (event.target.tagName === "LI") {
                // Log the clicked item's text content
                console.log("Clicked item: ", event.target.textContent);

                // Find the clicked shopping list item in the savedShoppingList array
                const clickedListItemIndex = savedShoppingList.findIndex(item => item.listName === event.target.textContent);

                // Log details of items saved under the clicked shopping list item
                if (clickedListItemIndex !== -1) {
                    const clickedListItem = savedShoppingList[clickedListItemIndex];
                    console.log("Items under clicked shopping list:", clickedListItem.items);

                    // Update both displayed and action shopping lists
                    updateDisplayedShoppingList();
                    updateActionShoppingList(clickedListItem);

                    // Make the "update-start-shoping-shopping-list-screen" element visible
                    updateStartShoppingListScreen.style.display = "block";
                }
            }
        });

        // Initial update of the displayed shopping list and action shopping list
        updateDisplayedShoppingList();
        updateActionShoppingList(savedShoppingList[0]); // Adjust this based on your initial state
    }


    updateLatestShoppingListDisplay();
    createShoppingBtn.addEventListener("click", function () {
        // Toggle the display of the popup
        shoppingListPopup.style.display = (shoppingListPopup.style.display === "block") ? "none" : "block";
    });
    closeActionScreen.addEventListener("click", function () {
        // Toggle the display of the popup
        updateStartShoppingListScreen.style.display = "none";
    });

    addToShoppingListButton.addEventListener("click", function () {
        // Get the value from the input field
        const newItemText = newItemInput.value;

        // Check if the input field is not empty
        if (newItemText.trim() !== "") {
            // Create a new list item
            const newItem = document.createElement("li");
            newItem.textContent = newItemText;

            // Append the new item to the shopping list
            shoppingList.appendChild(newItem);

            // Clear the input field after adding to the list
            newItemInput.value = "";
        }
    });

    saveShoppingListButton.addEventListener("click", function () {
        // Create a new popup container
        const popupContainer = document.createElement("div");
        popupContainer.className = "popup-window";
        popupContainer.style.position = "fixed";
        popupContainer.style.top = "50%";
        popupContainer.style.left = "50%";
        popupContainer.style.transform = "translate(-50%, -50%)";
        popupContainer.style.background = "white";
        popupContainer.style.padding = "20px";
        popupContainer.style.border = "1px solid #ccc";
        popupContainer.style.zIndex = "9999";

        // Create an input field in the popup
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.placeholder = "Enter something";
        inputField.style.marginBottom = "10px";
        popupContainer.appendChild(inputField);

        // Create a "Save" button in the popup
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.style.cursor = "pointer";
        saveButton.addEventListener("click", function () {
            // Perform the save operation (customize this part based on your needs)
            const listName = inputField.value.trim();
            if (listName !== "") {
                const uniqueShoppingListID = Date.now().toString();
                const timestamp = new Date().toLocaleString();
                const shoppingListArray = [];

                const currentItems = shoppingList.children;
                for (const item of currentItems) {
                    shoppingListArray.push({
                        itemName: item.textContent,
                        itemPrice: "",
                    });
                }

                console.log("List Name:", listName);
                console.log("Unique Shopping List ID:", uniqueShoppingListID);
                console.log("Timestamp:", timestamp);
                console.log("Shopping List Items:", shoppingListArray);

                savedShoppingList.push({
                    listName: listName,
                    uniqueShoppingListID: uniqueShoppingListID,
                    timestamp: timestamp,
                    items: shoppingListArray,
                });
                saveToLocalStorage(savedShoppingList);

                // Clear the existing list
                shoppingList.innerHTML = "";

                // Update the display of latest shopping lists
                updateLatestShoppingListDisplay();

                // Close the popup
                document.body.removeChild(popupContainer);
                shoppingListPopup.style.display = "none";
            }
        });
        popupContainer.appendChild(saveButton);

        // Append the popup container to the body
        document.body.appendChild(popupContainer);
    });
});

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
//localStorage.removeItem("shoppingList")
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
     //localStorage.removeItem('shoppingLists');
  document.addEventListener("DOMContentLoaded", function () {
    const createShoppingBtn = document.getElementById("createShoppingBtn");
    const shoppingListPopup = document.getElementById("shopping-list-popup");
    const newItemInput = document.getElementById('new-item-input');
    const addToShoppingListButton = document.getElementById('add-to-shopping-list-button');
    const shoppingList = document.getElementById('shopping-list');
    const saveShoppingListButton = document.getElementById('save-shopping-list-button');
    const commitShoppingListButton = document.getElementById('commit-shopping-list-to-storage-button');
    const savePopup = document.getElementById('save-shopping-list-to-storage-popup');
    const shoppingListLists = document.getElementById('shopping-list-lists');
      const editPopup = document.getElementById('edit-shopping-list-popup');

    addToShoppingListButton.addEventListener('click', function () {
      const newItemText = newItemInput.value;
  
      if (newItemText.trim() !== '') {
        const newItem = document.createElement('li');
        newItem.textContent = newItemText;
        shoppingList.appendChild(newItem);
        newItemInput.value = '';
  
        // Log what is added to the list
        console.log('Added to list:', newItemText);
      }
    });
  
    saveShoppingListButton.addEventListener('click', function () {
      // Display the popup when Save button is clicked
      savePopup.style.display = 'block';
    });
  
    commitShoppingListButton.addEventListener('click', function () {
      // Log what is saved to local storage
      console.log('Commit button clicked - Saving to local storage...');
  
      // Function to save and close the popup
      saveAndClosePopup();
    });
  
    // Function to close the popup
    function closePopup() {
      savePopup.style.display = 'none';
    }
  
   // Function to save and close the popup
function saveAndClosePopup() {
    const saveListInput = document.getElementById('save-list-to-storage-input');
    const shoppingListItems = document.querySelectorAll('#shopping-list li');
    const savedItems = Array.from(shoppingListItems).map(item => ({
      itemName: item.textContent,
      itemPrice: 0
    }));
    const listName = saveListInput.value.trim();
    const listStatus = 'active';
    const timestamp = new Date().toLocaleString();
    const listsUniqueID = generateUniqueID(); // Generate a unique ID
  
    // Log the stored information
    console.log('List Name:', listName);
    console.log('List Status:', listStatus);
    console.log('Timestamp:', timestamp);
    console.log('Lists Unique ID:', listsUniqueID);
    console.log('Saved Items:', savedItems);
  
    // Retrieve existing lists from local storage
    const existingLists = JSON.parse(localStorage.getItem('shoppingLists')) || [];
  
    // Create new shopping list data
    const shoppingListData = {
      listName: listName,
      listStatus: listStatus,
      timestamp: timestamp,
      listsUniqueID: listsUniqueID,
      items: savedItems
    };
  
    // Add the new shopping list to the existing lists
    existingLists.push(shoppingListData);
  
    // Save the updated lists to local storage
    localStorage.setItem('shoppingLists', JSON.stringify(existingLists));
  
    // Close the popup
    closePopup();
  }
  // Function to log names of all saved lists
function logAllListNames() {
    // Retrieve existing lists from local storage
    const existingLists = JSON.parse(localStorage.getItem('shoppingLists')) || [];
  
    // Log names of all saved lists
    existingLists.forEach(list => {
      console.log('List Name:', list.listName);
    });
  }
  
  // Call this function wherever you need to log the names of all saved lists
  logAllListNames();
    // Function to generate a unique ID
    function generateUniqueID() {
      // Simple implementation, you may need a more robust solution in a real-world application
      return Math.random().toString(36).substr(2, 9);
    }
// Function to edit a shopping list
// Function to edit a shopping list
function editList(listUniqueID) {
    const updateShoppingListPopup = document.getElementById('update-shopping-list-popup');
    const updateShoppingListList = document.getElementById('update-shopping-list-list');
    const updateInput = document.getElementById('update-input');
    const addToUpdateShoppingListButton = document.getElementById('add-to-update-shopping-list-button');
    const activeUpdateShoppingListButton = document.getElementById('active-update-shopping-list-button');
    const editPopup = document.getElementById('update-shopping-list-popup');
  
    // Clear existing content in the update shopping list popup
    updateShoppingListList.innerHTML = '';
    updateInput.value = ''; // Clear the input field
  
    // Retrieve existing lists from local storage
    const existingLists = JSON.parse(localStorage.getItem('shoppingLists')) || [];
  
    // Find the selected list using the unique ID
    const selectedListIndex = existingLists.findIndex(list => list.listsUniqueID === listUniqueID);
  
    if (selectedListIndex === -1) {
      console.error('List not found for editing.');
      return;
    }
  
    const selectedList = existingLists[selectedListIndex];
  
    // Populate the update shopping list popup with items from the selected list
    selectedList.items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = item.itemName;
  
      // Add a "Remove" button for each list item
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => removeItemAndUpdateList(item.itemName, selectedList));
  
      // Append the list item and remove button to the ul element
      listItem.appendChild(removeButton);
      updateShoppingListList.appendChild(listItem);
    });
  
    // Show the update shopping list popup
    editPopup.style.display = 'block';
  
    // Add functionality for adding new items to the list
    addToUpdateShoppingListButton.addEventListener('click', () => {
      const newItemName = updateInput.value.trim();
  
      if (newItemName !== '') {
        // Add the new item to the displayed list
        const newItem = document.createElement('li');
        newItem.textContent = newItemName;
  
        // Add a "Remove" button for the new item
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeItemAndUpdateList(newItemName, selectedList));
  
        // Append the new item and remove button to the ul element
        newItem.appendChild(removeButton);
        updateShoppingListList.appendChild(newItem);
  
        // Add the new item to the selected list in memory
        selectedList.items.push({
          itemName: newItemName,
          itemPrice: 0 // You can set the price as needed
        });
  
        // Clear the input field
        updateInput.value = '';
      }
    });
  
    // Add functionality for updating the list
    activeUpdateShoppingListButton.addEventListener('click', () => {
      // Update the selected list in the local storage
      existingLists[selectedListIndex] = selectedList;
      localStorage.setItem('shoppingLists', JSON.stringify(existingLists));
  
      // Close the update shopping list popup
      editPopup.style.display = 'none';
  
      // Optionally, you can call a function to re-populate the list of saved lists
      populateShoppingListLists();
    });
  
   // Function to remove an item from the list and update the selected list
// Function to remove an item from the list and update the selected list
function removeItemAndUpdateList(itemName, list) {
    // Find the index of the item in the list
    const itemIndex = list.items.findIndex(item => item.itemName === itemName);
  
    if (itemIndex !== -1) {
      // Remove the item from the displayed list
      const listItems = updateShoppingListList.getElementsByTagName('li');
      for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].textContent === itemName) {
          listItems[i].remove();
          break;
        }
      }
  
      // Remove the item from the selected list in memory
      list.items.splice(itemIndex, 1);

      // Update local storage
      updateLocalStorage(list);

      // Update the displayed list
      updateDisplayedList(list);
    }
}

// Function to update the displayed list
function updateDisplayedList(list) {
    const updateShoppingListList = document.getElementById('update-shopping-list-list');
    const listItems = updateShoppingListList.getElementsByTagName('li');
    
    // Clear existing content
    updateShoppingListList.innerHTML = '';
  
    // Repopulate the list with updated items
    list.items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = item.itemName;
  
      // Add a "Remove" button for each list item
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => removeItemAndUpdateList(item.itemName, list));
  
      // Append the list item and remove button to the ul element
      listItem.appendChild(removeButton);
      updateShoppingListList.appendChild(listItem);
    });
  
    // Show an alert if the array of items is empty
    if (list.items.length === 0) {
      const deleteList = confirm('The list is empty. Do you want to delete the entire list?');
      if (deleteList) {
        deleteEntireList(list);
      }
    }
  }
  
  // Function to delete the entire list
  function deleteEntireList(list) {
    const existingLists = JSON.parse(localStorage.getItem('shoppingLists')) || [];
    const updatedLists = existingLists.filter(existingList => existingList.listsUniqueID !== list.listsUniqueID);
  
    localStorage.setItem('shoppingLists', JSON.stringify(updatedLists));
  
    // Optionally, you can add any additional logic or UI updates after deleting the list
  }
  
// Function to add an item to the list
function addItemToList(itemName, list) {
    // Code to add the item to the list
    list.items.push({
      itemName: itemName,
      itemPrice: 0
    });
  
    // Update local storage
    updateLocalStorage(list);
  
    // Optionally, update the displayed list or perform any additional tasks
  }
  
  // Function to update local storage with the modified list
  function updateLocalStorage(list) {
    const existingLists = JSON.parse(localStorage.getItem('shoppingLists')) || [];
    const updatedLists = existingLists.map(existingList => {
      if (existingList.listsUniqueID === list.listsUniqueID) {
        return list;
      } else {
        return existingList;
      }
    });
  
    localStorage.setItem('shoppingLists', JSON.stringify(updatedLists));
  }

  }
  
      
    // Button to open shopping list popup
    createShoppingBtn.addEventListener('click', function () {
      // Toggle the display of the shopping list popup
      shoppingListPopup.style.display = (shoppingListPopup.style.display === 'none' || shoppingListPopup.style.display === '') ? 'block' : 'none';
    });
  
   // Function to populate the list of saved lists
function populateShoppingListLists() {
    // Retrieve existing lists from local storage
    const existingLists = JSON.parse(localStorage.getItem('shoppingLists')) || [];
    const shoppingListLists = document.getElementById('shopping-list-lists');
  
    // Clear existing content in the ul element
    shoppingListLists.innerHTML = '';
  
    // Populate the ul element with list names and Edit buttons
    existingLists.forEach(list => {
      const listItem = document.createElement('li');
      listItem.textContent = list.listName;
  
      // Create an Edit button for each list
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => editList(list.listsUniqueID)); // Assuming you have an editList function
      editButton.style.float = 'right'
     
      // Append the list item and edit button to the ul element
      listItem.appendChild(editButton);
      shoppingListLists.appendChild(listItem);
    });
  }
  
  // Call this function wherever you need to populate the list of saved lists
  populateShoppingListLists();
  });
  
   

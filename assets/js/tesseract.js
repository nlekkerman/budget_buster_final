// Import necessary elements and functions
import { video, initializeCamera } from './camera-script.js';
//localStorage.removeItem('shoppingLists');
//localStorage.removeItem('shoppingArchive');
document.addEventListener("DOMContentLoaded", function () {

    const numberThatIsFound = document.getElementById("number-found");
    const scanButton = document.getElementById("start-camera-scan");
    let shouldRecognize = false; // Variable to control recognition
    let biggestNumber = null;
    let totalExpenses = 0;
    let numberToPass = 0;
    const homeButton = document.getElementById("homeButton");
    const insightsButton = document.getElementById("nav-link-insights");
    const trackerButton = document.getElementById("nav-link-tracker");
    const trackerOrganizerSection = document.getElementById('tracker-organizer-section');
    const cameraContainer = document.getElementById('camera-container');
    const cameraShoppingList = document.getElementById('camera-shopping-list');
    let initialBudget = 0;
    const budgetDisplay = document.getElementById("budget-display");
    const archiveButtonContainer = document.getElementById("save-shopping-list-arhive-container");
    const exitArchiveButton = document.getElementById("exit-archive-button");
    const createNoteButton = document.getElementById("createNoteBtn");

    // JavaScript to handle the button click and display the popup
    createNoteButton.addEventListener('click', function () {
        // Display the create note popup
        document.getElementById('create-note-popup').style.display = 'block';
        document.getElementById('create-note-popup').style.display = 'flex';
    });

    // Optionally, add an event listener to close the popup when the "Create Note" button inside the popup is clicked
    document.getElementById('create-note-popup-button').addEventListener('click', function () {
      
        document.getElementById('give-note-name-popup').style.display = 'block';
        document.getElementById('give-note-name-popup').style.display = 'flex';
        document.getElementById('create-note-popup').style.display = 'none';

    });

    document.getElementById('save-note-name-popup-button').addEventListener('click', function () {
        saveNote();
        document.getElementById('give-note-name-popup').style.display = 'none';
    });
// Function to update the note list
function updateNoteList() {
    // Retrieve existing notes from local storage
    const notesDB = JSON.parse(localStorage.getItem('notesDB')) || [];
    
    // Get the ul element
    const noteList = document.querySelector('.note-list');

    // Get the no-note-text element
    const noNoteText = document.getElementById('no-note-text');

    // Clear existing content
    noteList.innerHTML = '';

    // If there are no notes, display the no-note-text
    if (notesDB.length === 0) {
        noNoteText.style.display = 'block';
    } else {
        noNoteText.style.display = 'none';
    }
    // Populate the ul element with note names
    notesDB.forEach(note => {
        const listItem = document.createElement('li');
        listItem.textContent = note.noteName;

        // Add a click event listener to each note item
        listItem.addEventListener('click', function () {
            // Call the function to display detailed note information
            displayDetailedNote(note);
        });

        // Append the note item to the ul element
        noteList.appendChild(listItem);
    });
}
// Function to display detailed information about a selected note
function displayDetailedNote(note) {
    // Create a new container dynamically
    const detailedNoteContainer = document.createElement('div');
    detailedNoteContainer.classList.add('detailed-note-container');
    detailedNoteContainer.style.position = 'fixed';
    detailedNoteContainer.style.top = '50%';
    detailedNoteContainer.style.left = '50%';
    detailedNoteContainer.style.transform = 'translate(-50%, -50%)';
    detailedNoteContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    detailedNoteContainer.style.padding = '20px';
    detailedNoteContainer.style.border = '2px solid white';
    detailedNoteContainer.style.borderRadius = '10px';
    detailedNoteContainer.style.width = '90%';
    
    // Create a header for the detailed note with the note name
    const noteTitle = document.createElement('h5');
    noteTitle.textContent = note.noteName;
    noteTitle.style.color = 'white';
    noteTitle.style.width = '100%';
    noteTitle.style.margin = '0 auto';
    noteTitle.style.textAlign = 'center';
    noteTitle.style.marginBottom = '1em';
    noteTitle.style.backgroundColor = 'rgba(25, 100, 15, 0.5)';

    // Create a paragraph for the note date
    const noteDate = document.createElement('p');
    noteDate.textContent = ` ${note.date}`;
    noteDate.style.color = 'white';
    noteDate.style.width = '50%';
    noteDate.style.margin = '0 auto';
    noteDate.style.textAlign = 'center';
    noteDate.style.fontSize = '10px';
    noteDate.style.marginBottom = '1em';
    noteDate.style.backgroundColor = 'rgba(125, 0, 150, 0.4)';

    // Create a paragraph for the note content
    const noteContent = document.createElement('p');
    noteContent.textContent = `Content: ${note.noteContent}`;
    noteContent.style.color = 'white';
    noteContent.style.width = '100%';
    noteContent.style.margin = '0 auto';
    noteContent.style.textAlign = 'center';
    noteContent.style.marginBottom = '1em';
    noteContent.style.border = '1px solid white';
    noteContent.style.borderRadius = '20px';
    noteContent.style.padding = '5px';
    noteContent.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';

    // Create a button to close the detailed note
    const closeButton = createButton('Close', 'rgba(255, 200, 242, 0.7)', 'white', '25px', 'flex', 'center', '0 auto', function () {
        // Remove the dynamically created detailed note container
        detailedNoteContainer.remove();
    });

    // Create a button to delete the note
    const deleteButton = createButton('Delete', 'rgba(255, 0, 0, 0.7)', 'white', '25px', 'flex', 'center', '0 auto', function () {
        // Delete the note
        deleteNote(note.uniqueId);

        // Update the note list dynamically
        updateNoteList();

        // Remove the detailed note container
        detailedNoteContainer.remove();
    });

    // Add the elements to the detailed note container
    detailedNoteContainer.appendChild(noteTitle);
    detailedNoteContainer.appendChild(noteDate);
    detailedNoteContainer.appendChild(noteContent);
    detailedNoteContainer.appendChild(closeButton);
    detailedNoteContainer.appendChild(deleteButton);

    // Append the detailed note container to the body or a specific container in your HTML
    document.body.appendChild(detailedNoteContainer);
}

// Function to delete a note by uniqueId
function deleteNote(uniqueId) {
    // Retrieve existing notes from local storage
    const notesDB = JSON.parse(localStorage.getItem('notesDB')) || [];

    // Filter out the note with the specified uniqueId
    const updatedNotes = notesDB.filter(note => note.uniqueId !== uniqueId);

    // Save the updated notes to local storage
    localStorage.setItem('notesDB', JSON.stringify(updatedNotes));
}

// Function to create a button with specified styles and click event listener
function createButton(text, backgroundColor, color, borderRadius, display, textAlign, margin, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.backgroundColor = backgroundColor;
    button.style.color = color;
    button.style.borderRadius = borderRadius;
    button.style.display = display;
    button.style.textAlign = textAlign;
    button.style.margin = margin;
    button.addEventListener('click', clickHandler);
    return button;
}

// Call the updateNoteList function initially to populate the list
updateNoteList();
function saveNote() {
    // Get input values
    const noteName = document.getElementById('save-note-name-input').value.trim();
    const noteContent = document.getElementById('note-input').value.trim();

    // Validate input
    if (noteName === "") {
        alert('Note name cannot be empty!');
        return;
    }

    // Create a new note object
    const newNote = {
        noteName: noteName,
        noteContent: noteContent,
        date: new Date().toLocaleString(),
        uniqueId: generateUniqueID() // Assuming you have a function to generate a unique ID
    };

    // Retrieve existing notes from local storage
    const notesDB = JSON.parse(localStorage.getItem('notesDB')) || [];

    // Add the new note to the existing notes
    notesDB.push(newNote);
    console.log('Updated Notes Data:', notesDB);

    // Save the updated notes to local storage
    localStorage.setItem('notesDB', JSON.stringify(notesDB));

    // Hide the create note popup
    document.getElementById('create-note-popup').style.display = 'none';

    // Optionally, you can update the note list dynamically here
    updateNoteList();

    document.getElementById('save-note-name-input').value = '';
    document.getElementById('note-input').value = '';
}
    let budget = parseInt(localStorage.getItem('budget')) || 0;

    readInitialBudget();
    function displayBudget(remainingBudget) {
        const formattedBudget = remainingBudget.toFixed(2);
        budgetDisplay.textContent = `Budget: € ${formattedBudget}`;

        budgetDisplay.classList.remove("positive-budget", "negative-budget");

        if (remainingBudget >= 0) {
            budgetDisplay.classList.add("positive-budget");
        } else {
            budgetDisplay.classList.add("negative-budget");
        }
    }
    function readInitialBudget() {
        const storedBudget = localStorage.getItem("budget");

        if (storedBudget !== null) {
            initialBudget = parseFloat(storedBudget);
        }

        displayBudget(initialBudget);
    }
    //initializeCamera();

    // Wait for the video to be ready
    video.addEventListener("canplay", function () {
        // Initialize camera
        //initializeCamera();

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


            // Find all numbers (including decimals) in the recognized text
            const foundNumbers = findAllNumbers(text);

            if (foundNumbers.length > 0) {
                // Find the biggest number in terms of size (ignoring decimals)
                const currentBiggest = findBiggestNumber(foundNumbers);

                // Update the biggest number if a larger one is found
                if (biggestNumber === null || currentBiggest.length > biggestNumber.length) {
                    biggestNumber = currentBiggest;

                    // Display a popup window with the found number and an "Add" button
                    showPopup(biggestNumber);

                    numberToPass = biggestNumber;
                    console.log("aaaaaaaaaaaaaaaaaaaaa" + numberToPass);
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
    function findAllNumbers(text) {
        const numberRegex = /[-+]?\d*\.?\d+/g;
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
        //popupContent.style.alignItems = "center";


        numberThatIsFound.textContent = `Number Found: ${foundNumber}`;


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

    const startShoppingButonsDiv = document.getElementById('start-shopping-delete-popup')
    //localStorage.removeItem("shoppingList")
    //initializeCamera();
    // Import necessary elements and functions
    const startShoppingButton = document.getElementById('start-shopping-button');

    let isShopping;
    startShoppingButton.addEventListener('click', function () {

        trackerOrganizerSection.style.display = 'none';
        cameraContainer.style.display = 'block';
        cameraShoppingList.style.display = 'block';


        initializeCamera();

        // Update the isShopping variable
        isShopping = true;
    });



    const createShoppingBtn = document.getElementById("createShoppingBtn");
    const shoppingListPopup = document.getElementById("shopping-list-popup");
    const newItemInput = document.getElementById('new-item-input');
    const addToShoppingListButton = document.getElementById('add-to-shopping-list-button');
    const shoppingList = document.getElementById('shopping-list');
    const saveShoppingListButton = document.getElementById('save-shopping-list-button');
    const commitShoppingListButton = document.getElementById('commit-shopping-list-to-storage-button');
    const savePopup = document.getElementById('save-shopping-list-to-storage-popup');


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
        savePopup.style.display = 'flex';
        shoppingListPopup.style.display = 'none'
    });

    commitShoppingListButton.addEventListener('click', function () {
        // Log what is saved to local storage
        console.log('Commit button clicked - Saving to local storage...');

        // Function to save and close the popup
        updateListScreen();
    });

    // Function to close the popup
    function closePopup() {
        savePopup.style.display = 'none';
        shoppingListPopup.style.display = 'none';

        populateShoppingListLists();
    }

    // Function to save and close the popup
    function updateListScreen() {
        const saveListInput = document.getElementById('save-list-to-storage-input');
        const shoppingListItems = document.querySelectorAll('#shopping-list li');
        const savedItems = Array.from(shoppingListItems).map(item => ({
            itemName: item.textContent,
            itemPrice: 0,
            status: 'active'
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
    function editList(listUniqueID) {
        const updateShoppingListList = document.getElementById('update-shopping-list-list');
        const deleteShoppingList = document.getElementById('delete-lists-list');
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
        deleteShoppingList.addEventListener('click', function () {
            // Create confirmation popup elements
            const confirmationPopup = document.createElement('div');
            confirmationPopup.id = 'editOrDeleteConfirmationPopup'; // Updated ID
            confirmationPopup.classList.add('editOrDeleteCustomPopup'); // Updated class
            const popupContent = document.createElement('div');
            popupContent.classList.add('editOrDeletePopupContent'); // Updated class
            const confirmationMessage = document.createElement('p');
            confirmationMessage.style.color = 'white'
            confirmationMessage.style.textAlign = 'center'
            confirmationMessage.textContent = 'Are you sure you want to delete this list?';
            const confirmButton = document.createElement('button');
            confirmButton.id = 'editOrDeleteConfirmButton'; // Updated ID
            confirmButton.textContent = 'Confirm';
            confirmButton.style.borderRadius = "25px"
            confirmButton.style.marginRight = "6em"
            confirmButton.style.color = "white"
            confirmButton.style.backgroundColor = "rgba(0, 255, 42, 0.7)"
            const cancelButton = document.createElement('button');
            cancelButton.id = 'editOrDeleteCancelButton'; // Updated ID
            cancelButton.textContent = 'Cancel';
            cancelButton.style.borderRadius = "25px"
            cancelButton.style.color = "white"
            cancelButton.style.backgroundColor = "rgba( 255, 0, 42, 0.7)"

            // Append elements to the confirmation popup
            popupContent.appendChild(confirmationMessage);
            popupContent.appendChild(confirmButton);
            popupContent.appendChild(cancelButton);
            confirmationPopup.appendChild(popupContent);

            // Append the confirmation popup to the body
            document.body.appendChild(confirmationPopup);

            // Add event listeners to buttons
            confirmButton.addEventListener('click', function () {
                // Execute deleteEntireList function on confirmation
                console.log("CONFIRM BTN CLICKD")
                deleteEntireList(selectedList);
                editPopup.style.display = 'none'
                startShoppingButonsDiv.style.display = 'none'
                populateShoppingListLists();
                // Remove the confirmation popup
                document.body.removeChild(confirmationPopup);
            });
            startShoppingButonsDiv.style.display = 'none';

            cancelButton.addEventListener('click', function () {
                // Remove the confirmation popup on cancel
                document.body.removeChild(confirmationPopup);
                startShoppingButonsDiv.style.display = 'none';

            });
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
                    itemPrice: 0, // You can set the price as needed
                    status: 'active'
                });

                // Clear the input field
                updateInput.value = '';
            }
        });
        document.getElementById('close-update-shopping-popup').addEventListener('click', function () {
            editPopup.style.display = 'none';
            startShoppingButonsDiv.style.display = 'none';

        });
        // Add functionality for updating the list
        activeUpdateShoppingListButton.addEventListener('click', () => {
            // Update the selected list in the local storage
            existingLists[selectedListIndex] = selectedList;
            localStorage.setItem('shoppingLists', JSON.stringify(existingLists));
            startShoppingButonsDiv.style.display = 'none';

            // Close the update shopping list popup
            editPopup.style.display = 'none';

            // Optionally, you can call a function to re-populate the list of saved lists
            populateShoppingListLists();
        });

        // Function to remove single item from the list and update the selected list
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
    // Button to open shopping list popup
    createShoppingBtn.addEventListener('click', function () {
        // Toggle the display of the shopping list popup
        shoppingListPopup.style.display = (shoppingListPopup.style.display === 'none' || shoppingListPopup.style.display === '') ? 'block' : 'none';
    });



    function updateItemPrice(list, item, newItemName) {
        // Retrieve the stored number or set a default value
        let foundNumber = numberToPass;
        updateCostNumberTracker(foundNumber);
        console.log('Found Number:', foundNumber); // Log the foundNumber for debugging

        // Update both itemName and itemPrice
        item.itemName = newItemName;
        item.itemPrice = foundNumber;
        item.status = 'inactive';

        console.log('Updated Item:', item, list); // Log the updated item for debugging

        // Check if all items in the list are inactive
        const allItemsInactive = list.items.every(listItem => listItem.status === 'inactive');

        if (allItemsInactive) {
            // Set listStatus to inactive if all items are inactive
            archiveButtonContainer.style.display = 'block'
            list.listStatus = 'inactive';
            console.log(`Shopping list "${list.listName}" is complete. All items are inactive.`);
        }

        // Save the updated item data back to local storage
        saveItemPriceToLocalStorage(list, item);
        processInnerList(list);
    }


    // Save the updated item price, name, and status to local storage
    function saveItemPriceToLocalStorage(list, item) {
        // Retrieve existing lists from local storage
        const existingLists = JSON.parse(localStorage.getItem('shoppingLists')) || [];

        // Find the index of the list containing the updated item
        const listIndex = existingLists.findIndex(existingList => existingList.listsUniqueID === list.listsUniqueID);

        if (listIndex !== -1) {
            // Find the index of the item in the list using itemName
            const itemName = item.itemName;
            const itemIndex = existingLists[listIndex].items.findIndex(existingItem => existingItem.itemName === itemName);

            if (itemIndex !== -1) {
                // Update the item in the list
                existingLists[listIndex].items[itemIndex].itemPrice = item.itemPrice;

                // Update the status to 'inactive'
                existingLists[listIndex].items[itemIndex].status = 'inactive';

                // Check if all items in the list are inactive
                const allItemsInactive = existingLists[listIndex].items.every(listItem => listItem.status === 'inactive');

                if (allItemsInactive) {
                    // Set listStatus to 'inactive' if all items are inactive
                    existingLists[listIndex].listStatus = 'inactive';
                    console.log(`Shopping list "${existingLists[listIndex].listName}" is complete. All items are inactive.`);
                }

                // Save the updated lists back to local storage
                localStorage.setItem('shoppingLists', JSON.stringify(existingLists));

                // Optional: You can log the updated lists for debugging
                console.log('Updated Lists:', existingLists);
            } else {
                console.error('Item not found in list:', item);
            }
        } else {
            console.error('List not found:', list);
        }
    }


    function processInnerList(list) {
        // Clear existing content in camera-shopping-list
        cameraShoppingList.innerHTML = '';

        // Variable to track if all items are inactive
        let allItemsInactive = true;

        list.items.forEach(item => {
            const itemElement = document.createElement('li');

            if (item.status === 'inactive') {
                itemElement.style.textDecoration = 'line-through';
                itemElement.style.pointerEvents = 'none';
            } else {
                // If at least one item is active, set the variable to false
                allItemsInactive = false;

                // Add a click event listener only to active items
                itemElement.addEventListener('click', function () {
                    console.log('Clicked Item:', item);
                    // Pass both list, item, and listsUniqueID to the updateItemPrice function
                    updateItemPrice(list, item, item.itemName, list.listsUniqueID);
                    numberThatIsFound.textContent = ""
                    biggestNumber = null;
                });
            }

            itemElement.innerHTML = `
                ${item.itemName}
                <span style="float: right; color: red; margin-right: 10px">€ ${item.itemPrice}</span>
            `;

            cameraShoppingList.appendChild(itemElement);
        });



        // Check if all items are inactive
        if (allItemsInactive) {
            // Set listStatus to inactive
            // Archive the completed list here
            archiveCompletedList(list);
            console.log(`Shopping list "${list.listName}" is complete. All items are inactive.`);
        }
    }



    function populateShoppingListLists() {
        // Retrieve existing lists from local storage
        const existingLists = JSON.parse(localStorage.getItem('shoppingLists')) || [];
        const shoppingListLists = document.getElementById('shopping-list-lists');
        const noListsText = document.getElementById('no-lists-text'); // Add this line to get the no-lists-text element

        // Clear existing content in the ul element
        shoppingListLists.innerHTML = '';

        // Check if there are no lists
        if (existingLists.length === 0) {
            // Hide the no-lists-text element
            noListsText.style.display = 'block';
        } else {
            // Show the no-lists-text element
            noListsText.style.display = 'none';
        }
        console.log('Existing Lists:', existingLists);
        // Iterate through each existing list
        existingLists.forEach(list => {
            const listItem = document.createElement('li');
            listItem.textContent = list.listName;
            listItem.style.backgroundColor = 'rgba(23, 0, 0, 0.9)';
            listItem.style.color = 'white';
            listItem.style.border = '1px solid white';
            listItem.style.marginBottom = '5px';

            // Check if the list is completed
            if (list.listStatus === 'inactive') {
                listItem.style.pointerEvents = 'none';
                listItem.innerHTML += '<br><span style="color: green;">LIST IS COMPLETED</span>';
            } else {
                // If not completed, create an Edit button for each list
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.style.border = '1px solid white';
                editButton.style.borderRadius = '5px';
                editButton.style.backgroundColor = 'darkBlue';
                editButton.style.color = 'white';
                editButton.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent the default behavior of the click event
                    editList(list.listsUniqueID);
                }); editButton.style.float = 'right';
                listItem.appendChild(editButton);

            }

            // Add a click event listener to each shopping list item
            listItem.addEventListener('click', function () {
                console.log('Clicked Shopping List:', list);
                // Call the processInnerList function to populate camera-shopping-list
                startShoppingButonsDiv.style.display = 'block';
                startShoppingButonsDiv.style.display = 'flex';
                processInnerList(list);
            });

            // Append the list item to the ul element
            shoppingListLists.appendChild(listItem);

            console.log(`List: ${list.listName}, Status: ${list.listStatus}`);
        });
    }

    populateShoppingListLists();

    function archiveCompletedList(list) {
        // Retrieve existing lists from local storage
        const existingLists = JSON.parse(localStorage.getItem('shoppingLists')) || [];

        // Find the index of the completed list
        const completedListIndex = existingLists.findIndex(l => l.listsUniqueID === list.listsUniqueID);

        if (completedListIndex !== -1) {
            const completedList = existingLists[completedListIndex];

            // Get the current date
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

            // Archive the completed list with the current date
            const shoppingArchive = JSON.parse(localStorage.getItem('shoppingArchive')) || [];
            shoppingArchive.push({
                listName: completedList.listName,
                items: completedList.items,
                date: formattedDate,
                shoppingExpense: totalExpenses
            });
            localStorage.setItem('shoppingArchive', JSON.stringify(shoppingArchive));

            // Remove the completed list from the shopping lists
            existingLists.splice(completedListIndex, 1);

            // Save the updated lists back to local storage
            localStorage.setItem('shoppingLists', JSON.stringify(existingLists));

            // Update the shopping list display
            populateShoppingListLists();

            // Log to indicate the completion of the archiving process
            console.log(`List archived successfully on ${formattedDate}.`);
        } else {
            // Log if no completed list is found
            console.log('No completed list found for archiving.');
        }
    }

    // Event listener for the archive button
    document.getElementById('archive-button').addEventListener('click', function () {
        // Subtract a specific value from the budget (adjust as needed)

        budget -= totalExpenses;
        archiveButtonContainer.style.display = 'none'
        // Save the updated budget to local storage
        localStorage.setItem('budget', budget);
        displayAnimationValue(totalExpenses, "red", "-");
        cameraContainer.style.display = 'none'
        trackerOrganizerSection.style.display = 'block'
        trackerOrganizerSection.style.display = 'flex'
        readInitialBudget();
        startShoppingButonsDiv.style.display = 'none'
        populateArchiveShoppingList();

    });
    document.getElementById('go-to-archive-button').addEventListener('click', function () {


        const archiveScreen = document.getElementById('archive-section')
        archiveScreen.style.display = 'block'
        archiveScreen.style.display = 'flex'

    });
    exitArchiveButton.addEventListener('click', function () {
        const archiveScreen = document.getElementById('archive-section')
        archiveScreen.style.display = 'none'
        cameraContainer.style.display = 'none'

    });

    function handleArchivedListClick(archivedList) {
        // Create a new list container dynamically
        const newListContainer = document.createElement('div');

        newListContainer.classList.add('archived-list-container');
        newListContainer.style.zIndex = '23472347284728947294';
        newListContainer.style.position = 'absolute';
        newListContainer.style.display = 'flex';
        newListContainer.style.justifyContent = 'center';
        newListContainer.style.flexDirection = 'column';
        newListContainer.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        newListContainer.style.height = '100%';
        newListContainer.style.width = '100%';

        const listTitle = document.createElement('h4');
        listTitle.textContent = 'Archived list';
        listTitle.style.textAlign = 'center';
        listTitle.style.color = 'white';
        listTitle.style.marginTop = '-13em';
        listTitle.style.marginBottom = '7em';
        newListContainer.appendChild(listTitle);


        // Create a header for the list with the list name and date
        const listHeader = document.createElement('h5');
        listHeader.style.backgroundColor = 'rgba(233, 244, 222, 0.5)';
        listHeader.style.padding = '5px';
        listHeader.style.borderTop = '1px solid white';
        listHeader.style.borderBottom = '1px solid white';
        listHeader.style.textAlign = 'center';
        listHeader.style.width = '100%';
        listHeader.style.margin = '0 auto';
        listHeader.style.color = 'white';
        listHeader.style.marginBottom = '6rem';
        listHeader.textContent = `${archivedList.listName} <br> ${archivedList.date}`;
        newListContainer.appendChild(listHeader);

        // Create an unordered list for items
        const itemList = document.createElement('ul');
        itemList.style.listStyle = 'none';
        itemList.style.marginLeft = '0px';
        itemList.style.width = '90%';
        itemList.style.padding = '0px';
        itemList.style.margin = '0 auto';
        itemList.style.backgroundColor = 'rgba(14, 0, 22, 1)';

        archivedList.items.forEach(item => {
            // Create a list item for each item with its name and price
            const listItem = document.createElement('li');
            listItem.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            listItem.style.padding = '8px';
            listItem.style.textAlign = 'start';
            listItem.style.marginBottom = '8px';
            listItem.style.borderRadius = '10px';
            listItem.style.border = '1px solid white';
            listItem.innerHTML = `<span style="color: white;">${item.itemName}</span>  <span style="color: red; float:right">€ ${item.itemPrice}</span>`;
            itemList.appendChild(listItem);
        });

        // Append the item list to the new list container
        newListContainer.appendChild(itemList);

        // Display shoppingExpense
        const shoppingExpenseParagraph = document.createElement('p');
        shoppingExpenseParagraph.style.color = 'white';
        shoppingExpenseParagraph.style.textAlign = 'center';
        shoppingExpenseParagraph.textContent = `Shopping Expense: € ${archivedList.shoppingExpense.toFixed(2)}`;
        newListContainer.appendChild(shoppingExpenseParagraph);

        // Create a button to exit the list
        const exitButton = document.createElement('button');
        exitButton.textContent = 'Exit List';
        exitButton.style.width = '40%';
        exitButton.style.borderRadius = '5px';
        exitButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        exitButton.style.color = 'white';
        exitButton.style.margin = '0 auto';
        exitButton.addEventListener('click', function () {
            // Remove the dynamically created list container when the exit button is clicked
            newListContainer.remove();
        });

        // Append the exit button to the new list container
        newListContainer.appendChild(exitButton);

        // Append the new list container to the body or a specific container in your HTML
        document.body.appendChild(newListContainer);
    }



    function populateArchiveShoppingList() {
        // Retrieve archived lists from local storage
        const shoppingArchive = JSON.parse(localStorage.getItem('shoppingArchive')) || [];
        const archiveShoppingList = document.getElementById('archive-shopping-list');

        // Clear existing content in the ul element
        archiveShoppingList.innerHTML = '';

        // Populate the ul element with archived list names
        shoppingArchive.forEach(archivedList => {
            const listItem = document.createElement('li');
            listItem.textContent = `${archivedList.listName} - ${archivedList.date}`;
            listItem.style.backgroundColor = 'rgba(0, 128, 0, 0.9)'; // Adjust the background color as needed
            listItem.style.color = 'white';
            listItem.style.border = '1px solid white';
            listItem.style.marginBottom = '5px';

            // Add a click event listener to each archived list item
            listItem.addEventListener('click', function () {
                console.log('Clicked Archived List:', archivedList);

                handleArchivedListClick(archivedList);
            });

            // Append the list item to the ul element
            archiveShoppingList.appendChild(listItem);

            console.log(`Archived List: ${archivedList.listName}, Date: ${archivedList.date}`);
        });
    }
    // Call the function to populate the archived shopping list
    populateArchiveShoppingList();

    function displayAnimationValue(value, color, preSign) {
        const animationDisplay = document.getElementById("input-animation-value-display");

        animationDisplay.textContent = `${preSign}${Math.abs(value)}`;
        animationDisplay.style.color = color;

        animationDisplay.classList.remove("fadeout-animation");
        void animationDisplay.offsetWidth;
        animationDisplay.classList.add("fadeout-animation");
    }


});



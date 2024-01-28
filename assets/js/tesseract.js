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

// Shopping list elements
const createShoppingBtn = document.getElementById("createShoppingBtn");
const groceryInput = document.createElement("input");
const addButton = document.createElement("button");
const latestShoppingList = document.getElementById("latestShoppingList");

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

// Event listener for "Create Shopping" button
createShoppingBtn.addEventListener("click", function () {
    // Create input field for grocery item
    groceryInput.type = "text";
    groceryInput.placeholder = "Enter grocery item";
    groceryInput.style.marginBottom = "10px";

    // Create "Add" button
    addButton.textContent = "Add";
    addButton.style.margin = "5px";
    addButton.style.padding = "5px";
    addButton.style.fontSize = '1rem';

    // Append input field and "Add" button to the container
    document.getElementById("organizer-button-container").appendChild(groceryInput);
    document.getElementById("organizer-button-container").appendChild(addButton);

    // Event listener for "Add" button
    addButton.addEventListener("click", function () {
        const groceryItem = groceryInput.value.trim();
        if (groceryItem !== "") {
            // Update the grocery list
            updateGroceryList(latestShoppingList, groceryItem);

            // Clear the input field
            groceryInput.value = "";
        }
    });
});

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

// Function to update the grocery list displayed
function updateGroceryList(list, item) {
    const listItem = document.createElement("li");
    listItem.textContent = item;

    // Append the new grocery item to the list
    list.querySelector(".shopping-list").appendChild(listItem);
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

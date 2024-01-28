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
        const foundNumbers = findAllNumbers(text);

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

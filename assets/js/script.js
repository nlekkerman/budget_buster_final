document.addEventListener("DOMContentLoaded", function () {
    const homeButton = document.getElementById("homeButton");
    const insightsButton = document.getElementById("nav-link-insights");
    const aboutButton = document.getElementById("aboutButton");
    const contactButton = document.getElementById("contactButton");


    const costBudgetInput = document.getElementById("cost-value-input");
    const budgetDisplay = document.getElementById("budget-display");
    const openExpensesScreen = document.getElementById('expense-section');
    const insinghstScreen = document.getElementById('insights-container');
    const contactScreen = document.getElementById('contact-wraper');
    const aboutScreen = document.getElementById('about-section-wraper');
    const goalDepositButton = document.getElementById("goal-deposit-button");



    let dropdownGoalList = document.getElementById("dropdown-goal-list");


    /** NAvigation */
    // Add click event listeners to the buttons
    homeButton.addEventListener("click", function () {
        openExpensesScreen.style.display = 'block';
        aboutScreen.style.display = 'none';
        contactScreen.style.display = 'none'
        insinghstScreen.style.display = 'none';


    });

    insightsButton.addEventListener("click", function () {
        window.location.href = 'insights.html';
    });


    aboutButton.addEventListener("click", function () {
        aboutScreen.style.display = 'block';
        contactScreen.style.display = 'none'
        insinghstScreen.style.display = 'none';
        openExpensesScreen.style.display = 'none';
    });


    contactButton.addEventListener("click", function () {
        contactScreen.style.display = 'block'
        insinghstScreen.style.display = 'none';
        openExpensesScreen.style.display = 'none';
        aboutScreen.style.display = 'none';

    })
    goalDepositButton.addEventListener("click", function () {
        dropdownGoalList.style.display = 'block'
        displayGoalsList();


    })
    function displayGoalsList() {
        const goalListDiv = document.getElementById("dropdown-goal-list");
    
        goalListDiv.innerHTML = ""; // Clear existing content
    
        // Check if localStorage is not null
        if (localStorage) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
    
                if (key && key.startsWith("goal_")) {
                    const goalData = JSON.parse(localStorage.getItem(key));
    
                    // Create an ID based on the goalKey
                    const goalId = "goal_" + key.substring(5);
    
                    const goalDiv = document.createElement("div");
                    goalDiv.id = goalId; // Assign the ID to the goal element
    
                    goalDiv.innerHTML = `
                        <strong>${goalData.goalName}</strong><br><br>`;
    
                    goalDiv.addEventListener("click", function (event) {
                        // Check if the clicked element is not the "Achieved" button or delete button
                        if (!event.target.matches("button")) {
                            // Call the function to deduct the cost from the budget
                            deductCostFromBudget(goalId, goalData, goalDiv);
                            dropdownGoalList.style.display = 'none'
                            console.log("Goal clicked:", goalData);

                        }
                    });
    
                    goalListDiv.appendChild(goalDiv);
                }
            }
        }
    }
    
    function deductCostFromBudget(selectedGoalId, goalData, goalDiv) {
       
        const costValueInput = document.getElementById("cost-value-input");
        let costValue = parseFloat(costValueInput.value) || 0; // Default to 0 if input is not a valid number
    
        let reference = goalData.goalLeftToPayAmount;
    
        // Check if deducting costValue exceeds the initial budget
        if (initialBudget - costValue < 0) {
            // Log a custom message or perform an action
            console.error("Insufficient funds! Cannot deduct this amount.");
            return; // Stop further execution
        }
    
        // Deduct only the amount the user owes (up to the remaining amount in the goal)
        let amountToDeduct = Math.min(costValue, goalData.goalLeftToPayAmount);
    
        // Update goalLeftToPayAmount
        goalData.goalLeftToPayAmount = Math.max(0, goalData.goalLeftToPayAmount - amountToDeduct); // Ensure it doesn't go below zero
    
        // Update the budget by deducting the actual amount owed
        initialBudget -= amountToDeduct;
        updateBudget(initialBudget);
    
        // Check if the goal has been achieved
        if (goalData.goalLeftToPayAmount === 0) {
            alert("Congratulations! The goal has been achieved.");
            // You may perform additional actions here if needed
        }
    
        // Update the goalDiv content to reflect the changes
        goalDiv.innerHTML = `
            <strong>${goalData.goalName}</strong><br><br>`;
    
        // Clear the costValueInput
        costValueInput.value = "";
    
        // Update the existing goal in localStorage
        localStorage.setItem(selectedGoalId, JSON.stringify(goalData));
    }
    

    // Function to update the displayed budget
    function updateBudget(newBudget) {
        // Assuming you have a function called displayBudget to update the UI with the new budget
        displayBudget(newBudget);
    
        // Additionally, you can store the updated budget in localStorage if needed
        localStorage.setItem("budget", newBudget);
        console.log(newBudget);
    }
    

    
    
    // Example usage:
    // displayGoalsList(); // Call this function to display goals
    // deductCostFromBudget("goal_1", goalData1, goalDiv1); // Call this function when a goal is clicked
    
    
    // Helper function to add a styled list item
    function addListItem(listElement, label, value) {
        let listItem = document.createElement("li");
        listItem.style.marginBottom = "8px"; // Adjust the margin as needed
        listItem.innerHTML = `<strong>${label}:</strong> ${value}`;
        listElement.appendChild(listItem);
    }


    let initialBudget = 0;


    function addButtonClickListeners(category, type) {
        document.getElementById(`${type.toLowerCase()}-button`).addEventListener("click", function () {
            manipulateExpenses(category, type);
        });
    }

    function manipulateExpenses(category, type) {
        const costValue = parseFloat(costBudgetInput.value);

        if (isNaN(costValue) || costValue <= 0) {
            console.log("Please enter a valid amount.");
            return;
        }

        const currentDate = new Date().toLocaleDateString();
        const data = {
            expense_date: currentDate,
            expense_type: type,
            expense_category: category,
            expense_value: costValue,
        };

        let savedData;
        const storageKey = "expense_tracker_DB";
        try {
            savedData = JSON.parse(localStorage.getItem(storageKey)) || [];
        } catch (error) {
            console.error("Error parsing existing data:", error);
            savedData = [];
        }

        savedData.push(data);
        localStorage.setItem(storageKey, JSON.stringify(savedData));

        initialBudget -= costValue;
        localStorage.setItem("budget", initialBudget);
        displayBudget(initialBudget);
        displayAnimationValue(costValue, "red", "-");

        console.log(`Current content of "${storageKey}" database after manipulation:`);
        console.log(localStorage.getItem(storageKey));

        costBudgetInput.value = "";
    }

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

    function setPlannedBudget() {
        const plannedBudget = parseFloat(costBudgetInput.value);

        if (isNaN(plannedBudget) || plannedBudget < 0) {
            console.log("Please enter a valid planned budget.");
            return;
        }

        initialBudget += plannedBudget;
        localStorage.setItem("budget", initialBudget);
        displayBudget(initialBudget);
        displayAnimationValue(plannedBudget, "green", "+");

        costBudgetInput.value = "";
    }
    function displayAnimationValue(value, color, preSign) {
        const animationDisplay = document.getElementById("input-animation-value-display");

        animationDisplay.textContent = `${preSign}${Math.abs(value)}`;
        animationDisplay.style.color = color;

        animationDisplay.classList.remove("fadeout-animation");
        void animationDisplay.offsetWidth;
        animationDisplay.classList.add("fadeout-animation");
    }

    addButtonClickListeners("Basic Needs", "Food");
    addButtonClickListeners("Basic Needs", "Transport");
    addButtonClickListeners("Basic Needs", "Education");
    addButtonClickListeners("Basic Needs", "Healthcare");
    addButtonClickListeners("Basic Needs", "Housing");
    addButtonClickListeners("Basic Needs", "Utilities");

    addButtonClickListeners("Luxury", "Entertainment");
    addButtonClickListeners("Luxury", "Travel");
    addButtonClickListeners("Luxury", "Dining");
    addButtonClickListeners("Luxury", "Gadgets");
    addButtonClickListeners("Luxury", "Clothing");
    addButtonClickListeners("Luxury", "Beauty");

    readInitialBudget();
    displayBudget(initialBudget);

    document.getElementById("update-budget-button").addEventListener("click", setPlannedBudget);





});


// SCROLL TO TOP FUNCTION
const scrollToTopButton = document.getElementById('scroll-top');
const scrollButton = document.getElementById('scroll-button');

// Show / hide button at 500px
function toggleScrollToTopButton() {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
}

// Return to top of page
function scrollToTop() {
    document.body.scrollTop = 0; //Safari
    document.documentElement.scrollTop = 0; //Other browsers
}

// EventListener: toggles button visibility when scrolling
window.addEventListener('scroll', toggleScrollToTopButton);

// EventListener: scroll to top when clicked
scrollButton.addEventListener('click', scrollToTop);



// DIRECT TO CATEGORY ON HOMEPAGE
// Get the element by its class name
var elementToHide = document.querySelector('.about-text');

// Check if the element is found
if (elementToHide) {
    // Set the style property to hide the element
    elementToHide.style.display = 'none';
}




// CONTACT FORM
function sendMail(contactForm) {
    emailjs.send("service_6a8xgnp", "template_1nbot8m", {
        "from_name": contactForm.name.value,
        "from_lname": contactForm.lname.value,
        "from_email": contactForm.emailaddress.value,
        "file": contactForm.file.value,
        "message": contactForm.message.value,
    })
        .then(
            function (response) {
                console.log("Email successfully sent", response);
            },
            function (error) {
                console.log("Email failed to send", error);
            }
        );
    return false;
}





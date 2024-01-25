document.addEventListener("DOMContentLoaded", function () {
    let insightsLink = document.getElementById("nav-link-insights");
    const homeButton = document.getElementById("homeButton");
    const insightsButton = document.getElementById("nav-link-insights");
    const closePopupInsights = document.getElementById("close-popup-insights");
    const contactButton = document.getElementById("contactButton");
    const analyticsPopupList = document.getElementById("analytics-popup-list");
    const budgetDisplay = document.getElementById("budget-display");


    const trackPopupContainer = document.getElementById("track-popup");

    const createGoalForm = document.getElementById('create-goal-form')

    const createGoalButton = document.getElementById('create-goal-button')
    const submitGoal = document.getElementById('submit-goal-button');
    const closePopupGoals = document.getElementById('close-popup');


    let initialBudget = 0;
    readInitialBudget();
    displayBudget(initialBudget);

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

    function displayData() {
        // Get the data from local storage
        const expenseTrackerDB = JSON.parse(localStorage.getItem('expense_tracker_DB')) || [];

        // Log everything in the console
        console.log("Expense Tracker Data:", expenseTrackerDB);

        // Get the display list element
        const dataDisplayList = document.getElementById("data-display-list");

        // Clear existing content in the display list
        dataDisplayList.innerHTML = "";

        // Use sets to store unique values of expense_type and expense_category
        const uniqueExpenseTypes = new Set();
        const uniqueExpenseCategories = new Set();

        // Iterate through the expenseTrackerDB array and add unique values to the sets
        expenseTrackerDB.forEach(item => {
            uniqueExpenseTypes.add(item.expense_type);
            uniqueExpenseCategories.add(item.expense_category);
        });

        // Function to handle item click
        function handleItemClick(itemType, itemValue) {
            // Perform actions based on the clicked item type
            switch (itemType) {
                case "expenseType":
                    // Action for expense type clicked
                    console.log("Expense Type Clicked:", itemValue);
                    itemSelectedData(itemValue, expenseTrackerDB);
                    trackPopupContainer.style.display = "block";

                    // Add your specific actions for expense type here
                    break;
                case "expenseCategory":
                    // Action for expense category clicked
                    console.log("Expense Category Clicked:", itemValue);
                    trackPopupContainer.style.display = "block";

                    // Add your specific actions for expense category here
                    break;
                default:
                    // Default action
                    console.log("Unknown Item Type Clicked");
                    break;
            }
        }
        function itemSelectedData(expenseType, expenseTrackerDB) {
            const filteredItems = expenseTrackerDB.filter(item => item.expense_type === expenseType);

            const sum = filteredItems.reduce((total, item) => total + item.expense_value, 0);

            const expensesPerDay = filteredItems.reduce((acc, item) => {
                const date = parseDate(item.expense_date);
                if (date !== null) {
                    const formattedDate = date.toDateString();
                    acc[formattedDate] = (acc[formattedDate] || 0) + item.expense_value;
                } else {
                    console.log(`Invalid Date: ${item.expense_date}`);
                }
                return acc;
            }, {});

            const totalExpensesPerDay = Object.values(expensesPerDay).reduce((total, value) => total + value, 0);

            const mostExpensiveDate = Object.keys(expensesPerDay).reduce((maxDate, date) => {
                return expensesPerDay[date] > expensesPerDay[maxDate] ? date : maxDate;
            });

            const leastExpensiveDate = Object.keys(expensesPerDay).reduce((minDate, date) => {
                return expensesPerDay[date] < expensesPerDay[minDate] ? date : minDate;
            });

            // Clear existing content in the analytics popup list
            const analyticsPopupList = document.getElementById("analytics-popup-list");
            analyticsPopupList.innerHTML = "";

            // Update the h3 element with the clicked expense type
            const analyseTitle = document.getElementById("analyse-title");
            analyseTitle.innerText = `Analysis for ${expenseType}`;

            // Create a list item for the sum of expense_type values with percentage
            const sumPercentage = (sum / totalExpensesPerDay) * 100;
            const sumListItem = document.createElement("li");
            sumListItem.innerHTML = `<strong class="highlight-text-popup">All ${expenseType} expenses:</strong><br>€ ${sum} ( ${sumPercentage.toFixed(2)}% )`;
            analyticsPopupList.appendChild(sumListItem);

            // Create list items for expenses per day in percentage and numbers
            Object.keys(expensesPerDay).forEach(date => {
                const percentage = (expensesPerDay[date] / totalExpensesPerDay) * 100;
                const listItem = document.createElement("li");

                // Check if the current date is the most expensive or least expensive date
                if (date === mostExpensiveDate) {
                    listItem.innerHTML = `<strong class="highlight-text-popup">Day with highest expenses:</strong> <br> ${date} <br>€  ${expensesPerDay[date]} ( ${percentage.toFixed(2)}% )`;
                } else if (date === leastExpensiveDate) {
                    listItem.innerHTML = `<strong class="highlight-text-popup">Day with lowest expenses:</strong> <br> ${date} <br>€ ${expensesPerDay[date]} ( ${percentage.toFixed(2)}% )`;
                } else {
                    listItem.innerHTML = `<strong class="highlight-text-popup">All expenses:</strong> <br> € ${date} <br> ${expensesPerDay[date]} ( ${percentage.toFixed(2)}% )`;
                }

                analyticsPopupList.appendChild(listItem);
            });

            // Get the track popup container
            const trackPopupContainer = document.getElementById("track-popup");

            // Make the track-popup element visible
            trackPopupContainer.style.display = "block";
        }
        // Function to handle item click
        function handleItemClick(itemType, itemValue) {
            // Perform actions based on the clicked item type
            switch (itemType) {
                case "expenseType":
                    // Action for expense type clicked
                    console.log("Expense Type Clicked:", itemValue);
                    itemSelectedData(itemValue, expenseTrackerDB);
                    trackPopupContainer.style.display = "block";

                    // Add your specific actions for expense type here
                    break;
                case "expenseCategory":
                    // Action for expense category clicked
                    console.log("Expense Category Clicked:", itemValue);
                    trackPopupContainer.style.display = "block";

                    // Add your specific actions for expense category here
                    break;
                default:
                    // Default action
                    console.log("Unknown Item Type Clicked");
                    break;
            }
        }

        // Function to handle item click
        function handleItemClick(itemType, itemValue) {
            // Perform actions based on the clicked item type
            switch (itemType) {
                case "expenseType":
                    // Action for expense type clicked
                    console.log("Expense Type Clicked:", itemValue);
                    itemSelectedData(itemValue, expenseTrackerDB);
                    trackPopupContainer.style.display = "block";
                    // Add your specific actions for expense type here
                    break;
                case "expenseCategory":
                    // Action for expense category clicked
                    console.log("Expense Category Clicked:", itemValue);
                    itemSelectedDataByCategory(itemValue, expenseTrackerDB);
                    trackPopupContainer.style.display = "block";
                    // Add your specific actions for expense category here
                    break;
                default:
                    // Default action
                    console.log("Unknown Item Type Clicked");
                    break;
            }
        }

        function itemSelectedDataByCategory(expenseCategory, expenseTrackerDB) {
            const filteredItems = expenseTrackerDB.filter(item => item.expense_category === expenseCategory);

            const sum = filteredItems.reduce((total, item) => total + item.expense_value, 0);

            const expensesPerDay = filteredItems.reduce((acc, item) => {
                const date = parseDate(item.expense_date);
                if (date !== null) {
                    const formattedDate = date.toDateString();
                    acc[formattedDate] = (acc[formattedDate] || 0) + item.expense_value;
                } else {
                    console.log(`Invalid Date: ${item.expense_date}`);
                }
                return acc;
            }, {});

            const totalExpensesPerDay = Object.values(expensesPerDay).reduce((total, value) => total + value, 0);

            const mostExpensiveDate = Object.keys(expensesPerDay).reduce((maxDate, date) => {
                return expensesPerDay[date] > expensesPerDay[maxDate] ? date : maxDate;
            });

            const leastExpensiveDate = Object.keys(expensesPerDay).reduce((minDate, date) => {
                return expensesPerDay[date] < expensesPerDay[minDate] ? date : minDate;
            });

            const analyticsPopupList = document.getElementById("analytics-popup-list");
            analyticsPopupList.innerHTML = "";

            const analyseTitle = document.getElementById("analyse-title");
            analyseTitle.innerText = `Analysis for ${expenseCategory}`;

            const highestExpensesDateItem = document.createElement("li");
            highestExpensesDateItem.innerHTML = `<strong class="highlight-text">Day with the highest expenses:</strong> <br> ${mostExpensiveDate}<br> € ${expensesPerDay[mostExpensiveDate].toFixed(2)} <br> ( ${(expensesPerDay[mostExpensiveDate] / totalExpensesPerDay * 100).toFixed(2)}% )`;
            analyticsPopupList.appendChild(highestExpensesDateItem);

            const lowestExpensesDateItem = document.createElement("li");
            lowestExpensesDateItem.innerHTML = `<strong class="highlight-text">Day with the lowest expenses:</strong><br>  ${leastExpensiveDate}<br> € ${expensesPerDay[leastExpensiveDate].toFixed(2)} <br>( ${(expensesPerDay[leastExpensiveDate] / totalExpensesPerDay * 100).toFixed(2)}% )`;
            analyticsPopupList.appendChild(lowestExpensesDateItem);

            const sumListItem = document.createElement("li");
            sumListItem.innerHTML = `<strong class="highlight-text">All Expenses per Category:</strong><br> € ${sum} (100%)`; // Assuming all expenses cover 100%
            analyticsPopupList.appendChild(sumListItem);

            Object.keys(expensesPerDay).forEach(date => {
                if (date !== mostExpensiveDate && date !== leastExpensiveDate) {
                    const expenseValue = expensesPerDay[date];
                    const percentage = (expenseValue / totalExpensesPerDay) * 100;


                }
            });

            const trackPopupContainer = document.getElementById("track-popup");
            trackPopupContainer.style.display = "block";
        }


        // Helper function to parse date string in "M/D/YYYY" format
        function parseDate(dateString) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const month = parseInt(parts[0], 10) - 1;
                const day = parseInt(parts[1], 10);
                const year = parseInt(parts[2], 10);
                return new Date(year, month, day);
            }
            return null;
        }

        // Helper function to parse date string in "M/D/YYYY" format
        function parseDate(dateString) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const month = parseInt(parts[0], 10) - 1;
                const day = parseInt(parts[1], 10);
                const year = parseInt(parts[2], 10);
                return new Date(year, month, day);
            }
            return null;
        }


        // Create list items for unique expense_type values
        uniqueExpenseTypes.forEach(expenseType => {
            const listItem = document.createElement("li");
            // Apply styles to the list item
            listItem.style.padding = "10px";
            listItem.style.border = "2px solid #ccc";
            listItem.style.borderRadius = "25px";
            listItem.style.marginBottom = "5px";
            listItem.style.backgroundColor = "#f8f8f8";
            listItem.style.textAlign = "center";
            listItem.style.boxShadow = "0 4px 4px rgba(0, 0, 0, 0.1)";

            // Apply styles to the text element
            const strongElement = document.createElement("strong");
            strongElement.textContent = expenseType;
            strongElement.style.backgroundColor = "#f8f8f8"; // Replace with the desired background color

            // Append the text element to the list item
            listItem.appendChild(strongElement);

            // Append the list item to the container (assuming dataDisplayList is the container)
            dataDisplayList.appendChild(listItem);

            // Add click event listener to the item
            listItem.addEventListener("click", () => handleItemClick("expenseType", expenseType));
        });

        // Create list items for unique expense_category values
        uniqueExpenseCategories.forEach(expenseCategory => {
            const listItem = document.createElement("li");

            // Apply styles to the list item
            listItem.style.padding = "10px";
            listItem.style.border = "1px solid #333";
            listItem.style.marginBottom = "15px";
            listItem.style.backgroundColor = "#ABE6F1";
            listItem.style.borderRadius = "25px";
            listItem.style.textAlign = "center";
            listItem.style.boxShadow = "0 4px 4px rgba(0, 0, 0, 0.1)";

            // Apply styles to the text element
            const strongElement = document.createElement("strong");
            strongElement.textContent = expenseCategory;
            strongElement.style.backgroundColor = "#ABE6F1"; // Replace with the desired background color

            // Append the text element to the list item
            listItem.appendChild(strongElement);

            // Append the list item to the container (assuming dataDisplayList is the container)
            dataDisplayList.appendChild(listItem);

            // Add click event listener to the item
            listItem.addEventListener("click", () => handleItemClick("expenseCategory", expenseCategory));
        });
    }

    displayData();
    /** NAvigation */


    // Add click event listeners to the buttons
    homeButton.addEventListener("click", function () {
        window.location.href = 'index.html';


    });

    insightsButton.addEventListener("click", function () {
        window.location.href = 'insights.html';
    });


    closePopupInsights.addEventListener("click", function () {
        trackPopupContainer.style.display = 'none'

    });
    analyticsPopupList.addEventListener("click", function () {
        window.location.href = 'insights.html';
    });




    // Add an event listener to the button
    createGoalButton.addEventListener('click', function () {
        createGoalForm.style.display = 'block'
    });

    submitGoal.addEventListener('click', function () {
        saveGoal();
        if (createGoalForm.style.display === 'none') {
            createGoalForm.style.display = 'block'
        } else {
            createGoalForm.style.display = 'none';
        }
        console.log('Create Goal button clicked!');
    });


    closePopupGoals.addEventListener('click', function () {

        document.getElementById("goals-popup").style.display = "none";

    });




    const calendarGrid = document.getElementById("calendar-grid");
    // Add a click event listener to the element
    insightsLink.addEventListener("click", function () {

    });

    // Modify populateGoalsDetailsList function
    function populateGoalsDetailsList(listElement, goalData, goalKey) {
        // Clear existing content in the list
        listElement.innerHTML = "";

        // Add some styles to the list
        listElement.style.listStyleType = "none";
        listElement.style.padding = "0";
        listElement.style.margin = "0";

        // Iterate over properties of the goalData object and add list items
        for (let key in goalData) {
            if (goalData.hasOwnProperty(key)) {
                addListItem(listElement, key, goalData[key]);
            }
        }

    }
    // Function to display the list of goals
    function displayGoalsList() {
        let goalListDiv = document.getElementById("goals-display-list");
        let goalsPopupDiv = document.getElementById("goals-popup");
        let dataGoalsDetailsList = document.getElementById("data-goals-details-list");

        goalListDiv.innerHTML = ""; // Clear existing content

        // Check if localStorage is not null
        if (localStorage) {
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);

                if (key && key.startsWith("goal_")) {
                    let goalData = JSON.parse(localStorage.getItem(key));

                    // Create an ID based on the goalKey
                    let goalId = "goal_" + key.substring(5);

                    let goalDiv = document.createElement("div");
                    goalDiv.id = goalId; // Assign the ID to the goal element

                    let statusColor = ""; // Variable to hold the color for the goal status

                    if (goalData.goalStatus === "active") {
                        statusColor = "red"; // Set color to red for "active"
                    } else if (goalData.goalStatus === "achieved") {
                        statusColor = "green"; // Set color to green for "achieved"
                        addAchievedIcon(goalDiv); // Add the achieved icon
                    }

                    goalDiv.innerHTML =
                    "<strong style='color: #E6E6FA; padding: 5px;'>Goal:</strong> " +
                    "<span style='color: #E6E6FA; font-size: 16px;'>" + goalData.goalName + "</span><br>" +
                    "<strong style='color: #E6E6FA; padding: 5px;'>Status:</strong> <span style='color: " + statusColor + "; background-color: #E6E6FA;'>" + goalData.goalStatus + "</span><br><br>";
                
                    // Apply styles based on goal status
                    goalDiv.style.backgroundColor = "rgba(0, 0, 0, 0.6)"; // Set background color to lavender
                    goalDiv.style.color = "black"; // Default text color
                    goalDiv.style.border = "2px solid #333"; // Set border
                    goalDiv.style.borderRadius = "8px"; // Set border radius

                    goalDiv.addEventListener("click", function (event) {
                        // Check if the clicked element is not the "Achieved" button or delete button
                        if (!event.target.matches("button")) {
                            console.log("Goal clicked:", goalData);
                            displayChildrenOfGoalsDatabase(goalData);

                            // Make the goals-popup visible
                            goalsPopupDiv.style.display = "block";

                            // Populate data-goals-details-list with data from the database
                            populateGoalsDetailsList(dataGoalsDetailsList, goalData, goalId);
                        }
                    });

                    goalListDiv.appendChild(goalDiv);
                    createDeleteButton(goalId); // Call createDeleteButton to add the delete button

               
                }
            }
        }
    }

    // Function to create a "Delete" button for a goal
    function createDeleteButton(goalId) {
        let goalDiv = document.getElementById(goalId);
    
        if (goalDiv) {
            let deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.className = "delete-button"; // Add the class to the button
            deleteButton.style.backgroundColor = "white"; // Set background color to red
            deleteButton.style.border = "2px solid black"; // Set background color to red
            deleteButton.style.borderRadius = "25px"; // Set background color to red
            deleteButton.style.boxShadow = "2px 2px 8px 0 rgba(24, 25, 25, 0.2)"; // Set background color to red
            
            deleteButton.style.marginTop = "10px"; // Add some spacing
            deleteButton.style.float = "right"; // Set the button to the right side
    
            deleteButton.addEventListener("click", function () {
                // Handle the Delete button click
                confirmDeleteGoal(goalId);
            });
    
            goalDiv.appendChild(deleteButton);
        }
    }
    

    // Function to delete a goal
    function deleteGoal(goalId) {
        // Add your logic to delete the goal from the database or perform any other necessary actions
        console.log("Deleting goal with ID:", goalId);

        // For example, you can remove the goal from localStorage
        localStorage.removeItem(goalId);

        // Refresh the displayed goals
        displayGoalsList();
    }

    
    // Function to handle the Delete button click
    function confirmDeleteGoal(goalId) {
        // You can customize this function to show a confirmation popup
        // and handle the deletion of the goal from the database if confirmed.
        let confirmDelete = confirm("Are you sure you want to delete this goal?");
        if (confirmDelete) {
            deleteGoal(goalId);
        }
    }

    // Function to delete a goal from the database
    function deleteGoal(goalId) {
        // Implement your logic to delete the goal from localStorage
        localStorage.removeItem(goalId);

        // Refresh the goal list after deletion
        displayGoalsList();
    }

    function addAchievedIcon(goalDiv) {
        let iconImg = document.createElement("img");
        iconImg.src = "./assets/images/winner-badge-for-goals.png";
        iconImg.alt = "Achieved Icon";
        iconImg.style.width = "24px";
        iconImg.style.height = "24px";
        iconImg.style.backgroundColor = "#E6E6FA";
        iconImg.style.float = "right";  // Float the icon to the right

        // Insert the achieved icon at the beginning of the goalDiv
        goalDiv.insertBefore(iconImg, goalDiv.firstChild);
    }





    function displayChildrenOfGoalsDatabase(goalData) {
        console.log("Children of goals database for goal:", goalData);
        console.log("Child 1:", goalData.child1);
        console.log("Child 2:", goalData.child2);
        console.log("Child 2:", goalData.child3);
        // ...
    }



    // Helper function to add a styled list item
    function addListItem(listElement, label, value) {
        let listItem = document.createElement("li");
        listItem.style.marginBottom = "8px"; // Adjust the margin as needed
        listItem.innerHTML = `<strong>${label}:</strong> ${value}`;
        listElement.appendChild(listItem);
    }
    // Additional logs
    console.log("Page loaded. Initiating displayGoalsList()");
    displayGoalsList();

    function saveGoal() {
        // Retrieve input values
        let goalName = document.getElementById("goal-name").value;
        let goalValue = document.getElementById("goal-amount").value;
        let goalDuration = document.getElementById("duration").value;

        // Create a unique key for each goal based on the timestamp
        let goalKey = "goal_" + Date.now();

        // Retrieve the budget from localStorage
        let expenseTrackerData = JSON.parse(localStorage.getItem("expense_tracker_DB"));
        let budget = expenseTrackerData ? expenseTrackerData.budget : 0;

        // Get the current date formatted as day/month/year
        let currentDate = new Date();
        let formattedCurrentDate = currentDate.toLocaleDateString("en-US"); // Adjust the locale as needed

        // Create an object to represent the goal
        let goalData = {
            goalName: goalName,
            goalValue: goalValue,
            goalDuration: goalDuration,
            goalStatus: "active",
            budget: budget,
            goalLeftToPayAmount: goalValue,
            currentDate: formattedCurrentDate,
        };

        // Store the goal data in local storage
        localStorage.setItem(goalKey, JSON.stringify(goalData));

        // Refresh the goal list
        displayGoalsList();

        // Create an "Achieved" button for the newly added goal
       
    }
    



    function clearGoalDatabase() {
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);

            if (key.startsWith("goal_")) {
                localStorage.removeItem(key);
            }
        }

        // Optionally refresh the goal list after clearing the goals
        displayGoalsList();
    }
    // Refresh the goal list
    displayGoalsList();

});

/***
 * FUNCTIONS TO CALCULATE AND MANIPULATE WITH DATA
 */


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





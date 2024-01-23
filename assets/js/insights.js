document.addEventListener("DOMContentLoaded", function () {
    let insightsLink = document.getElementById("nav-link-insights");
const homeButton = document.getElementById("homeButton");
const insightsButton = document.getElementById("nav-link-insights");
const aboutButton = document.getElementById("aboutButton");
const contactButton = document.getElementById("contactButton");
 const analyticsPopupList = document.getElementById("analytics-popup-list");
    

    const trackPopupContainer = document.getElementById("track-popup");
   
    const createGoalForm = document.getElementById('create-goal-form')
const goalsButton = document.getElementById('goals-data-button');
const displayGoals = document.getElementById('display-goals');
const createGoalButton = document.getElementById('create-goal-button')
const submitGoal = document.getElementById('submit-goal-button');
const closeGoalScreenButton = document.getElementById('close-goals-button');
const closePopupGoals = document.getElementById('close-popup');
const closePopupInsights = document.getElementById('close-popup-insights');

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
    
        // Calculate the sum of all expense_type values
        const sum = filteredItems.reduce((total, item) => total + item.expense_value, 0);
    
        // Log the sum of expense_type values
        console.groupCollapsed(`Analyzing ${expenseType} Data`);
        console.log(`Sum of ${expenseType} values: ${sum}`);
    
        // Calculate expenses per day
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
    
        // Calculate total expenses per day
        const totalExpensesPerDay = Object.values(expensesPerDay).reduce((total, value) => total + value, 0);
    
        // Calculate and log expenses per day in percentage
        Object.keys(expensesPerDay).forEach(date => {
            const percentage = (expensesPerDay[date] / totalExpensesPerDay) * 100;
            console.log(`${date}: ${expensesPerDay[date]} ( ${percentage.toFixed(2)}% )`);
        });
    
        // Find the date with the most expenses
        const mostExpensiveDate = Object.keys(expensesPerDay).reduce((maxDate, date) => {
            return expensesPerDay[date] > expensesPerDay[maxDate] ? date : maxDate;
        });
    
        // Log the date with the most expenses
        console.log(`Date with the most expenses for ${expenseType}: ${mostExpensiveDate}`);
        console.groupEnd();
    
        // Clear existing content in the analytics popup list
        const analyticsPopupList = document.getElementById("analytics-popup-list");
        analyticsPopupList.innerHTML = "";
    
        // Update the h3 element with the clicked expense type
        const analyseTitle = document.getElementById("analyse-title");
        analyseTitle.innerText = `Analysis for ${expenseType}`;
    
        // Create a list item for the sum of expense_type values
        const sumListItem = document.createElement("li");
        sumListItem.innerHTML = `Sum of ${expenseType} values: ${sum}`;
        analyticsPopupList.appendChild(sumListItem);
    
        // Create list items for expenses per day in percentage and numbers
        Object.keys(expensesPerDay).forEach(date => {
            const percentage = (expensesPerDay[date] / totalExpensesPerDay) * 100;
    
            const listItem = document.createElement("li");
            listItem.innerHTML = `${date}: ${expensesPerDay[date]} ( ${percentage.toFixed(2)}% )`;
            analyticsPopupList.appendChild(listItem);
        });
    
        // Create a list item for the date with the most expenses
        const mostExpensiveDateListItem = document.createElement("li");
        mostExpensiveDateListItem.innerHTML = `Date with the most expenses for ${expenseType}: ${mostExpensiveDate}`;
        analyticsPopupList.appendChild(mostExpensiveDateListItem);
    
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
    highestExpensesDateItem.innerHTML = `<strong class="highlight-text">Day with the highest expenses:</strong> ${mostExpensiveDate}<br> € ${expensesPerDay[mostExpensiveDate].toFixed(2)} <br> ( ${(expensesPerDay[mostExpensiveDate] / totalExpensesPerDay * 100).toFixed(2)}% )`;
    analyticsPopupList.appendChild(highestExpensesDateItem);

    const lowestExpensesDateItem = document.createElement("li");
    lowestExpensesDateItem.innerHTML = `<strong class="highlight-text">Day with the lowest expenses:</strong> ${leastExpensiveDate}<br> € ${expensesPerDay[leastExpensiveDate].toFixed(2)} <br>( ${(expensesPerDay[leastExpensiveDate] / totalExpensesPerDay * 100).toFixed(2)}% )`;
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
        listItem.style.border = "1px solid #ccc";
        listItem.style.marginBottom = "5px";
        listItem.style.backgroundColor = "#f8f8f8";
        listItem.style.textAlign = "center";

        listItem.innerHTML = `<strong>${expenseType}</strong>`;
        dataDisplayList.appendChild(listItem);

        // Add click event listener to the item
        listItem.addEventListener("click", () => handleItemClick("expenseType", expenseType));
    });

    // Create list items for unique expense_category values
    uniqueExpenseCategories.forEach(expenseCategory => {
        const listItem = document.createElement("li");

        // Apply styles to the list item
        listItem.style.padding = "10px";
        listItem.style.border = "1px solid #ccc";
        listItem.style.marginBottom = "5px";
        listItem.style.backgroundColor = "#f8f4f9";
        listItem.style.textAlign = "center";

        listItem.innerHTML = `<strong>${expenseCategory}</strong> `;
        dataDisplayList.appendChild(listItem);

        // Add click event listener to the item
        listItem.addEventListener("click", () => handleItemClick("expenseCategory", expenseCategory));
    });
}

displayData();
/** NAvigation */

  
  // Add click event listeners to the buttons
  homeButton.addEventListener("click", function() {
    window.location.href = 'index.html';


  });
  
  insightsButton.addEventListener("click", function() {
    window.location.href = 'insights.html';

    // insinghstScreen.style.display = 'block';
    // openExpensesScreen.style.display = 'none';
    // aboutScreen.style.display = 'block';
    // contactScreen.style.display = 'none'



  });
  
  

// Add an event listener to the button
createGoalButton.addEventListener('click', function () {
    if (createGoalForm.style.display === 'none') {
        createGoalForm.style.display ='block'
    } else {
        createGoalForm.style.display = 'none';
    }
    console.log('Create Goal button clicked!');
});

submitGoal.addEventListener('click', function () {
    saveGoal();
    if (createGoalForm.style.display === 'none') {
        createGoalForm.style.display ='block'
    } else {
        createGoalForm.style.display = 'none';
    }
    console.log('Create Goal button clicked!');
});

closeGoalScreenButton.addEventListener('click', function () {
   
        displayGoals.style.display = 'none';
    
    console.log('CLOSE Goal button clicked!');
});


closePopupGoals.addEventListener('click', function () {
   
    document.getElementById("goals-popup").style.display = "none";


console.log('closepopu!');
});

closePopupInsights.addEventListener('click', function () {
   
    document.getElementById("track-popup").style.display = "none";


console.log('closepopu!');
});

goalsButton.addEventListener('click', function () {
    // Toggle the visibility of the display-goals element
    if (displayGoals.style.display === 'none') {
        displayGoals.style.display = 'block';
    } else {
        displayGoals.style.display = 'none';
    }
});
const calendarGrid = document.getElementById("calendar-grid");
    // Add a click event listener to the element
    insightsLink.addEventListener("click", function() {
       
    });
function displayGoalsList() {
    let goalListDiv = document.getElementById("goals-display-list");
    let goalsPopupDiv = document.getElementById("goals-popup");
    let dataGoalsDetailsList = document.getElementById("data-goals-details-list");

    goalListDiv.innerHTML = ""; // Clear existing content

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        if (key.startsWith("goal_")) {
            let goalData = JSON.parse(localStorage.getItem(key));

            let goalDiv = document.createElement("div");
            goalDiv.innerHTML =
                "<strong>Goal:</strong> " + goalData.goalName + "<br>" +
                "<strong>Status:</strong> " + goalData.goalStatus + "<br>" +"<br><br>";

            // Apply styles based on goal status
            if (goalData.goalStatus === "active") {
                goalDiv.style.color = "green"; 
                goalDiv.style.border = "1px solid #3D946E"; 
            } else if (goalData.goalStatus === "reached") {
                goalDiv.style.color = "red"; 
                goalDiv.style.border = "1px solid red";
            }

            goalDiv.addEventListener("click", function() {
                console.log("Goal clicked:", goalData);
                displayChildrenOfGoalsDatabase(goalData);

                // Make the goals-popup visible
                goalsPopupDiv.style.display = "block";

                // Populate data-goals-details-list with data from the database
                populateGoalsDetailsList(dataGoalsDetailsList, goalData);
            });

            goalListDiv.appendChild(goalDiv);
        }
    }
}

function displayChildrenOfGoalsDatabase(goalData) {
    console.log("Children of goals database for goal:", goalData);
    console.log("Child 1:", goalData.child1);
    console.log("Child 2:", goalData.child2);
    console.log("Child 2:", goalData.child3);
    // ...
}
function populateGoalsDetailsList(listElement, goalData) {
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

    // You can customize the content and structure based on your needs
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
        currentDate: formattedCurrentDate,
      
    };

    // Store the goal data in local storage
    localStorage.setItem(goalKey, JSON.stringify(goalData));

    // Refresh the goal list
    displayGoalsList();
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
    emailjs.send("service_6a8xgnp","template_1nbot8m", {
    "from_name": contactForm.name.value,
    "from_lname": contactForm.lname.value,
    "from_email": contactForm.emailaddress.value,
    "file": contactForm.file.value,
    "message": contactForm.message.value,
    })
    .then(
        function(response) {
            console.log("Email successfully sent", response);
        },
        function(error) {
            console.log("Email failed to send", error);
        }
    );
        return false;
    }

    

   

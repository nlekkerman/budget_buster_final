document.addEventListener("DOMContentLoaded", function () {
const homeButton = document.getElementById("homeButton");
const insightsButton = document.getElementById("nav-link-insights");
const aboutButton = document.getElementById("aboutButton");
const contactButton = document.getElementById("contactButton");


    const costBudgetInput = document.getElementById("cost-value-input");
    const budgetDisplay = document.getElementById("budget-display");
    const dataDisplayList = document.getElementById("data-display-list");
    const openExpensesScreen = document.getElementById('expense-section');
    const insinghstScreen = document.getElementById('insights-container');
    const contactScreen = document.getElementById('contact-wraper');
    const aboutScreen = document.getElementById('about-section-wraper');
    
    const dataTitle = document.getElementById("data-analytics-title");
    const calendar = document.getElementById("calendar");

    

const insightsButtonsContainer = document.getElementById('insights-buttons-container');
const insightsNavContainer = document.getElementById('insight-navigation-buttons');



/** NAvigation */

  
  // Add click event listeners to the buttons
  homeButton.addEventListener("click", function() {
    openExpensesScreen.style.display = 'block';
    aboutScreen.style.display = 'none';
    contactScreen.style.display = 'none'
    insinghstScreen.style.display = 'none';


  });
  
  insightsButton.addEventListener("click", function() {
    window.location.href = 'insights.html';

    // insinghstScreen.style.display = 'block';
    // openExpensesScreen.style.display = 'none';
    // aboutScreen.style.display = 'block';
    // contactScreen.style.display = 'none'



  });
  
  
  aboutButton.addEventListener("click", function() {
    aboutScreen.style.display = 'block';
    contactScreen.style.display = 'none'
    insinghstScreen.style.display = 'none';
    openExpensesScreen.style.display = 'none';
  });
  
  
  contactButton.addEventListener("click", function() {
   contactScreen.style.display = 'block'
   insinghstScreen.style.display = 'none';
   openExpensesScreen.style.display = 'none';
   aboutScreen.style.display = 'none';

  })






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
        budgetDisplay.textContent = `Remaining Budget: € ${formattedBudget}`;

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
        displayAnimationValue(plannedBudget, "green","+");

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


    /*display general data*/
    function displayAnalyticsData() {
        let savedData;
        const storageKey = "expense_tracker_DB";
        try {
            savedData = JSON.parse(localStorage.getItem(storageKey)) || [];
        } catch (error) {
            console.error("Error parsing existing data:", error);
            savedData = [];
        }
    
        dataDisplayList.innerHTML = "";
        const totalSpend = savedData.reduce((total, entry) => total + parseFloat(entry.expense_value), 0);
        const analyticsData = calculateAnalyticsData(savedData, totalSpend);
        displayAnalyticsList(analyticsData);
    }
    
    /*clear data list*/
    function clearDataDisplayList() {
        const dataDisplayList = document.getElementById("data-display-list");
        dataDisplayList.innerHTML = "";
    }

    function calculateAnalyticsData(data, totalSpend) {
        const categories = {};
        const types = {};
        const remainingBudget = initialBudget - totalSpend;

        data.forEach((entry) => {
            // Calculate percentage spent
            const percentage = (entry.expense_value / totalSpend) * 100;
    
            // Calculate remaining budget
    
            // Update category data
            if (!categories[entry.expense_category]) {
                categories[entry.expense_category] = {
                    total: 0,
                    percentage: 0,
                };
            }
            categories[entry.expense_category].total += entry.expense_value;
            categories[entry.expense_category].percentage = percentage;
    
            // Update type data
            if (!types[entry.expense_type]) {
                types[entry.expense_type] = {
                    total: 0,
                    percentage: 0,
                };
            }
            types[entry.expense_type].total += entry.expense_value;
            types[entry.expense_type].percentage = percentage;
        });
    
        return {
            categories,
            types,
            totalSpend,
            remainingBudget,
        };
    }
    
    function displayAnalyticsList(analyticsData) {
        const categories = analyticsData.categories;
        const types = analyticsData.types;
        const totalSpend = analyticsData.totalSpend;
        const remainingBudget = analyticsData.remainingBudget;
    
        // Display category data
        for (const category in categories) {
            const categoryData = categories[category];
            const categoryItem = document.createElement("li");
            categoryItem.classList.add("analytics-list-item"); // Add a class to the list item
            categoryItem.innerHTML = `<strong>${category}</strong>, 
                Total: <span style="color: ${categoryData.total >= 0 ? 'green' : 'red'};">${categoryData.total.toFixed(2)}</span>, 
                Percentage: <span style="color: ${categoryData.percentage >= 0 ? 'green' : 'red'};">${categoryData.percentage.toFixed(2)}%</span>`;
            dataDisplayList.appendChild(categoryItem);
        }
    
        // Display type data
        for (const type in types) {
            const typeData = types[type];
            const typeItem = document.createElement("li");
            typeItem.classList.add("analytics-list-item"); // Add a class to the list item
            typeItem.innerHTML = `<strong>${type}</strong>: 
                Total: <span style="color: ${typeData.total >= 0 ? 'green' : 'red'};">€${typeData.total.toFixed(2)}</span>, 
                Percentage: <span style="color: ${typeData.percentage >= 0 ? 'green' : 'red'};">${typeData.percentage.toFixed(2)}%</span>`;
            dataDisplayList.appendChild(typeItem);
        }
    
        // Display total spend and remaining budget
        const totalSpendItem = document.createElement("li");
        totalSpendItem.classList.add("analytics-list-item"); // Add a class to the list item
        totalSpendItem.innerHTML = `<strong>Total Spent:</strong> 
            <span style="color: ${totalSpend >= 0 ? 'green' : 'red'};">€${totalSpend.toFixed(2)}</span>`;
        dataDisplayList.appendChild(totalSpendItem);
    
        const remainingBudgetItem = document.createElement("li");
        remainingBudgetItem.classList.add("analytics-list-item"); 
        remainingBudgetItem.innerHTML = `<strong>Remaining Budget:</strong> 
            <span style="color: ${remainingBudget >= 0 ? 'green' : 'red'};">€${remainingBudget.toFixed(2)}</span>`;
        dataDisplayList.appendChild(remainingBudgetItem);
    }
      /**
     * code to get and display data for CATEGORIES of expense to get
     */
// Function to display analytics data for expense categories
// Modify the event listener for the button

// Function to calculate analytics data for expense categories
function calculateCategoryAnalyticsData(data) {
    const categories = {};
    const totalSpend = data.reduce((total, entry) => total + parseFloat(entry.expense_value), 0);
    const remainingBudget = initialBudget - totalSpend;

    data.forEach((entry) => {
        // Calculate percentage spent
        const percentage = (entry.expense_value / totalSpend) * 100;

        // Update category data
        if (!categories[entry.expense_category]) {
            categories[entry.expense_category] = {
                total: 0,
                percentage: 0,
            };
        }
        categories[entry.expense_category].total += entry.expense_value;
        categories[entry.expense_category].percentage = percentage;
    });

    return {
        categories,
        totalSpend,
        remainingBudget,
    };
}

// Function to display analytics data for expense categories
function displayCategoryAnalyticsList(categoryAnalyticsData) {
    const categories = categoryAnalyticsData.categories;
    const totalSpend = categoryAnalyticsData.totalSpend;
    const remainingBudget = categoryAnalyticsData.remainingBudget;

    // Display category data
    for (const category in categories) {
        const categoryData = categories[category];
        const categoryItem = document.createElement("li");
        categoryItem.classList.add("analytics-list-item");
        categoryItem.innerHTML = `<strong>${category}</strong>, 
            Total: <span style="color: ${categoryData.total >= 0 ? 'green' : 'red'};">€${categoryData.total.toFixed(2)}</span>, 
            Percentage: <span style="color: ${categoryData.percentage >= 0 ? 'green' : 'red'};">${categoryData.percentage.toFixed(2)}%</span>`;
        dataDisplayList.appendChild(categoryItem);
    }

    // Display total spend and remaining budget for categories
    const totalSpendItem = document.createElement("li");
    totalSpendItem.classList.add("analytics-list-item");
    totalSpendItem.innerHTML = `<strong>Total Spent:</strong> 
        <span style="color: ${totalSpend >= 0 ? 'green' : 'red'};">€${totalSpend.toFixed(2)}</span>`;
    dataDisplayList.appendChild(totalSpendItem);

    const remainingBudgetItem = document.createElement("li");
    remainingBudgetItem.classList.add("analytics-list-item");
    remainingBudgetItem.innerHTML = `<strong>Remaining Budget:</strong> 
        <span style="color: ${remainingBudget >= 0 ? 'green' : 'red'};">€${remainingBudget.toFixed(2)}</span>`;
    dataDisplayList.appendChild(remainingBudgetItem);
}


    /**
     * code to get and display data for TYPES of expense to get
     */
// Function to display analytics data for all expense types
function displayTypeAnalyticsList(typeAnalyticsData) {
    const types = typeAnalyticsData.types;
    const totalSpend = typeAnalyticsData.totalSpend;
    const remainingBudget = typeAnalyticsData.remainingBudget;

    // Assuming you have a dataDisplayList element
    const dataDisplayList = document.getElementById("data-display-list");
    dataDisplayList.innerHTML = ""; // Clear previous data

    // Display type data for all expense types
    for (const expenseType in types) {
        const typeData = types[expenseType];
        const typeItem = document.createElement("li");
        typeItem.classList.add("analytics-list-item");
        typeItem.innerHTML = `<strong>${expenseType}</strong>: 
            Total: <span style="color: ${typeData.total >= 0 ? 'green' : 'red'};">€${typeData.total.toFixed(2)}</span>, 
            Percentage: <span style="color: ${typeData.percentage >= 0 ? 'green' : 'red'};">${typeData.percentage.toFixed(2)}%</span>`;
        dataDisplayList.appendChild(typeItem);
    }

    // Display total spend and remaining budget for types
    const totalSpendItem = document.createElement("li");
    totalSpendItem.classList.add("analytics-list-item");
    totalSpendItem.innerHTML = `<strong>Total Spent:</strong> 
        <span style="color: ${totalSpend >= 0 ? 'green' : 'red'};">€${totalSpend.toFixed(2)}</span>`;
    dataDisplayList.appendChild(totalSpendItem);

    const remainingBudgetItem = document.createElement("li");
    remainingBudgetItem.classList.add("analytics-list-item");
    remainingBudgetItem.innerHTML = `<strong>Remaining Budget:</strong> 
        <span style="color: ${remainingBudget >= 0 ? 'green' : 'red'};">€${remainingBudget.toFixed(2)}</span>`;
    dataDisplayList.appendChild(remainingBudgetItem);
}

function toggleCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.style.display = (calendar.style.display === 'none') ? 'block' : 'none';
}


function calculateTypeAnalyticsData(data) {
    const types = {};
    const totalSpend = data.reduce((total, entry) => total + parseFloat(entry.expense_value), 0);
    const remainingBudget = initialBudget - totalSpend;

    data.forEach((entry) => {
        // Calculate percentage spent
        const percentage = (entry.expense_value / totalSpend) * 100;

        // Update type data
        if (!types[entry.expense_type]) {
            types[entry.expense_type] = {
                total: 0,
                percentage: 0,
            };
        }
        types[entry.expense_type].total += entry.expense_value;
        types[entry.expense_type].percentage = percentage;
    });

    return {
        types,
        totalSpend,
        remainingBudget,
    };
}




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

    

   

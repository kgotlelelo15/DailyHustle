document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', function() {
        const categoryName = this.getAttribute('data-category');
        displayTasks(categoryName);
    });
});

function displayTasks(category) {
    const categoryTitle = document.getElementById('category-title');
    categoryTitle.textContent = category;
}

document.getElementById('add-task').addEventListener('click', function() {
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    if (taskInput.value.trim() !== "") {
        const newTask = document.createElement('li');
        newTask.textContent = taskInput.value;

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = function() {
            taskList.removeChild(newTask);
        };

        newTask.appendChild(removeBtn);
        taskList.appendChild(newTask);
        taskInput.value = ""; // Clear the input field
    }
});

// Reminder functionality
document.getElementById('set-reminder').addEventListener('click', function() {
    const reminderDate = document.getElementById('reminder-date').value;
    const reminderInput = document.getElementById('reminder-input').value;
    const reminderList = document.getElementById('reminder-list');

    if (reminderInput.trim() !== "" && reminderDate) {
        const newReminder = document.createElement('li');
        newReminder.textContent = `${reminderDate}: ${reminderInput}`;

        // Create remove button for reminders
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = function() {
            reminderList.removeChild(newReminder);
        };

        newReminder.appendChild(removeBtn);
        reminderList.appendChild(newReminder);
        //document.getElementById('reminder-input').value = ""; // Clear the input field
        //document.getElementById('reminder-date').value = ""; // Clear the date input
    }
});

// Toggle theme selector visibility
document.getElementById('theme-icon').addEventListener('click', function() {
    const themeSelector = document.getElementById('theme-selector');
    themeSelector.style.display = themeSelector.style.display === 'block' ? 'none' : 'block';
});

// Theme selector functionality
document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', function() {
        const selectedTheme = this.getAttribute('data-theme');
        document.body.className = selectedTheme; // Apply selected theme

        const sidebar = document.querySelector('.sidebar');
        const main = document.querySelector('main');

        // Apply background image for sidebar and main content
        sidebar.style.backgroundImage = `url(images/${selectedTheme}.jpg)`;
        main.style.backgroundImage = `url(images/${selectedTheme}.jpg)`;

        // Hide the theme selector after selection
        document.getElementById('theme-selector').style.display = 'none';
    });
});

// New list button functionality (optional)
document.getElementById('new-list').addEventListener('click', function() {
    alert('New list functionality not implemented yet!');
});
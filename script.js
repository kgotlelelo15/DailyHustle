(function () {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    let customBackMessage = localStorage.getItem('customMotivationMessage') || '';

    let currentUser = localStorage.getItem('loggedUser');
    if (currentUser) {
        if (!tasks[currentUser]) {
            tasks[currentUser] = {
                "My Day": [],
                "Important": [],
                "Planned": [],
                "Tasks": [],
                "Goals": []
            };
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    const authModal = document.getElementById('auth-modal');
    const logoutBtn = document.getElementById('logout-btn'); // Get the logout button
    const categoryTitle = document.getElementById('category-title');
    const taskList = document.getElementById('task-list');
    const searchBar = document.getElementById('search-bar');
    const reminderScheduleElement = document.getElementById('reminder-schedule');
    const motivationCard = document.getElementById('motivation-card');
    const motivationBack = motivationCard.querySelector('.back');

    // New elements for task-specific motivation
    const motivationToggle = document.getElementById('motivation-toggle');
    const taskMotivationInput = document.getElementById('task-motivation-input');
    const taskMotivationDisplay = document.getElementById('task-motivation-display');
    const currentTaskMotivationElement = document.getElementById('current-task-motivation');

     // New elements for category-specific motivation
     const categoryMotivationToggle = document.getElementById('category-motivation-toggle');
     const categoryMotivationInput = document.getElementById('category-motivation-input');
     const categoryMotivationDisplay = document.getElementById('category-motivation-display');
     const currentCategoryMotivationElement = document.getElementById('current-category-motivation');


    let currentCategory = "My Day";
    let selectedTaskElement = null; // Track the currently selected task list item


    // Show the login modal if no user is logged in
    if (!currentUser) {
        authModal.style.display = 'flex';
        logoutBtn.style.display = 'none'; // Hide logout if not logged in
    } else {
        logoutBtn.style.display = 'block'; // Show the logout button if logged in
    }

    // Set the minimum date for reminders to today
    const today = new Date();
    document.getElementById('task-reminder-date').setAttribute('min', today.toISOString().split('T')[0]);

    function renderTasks(category, filter = "") {
        taskList.innerHTML = "";
        currentCategory = category;

        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.toggle('active', item.dataset.category === category);
        });

        categoryTitle.textContent = category;

        // Check if currentUser and tasks[currentUser] are defined before accessing category
        const userTasksForCategory = (currentUser && tasks[currentUser] && tasks[currentUser][category]) ? tasks[currentUser][category] : [];

        const filteredTasks = userTasksForCategory.filter(task =>
            task.text.toLowerCase().includes(filter.toLowerCase())
        );

        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.setAttribute('tabindex', '0');
            taskItem.dataset.category = category; // Store category
            taskItem.dataset.index = index; // Store index

            const importanceCheckbox = document.createElement('input');
            importanceCheckbox.type = 'checkbox';
            importanceCheckbox.checked = task.important || false;
            importanceCheckbox.setAttribute('aria-label', 'Mark task as important');
            importanceCheckbox.onclick = function (e) { // Use onclick here to prevent list item click
                e.stopPropagation();
                if (!currentUser) { // Prevent action if not logged in
                    importanceCheckbox.checked = !importanceCheckbox.checked; // Revert checkbox state
                    alert("Please log in to mark tasks as important.");
                    return;
                }
                task.important = importanceCheckbox.checked;

                if (task.important) {
                    if (!tasks[currentUser]["Important"]) {
                         tasks[currentUser]["Important"] = [];
                    }
                     // Check if the task is already in Important before adding to avoid duplicates
                     const isAlreadyImportant = tasks[currentUser]["Important"].some(t => t.text === task.text && t.reminderDate === task.reminderDate && t.reminderTime === task.reminderTime && t.motivation === task.motivation);
                     if (!isAlreadyImportant) {
                         tasks[currentUser]["Important"].push(task);
                     }
                    // Remove from the current category
                    tasks[currentUser][currentCategory] = tasks[currentUser][currentCategory].filter((_, i) => i !== index);

                } else {
                     if (tasks[currentUser]["Important"]) {
                        tasks[currentUser]["Important"] = tasks[currentUser]["Important"].filter(t => !(t.text === task.text && t.reminderDate === task.reminderDate && t.reminderTime === task.reminderTime && t.motivation === task.motivation));
                     }
                }

                saveTasks();
                renderTasks(currentCategory, searchBar.value);
                renderReminderSchedule();
                 // If the selected task was moved, clear the motivation display
                 if (selectedTaskElement && selectedTaskElement.dataset.category === category && parseInt(selectedTaskElement.dataset.index) === index) {
                     clearTaskMotivationDisplay();
                 }
            };


            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed || false;
            checkbox.setAttribute('aria-label', 'Mark task as completed');
            checkbox.onclick = function (e) { // Use onclick here to prevent list item click
                e.stopPropagation();
                 if (!currentUser) { // Prevent action if not logged in
                     checkbox.checked = !checkbox.checked; // Revert checkbox state
                     alert("Please log in to mark tasks as completed.");
                     return;
                 }
                task.completed = checkbox.checked;
                taskItem.classList.toggle('completed', task.completed);
                saveTasks();
            };

            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;

            const reminderIcon = document.createElement('i');
            reminderIcon.className = 'fas fa-bell reminder-icon';
            reminderIcon.setAttribute('aria-label', 'Task reminder');
            if (task.reminderDate || task.reminderTime || task.reminderText) {
                reminderIcon.title = `(Reminder: ${task.reminderDate || ''} ${task.reminderTime || ''})`;
            } else {
                reminderIcon.classList.add('hidden');
            }

            reminderIcon.onclick = function (e) { // Use onclick here to prevent list item click
                e.stopPropagation();
                 if (!currentUser) { // Prevent action if not logged in
                     alert("Please log in to manage reminders.");
                     return;
                 }
                // Populate reminder inputs with task details for editing
                document.getElementById('task-reminder-date').value = task.reminderDate || '';
                document.getElementById('task-reminder-time').value = task.reminderTime || '';
                document.getElementById('task-reminder-input').value = task.reminderText || '';
                document.getElementById('reminder-settings').style.display = 'flex';
                 // You might want to pre-fill the task input as well for editing
                 // document.getElementById('task-input').value = task.text;
            };

            // Click handler for the task list item to select it
            taskItem.onclick = function () {
                 if (!currentUser) { // Prevent action if not logged in
                     alert("Please log in to select tasks.");
                     return;
                 }
                // Deselect previous item
                if (selectedTaskElement) {
                    selectedTaskElement.classList.remove('active');
                }
                // Select current item
                taskItem.classList.add('active');
                selectedTaskElement = taskItem;

                // Display the motivation for the selected task
                displayTaskMotivation(task);
            };

            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="fas fa-edit"></i>'; // Use icon
            editBtn.className = 'edit-btn';
            editBtn.setAttribute('aria-label', 'Edit task');
            editBtn.onclick = function (e) { // Use onclick here to prevent list item click
                e.stopPropagation();
                 if (!currentUser) { // Prevent action if not logged in
                     alert("Please log in to edit tasks.");
                     return;
                 }
                const editedTaskText = prompt("Edit task:", task.text);
                if (editedTaskText !== null && editedTaskText.trim() !== "") {
                    tasks[currentUser][category][index].text = editedTaskText.trim();
                    saveTasks();
                    renderTasks(category, filter);
                    renderReminderSchedule(); // Update schedule if task text changes
                     // If the selected task was edited, update the motivation display
                     if (selectedTaskElement && selectedTaskElement.dataset.category === category && parseInt(selectedTaskElement.dataset.index) === index) {
                         displayTaskMotivation(tasks[currentUser][category][index]);
                     }
                }
            };

            const removeBtn = document.createElement('button');
             removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Use icon
            removeBtn.className = 'remove-btn';
            removeBtn.setAttribute('aria-label', 'Remove task');
            removeBtn.onclick = function (e) { // Use onclick here to prevent list item click
                e.stopPropagation();
                 if (!currentUser) { // Prevent action if not logged in
                     alert("Please log in to remove tasks.");
                     return;
                 }
                const taskToRemove = tasks[currentUser][category][index];
                // Remove the task from the current category
                tasks[currentUser][category].splice(index, 1);
                // Also remove from "Important" if it was there
                if (tasks[currentUser]["Important"]) {
                     tasks[currentUser]["Important"] = tasks[currentUser]["Important"].filter(t => !(t.text === taskToRemove.text && t.reminderDate === taskToRemove.reminderDate && t.reminderTime === taskToRemove.reminderTime && t.motivation === taskToRemove.motivation)); // Filter by all properties to be safe
                }

                saveTasks();
                renderTasks(category, filter);
                renderReminderSchedule(); // Update schedule after removal
                 // If the selected task was removed, clear the motivation display
                 if (selectedTaskElement && selectedTaskElement.dataset.category === category && parseInt(selectedTaskElement.dataset.index) === index) {
                     clearTaskMotivationDisplay();
                 }
            };

            taskItem.appendChild(importanceCheckbox);
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(reminderIcon);
            taskItem.appendChild(editBtn);
            taskItem.appendChild(removeBtn);
            taskList.appendChild(taskItem);
        });
         // Clear motivation display if no tasks are rendered
         if (filteredTasks.length === 0) {
             clearTaskMotivationDisplay();
         }
         displayCategoryMotivation(currentCategory); // Display category motivation when rendering tasks
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

     function saveCustomBackMessage() {
        localStorage.setItem('customMotivationMessage', customBackMessage);
    }

    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.onclick = function () {
             if (!currentUser) { // Prevent action if not logged in
                 alert("Please log in to view categories.");
                 return;
             }
            renderTasks(item.dataset.category, searchBar.value);
            // No need to re-render schedule when changing task category view
        };
    });

    // Login functionality
    document.getElementById('login-btn').onclick = function () {
        const username = document.getElementById('username-login').value.trim();
        const password = document.getElementById('password-login').value;

        if (users[username] && users[username].password === password) {
            localStorage.setItem('loggedUser', username);
            currentUser = username; // Update currentUser variable
            authModal.style.display = 'none';
            logoutBtn.style.display = 'block'; // Show logout button
            // Initialize tasks for the new user if they don't exist
             if (!tasks[currentUser]) {
                tasks[currentUser] = {
                    "My Day": [],
                    "Important": [],
                    "Planned": [],
                    "Tasks": [],
                    "Goals": []
                };
                saveTasks(); // Save the initialized tasks
            }
            renderTasks("My Day");
            renderReminderSchedule(); // Render schedule on login
            updateMotivationCard(); // Update general motivation card
            clearTaskMotivationDisplay(); // Clear task motivation display on login
        } else {
            alert('Invalid username or password.');
        }
    };

    // Logout functionality
    logoutBtn.onclick = function() {
        localStorage.removeItem('loggedUser');
        currentUser = null;
        tasks = JSON.parse(localStorage.getItem('tasks')) || {}; // Reload tasks (should be empty for logged out user)
        renderTasks("My Day"); // Render with no tasks
        renderReminderSchedule(); // Clear schedule display
        clearTaskMotivationDisplay(); // Clear task motivation display
        clearCategoryMotivationDisplay(); // Clear category motivation display
        logoutBtn.style.display = 'none'; // Hide logout button
        authModal.style.display = 'flex'; // Show login modal
    };


    // Registration functionality
    document.getElementById('register-btn').onclick = function () {
        const username = document.getElementById('username-register').value.trim();
        const email = document.getElementById('email-register').value.trim();
        const phone = document.getElementById('phone-register').value.trim();
        const password = document.getElementById('password-register').value;

        if (username && email && phone && password) {
            if (!users[username]) {
                users[username] = { password: password, email: email, phone: phone };
                localStorage.setItem('users', JSON.stringify(users));
                alert('Registration successful! Please log in.');
                showLoginForm();
            } else {
                alert('Username already exists.');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    // Reset password functionality
    document.getElementById('reset-btn').onclick = function () {
        const email = document.getElementById('email-reset').value.trim();
        const phone = document.getElementById('phone-reset').value.trim();

        const user = Object.values(users).find(u => u.email === email && u.phone === phone);
        if (user) {
            alert('Password reset link sent to your email.');
            showLoginForm();
        } else {
            alert('No user found with provided email and phone.');
        }
    };

    function showLoginForm() {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('reset-form').style.display = 'none';
    }

    // Switch forms
    function showRegisterForm() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
        document.getElementById('reset-form').style.display = 'none';
    }

    function showResetForm() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('reset-form').style.display = 'block';
    }

    document.getElementById('show-register').onclick = showRegisterForm;
    document.getElementById('show-login').onclick = showLoginForm;
    document.getElementById('show-reset').onclick = showResetForm;
    document.getElementById('show-login-from-reset').onclick = showLoginForm;

    // Adding tasks
    document.getElementById('add-task').onclick = function () {
         if (!currentUser) { // Prevent action if not logged in
             alert("Please log in to add tasks.");
             return;
         }

        const taskInput = document.getElementById('task-input');
        const reminderDate = document.getElementById('task-reminder-date').value;
        const reminderTime = document.getElementById('task-reminder-time').value;
        const reminderText = document.getElementById('task-reminder-input').value.trim();
        const taskMotivation = document.getElementById('task-motivation-input').value.trim(); // Get motivation message

        const text = taskInput.value.trim();
        if (text === "") {
            alert("Please enter a task.");
            return;
        }


         if (!tasks[currentUser]) {
            tasks[currentUser] = {
                "My Day": [],
                "Important": [],
                "Planned": [],
                "Tasks": [],
                "Goals": []
            };
            saveTasks();
        }
         if (!tasks[currentUser][currentCategory]) {
             tasks[currentUser][currentCategory] = [];
             saveTasks();
         }


        tasks[currentUser][currentCategory].push({
            text: text,
            completed: false,
            important: false,
            reminderDate: reminderDate || null,
            reminderTime: reminderTime || null,
            reminderText: reminderText || null,
            motivation: taskMotivation || null // Store task-specific motivation
        });

        saveTasks();
        renderTasks(currentCategory, searchBar.value);
        renderReminderSchedule(); // Update schedule after adding a task

        taskInput.value = "";
        document.getElementById('reminder-settings').style.display = 'none';
        document.getElementById('task-reminder-date').value = "";
        document.getElementById('task-reminder-time').value = "";
        document.getElementById('task-reminder-input').value = "";
        taskMotivationInput.value = ""; // Clear motivation input
        taskMotivationInput.style.display = 'none'; // Hide motivation input
        motivationToggle.classList.remove('active'); // Deselect motivation toggle
    };

    // Search tasks
    searchBar.oninput = function () {
         if (!currentUser) { // Prevent action if not logged in
             searchBar.value = ""; // Clear input if not logged in
             alert("Please log in to search tasks.");
             return;
         }
        renderTasks(currentCategory, searchBar.value);
    };

    // Reminder settings toggle
    document.getElementById('reminder-toggle').onclick = function () {
         if (!currentUser) { // Prevent action if not logged in
             alert("Please log in to manage reminders.");
             return;
         }
        const reminderSettings = document.getElementById('reminder-settings');
        reminderSettings.style.display = reminderSettings.style.display === 'none' ? 'flex' : 'none';
        document.getElementById('reminder-toggle').classList.toggle('active'); // Add active class for styling
    };

    // Motivation input toggle (New)
    motivationToggle.onclick = function () {
         if (!currentUser) { // Prevent action if not logged in
             alert("Please log in to add motivation.");
             return;
         }
        taskMotivationInput.style.display = taskMotivationInput.style.display === 'none' ? 'block' : 'none';
        motivationToggle.classList.toggle('active'); // Add active class for styling
        if (taskMotivationInput.style.display !== 'none' && selectedTaskElement) {
            // If a task is selected, pre-fill the motivation input
            const category = selectedTaskElement.dataset.category;
            const index = parseInt(selectedTaskElement.dataset.index);
            const task = tasks[currentUser][category][index];
            taskMotivationInput.value = task.motivation || '';
        } else if (taskMotivationInput.style.display === 'none') {
            taskMotivationInput.value = ''; // Clear input when hidden
        }
    };

     // Category Motivation input toggle (New)
     categoryMotivationToggle.onclick = function () {
         if (!currentUser) { // Prevent action if not logged in
             alert("Please log in to add category motivation.");
             return;
         }
         categoryMotivationInput.style.display = categoryMotivationInput.style.display === 'none' ? 'block' : 'none';
         categoryMotivationToggle.classList.toggle('active'); // Add active class for styling
         if (categoryMotivationInput.style.display !== 'none') {
             // Pre-fill the category motivation input
             categoryMotivationInput.value = (tasks[currentUser] && tasks[currentUser][currentCategory] && tasks[currentUser][currentCategory].motivation) || '';
         } else {
             categoryMotivationInput.value = ''; // Clear input when hidden
         }
     };

    // Theme toggle
    const themeIcon = document.getElementById('theme-icon');
    themeIcon.onclick = function () {
        document.body.classList.toggle('dark-theme');
    };

    // Color picker
    document.getElementById('color-picker').onclick = function () {
         if (!currentUser) { // Prevent action if not logged in
             alert("Please log in to change colors.");
             return;
         }
        const color = prompt("Enter a color name or hex code:", "#4CAF50");
        if (color) {
            document.body.style.backgroundColor = color;
            // You might want to apply this color to other elements as well
        }
    };

     // Update the general motivation card's back message
     function updateMotivationCard() {
        motivationBack.textContent = customBackMessage;
    }

    // Flipping general motivation card
    motivationCard.onclick = function (event) {
         if (!currentUser) { // Prevent action if not logged in
             alert("Please log in to interact with the motivation card.");
             return;
         }
         // Prevent flipping if the click is on an interactive element inside (though none exist on the front now)
         if (event.target === this || event.target.closest('.card-content')) {
            this.classList.toggle('flipped');

            // Only prompt for message when flipping to the back
            if (this.classList.contains('flipped')) {
                setTimeout(() => {
                     let newBackMessage = prompt("Enter a message for the back side:", customBackMessage);
                     if (newBackMessage !== null) {
                         customBackMessage = newBackMessage;
                         motivationBack.textContent = customBackMessage;
                         saveCustomBackMessage();
                     }
                }, 300);
            }
         }
    };


    // Reminder Schedule Rendering
    function renderReminderSchedule() {
        reminderScheduleElement.innerHTML = "";
        if (!currentUser || !tasks[currentUser]) {
            reminderScheduleElement.textContent = "Log in to see your schedule.";
            return;
        }

        const allReminderTasks = [];
        // Collect all tasks with reminders from all categories
        for (const category in tasks[currentUser]) {
            if (tasks[currentUser].hasOwnProperty(category)) {
                tasks[currentUser][category].forEach((task, index) => { // Include index
                    if (task.reminderDate || task.reminderTime) {
                         // Store original category and index
                        allReminderTasks.push({...task, originalCategory: category, originalIndex: index});
                    }
                });
            }
        }

        // Sort tasks by date and then time
        allReminderTasks.sort((a, b) => {
            const dateComparison = new Date(a.reminderDate) - new Date(b.reminderDate);
            if (dateComparison !== 0) {
                return dateComparison;
            }
            const timeA = a.reminderTime || '00:00';
            const timeB = b.reminderTime || '00:00';
            return timeA.localeCompare(timeB);
        });


        if (allReminderTasks.length === 0) {
            reminderScheduleElement.textContent = "No tasks with reminders scheduled.";
            return;
        }

        allReminderTasks.forEach((task) => { // Removed index here as we use originalIndex
            const scheduleItem = document.createElement('div');
            scheduleItem.className = "reminder-schedule-item";

            const taskInfo = document.createElement('div');
            taskInfo.className = "task-info";
            const taskTextElement = document.createElement('strong');
            taskTextElement.textContent = task.text;
            taskInfo.appendChild(taskTextElement);

            const dateTimeElement = document.createElement('span');
            let dateTimeString = "";
            if (task.reminderDate) {
                const date = new Date(task.reminderDate + 'T00:00:00');
                dateTimeString += date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            }
            if (task.reminderTime) {
                if (dateTimeString) dateTimeString += " at ";
                dateTimeString += task.reminderTime;
            }
             if (task.reminderText) {
                 if (dateTimeString) dateTimeString += " - ";
                 dateTimeString += task.reminderText;
             }
            dateTimeElement.textContent = dateTimeString || "No date/time set";

            taskInfo.appendChild(dateTimeElement);
            scheduleItem.appendChild(taskInfo);

            const actions = document.createElement('div');
            actions.className = "reminder-schedule-actions";

            const rescheduleBtn = document.createElement('button');
            rescheduleBtn.innerHTML = '<i class="fas fa-edit"></i>';
            rescheduleBtn.title = "Reschedule Reminder";
            rescheduleBtn.onclick = function() {
                 if (!currentUser) { // Prevent action if not logged in
                     alert("Please log in to reschedule reminders.");
                     return;
                 }
                // Prompt user for new date and time
                const newDate = prompt("Enter new date (YYYY-MM-DD):", task.reminderDate || '');
                if (newDate === null) return; // User cancelled

                const newTime = prompt("Enter new time (HH:MM):", task.reminderTime || '');
                 if (newTime === null) return; // User cancelled

                // Find the original task object to update using originalCategory and originalIndex
                const originalCategory = task.originalCategory;
                const originalIndex = task.originalIndex;

                if (tasks[currentUser] && tasks[currentUser][originalCategory] && tasks[currentUser][originalCategory][originalIndex]) {
                    tasks[currentUser][originalCategory][originalIndex].reminderDate = newDate || null;
                    tasks[currentUser][originalCategory][originalIndex].reminderTime = newTime || null;
                    saveTasks();
                    renderReminderSchedule();
                    renderTasks(currentCategory, searchBar.value);
                } else {
                    console.error("Could not find original task to reschedule by index. Falling back to search.");
                    // Fallback: Iterate through all tasks to find it if index is unreliable
                     let found = false;
                     for (const cat in tasks[currentUser]) {
                         if (tasks[currentUser].hasOwnProperty(cat)) {
                             const taskToUpdate = tasks[currentUser][cat].find(t => t.text === task.text && t.reminderDate === task.reminderDate && t.reminderTime === task.reminderTime && t.motivation === task.motivation);
                             if (taskToUpdate) {
                                 taskToUpdate.reminderDate = newDate || null;
                                 taskToUpdate.reminderTime = newTime || null;
                                 saveTasks();
                                 renderReminderSchedule();
                                 renderTasks(currentCategory, searchBar.value);
                                 found = true;
                                 break;
                             }
                         }
                     }
                     if (!found) {
                         alert("Error: Could not reschedule task.");
                     }
                }
            };
            actions.appendChild(rescheduleBtn);

            const removeReminderBtn = document.createElement('button');
            removeReminderBtn.innerHTML = '<i class="fas fa-times-circle"></i>';
            removeReminderBtn.title = "Remove Reminder";
            removeReminderBtn.onclick = function() {
                 if (!currentUser) { // Prevent action if not logged in
                     alert("Please log in to remove reminders.");
                     return;
                 }
                 const confirmation = confirm("Remove reminder for this task?");
                 if (confirmation) {
                     const originalCategory = task.originalCategory;
                     const originalIndex = task.originalIndex;

                     if (tasks[currentUser] && tasks[currentUser][originalCategory] && tasks[currentUser][originalCategory][originalIndex]) {
                         tasks[currentUser][originalCategory][originalIndex].reminderDate = null;
                         tasks[currentUser][originalCategory][originalIndex].reminderTime = null;
                         tasks[currentUser][originalCategory][originalIndex].reminderText = null;
                         saveTasks();
                         renderReminderSchedule();
                         renderTasks(currentCategory, searchBar.value);
                     } else {
                         console.error("Could not find original task to remove reminder by index. Falling back to search.");
                          // Fallback search
                          for (const cat in tasks[currentUser]) {
                              if (tasks[currentUser].hasOwnProperty(cat)) {
                                  const taskToUpdate = tasks[currentUser][cat].find(t => t.text === task.text && t.reminderDate === task.reminderDate && t.reminderTime === task.reminderTime && t.motivation === task.motivation);
                                  if (taskToUpdate) {
                                      taskToUpdate.reminderDate = null;
                                      taskToUpdate.reminderTime = null;
                                       taskToUpdate.reminderText = null;
                                      saveTasks();
                                      renderReminderSchedule();
                                      renderTasks(currentCategory, searchBar.value);
                                      break;
                                  }
                              }
                          }
                     }
                 }
            };
             actions.appendChild(removeReminderBtn);


            scheduleItem.appendChild(actions);
            reminderScheduleElement.appendChild(scheduleItem);
        });
    }


    // Toggle schedule visibility
    document.getElementById('schedule-toggle').onclick = function() {
         if (!currentUser) { // Prevent action if not logged in
             alert("Please log in to view the reminder schedule.");
             return;
         }
        const schedule = document.getElementById('reminder-schedule');
        schedule.style.display = schedule.style.display === 'none' ? 'flex' : 'none'; // Use flex for column layout
        if (schedule.style.display !== 'none') {
            renderReminderSchedule(); // Render the schedule when it's shown
        }
    };

    // Function to display task-specific motivation
    function displayTaskMotivation(task) {
        taskMotivationDisplay.style.display = 'block'; // Show the display section
        if (task.motivation && task.motivation.trim() !== "") {
            currentTaskMotivationElement.textContent = task.motivation;
        } else {
            currentTaskMotivationElement.textContent = "No motivation message set for this task.";
        }
         // Pre-fill the motivation input if it's visible
         if (taskMotivationInput.style.display !== 'none') {
              taskMotivationInput.value = task.motivation || '';
         }
    }

    // Function to clear the task-specific motivation display
    function clearTaskMotivationDisplay() {
        taskMotivationDisplay.style.display = 'none';
        currentTaskMotivationElement.textContent = "Select a task to see its motivation.";
        selectedTaskElement = null; // Clear selected task
        // Clear and hide the motivation input if it was visible
        taskMotivationInput.value = '';
        taskMotivationInput.style.display = 'none';
        motivationToggle.classList.remove('active');
    }

     // Function to display category-specific motivation (New)
     function displayCategoryMotivation(category) {
         categoryMotivationDisplay.style.display = 'block'; // Show the display section
         const categoryData = tasks[currentUser] && tasks[currentUser][category];
         if (categoryData && categoryData.motivation && categoryData.motivation.trim() !== "") {
             currentCategoryMotivationElement.textContent = categoryData.motivation;
         } else {
             currentCategoryMotivationElement.textContent = `No motivation message set for the "${category}" category.`;
         }
         // Pre-fill the motivation input if it's visible
         if (categoryMotivationInput.style.display !== 'none') {
             categoryMotivationInput.value = (categoryData && categoryData.motivation) || '';
         }
     }

     // Function to clear the category-specific motivation display (New)
     function clearCategoryMotivationDisplay() {
         categoryMotivationDisplay.style.display = 'none';
         currentCategoryMotivationElement.textContent = "Select a category to see its motivation.";
         // Clear and hide the motivation input if it was visible
         categoryMotivationInput.value = '';
         categoryMotivationInput.style.display = 'none';
         categoryMotivationToggle.classList.remove('active');
     }


    // Initial render based on logged-in user
    renderTasks(currentCategory);
    if (currentUser) {
        renderReminderSchedule(); // Only render schedule if logged in
        updateMotivationCard(); // Initial setup of the general motivation card
        displayCategoryMotivation(currentCategory); // Display initial category motivation
    } else {
        clearTaskMotivationDisplay(); // Ensure task motivation display is hidden initially
        clearCategoryMotivationDisplay(); // Ensure category motivation display is hidden initially
    }


})();